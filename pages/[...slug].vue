<template>
    <div class="page page--default">
        <Breadcrumbs
            v-if="route.params.slug != ''"
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
            :headingElement="'h1'"
            :subheading="excerpt"
        />
        <BaseModule v-for="(item, index) in components" :moduleData="item" />
    </div>
</template>

<script setup>
    // 1. Imports
    import { onMounted, ref, computed } from 'vue';
    import transitionConfig from '../helpers/transitionConfig';
    import seoConfig from '../helpers/seoConfig';

    // 2. Define Props
    const props = defineProps({
        interface: {
            required: false,
        },
    });

    // 3. Page Meta and Route
    definePageMeta({
        pageTransition: transitionConfig,
    });
    const route = useRoute();
    const fullPath = route.fullPath;

    const data = await useFetchContent(route.params.slug, props);

    // 6. Data Transformation
    // These are now top-level constants, automatically exposed to the template
    const pageData = data.value.pageData;
    const breadcrumbs = data.value.breadcrumbs;

    const title = pageData?.title?.rendered
        .replace(/–/g, '-')
        .replace(/“/g, '"')
        .replace(/”/g, '"')
        .replace(/’/g, "'");

    const excerpt = pageData?.excerpt?.rendered.replace(/<\/?[^>]+(>|$)/g, '');
    const intro_visible = pageData?.acf?.intro_visible;
    const heading_visible = pageData?.acf?.heading_visible;
    const excerpt_visible = pageData?.acf?.excerpt_visible;

    const components = (pageData?.block_data ?? []).map((comp, i) => {
        let component = { ...comp };
        component.type = component.blockName.replace('acf/', '').replace(/\//g, '-');

        return {
            layoutPosition: i,
            type: component.type,
            ...component.attrs.data,
            attrs: component.attrs.data ? undefined : component.attrs,
            innerHTML: component.rendered ? component.rendered : undefined,
        };
    });

    // 7. Methods (converted to a local function)
    const hasFileExtension = (fileName) => {
        return fileName.includes('.pdf');
    };

    // 8. Lifecycle Hooks (mounted)
    const timeLeft = ref(1);

    onMounted(() => {
        setInterval(async () => {
            if (timeLeft.value === 1) {
                // Use route.path (from useRoute) instead of this.$route.path
                if (hasFileExtension(route.path)) {
                    // Use props.interface instead of this.interface
                    navigateTo(`${props.interface.backend}${route.path}`, {
                        external: true,
                    });

                    history.pushState(null, document.title, location.href);
                    window.addEventListener('popstate', (event) => {
                        history.pushState(null, document.title, location.href);
                    });
                }
            }

            timeLeft.value = timeLeft.value - 1;
        }, 100);
    });
</script>
