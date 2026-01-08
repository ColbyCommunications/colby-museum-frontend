<template>
    <div class="page page--default">
        <Breadcrumbs
            v-if="route.params.slug != ''"
            :current="{
                title: title,
                url: fullPath,
            }"
            :manual="{
                title: 'Exhibitions',
                url: '/exhibitions/page-1',
            }"
        />
        <IntroContext
            :class="[
                heading_visible ? '' : 'sr-only--heading',
                excerpt_visible ? '' : 'sr-only--excerpt',
            ]"
            :heading="title"
            :headingElement="'h1'"
            :subheading="excerpt"
        />
        <ArticleGrid
            class="article-grid--event-meta"
            :bordered="true"
            :columns="'3'"
            :items="[
                {
                    heading: 'Location',
                    paragraph: location ? location.charAt(0).toUpperCase() + location.slice(1) : '',
                },
                {
                    heading: 'Space',
                    paragraph: address ? address : '',
                },
                {
                    heading: 'Dates',
                    paragraph: end_date
                        ? `${String(date)}&ndash;${String(end_date)}`
                        : String(date),
                },
            ]"
        />
        <BaseModule v-for="(item, index) in components" :key="index" :moduleData="item" />
    </div>
</template>

<script setup>
    import transitionConfig from '../helpers/transitionConfig';
    // import seoConfig from '../helpers/seoConfig';
    import { useInterfaceStore } from '~/store/interface';

    // Get route and props
    const route = useRoute();
    const fullPath = route.fullPath;
    const props = defineProps(); // Gets props passed to the component

    // Set page meta
    definePageMeta({
        pageTransition: transitionConfig,
    });

    // Fetch data
    const data = await useFetchContent(
        route.params.slug,
        {
            ...props,
            interface: useInterfaceStore(),
        },
        'exhibitions'
    );

    // Process data
    const pageData = data.value?.pageData ?? {};

    const title = pageData?.title?.rendered
        ?.replace(/–/g, '-')
        .replace(/“/g, '"')
        .replace(/”/g, '"')
        .replace(/’/g, "'");

    const excerpt = pageData?.excerpt?.rendered?.replace(/<\/?[^>]+(>|$)/g, '');
    const location = pageData?.acf?.location;
    const address = pageData?.acf?.address;

    // Date formatting
    const postDate = pageData?.acf?.date;
    const date = new Date(
        `${postDate?.substr(0, 4)}-${postDate?.substr(4, 2)}-${postDate?.substr(6, 2)}T00:00:00`
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour12: false,
    });

    let end_date;
    if (pageData?.acf?.end_date) {
        end_date = new Date(
            `${pageData.acf.end_date.substr(0, 4)}-${pageData.acf.end_date.substr(
                4,
                2
            )}-${pageData.acf.end_date.substr(6, 2)}T00:00:00`
        ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour12: false,
        });
    }

    // Component mapping
    const components = pageData?.block_data?.map((component) => {
        component.type = component.blockName.replace('acf/', '').replace(/\//g, '-');

        return {
            type: component.type,
            ...component.attrs.data,
            attrs: component.attrs.data ? undefined : component.attrs,
            innerHTML: component.rendered ? component.rendered : undefined,
        };
    });

    // Hardcoded values from original return statement
    const heading_visible = true;
    const excerpt_visible = true;

    // The `formatTime` method was removed as it was not used.
</script>
