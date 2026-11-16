import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { LAMP_JOINTS, PENDULUM_BONE, type PendulumSettings } from '../../../config/lamp'
import useLampCollisions, { type CollisionState } from './useLampCollisions'

const LOCAL_DOWN = new THREE.Vector3(0, 1, 0)
const WORLD_DOWN = new THREE.Vector3(0, -1, 0)

function fitAngleToLimits(angle: number, min: number, max: number, current: number) {
  const candidates = [angle - Math.PI * 2, angle, angle + Math.PI * 2]
    .filter((candidate) => candidate >= min && candidate <= max)
  if (!candidates.length) return THREE.MathUtils.clamp(angle, min, max)
  return candidates.reduce((closest, candidate) =>
    Math.abs(candidate - current) < Math.abs(closest - current) ? candidate : closest
  )
}

function getJointAngle(
  quaternion: THREE.Quaternion,
  rest: THREE.Quaternion,
  axis: 'x' | 'y' | 'z',
  reference: number,
) {
  const relative = rest.clone().invert().multiply(quaternion)
  const component = axis === 'x' ? relative.x : axis === 'y' ? relative.y : relative.z
  const angle = THREE.MathUtils.radToDeg(2 * Math.atan2(component, relative.w))
  return [angle - 360, angle, angle + 360].reduce((closest, candidate) =>
    Math.abs(candidate - reference) < Math.abs(closest - reference) ? candidate : closest
  )
}

function collisionWorsened(previous: CollisionState, next: CollisionState) {
  return [...next].some((pair) => !previous.has(pair))
}

