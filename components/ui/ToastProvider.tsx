'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { Toast, ToastContainer } from './Toast'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'
type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'

interface ToastData {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastOptions {
  title?: string
  description?: string
  duration?: number
}

interface ToastContextValue {
  showToast: (variant: ToastVariant, options: ToastOptions) => void
  success: (options: ToastOptions) => void
  error: (options: ToastOptions) => void
  warning: (options: ToastOptions) => void
  info: (options: ToastOptions) => void
  dismissToast: (id: string) => void
  dismissAll: () => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

interface ToastProviderProps {
  position?: ToastPosition
  children: React.ReactNode
}

export function ToastProvider({
  position = 'top-right',
  children,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const generateId = useCallback(() => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }, [])

  const showToast = useCallback(
    (variant: ToastVariant, options: ToastOptions) => {
      const id = generateId()
      const newToast: ToastData = {
        id,
        variant,
        duration: 5000,
        ...options,
      }

      setToasts((prev) => [...prev, newToast])
    },
    [generateId]
  )

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  const success = useCallback(
    (options: ToastOptions) => {
      showToast('success', options)
    },
    [showToast]
  )

  const error = useCallback(
    (options: ToastOptions) => {
      showToast('error', options)
    },
    [showToast]
  )

  const warning = useCallback(
    (options: ToastOptions) => {
      showToast('warning', options)
    },
    [showToast]
  )

  const info = useCallback(
    (options: ToastOptions) => {
      showToast('info', options)
    },
    [showToast]
  )

  const contextValue: ToastContextValue = {
    showToast,
    success,
    error,
    warning,
    info,
    dismissToast,
    dismissAll,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.length > 0 && (
        <ToastContainer position={position}>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              title={toast.title}
              description={toast.description}
              variant={toast.variant}
              duration={toast.duration}
              onClose={dismissToast}
            />
          ))}
        </ToastContainer>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
