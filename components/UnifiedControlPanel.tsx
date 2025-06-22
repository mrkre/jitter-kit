'use client'

import { useState } from 'react'

import {
  ChevronDown,
  Plus,
  Eye,
  Lock,
  Layers,
  SlidersHorizontal,
  Play,
  Download,
} from 'lucide-react'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Button,
  ColorPicker,
  Slider,
  Select,
  selectPresets,
  sliderFormatters,
  Spinner,
} from './ui'
import { useJitter } from './JitterContext'

interface UnifiedControlPanelProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  isMobile?: boolean
}

export default function UnifiedControlPanel({
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
}: UnifiedControlPanelProps) {
  const { params, updateParams } = useJitter()
  const [exportLoading, setExportLoading] = useState<string | null>(null)

  const handleExport = async (type: 'svg' | 'gsap' | 'project') => {
    setExportLoading(type)
    try {
      // Simulate export operation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // TODO: Implement actual export logic
      console.log(`Exporting as ${type}...`)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExportLoading(null)
    }
  }

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
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? '-rotate-90' : 'rotate-90'}`}
            />
          </Button>
        )}
      </div>

      {/* Main Content Area with Sections */}
      <div className="flex-1 overflow-y-auto">
        <Accordion
          key={isCollapsed ? 'collapsed' : 'expanded'}
          allowMultiple
          defaultExpanded={
            isCollapsed ? [] : ['layers', 'parameters', 'export']
          }
        >
          {/* Layer Management Section */}
          <AccordionItem>
            <AccordionTrigger
              id="layers"
              className={isCollapsed ? 'justify-center' : ''}
              icon={isCollapsed ? <></> : undefined}
            >
              {isCollapsed ? (
                <Layers className="h-5 w-5 text-gray-500" />
              ) : (
                <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Layers
                </h3>
              )}
            </AccordionTrigger>
            <AccordionContent id="layers">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  fullWidth
                  icon={Plus}
                  iconPosition="left"
                  size="sm"
                >
                  Add Layer
                </Button>

                {/* Placeholder Layer Items */}
                <div className="space-y-2 pt-2">
                  <div className="rounded-md border border-transparent bg-gray-50/80 p-2 hover:border-gray-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Layer 1</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          aria-label="Toggle visibility"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          aria-label="Lock layer"
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="py-2 text-center text-sm text-gray-500">
                    No layers yet
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Parameter Controls Section */}
          <AccordionItem>
            <AccordionTrigger
              id="parameters"
              className={isCollapsed ? 'justify-center' : ''}
              icon={isCollapsed ? <></> : undefined}
            >
              {isCollapsed ? (
                <SlidersHorizontal className="h-5 w-5 text-gray-500" />
              ) : (
                <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Parameters
                </h3>
              )}
            </AccordionTrigger>
            <AccordionContent id="parameters">
              <div className="space-y-4">
                <Select
                  label="Algorithm"
                  options={selectPresets.algorithms}
                  defaultValue="uniform"
                  fullWidth
                />

                <Slider
                  label="Density"
                  value={params.density}
                  onChange={(value) => updateParams({ density: value })}
                  min={1}
                  max={50}
                  step={1}
                  showValue
                />

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-500">
                    Colors
                  </label>
                  <ColorPicker
                    selectedColorId={params.selectedColor}
                    onColorSelect={(color) =>
                      updateParams({ selectedColor: color })
                    }
                    onColorAdd={(_color) => {
                      // TODO: Implement color adding logic
                      // eslint-disable-next-line no-console
                      console.log('color added', _color)
                    }}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Animation Controls Section */}
          <AccordionItem>
            <AccordionTrigger
              id="animation"
              className={isCollapsed ? 'justify-center' : ''}
              icon={isCollapsed ? <></> : undefined}
            >
              {isCollapsed ? (
                <Play className="h-5 w-5 text-gray-500" />
              ) : (
                <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Animation
                </h3>
              )}
            </AccordionTrigger>
            <AccordionContent id="animation">
              <div className="space-y-4">
                <Select
                  label="Animation Type"
                  options={selectPresets.animations}
                  defaultValue="none"
                  fullWidth
                />

                <Slider
                  label="Speed"
                  value={params.speed}
                  onChange={(value) => updateParams({ speed: value })}
                  min={0.1}
                  max={5}
                  step={0.1}
                  showValue
                  formatValue={sliderFormatters.decimal(1)}
                />

                <Slider
                  label="Duration"
                  value={params.duration}
                  onChange={(value) => updateParams({ duration: value })}
                  min={0.5}
                  max={10}
                  step={0.5}
                  showValue
                  formatValue={sliderFormatters.seconds}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Export Options Section */}
          <AccordionItem>
            <AccordionTrigger
              id="export"
              className={isCollapsed ? 'justify-center' : ''}
              icon={isCollapsed ? <></> : undefined}
            >
              {isCollapsed ? (
                <Download className="h-5 w-5 text-gray-500" />
              ) : (
                <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Export
                </h3>
              )}
            </AccordionTrigger>
            <AccordionContent id="export">
              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => handleExport('svg')}
                  disabled={exportLoading !== null}
                >
                  {exportLoading === 'svg' ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <span>Exporting...</span>
                    </div>
                  ) : (
                    'Export as SVG'
                  )}
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => handleExport('gsap')}
                  disabled={exportLoading !== null}
                >
                  {exportLoading === 'gsap' ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <span>Exporting...</span>
                    </div>
                  ) : (
                    'Export as GSAP'
                  )}
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => handleExport('project')}
                  disabled={exportLoading !== null}
                >
                  {exportLoading === 'project' ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Save Project'
                  )}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Footer */}
      <div
        className={`border-t border-gray-200/80 p-4 ${isCollapsed ? 'hidden' : 'block'}`}
      >
        <div className="text-xs text-gray-500">jitter-kit v1.0.0</div>
      </div>
    </aside>
  )
}
