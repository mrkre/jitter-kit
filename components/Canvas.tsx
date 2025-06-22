'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

import { Maximize2, Minimize2 } from 'lucide-react'

import dynamic from 'next/dynamic'

const P5Sketch = dynamic(() => import('./P5Sketch'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  ),
})
import { useJitter } from './JitterContext'
import { Spinner } from './ui'

export default function Canvas() {
  const { params } = useJitter()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [isFullscreenLoading, setIsFullscreenLoading] = useState(false)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = useCallback(async () => {
    if (!canvasContainerRef.current) return

    setIsFullscreenLoading(true)
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
    } finally {
      setTimeout(() => setIsFullscreenLoading(false), 300)
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

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setCanvasSize({
          width: Math.max(width - 32, 400),
          height: Math.max(height - 32, 300),
        })
      }
    })

    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div
      ref={canvasContainerRef}
      className={`relative flex h-full items-center justify-center rounded-lg bg-gray-100 shadow-sm ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        disabled={isFullscreenLoading}
        className="absolute top-4 right-4 z-10 rounded-md bg-gray-800 p-2 text-white transition-all hover:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
        {isFullscreenLoading ? (
          <Spinner size="sm" className="border-white border-t-gray-400" />
        ) : isFullscreen ? (
          <Minimize2 className="h-5 w-5" />
        ) : (
          <Maximize2 className="h-5 w-5" />
        )}
      </button>

      {/* P5.js Sketch */}
      <div className="flex h-full w-full items-center justify-center">
        <P5Sketch
          width={canvasSize.width}
          height={canvasSize.height}
          density={params.density}
          speed={params.speed}
          selectedColor={params.selectedColor}
        />
      </div>
    </div>
  )
}
