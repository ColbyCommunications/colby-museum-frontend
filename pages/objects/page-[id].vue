<template>
  <div class="page page--default page--objects">
    <IntroContext
      :class="[$route.query.embark_id ? 'sr-only--excerpt' : '']"
      :heading="`Objects`"
      :headingElement="'h1'"
      :subheading="'Explore the more than ten thousand artworks that reside in the collection of the Colby College Museum of Art and shape its teaching mission. The collection represents the breadth and complexity of American art, and also includes works by international artists from antiquity to the present.'"
    />
    <!-- <ArticleGrid
      :variant="'curated'"
      :hover="'text'"
      :items_type="'objects'"
      :per_page="20"
      :page="$route.params.id"
      :button_type="'text'"
      :embark_ID="$route.query.embark_id"
    /> -->
    <ArticleGrid
      :hover="'text'"
      :items_type="'objects'"
      :columns="'6'"
      :per_page="30"
      :page="$route.params.id"
      :button_type="'text'"
      :embark_ID="$route.query.embark_id"
    />
  </div>
</template>

<script>
import axios from 'axios';

import transitionConfig from '../helpers/transitionConfig';
import seoConfig from '../helpers/seoConfig';

export default {
  setup(props) {
    const route = useRoute();
    const todo = ref({})

    // console.log(route);

    // useFetch(() => 
    //   fetch(`${props.interface.endpoint}pages?slug=objects`)
    //     .then(res => res.json())
    //     .then((output) => (todo.value = output[0]))
    // )
    
    // console.log(todo.value);

    useSeoMeta({
      ogTitle: () => `Objects - Page ${route.params.id} | Colby College Museum of Art`,
      title: () => `Objects - Page ${route.params.id} | Colby College Museum of Art`,
      ogDescription: () => 'Explore the more than ten thousand artworks that reside in the collection of the Colby College Museum of Art and shape its teaching mission. The collection represents the breadth and complexity of American art, and also includes works by international artists from antiquity to the present.',
      description: () => 'Explore the more than ten thousand artworks that reside in the collection of the Colby College Museum of Art and shape its teaching mission. The collection represents the breadth and complexity of American art, and also includes works by international artists from antiquity to the present.',
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

    // await axios
    //   .get(`${this.interface.endpoint}pages?slug=objects`)
    //   .then((output) => {
    //     const post = output.data[0];
    //     // console.log(post);

    //     page.title = post.title.rendered
    //       .replace(/–/g, '-')
    //       .replace(/“/g, '"')
    //       .replace(/”/g, '"')
    //       .replace(/’/g, "'");
        
    //     page.excerpt = post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '');

    //     page.components = post.block_data.map((component) => {
          
    //       component.type = component.blockName
    //         .replace('acf/','')
    //         .replace(/\//g,'-');

    //       return {
    //         type: component.type,
    //         ...component.attrs.data,
    //         attrs: component.attrs.data ? undefined : component.attrs,
    //       };
    //     });
    //   });
  }
}
</script>
