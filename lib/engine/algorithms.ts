import type { Layer, DrawingCommand, Point } from '@/lib/types'

// Default canvas dimensions - will be overridden by actual canvas size
const DEFAULT_CANVAS_WIDTH = 800
const DEFAULT_CANVAS_HEIGHT = 600

// Helper function to get canvas dimensions from layer parameters or use defaults
const getCanvasSize = (layer: Layer) => {
  return {
    width: layer.parameters.canvasWidth || DEFAULT_CANVAS_WIDTH,
    height: layer.parameters.canvasHeight || DEFAULT_CANVAS_HEIGHT,
  }
}

// Utility functions
const getRandomColor = (palette: string[]): string => {
  return palette[Math.floor(Math.random() * palette.length)]
}

// Create a varied color palette from a single base color
const createColorPalette = (baseColors: string[]): string[] => {
  if (baseColors.length > 1) return baseColors // Already have multiple colors

  const baseColor = baseColors[0] || '#a855f7'

  // Define color variations based on the base color
  const colorVariations: Record<string, string[]> = {
    purple: ['#9333ea', '#a855f7', '#c084fc', '#ddd6fe', '#7c3aed'],
    blue: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#1d4ed8'],
    green: ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#15803d'],
    red: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#b91c1c'],
    yellow: ['#ca8a04', '#eab308', '#facc15', '#fde047', '#a16207'],
    pink: ['#db2777', '#ec4899', '#f472b6', '#f9a8d4', '#be185d'],
    indigo: ['#4338ca', '#6366f1', '#818cf8', '#a5b4fc', '#3730a3'],
    teal: ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#0f766e'],
  }

  // Find matching color name or use purple as default
  for (const [colorName, palette] of Object.entries(colorVariations)) {
    if (baseColor.includes(colorName) || baseColors[0] === colorName) {
      return palette
    }
  }

  return colorVariations.purple // Default fallback
}

// Improved Perlin noise implementation
class PerlinNoise {
  private perm: number[] = []

  constructor() {
    for (let i = 0; i < 256; i++) {
      this.perm[i] = i
    }
    // Shuffle
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.perm[i], this.perm[j]] = [this.perm[j], this.perm[i]]
    }
    // Duplicate
    for (let i = 0; i < 256; i++) {
      this.perm[i + 256] = this.perm[i]
    }
  }

  fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  lerp(t: number, a: number, b: number): number {
    return a + t * (b - a)
  }

  grad(hash: number, x: number, y: number): number {
    const h = hash & 3
    const u = h < 2 ? x : y
    const v = h < 2 ? y : x
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255

    const xf = x - Math.floor(x)
    const yf = y - Math.floor(y)

    const u = this.fade(xf)
    const v = this.fade(yf)

    const aa = this.perm[X + this.perm[Y]]
    const ab = this.perm[X + this.perm[Y + 1]]
    const ba = this.perm[X + 1 + this.perm[Y]]
    const bb = this.perm[X + 1 + this.perm[Y + 1]]

    const x1 = this.lerp(u, this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf))
    const x2 = this.lerp(
      u,
      this.grad(ab, xf, yf - 1),
      this.grad(bb, xf - 1, yf - 1)
    )

    return this.lerp(v, x1, x2)
  }
}

const perlinNoise = new PerlinNoise()

export const generateUniformGrid = (layer: Layer): DrawingCommand[] => {
  const commands: DrawingCommand[] = []
  const {
    density,
    gutter = 5,
    colorPalette,
    shapeVariety = 2,
    sizeVariation = 3,
  } = layer.parameters
  const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasSize(layer)

  const baseCellSize = Math.max(10, 100 - density * 0.8)
  const spacing = baseCellSize + gutter

  const cols = Math.floor(CANVAS_WIDTH / spacing)
  const rows = Math.floor(CANVAS_HEIGHT / spacing)

  const offsetX = (CANVAS_WIDTH - cols * spacing) / 2
  const offsetY = (CANVAS_HEIGHT - rows * spacing) / 2

  // Enhanced color palette
  const colors = createColorPalette(colorPalette)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const baseX = offsetX + col * spacing + baseCellSize / 2
      const baseY = offsetY + row * spacing + baseCellSize / 2

      // Apply size variation
      const sizeMultiplier = 1 + (Math.random() - 0.5) * (sizeVariation / 10)
      const cellSize = baseCellSize * Math.max(0.3, sizeMultiplier)

      // Determine shape based on variety parameter
      const shapeChoice = Math.floor(Math.random() * (shapeVariety + 1))

      // Color selection
      const primaryColor = getRandomColor(colors)
      const secondaryColor = getRandomColor(colors)

      switch (shapeChoice) {
        case 0: // Rectangle (original)
          commands.push({
            type: 'rect',
            position: { x: baseX, y: baseY },
            size: { width: cellSize, height: cellSize },
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight: Math.max(0.5, cellSize / 30),
            alpha: 0.8 + Math.random() * 0.2,
          })
          break

        case 1: // Circle
          commands.push({
            type: 'ellipse',
            position: { x: baseX, y: baseY },
            radius: cellSize / 2,
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight: Math.max(0.5, cellSize / 30),
            alpha: 0.8 + Math.random() * 0.2,
          })
          break

        case 2: // Triangle
          const trianglePoints: Point[] = [
            { x: baseX, y: baseY - cellSize / 2 },
            { x: baseX - cellSize / 2, y: baseY + cellSize / 2 },
            { x: baseX + cellSize / 2, y: baseY + cellSize / 2 },
          ]

          commands.push({
            type: 'polygon',
            position: { x: baseX, y: baseY },
            points: trianglePoints,
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight: Math.max(0.5, cellSize / 30),
            alpha: 0.8 + Math.random() * 0.2,
          })
          break

        case 3: // Diamond
          const diamondPoints: Point[] = [
            { x: baseX, y: baseY - cellSize / 2 },
            { x: baseX + cellSize / 2, y: baseY },
            { x: baseX, y: baseY + cellSize / 2 },
            { x: baseX - cellSize / 2, y: baseY },
          ]

          commands.push({
            type: 'polygon',
            position: { x: baseX, y: baseY },
            points: diamondPoints,
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight: Math.max(0.5, cellSize / 30),
            alpha: 0.8 + Math.random() * 0.2,
          })
          break

        case 4: // Hexagon
          const hexagonPoints: Point[] = []
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6
            hexagonPoints.push({
              x: baseX + (Math.cos(angle) * cellSize) / 2,
              y: baseY + (Math.sin(angle) * cellSize) / 2,
            })
          }

          commands.push({
            type: 'polygon',
            position: { x: baseX, y: baseY },
            points: hexagonPoints,
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight: Math.max(0.5, cellSize / 30),
            alpha: 0.8 + Math.random() * 0.2,
          })
          break

        case 5: // Plus/Cross
          // Vertical bar
          commands.push({
            type: 'rect',
            position: { x: baseX, y: baseY },
            size: { width: cellSize / 3, height: cellSize },
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight: Math.max(0.5, cellSize / 40),
            alpha: 0.8 + Math.random() * 0.2,
          })

          // Horizontal bar
          commands.push({
            type: 'rect',
            position: { x: baseX, y: baseY },
            size: { width: cellSize, height: cellSize / 3 },
            color: secondaryColor,
            strokeColor: '#333333',
            strokeWeight: Math.max(0.5, cellSize / 40),
            alpha: 0.8 + Math.random() * 0.2,
          })
          break

        case 6: // Star
          const starPoints: Point[] = []
          for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI * 2) / 10
            const radius = i % 2 === 0 ? cellSize / 2 : cellSize / 4
            starPoints.push({
              x: baseX + Math.cos(angle) * radius,
              y: baseY + Math.sin(angle) * radius,
            })
          }

          commands.push({
            type: 'polygon',
            position: { x: baseX, y: baseY },
            points: starPoints,
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight: Math.max(0.5, cellSize / 30),
            alpha: 0.8 + Math.random() * 0.2,
          })
          break

        default: // Rounded rectangle for highest variety
          commands.push({
            type: 'rect',
            position: { x: baseX, y: baseY },
            size: { width: cellSize * 0.9, height: cellSize * 0.6 },
            color: primaryColor,
            strokeColor: '#333333',
            strokeWeight: Math.max(0.5, cellSize / 30),
            alpha: 0.8 + Math.random() * 0.2,
          })
          break
      }
    }
  }

  return commands
}

