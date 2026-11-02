import { type RefObject, useLayoutEffect, useMemo, useRef } from 'react'
import { useHelper } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { BeamSettings, LampColor, LampLightSettings } from '../../../config/lamp'
import { lightBeamFragmentShader, lightBeamVertexShader } from '../../../shaders/lightBeam'

type LampLightProps = {
  anchor: THREE.Object3D
  debug: boolean
  beam: BeamSettings
  settings: LampLightSettings
  color: LampColor
  brightness: number
  powerLevel: RefObject<number>
  flicker: RefObject<number>
}

export default function LampLight({ anchor, debug, beam, settings, color, brightness, powerLevel, flicker }: LampLightProps) {
  const light = useRef<THREE.SpotLight>(null!)
  const beamMesh = useRef<THREE.Mesh>(null)
  const beamMaterial = useRef<THREE.ShaderMaterial>(null)
  const target = useMemo(() => new THREE.Object3D(), [])
  const lightPosition = useMemo(() => new THREE.Vector3(), [])
  const beamPosition = useMemo(() => new THREE.Vector3(), [])
  const targetPosition = useMemo(() => new THREE.Vector3(), [])
  const direction = useMemo(() => new THREE.Vector3(), [])
  const quaternion = useMemo(() => new THREE.Quaternion(), [])
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const geometry = useMemo(() => {
    const cylinder = new THREE.CylinderGeometry(1.4, 0.07, 1, 32, 1, true)
    cylinder.translate(0, 0.5, 0)
    return cylinder
  }, [])
  const uniforms = useMemo(() => ({
    uBeamColor: { value: new THREE.Color('#ffd09a') },
    uBeamOpacity: { value: beam.opacity },
    uBeamFadeEnd: { value: beam.fadeEnd },
    uBeamFadePower: { value: beam.fadePower },
  }), [beam])

  useHelper(debug ? light : null, THREE.SpotLightHelper, '#ffcc33')

  useLayoutEffect(() => {
    if (light.current) light.current.target = target
  }, [target])

  useFrame(() => {
    const level = THREE.MathUtils.clamp(
      brightness / 100,
      0.1,
      1
    )

    const intensity =
      level * powerLevel.current * flicker.current

    anchor.localToWorld(
      lightPosition.set(0, settings.lightOffset, 0)
    )
    anchor.localToWorld(
      beamPosition.set(0, settings.beamOffset, 0)
    )
    anchor.localToWorld(
      targetPosition.set(0, 6, 0)
    )

    if (light.current) {
      light.current.position.copy(lightPosition)
      light.current.color.set(settings.spotlightColors[color])
      light.current.intensity =
        settings.intensity * intensity
    }

    target.position.copy(targetPosition)
    target.updateMatrixWorld()

    if (beamMaterial.current) {
      const uniforms = beamMaterial.current.uniforms

      uniforms.uBeamOpacity.value =
        beam.opacity * intensity

      uniforms.uBeamFadeEnd.value = beam.fadeEnd
      uniforms.uBeamFadePower.value = beam.fadePower
      uniforms.uBeamColor.value.set(settings.beamColors[color])
    }

    if (beamMesh.current) {
      direction.copy(targetPosition).sub(beamPosition)
      const length = Math.min(5, direction.length())

      quaternion.setFromUnitVectors(
        up,
        direction.normalize()
      )

      beamMesh.current.position.copy(beamPosition)
      beamMesh.current.quaternion.copy(quaternion)
      beamMesh.current.scale.set(1, length, 1)
    }
  })

  return (
    <>
      <spotLight ref={light} castShadow intensity={0} distance={5} angle={0.8} penumbra={0.65} decay={2} shadow-bias={-0.0005} />
      <primitive object={target} />
      <mesh ref={beamMesh} geometry={geometry} raycast={() => null}>
        <shaderMaterial ref={beamMaterial} vertexShader={lightBeamVertexShader} fragmentShader={lightBeamFragmentShader} uniforms={uniforms} transparent blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} fog={false} />
      </mesh>
    </>
  )
}
