import * as THREE from 'three'
import lampShadeFragmentChunk from './lampShadeFade.frag.glsl?raw'
import lampShadeVertexChunk from './lampShadeFade.vert.glsl?raw'

type LampShadeFadeOptions = {
  fadeStart?: number
  fadeEnd?: number
}

export function applyLampShadeFade(
  material: THREE.MeshStandardMaterial,
  geometry: THREE.BufferGeometry,
  { fadeStart = 0, fadeEnd = 1 }: LampShadeFadeOptions = {},
) {
  geometry.computeBoundingBox()

  const bounds = geometry.boundingBox
  if (!bounds) return

  const fadeStartY = THREE.MathUtils.lerp(bounds.min.y, bounds.max.y, fadeStart)
  const fadeEndY = THREE.MathUtils.lerp(bounds.min.y, bounds.max.y, fadeEnd)

  material.transparent = true
  material.depthWrite = false
  material.alphaTest = 0.001
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uLampShadeFadeStart = { value: fadeStartY }
    shader.uniforms.uLampShadeFadeEnd = { value: fadeEndY }

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying float vLampShadeHeight;',
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>\n${lampShadeVertexChunk}`,
      )

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        [
          '#include <common>',
          'uniform float uLampShadeFadeStart;',
          'uniform float uLampShadeFadeEnd;',
          'varying float vLampShadeHeight;',
        ].join('\n'),
      )
      .replace(
        '#include <opaque_fragment>',
        `${lampShadeFragmentChunk}\n#include <opaque_fragment>`,
      )
  }
  material.customProgramCacheKey = () => 'lamp-shade-height-fade-v1'
  material.needsUpdate = true
}
