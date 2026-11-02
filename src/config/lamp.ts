export type LampColor = 'red' | 'blue' | 'green'
export type TransformAxis = 'x' | 'y' | 'z'

export type JointConstraint = {
  bone: string
  label: string
  axis: TransformAxis
  min: number
  max: number
  step: number
  initial: number
  isLooping?: boolean
  drivenByPower?: boolean
  passive?: boolean
}

export type BeamSettings = {
  fadeEnd: number
  fadePower: number
  opacity: number
}

export type LampLightSettings = {
  intensity: number
  lightOffset: number
  beamOffset: number
  spotlightColors: Record<LampColor, string>
  beamColors: Record<LampColor, string>
}

export type PendulumSettings = {
  gravity: number
  damping: number
  maxSpeed: number
}

export const JOINT_SELECTION_TIMEOUT_MS = 5_000
export const PENDULUM_BONE = 'Lamp_Shade001'

export const LAMP_JOINTS: JointConstraint[] = [
  { bone: 'Base_Rotation', label: 'Base Rotation', axis: 'y', min: -180, max: 180, step: 1, initial: 0, isLooping: true },
  { bone: 'Joint_01', label: 'Lower Arm', axis: 'x', min: -190, max: 60, step: 1, initial: 0 },
  { bone: 'Joint_02', label: 'Middle Arm', axis: 'x', min: -100, max: 230, step: 1, initial: 0 },
  { bone: 'Joint_03', label: 'Upper Arm', axis: 'x', min: -60, max: 250, step: 1, initial: 0 },
  { bone: 'Joint_Rotation', label: 'Joint Rotation', axis: 'y', min: -180, max: 180, step: 1, initial: 0, isLooping: true },
  { bone: PENDULUM_BONE, label: 'Joint 4', axis: 'x', min: -55, max: 230, step: 1, initial: 0, passive: true },
  { bone: 'Switch', label: 'Switch', axis: 'z', min: 0, max: 25, step: 1, initial: 0, drivenByPower: true },
]

export const CONTROLLABLE_JOINTS = LAMP_JOINTS.filter(
  (joint) => !joint.drivenByPower && !joint.passive,
)

export function createBeamSettings(): BeamSettings {
  return { fadeEnd: 0.6, fadePower: 4.5, opacity: 0.6 }
}

export function createLightSettings(): LampLightSettings {
  return {
    intensity: 100,
    lightOffset: 1,
    beamOffset: 0.5,
    spotlightColors: { red: '#ffc88a', blue: '#c8b3ff', green: '#80e5ff' },
    beamColors: { red: '#ffc266', blue: '#a78aff', green: '#a0ffec' },
  }
}

export function createPendulumSettings(): PendulumSettings {
  return { gravity: 18, damping: 4, maxSpeed: 240 }
}
