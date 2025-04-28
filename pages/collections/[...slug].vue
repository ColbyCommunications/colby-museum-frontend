<template>
  <div class="page page--default">
    <Breadcrumbs
      v-if="$route.params.slug != ''"
      :current="{
        title: title,
        url: fullPath,
      }"
      :manual="{
        title: 'About the Collection',
        url: '/collection/about-the-collection',
      }"
    />
    <IntroContext
      :heading="title"
      :headingElement="'h1'"
      :subheading="excerpt"
    />
    <BaseModule
      v-for="(item, index) in components"
      :moduleData="item"
    />
    <BigArrowBtnSection
      :button="{
        reverse: true,
        title: 'About the Collection',
        url: '/collection/about-the-collection'
      }"
    />
    <BigArrowBtnSection
      v-if="embark_id"
      :align="'right'"
      :button="{
        title: 'View all works in this collection',
        url: `/objects/page-1?embark_id=${embark_id}`
      }"
    />
  </div>
</template>

<script>
import axios from 'axios';

import transitionConfig from '../helpers/transitionConfig';
import seoConfig from '../helpers/seoConfig';

export default {
  setup(props) {
    seoConfig(props, 'collections');

    definePageMeta({
      pageTransition: transitionConfig,
    });
  },
  data() {
    return {
      title: undefined,
      excerpt: undefined,
      embark_id: undefined,
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
      .get(`${this.interface.endpoint}collections?slug=${this.$route.params.slug ? this.$route.params.slug : 'home'}`)
      .then((output) => {
        const post = output.data[0];

        page.embark_id = post.acf.embark_id;

        page.title = post.title.rendered
          .replace(/–/g, '-')
          .replace(/“/g, '"')
          .replace(/”/g, '"')
          .replace(/’/g, "'");
        
        page.excerpt = post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '');

        page.components = post.block_data.map((component) => {
          
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
      });
  }
}
</script>
