'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'

import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  options: SelectOption[]
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  error?: boolean
  helperText?: string
}

const sizeStyles = {
  sm: 'h-8 px-3 pr-8 text-sm',
  md: 'h-10 px-4 pr-10 text-sm',
  lg: 'h-12 px-6 pr-12 text-base',
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      placeholder = 'Select an option',
      size = 'md',
      fullWidth = false,
      error = false,
      helperText,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      appearance-none rounded-md border bg-white/80
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:cursor-not-allowed disabled:opacity-50
    `

    const errorStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-200/80 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-500'

    const widthStyles = fullWidth ? 'w-full' : ''

    const combinedClassName = `
      ${baseStyles}
      ${sizeStyles[size]}
      ${errorStyles}
      ${widthStyles}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ')

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-xs font-medium text-gray-500"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select ref={ref} id={id} className={combinedClassName} {...props}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom chevron icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown
              className={`text-gray-400 ${
                size === 'sm'
                  ? 'h-4 w-4'
                  : size === 'lg'
                    ? 'h-6 w-6'
                    : 'h-5 w-5'
              }`}
            />
          </div>
        </div>

        {helperText && (
          <p
            className={`mt-1 text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

// Export utility function for creating options from arrays
export function createOptions<T extends string | number>(
  values: T[],
  labelFn?: (value: T) => string
): SelectOption[] {
  return values.map((value) => ({
    value: String(value),
    label: labelFn ? labelFn(value) : String(value),
  }))
}

// Export preset option creators
export const selectPresets = {
  algorithms: [
    { value: 'uniform', label: 'Uniform Grid' },
    { value: 'noise', label: 'Noise Displacement' },
    { value: 'recursive', label: 'Recursive Subdivision' },
    { value: 'isometric', label: 'Isometric Grid' },
    { value: 'perlin', label: 'Perlin Noise Fields' },
    { value: 'fractal', label: 'Fractal Trees' },
    { value: 'particles', label: 'Particle Systems' },
    { value: 'cellular', label: 'Cellular Automata' },
    { value: 'lsystem', label: 'L-Systems' },
  ],

  animations: [
    { value: 'none', label: 'None' },
    { value: 'pulse', label: 'Pulse Scale' },
    { value: 'cycle', label: 'Cycle Colors' },
    { value: 'rotate', label: 'Rotate' },
    { value: 'wave', label: 'Wave' },
  ],

  exportFormats: [
    { value: 'svg', label: 'SVG' },
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPEG' },
    { value: 'webp', label: 'WebP' },
  ],
}
