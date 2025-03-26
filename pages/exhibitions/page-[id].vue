<template>
  <div class="page page--default">
    <IntroContext
      :heading="`${$route.query.chronology ? $route.query.chronology + ' ' : ''}${$route.query.variant ? $route.query.variant + ' ' : ''}Exhibitions — Page ${$route.params.id }`"
      :headingElement="'h1'"
      :subheading="$route.query.variant == 'traveling' ? 'Explore exhibitions organized by Colby Museum that are currently on the road around the country and the world. ' : `Explore Colby Museum’s ${$route.query.chronology} exhibitions.${$route.query.chronology == 'past' ? ' Note that our exhibition archive is a work in progress.' : '' }`"
    />
    <ArticleGrid
      :columns="'4'"
      :variant="'curated'"
      :hover="'text'"
      :items_type="'exhibitions'"
      :per_page="20"
      :page="$route.params.id"
      :show-chronology="$route.query.chronology"
      :button_type="'pill'"
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
      ogTitle: () => `Exhibitions - Page ${route.params.id} | Colby College Museum of Art · Colby College`,
      title: () => `Exhibitions - Page ${route.params.id} | Colby College Museum of Art · Colby College`,
      ogDescription: () => 'Explore Colby Museum’s current exhibitions.',
      description: () => 'Explore Colby Museum’s current exhibitions.',
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
