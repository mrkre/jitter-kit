import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import next from '@next/eslint-plugin-next'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

export default defineConfig([
  {
    ignores: [
      '.next/',
      'eslint.config.js',
      'next.config.mjs',
      'tailwind.config.js',
    ],
  },
  {
    plugins: {
      '@next/next': next,
    },
  },
  // Base JavaScript recommendations
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // TypeScript, React, and Next.js configuration
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@typescript-eslint': typescript,
      react: react,
      'react-hooks': reactHooks,
      '@next/next': next,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Spread recommended rules
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,

      // Custom overrides and additional rules
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/prop-types': 'off', // Not needed with TypeScript

      // General best practices that might not be in recommended
      'no-console': 'warn',
      'prefer-const': 'error',
    },
  },

  // Add Prettier's recommended config last to override other configs
  prettierRecommended,

  // Specific overrides for config files
  {
    files: ['**/*.config.{js,ts,mjs}', '**/next.config.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
])
