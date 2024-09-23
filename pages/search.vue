<template>
  <div class="page page--default">
    <div class="search-results__inner grid">
      <div class="search-results__secondary">
        <Context :size="'large'" :paragraph="'Looking for a specific artwork?'" />
        <Btn
          :title="'Search the Collection'"
          :url="'/objects'"
        />
      </div>
    </div>
    <IntroContext
      :heading="title"
      :headingElement="'h1'"
      :subheading="excerpt"
    />
    <div class="search-results">
      <div class="search-results__inner grid">
        <div class="search-results__main">
          <!-- <h2 class="heading-style-3"><NuxtLink :to="item.url">{{ item.title }}</NuxtLink></h2> -->
          <Article
            v-for="(item, index) in items"
            :size="'medium'"
            :heading="item.title"
            :subheading="item.url.replace(/^.*\/\/[^\/]+/, 'museum.colby.edu').replace(/\/$/, '')"
            :paragraph="item.excerpt.replace('\n', '')"
            :button="{
              type: 'text',
              title: 'Explore',
              url: item.url,
            }"
          />
        </div>
      </div>
    </div>
    <div v-if="Number(totalPages) >= 40" class="pagination">
      <div class="pagination__inner grid">
        <div class="pagination__main">
          <NuxtLink
            class="pagination__btn pagination__btn--prev"
            :class="[$route.query.page == 1 ? 'pagination__btn--inactive' : '']"
            :to="`/search?page=${Number($route.query.page) - 1}&search=${$route.query.search}`"
          ><IconArrow />Previous</NuxtLink>
          <ul>
            <li
              v-for="index in Number(totalPages)"
              :class="[$route.query.page == index ? 'active' : '']"
              :key="index"
            >
              <NuxtLink :to="`/search?page=${index}&search=${$route.query.search}`">
                <span class="sr-only">Go to Page </span>{{ index }}
                <IconArrow />
              </NuxtLink>
            </li>
          </ul>
          <NuxtLink
            class="pagination__btn pagination__btn--next"
            :class="[$route.query.page == Number(totalPages) ? 'pagination__btn--inactive' : '']"
            :to="`/search?page=${Number($route.query.page) + 1}&search=${$route.query.search}`"
          >Next<IconArrow /></NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import algoliasearch from "algoliasearch/lite";

import transitionConfig from '../helpers/transitionConfig';

export default {
  setup() {
    useSeoMeta({
      ogTitle: () => 'Search | Colby College Museum of Art · Colby College',
      title: () => 'Search | Colby College Museum of Art · Colby College',
    });

    definePageMeta({
      pageTransition: transitionConfig,
    });
  },
  data() {
    return {
      algoliaClient: algoliasearch(
        "2XJQHYFX2S",
        "63c304c04c478fd0c4cb1fb36cd666cb"
      ),
      algoliaIndex: undefined,
      excerpt: undefined,
      items: undefined,
      totalPages: undefined,
    };
  },
  computed: {
    title() {
      return `Showing results for "${this.$route.query.search}"`
    },
    currentPage() {
      return this.$route.query.page;
    }
  },
  props: {
    interface: {
      required: false,
    },
  },
  watch: {
    title: {
      deep: true,
      handler() {
        this.getPosts();
      }
    },
    currentPage: {
      deep: true,
      handler() {
        this.getPosts();
      }
    }
  },
  created() {
    this.algoliaIndex = this.algoliaClient.initIndex('wp_museum_redesign_searchable_posts');
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    async getPosts() {
      const component = this;

      // This is the old ping to the original Wordpress REST API for search SANS Algolia. Keeping it here for posterity 
      // await axios
      //   .get(`${this.interface.endpoint}search?search=${this.$route.query.search}&per_page=40&page=${this.$route.query.page}&exclude=128`)
      //   .then((output) => {
      //     component.totalPages = output.headers['x-wp-totalpages'];
      //     component.items = output.data;

      //     // console.log(output);
      //   });


      
      this.algoliaIndex
        .search(component.$route.query.search, {
          hitsPerPage: 40
        })
        .then((output) => {
          console.log(output);

          component.totalPages = output.nbPages;
          component.items = output.hits.map((i) => ({
            title: i.post_title,
            excerpt: i.post_excerpt,
            url: i.permalink,
          }));
        })
        .catch(err => {
          console.log(err);
        });
      
    }
  }
}
</script>

<style lang="scss">
.search-results {

  &__main {
    grid-column: span 12 / span 12;

    @include breakpoint(large) {
      grid-column: span 8 / span 8;
      grid-column-start: 3;
    }
  }

  &__secondary {
    grid-column: span 12 / span 12;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @include breakpoint(medium) {
      flex-direction: row;
    }

    .btn {
      margin-top: 24px;

      @include breakpoint(medium) {
        margin-top: 0;
        margin-left: 24px;
      }

      @include breakpoint(large) {
        margin-left: 1.667vw;
      }
    }
  }

  .article + .article {
    margin-top: 64px;

    @include breakpoint(large) {
      margin-top: 7.872vh;
    }
  }

  .context__subheading {
    font-weight: 700;
    text-transform: uppercase;
  }

  .context__p {
    margin-top: 0 !important;
  }

  .btn {
    display: none;
  }

  + .pagination {
    margin-top: 100px;

    @include breakpoint(large) {
      margin-top: 12.3vh;
    }
  }
}
</style>