<template>
    <div class="page page--default">
        <Breadcrumbs
            vindo-if="$route.params.slug != ''"
            :current="{
                title: title,
                url: fullPath,
            }"
            :manual="{
                title: 'Events',
                url: '/events/page-1',
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
            :columns="'4'"
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
                    heading: 'Date',
                    paragraph: String(date),
                },
                {
                    heading: 'Time',
                    paragraph: start_time + '&ndash;' + end_time,
                },
            ]"
        />
        <BaseModule v-for="(item, index) in components" :moduleData="item" />
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
        : slug;
});

const fullPath = route.fullPath;

const formatTime = (value) => {
    if (!value || typeof value !== 'string') {
        return '';
    }

    const raw = value.trim().toLowerCase();

    const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm|a\.m\.|p\.m\.)?$/);

    if (!match) {
        return value;
    }

    let hour = Number(match[1]);
    const minutes = match[2];
    const meridiem = match[3]?.replace(/\./g, '');

    if (meridiem === 'am' || meridiem === 'pm') {
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${meridiem === 'am' ? 'a.m.' : 'p.m.'}`;
    }

    const computedMeridiem = hour >= 12 ? 'p.m.' : 'a.m.';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    return `${displayHour}:${minutes} ${computedMeridiem}`;
};

const formatAcfDate = (value) => {
    if (!value || typeof value !== 'string' || value.length < 8) {
        return '';
    }

    return new Date(
        `${value.substr(0, 4)}-${value.substr(4, 2)}-${value.substr(6, 2)}T00:00:00`
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour12: false,
    });
};

const post = await useFetchContent(
    normalizedPath.value,
    { interface: iface },
    'events'
);

const pageData = post.value?.pageData ?? {};

const title = pageData?.title?.rendered
    ?.replace(/–/g, '-')
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/’/g, "'") ?? '';

const excerpt = pageData?.excerpt?.rendered
    ?.replace(/<\/?[^>]+(>|$)/g, '') ?? '';

const heading_visible = pageData?.acf?.heading_visible;
const excerpt_visible = pageData?.acf?.excerpt_visible;
const location = pageData?.acf?.location;
const address = pageData?.acf?.address;

const date = formatAcfDate(pageData?.acf?.date);
const end_date = formatAcfDate(pageData?.acf?.end_date);

const start_time = pageData?.acf?.start_time
    ? formatTime(pageData.acf.start_time)
    : '';

const end_time = pageData?.acf?.end_time
    ? formatTime(pageData.acf.end_time)
    : '';

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