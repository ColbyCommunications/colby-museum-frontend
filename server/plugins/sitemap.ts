import { defineNitroPlugin } from 'nitropack/runtime';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('sitemap:output', async (ctx) => {
        ctx.sitemap = ctx.sitemap.replaceAll(
            'https://museum-backend.colby.edu/',
            'https://museum.colby.edu/'
        ).replaceAll('https://colby-museum-frontend.pages.dev/','https://museum.colby.edu/');
    });
});
