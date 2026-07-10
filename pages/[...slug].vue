<template>
    <div class="page page--default">
        <Breadcrumbs
            v-if="normalizedPath !== 'home'"
            :items="breadcrumbs"
            :current="{
                title: title,
                url: fullPath,
            }"
        />

        <IntroContext
            :class="[
                heading_visible ? '' : 'sr-only--heading',
                excerpt_visible ? '' : 'sr-only--excerpt',
            ]"
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
import { onMounted, ref, computed } from 'vue';
import transitionConfig from '../helpers/transitionConfig';

const props = defineProps({
    interface: {
        required: false,
    },
});

definePageMeta({
    pageTransition: transitionConfig,
});

const route = useRoute();

const normalizedPath = computed(() => {
    const slug = route.params.slug;

    if (!slug) {
        return 'home';
    }

    return Array.isArray(slug)
        ? slug.join('/')
        : slug;
});

const fullPath = computed(() => route.fullPath);

const content = await useFetchContent(normalizedPath.value, props);
console.log(content);
const pageData = content.value.pageData;
const breadcrumbs = content.value.breadcrumbs;

const title = pageData?.title?.rendered
    ?.replace(/–/g, '-')
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/’/g, "'") ?? '';

const excerpt = pageData?.excerpt?.rendered
    ?.replace(/<\/?[^>]+(>|$)/g, '') ?? '';

const heading_visible = pageData?.acf?.heading_visible;
const excerpt_visible = pageData?.acf?.excerpt_visible;

const components = (pageData?.block_data ?? []).map((comp, i) => {
    const component = { ...comp };

    component.type = component.blockName
        .replace('acf/', '')
        .replace(/\//g, '-');

    return {
        layoutPosition: i,
        type: component.type,
        ...component.attrs?.data,
        attrs: component.attrs?.data ? undefined : component.attrs,
        innerHTML: component.rendered ? component.rendered : undefined,
    };
});

const hasFileExtension = (fileName) => {
    return fileName.includes('.pdf');
};

const timeLeft = ref(1);

onMounted(() => {
    setInterval(async () => {
        if (timeLeft.value === 1) {
            if (hasFileExtension(route.path)) {
                navigateTo(`${props.interface.backend}${route.path}`, {
                    external: true,
                });

                history.pushState(null, document.title, location.href);

                window.addEventListener('popstate', () => {
                    history.pushState(null, document.title, location.href);
                });
            }
        }

        timeLeft.value = timeLeft.value - 1;
    }, 100);
});
</script>