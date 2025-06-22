'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Check } from 'lucide-react'

interface Color {
  id: string
  value: string
  name?: string
}

interface ColorPickerProps {
  colors?: Color[]
  selectedColorId?: string
  onColorSelect?: (colorId: string) => void
  onColorAdd?: (color: string) => void
  allowCustomColors?: boolean
  className?: string
}

const defaultColors: Color[] = [
  { id: 'purple', value: '#a855f7', name: 'Purple' },
  { id: 'pink', value: '#ec4899', name: 'Pink' },
  { id: 'blue', value: '#3b82f6', name: 'Blue' },
  { id: 'teal', value: '#14b8a6', name: 'Teal' },
  { id: 'red', value: '#ef4444', name: 'Red' },
  { id: 'yellow', value: '#eab308', name: 'Yellow' },
]

export function ColorPicker({
  colors = defaultColors,
  selectedColorId,
  onColorSelect,
  onColorAdd,
  allowCustomColors = true,
  className = '',
}: ColorPickerProps) {
  const [isAddingColor, setIsAddingColor] = useState(false)
  const colorInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAddingColor && colorInputRef.current) {
      colorInputRef.current.click()
    }
  }, [isAddingColor])

  const handleColorSelect = (colorId: string) => {
    onColorSelect?.(colorId)
  }

  const handleCustomColorAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    onColorAdd?.(color)
    setIsAddingColor(false)
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {colors.map((color) => (
        <ColorSwatch
          key={color.id}
          color={color}
          isSelected={selectedColorId === color.id}
          onClick={() => handleColorSelect(color.id)}
        />
      ))}

      {allowCustomColors && (
        <>
          <button
            onClick={() => setIsAddingColor(true)}
            className="flex h-7 w-7 items-center justify-center rounded border border-dashed border-gray-300 text-gray-400 transition-all hover:border-gray-400 hover:text-gray-600"
            aria-label="Add custom color"
          >
            <Plus className="h-4 w-4" />
          </button>

          <input
            ref={colorInputRef}
            type="color"
            onChange={handleCustomColorAdd}
            onBlur={() => setIsAddingColor(false)}
            className="sr-only"
            aria-label="Choose custom color"
          />
        </>
      )}
    </div>
  )
}

interface ColorSwatchProps {
  color: Color
  isSelected: boolean
  onClick: () => void
}

function ColorSwatch({ color, isSelected, onClick }: ColorSwatchProps) {
  return (
    <button
      onClick={onClick}
      className={`relative h-7 w-7 cursor-pointer rounded border-2 shadow-sm transition-all duration-200 ${
        isSelected
          ? 'scale-110 border-gray-800'
          : 'border-white hover:scale-105 hover:border-gray-300'
      } `}
      style={{ backgroundColor: color.value }}
      aria-label={color.name || `Color ${color.value}`}
      aria-pressed={isSelected}
      role="button"
      tabIndex={0}
    >
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Check className="h-4 w-4 text-white drop-shadow" />
        </div>
      )}
    </button>
  )
}

// Export utility function for color manipulation
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}
