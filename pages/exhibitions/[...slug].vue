<template>
    <div class="page page--default">
        <Breadcrumbs
            v-if="normalizedPath !== ''"
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
                        ? `${formatDate(String(date))}&ndash;${formatDate(String(end_date))}`
                        : formatDate(String(date)),
                },
            ]"
        />
        <BaseModule v-for="(item, index) in components" :key="index" :moduleData="item" />
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import transitionConfig from '../helpers/transitionConfig';
    import { useInterfaceStore } from '~/store/interface';
    import formatDate from '~/helpers/formatDate';

    const route = useRoute();
    const fullPath = route.fullPath;
    const props = defineProps();

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

    const data = await useFetchContent(
        normalizedPath.value,
        {
            ...props,
            interface: useInterfaceStore(),
        },
        'exhibitions'
    );

    const pageData = data.value?.pageData ?? {};

    const title = pageData?.title?.rendered
        ?.replace(/–/g, '-')
        .replace(/“/g, '"')
        .replace(/”/g, '"')
        .replace(/’/g, "'") ?? '';

    const excerpt = pageData?.excerpt?.rendered?.replace(/<\/?[^>]+(>|$)/g, '') ?? '';
    const location = pageData?.acf?.location;
    const address = pageData?.acf?.address;

    const postDate = pageData?.acf?.date;

    const date = postDate
        ? new Date(
              `${postDate.substr(0, 4)}-${postDate.substr(4, 2)}-${postDate.substr(6, 2)}T00:00:00`
          ).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: '2-digit',
              hour12: false,
          })
        : '';

    let end_date = '';

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

    const heading_visible = true;
    const excerpt_visible = true;
</script>