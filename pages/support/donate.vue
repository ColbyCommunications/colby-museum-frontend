<template>
  <div class="page page--default">
    <Breadcrumbs
      v-if="$route.params.slug != ''"
      :items="breadcrumbs"
      :current="{
        title: title,
        url: fullPath,
      }"
    />
    <IntroContext
      :class="[heading_visible ? '' : 'sr-only--heading', excerpt_visible ? '' : 'sr-only--excerpt']"
      :heading="title"
      :headingElement="'h1'"
      :subheading="excerpt"
    />
    <DonateForm />
    <BaseModule
      v-for="(item, index) in components"
      :moduleData="item"
    />
  </div>
</template>

<script>
import axios from 'axios';

import transitionConfig from '../../helpers/transitionConfig';
import seoConfig from '../../helpers/seoConfig';

export default {
  setup(props) {
    useSeoMeta({
      ogTitle: () => 'Donation Form | Colby College Museum of Art',
      title: () => 'Donation Form | Colby College Museum of Art',
      ogDescription: () => 'Contact Colby College Museum of Art for any inquiry.',
      description: () => 'Contact Colby College Museum of Art for any inquiry.',
    });

    definePageMeta({
      pageTransition: transitionConfig,
    });
  },
  data() {
    return {
      title: undefined,
      fullPath: undefined,
      excerpt: undefined,
      breadcrumbs: undefined,
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
    const slug = this.$route.params.slug;
    let pageName;

    this.fullPath = this.$route.fullPath;

    console.log(this.$route);
    // console.log(this.$route.params.slug);
    // console.log(`${this.interface.endpoint}pages?slug=${this.$route.params.slug ? this.$route.params.slug : 'home'}`);
    // console.log(slug[slug.length - 1]);

    if (Array.isArray(slug)) {
      pageName = slug[slug.length - 1];
    } else if (slug) {
      pageName = slug;
    } else {
      pageName = 'home';
    }

    await axios
      .get(`${this.interface.endpoint}pages?slug=donate`)
      .then((output) => {
        const post = output.data[0];
        console.log(post);

        page.title = post.title.rendered
          .replace(/–/g, '-')
          .replace(/“/g, '"')
          .replace(/”/g, '"')
          .replace(/’/g, "'");
        
        page.excerpt = post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '');
        page.heading_visible = post.acf.heading_visible;
        page.excerpt_visible = post.acf.excerpt_visible;

        page.getBreadcrumbs(post);

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
    async getBreadcrumbs(post) {
      const component = this;

      await axios
        .get(`${this.interface.endpoint}breadcrumbs/${post.id}`)
        .then((output_b) => {
          component.breadcrumbs = output_b.data;
        });
    }
  }
}
</script>
