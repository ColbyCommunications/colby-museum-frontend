<template>
  <div class="page page--default">
    <Breadcrumbs
      v-if="$route.params.slug != ''"
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
      :class="[heading_visible ? '' : 'sr-only--heading', excerpt_visible ? '' : 'sr-only--excerpt']"
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
          paragraph: location ? location.charAt(0).toUpperCase()
  + location.slice(1) : '',
        },
        {
          heading: 'Space',
          paragraph: address ? address : ''
        },
        {
          heading: 'Date',
          paragraph: String(date),
        },
        {
          heading: 'Time',
          paragraph: start_time + '&ndash;' + end_time,
        }
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
import { useInterfaceStore } from '~/store/interface';

const formatTime = (t) => {
  const time = t.split(':');
  const hour = parseInt(time[0]);
  const min = time[1];
  const sec = parseInt(time[2]);
  const ampm = (hour >= 12) ? " p.m." : " a.m.";

  return `${hour == 12 || hour == 0 ? 12 : hour % 12}:${min.replace(/\s/g, '').replace('am', ' a.m.').replace('pm', ' p.m.')}`;
}

export default {
  async setup(props) {
    const route = useRoute()
    const iface = useInterfaceStore()

    definePageMeta({
      pageTransition: transitionConfig,
    });

    const { data: post } = await useAsyncData(`events-${route.params.slug}`, async () => {
      const { data } = await seoConfig({interface: iface}, 'events')

      const post = computed( () => data.value?.at(0) )
 
      return post.value
    })

    const title = post.value?.title?.rendered
      .replace(/–/g, '-')
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/’/g, "'");
    
    const excerpt = post.value?.excerpt?.rendered.replace(/<\/?[^>]+(>|$)/g, '');
    const intro_visible = post.value?.acf?.intro_visible;
    const heading_visible = post.value?.acf?.heading_visible;
    const excerpt_visible = post.value?.acf?.excerpt_visible;
    const location = post.value?.acf?.location;
    const address = post.value?.acf?.address;

    let date = ''
    if (post.value?.acf?.date) {
      date = new Date(`${post.value.acf.date.substr(0,4)}-${post.value.acf.date.substr(4,2)}-${post.value.acf.date.substr(6,2)}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour12: false
      });
    }

    let end_date = ''
    if (post.value?.acf?.end_date) {
      end_date = new Date(`${post.value.acf.end_date.substr(0,4)}-${post.value.acf.end_date.substr(4,2)}-${post.value.acf.end_date.substr(6,2)}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour12: false
      });
    }

    const start_time = post.value?.acf?.start_time ? formatTime(post.value.acf.start_time) : 'sup';
    const end_time = post.value?.acf?.end_time ? formatTime(post.value.acf.end_time) : 'dood';

    const components = ( post.value?.block_data ?? [] ).map((component) => {
      
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
      interface: iface,
      title,
      excerpt,
      location,
      address,
      date,
      start_time,
      end_time,
      components,
      excerpt_visible,
      intro_visible,
      heading_visible,
      fullPath: route.fullPath
    };
  },
  methods: {
    formatTime
  }
}
</script>
