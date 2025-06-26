import type { Layer, DrawingCommand, Point } from '@/lib/types'
import {
  getCanvasSize,
  createColorPalette,
  createPerlinNoise,
} from './algorithmUtils'

// Performance monitoring utility
let performanceEnabled = false
let performanceData: Record<string, number[]> = {}

export function enablePerformanceMonitoring(enabled: boolean) {
  performanceEnabled = enabled
  if (!enabled) {
    performanceData = {}
  }
}

export function getPerformanceData() {
  return performanceData
}

function measurePerformance<T>(name: string, fn: () => T): T {
  if (!performanceEnabled) return fn()

  const start = performance.now()
  const result = fn()
  const end = performance.now()

  if (!performanceData[name]) {
    performanceData[name] = []
  }
  performanceData[name].push(end - start)

  return result
}

/**
 * Optimized uniform grid generation algorithm
 * Uses single loop instead of nested loops for better performance
 */
export const generateUniformGridOptimized = (
  layer: Layer
): DrawingCommand[] => {
  return measurePerformance('generateUniformGridOptimized', () => {
    const {
      density,
      gutter = 5,
      colorPalette,
      shapeVariety = 1,
      sizeVariation = 3,
    } = layer.parameters
    const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasSize(layer)

    const baseCellSize = Math.max(10, 100 - density * 0.8)
    const spacing = baseCellSize + gutter

    const cols = Math.floor(CANVAS_WIDTH / spacing)
    const rows = Math.floor(CANVAS_HEIGHT / spacing)

    // Pre-calculate total cells
    const totalCells = cols * rows

    // Pre-allocate commands array with estimated size
    const commands: DrawingCommand[] = new Array(totalCells * 2) // Some shapes create 2 commands
    let commandIndex = 0

    const offsetX = (CANVAS_WIDTH - cols * spacing) / 2
    const offsetY = (CANVAS_HEIGHT - rows * spacing) / 2

    // Enhanced color palette
    const colors = createColorPalette(colorPalette)
    const colorsLength = colors.length

    // Pre-calculate constants
    const halfBaseCellSize = baseCellSize / 2
    const sizeVariationFactor = sizeVariation / 10

    // Single loop optimization with index calculation
    for (let i = 0; i < totalCells; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)

      const baseX = offsetX + col * spacing + halfBaseCellSize
      const baseY = offsetY + row * spacing + halfBaseCellSize

      // Apply size variation
      const sizeMultiplier = 1 + (Math.random() - 0.5) * sizeVariationFactor
      const cellSize = baseCellSize * Math.max(0.3, sizeMultiplier)
      const halfCellSize = cellSize / 2

      // Determine shape based on variety parameter
      const shapeChoice = Math.floor(Math.random() * shapeVariety)

      // Color selection - optimized to avoid function call overhead
      const primaryColor = colors[Math.floor(Math.random() * colorsLength)]
      const secondaryColor = colors[Math.floor(Math.random() * colorsLength)]

      // Pre-calculate common values
      const strokeWeight = Math.max(0.5, cellSize / 30)
      const alpha = 0.8 + Math.random() * 0.2

      switch (shapeChoice) {
        case 0: // Rectangle
          commands[commandIndex++] = {
            type: 'rect',
            position: { x: baseX, y: baseY },
            size: { width: cellSize, height: cellSize },
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight,
            alpha,
          }
          break

        case 1: // Circle
          commands[commandIndex++] = {
            type: 'ellipse',
            position: { x: baseX, y: baseY },
            radius: halfCellSize,
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight,
            alpha,
          }
          break

        case 2: // Triangle
          const trianglePoints: Point[] = [
            { x: baseX, y: baseY - halfCellSize },
            { x: baseX - halfCellSize, y: baseY + halfCellSize },
            { x: baseX + halfCellSize, y: baseY + halfCellSize },
          ]

          commands[commandIndex++] = {
            type: 'polygon',
            position: { x: baseX, y: baseY },
            points: trianglePoints,
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight,
            alpha,
          }
          break

        case 3: // Diamond
          const diamondPoints: Point[] = [
            { x: baseX, y: baseY - halfCellSize },
            { x: baseX + halfCellSize, y: baseY },
            { x: baseX, y: baseY + halfCellSize },
            { x: baseX - halfCellSize, y: baseY },
          ]

          commands[commandIndex++] = {
            type: 'polygon',
            position: { x: baseX, y: baseY },
            points: diamondPoints,
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight,
            alpha,
          }
          break

        case 4: // Hexagon
          const hexagonPoints: Point[] = new Array(6)
          for (let j = 0; j < 6; j++) {
            const angle = (j * Math.PI * 2) / 6
            hexagonPoints[j] = {
              x: baseX + Math.cos(angle) * halfCellSize,
              y: baseY + Math.sin(angle) * halfCellSize,
            }
          }

          commands[commandIndex++] = {
            type: 'polygon',
            position: { x: baseX, y: baseY },
            points: hexagonPoints,
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight,
            alpha,
          }
          break

        case 5: // Plus/Cross
          const thirdCellSize = cellSize / 3
          const crossStrokeWeight = Math.max(0.5, cellSize / 40)

          // Vertical bar
          commands[commandIndex++] = {
            type: 'rect',
            position: { x: baseX, y: baseY },
            size: { width: thirdCellSize, height: cellSize },
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight: crossStrokeWeight,
            alpha,
          }

          // Horizontal bar
          commands[commandIndex++] = {
            type: 'rect',
            position: { x: baseX, y: baseY },
            size: { width: cellSize, height: thirdCellSize },
            color: secondaryColor,
            strokeColor: '#333333',
            strokeWeight: crossStrokeWeight,
            alpha,
          }
          break

        case 6: // Star
          const starPoints: Point[] = new Array(10)
          for (let j = 0; j < 10; j++) {
            const angle = (j * Math.PI * 2) / 10
            const radius = j % 2 === 0 ? halfCellSize : cellSize / 4
            starPoints[j] = {
              x: baseX + Math.cos(angle) * radius,
              y: baseY + Math.sin(angle) * radius,
            }
          }

          commands[commandIndex++] = {
            type: 'polygon',
            position: { x: baseX, y: baseY },
            points: starPoints,
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight,
            alpha,
          }
          break
      }
    }

    // Trim array to actual size
    commands.length = commandIndex
    return commands
  })
}

