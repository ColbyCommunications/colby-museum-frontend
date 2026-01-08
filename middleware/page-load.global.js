import { defineNuxtRouteMiddleware } from '#app';
import { useInterfaceStore } from '~/store/interface';

export default defineNuxtRouteMiddleware((to, from) => {
    const iface = useInterfaceStore();

    // Check the destination route path (to.path)
    if (to.path !== '/search') {
        iface.setSearch(false);
        iface.setSearchText('');
    }
});
