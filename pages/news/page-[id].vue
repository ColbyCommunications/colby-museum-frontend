<template>
  <div class="page page--default">
    <IntroContext
      :heading="`${$route.query.category == 6 ? 'Lunder Institute ' : ''}News — Page ${$route.params.id }`"
      :headingElement="'h1'"
      :subheading="'Lorem Ipsum solar set.'"
    />
    <ArticleGrid
      :columns="'4'"
      :variant="'curated'"
      :hover="'text'"
      :items_type="'posts'"
      :per_page="20"
      :page="$route.params.id"
      :button_type="'text'"
      :items_category="$route.query.category"
    />
  </div>
</template>

<script>
import transitionConfig from '../helpers/transitionConfig';

export default {
  setup(props) {
    const route = useRoute();
    const todo = ref({})

    useSeoMeta({
      ogTitle: () => `News - Page ${route.params.id} | Colby College Museum of Art · Colby College`,
      title: () => `News - Page ${route.params.id} | Colby College Museum of Art · Colby College`,
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
