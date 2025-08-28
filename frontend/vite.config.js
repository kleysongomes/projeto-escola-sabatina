import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

const ngrokHost = '2c845b1358fe.ngrok-free.app';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Check in Lição',
        short_name: 'CheckInLição',
        description: 'Um app para registrar suas reviews da lição da Escola Sabatina.',
        theme_color: '#FFFFFF',
        display: 'standalone',
        background_color: '#F7F7F7',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    // Usa a variável para a lista de permissões do servidor de desenvolvimento
    allowedHosts: [ngrokHost],
    hmr: {
      // Usa a variável para o HMR
      host: ngrokHost,
      protocol: 'wss',
    }
  },
  // --- ADICIONAR ESTE NOVO BLOCO PARA O PREVIEW ---
  preview: {
    // Permite que o servidor de preview seja acessado externamente
    host: true,
    // Adiciona o host do ngrok à lista de permissões do preview
    allowedHosts: [ngrokHost],
  }
})