<template>
    <div class="page page--default">
        <Breadcrumbs
            v-if="route.params.slug != ''"
            :current="{
                title: title,
                url: fullPath,
            }"
            :manual="[
                {
                    title: 'Collection',
                    url: '/collection',
                },
                {
                    title: 'About the Collection',
                    url: '/collection/about-the-collection',
                },
            ]"
        />
        <IntroContext :heading="title" :headingElement="'h1'" :subheading="excerpt" />
        <BaseModule v-for="(item, index) in components" :key="index" :moduleData="item" />
        <BigArrowBtnSection
            :button="{
                reverse: true,
                title: 'About the Collection',
                url: '/collection/about-the-collection',
            }"
        />
        <BigArrowBtnSection
            v-if="embark_id"
            :align="'right'"
            :button="{
                title: 'View all works in this collection',
                url: `/objects/page-1?embark_id=${embark_id}`,
            }"
        />
    </div>
</template>

<script setup>
    import transitionConfig from '../helpers/transitionConfig';
    // import seoConfig from '../helpers/seoConfig';

    // 1. Define Props
    const props = defineProps({
        interface: {
            required: false,
        },
    });

    // 2. Get route object and define fullPath
    const route = useRoute();
    const fullPath = route.fullPath;

    // 3. Set page meta
    definePageMeta({
        pageTransition: transitionConfig,
    });

    // 4. Fetch data
    const post = await useFetchContent(route.params.slug, props, 'collections');

    // 5. Process data
    const embark_id = post.value?.pageData?.acf?.embark_id;

    const title = post.value?.pageData?.title?.rendered
        ?.replace(/–/g, '-')
        .replace(/“/g, '"')
        .replace(/”/g, '"')
        .replace(/’/g, "'");

    const excerpt = post.value?.pageData?.excerpt?.rendered?.replace(/<\/?[^>]+(>|$)/g, '');

    const components = post.value?.pageData?.block_data?.map((component) => {
        component.type = component.blockName.replace('acf/', '').replace(/\//g, '-');

        return {
            type: component.type,
            ...component.attrs.data,
            attrs: component.attrs.data ? undefined : component.attrs,
            innerHTML: component.rendered ? component.rendered : undefined,
        };
    });

    // All variables defined here (title, excerpt, embark_id, fullPath, components)
    // are automatically available to the template. No 'return' is needed.
</script>