export const generateNoiseDisplacementGrid = (
  layer: Layer
): DrawingCommand[] => {
  const commands: DrawingCommand[] = []
  const {
    density,
    gutter = 5,
    colorPalette,
    shapeVariety = 2,
    displacementIntensity = 1,
    noiseScale = 0.01,
    octaves = 4,
  } = layer.parameters
  const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasSize(layer)

  const baseCellSize = Math.max(8, 80 - density * 0.6)
  const spacing = baseCellSize + gutter
  const displacementAmount = 20 * displacementIntensity

  const cols = Math.floor(CANVAS_WIDTH / spacing)
  const rows = Math.floor(CANVAS_HEIGHT / spacing)

  const offsetX = (CANVAS_WIDTH - cols * spacing) / 2
  const offsetY = (CANVAS_HEIGHT - rows * spacing) / 2

  // Enhanced color palette
  const colors = createColorPalette(colorPalette)

  // Multi-octave noise function
  const multiOctaveNoise = (x: number, y: number): number => {
    let value = 0
    let amplitude = 1
    let frequency = noiseScale

    for (let i = 0; i < octaves; i++) {
      value += perlinNoise.noise2D(x * frequency, y * frequency) * amplitude
      amplitude *= 0.5
      frequency *= 2
    }

    return value
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const baseX = offsetX + col * spacing + baseCellSize / 2
      const baseY = offsetY + row * spacing + baseCellSize / 2

      // Apply enhanced noise-based displacement
      const noiseX = multiOctaveNoise(col * 0.1, row * 0.1) * displacementAmount
      const noiseY =
        multiOctaveNoise(col * 0.1 + 100, row * 0.1 + 100) * displacementAmount

      const x = baseX + noiseX
      const y = baseY + noiseY

      // Vary size based on noise with more variation
      const sizeNoise = multiOctaveNoise(col * 0.05, row * 0.05)
      const size = baseCellSize * (0.5 + Math.abs(sizeNoise) * 0.8)

      // Determine shape based on noise and variety
      const shapeNoise = multiOctaveNoise(col * 0.2, row * 0.2)
      const shapeChoice =
        Math.floor(Math.abs(shapeNoise) * (shapeVariety + 1)) %
        (shapeVariety + 1)

      // Color selection based on position and noise
      const colorNoise = multiOctaveNoise(col * 0.08, row * 0.08)
      const colorIndex =
        Math.floor(Math.abs(colorNoise) * colors.length) % colors.length
      const primaryColor = colors[colorIndex]
      const secondaryColor = colors[(colorIndex + 1) % colors.length]

      // Rotation based on noise
      const rotation = multiOctaveNoise(col * 0.15, row * 0.15) * Math.PI

      switch (shapeChoice) {
        case 0: // Ellipse (original)
          commands.push({
            type: 'ellipse',
            position: { x, y },
            radius: size / 2,
            color: primaryColor,
            strokeColor: '#555555',
            strokeWeight: Math.max(0.3, size / 20),
            alpha: 0.7 + Math.abs(sizeNoise) * 0.3,
          })
          break

        case 1: // Rectangle with rotation effect
          const rectWidth = size * (0.8 + Math.abs(sizeNoise) * 0.4)
          const rectHeight = size * (0.6 + Math.abs(colorNoise) * 0.6)

          commands.push({
            type: 'rect',
            position: { x, y },
            size: { width: rectWidth, height: rectHeight },
            color: primaryColor,
            strokeColor: '#555555',
            strokeWeight: Math.max(0.3, size / 20),
            alpha: 0.7 + Math.abs(sizeNoise) * 0.3,
          })
          break

        case 2: // Triangle pointing in noise direction
          const triangleSize = size * 0.8
          const pointDirection = rotation
          const trianglePoints: Point[] = [
            {
              x: x + (Math.cos(pointDirection) * triangleSize) / 2,
              y: y + (Math.sin(pointDirection) * triangleSize) / 2,
            },
            {
              x: x + (Math.cos(pointDirection + 2.4) * triangleSize) / 2,
              y: y + (Math.sin(pointDirection + 2.4) * triangleSize) / 2,
            },
            {
              x: x + (Math.cos(pointDirection - 2.4) * triangleSize) / 2,
              y: y + (Math.sin(pointDirection - 2.4) * triangleSize) / 2,
            },
          ]

          commands.push({
            type: 'polygon',
            position: { x, y },
            points: trianglePoints,
            color: primaryColor,
            strokeColor: '#555555',
            strokeWeight: Math.max(0.3, size / 20),
            alpha: 0.7 + Math.abs(sizeNoise) * 0.3,
          })
          break

        case 3: // Organic blob (irregular polygon)
          const blobPoints: Point[] = []
          const numPoints = 6 + Math.floor(Math.abs(shapeNoise) * 4)
          for (let i = 0; i < numPoints; i++) {
            const angle = (i * Math.PI * 2) / numPoints
            const radiusVariation =
              0.7 +
              Math.abs(multiOctaveNoise(col * 0.3 + i, row * 0.3 + i)) * 0.6
            const radius = (size / 2) * radiusVariation
            blobPoints.push({
              x: x + Math.cos(angle) * radius,
              y: y + Math.sin(angle) * radius,
            })
          }

          commands.push({
            type: 'polygon',
            position: { x, y },
            points: blobPoints,
            color: primaryColor,
            strokeColor: '#555555',
            strokeWeight: Math.max(0.3, size / 25),
            alpha: 0.6 + Math.abs(sizeNoise) * 0.4,
          })
          break

        case 4: // Line field following noise direction
          const lineLength = size * 1.2
          const lineAngle = rotation
          const lineStart = {
            x: x - (Math.cos(lineAngle) * lineLength) / 2,
            y: y - (Math.sin(lineAngle) * lineLength) / 2,
          }
          const lineEnd = {
            x: x + (Math.cos(lineAngle) * lineLength) / 2,
            y: y + (Math.sin(lineAngle) * lineLength) / 2,
          }

          commands.push({
            type: 'line',
            position: { x, y },
            points: [lineStart, lineEnd],
            color: primaryColor,
            strokeWeight: Math.max(1, size / 10),
            alpha: 0.8 + Math.abs(sizeNoise) * 0.2,
          })
          break

        case 5: // Double circle (ripple effect)
          commands.push({
            type: 'ellipse',
            position: { x, y },
            radius: size / 2,
            color: primaryColor,
            strokeColor: '#555555',
            strokeWeight: Math.max(0.3, size / 20),
            alpha: 0.4 + Math.abs(sizeNoise) * 0.3,
          })

          commands.push({
            type: 'ellipse',
            position: { x, y },
            radius: size / 4,
            color: secondaryColor,
            strokeColor: '#333333',
            strokeWeight: Math.max(0.2, size / 30),
            alpha: 0.7 + Math.abs(colorNoise) * 0.3,
          })
          break

        default: // Complex multi-element shape
          // Central shape
          commands.push({
            type: 'ellipse',
            position: { x, y },
            radius: size / 3,
            color: primaryColor,
            strokeColor: '#555555',
            strokeWeight: Math.max(0.3, size / 25),
            alpha: 0.8,
          })

          // Surrounding elements
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2 + rotation
            const distance = size / 2
            const satelliteX = x + Math.cos(angle) * distance
            const satelliteY = y + Math.sin(angle) * distance

            commands.push({
              type: 'ellipse',
              position: { x: satelliteX, y: satelliteY },
              radius: size / 6,
              color: secondaryColor,
              strokeColor: '#666666',
              strokeWeight: Math.max(0.2, size / 40),
              alpha: 0.6,
            })
          }
          break
      }
    }
  }

  return commands
}

