'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

export default function Canvas() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = useCallback(async () => {
    if (!canvasContainerRef.current) return

    try {
      if (!isFullscreen) {
        if (canvasContainerRef.current.requestFullscreen) {
          await canvasContainerRef.current.requestFullscreen()
        } else if (canvasContainerRef.current.webkitRequestFullscreen) {
          await canvasContainerRef.current.webkitRequestFullscreen()
        } else if (canvasContainerRef.current.msRequestFullscreen) {
          await canvasContainerRef.current.msRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen()
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen()
        }
      }
    } catch {
      // Error handling can be improved here if needed
    }
  }, [isFullscreen])

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      )
      setIsFullscreen(isCurrentlyFullscreen)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // F11 or F for fullscreen toggle
      if (event.key === 'F11' || (event.key === 'f' && event.ctrlKey)) {
        event.preventDefault()
        toggleFullscreen()
      }
      // Escape to exit fullscreen
      if (event.key === 'Escape' && isFullscreen) {
        event.preventDefault()
        toggleFullscreen()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen, toggleFullscreen])

  return (
    <div
      ref={canvasContainerRef}
      className={`relative flex items-center justify-center rounded-lg bg-gray-100 shadow-sm ${
        isFullscreen ? 'fixed inset-0 z-50' : 'min-h-[400px]'
      }`}
    >
      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-10 rounded-md bg-gray-800 p-2 text-white transition-all hover:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
        aria-label={
          isFullscreen
            ? 'Exit fullscreen (Esc)'
            : 'Enter fullscreen (F11 or Ctrl+F)'
        }
        title={
          isFullscreen
            ? 'Exit fullscreen (Esc)'
            : 'Enter fullscreen (F11 or Ctrl+F)'
        }
      >
        {isFullscreen ? (
          <Minimize2 className="h-5 w-5" />
        ) : (
          <Maximize2 className="h-5 w-5" />
        )}
      </button>

      {/* Canvas Content Placeholder */}
      <p className="text-gray-500">Canvas area - Pattern editor will go here</p>
    </div>
  )
}
