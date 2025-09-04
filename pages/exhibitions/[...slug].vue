<template>
  <div class="page page--default">
    <Breadcrumbs
      v-if="$route.params.slug != ''"
      :current="{
        title: title,
        url: $route.fullPath,
      }"
      :manual="{
        title: 'Exhibitions',
        url: '/exhibitions/page-1',
      }"
    />
    <IntroContext
      :class="[heading_visible ? '' : 'sr-only--heading', excerpt_visible ? '' : 'sr-only--excerpt']"
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
          paragraph: location ? location.charAt(0).toUpperCase()
  + location.slice(1) : '',
        },
        {
          heading: 'Space',
          paragraph: address ? address : ''
        },
        {
          heading: 'Dates',
          paragraph: end_date ? `${String(date)}&ndash;${String(end_date)}` : String(date),
        },
      ]"
    />
    <BaseModule
      v-for="(item, index) in components"
      :moduleData="item"
    />
  </div>
</template>

<script>
import transitionConfig from '../helpers/transitionConfig';
import seoConfig from '../helpers/seoConfig';
import { useInterfaceStore } from '~/store/interface'

export default {
  async setup(props) {
    const route = useRoute()
    definePageMeta({
      pageTransition: transitionConfig,
    });
    const { data } = await useAsyncData(`exhibition-${route.params.slug}`, async () => {
      const { data } = await seoConfig({...props, interface: useInterfaceStore()}, 'exhibitions')
  
      const pageData = computed( () => data.value?.at(0) )

      const url = computed( () => `https://museum-backend.colby.edu/wp-json/wp/v2/breadcrumbs/${ pageData.value.id }` )
      
      const crumbData = await $fetch(url.value) 
      const breadcrumbs = crumbData ? crumbData : []

      return { pageData, breadcrumbs }
    })

    const pageData = data.value?.pageData ?? {}
    const breadcrumbs = data.value?.breadcrumbs ?? [] 

    const title = pageData?.title?.rendered?.replace(/–/g, '-')
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/’/g, "'");
    
    const excerpt = pageData?.excerpt?.rendered?.replace(/<\/?[^>]+(>|$)/g, '');
    const intro_visible = pageData?.acf?.intro_visible;
    const heading_visible = pageData?.acf?.heading_visible;
    const excerpt_visible = pageData?.acf?.excerpt_visible;
    const location = pageData?.acf?.location;
    const address = pageData?.acf?.address;


    let start_time, end_time

    const postDate = pageData?.acf?.date
    const date = new Date(`${postDate?.substr(0,4)}-${postDate?.substr(4,2)}-${postDate?.substr(6,2)}T00:00:00`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour12: false
    });

    let end_date
    if (pageData?.acf?.end_date) {
      end_date = new Date(`${pageData.acf.end_date.substr(0,4)}-${pageData.acf.end_date.substr(4,2)}-${pageData.acf.end_date.substr(6,2)}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour12: false
      });
    }

    const components = pageData?.block_data?.map((component) => {
      component.type = component.blockName
        .replace('acf/','')
        .replace(/\//g,'-');

      return {
        type: component.type,
        ...component.attrs.data,
        attrs: component.attrs.data ? undefined : component.attrs,
        innerHTML: component.rendered ? component.rendered : undefined,
      };
    });

    return {
      title,
      excerpt,
      location,
      address,
      date,
      end_date,
      start_time,
      end_time,
      components,
      breadcrumbs,
      heading_visible: true,
      excerpt_visible: true,
    };
  },
  methods: {
    formatTime(t) {
      const time = t.split(':');
      const hour = parseInt(time[0]);
      const min = time[1];
      const sec = parseInt(time[2]);
      const ampm = (hour >= 12) ? "pm" : "am";

      return `${hour == 12 || hour == 0 ? 12 : hour % 12}:${min}${ampm}`
    },
  }
}
</script>