export const generateRecursiveSubdivision = (
  layer: Layer
): DrawingCommand[] => {
  const commands: DrawingCommand[] = []
  const {
    density,
    colorPalette,
    subdivisions = 3,
    threshold = 0.5,
    shapeVariety = 1,
    colorVariation = 3,
  } = layer.parameters
  const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasSize(layer)

  // Calculate subdivision parameters - allow deeper subdivisions
  const maxDepth = Math.max(2, Math.min(subdivisions, 12))
  const minSize = Math.max(
    8, // Reduced minimum size to allow more subdivisions
    Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / (10 + density / 3)
  )

  // Create regions to track subdivisions
  interface Region {
    x: number
    y: number
    width: number
    height: number
    depth: number
  }

  const regions: Region[] = []

  // Start with the full canvas
  regions.push({
    x: 0,
    y: 0,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    depth: 0,
  })

  // Process regions iteratively to avoid recursion issues
  while (regions.length > 0) {
    const region = regions.shift()!

    // Check if we should subdivide this region
    // Force subdivision for early depths, then use probability
    let shouldSubdivide = false

    if (
      region.depth < maxDepth &&
      region.width > minSize &&
      region.height > minSize
    ) {
      if (region.depth < 2) {
        // Force subdivision for first 2 levels to ensure we get some structure
        shouldSubdivide = true
      } else {
        // Use threshold for deeper levels - higher threshold = more subdivisions
        const subdivisionChance = threshold * (1 - region.depth * 0.1)
        shouldSubdivide = Math.random() < Math.max(0.2, subdivisionChance)
      }
    }

    if (!shouldSubdivide) {
      // Draw this region with shape variety
      const padding = Math.max(2, region.width * 0.05, region.height * 0.05)
      const centerX = region.x + region.width / 2
      const centerY = region.y + region.height / 2
      const shapeWidth = region.width - padding
      const shapeHeight = region.height - padding

      // Enhanced color palette with variation
      const colors = createColorPalette(colorPalette)
      const colorIndex =
        (region.x + region.y + region.depth * colorVariation) % colors.length
      const primaryColor = colors[Math.floor(colorIndex)]
      const secondaryColor =
        colors[Math.floor((colorIndex + 1) % colors.length)]

      // Shape choice based on region properties and variety setting
      const shapeChoice =
        Math.floor((region.x + region.y + region.depth) * 0.01) %
        (shapeVariety + 1)

      switch (shapeChoice) {
        case 0: // Rectangle (original)
          commands.push({
            type: 'rect',
            position: { x: centerX, y: centerY },
            size: { width: shapeWidth, height: shapeHeight },
            color: primaryColor,
            strokeColor: '#000000',
            strokeWeight: Math.max(0.5, 2 - region.depth * 0.3),
            alpha: 0.7 + Math.random() * 0.3,
          })
          break

        case 1: // Ellipse
          const radius = Math.min(shapeWidth, shapeHeight) / 2
          commands.push({
            type: 'ellipse',
            position: { x: centerX, y: centerY },
            radius: radius,
            color: primaryColor,
            strokeColor: '#000000',
            strokeWeight: Math.max(0.5, 2 - region.depth * 0.3),
            alpha: 0.7 + Math.random() * 0.3,
          })
          break

        case 2: // Triangle
          const trianglePoints: Point[] = [
            { x: centerX, y: centerY - shapeHeight / 2 },
            { x: centerX - shapeWidth / 2, y: centerY + shapeHeight / 2 },
            { x: centerX + shapeWidth / 2, y: centerY + shapeHeight / 2 },
          ]

          commands.push({
            type: 'polygon',
            position: { x: centerX, y: centerY },
            points: trianglePoints,
            color: primaryColor,
            strokeColor: '#000000',
            strokeWeight: Math.max(0.5, 2 - region.depth * 0.3),
            alpha: 0.7 + Math.random() * 0.3,
          })
          break

        case 3: // Diamond
          const diamondPoints: Point[] = [
            { x: centerX, y: centerY - shapeHeight / 2 },
            { x: centerX + shapeWidth / 2, y: centerY },
            { x: centerX, y: centerY + shapeHeight / 2 },
            { x: centerX - shapeWidth / 2, y: centerY },
          ]

          commands.push({
            type: 'polygon',
            position: { x: centerX, y: centerY },
            points: diamondPoints,
            color: primaryColor,
            strokeColor: '#000000',
            strokeWeight: Math.max(0.5, 2 - region.depth * 0.3),
            alpha: 0.7 + Math.random() * 0.3,
          })
          break

        case 4: // Cross/Plus
          // Vertical bar
          commands.push({
            type: 'rect',
            position: { x: centerX, y: centerY },
            size: { width: shapeWidth / 3, height: shapeHeight },
            color: primaryColor,
            strokeColor: '#000000',
            strokeWeight: Math.max(0.3, 1.5 - region.depth * 0.2),
            alpha: 0.8,
          })

          // Horizontal bar
          commands.push({
            type: 'rect',
            position: { x: centerX, y: centerY },
            size: { width: shapeWidth, height: shapeHeight / 3 },
            color: secondaryColor,
            strokeColor: '#000000',
            strokeWeight: Math.max(0.3, 1.5 - region.depth * 0.2),
            alpha: 0.8,
          })
          break

        default: // Nested rectangles for highest variety
          // Outer rectangle
          commands.push({
            type: 'rect',
            position: { x: centerX, y: centerY },
            size: { width: shapeWidth, height: shapeHeight },
            color: primaryColor,
            strokeColor: '#000000',
            strokeWeight: Math.max(0.5, 2 - region.depth * 0.3),
            alpha: 0.6,
          })

          // Inner rectangle
          commands.push({
            type: 'rect',
            position: { x: centerX, y: centerY },
            size: { width: shapeWidth * 0.6, height: shapeHeight * 0.6 },
            color: secondaryColor,
            strokeColor: '#222222',
            strokeWeight: Math.max(0.3, 1.5 - region.depth * 0.2),
            alpha: 0.8,
          })
          break
      }

      continue
    }

    // Decide how to split this region
    const aspectRatio = region.width / region.height
    let splitVertically: boolean

    if (aspectRatio > 1.5) {
      // Wide rectangle - prefer vertical split
      splitVertically = true
    } else if (aspectRatio < 0.67) {
      // Tall rectangle - prefer horizontal split
      splitVertically = false
    } else {
      // Square-ish - random choice
      splitVertically = Math.random() > 0.5
    }

    if (splitVertically) {
      // Split vertically (left/right)
      const splitRatio = 0.3 + Math.random() * 0.4 // 30% to 70%
      const splitPosition = region.width * splitRatio

      // Left region
      regions.push({
        x: region.x,
        y: region.y,
        width: splitPosition,
        height: region.height,
        depth: region.depth + 1,
      })

      // Right region
      regions.push({
        x: region.x + splitPosition,
        y: region.y,
        width: region.width - splitPosition,
        height: region.height,
        depth: region.depth + 1,
      })
    } else {
      // Split horizontally (top/bottom)
      const splitRatio = 0.3 + Math.random() * 0.4 // 30% to 70%
      const splitPosition = region.height * splitRatio

      // Top region
      regions.push({
        x: region.x,
        y: region.y,
        width: region.width,
        height: splitPosition,
        depth: region.depth + 1,
      })

      // Bottom region
      regions.push({
        x: region.x,
        y: region.y + splitPosition,
        width: region.width,
        height: region.height - splitPosition,
        depth: region.depth + 1,
      })
    }
  }

  return commands
}

