import { unref } from 'vue';

// composables/useFetchData.js
export const useFetchContent = async (path, props, type = 'pages') => {

    let rawPath = unref(path);

    if (Array.isArray(rawPath)) {
        rawPath = rawPath.join('/');
    }

    if (!rawPath) {
        rawPath = 'home';
    }

    if (typeof rawPath !== 'string') {
        rawPath = String(rawPath);
    }
    
    const normalizedPath = (path || '/')
        .replace(/^\/+|\/+$/g, '') || 'home';

    const finalSlug = normalizedPath.split('/').pop();

    const key = `content:${type}:${normalizedPath}`;

    const { data, error } = await useAsyncData(
        key,
        async () => {
            const pages = await $fetch(`${props.interface.endpoint}${type}`, {
                method: 'GET',
                query: {
                    slug: finalSlug,
                    _embed: 'wp:featuredmedia',
                },
                headers: {
                    'Cache-Control': 'no-cache',
                },
                cache: 'no-store',
            });

            const candidates = Array.isArray(pages) ? pages : [];

            const pageDataValue =
                candidates.find((page) => {
                    if (!page?.link) return false;

                    try {
                        const wpPath = new URL(page.link).pathname
                            .replace(/^\/+|\/+$/g, '');

                        return wpPath === normalizedPath;
                    } catch {
                        return false;
                    }
                }) || candidates[0] || null;

            if (!pageDataValue) {
                return {
                    pageData: null,
                    breadcrumbs: [],
                };
            }

            const breadcrumbs = await $fetch(
                `https://museum-backend.colby.edu/wp-json/wp/v2/breadcrumbs/${pageDataValue.id}`,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                    cache: 'no-store',
                }
            );

            return {
                pageData: pageDataValue,
                breadcrumbs: breadcrumbs || [],
            };
        },
        {
            server: true,
            lazy: false,
            dedupe: 'cancel',
        }
    );

    if (error.value) {
        throw createError({
            statusCode: error.value.statusCode || 500,
            statusMessage: error.value.message || 'Something went wrong',
            fatal: true,
        });
    }

    if (!data.value?.pageData) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Page Not Found',
            fatal: true,
        });
    }

    return data;
};