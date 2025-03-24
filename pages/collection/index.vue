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

export default {
  setup(props) {
    const route = useRoute();
    const todo = ref({})

    // console.log(route);

    useFetch(() => 
      fetch(`${props.interface.endpoint}pages?slug=collection`)
        .then(res => res.json())
        .then((output) => (todo.value = output[0]))
    )
    
    // console.log(todo.value);

    useSeoMeta({
      ogTitle: () => `${todo.value.title ? todo.value.title?.rendered + ' | ' : ''}Colby College Museum of Art · Colby College`,
      title: () => `${todo.value.title ? todo.value.title?.rendered + ' | ' : ''}Colby College Museum of Art · Colby College`,
      ogDescription: () => todo.value.excerpt?.rendered,
      description: () => todo.value.excerpt?.rendered,
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
      .get(`${this.interface.endpoint}pages?slug=collection`)
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
    
      await axios
        .get(`https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/future/_search`, {
          auth: {
            username: 'Fr2fpegcBZ',
            password: 'Vi7vGnL3h2rtW5SuECoKRwTf'
          },
          params: {
            source_content_type: 'application/json',
            source: JSON.stringify({
              size: 20,
              // from: 0 + ( component.per_page * (page - 1))
            })
          }
        })
        .then((output) => {
          console.log(output);
        });
  }
}
</script>
