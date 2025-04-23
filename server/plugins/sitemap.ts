import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:output', async (ctx) => {
    ctx.sitemap = ctx.sitemap.replaceAll('https://master-7rqtwti-fr35dlu44eniu.us-4.platformsh.site/', 'https://colby-museum-frontend.pages.dev/')
  })
})