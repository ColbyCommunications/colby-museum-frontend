import { defineNitroPlugin } from 'nitropack/runtime';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('sitemap:output', async (ctx) => {
        ctx.sitemap = ctx.sitemap.replaceAll(
            'https://museum-backend.colby.edu/',
            'https://colby-cf.colby.edu/'
        );
    });
});
