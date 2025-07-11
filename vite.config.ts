import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    // Configuración para construir la librería
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'ReactSmartChessboard',
          fileName: 'index'
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            }
          }
        }
      }
    }
  }

  // Configuración para desarrollo/demo
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true
    }
  }
})