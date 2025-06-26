import type { Layer, DrawingCommand } from '@/lib/types'
import {
  getCanvasSize,
  getRandomColor,
  createColorPalette,
  createPerlinNoise,
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

  // Create isolated Perlin noise instance for thread safety
  const perlinNoiseInstance = createPerlinNoise()

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
        perlinNoiseInstance.noise2D(px * flowSpeed, py * flowSpeed) *
        Math.PI *
        2
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
          1 +
            perlinNoiseInstance.noise2D(
              px * flowSpeed * 2,
              py * flowSpeed * 2
            ) *
              2
        ),
        alpha: 0.7,
      })
    }
  }

  return commands
}

// 2. Clean Mathematical Fractal Trees Algorithm
export const generateFractalTrees = (layer: Layer): DrawingCommand[] => {
  const commands: DrawingCommand[] = []
  const {
    colorPalette,
    branchLength = 0.8,
    branchAngle = 25,
    iterations = 6,
    treeCount = 3,
    treeSize = 1.0,
    treeHeight = 1.0,
  } = layer.parameters
  const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasSize(layer)

  // Performance safety
  const MAX_COMMANDS = 3000
  let commandCount = 0

  const angleRad = (branchAngle * Math.PI) / 180
  const maxDepth = Math.max(3, Math.min(iterations, 8))

  // Mathematical constants
  const GOLDEN_RATIO = 1.618033988749
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

  // Clean mathematical branching function
  const drawMathematicalBranch = (
    x: number,
    y: number,
    length: number,
    angle: number,
    depth: number
  ) => {
    if (depth === 0 || length < 2 || commandCount >= MAX_COMMANDS) return
    commandCount++

    const endX = x + Math.cos(angle) * length
    const endY = y + Math.sin(angle) * length

    // Bounds check
    if (
      endX < -100 ||
      endX > CANVAS_WIDTH + 100 ||
      endY < -100 ||
      endY > CANVAS_HEIGHT + 100
    )
      return

    commands.push({
      type: 'line',
      position: { x, y },
      points: [
        { x, y },
        { x: endX, y: endY },
      ],
      color: getRandomColor(createColorPalette(colorPalette)),
      strokeWeight: Math.max(0.5, depth * 0.5),
      alpha: 0.8,
    })

    if (depth <= 1) return

    // Mathematical length scaling - clean exponential decay
    const newLength = length * branchLength

    // 1. Binary fractal branches (classic mathematical base)
    const leftAngle = angle - angleRad
    const rightAngle = angle + angleRad

    drawMathematicalBranch(endX, endY, newLength, leftAngle, depth - 1)
    drawMathematicalBranch(endX, endY, newLength, rightAngle, depth - 1)

    // 2. Golden ratio branch (mathematical precision - no randomness)
    if (depth > 2) {
      const goldenBranchAngle = angle + GOLDEN_ANGLE * Math.sin(depth * 0.5)
      const goldenLength = newLength / GOLDEN_RATIO
      drawMathematicalBranch(
        endX,
        endY,
        goldenLength,
        goldenBranchAngle,
        depth - 1
      )
    }

    // 3. Fibonacci spiral branch (deterministic pattern)
    if (depth % 2 === 0 && depth > 1) {
      const fibonacciAngle = angle + depth * GOLDEN_ANGLE * 0.6
      const fibonacciLength = newLength * 0.75
      drawMathematicalBranch(
        endX,
        endY,
        fibonacciLength,
        fibonacciAngle,
        depth - 1
      )
    }

    // 4. Mathematical tertiary branch (logarithmic pattern)
    if (depth > 3) {
      const tertiaryAngle = angle + Math.log(depth) * angleRad
      const tertiaryLength = newLength / GOLDEN_RATIO
      drawMathematicalBranch(
        endX,
        endY,
        tertiaryLength,
        tertiaryAngle,
        depth - 1
      )
    }
  }

  // Generate clean mathematical fractal trees
  const finalTreeCount = Math.min(treeCount, 5) // Max 5 trees for clarity

  for (let i = 0; i < finalTreeCount; i++) {
    // Strategic positioning - well spaced across canvas
    const x =
      CANVAS_WIDTH * (0.15 + (i / Math.max(finalTreeCount - 1, 1)) * 0.7)
    const y = CANVAS_HEIGHT * 0.85

    // Large, prominent tree size for mathematical visibility
    const baseLength =
      Math.min(CANVAS_HEIGHT * 0.5, 200) * treeSize * treeHeight
    const startAngle = -Math.PI / 2 // Straight up

    // Generate clean mathematical fractal tree
    drawMathematicalBranch(x, y, baseLength, startAngle, maxDepth)
  }

  return commands
}
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
