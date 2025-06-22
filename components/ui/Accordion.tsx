'use client'

import { useState, createContext, useContext, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionContextValue {
  expandedItems: Set<string>
  toggleItem: (id: string) => void
  allowMultiple: boolean
}

const AccordionContext = createContext<AccordionContextValue | undefined>(
  undefined
)

interface AccordionProps {
  children: ReactNode
  allowMultiple?: boolean
  defaultExpanded?: string[]
  className?: string
}

export function Accordion({
  children,
  allowMultiple = true,
  defaultExpanded = [],
  className = '',
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded)
  )

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        if (!allowMultiple) {
          newSet.clear()
        }
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <AccordionContext.Provider
      value={{ expandedItems, toggleItem, allowMultiple }}
    >
      <div className={`divide-y divide-gray-200/5 ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  children: ReactNode
  className?: string
}

export function AccordionItem({
  children,
  className = '',
}: AccordionItemProps) {
  return (
    <div className={`border-b border-gray-200/5 last:border-0 ${className}`}>
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  id: string
  children: ReactNode
  className?: string
  icon?: ReactNode
}

export function AccordionTrigger({
  id,
  children,
  className = '',
  icon,
}: AccordionTriggerProps) {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('AccordionTrigger must be used within an Accordion')
  }

  const { expandedItems, toggleItem } = context
  const isExpanded = expandedItems.has(id)

  return (
    <button
      onClick={() => toggleItem(id)}
      className={`flex w-full items-center justify-between p-4 text-left transition-colors duration-200 hover:bg-gray-50/5 ${className}`}
      aria-expanded={isExpanded}
    >
      {children}
      {icon || (
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      )}
    </button>
  )
}

interface AccordionContentProps {
  id: string
  children: ReactNode
  className?: string
}

export function AccordionContent({
  id,
  children,
  className = '',
}: AccordionContentProps) {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('AccordionContent must be used within an Accordion')
  }

  const { expandedItems } = context
  const isExpanded = expandedItems.has(id)

  if (!isExpanded) return null

  return <div className={`p-4 pt-0 ${className}`}>{children}</div>
}
