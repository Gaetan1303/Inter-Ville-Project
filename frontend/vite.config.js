import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Port du serveur de développement frontend
    host: true, // Permet l'accès depuis le réseau local
  },
})
