import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

const MATCHERS: Record<string, (name: string) => boolean> = {
  Base_Rotation: (name) => name.includes('base') && name.includes('rotation'),
  Joint_01: (name) => name.includes('joint1'),
  Joint_02: (name) => name.includes('joint2'),
  Joint_03: (name) => name.includes('joint3'),
  Joint_Rotation: (name) => name.includes('shade') && name.includes('rotation'),
}

const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

export default function SelectionOutline({ selectedJoint }: { selectedJoint: string | null }) {
  const { camera, gl, scene, size } = useThree()
  const { composer, outline } = useMemo(() => {
    const nextComposer = new EffectComposer(gl)
    const nextOutline = new OutlinePass(new THREE.Vector2(size.width, size.height), scene, camera)
    nextOutline.edgeStrength = 10
    nextOutline.edgeThickness = 2
    nextOutline.visibleEdgeColor.set('#e0cbbd')
    nextOutline.hiddenEdgeColor.set('#a07866')
    nextComposer.addPass(new RenderPass(scene, camera))
    nextComposer.addPass(nextOutline)
    nextComposer.addPass(new OutputPass())
    return { composer: nextComposer, outline: nextOutline }
  }, [camera, gl, scene, size.height, size.width])

  useEffect(() => {
    const matcher = selectedJoint ? MATCHERS[selectedJoint] : null
    const meshes: THREE.Object3D[] = []
    if (matcher) {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && matcher(normalize(object.name))) meshes.push(object)
      })
    }
    outline.selectedObjects = meshes
    outline.enabled = meshes.length > 0
  }, [outline, scene, selectedJoint])

  useEffect(() => {
    composer.setPixelRatio(gl.getPixelRatio())
    composer.setSize(size.width, size.height)
    return () => composer.dispose()
  }, [composer, gl, size.height, size.width])

  useFrame(() => composer.render(), 1)
  return null
}
