import { defineStore } from 'pinia'

export const useInterfaceStore = defineStore({
  id: 'interface',
  state: () => {
    return {
      backend: 'https://master-7rqtwti-fr35dlu44eniu.us-4.platformsh.site/',
      endpoint: 'https://master-7rqtwti-fr35dlu44eniu.us-4.platformsh.site/wp-json/wp/v2/',
      endpointv3: 'https://master-7rqtwti-fr35dlu44eniu.us-4.platformsh.site/wp-json/acf/v3/',
      drawer: false,
      dark: false,
      modal: false,
    }
  },
  actions: {
    setDrawer(drawer) {
      this.drawer = drawer;
    },
    toggleDark() {
      this.dark = !this.dark;

      if (this.dark == true) {
        document.body.className = 'dark-mode';
      } else {
        document.body.className = ''; 
      }
    },
    toggleModal() {
      this.modal = !this.modal;
    }
  },
})