import { defineNitroPlugin } from 'nitropack/runtime';

let deployUrl = 'https://museum.colby.edu/'
if (context.env.CF_PAGES && context.env.CF_PAGES_BRANCH !== 'master') {
    deployUrl = context.env.CF_PAGES_URL    
}

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('sitemap:output', async (ctx) => {
        ctx.sitemap = ctx.sitemap.replaceAll(
            'https://museum-backend.colby.edu/',
            deployUrl
        ).replaceAll('https://colby-museum-frontend.pages.dev/', deployUrl);
    });
});
