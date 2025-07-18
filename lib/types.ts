import type { P5CanvasInstance } from '@p5-wrapper/react'

export type Sketch = (p5: P5CanvasInstance) => void

export interface Point {
  x: number
  y: number
}

export interface DrawingCommand {
  type:
    | 'rect'
    | 'ellipse'
    | 'circle'
    | 'line'
    | 'triangle'
    | 'quad'
    | 'path'
    | 'particle'
    | 'polygon'
  position: Point
  size?: { width: number; height: number }
  radius?: number
  points?: Point[]
  color: string
  strokeColor?: string
  strokeWeight?: number
  rotation?: number
  velocity?: Point
  alpha?: number
  commands?: string // For complex path commands
}

export interface Project {
  layers: Layer[]
  selectedLayerId: string | null
}

export interface Layer {
  id: string
  name: string
  type: 'grid' | 'mask'
  visible: boolean
  locked: boolean
  isClipped: boolean
  parameters: {
    algorithm:
      | 'uniform'
      | 'noise'
      | 'recursive'
      | 'isometric'
      | 'perlin'
      | 'fractal'
      | 'particles'
      | 'cellular'
      | 'lsystem'
    density: number
    gutter: number
    colorPalette: string[]
    // Common visual variations
    shapeVariety?: number
    sizeVariation?: number
    displacementIntensity?: number
    colorVariation?: number
    heightVariation?: number
    // Algorithm-specific params
    scale?: number // For perlin noise
    depth?: number // For fractals and L-systems
    particleCount?: number // For particle systems
    rule?: string // For cellular automata and L-systems
    angle?: number // For fractals and L-systems
    canvasWidth?: number // Canvas dimensions for algorithms
    canvasHeight?: number
    // Noise specific
    noiseScale?: number
    octaves?: number
    // Recursive specific
    subdivisions?: number
    threshold?: number
    // Isometric specific
    perspective?: number
    shape?: string // Shape type for isometric grids
    // Perlin specific
    fieldStrength?: number
    flowSpeed?: number
    // Fractal tree specific params
    branchLength?: number // Length scaling factor for branches
    branchAngle?: number // Branching angle in degrees
    iterations?: number // Number of recursive iterations
    treeCount?: number // Number of trees to generate
    scalingExponent?: number // Scaling exponent (α) for branch thickness
    // Particle specific
    gravity?: number
    friction?: number
    // Cellular specific
    generations?: number
    survivalRules?: string
    // L-System specific
    pattern?: string
    axiom?: string
    rules?: string
    turnAngle?: number
    // Recursive/grid pattern specific
    numColumns?: number // Number of columns for grid/bar pattern
    numRows?: number // Number of rows for grid/bar pattern
    solidBarCount?: number // Number of solid bars before subdivision
    subdivisionMode?: 'linear' | 'exponential' // Subdivision mode for grid/bar
    orientation?: 'vertical' | 'horizontal' | 'both' // Orientation for grid/bar
    cellPadding?: number // Padding between cells/bars
    backgroundColor?: string // Background color for grid/bar
    solidBarCountX?: number
    solidBarCountY?: number
  }
  animation: {
    type: 'none' | 'pulseScale' | 'cycleColor'
    speed: number
    duration: number
  }
}
