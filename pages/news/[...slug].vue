<template>
    <div class="page page--default">
        <Breadcrumbs
            v-if="normalizedPath !== ''"
            :current="{
                title,
                url: fullPath,
            }"
            :manual="{
                title: 'News',
                url: '/news/page-1',
            }"
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
    </div>
</template>

<script setup>
import { computed } from 'vue';
import transitionConfig from '../helpers/transitionConfig';
import { useInterfaceStore } from '~/store/interface';

const route = useRoute();
const iface = useInterfaceStore();

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
        : String(slug);
});

const fullPath = computed(() => route.fullPath);

const post = await useFetchContent(
    normalizedPath.value,
    { interface: iface },
    'posts'
);

const pageData = post.value?.pageData ?? {};

const title =
    pageData.title?.rendered
        ?.replace(/–/g, '-')
        .replace(/“/g, '"')
        .replace(/”/g, '"')
        .replace(/’/g, "'") ?? '';

const excerpt =
    pageData.excerpt?.rendered
        ?.replace(/<\/?[^>]+(>|$)/g, '') ?? '';

const components = (pageData.block_data ?? []).map((component) => {
    const type = component.blockName
        ?.replace('acf/', '')
        .replace(/\//g, '-');

    return {
        type,
        ...component.attrs?.data,
        attrs: component.attrs?.data
            ? undefined
            : component.attrs,
        innerHTML: component.rendered || undefined,
    };
});
</script>