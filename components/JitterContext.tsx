'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react'
import { Layer } from '../lib/types'
import { useEngine } from '../lib/engine/engineContext'

interface AlgorithmParams {
  // Common parameters
  density: number
  gutter?: number
  // Visual variation parameters
  shapeVariety?: number
  sizeVariation?: number
  displacementIntensity?: number
  colorVariation?: number
  heightVariation?: number
  // Noise specific
  noiseScale?: number
  octaves?: number
  // Recursive specific
  subdivisions?: number
  threshold?: number
  numColumns?: number
  numRows?: number
  solidBarCount?: number
  solidBarCountX?: number
  solidBarCountY?: number
  subdivisionMode?: 'linear' | 'exponential'
  orientation?: 'vertical' | 'horizontal' | 'both'
  cellPadding?: number
  backgroundColor?: string
  // Isometric specific
  perspective?: number
  // Perlin specific
  fieldStrength?: number
  flowSpeed?: number
  // Fractal specific
  branchAngle?: number
  branchLength?: number
  iterations?: number
  treeCount?: number
  scalingExponent?: number
  // Particle specific
  particleCount?: number
  gravity?: number
  friction?: number
  // Cellular specific
  generations?: number
  survivalRules?: string
  // L-System specific
  pattern?: string
  axiom?: string
  rules?: string
  angle?: number
}

interface JitterParams extends AlgorithmParams {
  speed: number
  selectedColor: string
  algorithm: string
  animationType: string
  duration: number
}

interface JitterContextType {
  params: JitterParams
  updateParams: (updates: Partial<JitterParams>) => void
  layers: Layer[]
  selectedLayer: string | null
  addLayer: () => void
  selectLayer: (layerId: string | null) => void
  toggleLayerVisibility: (layerId: string) => void
  toggleLayerLock: (layerId: string) => void
}

const JitterContext = createContext<JitterContextType | undefined>(undefined)

interface JitterProviderProps {
  children: ReactNode
}

export function JitterProvider({ children }: JitterProviderProps) {
  const { updateDrawingCommands } = useEngine()
  const [params, setParams] = useState<JitterParams>({
    density: 10,
    speed: 1,
    selectedColor: 'purple',
    algorithm: 'uniform',
    animationType: 'none',
    duration: 2,
    // Common visual parameters
    gutter: 5,
    shapeVariety: 1,
    sizeVariation: 3,
    displacementIntensity: 1,
    colorVariation: 3,
    heightVariation: 2,
    // Perlin specific
    fieldStrength: 1,
    flowSpeed: 0.01,
    // Noise specific
    noiseScale: 0.005,
    octaves: 4,
    // Recursive specific
    subdivisions: 3,
    threshold: 0.5,
    // Isometric specific
    perspective: 0.5,
    // Fractal specific
    branchAngle: 25,
    branchLength: 0.7,
    iterations: 6,
    treeCount: 8,
    scalingExponent: 2.0,
    // Particle specific
    particleCount: 100,
    gravity: 0.2,
    friction: 0.95,
    // Cellular specific
    generations: 10,
    survivalRules: '23/3',
    // L-System specific
    pattern: 'koch',
    axiom: 'F',
    rules: 'F=F+F-F-F+F',
    angle: 25,
    // Grid/bar pattern specific defaults (safer for exponential mode)
    numColumns: 15,
    numRows: 15,
    solidBarCountX: 0,
    solidBarCountY: 0,
    subdivisionMode: 'linear',
    orientation: 'vertical',
    cellPadding: 0,
    backgroundColor: 'white',
  })

  const [layers, setLayers] = useState<Layer[]>([])
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)

  const updateParams = useCallback((updates: Partial<JitterParams>) => {
    setParams((prev) => ({ ...prev, ...updates }))
  }, [])

  const addLayer = () => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      type: 'grid',
      visible: true,
      locked: false,
      isClipped: false,
      parameters: {
        algorithm: params.algorithm as Layer['parameters']['algorithm'],
        density: params.density,
        gutter: params.gutter || 5,
        colorPalette: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981'],
        shapeVariety: params.shapeVariety,
        sizeVariation: params.sizeVariation,
        displacementIntensity: params.displacementIntensity,
        colorVariation: params.colorVariation,
        heightVariation: params.heightVariation,
        noiseScale: params.noiseScale,
        octaves: params.octaves,
        subdivisions: params.subdivisions,
        threshold: params.threshold,
        perspective: params.perspective,
        fieldStrength: params.fieldStrength,
        flowSpeed: params.flowSpeed,
        branchLength: params.branchLength,
        branchAngle: params.branchAngle,
        iterations: params.iterations,
        treeCount: params.treeCount,
        scalingExponent: params.scalingExponent,
        particleCount: params.particleCount,
        gravity: params.gravity,
        friction: params.friction,
        generations: params.generations,
        survivalRules: params.survivalRules,
        pattern: params.pattern,
        axiom: params.axiom,
        rules: params.rules,
        angle: params.angle,
        // Grid/bar pattern specific
        numColumns: params.numColumns,
        numRows: params.numRows,
        solidBarCountX: params.solidBarCountX,
        solidBarCountY: params.solidBarCountY,
        subdivisionMode: params.subdivisionMode,
        orientation: params.orientation,
        cellPadding: params.cellPadding,
        backgroundColor: params.backgroundColor,
      },
      animation: {
        type: params.animationType as Layer['animation']['type'],
        speed: params.speed,
        duration: params.duration,
      },
    }
    setLayers((prev) => [...prev, newLayer])
    setSelectedLayer(newLayer.id)
  }

  const selectLayer = (layerId: string | null) => {
    setSelectedLayer(layerId)
  }

  const toggleLayerVisibility = (layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    )
  }

  const toggleLayerLock = (layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
      )
    )
  }

  // Update engine when layers or selection changes
  useEffect(() => {
    updateDrawingCommands(layers, selectedLayer)
  }, [layers, selectedLayer, updateDrawingCommands])

  return (
    <JitterContext.Provider
      value={{
        params,
        updateParams,
        layers,
        selectedLayer,
        addLayer,
        selectLayer,
        toggleLayerVisibility,
        toggleLayerLock,
      }}
    >
      {children}
    </JitterContext.Provider>
  )
}

export function useJitter() {
  const context = useContext(JitterContext)
  if (context === undefined) {
    throw new Error('useJitter must be used within a JitterProvider')
  }
  return context
}
