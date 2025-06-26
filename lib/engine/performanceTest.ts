import type { Layer } from '@/lib/types'
import {
  generateUniformGrid,
  generateNoiseDisplacementGrid,
} from './basicAlgorithms'
import {
  generateUniformGridOptimized,
  generateNoiseDisplacementGridOptimized,
  comparePerformance,
} from './optimizedBasicAlgorithms'

// Create test layer configurations for different density levels
function createTestLayer(density: number): Layer {
  return {
    id: 'test-layer',
    name: 'Test Layer',
    type: 'grid',
    visible: true,
    locked: false,
    isClipped: false,
    parameters: {
      algorithm: 'uniform',
      density,
      gutter: 5,
      colorPalette: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981'],
      shapeVariety: 1,
      sizeVariation: 3,
      displacementIntensity: 1,
      noiseScale: 0.005,
      octaves: 4,
      canvasWidth: 800,
      canvasHeight: 600,
    },
    animation: {
      type: 'none',
      speed: 1,
      duration: 2,
    },
  }
}

/**
 * Run performance tests for different density levels
 */
export function runPerformanceTests() {
  const testDensities = [10, 20, 30, 40, 50]
  const results: any[] = []

  for (const density of testDensities) {
    const testLayer = createTestLayer(density)

    // Test Uniform Grid
    const uniformResults = comparePerformance(
      testLayer,
      generateUniformGrid,
      generateUniformGridOptimized
    )

    // Test Noise Displacement Grid
    const noiseResults = comparePerformance(
      testLayer,
      generateNoiseDisplacementGrid,
      generateNoiseDisplacementGridOptimized
    )

    results.push({
      density,
      uniform: uniformResults,
      noise: noiseResults,
    })
  }

  // Summary calculations (no console output)
  const avgUniformImprovement =
    results.reduce((sum, r) => sum + r.uniform.improvement, 0) / results.length
  const avgNoiseImprovement =
    results.reduce((sum, r) => sum + r.noise.improvement, 0) / results.length

  // Optionally, could return summary as well
  return {
    results,
    avgUniformImprovement,
    avgNoiseImprovement,
  }
}

/**
 * Quick test function for development
 */
export function quickPerformanceTest() {
  const testLayer = createTestLayer(30)

  comparePerformance(
    testLayer,
    generateUniformGrid,
    generateUniformGridOptimized
  )

  comparePerformance(
    testLayer,
    generateNoiseDisplacementGrid,
    generateNoiseDisplacementGridOptimized
  )
}

// Example usage for testing in browser console:
// import { quickPerformanceTest, runPerformanceTests } from '@/lib/engine/performanceTest'
// quickPerformanceTest()
// runPerformanceTests()
