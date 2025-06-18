import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: [
      'be15-185-172-129-155.ngrok-free.app',
      'localhost',
    ],
  },
})
