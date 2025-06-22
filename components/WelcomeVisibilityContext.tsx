'use client'

import { createContext, useContext } from 'react'

interface WelcomeVisibilityContext {
  showWelcome: boolean
  toggleWelcome: () => void
  isLoaded: boolean
}

const WelcomeVisibilityContext = createContext<
  WelcomeVisibilityContext | undefined
>(undefined)

export function useWelcomeVisibilityContext() {
  const context = useContext(WelcomeVisibilityContext)
  if (context === undefined) {
    throw new Error(
      'useWelcomeVisibilityContext must be used within a WelcomeVisibilityProvider'
    )
  }
  return context
}

export { WelcomeVisibilityContext }
