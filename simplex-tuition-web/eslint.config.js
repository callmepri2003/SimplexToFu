import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    files: ['**/*.test.js', 'src/test/**'],
    languageOptions: { globals: { ...globals.vitest } },
  },
  {
    files: ['cypress/**', '**/*.cy.{js,jsx}'],
    languageOptions: { globals: { ...globals.mocha, ...globals.node, cy: 'readonly', Cypress: 'readonly', expect: 'readonly', assert: 'readonly' } },
  },
  {
    files: ['cypress.config.js', 'vite.config.js', 'vitest.config.js'],
    languageOptions: { globals: globals.node },
    rules: { 'no-unused-vars': 'off' },
  },
])
