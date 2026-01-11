import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    define: {
      // This is necessary because the @google/genai SDK and our code use process.env.API_KEY
      // In a browser/mobile environment, process.env is undefined.
      // This replaces it with the actual string value at build time.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY)
    },
    server: {
      proxy: {
        '/bikedesk-api': {
          target: 'https://api.c1st.com/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/bikedesk-api/, '')
        }
      }
    }
  }
})