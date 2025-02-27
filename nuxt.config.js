import ViteYaml from '@modyfi/vite-plugin-yaml';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  build: {
    transpile: ['gsap', '@glidejs/glide', '@gsap/shockingly']
  },

  modules: [
    '@pinia/nuxt',
    ['@nuxtjs/google-fonts', {
      families: {
        'Libre Franklin': [200, 300, 400, 700],
      }
    }]
  ],

  vite: {
    optimizeDeps: {
      exclude: [
        'date-fns'
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/styles.scss" as *;'
        }
      }
    },
    plugins: [
      ViteYaml()
    ],
  },

  experimental: {
    asyncContext: true
  },

  devtools: { enabled: true },
  compatibilityDate: '2025-02-27'
})