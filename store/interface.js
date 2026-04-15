import { defineStore } from 'pinia';
import debounce from 'lodash.debounce';

// 1. Define the core logic for the debounced function outside the store
// 🛑 FIX: The function now explicitly accepts 'ctx' (the store instance) and 'value'.
const debouncedSearchFn = debounce(function (ctx, value) {
    // 🛑 FIX: Use the context argument (ctx) to access and modify the state.
    ctx.debouncedSearchText = value;
}, 2000);

export const useInterfaceStore = defineStore('interface', {
    state: () => ({
        backend: 'https://dev-54ta5gq-fr35dlu44eniu.us-4.platformsh.site/',
        endpoint: 'https://dev-54ta5gq-fr35dlu44eniu.us-4.platformsh.site/wp-json/wp/v2/',
        endpointv3: 'https://dev-54ta5gq-fr35dlu44eniu.us-4.platformsh.site/wp-json/acf/v3/',
        endpointcustom: 'https://dev-54ta5gq-fr35dlu44eniu.us-4.platformsh.site/wp-json/custom/v1/',
        drawer: false,
        dark: false,
        modal: false,
        search: false,
        searchText: '',
        debouncedSearchText: '',
    }),

    actions: {
        setSearchText(searchText) {
            this.searchText = searchText;
            debouncedSearchFn(this, searchText);
        },
        setSearch(search) {
            this.search = search;
        },
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
            } else {
                document.body.className = '';
                localStorage.setItem('darkMode', false);
            }
        },
        toggleModal() {
            this.modal = !this.modal;
        },
    },
});
