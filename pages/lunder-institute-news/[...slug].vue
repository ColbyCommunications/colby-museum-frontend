<template>
    <div class="page page--default">
        <Breadcrumbs
            v-if="$route.params.slug != ''"
            :current="{
                title: title,
                url: $route.fullPath,
            }"
            :manual="{
                title: 'Lunder Institute News',
                url: '/news/page-1?category=6',
            }"
        />
        <IntroContext :heading="title" :headingElement="'h1'" :subheading="excerpt" />
        <BaseModule v-for="(item, index) in components" :moduleData="item" />
    </div>
</template>

<script setup>
    // Imports are moved to the top level
    import transitionConfig from '../helpers/transitionConfig';
    import { useInterfaceStore } from '~/store/interface';
    // `axios` and `seoConfig` were imported but not used, so they are omitted.

    // All logic from `setup()` is now at the top level
    const route = useRoute();
    const iface = useInterfaceStore();

    definePageMeta({
        pageTransition: transitionConfig,
    });

    // Top-level await can be used in <script setup>
    const post = await useFetchContent(route.params.slug, { interface: iface }, 'posts');

    // These variables are automatically exposed to the template
    const title = post.value?.pageData?.title?.rendered
        .replace(/–/g, '-')
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

    // The `props` block is removed as it was unused.
    // The `return` statement is not needed in <script setup>.
</script>
