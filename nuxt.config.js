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

  sitemap: {
    sources: [
      'https://master-7rqtwti-fr35dlu44eniu.us-4.platformsh.site/wp-sitemap-posts-page-1.xml'
    ]
  },

  build: {
    transpile: ['gsap', '@glidejs/glide', '@gsap/shockingly']
  },

  modules: ['@pinia/nuxt', ['@nuxtjs/google-fonts', {
    families: {
      'Libre Franklin': [200, 300, 400, 700],
    }
  }], '@nuxtjs/sitemap', '@nuxtjs/robots'],

  vite: {
    optimizeDeps: {
      exclude: [
        'date-fns'
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/styles.scss" as *;',
          api: 'modern-compiler',
          silenceDeprecations: [
            'color-functions',
            'global-builtin',
            'import',
            'legacy-js-api',
            'mixed-decls'
          ]
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