/**
 * Optimized noise displacement grid generation
 * Uses single loop and cached calculations
 */
export const generateNoiseDisplacementGridOptimized = (
  layer: Layer
): DrawingCommand[] => {
  return measurePerformance('generateNoiseDisplacementGridOptimized', () => {
    const {
      density,
      gutter = 5,
      colorPalette,
      displacementIntensity = 1,
      noiseScale = 0.005,
      octaves = 4,
    } = layer.parameters
    const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasSize(layer)

    // More responsive density scaling
    const baseCellSize = Math.max(
      5,
      Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / (5 + density * 1.5)
    )
    const spacing = baseCellSize + gutter

    // More responsive displacement scaling
    const displacementAmount = Math.max(
      5,
      baseCellSize * 0.8 * displacementIntensity
    )

    const cols = Math.floor(CANVAS_WIDTH / spacing)
    const rows = Math.floor(CANVAS_HEIGHT / spacing)
    const totalCells = cols * rows

    const offsetX = (CANVAS_WIDTH - cols * spacing) / 2
    const offsetY = (CANVAS_HEIGHT - rows * spacing) / 2

    // Enhanced color palette
    const colors = createColorPalette(colorPalette)
    const colorsLength = colors.length

    // More responsive noise scale
    const actualNoiseScale = Math.max(0.001, noiseScale)

    // Pre-allocate commands
    const commands: DrawingCommand[] = new Array(totalCells)
    let commandIndex = 0

    // Pre-calculate constants
    const halfBaseCellSize = baseCellSize / 2
    const sizeNoiseInput = actualNoiseScale * 0.5
    const colorNoiseInput = actualNoiseScale * 0.3
    const radiusNoiseInput = actualNoiseScale * 2

    // Create isolated Perlin noise instance for thread safety
    const perlinNoiseInstance = createPerlinNoise()

    // Multi-octave noise function with cached values
    const noiseCache = new Map<string, number>()

    const multiOctaveNoise = (x: number, y: number): number => {
      const key = `${x.toFixed(4)}_${y.toFixed(4)}`

      if (noiseCache.has(key)) {
        return noiseCache.get(key)!
      }

      let value = 0
      let amplitude = 1
      let frequency = actualNoiseScale

      for (let i = 0; i < octaves; i++) {
        value +=
          perlinNoiseInstance.noise2D(x * frequency, y * frequency) * amplitude
        amplitude *= 0.5
        frequency *= 2
      }

      noiseCache.set(key, value)
      return value
    }

    // Single loop optimization
    for (let i = 0; i < totalCells; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)

      const baseX = offsetX + col * spacing + halfBaseCellSize
      const baseY = offsetY + row * spacing + halfBaseCellSize

      // Apply noise-based displacement
      const noiseInputX = baseX * actualNoiseScale
      const noiseInputY = baseY * actualNoiseScale

      const noiseX =
        multiOctaveNoise(noiseInputX, noiseInputY) * displacementAmount
      const noiseY =
        multiOctaveNoise(noiseInputX + 1000, noiseInputY + 1000) *
        displacementAmount

      const x = baseX + noiseX
      const y = baseY + noiseY

      // Vary size based on noise
      const sizeNoise = multiOctaveNoise(
        baseX * sizeNoiseInput,
        baseY * sizeNoiseInput
      )
      const size = baseCellSize * (0.4 + Math.abs(sizeNoise) * 1.2)

      // Color selection based on position and noise
      const colorNoise = multiOctaveNoise(
        baseX * colorNoiseInput,
        baseY * colorNoiseInput
      )
      const colorIndex =
        Math.floor(Math.abs(colorNoise) * colorsLength) % colorsLength
      const primaryColor = colors[colorIndex]

      // Create organic blob shapes
      const numPoints = Math.max(3, 6 + Math.floor(Math.abs(sizeNoise) * 6))
      const blobPoints: Point[] = new Array(numPoints)

      for (let j = 0; j < numPoints; j++) {
        const angle = (j * Math.PI * 2) / numPoints
        const cosAngle = Math.cos(angle)
        const sinAngle = Math.sin(angle)

        const radiusVariation =
          0.6 +
          Math.abs(
            multiOctaveNoise(
              (baseX + cosAngle * 10) * radiusNoiseInput,
              (baseY + sinAngle * 10) * radiusNoiseInput
            )
          ) *
            0.8

        const radius = (size / 2) * radiusVariation
        blobPoints[j] = {
          x: x + cosAngle * radius,
          y: y + sinAngle * radius,
        }
      }

      commands[commandIndex++] = {
        type: 'polygon',
        position: { x, y },
        points: blobPoints,
        color: primaryColor,
        strokeColor: '#555555',
        strokeWeight: Math.max(0.3, size / 25),
        alpha: 0.6 + Math.abs(sizeNoise) * 0.4,
      }
    }

    // Clear cache to prevent memory leak
    noiseCache.clear()

    // Trim array
    commands.length = commandIndex
    return commands
  })
}