export const generateIsometricGrid = (layer: Layer): DrawingCommand[] => {
  const commands: DrawingCommand[] = []
  const {
    density,
    colorPalette,
    perspective = 0.5,
    shapeVariety = 3,
    heightVariation = 2,
  } = layer.parameters
  const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasSize(layer)

  // Scale cell size based on canvas and density
  const baseCellSize = Math.max(10, Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 15)
  const cellSize = Math.max(8, baseCellSize * (1 - density / 200))

  // Use perspective parameter to control isometric perspective
  const perspectiveAngle = Math.PI / 12 + (perspective * Math.PI) / 3 // 15° to 75°
  const isoWidth = cellSize * Math.cos(perspectiveAngle)
  const isoHeight = cellSize * Math.sin(perspectiveAngle)

  // Add perspective scaling
  const perspectiveScale = 1 + perspective * 0.5
  const scaledIsoWidth = isoWidth * perspectiveScale
  const scaledIsoHeight = isoHeight * perspectiveScale

  // Calculate grid spacing
  const gridSpacingX = scaledIsoWidth * 1.8
  const gridSpacingY = scaledIsoHeight * 1.6
  const cols = Math.ceil(CANVAS_WIDTH / gridSpacingX) + 1
  const rows = Math.ceil(CANVAS_HEIGHT / gridSpacingY) + 1

  // Center the grid
  const offsetX = (CANVAS_WIDTH - (cols - 1) * gridSpacingX) / 2
  const offsetY = (CANVAS_HEIGHT - (rows - 1) * gridSpacingY) / 2

  // Shape generation functions
  const createIsometricCube = (
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    depth: number
  ) => {
    const topFace: Point[] = [
      { x: centerX, y: centerY - height },
      { x: centerX + width, y: centerY - height + depth },
      { x: centerX + width - width, y: centerY - height + depth + width },
      { x: centerX - width, y: centerY - height + width },
    ]

    const leftFace: Point[] = [
      { x: centerX - width, y: centerY - height + width },
      { x: centerX - width, y: centerY + width },
      { x: centerX, y: centerY + height },
      { x: centerX, y: centerY - height },
    ]

    const rightFace: Point[] = [
      { x: centerX, y: centerY - height },
      { x: centerX, y: centerY + height },
      { x: centerX + width, y: centerY + height + depth },
      { x: centerX + width, y: centerY - height + depth },
    ]

    return { topFace, leftFace, rightFace }
  }

  const createIsometricPyramid = (
    centerX: number,
    centerY: number,
    width: number,
    height: number
  ) => {
    const base: Point[] = [
      { x: centerX - width, y: centerY },
      { x: centerX, y: centerY - width * 0.5 },
      { x: centerX + width, y: centerY },
      { x: centerX, y: centerY + width * 0.5 },
    ]

    const apex = { x: centerX, y: centerY - height }

    return { base, apex }
  }

  const createIsometricCylinder = (
    centerX: number,
    centerY: number,
    radius: number,
    height: number
  ) => {
    const ellipseTop = {
      x: centerX,
      y: centerY - height,
      radiusX: radius,
      radiusY: radius * 0.3,
    }
    const ellipseBottom = {
      x: centerX,
      y: centerY,
      radiusX: radius,
      radiusY: radius * 0.3,
    }

    const sides: Point[] = [
      { x: centerX - radius, y: centerY - height + radius * 0.3 },
      { x: centerX - radius, y: centerY - radius * 0.3 },
      { x: centerX + radius, y: centerY - radius * 0.3 },
      { x: centerX + radius, y: centerY - height + radius * 0.3 },
    ]

    return { ellipseTop, ellipseBottom, sides }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = offsetX + col * gridSpacingX + (row % 2) * gridSpacingX * 0.5
      const y = offsetY + row * gridSpacingY

      // Skip if outside canvas bounds
      if (
        x < -scaledIsoWidth ||
        x > CANVAS_WIDTH + scaledIsoWidth ||
        y < -scaledIsoHeight ||
        y > CANVAS_HEIGHT + scaledIsoHeight
      )
        continue

      const centerX = x
      const centerY = y

      // Determine shape based on shapeVariety parameter
      const shapeChoice = Math.floor(Math.random() * (shapeVariety + 1))

      // Apply height variation
      const heightMultiplier = 1 + (Math.random() - 0.5) * (heightVariation / 5)
      const currentHeight = scaledIsoHeight * heightMultiplier
      const currentWidth = scaledIsoWidth * (0.8 + Math.random() * 0.4)

      // Color variations
      const colors = createColorPalette(colorPalette)
      const primaryColor = getRandomColor(colors)
      const secondaryColor = getRandomColor(colors)
      const shadowColor = '#333333'

      switch (shapeChoice) {
        case 0: // Hexagon (original)
          const perspectiveDistortion = 1 + (perspective - 0.5) * 0.8
          const hexPoints: Point[] = [
            { x: centerX, y: centerY - currentHeight * perspectiveDistortion },
            {
              x: centerX + currentWidth,
              y: centerY - currentHeight * 0.5 * perspectiveDistortion,
            },
            {
              x: centerX + currentWidth,
              y: centerY + currentHeight * 0.5 * perspectiveDistortion,
            },
            { x: centerX, y: centerY + currentHeight * perspectiveDistortion },
            {
              x: centerX - currentWidth,
              y: centerY + currentHeight * 0.5 * perspectiveDistortion,
            },
            {
              x: centerX - currentWidth,
              y: centerY - currentHeight * 0.5 * perspectiveDistortion,
            },
          ]

          commands.push({
            type: 'polygon',
            position: { x: centerX, y: centerY },
            points: hexPoints,
            color: primaryColor,
            strokeColor: shadowColor,
            strokeWeight: 1,
            alpha: 0.8 + Math.random() * 0.2,
          })
          break

        case 1: // Isometric cube
          const cube = createIsometricCube(
            centerX,
            centerY,
            currentWidth * 0.6,
            currentHeight,
            currentWidth * 0.3
          )

          // Draw cube faces with different shades
          commands.push({
            type: 'polygon',
            position: { x: centerX, y: centerY },
            points: cube.topFace,
            color: primaryColor,
            strokeColor: shadowColor,
            strokeWeight: 1,
            alpha: 0.9,
          })

          commands.push({
            type: 'polygon',
            position: { x: centerX, y: centerY },
            points: cube.leftFace,
            color: secondaryColor,
            strokeColor: shadowColor,
            strokeWeight: 1,
            alpha: 0.7,
          })

          commands.push({
            type: 'polygon',
            position: { x: centerX, y: centerY },
            points: cube.rightFace,
            color: primaryColor,
            strokeColor: shadowColor,
            strokeWeight: 1,
            alpha: 0.6,
          })
          break

        case 2: // Triangle/Pyramid
          const pyramid = createIsometricPyramid(
            centerX,
            centerY,
            currentWidth,
            currentHeight
          )

          commands.push({
            type: 'polygon',
            position: { x: centerX, y: centerY },
            points: pyramid.base,
            color: secondaryColor,
            strokeColor: shadowColor,
            strokeWeight: 1,
            alpha: 0.7,
          })

          // Draw pyramid sides as triangles
          for (let i = 0; i < pyramid.base.length; i++) {
            const nextI = (i + 1) % pyramid.base.length
            const trianglePoints = [
              pyramid.base[i],
              pyramid.base[nextI],
              pyramid.apex,
            ]

            commands.push({
              type: 'polygon',
              position: { x: centerX, y: centerY },
              points: trianglePoints,
              color: i % 2 === 0 ? primaryColor : secondaryColor,
              strokeColor: shadowColor,
              strokeWeight: 1,
              alpha: 0.8,
            })
          }
          break

        case 3: // Circle/Ellipse
          commands.push({
            type: 'ellipse',
            position: { x: centerX, y: centerY },
            radius: currentWidth,
            color: primaryColor,
            strokeColor: shadowColor,
            strokeWeight: 1,
            alpha: 0.8,
          })
          break

        default: // Complex shapes for higher variety values
          if (shapeVariety >= 4) {
            // Cylinder
            const cylinder = createIsometricCylinder(
              centerX,
              centerY,
              currentWidth * 0.6,
              currentHeight
            )

            // Draw cylinder parts
            commands.push({
              type: 'polygon',
              position: { x: centerX, y: centerY },
              points: cylinder.sides,
              color: secondaryColor,
              strokeColor: shadowColor,
              strokeWeight: 1,
              alpha: 0.6,
            })

            commands.push({
              type: 'ellipse',
              position: {
                x: cylinder.ellipseBottom.x,
                y: cylinder.ellipseBottom.y,
              },
              radius: cylinder.ellipseBottom.radiusX,
              color: primaryColor,
              strokeColor: shadowColor,
              strokeWeight: 1,
              alpha: 0.8,
            })

            commands.push({
              type: 'ellipse',
              position: { x: cylinder.ellipseTop.x, y: cylinder.ellipseTop.y },
              radius: cylinder.ellipseTop.radiusX,
              color: primaryColor,
              strokeColor: shadowColor,
              strokeWeight: 1,
              alpha: 0.9,
            })
          } else {
            // Fallback to rectangle
            commands.push({
              type: 'rect',
              position: { x: centerX, y: centerY },
              size: { width: currentWidth * 1.4, height: currentHeight * 1.4 },
              color: primaryColor,
              strokeColor: shadowColor,
              strokeWeight: 1,
              alpha: 0.8,
            })
          }
          break
      }
    }
  }

  return commands
}

