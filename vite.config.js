import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/connections/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
