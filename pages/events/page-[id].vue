<template>
  <div class="page page--default">
    <IntroContext
      :heading="`${$route.query.chronology ? ($route.query.chronology == 'future' ? 'Upcoming' : $route.query.chronology) + ' ' : 'Current and Upcoming '}Events`"
      :headingElement="'h1'"
      :subheading="'Find out what’s happening at all of Colby Museum’s locations.'"
      class="sr-only--excerpt"
    />
    <ArticleGrid
      :columns="'4'"
      :hover="'text'"
      :items_type="'events'"
      :per_page="20"
      :page="$route.params.id"
      :show-chronology="$route.query.chronology"
      :button_type="'pill'"
    />
    <div class="core-paragraph grid full paragraph-style-2" type="core-paragraph" style="margin-top: 5.9vh;">
      <p>For a full list of Colby Arts events, visit <a href="https://arts.colby.edu/" target="_blank">arts.colby.edu</a></p>
    </div>
  </div>
</template>

<script>
import transitionConfig from '../helpers/transitionConfig';

export default {
  setup(props) {
    const route = useRoute();
    const pageMeta = ref()

    useSeoMeta({
      ogTitle: () => `Events - Page ${route.params.id} | Colby College Museum of Art`,
      title: () => `Events - Page ${route.params.id} | Colby College Museum of Art`,
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
