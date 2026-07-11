<template>
    <div class="page page--default">
        <Breadcrumbs
            v-if="normalizedPath !== ''"
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

        <IntroContext
            :heading="title"
            headingElement="h1"
            :subheading="excerpt"
        />

        <BaseModule
            v-for="(item, index) in components"
            :key="`${item.type}-${index}`"
            :moduleData="item"
        />

        <BigArrowBtnSection
            :button="{
                reverse: true,
                title: 'About the Collection',
                url: '/collection/about-the-collection',
            }"
        />

        <BigArrowBtnSection
            v-if="embark_id"
            align="right"
            :button="{
                title: 'View all works in this collection',
                url: `/objects/page-1?embark_id=${embark_id}`,
            }"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import transitionConfig from '../helpers/transitionConfig';

const props = defineProps({
    interface: {
        required: false,
    },
});

const route = useRoute();
const fullPath = route.fullPath;

definePageMeta({
    pageTransition: transitionConfig,
});

const normalizedPath = computed(() => {
    const slug = route.params.slug;

    if (!slug) {
        return '';
    }

    return Array.isArray(slug)
        ? slug.join('/')
        : slug;
});

const post = await useFetchContent(
    normalizedPath.value,
    props,
    'collections'
);

const pageData = post.value?.pageData ?? {};

const embark_id = pageData?.acf?.embark_id;

const title = pageData?.title?.rendered
    ?.replace(/–/g, '-')
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/’/g, "'") ?? '';

const excerpt = pageData?.excerpt?.rendered
    ?.replace(/<\/?[^>]+(>|$)/g, '') ?? '';

const components = (pageData?.block_data ?? []).map((component) => {
    const normalizedComponent = { ...component };

    normalizedComponent.type = normalizedComponent.blockName
        .replace('acf/', '')
        .replace(/\//g, '-');

    return {
        type: normalizedComponent.type,
        ...normalizedComponent.attrs?.data,
        attrs: normalizedComponent.attrs?.data ? undefined : normalizedComponent.attrs,
        innerHTML: normalizedComponent.rendered ? normalizedComponent.rendered : undefined,
    };
});
</script>