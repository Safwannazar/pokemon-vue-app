import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './', // Important for Azure Static Web Apps
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})