import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/** Matches modules from any of the given package-path prefixes, on any OS. */
function fromPackages(...prefixes) {
  return (id) => {
    const normalized = id.split(path.sep).join('/')
    return prefixes.some((prefix) => normalized.includes(`/node_modules/${prefix}`))
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    // The PDF renderer (about 1.2 MB, loaded only by the Resume Builder) is larger than the default 500 kB limit.
    chunkSizeWarningLimit: 1400,
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks so app updates do not invalidate library caches.
        codeSplitting: {
          groups: [
            { name: 'react', test: fromPackages('react/', 'react-dom/', 'react-router/', 'react-router-dom/', 'scheduler/') },
            { name: 'data', test: fromPackages('@tanstack/', 'axios/') },
            { name: 'forms', test: fromPackages('react-hook-form/', '@hookform/', 'zod/') },
            { name: 'ui', test: fromPackages('radix-ui/', '@radix-ui/', 'sonner/', 'lucide-react/') },
            { name: 'charts', test: fromPackages('recharts/', 'd3-', 'victory-vendor/') },
            // Only the lazily loaded Resume Builder imports this, so it never joins the initial download.
            { name: 'pdf', test: fromPackages('@react-pdf/') },
          ],
        },
      },
    },
  },
})
