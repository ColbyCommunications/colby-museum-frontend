
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
    <BaseModule
      v-for="(item, index) in components"
      :moduleData="item"
    />
    <DonateForm />
    <div class="core-paragraph grid paragraph-style-2" type="core-paragraph">
      <p><strong>Contact</strong><br>Christina DeYoung, Associate Director of Museum Development<br>207-509-1630 (mobile)<br><a href="mailto:cdeyoung@colby.edu">cdeyoung@colby.edu</a></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import transitionConfig from '../helpers/transitionConfig';
import seoConfig from '../helpers/seoConfig';

export default {
  setup(props) {
    useSeoMeta({
      ogTitle: () => 'Friends of Art | Colby College Museum of Art · Colby College',
      title: () => 'Friends of Art | Colby College Museum of Art · Colby College',
      ogDescription: () => 'Friends of Art at the Colby College Museum of Art.',
      description: () => 'Friends of Art at the Colby College Museum of Art.',
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
  async created() {
    const page = this;
    const slug = this.$route.params.slug;
    let pageName;

    this.fullPath = this.$route.fullPath;

    console.log(this.$route);
    // console.log(this.$route.params);
    console.log(this.$route.params.slug);
    // console.log(`${this.interface.endpoint}pages?slug=${this.$route.params.slug ? this.$route.params.slug : 'home'}`);
    // console.log(slug[slug.length - 1]);

    if (Array.isArray(slug)) {
      pageName = slug[slug.length - 1];
    } else if (slug) {
      pageName = slug;
    } else {
      pageName = 'Friends of Art';
    }

    await axios
      .get(`${this.interface.endpoint}pages?slug=friends-of-art`)
      .then((output) => {
        const post = output.data[0];
        // console.log(post);

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
