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
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Apanha em build/lint o mesmo erro que só apareceu em runtime no
      // Book.jsx: uma const referenciada (ex.: num array de deps de um
      // useEffect) antes da sua própria declaração no mesmo scope.
      'no-use-before-define': ['error', { variables: true, functions: false, classes: false }],
    },
  },
])
