import { useEffect } from 'react'
import GUI from 'lil-gui'
import {
  CONTROLLABLE_JOINTS,
  type BeamSettings,
  type LampLightSettings,
  type PendulumSettings,
} from '../../../config/lamp'

export default function useLampGui(
  jointValues: Record<string, number>,
  beam: BeamSettings,
  light: LampLightSettings,
  pendulum: PendulumSettings,
) {
  useEffect(() => {
    const gui = new GUI({ title: 'Lamp Controls' })

    CONTROLLABLE_JOINTS.forEach((joint) => {
      gui.addFolder(joint.label)
        .add(jointValues, joint.bone, joint.min, joint.max, joint.step)
        .name(`Rotation ${joint.axis.toUpperCase()}`)
    })

    const pendulumFolder = gui.addFolder('Joint 4 Pendulum')
    pendulumFolder.add(pendulum, 'gravity', 0, 40, 0.1).name('Gravity')
    pendulumFolder.add(pendulum, 'damping', 0, 12, 0.1).name('Damping')
    pendulumFolder.add(pendulum, 'maxSpeed', 30, 720, 5).name('Max Speed')

    const beamFolder = gui.addFolder('Light Beam')
    beamFolder.add(light, 'beamOffset', 0, 2, 0.01).name('Position')
    beamFolder.add(beam, 'fadeEnd', 0.1, 1, 0.01).name('Fade End')
    beamFolder.add(beam, 'fadePower', 0.25, 4, 0.05).name('Fade Curve')
    beamFolder.add(beam, 'opacity', 0, 1, 0.01).name('Opacity')
    const beamColors = beamFolder.addFolder('Colors')
    beamColors.addColor(light.beamColors, 'red').name('Yellow Mode')
    beamColors.addColor(light.beamColors, 'blue').name('Purple Mode')
    beamColors.addColor(light.beamColors, 'green').name('Aqua Mode')

    const spotlight = gui.addFolder('Spotlight')
    spotlight.add(light, 'intensity', 0, 200, 1).name('Intensity')
    spotlight.add(light, 'lightOffset', 0, 2, 0.01).name('Position')
    const spotlightColors = spotlight.addFolder('Colors')
    spotlightColors.addColor(light.spotlightColors, 'red').name('Yellow Mode')
    spotlightColors.addColor(light.spotlightColors, 'blue').name('Purple Mode')
    spotlightColors.addColor(light.spotlightColors, 'green').name('Aqua Mode')

    return () => gui.destroy()
  }, [beam, jointValues, light, pendulum])
}
