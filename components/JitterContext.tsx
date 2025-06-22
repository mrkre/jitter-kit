'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface JitterParams {
  density: number
  speed: number
  selectedColor: string
  algorithm: string
  animationType: string
  duration: number
}

interface JitterContextType {
  params: JitterParams
  updateParams: (updates: Partial<JitterParams>) => void
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
  })

  const updateParams = (updates: Partial<JitterParams>) => {
    setParams((prev) => ({ ...prev, ...updates }))
  }

  return (
    <JitterContext.Provider value={{ params, updateParams }}>
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
