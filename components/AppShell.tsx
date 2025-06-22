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
    <div className="h-screen bg-gray-50">
      {/* Sidebar: always present in the DOM, fixed position */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'} `}
      >
        <UnifiedControlPanel
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

      {/* Content Area: gets padding to avoid sidebar */}
      <div
        className={`flex h-screen flex-col transition-all duration-300 ease-in-out ${isMobile ? 'pl-0' : isSidebarCollapsed ? 'pl-16' : 'pl-80'} `}
      >
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