export default function useLampRigAnimation(
  scene: THREE.Object3D,
  power: boolean,
  jointValues: Record<string, number>,
  pendulum: PendulumSettings,
  selectedJoint: string | null,
  onJointConstrain: (bone: string, value: number) => void,
) {
  const powerLevel = useRef(0)
  const loopedAngles = useRef<Record<string, number>>({})
  const pendulumAngle = useRef(0)
  const pendulumVelocity = useRef(0)
  const restRotations = useMemo(() => new Map(
    LAMP_JOINTS.map((joint) => [joint.bone, scene.getObjectByName(joint.bone)?.quaternion.clone()]),
  ), [scene])
  const axis = useMemo(() => new THREE.Vector3(), [])
  const offset = useMemo(() => new THREE.Quaternion(), [])
  const target = useMemo(() => new THREE.Quaternion(), [])
  const parentWorld = useMemo(() => new THREE.Quaternion(), [])
  const baseWorld = useMemo(() => new THREE.Quaternion(), [])
  const worldAxis = useMemo(() => new THREE.Vector3(), [])
  const baseDown = useMemo(() => new THREE.Vector3(), [])
  const projectedDown = useMemo(() => new THREE.Vector3(), [])
  const cross = useMemo(() => new THREE.Vector3(), [])
  const previousRotations = useMemo(() => new Map(
    LAMP_JOINTS.map((joint) => [joint.bone, new THREE.Quaternion()]),
  ), [])
  const getCollisions = useLampCollisions(scene)

  useFrame((_, frameDelta) => {
    const delta = Math.min(frameDelta, 0.05)
    powerLevel.current = THREE.MathUtils.damp(powerLevel.current, power ? 1 : 0, 6, delta)
    const previousCollisions = getCollisions()

    LAMP_JOINTS.forEach((constraint) => {
      const joint = scene.getObjectByName(constraint.bone)
      if (joint && !constraint.passive) previousRotations.get(constraint.bone)?.copy(joint.quaternion)
    })

    LAMP_JOINTS.forEach((constraint) => {
      const joint = scene.getObjectByName(constraint.bone)
      const rest = restRotations.get(constraint.bone)
      if (!joint || !rest || constraint.passive) return

      let value = constraint.drivenByPower
        ? (power ? constraint.max : constraint.min)
        : (jointValues[constraint.bone] ?? constraint.initial)
      if (!constraint.isLooping) value = THREE.MathUtils.clamp(value, constraint.min, constraint.max)
      if (constraint.isLooping) {
        value = THREE.MathUtils.damp(loopedAngles.current[constraint.bone] ?? constraint.initial, value, 10, delta)
        loopedAngles.current[constraint.bone] = value
      }

      axis.set(constraint.axis === 'x' ? 1 : 0, constraint.axis === 'y' ? 1 : 0, constraint.axis === 'z' ? 1 : 0)
      offset.setFromAxisAngle(axis, THREE.MathUtils.degToRad(value))
      target.copy(rest).multiply(offset)
      if (constraint.isLooping) joint.quaternion.copy(target)
      else joint.quaternion.slerp(target, 1 - Math.exp(-10 * delta))
    })

    scene.updateMatrixWorld(true)
    if (collisionWorsened(previousCollisions, getCollisions())) {
      LAMP_JOINTS.forEach((constraint) => {
        const joint = scene.getObjectByName(constraint.bone)
        const previous = previousRotations.get(constraint.bone)
        if (joint && previous && !constraint.passive) joint.quaternion.copy(previous)
      })
      scene.updateMatrixWorld(true)

      const constraint = LAMP_JOINTS.find((joint) => joint.bone === selectedJoint)
      const joint = selectedJoint ? scene.getObjectByName(selectedJoint) : null
      const rest = selectedJoint ? restRotations.get(selectedJoint) : null
      if (constraint && joint && rest) {
        onJointConstrain(
          selectedJoint,
          getJointAngle(joint.quaternion, rest, constraint.axis, jointValues[selectedJoint]),
        )
      }
    }

    const constraint = LAMP_JOINTS.find((joint) => joint.bone === PENDULUM_BONE)
    const joint = scene.getObjectByName(PENDULUM_BONE)
    const rest = restRotations.get(PENDULUM_BONE)
    if (constraint && joint && joint.parent && rest) {
      const previousPendulumCollisions = getCollisions()
      const previousPendulumRotation = joint.quaternion.clone()
      const previousPendulumAngle = pendulumAngle.current
      joint.parent.getWorldQuaternion(parentWorld)
      baseWorld.copy(parentWorld).multiply(rest)
      worldAxis.set(1, 0, 0).applyQuaternion(baseWorld).normalize()
      baseDown.copy(LOCAL_DOWN).applyQuaternion(baseWorld).normalize()
      projectedDown.copy(WORLD_DOWN).addScaledVector(worldAxis, -WORLD_DOWN.dot(worldAxis))

      if (projectedDown.lengthSq() > 0.0001) {
        projectedDown.normalize()
        const min = THREE.MathUtils.degToRad(constraint.min)
        const max = THREE.MathUtils.degToRad(constraint.max)
        const desired = fitAngleToLimits(
          Math.atan2(worldAxis.dot(cross.crossVectors(baseDown, projectedDown)), baseDown.dot(projectedDown)),
          min,
          max,
          pendulumAngle.current,
        )
        const error = desired - pendulumAngle.current
        const unstableNudge = Math.abs(error) > Math.PI * 0.9 && Math.abs(Math.sin(error)) < 0.01
          ? Math.sign(error) * 0.03
          : 0
        pendulumVelocity.current += (
          pendulum.gravity * (Math.sin(error) + unstableNudge) -
          pendulum.damping * pendulumVelocity.current
        ) * delta
        pendulumVelocity.current = THREE.MathUtils.clamp(
          pendulumVelocity.current,
          -THREE.MathUtils.degToRad(pendulum.maxSpeed),
          THREE.MathUtils.degToRad(pendulum.maxSpeed),
        )
        pendulumAngle.current = THREE.MathUtils.clamp(
          pendulumAngle.current + pendulumVelocity.current * delta,
          min,
          max,
        )
        offset.setFromAxisAngle(axis.set(1, 0, 0), pendulumAngle.current)
        joint.quaternion.copy(rest).multiply(offset)
        scene.updateMatrixWorld(true)
        if (collisionWorsened(previousPendulumCollisions, getCollisions())) {
          joint.quaternion.copy(previousPendulumRotation)
          pendulumAngle.current = previousPendulumAngle
          pendulumVelocity.current = 0
        }
      }
    }
    scene.updateMatrixWorld(true)
  })

  return powerLevel
}
