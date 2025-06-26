<template>
  <div class="page page--default">
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

export default {
  setup(props) {
    const route = useRoute();
    const pageMeta = ref()

    const endpointUrl = `${props.interface.endpoint}pages?slug=events`
    useFetch(endpointUrl, {})
      .then(({data, error, status}) => {
        if (error.value) {
          console.error(`Could not fetch metadata from ${endpointUrl}`)
          return
        }

        if (!data.value?.at(0)) {
          console.error(`Received empty head meta from the endpoint!`)
          return
        }

        pageMeta.value = data.value.at(0)
      }) 
    
    useSeoMeta({
      ogTitle: () => `${pageMeta.value.title ? pageMeta.value.title?.rendered + ' | ' : ''}Colby College Museum of Art`,
      title: () => `${pageMeta.value.title ? pageMeta.value.title?.rendered + ' | ' : ''}Colby College Museum of Art`,
      ogDescription: () => pageMeta.value.excerpt?.rendered,
      description: () => pageMeta.value.excerpt?.rendered,
    });

    definePageMeta({
      pageTransition: transitionConfig,
    });
  },
  data() {
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

    // console.log(this.$route.params.slug);

    await axios
      .get(`${this.interface.endpoint}pages?slug=events`)
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
