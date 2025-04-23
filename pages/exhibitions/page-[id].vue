<template>
  <div class="page page--default">
    <IntroContext
      :heading="`${$route.query.chronology ? ($route.query.chronology == 'future' ? 'Upcoming' : $route.query.chronology) + ' ' : ''}${$route.query.variant ? $route.query.variant + ' ' : ''}Exhibitions`"
      :headingElement="'h1'"
      :subheading="$route.query.variant == 'traveling' ? 'Explore exhibitions organized by Colby Museum that are currently on the road around the country and the world. ' : `Explore Colby Museum’s ${$route.query.chronology} exhibitions.${$route.query.chronology == 'past' ? ' Note that our exhibition archive is a work in progress.' : '' }`"
      class="sr-only--excerpt"
    />
    <ArticleGrid
      :columns="'4'"
      :hover="'text'"
      :items_type="'exhibitions'"
      :per_page="20"
      :page="$route.params.id"
      :show-chronology="$route.query.chronology"
      :button_type="'pill'"
    />
    <div v-if="$route.query.chronology == 'past'" class="core-paragraph grid full paragraph-style-2" type="core-paragraph" style="margin-top: 5.9vh;">
      <p>Please note that our exhibition archive is a work in progress.</p>
    </div>
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
