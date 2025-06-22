'use client'

import { Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200/50 bg-white/70 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100/50 hover:text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:ring-inset"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
              Jitter Kit
            </h1>
          </div>
          {/* Add other header items here, like a user menu */}
        </div>
      </div>
    </header>
  )
}