/**
 * Compare performance between original and optimized implementations
 */
export function comparePerformance(
  layer: Layer,
  originalFn: (layer: Layer) => DrawingCommand[],
  optimizedFn: (layer: Layer) => DrawingCommand[]
) {
  enablePerformanceMonitoring(true)

  // Warm up
  originalFn(layer)
  optimizedFn(layer)

  // Clear performance data
  performanceData = {}

  // Run multiple iterations for better accuracy
  const iterations = 10

  // eslint-disable-next-line no-console
  console.group('Performance Comparison')
  // eslint-disable-next-line no-console
  console.log(
    `Running ${iterations} iterations with density: ${layer.parameters.density}`
  )

  let originalTotal = 0
  let optimizedTotal = 0

  for (let i = 0; i < iterations; i++) {
    const originalStart = performance.now()
    originalFn(layer)
    const originalEnd = performance.now()
    originalTotal += originalEnd - originalStart

    const optimizedStart = performance.now()
    optimizedFn(layer)
    const optimizedEnd = performance.now()
    optimizedTotal += optimizedEnd - optimizedStart
  }

  const originalAvg = originalTotal / iterations
  const optimizedAvg = optimizedTotal / iterations
  const improvement = ((originalAvg - optimizedAvg) / originalAvg) * 100

  // eslint-disable-next-line no-console
  console.log(`Original average: ${originalAvg.toFixed(2)}ms`)
  // eslint-disable-next-line no-console
  console.log(`Optimized average: ${optimizedAvg.toFixed(2)}ms`)
  // eslint-disable-next-line no-console
  console.log(`Performance improvement: ${improvement.toFixed(1)}%`)
  // eslint-disable-next-line no-console
  console.log(`Speed multiplier: ${(originalAvg / optimizedAvg).toFixed(2)}x`)
  // eslint-disable-next-line no-console
  console.groupEnd()

  enablePerformanceMonitoring(false)

  return {
    originalAvg,
    optimizedAvg,
    improvement,
    speedMultiplier: originalAvg / optimizedAvg,
  }
}
