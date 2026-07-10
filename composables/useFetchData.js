export const useFetchContent = async (path, props, type) => {
    // 1. Create a truly unique key per route path
    const key = `content-${path}`;

    // 2. Fetch the data
    const { data, error } = await useAsyncData(key, async () => {
        // NOTE: Ensure seoConfig knows about the path or handles dynamic fetching!
        const { data } = await seoConfig(props, type);

        const pageDataValue = data.value?.at(0);

        if (!pageDataValue) {
            return { pageData: null, breadcrumbs: [] };
        }

        // Add a server-only cache buster so Cloudflare workers fetch fresh from WP
        const cacheBuster = process.server ? `?_cb=${Date.now()}` : '';
        const url = `https://museum-backend.colby.edu/wp-json/wp/v2/breadcrumbs/${pageDataValue.id}${cacheBuster}`;

        const crumbData = await $fetch(url);
        const breadcrumbs = crumbData ? crumbData : [];

        return { pageData: pageDataValue, breadcrumbs };
    }, {
        // CRUCIAL FOR SSR WORKERS: 
        // Returning null tells Nuxt to always execute the fetch block on server boots 
        // rather than fetching stale data from the Worker's active instance memory.
        getCachedData: () => null
    });

    // 3. Check for errors from the fetch itself
    if (error.value) {
        throw createError({
            statusCode: error.value.statusCode || 500,
            statusMessage: error.value.message || 'Something went wrong',
            fatal: true,
        });
    }

    // 4. Check if data is null or empty (the 404 condition)
    if (!data.value || !data.value.pageData) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Page Not Found',
            fatal: true,
        });
    }

    return data;
};