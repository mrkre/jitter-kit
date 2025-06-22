'use client'

import { useState, useRef, useEffect } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

export default function Canvas() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = async () => {
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
    } catch (err) {
      console.error('Error toggling fullscreen:', err)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      )
      setIsFullscreen(isCurrentlyFullscreen)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div
      ref={canvasContainerRef}
      className={`relative flex min-h-[400px] items-center justify-center rounded-lg bg-white p-6 shadow-sm ${
        isFullscreen ? 'h-screen w-screen' : ''
      }`}
    >
      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-10 rounded-md bg-gray-800 p-2 text-white transition-all hover:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <Minimize2 className="h-5 w-5" />
        ) : (
          <Maximize2 className="h-5 w-5" />
        )}
      </button>

      {/* Canvas Content */}
      <div className="text-center">
        <div className="mx-auto mb-4 h-32 w-32 rounded-lg bg-gray-200"></div>
        <p className="text-gray-500">
          Canvas area - Pattern editor will go here
        </p>
      </div>
    </div>
  )
}
