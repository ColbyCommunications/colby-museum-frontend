<template>
    <div class="page page--default">
        <Breadcrumbs
            v-if="$route.params.slug != ''"
            :current="{
                title: title,
                url: $route.fullPath,
            }"
            :manual="{
                title: 'News',
                url: '/news/page-1',
            }"
        />
        <IntroContext :heading="title" :headingElement="'h1'" :subheading="excerpt" />
        <BaseModule v-for="(item, index) in components" :moduleData="item" />
    </div>
</template>

<script setup>
    import transitionConfig from '../helpers/transitionConfig';
    import { useInterfaceStore } from '~/store/interface';

    // --- Logic from setup() is now at the top level ---

    const route = useRoute();
    const iface = useInterfaceStore();

    definePageMeta({
        pageTransition: transitionConfig,
    });

    // Top-level await is supported in <script setup>
    const post = await useFetchContent(route.params.slug, { interface: iface }, 'posts');

    // --- Variables are automatically exposed to the template ---

    const title = post.value?.pageData?.title.rendered
        .replace(/–/g, '-')
        .replace(/“/g, '"')
        .replace(/”/g, '"')
        .replace(/’/g, "'");

    const excerpt = post.value?.pageData?.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '');

    const components = post.value?.pageData?.block_data.map((component) => {
        const type = component.blockName.replace('acf/', '').replace(/\//g, '-');

        return {
            type,
            ...component.attrs.data,
            attrs: component.attrs.data ? undefined : component.attrs,
            innerHTML: component.rendered ? component.rendered : undefined,
        };
    });

    // No return statement or props block is needed
</script>
