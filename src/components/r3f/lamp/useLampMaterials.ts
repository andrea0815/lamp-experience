import { useLayoutEffect } from 'react'
import * as THREE from 'three'
import { applyLampShadeFade } from '../../../shaders/lampShade'

export default function useLampMaterials(scene: THREE.Object3D) {
  useLayoutEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      object.castShadow = object.name !== 'Lamp_Bulb'
      object.receiveShadow = true

      const needsTwoSidedMaterial = object.name === 'Lamp_Shade_Glass' || object.name === 'Lamp_Bulb'
      if (!needsTwoSidedMaterial) return

      const source = Array.isArray(object.material) ? object.material : [object.material]
      const materials = source.map((material) => {
        const clone = material.clone()
        clone.side = THREE.DoubleSide
        clone.shadowSide = THREE.DoubleSide
        clone.transparent = false
        clone.opacity = 1
        clone.depthWrite = true

        if (object.name === 'Lamp_Shade_Glass' && clone instanceof THREE.MeshStandardMaterial) {
          applyLampShadeFade(clone, object.geometry, { fadeStart: 0, fadeEnd: 1 })
        }
        return clone
      })
      object.material = Array.isArray(object.material) ? materials : materials[0]
    })
  }, [scene])
}
