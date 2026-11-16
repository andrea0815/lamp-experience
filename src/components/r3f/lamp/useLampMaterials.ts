import { useLayoutEffect } from 'react'
import * as THREE from 'three'
import { applyLampShadeFade } from '../../../shaders/lampShade'

export default function useLampMaterials(scene: THREE.Object3D) {
  useLayoutEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return

      object.frustumCulled = false

      if (object.name.includes('Collider')) {
        object.visible = false
        object.castShadow = false
        object.receiveShadow = false
        object.raycast = () => null
        return
      }

      object.castShadow = object.name !== 'Lamp_Shade_Glass'
      object.receiveShadow = true

      const needsTwoSidedMaterial = object.name === 'Lamp_Shade_Glass' || object.name === 'Lamp_Bulb'
      if (!needsTwoSidedMaterial) return

      const source = Array.isArray(object.material) ? object.material : [object.material]
      const materials = source.map((material) => {
        if (object.name === 'Lamp_Shade_Glass' && material instanceof THREE.MeshStandardMaterial) {
          const unlitMaterial = new THREE.MeshBasicMaterial({
            color: material.color,
            map: material.map,
            opacity: material.opacity,
            side: THREE.DoubleSide,
            toneMapped: false,
          })
          unlitMaterial.name = material.name
          applyLampShadeFade(unlitMaterial, object.geometry, { fadeStart: 0, fadeEnd: 1 })
          return unlitMaterial
        }

        const clone = material.clone()
        clone.side = THREE.DoubleSide
        clone.shadowSide = THREE.DoubleSide
        clone.transparent = false
        clone.opacity = 1
        clone.depthWrite = true

        return clone
      })
      object.material = Array.isArray(object.material) ? materials : materials[0]
    })
  }, [scene])
}
