import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // এই লাইনটা যোগ হবে

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // এখানেও যোগ হবে
  ],
})