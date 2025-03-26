<template>
  <div class="page page--default">
    <IntroContext
      class="sr-only--excerpt"
      :heading="`Events — Page ${$route.params.id }`"
      :headingElement="'h1'"
      :subheading="'Find out what’s happening at all of Colby Museum’s locations'"
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
      ogDescription: () => 'Find out what’s happening at all of Colby Museum’s locations.',
      description: () => 'Find out what’s happening at all of Colby Museum’s locations.',
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
