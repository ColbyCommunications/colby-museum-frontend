/**
 * Installs vue-dompurify-html for isomorphic SSR / Client rendering
 * See https://github.com/LeSuisse/vue-dompurify-html/tree/main/packages/vue-dompurify-html#usage-with-nuxt-3
 *
 **/ 
import VueDOMPurifyHTML from 'vue-dompurify-html';
import { JSDOM } from 'jsdom';
import DOMPurify from 'isomorphic-dompurify';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(
        VueDOMPurifyHTML,
        { enableSSRPropsSupport: true },
        () => DOMPurify,
    );
});