// Advanced Algorithms

// 1. Perlin Noise Fields Algorithm
export const generatePerlinNoiseFields = (layer: Layer): DrawingCommand[] => {
  const commands: DrawingCommand[] = []
  const {
    density,
    colorPalette,
    flowSpeed = 0.01,
    fieldStrength = 1,
  } = layer.parameters
  const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasSize(layer)

  // Ensure good resolution scaling across different canvas sizes
  const baseResolution = Math.max(8, Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 20)
  const resolution = Math.max(
    baseResolution,
    baseResolution * (1 - density / 100)
  )
  const cols = Math.ceil(CANVAS_WIDTH / resolution)
  const rows = Math.ceil(CANVAS_HEIGHT / resolution)

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = x * resolution + resolution / 2
      const py = y * resolution + resolution / 2

      // Skip if outside canvas bounds
      if (px >= CANVAS_WIDTH || py >= CANVAS_HEIGHT) continue

      // Get noise value for flow direction
      const angle =
        perlinNoise.noise2D(px * flowSpeed, py * flowSpeed) * Math.PI * 2
      const length = resolution * 0.7 * fieldStrength

      const endX = px + Math.cos(angle) * length
      const endY = py + Math.sin(angle) * length

      commands.push({
        type: 'line',
        position: { x: px, y: py },
        points: [
          { x: px, y: py },
          { x: endX, y: endY },
        ],
        color: getRandomColor(createColorPalette(colorPalette)),
        strokeWeight: Math.max(
          0.5,
          1 + perlinNoise.noise2D(px * flowSpeed * 2, py * flowSpeed * 2) * 2
        ),
        alpha: 0.7,
      })
    }
  }

  return commands
}

