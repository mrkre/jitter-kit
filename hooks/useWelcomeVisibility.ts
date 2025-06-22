'use client'

import { useState, useEffect } from 'react'

export function useWelcomeVisibility() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Read from cookies on mount
    const savedPreference = document.cookie
      .split('; ')
      .find((row) => row.startsWith('showWelcome='))
      ?.split('=')[1]

    if (savedPreference !== undefined) {
      setShowWelcome(savedPreference === 'true')
    }
    setIsLoaded(true)
  }, [])

  const toggleWelcome = () => {
    const newValue = !showWelcome
    setShowWelcome(newValue)

    // Save to cookies with 1 year expiration
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = `showWelcome=${newValue}; expires=${expires.toUTCString()}; path=/`
  }

  return { showWelcome, toggleWelcome, isLoaded }
}
