import type { Layer, DrawingCommand } from '@/lib/types'
import {
  getCanvasSize,
  getRandomColor,
  createColorPalette,
  perlinNoise,
} from './algorithmUtils'

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
    pattern = 'koch',
    axiom = 'F',
    rules = 'F=F+F-F-F+F',
  } = layer.parameters
  const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasSize(layer)

  // Use iterations parameter if available, otherwise fall back to depth
  const maxDepth = Math.max(2, Math.min(iterations || depth, 7))

  // Use the actual angle parameter (turnAngle has priority, then angle)
  const actualAngle = turnAngle || angle || 25

  // Predefined L-System patterns with their axioms and rules (fallback for pattern parameter)
  const lSystemPatterns: Record<
    string,
    { axiom: string; rules: Record<string, string>; requiredAngle?: number }
  > = {
    koch: {
      axiom: 'F',
      rules: { F: 'F+F-F-F+F' },
      requiredAngle: 90,
    },
    dragon: {
      axiom: 'X',
      rules: { X: 'X+YF+', Y: '-FX-Y' },
      requiredAngle: 90,
    },
    sierpinski: {
      axiom: 'F-G-G',
      rules: { F: 'F-G+F+G-F', G: 'GG' },
      requiredAngle: 120,
    },
    plant: {
      axiom: 'X',
      rules: { X: 'F+[[X]-X]-F[-FX]+X', F: 'FF' },
    },
    tree: {
      axiom: 'F',
      rules: { F: 'F[+F]F[-F]F' },
    },
    levy: {
      axiom: 'F',
      rules: { F: '+F--F+' },
      requiredAngle: 45,
    },
    hilbert: {
      axiom: 'A',
      rules: { A: '-BF+AFA+FB-', B: '+AF-BFB-FA+' },
      requiredAngle: 90,
    },
    gosper: {
      axiom: 'F',
      rules: { F: 'F-G--G+F++FF+G-', G: '+F-GG--G-F++F+G' },
      requiredAngle: 60,
    },
  }

  // Prioritize custom axiom and rules parameters over pattern
  let actualAxiom = axiom
  let ruleSet: Record<string, string> = {}

  // If custom rules are provided, parse them
  if (rules && rules !== 'F=F+F-F-F+F' && axiom && axiom !== 'F') {
    // Parse custom rules - support both -> and = formats
    const ruleList = rules.split(',').map((r: string) => r.trim())
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
  } else if (pattern && lSystemPatterns[pattern]) {
    // Use predefined pattern if no custom rules
    const selectedPattern = lSystemPatterns[pattern]
    actualAxiom = selectedPattern.axiom
    ruleSet = selectedPattern.rules
  } else {
    // Default fallback
    const defaultPattern = lSystemPatterns.koch
    actualAxiom = defaultPattern.axiom
    ruleSet = defaultPattern.rules
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
