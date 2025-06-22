'use client'

import { ChevronDown } from 'lucide-react'
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
  defaultOpen = false,
  isCollapsed = false,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  if (isCollapsed) {
    return null
  }

  return (
    <div className="border-b border-gray-200/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors duration-200 hover:bg-gray-50/5"
      >
        <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
          {title}
        </h3>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
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
      className={`flex h-full flex-col border-r border-gray-200/80 bg-white/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-80'} `}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200/80 p-4">
        <div
          className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'w-0' : 'w-full'}`}
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <span className="text-sm font-bold text-white">J</span>
          </div>
          <h2 className="text-lg font-semibold whitespace-nowrap text-gray-800">
            jitter-kit
          </h2>
        </div>
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? '-rotate-90' : 'rotate-90'}`}
            />
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
          <div className="space-y-2">
            {/* Add Layer Button */}
            <button className="w-full rounded-md border border-gray-200/80 p-2 text-sm text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50/50 hover:text-gray-800">
              + Add Layer
            </button>

            {/* Placeholder Layer Items */}
            <div className="space-y-2 pt-2">
              <div className="rounded-md border border-transparent bg-gray-50/80 p-2 hover:border-gray-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Layer 1</span>
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
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Algorithm
              </label>
              <select className="w-full rounded-md border-gray-200/80 bg-white/80 p-2 text-sm focus:border-purple-500 focus:ring-purple-500">
                <option>Uniform Grid</option>
                <option>Noise Displacement</option>
                <option>Recursive Subdivision</option>
                <option>Isometric Grid</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
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
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Colors
              </label>
              <div className="flex flex-wrap gap-2">
                <div className="h-7 w-7 cursor-pointer rounded border-2 border-purple-500 bg-purple-500 shadow-sm"></div>
                <div className="h-7 w-7 cursor-pointer rounded border-2 border-white bg-pink-500 shadow-sm hover:border-pink-300"></div>
                <div className="h-7 w-7 cursor-pointer rounded border-2 border-white bg-blue-500 shadow-sm hover:border-blue-300"></div>
                <button className="h-7 w-7 rounded border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600">
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
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Animation Type
              </label>
              <select className="w-full rounded-md border-gray-200/80 bg-white/80 p-2 text-sm focus:border-purple-500 focus:ring-purple-500">
                <option>None</option>
                <option>Pulse Scale</option>
                <option>Cycle Colors</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Speed
              </label>
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
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
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
