import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PraiseApp',
        short_name: 'PraiseApp',
        description: "PraiseApp est une application moderne de gestion et de partage de chants. Elle permet aux utilisateurs d’ajouter, consulter et gérer facilement des chants en ligne grâce à une interface fluide et intuitive.",
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'logo_praiseApp.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo_praiseApp.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    }),
  ],
})

