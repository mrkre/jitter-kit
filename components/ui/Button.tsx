'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-purple-500 text-white hover:bg-purple-600 focus-visible:ring-purple-500',
  secondary:
    'bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-500',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500',
  outline:
    'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500',
  destructive:
    'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-0',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 rounded-lg font-medium
      transition-all duration-200 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:cursor-not-allowed disabled:opacity-50
    `

    const widthStyles = fullWidth ? 'w-full' : ''

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${widthStyles}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ')

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size={size} />
            {children && <span>Loading...</span>}
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && (
              <Icon className={getIconSize(size)} />
            )}
            {children}
            {Icon && iconPosition === 'right' && (
              <Icon className={getIconSize(size)} />
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

function LoadingSpinner({ size }: { size: ButtonSize }) {
  const spinnerSize = getIconSize(size)
  return (
    <svg
      className={`animate-spin ${spinnerSize}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function getIconSize(size: ButtonSize): string {
  const iconSizes: Record<ButtonSize, string> = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    icon: 'h-5 w-5',
  }
  return iconSizes[size]
}
