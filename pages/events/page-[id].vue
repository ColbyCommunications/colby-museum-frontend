<template>
  <div class="page page--default">
    <IntroContext
      :heading="`Events — Page ${$route.params.id }`"
      :headingElement="'h1'"
      :subheading="'As part of its mission as a collecting and teaching museum, the Colby College Museum of Art houses a diverse collection with a focus on American and contemporary art.'"
    />
    <ArticleGrid
      :columns="'4'"
      :variant="'curated'"
      :hover="'text'"
      :items_type="'events'"
      :per_page="20"
      :page="$route.params.id"
      :show-chronology="$route.query.chronology"
      :button_type="'text'"
    />
  </div>
</template>

<script>
import transitionConfig from '../helpers/transitionConfig';

export default {
  setup(props) {
    const route = useRoute();
    const todo = ref({})

    console.log(route);

    useSeoMeta({
      ogTitle: () => `Events - Page ${route.params.id} | Colby College Museum of Art · Colby College`,
      title: () => `Events - Page ${route.params.id} | Colby College Museum of Art · Colby College`,
      // ogDescription: () => todo.value.excerpt?.rendered,
      // description: () => todo.value.excerpt?.rendered,
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
  }
}
</script>
