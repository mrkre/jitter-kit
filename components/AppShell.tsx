'use client'

import { useState, useEffect } from 'react'
import UnifiedControlPanel from './UnifiedControlPanel'
import Header from './Header'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleResize = () => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    if (!mobile) {
      setIsSidebarOpen(true)
    } else {
      setIsSidebarOpen(false)
    }
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen)
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header onMenuClick={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Menu Overlay */}
        {isMobile && isSidebarOpen && (
          <div
            className="bg-opacity-50 fixed inset-0 z-30 bg-black md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={` ${isMobile ? 'fixed inset-y-0 left-0' : 'relative'} ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'} z-40 transition-transform duration-300 ease-in-out`}
        >
          <UnifiedControlPanel
            isCollapsed={isSidebarCollapsed && !isMobile}
            onToggleCollapse={toggleSidebar}
            isMobile={isMobile}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