// 2. Fractal Trees Algorithm
export const generateFractalTrees = (layer: Layer): DrawingCommand[] => {
  const commands: DrawingCommand[] = []
  const {
    density,
    colorPalette,
    depth = 6,
    angle = 25,
    branchLength = 0.7,
    branchAngle = 25,
    iterations = 6,
    treeCount = 8, // Direct tree count parameter
  } = layer.parameters
  const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasSize(layer)

  // Use the direct treeCount parameter, with fallback to density-based calculation
  const finalTreeCount =
    treeCount ||
    Math.max(
      5,
      Math.floor(
        ((CANVAS_WIDTH * CANVAS_HEIGHT) / 50000) * Math.max(1, density / 5)
      )
    )

  const angleRad = ((branchAngle || angle) * Math.PI) / 180
  const maxDepth = Math.max(3, Math.min(iterations || depth, 10))
  const lengthRatio = Math.max(0.4, Math.min(branchLength || 0.7, 0.9))

  const drawBranch = (
    x: number,
    y: number,
    len: number,
    angle: number,
    currentDepth: number
  ) => {
    if (currentDepth === 0 || len < 0.5) return

    // More generous bound check for better canvas filling
    if (
      x < -100 ||
      x > CANVAS_WIDTH + 100 ||
      y < -100 ||
      y > CANVAS_HEIGHT + 100
    )
      return

    const endX = x + Math.cos(angle) * len
    const endY = y + Math.sin(angle) * len

    commands.push({
      type: 'line',
      position: { x, y },
      points: [
        { x, y },
        { x: endX, y: endY },
      ],
      color: getRandomColor(colorPalette),
      strokeWeight: Math.max(0.3, currentDepth * 0.6 + Math.random() * 0.5),
      alpha: 0.7 + Math.random() * 0.3,
    })

    // Enhanced branching with more variety
    const lengthVariation = lengthRatio * (0.85 + Math.random() * 0.3) // More variation
    const newLen = len * lengthVariation
    const angleVariation = angleRad * (0.6 + Math.random() * 0.8) // More angular variety

    // Primary branches
    drawBranch(endX, endY, newLen, angle - angleVariation, currentDepth - 1)
    drawBranch(endX, endY, newLen, angle + angleVariation, currentDepth - 1)

    // Additional branches for fuller coverage - increased probability
    if (Math.random() > 0.3 && currentDepth > 1) {
      // Increased from 0.5 to 0.3
      const thirdAngle = angle + (Math.random() - 0.5) * angleRad * 1.2
      drawBranch(endX, endY, newLen * 0.85, thirdAngle, currentDepth - 1)
    }

    // More asymmetric branches
    if (Math.random() > 0.4 && currentDepth > 1) {
      // Increased from 0.7 to 0.4
      const asymAngle =
        angle +
        (Math.random() > 0.5 ? 1 : -1) * angleRad * (1.2 + Math.random() * 0.8)
      drawBranch(
        endX,
        endY,
        newLen * (0.5 + Math.random() * 0.3),
        asymAngle,
        currentDepth - 1
      )
    }

    // Add even more branches for very dense configurations
    if (Math.random() > 0.6 && currentDepth > 2 && density > 30) {
      const extraAngle = angle + (Math.random() - 0.5) * angleRad * 2
      drawBranch(endX, endY, newLen * 0.7, extraAngle, currentDepth - 2)
    }
  }

  // Create a more comprehensive forest layout
  if (finalTreeCount <= 8) {
    // Medium tree count: strategic placement in rows
    const rows = Math.ceil(Math.sqrt(finalTreeCount))
    const cols = Math.ceil(finalTreeCount / rows)

    for (let i = 0; i < finalTreeCount; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols

      // Add some randomness to grid positioning
      const baseX = (CANVAS_WIDTH / (cols + 1)) * (col + 1)
      const baseY = CANVAS_HEIGHT * (0.6 + (row * 0.3) / rows)

      const x = baseX + (Math.random() - 0.5) * (CANVAS_WIDTH / cols) * 0.4
      const y = baseY + (Math.random() - 0.5) * (CANVAS_HEIGHT * 0.2)

      // Vary tree sizes significantly
      const sizeVariation = 0.6 + Math.random() * 0.8
      const baseLength = Math.min(CANVAS_HEIGHT * 0.25, 50 + Math.random() * 80)
      const initialLength = baseLength * sizeVariation

      const startAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5

      drawBranch(x, y, initialLength, startAngle, maxDepth)
    }
  } else {
    // Many trees: dense forest with multiple layers
    const layers = [
      {
        yRange: [0.85, 0.95],
        count: Math.floor(finalTreeCount * 0.4),
        size: [0.3, 0.6],
      }, // Foreground
      {
        yRange: [0.65, 0.85],
        count: Math.floor(finalTreeCount * 0.4),
        size: [0.5, 0.9],
      }, // Middle
      {
        yRange: [0.4, 0.65],
        count: Math.floor(finalTreeCount * 0.2),
        size: [0.7, 1.2],
      }, // Background
    ]

    layers.forEach((layerConfig) => {
      for (let i = 0; i < layerConfig.count; i++) {
        const margin = CANVAS_WIDTH * 0.02
        const x = margin + Math.random() * (CANVAS_WIDTH - 2 * margin)
        const y =
          CANVAS_HEIGHT *
          (layerConfig.yRange[0] +
            Math.random() * (layerConfig.yRange[1] - layerConfig.yRange[0]))

        const sizeVariation =
          layerConfig.size[0] +
          Math.random() * (layerConfig.size[1] - layerConfig.size[0])
        const baseLength = Math.min(
          CANVAS_HEIGHT * 0.2,
          30 + Math.random() * 60
        )
        const initialLength = baseLength * sizeVariation

        // More varied starting angles for organic look
        const startAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6

        // Vary depth more dramatically
        const depthVariation = Math.floor((Math.random() - 0.3) * 4)
        const treeDepth = Math.max(2, Math.min(maxDepth + depthVariation, 12))

        drawBranch(x, y, initialLength, startAngle, treeDepth)
      }
    })
  }

  return commands
}

