<template>
    <div class="page page--default">
        <!-- Error State -->
        <div v-if="error" class="p-6 my-4 bg-red-100 text-red-800 rounded">
            <h2>⚠️ Preview Fetch Failed</h2>
            <p>Unable to load draft for ID: {{ route.query.id }}</p>
        </div>

        

        <!-- Render Content -->
        <template v-else-if="pageData">
            <div class="preview-banner">
                Preview Mode — Viewing Draft (ID: {{ pageId }})
            </div>
            <Breadcrumbs
                v-if="breadcrumbs.length && route.params?.slug != ''"
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
            <BaseModule v-for="(item, index) in components" :key="index" :moduleData="item" />
        </template>
    </div>
</template>

<script setup>
    import { onMounted, ref, computed } from 'vue';
    import transitionConfig from '../helpers/transitionConfig';

    // 1. Props & Page Setup
    const props = defineProps({
        interface: {
            type: Object,
            default: () => ({ backend: '' }),
        },
    });

    definePageMeta({
        pageTransition: transitionConfig,
    });

    const route = useRoute();
    const fullPath = route.fullPath;

    const pageId = computed(() => route.query.id)
    const pageType = computed(() => route.query.type || 'page')

    // 1. Generate a unique timestamp for every page load/refresh
    const cacheBuster = ref(Date.now())

    // 2. Fetch with dynamic key & timestamp query param
    const { data: draftResponse, error } = await useFetch(
        () => `/api/wp-draft/${pageId.value}`,
        {
            query: { 
                type: pageType.value, 
                _t: cacheBuster.value // Prevents browser/WP caching
            },
            key: `preview-${pageId.value}-${cacheBuster.value}`, // Prevents Nuxt memory caching
        }
    );

    // 3. Data Transformation & Computed Wrappers
    const pageData = computed(() => draftResponse.value || null);
    
    // Breadcrumbs fallback (if not provided in direct REST payload)
    const breadcrumbs = computed(() => pageData.value?.breadcrumbs || []);

    const title = computed(() => {
        return (pageData.value?.title?.rendered || '')
            .replace(/–/g, '-')
            .replace(/“/g, '"')
            .replace(/”/g, '"')
            .replace(/’/g, "'");
    });

    const excerpt = computed(() => {
        return (pageData.value?.excerpt?.rendered || '').replace(/<\/?[^>]+(>|$)/g, '');
    });

    const heading_visible = computed(() => pageData.value?.acf?.heading_visible ?? true);
    const excerpt_visible = computed(() => pageData.value?.acf?.excerpt_visible ?? true);

    // Safely map block_data into BaseModule structures
    const components = computed(() => {
        const blocks = pageData.value?.block_data ?? [];
        return blocks.map((comp, i) => {
            let component = { ...comp };
            const blockName = component.blockName || '';
            component.type = blockName.replace('acf/', '').replace(/\//g, '-');

            return {
                layoutPosition: i,
                type: component.type,
                ...(component.attrs?.data || {}),
                attrs: component.attrs?.data ? undefined : component.attrs,
                innerHTML: component.rendered ? component.rendered : undefined,
            };
        });
    });

    // 4. Utility Functions & Lifecycle Hooks
    const hasFileExtension = (fileName) => {
        return fileName ? fileName.includes('.pdf') : false;
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

<style scoped>
.preview-banner {
    background-color: #ba0c2f; /* Exact Tailwind amber-500 hex */
    color: #fff;
    padding: 0.5rem 1rem;       /* py-2 (8px) px-4 (16px) */
    text-align: center;         /* text-center */
    font-size: 1.5rem;        /* text-sm (14px) */
    font-weight: 700;           /* font-bold */
    font-family: "Libre Franklin", sans-serif;
}
</style>