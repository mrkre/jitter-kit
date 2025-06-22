'use client'

import { useState } from 'react'

import {
  ChevronDown,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
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
import {
  getParametersForAlgorithm,
  getDefaultParamsForAlgorithm,
} from '../lib/algorithmConfig'

interface UnifiedControlPanelProps {
  version: string
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  isMobile?: boolean
}

export function UnifiedControlPanel({
  version,
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
}: UnifiedControlPanelProps) {
  const {
    params,
    updateParams,
    layers,
    selectedLayer,
    addLayer,
    selectLayer,
    toggleLayerVisibility,
    toggleLayerLock,
  } = useJitter()
  const [exportLoading, setExportLoading] = useState<string | null>(null)

  const handleExport = async (type: 'svg' | 'gsap' | 'project') => {
    setExportLoading(type)
    try {
      // Simulate export operation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // TODO: Implement actual export logic
      // eslint-disable-next-line no-console
      console.log(`Exporting as ${type}...`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Export failed:', error)
    } finally {
      setExportLoading(null)
    }
  }

  const handleAlgorithmChange = (algorithm: string) => {
    // Get default parameters for the new algorithm
    const defaultParams = getDefaultParamsForAlgorithm(algorithm)

    // Update parameters with new algorithm and its defaults
    updateParams({
      algorithm,
      ...defaultParams,
    })
  }

  const currentAlgorithmParams = getParametersForAlgorithm(params.algorithm)

  const renderParameter = (paramConfig: any) => {
    const { key, label, type, min, max, step, options, formatValue } =
      paramConfig
    const value = params[key as keyof typeof params]

    switch (type) {
      case 'slider':
        return (
          <Slider
            key={key}
            label={label}
            value={Number(value) || paramConfig.defaultValue}
            onChange={(newValue) => updateParams({ [key]: newValue })}
            min={min}
            max={max}
            step={step}
            showValue
            formatValue={formatValue}
          />
        )

      case 'select':
        return (
          <Select
            key={key}
            label={label}
            options={options || []}
            value={String(value) || String(paramConfig.defaultValue)}
            onChange={(e) => updateParams({ [key]: e.target.value })}
            fullWidth
          />
        )

      case 'text':
        return (
          <div key={key}>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              {label}
            </label>
            <input
              type="text"
              value={String(value) || String(paramConfig.defaultValue)}
              onChange={(e) => updateParams({ [key]: e.target.value })}
              className="w-full rounded-md border border-gray-200/80 bg-white/80 px-3 py-2 text-sm transition-colors hover:border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
        )

      default:
        return null
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
                  onClick={addLayer}
                >
                  Add Layer
                </Button>

                {/* Layer Items */}
                <div className="space-y-2 pt-2">
                  {layers.length > 0 ? (
                    layers.map((layer) => (
                      <div
                        key={layer.id}
                        className={`cursor-pointer rounded-md border p-2 transition-colors ${
                          selectedLayer === layer.id
                            ? 'border-blue-200 bg-blue-50/80'
                            : 'border-transparent bg-gray-50/80 hover:border-gray-200/80'
                        }`}
                        onClick={() => selectLayer(layer.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {layer.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleLayerVisibility(layer.id)
                              }}
                              aria-label="Toggle visibility"
                            >
                              {layer.visible ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleLayerLock(layer.id)
                              }}
                              aria-label="Lock layer"
                            >
                              {layer.locked ? (
                                <Lock className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Unlock className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 text-center text-sm text-gray-500">
                      No layers yet
                    </div>
                  )}
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
              {selectedLayer ? (
                <div className="space-y-4">
                  <Select
                    label="Algorithm"
                    options={selectPresets.algorithms}
                    value={params.algorithm}
                    onChange={(e) => handleAlgorithmChange(e.target.value)}
                    fullWidth
                  />

                  {/* Dynamic algorithm-specific parameters */}
                  {currentAlgorithmParams.map(renderParameter)}

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
              ) : (
                <div className="py-8 text-center">
                  <SlidersHorizontal className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="mb-1 text-sm text-gray-500">
                    No layer selected
                  </p>
                  <p className="text-xs text-gray-400">
                    Select a layer to edit its parameters
                  </p>
                </div>
              )}
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
              {selectedLayer ? (
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
              ) : (
                <div className="py-8 text-center">
                  <Play className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="mb-1 text-sm text-gray-500">
                    No layer selected
                  </p>
                  <p className="text-xs text-gray-400">
                    Select a layer to configure animations
                  </p>
                </div>
              )}
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
        <div className="text-xs text-gray-500">jitter-kit v{version}</div>
      </div>
    </aside>
  )
}
