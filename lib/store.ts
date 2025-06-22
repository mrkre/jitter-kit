import { create } from 'zustand'
import type { Project, Layer } from './types'

interface AppState {
  project: Project
  setProject: (project: Project) => void
  updateLayerParameters: (
    layerId: string,
    newParams: Partial<Layer['parameters']>
  ) => void
  // TODO: Add more actions as needed (e.g., addLayer, removeLayer, etc.)
}

const useStore = create<AppState>((set) => {
  return {
    project: {
      layers: [], // Initial state with no layers
      selectedLayerId: null,
    },
    setProject: (project) => set({ project }),
    updateLayerParameters: (layerId, newParams) =>
      set((state) => {
        const newLayers = state.project.layers.map((layer) => {
          if (layer.id === layerId) {
            return {
              ...layer,
              parameters: { ...layer.parameters, ...newParams },
            }
          }
          return layer
        })

        return {
          project: {
            ...state.project,
            layers: newLayers,
          },
        }
      }),
  }
})

export default useStore
