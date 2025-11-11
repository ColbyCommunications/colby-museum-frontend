import seoConfig from '../helpers/seoConfig';

export const useFetchContent = async (path, props) => {
    // 1. Create a unique key for useAsyncData
    const key = `content-${path}`;

    // 2. Fetch the data
    const { data, error } = await useAsyncData(key, async () => {
        const { data } = await seoConfig(props);

        // Using computed here is fine, but we only need the value
        const pageDataValue = data.value?.at(0);

        // Guard against pageDataValue being null if data.value is empty
        if (!pageDataValue) {
            return { pageData: null, breadcrumbs: [] };
        }

        const url = `https://museum-backend.colby.edu/wp-json/wp/v2/breadcrumbs/${pageDataValue.id}`;

        const crumbData = await $fetch(url);
        const breadcrumbs = crumbData ? crumbData : [];

        // Return the raw values
        return { pageData: pageDataValue, breadcrumbs };
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
    if (!data.value.pageData) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Page Not Found',
            fatal: true,
        });
    }

    // 5. If everything is good, return the data
    return data;
};
