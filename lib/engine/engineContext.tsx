'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { DrawingCommand, Layer } from '@/lib/types'
import { generateDrawingCommands } from './index'

interface EngineContextType {
  drawingCommands: DrawingCommand[]
  updateDrawingCommands: (layers: Layer[], selectedLayer: string | null) => void
  subscribeToCommands: (
    callback: (commands: DrawingCommand[]) => void
  ) => () => void
}

const EngineContext = createContext<EngineContextType | undefined>(undefined)

interface EngineProviderProps {
  children: ReactNode
}

export function EngineProvider({ children }: EngineProviderProps) {
  const [drawingCommands, setDrawingCommands] = useState<DrawingCommand[]>([])
  const [subscribers, setSubscribers] = useState<
    Set<(commands: DrawingCommand[]) => void>
  >(new Set())

  // Update drawing commands based on layers and selected layer
  const updateDrawingCommands = useCallback(
    (layers: Layer[], selectedLayer: string | null) => {
      if (!selectedLayer) {
        setDrawingCommands([])
        return
      }

      const layer = layers.find((l) => l.id === selectedLayer)
      if (!layer || !layer.visible) {
        setDrawingCommands([])
        return
      }

      // Add canvas dimensions to the layer parameters
      // These will be set by the canvas component
      const layerWithDimensions = {
        ...layer,
        parameters: {
          ...layer.parameters,
          canvasWidth: layer.parameters.canvasWidth || 800,
          canvasHeight: layer.parameters.canvasHeight || 600,
        },
      }

      // Generate commands for the selected layer
      const commands = generateDrawingCommands(layerWithDimensions)
      setDrawingCommands(commands)
    },
    []
  )

  // Subscribe to command updates
  const subscribeToCommands = useCallback(
    (callback: (commands: DrawingCommand[]) => void) => {
      setSubscribers((prev) => {
        const newSubs = new Set(prev)
        newSubs.add(callback)
        return newSubs
      })

      // Return unsubscribe function
      return () => {
        setSubscribers((prev) => {
          const newSubs = new Set(prev)
          newSubs.delete(callback)
          return newSubs
        })
      }
    },
    []
  )

  // Notify subscribers when commands change
  useEffect(() => {
    subscribers.forEach((callback) => callback(drawingCommands))
  }, [drawingCommands, subscribers])

  return (
    <EngineContext.Provider
      value={{
        drawingCommands,
        updateDrawingCommands,
        subscribeToCommands,
      }}
    >
      {children}
    </EngineContext.Provider>
  )
}

export function useEngine() {
  const context = useContext(EngineContext)
  if (context === undefined) {
    throw new Error('useEngine must be used within an EngineProvider')
  }
  return context
}
