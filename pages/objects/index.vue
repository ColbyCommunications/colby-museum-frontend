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
      :heading="title"
      :headingElement="'h1'"
      :subheading="excerpt"
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
    const route = useRoute();
    let pageMeta = {}

    const endpointUrl = `${props.interface.endpoint}pages?slug=objects`
    const {data, error, status} = await useFetch(endpointUrl, {})

    if (error.value) {
      console.error(`Could not fetch metadata from ${endpointUrl}`)
    }

    if (data.value?.at(0)) {
      pageMeta = data.value.at(0)
    } else {
      console.warn("Received empty head meta!")
    }

    useSeoMeta({
      ogTitle: () => `${pageMeta.title ? pageMeta.title?.rendered + ' | ' : ''}Colby College Museum of Art`,
      title: () => `${pageMeta.title ? pageMeta.title?.rendered + ' | ' : ''}Colby College Museum of Art`,
      ogDescription: () => pageMeta.excerpt?.rendered,
      description: () => pageMeta.excerpt?.rendered,
    });

    definePageMeta({
      pageTransition: transitionConfig,
    });

    return {
      title: undefined,
      excerpt: undefined,
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

    await axios
      .get(`${this.interface.endpoint}pages?slug=objects`)
      .then((output) => {
        const post = output.data[0];
        // console.log(post);

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
          };
        });
      });
  }
}
</script>
