'use client'

import { useRef, useEffect } from 'react'
import p5 from 'p5'
import type { Layer, DrawingCommand } from '@/lib/types'
import {
  generateUniformGrid,
  generateNoiseDisplacementGrid,
  generateRecursiveSubdivision,
  generateIsometricGrid,
  generatePerlinNoiseFields,
  generateFractalTrees,
  generateCellularAutomata,
  generateLSystem,
} from '@/lib/engine/algorithms'

// Define a type for our custom p5 instance
interface CustomP5 extends p5 {
  updateWithProps: (props: P5SketchProps) => void
}

interface P5SketchProps {
  width?: number
  height?: number
  params?: any
  selectedLayer?: string | null
  className?: string
}

export default function P5Sketch({
  params = {
    density: 10,
    speed: 1,
    selectedColor: 'purple',
    algorithm: 'uniform',
  },
  selectedLayer = null,
  className = '',
}: P5SketchProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const p5InstanceRef = useRef<CustomP5 | null>(null)

  // Effect for sketch creation and destruction
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Clear any existing canvas elements
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    // Prevent multiple instances - cleanup any existing instance first
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove()
      p5InstanceRef.current = null
    }

    const sketch = (p: CustomP5) => {
      let particles: Array<{ x: number; y: number; vx: number; vy: number }> =
        []
      let drawingCommands: DrawingCommand[] = []

      // Keep local copies of props to be updated
      let localParams = { ...params }

      let isInitialized = false

      p.setup = () => {
        // Ensure only one canvas exists
        const existingCanvases = container.querySelectorAll('canvas')
        existingCanvases.forEach((canvas) => canvas.remove())

        p.createCanvas(container.clientWidth, container.clientHeight)
      }

      p.draw = () => {
        p.background(248, 250, 252) // bg-slate-50

        // Initialize on first draw when canvas dimensions are available
        if (!isInitialized && selectedLayer && p.width && p.height) {
          initializeDrawing()
          isInitialized = true
        }

        // Handle particle system animation
        if (localParams.algorithm === 'particles') {
          for (const particle of particles) {
            particle.x += particle.vx * localParams.speed
            particle.y += particle.vy * localParams.speed

            if (particle.x < 0) particle.x = p.width
            if (particle.x > p.width) particle.x = 0
            if (particle.y < 0) particle.y = p.height
            if (particle.y > p.height) particle.y = 0

            p.push()
            setColorFromString(localParams.selectedColor)
            p.noStroke()
            p.circle(particle.x, particle.y, 6)
            p.pop()
          }
        } else {
          // Render static algorithms
          renderDrawingCommands()
        }
      }

      p.updateWithProps = (props: P5SketchProps) => {
        if (props.params && props.selectedLayer) {
          // Only update and redraw if we have a selected layer
          localParams = { ...props.params }
          if (p && p.width && p.height) {
            initializeDrawing()
            isInitialized = true
            // Force a redraw
            p.redraw()
          }
        } else if (!props.selectedLayer) {
          // Clear canvas if no layer selected
          particles = []
          drawingCommands = []
          isInitialized = false
          if (p && p.redraw) {
            p.redraw()
          }
        }
      }

      function initializeDrawing() {
        particles = []
        drawingCommands = []

        // Ensure canvas is ready before getting dimensions
        if (!p.width || !p.height) {
          return
        }

        // Get current canvas dimensions
        const canvasWidth = p.width
        const canvasHeight = p.height

        // Create a mock layer object for the algorithms
        const mockLayer: Layer = {
          id: 'sketch',
          name: 'Sketch Layer',
          type: 'grid',
          visible: true,
          isClipped: false,
          parameters: {
            algorithm:
              localParams.algorithm as Layer['parameters']['algorithm'],
            density: localParams.density || 10,
            gutter: localParams.gutter || 5,
            colorPalette: [localParams.selectedColor || 'purple'],
            scale: localParams.noiseScale || 0.005,
            depth: localParams.iterations || localParams.octaves || 6, // L-Systems uses iterations for depth
            particleCount: localParams.particleCount || 100,
            rule:
              localParams.rules || localParams.survivalRules || 'F=F+F-F-F+F', // L-Systems rules
            angle: localParams.angle || localParams.branchAngle || 25, // L-Systems turn angle
            // Algorithm-specific parameters from UI
            subdivisions: localParams.subdivisions || 3,
            threshold: localParams.threshold || 0.5,
            perspective: localParams.perspective || 0.5,
            shapeVariety: localParams.shapeVariety || 1,
            heightVariation: localParams.heightVariation || 2,
            sizeVariation: localParams.sizeVariation || 3,
            displacementIntensity: localParams.displacementIntensity || 1,
            colorVariation: localParams.colorVariation || 3,
            noiseScale: localParams.noiseScale || 0.005,
            octaves: localParams.octaves || 4,
            fieldStrength: localParams.fieldStrength || 1,
            flowSpeed: localParams.flowSpeed || 0.01,
            branchLength: localParams.branchLength || 0.7,
            treeCount: localParams.treeCount || 8,
            iterations: localParams.iterations || 6,
            gravity: localParams.gravity || 0.2,
            friction: localParams.friction || 0.95,
            generations: localParams.generations || 10,
            survivalRules: localParams.survivalRules || '23/3',
            pattern: localParams.pattern || 'koch', // L-Systems pattern
            axiom: localParams.axiom || 'F', // L-Systems axiom
            rules: localParams.rules || 'F=F+F-F-F+F', // L-Systems rules
            turnAngle: localParams.angle || 25, // L-Systems turn angle
            // Pass canvas dimensions to algorithms
            canvasWidth,
            canvasHeight,
          },
          animation: {
            type: 'none',
            speed: localParams.speed || 1,
            duration: 2,
          },
        }

        // Generate drawing commands based on algorithm
        switch (localParams.algorithm) {
          case 'uniform':
            drawingCommands = generateUniformGrid(mockLayer)
            break
          case 'noise':
            drawingCommands = generateNoiseDisplacementGrid(mockLayer)
            break
          case 'recursive':
            drawingCommands = generateRecursiveSubdivision(mockLayer)
            break
          case 'isometric':
            drawingCommands = generateIsometricGrid(mockLayer)
            break
          case 'perlin':
            drawingCommands = generatePerlinNoiseFields(mockLayer)
            break
          case 'fractal':
            drawingCommands = generateFractalTrees(mockLayer)
            break
          case 'particles':
            // For particles, we'll use the original particle system
            for (
              let i = 0;
              i < (localParams.particleCount || localParams.density * 2 || 20);
              i++
            ) {
              particles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                vx: p.random(-1, 1),
                vy: p.random(-1, 1),
              })
            }
            break
          case 'cellular':
            drawingCommands = generateCellularAutomata(mockLayer)
            break
          case 'lsystem':
            drawingCommands = generateLSystem(mockLayer)
            break
        }
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
          purple: [147, 51, 234],
          blue: [59, 130, 246],
          green: [34, 197, 94],
          yellow: [234, 179, 8],
          red: [239, 68, 68],
          pink: [236, 72, 153],
          indigo: [99, 102, 241],
          teal: [20, 184, 166],
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
          purple: [147, 51, 234],
          blue: [59, 130, 246],
          green: [34, 197, 94],
          yellow: [234, 179, 8],
          red: [239, 68, 68],
          pink: [236, 72, 153],
          indigo: [99, 102, 241],
          teal: [20, 184, 166],
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

    // Final safety check before creating new instance
    if (p5InstanceRef.current) {
      ;(p5InstanceRef.current as any).remove()
      p5InstanceRef.current = null
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
      if (p5InstanceRef.current) {
        ;(p5InstanceRef.current as any).remove()
        p5InstanceRef.current = null
      }
      // Clear any remaining canvas elements
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array ensures this runs only once on mount

  // Effect for updating props
  useEffect(() => {
    const updateProps = () => {
      if (p5InstanceRef.current && p5InstanceRef.current.updateWithProps) {
        p5InstanceRef.current.updateWithProps({
          params,
          selectedLayer,
        })
      }
    }

    // Small delay to ensure P5 instance is fully ready
    const timeoutId = setTimeout(updateProps, 10)
    return () => clearTimeout(timeoutId)
  }, [params, selectedLayer]) // Include selectedLayer in dependencies

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
