import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    nodePolyfills({
      protocolImports: true, // polyfill `assert`, `util`, `process`, etc.
    })
  ],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
})
