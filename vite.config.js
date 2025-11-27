import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// NOTE: removed the ESM-only `@tailwindcss/vite` plugin to avoid a require/ESM
// incompatibility when Vite loads the config in certain environments.
// If you want Tailwind, integrate it via PostCSS (`postcss.config.js`) and
// `tailwindcss` plugin instead.
export default defineConfig({
  plugins: [react(),tailwindcss()]
})