// 3. Particle Systems Algorithm
export const generateParticleSystem = (layer: Layer): DrawingCommand[] => {
  const commands: DrawingCommand[] = []
  const {
    density,
    colorPalette,
    particleCount = 100,
    // gravity and friction would be used in animated particle systems
    // For static generation, they're not needed
  } = layer.parameters
  const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasSize(layer)

  // Scale particle count based on canvas area and density
  const canvasArea = CANVAS_WIDTH * CANVAS_HEIGHT
  const baseCount = Math.max(10, Math.min(particleCount, canvasArea / 5000))
  const count = Math.floor(baseCount * (density / 50))

  for (let i = 0; i < count; i++) {
    const x = Math.random() * CANVAS_WIDTH
    const y = Math.random() * CANVAS_HEIGHT
    const vx = (Math.random() - 0.5) * 4
    const vy = (Math.random() - 0.5) * 4

    // Scale particle size based on canvas size
    const baseSize = Math.max(1, Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 200)
    const size = baseSize + Math.random() * baseSize * 2

    commands.push({
      type: 'particle',
      position: { x, y },
      velocity: { x: vx, y: vy },
      radius: size,
      color: getRandomColor(colorPalette),
      alpha: 0.7,
    })
  }

  return commands
}

// 4. Cellular Automata Algorithm
export const generateCellularAutomata = (layer: Layer): DrawingCommand[] => {
  const commands: DrawingCommand[] = []
  const {
    density,
    colorPalette,
    survivalRules = '23/3',
    generations = 10,
  } = layer.parameters
  const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasSize(layer)

  // Scale cell size based on canvas and density
  const baseCellSize = Math.max(2, Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 80)
  const cellSize = Math.max(1, baseCellSize * (1 - density / 150))
  const cols = Math.floor(CANVAS_WIDTH / cellSize)
  const rows = Math.floor(CANVAS_HEIGHT / cellSize)

  if (cols === 0 || rows === 0) return commands

  // Parse survival rules (format: "survive/birth" like "23/3")
  const [surviveStr, birthStr] = survivalRules.split('/')
  const surviveRuleNumbers = surviveStr
    ? surviveStr.split('').map(Number)
    : [2, 3]
  const birthRuleNumbers = birthStr ? birthStr.split('').map(Number) : [3]

  // Initialize grid with random pattern
  let currentGrid: boolean[][] = []
  for (let row = 0; row < rows; row++) {
    currentGrid[row] = []
    for (let col = 0; col < cols; col++) {
      // Higher chance for alive cells in center, lower at edges for interesting patterns
      const centerDistance = Math.sqrt(
        Math.pow((col - cols / 2) / cols, 2) +
          Math.pow((row - rows / 2) / rows, 2)
      )
      const probability = Math.max(0.1, 0.4 - centerDistance * 0.3)
      currentGrid[row][col] = Math.random() < probability
    }
  }

  // Function to count live neighbors
  const countNeighbors = (
    grid: boolean[][],
    row: number,
    col: number
  ): number => {
    let count = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue // Skip center cell

        const newRow = row + dy
        const newCol = col + dx

        // Handle boundaries - wrap around (toroidal topology)
        const wrappedRow = (newRow + rows) % rows
        const wrappedCol = (newCol + cols) % cols

        if (grid[wrappedRow][wrappedCol]) {
          count++
        }
      }
    }
    return count
  }

  // Run cellular automata simulation for specified generations
  for (let gen = 0; gen < generations; gen++) {
    const nextGrid: boolean[][] = []

    for (let row = 0; row < rows; row++) {
      nextGrid[row] = []
      for (let col = 0; col < cols; col++) {
        const neighbors = countNeighbors(currentGrid, row, col)
        const isCurrentlyAlive = currentGrid[row][col]

        if (isCurrentlyAlive) {
          // Survival rule: alive cell survives if neighbor count is in survival rules
          nextGrid[row][col] = surviveRuleNumbers.includes(neighbors)
        } else {
          // Birth rule: dead cell becomes alive if neighbor count is in birth rules
          nextGrid[row][col] = birthRuleNumbers.includes(neighbors)
        }
      }
    }

    currentGrid = nextGrid
  }

  // Generate drawing commands from final state
  const colors = colorPalette.slice()
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (currentGrid[row][col]) {
        // Use generation-based color variation for visual interest
        const colorIndex = (row * cols + col) % colors.length
        const color = colors[colorIndex] || getRandomColor(colorPalette)

        commands.push({
          type: 'rect',
          position: {
            x: col * cellSize + cellSize / 2,
            y: row * cellSize + cellSize / 2,
          },
          size: { width: cellSize, height: cellSize },
          color,
          strokeWeight: 0,
          alpha: 0.8,
        })
      }
    }
  }

  return commands
}

