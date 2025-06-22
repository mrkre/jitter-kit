'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'

interface Layer {
  id: string
  name: string
  visible: boolean
  locked: boolean
}

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
      visible: true,
      locked: false,
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
