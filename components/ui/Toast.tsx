'use client'

import { forwardRef, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'
type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'

interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
  onClose: (id: string) => void
}

interface ToastContainerProps {
  position?: ToastPosition
  children: React.ReactNode
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const variantIcons: Record<
  ToastVariant,
  React.ComponentType<{ className?: string }>
> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const positionStyles: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    { id, title, description, variant = 'info', duration = 5000, onClose },
    ref
  ) => {
    const Icon = variantIcons[variant]

    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          onClose(id)
        }, duration)

        return () => clearTimeout(timer)
      }
    }, [id, duration, onClose])

    const baseStyles = `
      flex items-start gap-3 p-4 rounded-lg border shadow-lg
      transition-all duration-300 ease-in-out
    `

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
    `
      .trim()
      .replace(/\s+/g, ' ')

    return (
      <div ref={ref} className={combinedClassName} role="alert">
        <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          {title && (
            <div className="text-sm leading-5 font-semibold">{title}</div>
          )}
          {description && (
            <div className="mt-1 text-sm leading-5">{description}</div>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 rounded-md p-1 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-current focus:ring-offset-2 focus:outline-none"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }
)

Toast.displayName = 'Toast'

export function ToastContainer({
  position = 'top-right',
  children,
}: ToastContainerProps) {
  const containerStyles = `
    fixed z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none
    ${positionStyles[position]}
  `

  return (
    <div className={containerStyles}>
      <div className="pointer-events-auto">{children}</div>
    </div>
  )
}
