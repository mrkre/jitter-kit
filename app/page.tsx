'use client'

import Canvas from '@/components/Canvas'
import { useWelcomeVisibilityContext } from '@/components/WelcomeVisibilityContext'

export default function Home() {
  const { showWelcome, isLoaded } = useWelcomeVisibilityContext()

  // Prevent hydration mismatch by not rendering until loaded
  if (!isLoaded) {
    return (
      <div className="flex h-full flex-col gap-6">
        <div className="flex-1">
          <Canvas />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Welcome Content - conditionally rendered */}
      {showWelcome && (
        <>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Welcome to Jitter Kit
            </h1>
            <p className="text-gray-600">
              A modern generative art toolkit for creating grid-based patterns
              and animations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-xl font-semibold">Create</h2>
              <p className="text-gray-600">
                Design unique patterns with our intuitive tools.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-xl font-semibold">Animate</h2>
              <p className="text-gray-600">
                Bring your creations to life with smooth animations.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-xl font-semibold">Export</h2>
              <p className="text-gray-600">
                Save your work in multiple formats for any use case.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Canvas - expands to fill available space */}
      <div className="flex-1">
        <Canvas />
      </div>
    </div>
  )
}
