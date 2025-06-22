'use client'

import { useState } from 'react'

interface UnifiedControlPanelProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  isMobile?: boolean
}

interface AccordionSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  isCollapsed?: boolean
}

function AccordionSection({
  title,
  children,
  defaultOpen = true,
  isCollapsed = false,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  if (isCollapsed) {
    return null
  }

  return (
    <div className="border-b border-gray-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-800"
      >
        <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase">
          {title}
        </h3>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="p-4 pt-0">{children}</div>}
    </div>
  )
}

export default function UnifiedControlPanel({
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
}: UnifiedControlPanelProps) {
  return (
    <aside
      className={` ${isMobile ? 'fixed' : 'relative'} top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-80'} flex flex-col overflow-hidden shadow-xl`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        <div
          className={`flex items-center gap-3 ${isCollapsed ? 'hidden' : 'flex'}`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <span className="text-sm font-bold text-white">J</span>
          </div>
          <h2 className="text-lg font-semibold">jitter-kit</h2>
        </div>
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className="rounded-lg p-2 transition-colors hover:bg-gray-800"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7"
                />
              )}
            </svg>
          </button>
        )}
      </div>

      {/* Main Content Area with Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Layer Management Section */}
        <AccordionSection
          title="Layers"
          defaultOpen={true}
          isCollapsed={isCollapsed}
        >
          <div className="space-y-3">
            {/* Add Layer Button */}
            <button className="w-full rounded-lg border-2 border-dashed border-gray-700 p-3 text-gray-400 transition-colors hover:border-gray-600 hover:bg-gray-800 hover:text-white">
              + Add Layer
            </button>

            {/* Placeholder Layer Items */}
            <div className="space-y-2">
              <div className="rounded-lg bg-gray-800 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Layer 1</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded p-1 hover:bg-gray-700"
                      aria-label="Toggle visibility"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      className="rounded p-1 hover:bg-gray-700"
                      aria-label="Lock layer"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="py-2 text-center text-sm text-gray-500">
                No layers yet
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Parameter Controls Section */}
        <AccordionSection
          title="Parameters"
          defaultOpen={true}
          isCollapsed={isCollapsed}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Algorithm
              </label>
              <select className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 focus:border-purple-500 focus:outline-none">
                <option>Uniform Grid</option>
                <option>Noise Displacement</option>
                <option>Recursive Subdivision</option>
                <option>Isometric Grid</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Density
              </label>
              <input
                type="range"
                className="w-full"
                min="1"
                max="50"
                defaultValue="10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">Colors</label>
              <div className="flex gap-2">
                <div className="h-8 w-8 cursor-pointer rounded bg-purple-500 hover:ring-2 hover:ring-purple-400"></div>
                <div className="h-8 w-8 cursor-pointer rounded bg-pink-500 hover:ring-2 hover:ring-pink-400"></div>
                <div className="h-8 w-8 cursor-pointer rounded bg-blue-500 hover:ring-2 hover:ring-blue-400"></div>
                <button className="h-8 w-8 rounded border-2 border-dashed border-gray-700 hover:border-gray-600">
                  +
                </button>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Animation Controls Section */}
        <AccordionSection
          title="Animation"
          defaultOpen={false}
          isCollapsed={isCollapsed}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Animation Type
              </label>
              <select className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 focus:border-purple-500 focus:outline-none">
                <option>None</option>
                <option>Pulse Scale</option>
                <option>Cycle Colors</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">Speed</label>
              <input
                type="range"
                className="w-full"
                min="0.1"
                max="5"
                step="0.1"
                defaultValue="1"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Duration (seconds)
              </label>
              <input
                type="range"
                className="w-full"
                min="0.5"
                max="10"
                step="0.5"
                defaultValue="2"
              />
            </div>
          </div>
        </AccordionSection>

        {/* Export Options Section */}
        <AccordionSection
          title="Export"
          defaultOpen={false}
          isCollapsed={isCollapsed}
        >
          <div className="space-y-3">
            <button className="w-full rounded-lg bg-purple-600 p-3 font-medium transition-colors hover:bg-purple-700">
              Export as SVG
            </button>
            <button className="w-full rounded-lg bg-blue-600 p-3 font-medium transition-colors hover:bg-blue-700">
              Export as GSAP
            </button>
            <button className="w-full rounded-lg bg-gray-700 p-3 font-medium transition-colors hover:bg-gray-600">
              Save Project
            </button>
          </div>
        </AccordionSection>
      </div>

      {/* Footer */}
      <div
        className={`border-t border-gray-800 p-4 ${isCollapsed ? 'hidden' : 'block'}`}
      >
        <div className="text-xs text-gray-500">jitter-kit v1.0.0</div>
      </div>
    </aside>
  )
}
