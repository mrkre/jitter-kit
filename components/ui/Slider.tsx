'use client'

import {
  InputHTMLAttributes,
  forwardRef,
  useState,
  useEffect,
  useRef,
} from 'react'

interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  showValue?: boolean
  showMinMax?: boolean
  formatValue?: (value: number) => string
  className?: string
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      showValue = true,
      showMinMax = false,
      formatValue = (v) => v.toString(),
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState(
      controlledValue ?? defaultValue
    )
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const percentage = ((displayValue - min) / (max - min)) * 100

    useEffect(() => {
      if (controlledValue !== undefined) {
        setDisplayValue(controlledValue)
      }
    }, [controlledValue])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value)

      // Update display immediately for smooth UI
      setDisplayValue(newValue)

      // Debounce the onChange callback to reduce rerendering
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        onChange?.(newValue)
      }, 150) // 150ms delay
    }

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current)
        }
      }
    }, [])

    return (
      <div className={`space-y-2 ${className}`}>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <label htmlFor={id} className="text-xs font-medium text-gray-500">
                {label}
              </label>
            )}
            {showValue && (
              <span className="text-xs font-medium text-gray-700">
                {formatValue(displayValue)}
              </span>
            )}
          </div>
        )}

        <div className="relative">
          {showMinMax && (
            <div className="mb-1 flex justify-between text-xs text-gray-400">
              <span>{formatValue(min)}</span>
              <span>{formatValue(max)}</span>
            </div>
          )}

          <div className="relative">
            {/* Track */}
            <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gray-200">
              {/* Filled track */}
              <div
                className="absolute h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Actual range input */}
            <input
              ref={ref}
              id={id}
              type="range"
              min={min}
              max={max}
              step={step}
              value={displayValue}
              onChange={handleChange}
              className="relative z-10 w-full cursor-pointer appearance-none bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-purple-500 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:active:scale-125 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-125"
              aria-label={label}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={displayValue}
              {...props}
            />
          </div>
        </div>
      </div>
    )
  }
)

Slider.displayName = 'Slider'

// Export preset formatters
export const sliderFormatters = {
  percentage: (value: number) => `${Math.round(value)}%`,
  decimal:
    (places: number = 2) =>
    (value: number) =>
      value.toFixed(places),
  seconds: (value: number) => `${value}s`,
  pixels: (value: number) => `${Math.round(value)}px`,
}
