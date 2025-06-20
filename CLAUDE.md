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
src/
├── app/                  # App Router pages and layouts
├── components/           # Reusable UI components
│   ├── ui/               # Base UI components
│   └── features/         # Feature-specific components
├── lib/                  # Utility functions and configurations
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── styles/               # Global styles and Tailwind config
```

## Key Configuration Files

### ESLint 9 (eslint.config.js)

```javascript
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import next from '@next/eslint-plugin-next'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescript,
      'react': react,
      'react-hooks': reactHooks,
      '@next/next': next,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...next.configs.recommended.rules,
    },
  },
]
```

### Prettier (.prettierrc)

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Scripts (package.json)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --fix",
    "lint:check": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "pre-commit": "npm run type-check && npm run lint:check && npm run format:check"
  }
}
```

## Development Guidelines

### Component Conventions

- Use functional components with TypeScript
- Prefer named exports for components
- Use PascalCase for component names
- Place interfaces/types above component definition

```typescript
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

### Performance Considerations

- Use Next.js Image component for images
- Implement proper loading states
- Use React.memo() for expensive components
- Prefer server components when possible
- Use dynamic imports for code splitting

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
