import ViteYaml from '@modyfi/vite-plugin-yaml';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    site: { indexable: false },
    app: {
        head: {
            htmlAttrs: {
                lang: 'en',
            },
            script: [
                {
                    src: 'https://siteimproveanalytics.com/js/siteanalyze_66357444.js',
                    async: true,
                },
            ],
        },
    },

    sitemap: {
        sources: [
            'https://museum-backend.colby.edu/wp-sitemap-posts-page-1.xml',
            'https://museum-backend.colby.edu/wp-sitemap-posts-exhibitions-1.xml',
            'https://museum-backend.colby.edu/wp-sitemap-posts-events-1.xml',
            'https://museum-backend.colby.edu/wp-sitemap-posts-collections-1.xml',
            'https://museum-backend.colby.edu/wp-sitemap-posts-post-1.xml',
        ],
    },

    routeRules: {
        '/objects': {
            // Temporary redirect using a 307 status code
            redirect: 'objects/page-1',
        },
        '/events': {
            // Temporary redirect using a 307 status code
            redirect: 'events/page-1',
        },
        '/news': {
            // Temporary redirect using a 307 status code
            redirect: 'news/page-1',
        },
    },

    build: {
        transpile: ['gsap', '@glidejs/glide', '@gsap/shockingly'],
    },

    modules: [
        '@pinia/nuxt',
        [
            '@nuxtjs/google-fonts',
            {
                families: {
                    'Libre Franklin': [200, 300, 400, 700],
                },
            },
        ],
        '@nuxtjs/sitemap',
        '@nuxtjs/robots',
    ],

    vite: {
        optimizeDeps: {
            exclude: ['date-fns'],
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
                        'mixed-decls',
                    ],
                },
            },
        },
        plugins: [ViteYaml()],
    },

    experimental: {
        asyncContext: true,
    },

    devtools: { enabled: process.mode === 'development' },
    compatibilityDate: '2025-02-27',
});
