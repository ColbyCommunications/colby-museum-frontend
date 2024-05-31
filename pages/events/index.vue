<template>
  <div class="page page--default">
    <IntroContext
      :heading="title"
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

    console.log(route);

    useFetch(() => 
      fetch(`${props.interface.endpoint}pages?slug=events`)
        .then(res => res.json())
        .then((output) => (todo.value = output[0]))
    )
    
    console.log(todo.value);

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
