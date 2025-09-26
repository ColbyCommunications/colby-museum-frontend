import { defineStore } from 'pinia';
import nuxtStorage from 'nuxt-storage';

// const getSettings = () => {
//   const settings = typeof window !== 'undefined' ? localStorage.getItem('darkMode');

//   return settings ? JSON.parse(settings) : false;
// }

export const useInterfaceStore = defineStore({
    id: 'interface',
    state: () => {
        return {
            backend: 'https://dev-54ta5gq-fr35dlu44eniu.us-4.platformsh.site/',
            endpoint: 'https://dev-54ta5gq-fr35dlu44eniu.us-4.platformsh.site/wp-json/wp/v2/',
            endpointv3: 'https://dev-54ta5gq-fr35dlu44eniu.us-4.platformsh.site/wp-json/acf/v3/',
            drawer: false,
            dark: false,
            modal: false,
        };
    },
    actions: {
        setDrawer(drawer) {
            this.drawer = drawer;
        },
        setDark(dark) {
            this.dark = dark;
        },
        toggleDark() {
            this.dark = !this.dark;

            if (this.dark == true) {
                document.body.className = 'dark-mode';
                localStorage.setItem('darkMode', true);
                // nuxtStorage.localStorage.setData('darkMode', true);
            } else {
                document.body.className = '';
                localStorage.setItem('darkMode', false);
                // nuxtStorage.localStorage.setData('darkMode', false);
            }
        },
        toggleModal() {
            this.modal = !this.modal;
        },
    },
});
