import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Đảm bảo tất cả routes được xử lý bởi index.html (SPA routing)
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
})
