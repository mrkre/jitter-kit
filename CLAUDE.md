# CLAUDE.md

## Project Overview

Modern Next.js 15+ application built with TypeScript, ESLint 9, Prettier, and contemporary tooling.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+
- **Linting**: ESLint 9+ with flat config
- **Formatting**: Prettier 3+
- **Package Manager**: pnpm (preferred) or npm
- **Node Version**: 22+

## Project Structure

```bash
├── app/                  # App Router pages and layouts
├── components/           # Reusable UI components
│   ├── ui/               # Base UI components
│   └── features/         # Feature-specific components
├── lib/                  # Utility functions and configurations
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── styles/               # Global styles and Tailwind config
```

## Development Guidelines

### Component Conventions

- Use functional components with TypeScript
- **ALWAYS use named exports** for components (no default exports)
- Use PascalCase for component names
- Place interfaces/types above component definition
- Add 'use client' directive to all interactive components
- Use dynamic imports with `ssr: false` for client-only libraries

```typescript
'use client'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', children }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} btn-${size}`}>
      {children}
    </button>
  )
}
```

#### Export Patterns
**✅ Correct - Named Export:**
```typescript
export function MyComponent() { /* ... */ }
```

**❌ Incorrect - Default Export:**
```typescript
export default function MyComponent() { /* ... */ }
```

#### Client-Only Libraries
For libraries that don't support SSR (like P5.js, Chart.js, etc.):

```typescript
import dynamic from 'next/dynamic'
import { Spinner } from './ui'

const P5Sketch = dynamic(() => import('./P5Sketch'), {
  ssr: false,
  loading: () => <Spinner size="lg" />,
})
```

#### Component Index Files
Create index files for easy importing:

```typescript
// components/index.ts
export { AppShell } from './AppShell'
export { Canvas } from './Canvas'
export { Header } from './Header'
// Re-export UI components
export * from './ui'
```

### File Naming

- Components: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`, `apiClient.ts`)
- Constants: SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)
- Types: PascalCase with `.types.ts` suffix (`User.types.ts`)

### Import Order

1. React and Next.js imports
2. Third-party libraries
3. Internal components and utilities
4. Type imports (with `type` keyword)

```typescript
import { useState } from 'react'
import { NextPage } from 'next'
import { clsx } from 'clsx'

import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

import type { User } from '@/types/User.types'
```

### Code Quality Standards

- **No `any` types** - Use proper TypeScript typing
- **Strict null checks** - Handle undefined/null explicitly
- **Consistent naming** - Use descriptive, meaningful names
- **Small functions** - Keep functions focused and testable
- **Error boundaries** - Implement proper error handling

### Tailwind CSS Best Practices

- **Avoid Concatenating Class Names**: Do not create class names dynamically. Tailwind's JIT compiler scans source files for complete class strings and will miss dynamically generated ones.

  ```typescript
  // ❌ Don't do this
  const Button = ({ color, children }) => (
    <button className={`bg-${color}-500 text-white`}>{children}</button>
  );
  
  // ✅ Do this instead
  function Button({ color, children }) {
    const colorVariants = {
      blue: "bg-blue-600 hover:bg-blue-500 text-white",
      red: "bg-red-500 hover:bg-red-400 text-white",
    };
  
    return <button className={colorVariants[color]}>{children}</button>;
  }
  ```

- **Handle Conditional Classes Correctly**: When applying classes based on props or state, ensure you are toggling complete class strings.

  ```typescript
  // ✅ Good for conditional logic
  export function Example({ gridLayout }) {
    return <div className={gridLayout ? "grid" : "flex"}>{/* ... */}</div>;
  }
  ```

- **Handle Specificity with `!important`**: If you need to override a style with higher specificity, you can make a utility `!important` by adding a `!` character to the beginning.

  ```html
  <div class="bg-teal-500 !bg-red-500">
    <!-- This will have a red background -->
  </div>
  ```

- **Use Modern CSS Features**:
  - **Media Queries**: Replace the deprecated `@screen` directive with the `screen()` function inside a standard `@media` rule.

      ```css
      /* ❌ Deprecated */
      @screen sm {
        /* ... */
      }
      
      /* ✅ Modern */
      @media screen(sm) {
        /* ... */
      }
      ```

- **Avoid Deprecated Classes**: Some utility classes have been replaced in recent Tailwind versions.

  | Deprecated              | Replacement                               |
  | ----------------------- | ----------------------------------------- |
  | `bg-opacity-*`          | Opacity modifiers like `bg-black/50`      |
  | `text-opacity-*`        | Opacity modifiers like `text-black/50`    |
  | `border-opacity-*`      | Opacity modifiers like `border-black/50`  |
  | `flex-grow-*`           | `grow-*`                                  |
  | `flex-shrink-*`         | `shrink-*`                                |
  | `overflow-ellipsis`     | `text-ellipsis`                           |
  | `decoration-clone`      | `box-decoration-clone`                    |

### Performance Considerations

- Use Next.js Image component for images
- Implement proper loading states
- Use React.memo() for expensive components
- Prefer server components when possible
- Use dynamic imports for code splitting
- IMPORTANT: Use `pnpm` as the package manager instead of `npm` or `npx`

## Cursor

- Cursor rules are stored under `.cursor/rules` using `.mdc` format
- Follow existing file format to ensure that the rules work

## Common Patterns

### Server Component (default)

```typescript
// app/page.tsx
export default async function HomePage() {
  const data = await fetch('...')
  return <div>{/* render */}</div>
}
```

### Client Component

```typescript
'use client'

import { useState } from 'react'

export function InteractiveComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Custom Hook

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  
  useEffect(() => {
    const item = window.localStorage.getItem(key)
    if (item) setValue(JSON.parse(item))
  }, [key])
  
  const setStoredValue = (value: T) => {
    setValue(value)
    window.localStorage.setItem(key, JSON.stringify(value))
  }
  
  return [value, setStoredValue] as const
}
```

## Environment Setup

- Use `.env.local` for local development
- Use `.env.example` to document required variables
- Never commit actual environment values
- Use `NEXT_PUBLIC_` prefix for client-side variables

## Git Hooks (Recommended)

Set up pre-commit hooks with husky:

```bash
pnpm husky-init
pnpm husky add .husky/pre-commit "npm run pre-commit"
```

## Commands for Common Tasks

### Adding Dependencies

```bash
# UI Libraries
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
pnpm add lucide-react class-variance-authority

# State Management
pnpm add zustand @tanstack/react-query

# Forms
pnpm add react-hook-form @hookform/resolvers zod

# Development
pnpm add -D @types/node
```
