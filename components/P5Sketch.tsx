'use client'

import { useRef, useEffect } from 'react'
import p5 from 'p5'

interface P5SketchProps {
  width?: number
  height?: number
  density?: number
  speed?: number
  selectedColor?: string
  className?: string
}

export default function P5Sketch({
  width,
  height,
  density = 10,
  speed = 1,
  selectedColor = 'purple',
  className = '',
}: P5SketchProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const p5InstanceRef = useRef<p5 | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clean up any existing p5 instance
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove()
      p5InstanceRef.current = null
    }

    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    // Use provided dimensions or container dimensions
    const canvasWidth = width || Math.max(rect.width, 100)
    const canvasHeight = height || Math.max(rect.height, 100)

    // Prevent extreme canvas sizes
    const finalWidth = Math.min(canvasWidth, 2000)
    const finalHeight = Math.min(canvasHeight, 2000)

    const sketch = (p: p5) => {
      let particles: Array<{ x: number; y: number; vx: number; vy: number }> =
        []

      p.setup = () => {
        p.createCanvas(finalWidth, finalHeight)
        initializeParticles()
      }

      p.draw = () => {
        p.background(248, 250, 252) // bg-slate-50

        // Draw simple particles
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i]

          // Simple movement
          particle.x += particle.vx * speed
          particle.y += particle.vy * speed

          // Wrap around edges
          if (particle.x < 0) particle.x = p.width
          if (particle.x > p.width) particle.x = 0
          if (particle.y < 0) particle.y = p.height
          if (particle.y > p.height) particle.y = 0

          // Draw particle
          p.push()
          setColorFromString(selectedColor)
          p.noStroke()
          p.circle(particle.x, particle.y, 6)
          p.pop()
        }
      }

      function initializeParticles() {
        particles = []
        for (let i = 0; i < density; i++) {
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

    p5InstanceRef.current = new p5(sketch, containerRef.current)

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove()
        p5InstanceRef.current = null
      }
    }
  }, [width, height, density, speed, selectedColor])

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
        minHeight: height || '100%',
        minWidth: width || '100%',
      }}
    />
  )
}
