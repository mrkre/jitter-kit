'use client'

import { useRef, useEffect, memo } from 'react'
import p5 from 'p5'
import type { DrawingCommand } from '@/lib/types'
import { useEngine } from '@/lib/engine/engineContext'

// Define a type for our custom p5 instance
interface CustomP5 extends p5 {
  updateWithCommands: (commands: DrawingCommand[]) => void
}

interface P5SketchEngineProps {
  width?: number
  height?: number
  className?: string
}

// Engine-connected P5 Sketch component
export const P5SketchEngine = memo(function P5SketchEngine({
  className = '',
}: P5SketchEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const p5InstanceRef = useRef<CustomP5 | null>(null)
  const { subscribeToCommands } = useEngine()

  // Main effect for p5.js instance lifecycle management
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Clean up any existing canvas elements
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    // Remove any existing p5 instance
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove()
      p5InstanceRef.current = null
    }

    const sketch = (p: CustomP5) => {
      let drawingCommands: DrawingCommand[] = []

      p.setup = () => {
        // Ensure only one canvas exists
        const existingCanvases = container.querySelectorAll('canvas')
        existingCanvases.forEach((canvas) => canvas.remove())

        p.createCanvas(container.clientWidth, container.clientHeight)
        p.frameRate(60)
      }

      p.draw = () => {
        p.background(248, 250, 252) // bg-slate-50
        renderDrawingCommands()
      }

      p.updateWithCommands = (commands: DrawingCommand[]) => {
        drawingCommands = commands
        // Force a redraw
        p.redraw()
      }

      function renderDrawingCommands() {
        for (const cmd of drawingCommands) {
          p.push()

          // Set color based on command type
          if (cmd.type === 'line') {
            // For lines, use stroke color
            setStrokeColorFromString(cmd.color)
            p.strokeWeight(cmd.strokeWeight || 1)
            p.noFill()
          } else {
            // For other shapes, use fill color
            setColorFromString(cmd.color)

            // Set stroke
            if (cmd.strokeWeight && cmd.strokeWeight > 0) {
              if (cmd.strokeColor) {
                const strokeRgb = hexToRgb(cmd.strokeColor)
                if (strokeRgb) {
                  p.stroke(strokeRgb.r, strokeRgb.g, strokeRgb.b)
                }
              }
              p.strokeWeight(cmd.strokeWeight)
            } else {
              p.noStroke()
            }
          }

          // Set alpha if specified
          if (cmd.alpha !== undefined) {
            p.fill(
              p.red(p.color(cmd.color)),
              p.green(p.color(cmd.color)),
              p.blue(p.color(cmd.color)),
              cmd.alpha * 255
            )
          }

          // Draw based on type
          switch (cmd.type) {
            case 'rect':
              if (cmd.size) {
                p.rectMode(p.CENTER)
                p.rect(
                  cmd.position.x,
                  cmd.position.y,
                  cmd.size.width,
                  cmd.size.height
                )
              }
              break
            case 'ellipse':
              if (cmd.radius) {
                p.ellipse(
                  cmd.position.x,
                  cmd.position.y,
                  cmd.radius * 2,
                  cmd.radius * 2
                )
              }
              break
            case 'circle':
              if (cmd.radius) {
                p.circle(cmd.position.x, cmd.position.y, cmd.radius * 2)
              }
              break
            case 'line':
              if (cmd.points && cmd.points.length >= 2) {
                p.line(
                  cmd.points[0].x,
                  cmd.points[0].y,
                  cmd.points[1].x,
                  cmd.points[1].y
                )
              }
              break
            case 'triangle':
              if (cmd.points && cmd.points.length === 3) {
                p.triangle(
                  cmd.points[0].x,
                  cmd.points[0].y,
                  cmd.points[1].x,
                  cmd.points[1].y,
                  cmd.points[2].x,
                  cmd.points[2].y
                )
              }
              break
            case 'quad':
              if (cmd.points && cmd.points.length === 4) {
                p.beginShape()
                for (const point of cmd.points) {
                  p.vertex(point.x, point.y)
                }
                p.endShape(p.CLOSE)
              }
              break
            case 'polygon':
              if (cmd.points && cmd.points.length >= 3) {
                p.beginShape()
                for (const point of cmd.points) {
                  p.vertex(point.x, point.y)
                }
                p.endShape(p.CLOSE)
              }
              break
            case 'path':
              if (cmd.commands) {
                // Parse path commands (simplified SVG-like path)
                p.beginShape()
                const commands = cmd.commands.split(' ')
                for (let i = 0; i < commands.length; i++) {
                  const command = commands[i]
                  if (command === 'M' && i + 2 < commands.length) {
                    // Move to
                    const x = parseFloat(commands[i + 1])
                    const y = parseFloat(commands[i + 2])
                    p.vertex(x, y)
                    i += 2
                  } else if (command === 'L' && i + 2 < commands.length) {
                    // Line to
                    const x = parseFloat(commands[i + 1])
                    const y = parseFloat(commands[i + 2])
                    p.vertex(x, y)
                    i += 2
                  }
                }
                p.endShape()
              }
              break
            case 'particle':
              // Particles are typically small circles with potential motion blur
              if (cmd.radius) {
                // Apply rotation if specified
                if (cmd.rotation) {
                  p.push()
                  p.translate(cmd.position.x, cmd.position.y)
                  p.rotate(cmd.rotation)
                  p.circle(0, 0, cmd.radius * 2)
                  p.pop()
                } else {
                  p.circle(cmd.position.x, cmd.position.y, cmd.radius * 2)
                }

                // Optional: Add motion blur effect for moving particles
                if (
                  cmd.velocity &&
                  (cmd.velocity.x !== 0 || cmd.velocity.y !== 0)
                ) {
                  const blurSteps = 3
                  for (let i = 1; i <= blurSteps; i++) {
                    const alpha = (1 - i / blurSteps) * 0.3
                    p.fill(
                      p.red(p.color(cmd.color)),
                      p.green(p.color(cmd.color)),
                      p.blue(p.color(cmd.color)),
                      alpha * 255
                    )
                    p.circle(
                      cmd.position.x - cmd.velocity.x * i * 0.5,
                      cmd.position.y - cmd.velocity.y * i * 0.5,
                      cmd.radius * 2
                    )
                  }
                }
              }
              break
          }

          p.pop()
        }
      }

      function hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : null
      }

      function setColorFromString(colorName: string) {
        const colors: Record<string, [number, number, number]> = {
          purple: [168, 85, 247], // #a855f7
          pink: [236, 72, 153], // #ec4899
          blue: [59, 130, 246], // #3b82f6
          teal: [20, 184, 166], // #14b8a6
          red: [239, 68, 68], // #ef4444
          yellow: [234, 179, 8], // #eab308
          white: [255, 255, 255], // #ffffff
          black: [0, 0, 0], // #000000
          green: [34, 197, 94],
          indigo: [99, 102, 241],
        }

        // Handle hex colors
        if (colorName.startsWith('#')) {
          const rgb = hexToRgb(colorName)
          if (rgb) {
            p.fill(rgb.r, rgb.g, rgb.b)
            return
          }
        }

        const [r, g, b] = colors[colorName] || colors.purple
        p.fill(r, g, b)
      }

      function setStrokeColorFromString(colorName: string) {
        const colors: Record<string, [number, number, number]> = {
          purple: [168, 85, 247], // #a855f7
          pink: [236, 72, 153], // #ec4899
          blue: [59, 130, 246], // #3b82f6
          teal: [20, 184, 166], // #14b8a6
          red: [239, 68, 68], // #ef4444
          yellow: [234, 179, 8], // #eab308
          white: [255, 255, 255], // #ffffff
          black: [0, 0, 0], // #000000
          green: [34, 197, 94],
          indigo: [99, 102, 241],
        }

        // Handle hex colors
        if (colorName.startsWith('#')) {
          const rgb = hexToRgb(colorName)
          if (rgb) {
            p.stroke(rgb.r, rgb.g, rgb.b)
            return
          }
        }

        const [r, g, b] = colors[colorName] || colors.purple
        p.stroke(r, g, b)
      }
    }

    // Create the p5 instance
    p5InstanceRef.current = new p5(sketch, container) as CustomP5

    // Set up ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return
      const { width, height } = entries[0].contentRect
      p5InstanceRef.current?.resizeCanvas(width, height)
    })

    resizeObserver.observe(container)

    // Cleanup function
    return () => {
      resizeObserver.unobserve(container)

      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove()
        p5InstanceRef.current = null
      }

      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [])

  // Subscribe to drawing command updates
  useEffect(() => {
    const unsubscribe = subscribeToCommands((commands) => {
      if (p5InstanceRef.current && p5InstanceRef.current.updateWithCommands) {
        p5InstanceRef.current.updateWithCommands(commands)
      }
    })

    return unsubscribe
  }, [subscribeToCommands])

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
})
