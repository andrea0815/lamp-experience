
import { type RefObject, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { LampColor } from '../../../config/lamp'

type FlickerOptions = {
    color: LampColor
    brightness: number
    power: boolean
}

export default function useLampFlicker({
    color,
    brightness,
    power,
}: FlickerOptions) {
    const flicker = useRef(1)
    const target = useRef(1)
    const nextChange = useRef(0)
    const burst = useRef(0)
    const initialized = useRef(false)

    // Increase flickering when settings change
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            return
        }

        burst.current = 1
        nextChange.current = 0
    }, [color, brightness, power])

    useFrame((_, frameDelta) => {
        const delta = Math.min(frameDelta, 0.05)

        // Gradually return to idle flickering
        burst.current = Math.max(
            0,
            burst.current - delta * 1.3
        )

        const activity = burst.current

        // Random intervals, more frequent during bursts
        nextChange.current -= delta

        if (nextChange.current <= 0) {
            const frequency = THREE.MathUtils.lerp(
                0.05,
                0.015,
                activity
            )

            nextChange.current =
                frequency + Math.random() * frequency * 3

            const variation = THREE.MathUtils.lerp(0.02, 0.05, activity)
            target.current = 1 - variation + Math.random() * variation * 2
        }

        // Fast but smooth transitions
        const speed = THREE.MathUtils.lerp(
            18,
            40,
            activity
        )

        flicker.current = THREE.MathUtils.damp(
            flicker.current,
            target.current,
            speed,
            delta
        )
    })

    return flicker
}
