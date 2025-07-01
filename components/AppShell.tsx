'use client'

import React, { useState, useEffect, useCallback } from 'react'

import Header from './Header'
import { UnifiedControlPanel } from './UnifiedControlPanel'
import { JitterProvider } from './JitterContext'
import { EngineProvider } from '../lib/engine/engineContext'
import { useWelcomeVisibility } from '../hooks/useWelcomeVisibility'
import { WelcomeVisibilityContext } from './WelcomeVisibilityContext'

interface AppShellProps {
  children: React.ReactNode
  version: string
}

export default function AppShell({ children, version }: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { showWelcome, toggleWelcome, isLoaded } = useWelcomeVisibility()

  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 768 // md breakpoint
    setIsMobile(mobile)
    if (mobile) {
      setIsSidebarOpen(false)
    }
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsSidebarOpen((prev) => !prev)
    } else {
      setIsSidebarCollapsed((prev) => !prev)
    }
  }, [isMobile])

  return (
    <EngineProvider>
      <JitterProvider>
        <WelcomeVisibilityContext.Provider
          value={{ showWelcome, toggleWelcome, isLoaded }}
        >
          <div className="h-screen bg-gray-50">
            {/* Sidebar */}
            <div
              className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out will-change-transform ${
                isMobile && !isSidebarOpen
                  ? '-translate-x-full'
                  : 'translate-x-0'
              }`}
            >
              <UnifiedControlPanel
                version={version}
                isCollapsed={isSidebarCollapsed && !isMobile}
                onToggleCollapse={toggleSidebar}
                isMobile={isMobile}
              />
            </div>

            {/* Mobile Menu Overlay */}
            {isMobile && isSidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/50 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Content Area */}
            <div
              className={`flex h-screen flex-col transition-all duration-300 ease-in-out ${
                isMobile ? 'pl-0' : isSidebarCollapsed ? 'md:pl-16' : 'md:pl-80'
              }`}
            >
              <Header showWelcome={showWelcome} toggleWelcome={toggleWelcome} />
              <main className="flex flex-1 flex-col overflow-y-auto">
                <div className="container mx-auto h-full p-4 md:p-6 lg:p-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </WelcomeVisibilityContext.Provider>
      </JitterProvider>
    </EngineProvider>
  )
}
