<template>
  <div class="page page--default">
    <IntroContext
      :class="[intro_visible ? '' : 'sr-only']"
      :heading="title"
      :headingElement="'h1'"
      :subheading="excerpt"
    />
    <ArticleGrid
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
          heading: 'Date',
          paragraph: end_date ? `${String(date)}—${String(end_date)}` : String(date),
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
  setup(props) {
    seoConfig(props, 'exhibitions');

    definePageMeta({
      pageTransition: transitionConfig,
    });
  },
  data() {
    return {
      title: undefined,
      excerpt: undefined,
      location: undefined,
      address: undefined,
      date: undefined,
      end_date: undefined,
      start_time: undefined,
      end_time: undefined,
      components: undefined,
    };
  },
  props: {
    interface: {
      required: false,
    },
  },
  async mounted() {
    const page = this;

    // console.log(this.$route.params.slug);

    await axios
      .get(`${this.interface.endpoint}exhibitions?slug=${this.$route.params.slug ? this.$route.params.slug : 'home'}`)
      .then((output) => {
        const post = output.data[0];
        console.log(post.date);

        page.title = post.title.rendered
          .replace(/–/g, '-')
          .replace(/“/g, '"')
          .replace(/”/g, '"')
          .replace(/’/g, "'");
        
        page.excerpt = post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '');
        page.intro_visible = post.acf.intro_visible;
        page.location = post.acf.location;
        page.address = post.acf.address;
        page.date = new Date(post.acf.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour12: false
        });

        if (post.acf.end_date) {
          page.end_date = new Date(post.acf.end_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour12: false
          });

          console.log(page.end_date);
        }

        // page.start_time = this.formatTime(post.acf.start_time);
        // page.end_time = this.formatTime(post.acf.end_time);

        page.components = post.block_data.map((component) => {
          
          component.type = component.blockName
            .replace('acf/','')
            .replace(/\//g,'-');

          return {
            type: component.type,
            ...component.attrs.data,
            attrs: component.attrs.data ? undefined : component.attrs,
          };
        });
      });
  },
  methods: {
    formatTime(t) {
      const time = t.split(':');
      const hour = parseInt(time[0]);
      const min = time[1];
      const sec = parseInt(time[2]);
      const ampm = (hour >= 12) ? "pm" : "am";

      return `${hour == 12 || hour == 0 ? 12 : hour % 12}:${min}${ampm}`
    }
  }
}
</script>