// 5. L-Systems Algorithm
export const generateLSystem = (layer: Layer): DrawingCommand[] => {
  const commands: DrawingCommand[] = []
  const {
    colorPalette,
    depth = 4,
    iterations = 4,
    angle = 25,
    turnAngle = 90,
    rule = 'F->F[+F]F[-F]F',
    rules = 'F=F+F-F-F+F',
    axiom = 'F',
  } = layer.parameters
  const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasSize(layer)

  // Use iterations parameter if available, otherwise fall back to depth
  const maxDepth = Math.max(2, Math.min(iterations || depth, 7))

  // Use the actual angle parameter (turnAngle has priority, then angle)
  const actualAngle = turnAngle || angle || 25

  // Parse L-System rules - support multiple rules separated by commas
  const actualAxiom = axiom || 'F'
  const ruleSet: Record<string, string> = {}

  // Parse multiple rules - support both -> and = formats
  const actualRules = rules || rule || 'F=F+F-F-F+F'
  const ruleList = actualRules.split(',').map((r) => r.trim())
  for (const singleRule of ruleList) {
    // Support both '->' and '=' separators
    let ruleParts = singleRule.split('->')
    if (ruleParts.length === 1) {
      ruleParts = singleRule.split('=')
    }
    if (ruleParts.length === 2) {
      ruleSet[ruleParts[0].trim()] = ruleParts[1].trim()
    }
  }

  // Default rules for common L-Systems if none provided
  if (Object.keys(ruleSet).length === 0) {
    ruleSet['F'] = 'F[+F]F[-F]F' // Plant-like growth
  }

  // Generate L-System string with length limit to prevent memory issues
  let current = actualAxiom
  const maxLength = 50000 // Prevent memory explosion

  for (let i = 0; i < maxDepth && current.length < maxLength; i++) {
    let next = ''
    for (const char of current) {
      const replacement = ruleSet[char] || char
      if (next.length + replacement.length > maxLength) break
      next += replacement
    }
    current = next
  }

  // Calculate step length based on canvas size and complexity
  const canvasSize = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT)
  const baseStepLength = canvasSize / 12 // Increased from /20 for better screen filling
  const stepLength = Math.max(3, baseStepLength / Math.pow(1.3, maxDepth)) // Reduced decay rate
  const angleRad = (actualAngle * Math.PI) / 180

  // Start position - centered horizontally, positioned for better screen filling
  let x = CANVAS_WIDTH / 2
  let y = CANVAS_HEIGHT * 0.75 // Moved up from 0.85 for better screen utilization
  let currentAngle = -Math.PI / 2 // Start pointing up
  const stack: Array<{ x: number; y: number; angle: number; depth: number }> =
    []
  let currentDepth = 0

  // Track bounds to center the drawing
  let minX = x,
    maxX = x,
    minY = y,
    maxY = y

  // First pass: calculate bounds
  let tempX = x,
    tempY = y,
    tempAngle = currentAngle
  const tempStack: Array<{ x: number; y: number; angle: number }> = []

  for (const char of current) {
    switch (char) {
      case 'F':
      case 'G': // Some L-systems use G as draw forward
        const newTempX = tempX + Math.cos(tempAngle) * stepLength
        const newTempY = tempY + Math.sin(tempAngle) * stepLength
        minX = Math.min(minX, newTempX)
        maxX = Math.max(maxX, newTempX)
        minY = Math.min(minY, newTempY)
        maxY = Math.max(maxY, newTempY)
        tempX = newTempX
        tempY = newTempY
        break
      case '+':
        tempAngle += angleRad
        break
      case '-':
        tempAngle -= angleRad
        break
      case '[':
        tempStack.push({ x: tempX, y: tempY, angle: tempAngle })
        break
      case ']':
        const tempState = tempStack.pop()
        if (tempState) {
          tempX = tempState.x
          tempY = tempState.y
          tempAngle = tempState.angle
        }
        break
    }
  }

  // Center the drawing
  const drawingWidth = maxX - minX
  const drawingHeight = maxY - minY
  const offsetX = (CANVAS_WIDTH - drawingWidth) / 2 - minX
  const offsetY = (CANVAS_HEIGHT - drawingHeight) / 2 - minY

  x += offsetX
  y += offsetY

  // Second pass: actual drawing
  for (const char of current) {
    // Prevent drawing outside reasonable bounds
    if (
      x < -CANVAS_WIDTH ||
      x > CANVAS_WIDTH * 2 ||
      y < -CANVAS_HEIGHT ||
      y > CANVAS_HEIGHT * 2
    ) {
      break
    }

    switch (char) {
      case 'F':
      case 'G': // Draw forward
        const newX = x + Math.cos(currentAngle) * stepLength
        const newY = y + Math.sin(currentAngle) * stepLength

        commands.push({
          type: 'line',
          position: { x, y },
          points: [
            { x, y },
            { x: newX, y: newY },
          ],
          color: getRandomColor(createColorPalette(colorPalette)),
          strokeWeight: Math.max(0.5, 3 - currentDepth * 0.3),
          alpha: 0.8,
        })

        x = newX
        y = newY
        break

      case 'f': // Move forward without drawing
        x += Math.cos(currentAngle) * stepLength
        y += Math.sin(currentAngle) * stepLength
        break

      case '+':
        currentAngle += angleRad
        break

      case '-':
        currentAngle -= angleRad
        break

      case '[':
        stack.push({ x, y, angle: currentAngle, depth: currentDepth })
        currentDepth++
        break

      case ']':
        const state = stack.pop()
        if (state) {
          x = state.x
          y = state.y
          currentAngle = state.angle
          currentDepth = state.depth
        }
        break
    }
  }

  return commands
}
