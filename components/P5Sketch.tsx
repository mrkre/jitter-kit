'use client'

import { useRef, useEffect } from 'react'
import p5 from 'p5'

// Define a type for our custom p5 instance
interface CustomP5 extends p5 {
  updateWithProps: (props: P5SketchProps) => void
}

interface P5SketchProps {
  width?: number
  height?: number
  density?: number
  speed?: number
  selectedColor?: string
  className?: string
}

export default function P5Sketch({
  density = 10,
  speed = 1,
  selectedColor = 'purple',
  className = '',
}: P5SketchProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const p5InstanceRef = useRef<CustomP5 | null>(null)

  // Effect for sketch creation and destruction
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const sketch = (p: CustomP5) => {
      let particles: Array<{ x: number; y: number; vx: number; vy: number }> =
        []

      // Keep local copies of props to be updated
      let localDensity = density
      let localSpeed = speed
      let localSelectedColor = selectedColor

      p.setup = () => {
        p.createCanvas(container.clientWidth, container.clientHeight)
        initializeParticles()
      }

      p.draw = () => {
        p.background(248, 250, 252) // bg-slate-50

        for (const particle of particles) {
          particle.x += particle.vx * localSpeed
          particle.y += particle.vy * localSpeed

          if (particle.x < 0) particle.x = p.width
          if (particle.x > p.width) particle.x = 0
          if (particle.y < 0) particle.y = p.height
          if (particle.y > p.height) particle.y = 0

          p.push()
          setColorFromString(localSelectedColor)
          p.noStroke()
          p.circle(particle.x, particle.y, 6)
          p.pop()
        }
      }

      p.updateWithProps = (props: P5SketchProps) => {
        if (props.speed !== undefined) localSpeed = props.speed
        if (props.selectedColor !== undefined)
          localSelectedColor = props.selectedColor

        if (props.density !== undefined && props.density !== localDensity) {
          localDensity = props.density
          initializeParticles()
        }
      }

      function initializeParticles() {
        particles = []
        for (let i = 0; i < localDensity; i++) {
          particles.push({
            x: p.random(p.width),
            y: p.random(p.height),
            vx: p.random(-1, 1),
            vy: p.random(-1, 1),
          })
        }
      }

      function setColorFromString(colorName: string) {
        const colors: Record<string, [number, number, number]> = {
          purple: [147, 51, 234],
          blue: [59, 130, 246],
          green: [34, 197, 94],
          yellow: [234, 179, 8],
          red: [239, 68, 68],
          pink: [236, 72, 153],
          indigo: [99, 102, 241],
          teal: [20, 184, 166],
        }
        const [r, g, b] = colors[colorName] || colors.purple
        p.fill(r, g, b)
      }
    }

    p5InstanceRef.current = new p5(sketch, container) as CustomP5

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return
      const { width, height } = entries[0].contentRect
      p5InstanceRef.current?.resizeCanvas(width, height)
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.unobserve(container)
      p5InstanceRef.current?.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array ensures this runs only once on mount

  // Effect for updating props
  useEffect(() => {
    p5InstanceRef.current?.updateWithProps({ density, speed, selectedColor })
  }, [density, speed, selectedColor])

  // Prevent scrolling when interacting with canvas
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const preventScroll = (e: WheelEvent | TouchEvent) => {
      e.preventDefault()
    }

    container.addEventListener('wheel', preventScroll, { passive: false })
    container.addEventListener('touchmove', preventScroll, { passive: false })

    return () => {
      container.removeEventListener('wheel', preventScroll)
      container.removeEventListener('touchmove', preventScroll)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`h-full w-full rounded-lg ${className}`}
      style={{
        touchAction: 'none',
        overflow: 'hidden',
      }}
    />
  )
}
