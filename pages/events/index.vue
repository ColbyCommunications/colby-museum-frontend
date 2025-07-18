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
import { useInterfaceStore } from '~/store/interface';

export default {
  async setup(props) {
    const nuxtApp = useNuxtApp()
    const route = useRoute();

    const endpointUrl = `${props.interface.endpoint}pages?slug=events`
    const { data, error } = await useFetch(endpointUrl)

    if (error.value) {
      console.error(`Could not fetch metadata from ${endpointUrl}`)
    }

    const pageMeta = data.value.at(0) ?? {}
    nuxtApp.runWithContext(() => {
      useSeoMeta({
        ogTitle: () => `${pageMeta?.title ? pageMeta?.title?.rendered + ' | ' : ''}Colby College Museum of Art`,
        title: () => `${pageMeta?.title ? pageMeta?.title?.rendered + ' | ' : ''}Colby College Museum of Art`,
        ogDescription: () => pageMeta?.excerpt?.rendered,
        description: () => pageMeta?.excerpt?.rendered,
      });
    })

    definePageMeta({
      pageTransition: transitionConfig,
    });

    return {
      interface: useInterfaceStore(),
      title: undefined,
      excerpt: undefined,
      components: undefined,
    };
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
