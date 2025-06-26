import type { Layer } from '@/lib/types'

// Default canvas dimensions - will be overridden by actual canvas size
const DEFAULT_CANVAS_WIDTH = 800
const DEFAULT_CANVAS_HEIGHT = 600

// Helper function to get canvas dimensions from layer parameters or use defaults
export const getCanvasSize = (layer: Layer) => {
  return {
    width: layer.parameters.canvasWidth || DEFAULT_CANVAS_WIDTH,
    height: layer.parameters.canvasHeight || DEFAULT_CANVAS_HEIGHT,
  }
}

// Utility functions
export const getRandomColor = (palette: string[]): string => {
  return palette[Math.floor(Math.random() * palette.length)]
}

// Create a varied color palette from a single base color
export const createColorPalette = (baseColors: string[]): string[] => {
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
export class PerlinNoise {
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

/**
 * Thread-safe implementation of Perlin noise generator.
 *
 * Creates a new isolated Perlin noise instance to prevent race conditions
 * when used in concurrent environments such as Web Workers or when multiple
 * algorithms run simultaneously.
 *
 * Each instance maintains its own internal permutation table and state,
 * ensuring that concurrent operations don't interfere with each other.
 *
 * @returns {PerlinNoise} A new isolated Perlin noise instance
 *
 * @example
 * ```typescript
 * // Thread-safe usage in algorithms
 * const noiseInstance = createPerlinNoise();
 * const value = noiseInstance.noise2D(x, y);
 *
 * // In a Web Worker context
 * const workerNoise = createPerlinNoise();
 * self.onmessage = (e) => {
 *   const result = workerNoise.noise2D(e.data.x, e.data.y);
 *   self.postMessage(result);
 * };
 * ```
 *
 * @since 1.0.0
 * @see {@link PerlinNoise} For the noise generator class
 */
export function createPerlinNoise(): PerlinNoise {
  return new PerlinNoise()
}

// Legacy global instance for backward compatibility
// @deprecated Use createPerlinNoise() for new code to ensure thread safety
export const perlinNoise = new PerlinNoise()
