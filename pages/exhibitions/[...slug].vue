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
import axios from 'axios';

import transitionConfig from '../helpers/transitionConfig';
import seoConfig from '../helpers/seoConfig';

export default {
  async setup(props) {
    definePageMeta({
      pageTransition: transitionConfig,
    });

    const { data } = await useAsyncData('posts', async () => {
      const { data } = await seoConfig(props, 'exhibitions')

      const pageData = computed( () => data.value?.at(0) )

      const url = computed( () => `https://museum-backend.colby.edu/wp-json/wp/v2/breadcrumbs/${ pageData.value.id }` )
      
      const crumbData = await $fetch(url.value) 
      const breadcrumbs = crumbData ? crumbData : []

      return { pageData, breadcrumbs }
    })

    const post = data.value?.pageData ?? {}
    const breadcrumbs = data.value?.breadcrumbs ?? [] 

    const title = post.title.rendered
      .replace(/–/g, '-')
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/’/g, "'");
    
    const excerpt = post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '');
    const intro_visible = post.acf.intro_visible;
    const heading_visible = post.acf.heading_visible;
    const excerpt_visible = post.acf.excerpt_visible;
    const location = post.acf.location;
    const address = post.acf.address;

    let start_time, end_time
    const date = new Date(`${post.acf.date.substr(0,4)}-${post.acf.date.substr(4,2)}-${post.acf.date.substr(6,2)}T00:00:00`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour12: false
    });

    let end_date
    if (post.acf.end_date) {
      end_date = new Date(`${post.acf.end_date.substr(0,4)}-${post.acf.end_date.substr(4,2)}-${post.acf.end_date.substr(6,2)}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour12: false
      });
    }

    const components = post.block_data.map((component) => {
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
