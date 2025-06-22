import type { Layer, DrawingCommand } from '@/lib/types'
import {
  generateUniformGrid,
  generateNoiseDisplacementGrid,
  generateRecursiveSubdivision,
  generateIsometricGrid,
  generatePerlinNoiseFields,
  generateFractalTrees,
  generateParticleSystem,
  generateCellularAutomata,
  generateLSystem,
} from './algorithms'

export const generateDrawingCommands = (layer: Layer): DrawingCommand[] => {
  switch (layer.parameters.algorithm) {
    case 'uniform':
      return generateUniformGrid(layer)
    case 'noise':
      return generateNoiseDisplacementGrid(layer)
    case 'recursive':
      return generateRecursiveSubdivision(layer)
    case 'isometric':
      return generateIsometricGrid(layer)
    case 'perlin':
      return generatePerlinNoiseFields(layer)
    case 'fractal':
      return generateFractalTrees(layer)
    case 'particles':
      return generateParticleSystem(layer)
    case 'cellular':
      return generateCellularAutomata(layer)
    case 'lsystem':
      return generateLSystem(layer)
    default:
      // eslint-disable-next-line no-console
      console.warn('Unknown algorithm type:', layer.parameters.algorithm)
      return []
  }
}

// Utility function to render drawing commands with P5.js
export const renderDrawingCommands = (
  p5: any,
  commands: DrawingCommand[]
): void => {
  commands.forEach((command) => {
    // Set fill color
    p5.fill(command.color)

    // Set stroke
    if (command.strokeColor) {
      p5.stroke(command.strokeColor)
      p5.strokeWeight(command.strokeWeight || 1)
    } else {
      p5.noStroke()
    }

    // Apply rotation if specified
    if (command.rotation) {
      p5.push()
      p5.translate(command.position.x, command.position.y)
      p5.rotate(command.rotation)
      p5.translate(-command.position.x, -command.position.y)
    }

    // Render based on type
    switch (command.type) {
      case 'rect':
        if (command.size) {
          p5.rectMode(p5.CENTER)
          p5.rect(
            command.position.x,
            command.position.y,
            command.size.width,
            command.size.height
          )
        }
        break

      case 'ellipse':
        if (command.radius) {
          p5.ellipse(
            command.position.x,
            command.position.y,
            command.radius * 2,
            command.radius * 2
          )
        }
        break

      case 'line':
        if (command.points && command.points.length >= 2) {
          p5.line(
            command.points[0].x,
            command.points[0].y,
            command.points[1].x,
            command.points[1].y
          )
        }
        break

      case 'triangle':
        if (command.points && command.points.length >= 3) {
          p5.triangle(
            command.points[0].x,
            command.points[0].y,
            command.points[1].x,
            command.points[1].y,
            command.points[2].x,
            command.points[2].y
          )
        }
        break

      case 'quad':
        if (command.points && command.points.length >= 4) {
          p5.quad(
            command.points[0].x,
            command.points[0].y,
            command.points[1].x,
            command.points[1].y,
            command.points[2].x,
            command.points[2].y,
            command.points[3].x,
            command.points[3].y
          )
        }
        break
    }

    // Reset rotation
    if (command.rotation) {
      p5.pop()
    }
  })
}
