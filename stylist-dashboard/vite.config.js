import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/stylist/',
  build: {
    out,
    Dir: '../stylist'
  },
  server: {
    host: true,
    port: 5173,
  },
})