<template>
  <div
    class="article-grid"
    :class="[`article-grid--${variant} article-grid--${columns}-columns`, items_type == 'posts' ? 'article-grid--posts' : '']"
  >
    <MediaContext
      v-if="items_type == 'posts' && page == 1 && newItems.length > 0"
      :class="[currentPage != 1 ? 'media-context--inactive' : '']"
      :variant="'default'"
      :items="1"
      :blockData="{
        items_0_selection_type: 'posts',
        items_0_entry_type: 'selection',
        items_0_posts_selection: newItems[0].post.id,
      }"
    />

    <div
      v-if="(items_type == 'events' || items_type == 'exhibitions' || items_type == 'objects') && per_page >= 20"
      class="filter"
      ref="filter"
    >
      <!-- <NuxtLink
        v-if="page == undefined && items_type == 'objects'"
        id="browse-no-filter"
        class="btn--light btn--small"
        :to="'/objects/page-1'"
      >
        Browse Without Filter
      </NuxtLink> -->
      <div class="filter__inner grid">
        <div class="filter__input">
          <div class="horizontal-curtain" />
          <SearchInput
            ref="searchInput"
            :placeholder="'Search'"
            @debounced-input="recieveInput"
          />
        </div>
        <div class="filter__button">
          <div class="horizontal-curtain" />
          <button @click="drawerActive = !drawerActive">
            <IconFilter />
            <span>All Filters</span>
          </button>
        </div>
        <div class="filter__sort">
          <div class="horizontal-curtain" />
          <SuperDropdown
            :size="'large'"
            :heading="'Sort'"
            :sort="true"
          >
            <ul v-if="items_type == 'objects'" class="filter__list">
              <li>
                <div
                  class="checkbox checkbox--small"
                  :class="[objectsSort == 'desc' && objectsSortBy == 'accession' ? 'checkbox--active' : '']"
                >
                  <div class="checkbox__main">
                    <input
                      type="radio" :name="`filter_alphabetical`" :value="`Accession Number Descending`"
                      @click="toggleAlphabetical(`Accession Number Descending`)"
                    >
                  </div>
                  <label
                    v-text="`Accession Number Descending`"
                    @click="toggleAlphabetical(`Accession Number Descending`)"
                  />
                </div>
              </li>
              <li>
                <div
                  class="checkbox checkbox--small"
                  :class="[objectsSort == 'asc' && objectsSortBy == 'accession' ? 'checkbox--active' : '']"
                >
                  <div class="checkbox__main">
                    <input
                      type="radio" :name="`filter_alphabetical`" :value="`Accession Number Ascending`"
                      @click="toggleAlphabetical(`Accession Number Ascending`)"
                    >
                  </div>
                  <label
                    v-text="`Accession Number Ascending`"
                    @click="toggleAlphabetical(`Accession Number Ascending`)"
                  />
                </div>
              </li>
              <li>
                <div
                  class="checkbox checkbox--small"
                  :class="[objectsSort == 'asc' && objectsSortBy == 'title' ? 'checkbox--active' : '']"
                >
                  <div class="checkbox__main">
                    <input
                      type="radio" :name="`filter_alphabetical`" :value="`Alphabetical from  'A'`"
                      @click="toggleAlphabetical(`Alphabetical from  'A'`)"
                    >
                  </div>
                  <label
                    v-text="`Alphabetical Title from  'A'`"
                    @click="toggleAlphabetical(`Alphabetical from  'A'`)"
                  />
                </div>
              </li>
              <li>
                <div
                  class="checkbox checkbox--small"
                  :class="[objectsSort == 'desc' && objectsSortBy == 'title' ? 'checkbox--active' : '']"
                >
                  <div class="checkbox__main">
                    <input
                      type="radio" :name="`filter_alphabetical`" :value="`Alphabetical from  'Z'`"
                      @click="toggleAlphabetical(`Alphabetical from  'Z'`)"
                    >
                  </div>
                  <label
                    v-text="`Alphabetical Title from  'Z'`"
                    @click="toggleAlphabetical(`Alphabetical from  'Z'`)"
                  />
                </div>
              </li>
              <li>
                <div
                  class="checkbox checkbox--small"
                  :class="[objectsSort == 'desc' && objectsSortBy == 'name' ? 'checkbox--active' : '']"
                >
                  <div class="checkbox__main">
                    <input
                      type="radio" :name="`filter_alphabetical`" :value="`By Artist Name Descending`"
                      @click="toggleAlphabetical(`By Artist Name Descending`)"
                    >
                  </div>
                  <label
                    v-text="`By Artist Name Descending`"
                    @click="toggleAlphabetical(`By Artist Name Descending`)"
                  />
                </div>
              </li>
              <li>
                <div
                  class="checkbox checkbox--small"
                  :class="[objectsSort == 'asc' && objectsSortBy == 'name' ? 'checkbox--active' : '']"
                >
                  <div class="checkbox__main">
                    <input
                      type="radio" :name="`filter_alphabetical`" :value="`By Artist Name Ascending`"
                      @click="toggleAlphabetical(`By Artist Name Ascending`)"
                    >
                  </div>
                  <label
                    v-text="`By Artist Name Ascending`"
                    @click="toggleAlphabetical(`By Artist Name Ascending`)"
                  />
                </div>
              </li>
              <!-- <li>
                <div
                  class="checkbox checkbox--small"
                  :class="[objectsSort == 'year' ? 'checkbox--active' : '']"
                >
                  <div class="checkbox__main">
                    <input
                      type="radio" :name="`filter_alphabetical`" :value="`By Year`"
                      @click="toggleAlphabetical(`By Year`)"
                    >
                  </div>
                  <label
                    v-text="`By Year`"
                    @click="toggleAlphabetical(`By Year`)"
                  />
                </div>
              </li> -->
            </ul>
            <ul v-else class="filter__list">
              <li>
                <div
                  class="checkbox checkbox--small"
                  :class="[alphabeticalOrder && reverseOrder ? 'checkbox--active' : '']"
                >
                  <div class="checkbox__main">
                    <input
                      type="radio" :name="`filter_alphabetical`" :value="`Alphabetical from  'A'`"
                      @click="toggleAlphabetical(`Alphabetical from  'A'`)"
                    >
                  </div>
                  <label
                    v-text="`Alphabetical from  'A'`"
                    @click="toggleAlphabetical(`Alphabetical from  'A'`)"
                  />
                </div>
              </li>
              <li>
                <div
                  class="checkbox checkbox--small"
                  :class="[alphabeticalOrder && reverseOrder == false ? 'checkbox--active' : '']"
                >
                  <div class="checkbox__main">
                    <input
                      type="radio" :name="`filter_alphabetical`" :value="`Alphabetical from  'Z'`"
                      @click="toggleAlphabetical(`Alphabetical from  'Z'`)"
                    >
                  </div>
                  <label
                    v-text="`Alphabetical from  'Z'`"
                    @click="toggleAlphabetical(`Alphabetical from  'Z'`)"
                  />
                </div>
              </li>
            </ul>
          </SuperDropdown>
        </div>
      </div>
      <div
        v-if="aggregationMakerList.length > 0 || aggregationMediumList.length > 0 || aggregationSupportList.length > 0 || aggregationYearList.length > 0 || aggregationTypeList.length > 0"
        class="filter__inner grid"
      >
        <div class="filter__pill-list">
          <button
            v-for="(item, index) in aggregationMakerList"
            class="filter__pill"
            @click="aggregationChange(item, 'maker')"
          >
            <IconX />
            {{ item }}
          </button>
          <button
            v-for="(item, index) in aggregationYearList"
            class="filter__pill"
            @click="aggregationChange(item, 'year')"
          >
            <IconX />
            {{ item }}
          </button>
          <button
            v-for="(item, index) in aggregationTypeList"
            class="filter__pill"
            @click="aggregationChange(item, 'type')"
          >
            <IconX />
            {{ item }}
          </button>
        </div>
      </div>
      <div ref="drawer">
        <div
          class="filter__drawer"
          :class="{'filter__drawer--active' : drawerActive}"
        >
          <div class="filter__drawer-top">
            <h3 class="filter__heading heading-style-3" v-text="'Filters'" />
            <button
              class="filter__close-btn"
              @click="drawerActive = !drawerActive"
            >
              <IconX />
              <span class="sr-only" v-text="'Close Filter Drawer'" />
            </button>
          </div>
          <div class="filter__drawer-group">
            <button
              class="filter__clear-btn checkbox checkbox--small"
              @click="resetFilter()"
            >
              <IconX />
              <label v-text="'Clear filters'" />
            </button>
          </div>
          <div v-if="aggregations" class="filter__drawer-group">
            <SuperDropdown
              v-for="(aggregation, key, index) in aggregations"
              :size="'large'"
              :heading="key"
              :sort="true"
            >
              <ul class="filter__list">
                <li v-for="(bucket, index) in aggregation.buckets">
                  <div
                    class="checkbox checkbox--small"
                    :class="[aggregationMakerList.includes(bucket.key) || aggregationTypeList.includes(bucket.key) || aggregationYearList.includes(bucket.key)  ? 'checkbox--active' : '']"
                  >
                    <div class="checkbox__main">
                      <input
                        type="radio" :name="`filter_${key}`" :value="bucket.key"
                        @click="aggregationChange($event, key)"
                      >
                    </div>
                    <label
                      v-html="bucket.key"
                      @click="aggregationChange($event, key)"
                    />
                  </div>
                </li>
              </ul>
            </SuperDropdown>
            <!-- <select class="input" ref="aggregationSelectOption" :name="key" @change="aggregationChange($event, key)">
              <option value="" v-text="key" />
              <option
                v-for="(bucket, index) in aggregation.buckets"
                :value="bucket.key"
                v-text="bucket.key"
              />
            </select>
            <IconArrow class="super-dropdown__arrow" /> -->
          </div>
          <div
            v-for="(filter, index) in filters"
            class="filter__drawer-group"
          >
            <h3
              class="heading-style-3"
              v-text="filter.name"
            />
            <ul class="filter__list">
              <li v-for="(item, index) in filter.items">
                <div
                  class="checkbox checkbox--small"
                  :class="[item.active ? 'checkbox--active' : '']"
                >
                  <div class="checkbox__main">
                    <input
                      type="radio" :name="`filter_${filter.name}`" :value="item.name"
                      @click="item.name == 'past' || item.name == 'current' || item.name == 'future' ? toggleChronology(item) : toggleFilter(item, filter.name)"
                    >
                  </div>
                  <label
                    v-text="item.name"
                    @click="item.name == 'past' || item.name == 'current' || item.name == 'future' ? toggleChronology(item) : toggleFilter(item, filter.name)"
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  
    <div class="article-grid__inner grid">
      <div
        v-if="items_type == 'posts' && currentPage == 1"
        v-for="(item, index) in newItems.slice(1)"
        class="article-grid__item"
      >
        <Article
          v-bind="item"
          :hover="hover"
          :bordered="bordered"
          :button_type="button_type"
        />
      </div>
      <div
        v-else-if="items_type == 'posts'"
        v-for="(item, index) in newItems"
        class="article-grid__item"
      >
        <Article
          v-bind="item"
          :hover="hover"
          :bordered="bordered"
          :button_type="button_type"
        />
      </div>
      <div
        v-else-if="items_type == 'events' || items_type == 'exhibitions'"
        v-for="(item, index) in filteredItems"
        class="article-grid__item"
      >
        <Article
          v-bind="item"
          :hover="hover"
          :bordered="bordered"
          :button_type="button_type"
        />
      </div>
      <div
        v-else-if="typeof items === 'number' || items_type != 'manual'"
        v-for="(item, index) in newItems.slice(0, per_page)"
        class="article-grid__item"
      >
        <Article
          :size="variant == 'embark' ? 'embark' : undefined"
          v-bind="item"
          :hover="hover"
          :bordered="bordered"
          :button_type="button_type"
        />
      </div>
      <div
        v-else
        v-for="(item, index) in items"
        class="article-grid__item"
      >
        <Article
          v-bind="item"
          :hover="hover"
          :bordered="bordered"
          :button_type="button_type"
        />
      </div>
    </div>
    <div v-if="Number(totalPages) && per_page >= 20 && items_type != 'collection' && items_type != 'manual'" class="pagination">
      <div class="pagination__inner grid">
        <div class="pagination__main">
          <NuxtLink
            v-if="page"
            class="pagination__btn pagination__btn--prev"
            :class="[currentPage == 1 ? 'pagination__btn--inactive' : '']"
            :to="`/${items_type == 'posts' ? 'news' : items_type}/page-${Number(page) - 1}${this.$route.query.search || this.$route.query.maker || this.$route.query.year || this.$route.query.type || this.$route.query.sort || this.$route.query.sortby || this.$route.query.has_image || this.$route.query.chronology || this.$route.query.location || this.$route.query.variant || this.$route.query.category || this.$route.query.embark_id ? '?' + this.$route.fullPath.split('?').pop() : ''}`"
          ><IconArrow />Previous</NuxtLink>
          <button
            v-else
            aria-label="Previous Page"
            class="pagination__btn pagination__btn--prev"
            :class="[currentPage == 1 ? 'pagination__btn--inactive' : '']"
            @click="items_type == 'objects' ? getObjects(currentPage - 1, input) : getPosts(currentPage - 1, input)"
          ><IconArrow />Previous</button>
          <div
            v-if="items_type == 'objects'"
            class="pagination__label"
            v-text="`Page ${currentPage} | Objects ${(per_page * (currentPage - 1)) + 1} — ${per_page * (currentPage)} | ${totalObjects} Total Objects`"
          />
          <ul v-else>
            <li
              v-for="index in pagination"
              :class="[currentPage == index ? 'active' : '']"
              :key="index"
            >
              <span
                v-if="index == '...'"
              >
                ...
              </span>
              <NuxtLink
                v-else
                :to="`/${items_type == 'posts' ? 'news' : items_type}/page-${index}${this.$route.query.search || this.$route.query.maker || this.$route.query.year || this.$route.query.type || this.$route.query.sort || this.$route.query.sortby || this.$route.query.has_image || this.$route.query.chronology || this.$route.query.location || this.$route.query.variant || this.$route.query.category || this.$route.query.embark_id ? '?' + this.$route.fullPath.split('?').pop() : ''}`"
              >
                <span class="sr-only">Go to Page </span>{{ index }}
                <IconArrow />
              </NuxtLink>
            </li>
          </ul>
          <NuxtLink
            v-if="page"
            class="pagination__btn pagination__btn--next"
            :class="[nextPageAvailable == false ? 'pagination__btn--inactive' : '']"
            :to="`/${items_type == 'posts' ? 'news' : items_type}/page-${Number(page) + 1}${this.$route.query.search || this.$route.query.maker || this.$route.query.year || this.$route.query.type || this.$route.query.sort || this.$route.query.sortby || this.$route.query.has_image || this.$route.query.chronology || this.$route.query.location || this.$route.query.category || this.$route.query.embark_id ? '?' + this.$route.fullPath.split('?').pop() : ''}`"
          >Next<IconArrow /></NuxtLink>
          <button
            v-else
            aria-label="Next Page"
            class="pagination__btn pagination__btn--next"
            :class="[currentPage == Number(totalPages) ? 'pagination__btn--inactive' : '']"
            @click="items_type == 'objects' ? getObjects(currentPage + 1, input) : getPosts(currentPage + 1, input)"
          >Next<IconArrow /></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import gsap from 'gsap';

import { useInterfaceStore } from "~/store/interface";

import filtersEvents from '~/assets/data/filters-events.yml';
import filtersExhibitions from '~/assets/data/filters-exhibitions.yml';
import filtersObjects from '~/assets/data/filters-objects.yml';
import filtersSort from '~/assets/data/filters-sort.yml';

export default {
  data() {
    return {
      interface: undefined,
      newItems: [],
      totalPages: undefined,
      totalObjects: undefined,
      currentPage: undefined,
      pages: undefined,
      nextPageAvailable: undefined,
      pagination: [],
      filters: undefined,
      sorters: undefined,
      activeFilters: [],
      showPast: false,
      showCurrent: false,
      showFuture: false,
      drawerActive: false,
      reverseOrder: false,
      alphabeticalOrder: false,
      location: [],
      input: undefined,
      objectsSort: 'desc',
      objectsSortBy: 'accession',
      aggregations: undefined,
      aggregationMakerList: [],
      aggregationMediumList: [],
      aggregationSupportList: [],
      aggregationYearList: [],
      aggregationTypeList: [],
      aggregationMaker: '',
      aggregationMedium: '',
      aggregationSupport: '',
      aggregationYear: '',
      aggregationType: '',
    };
  },
  computed: {
    filteredItems() {
      const component = this;
      let filteredItems;

      if (this.activeFilters.length > 0) {
          filteredItems = component.newItems.filter(
              item => Object.values(item.post.acf).some(k => component.activeFilters.includes(k)),
          );
      } else {
          filteredItems = component.newItems;
      }

      return filteredItems;

    },
  },
  props: {
    variant: {
      type: String,
      required: false,
      default: 'default',
    },
    bordered: {
      required: false,
      default: false,
    },
    hover: {
      type: String,
      required: false,
      default: 'default',
    },
    columns: {
      type: String,
      required: false,
      default: '4',
    },
    button_type: {
      type: String,
      required: false,
    },
    items_type: {
      required: false,
      default: 'manual',
    },
    items_category: {
      required: false,
      default: 5,
    },
    embark_ID: {
      required: false,
    },
    per_page: {
      required: false,
      default: 20,
    },
    page: {
      required: false,
    },
    showChronology: {
      required: false,
    },
    showVariant: {
      required: false,
    },
    items: {
      required: false,
    },
    blockData: {
      type: Object,
      required: false,
    }
  },
  async created() {
    this.interface = useInterfaceStore();
    const component = this;

    if (component.items_type == 'objects') {
      component.$route.query.has_image != 'false' ? component.activeFilters = ['Has Image'] : component.activeFilters = [];

      this.loadFilters();

      component.$route.query.maker ? component.aggregationMakerList = component.checkQueryArray(component.$route.query.maker) : component.aggregationMakerList = [];
      component.$route.query.year ? component.aggregationYearList = component.checkQueryArray(component.$route.query.year) : component.aggregationYearList = [];
      component.$route.query.type ? component.aggregationTypeList = component.checkQueryArray(component.$route.query.type) : component.aggregationTypeList = [];
      
      if (component.$route.query.sort == 'desc' || component.$route.query.sort == null) {
        component.objectsSort = 'desc';
      } else {
        component.objectsSort = component.$route.query.sort;
      }

      if (component.$route.query.sortby == 'accession' || component.$route.query.sort == null) {
        component.objectsSortBy = 'accession';
      } else {
        component.objectsSortBy = component.$route.query.sortby;
      }

      this.page ? this.getObjects(this.page, this.$route.query.search) : this.getObjects(1);

    } else if (component.items_type == 'collection') {
      this.getObjects(1);
    // Initial setup for events filter. Would like to make this automated based on WP API Schema
    } else if (component.items_type == 'events' || component.items_type == 'exhibitions') {

      // Would consolidate all this to resetFilter function but it breaks due to being in
      // created hook and not mounted and data within sub component not being ready yet.
      // Will consolidate later and export whole filter.
      this.loadFilters();

      if (component.$route.query.chronology) {

        // Deal with chronology flags. Different sorting order based on chronology
        if (component.$route.query.chronology == 'past') {
          component.showPast = true;
        } else if (component.$route.query.chronology == 'current') {
          component.showCurrent = true;
        } else if (component.$route.query.chronology == 'future') {
          component.showFuture = true;
        }

        component.filters[1].items.find(item => item.name == component.$route.query.chronology).active = true;
      } else {
        // component.showPast = true;
      }

      if (component.$route.query.location) {

        component.$route.query.location ? component.location = component.checkQueryArray(component.$route.query.location) : component.location = [];

        component.location.forEach((l) => {
          component.filters[0].items.find(item => item.name == l ).active = true;
        });

        component.activeFilters.push(...component.location);
      }

      this.page ? this.getPosts(this.page, component.$route.query.search) : this.getPosts(1);
    
    // If selecting group of posts
    } else if (this.items_type != 'manual') {

      this.page ? this.getPosts(this.page) : this.getPosts(1);

    // If selecting items individually
    } else if (typeof this.items === 'number') {

      await Promise.all([...Array(this.items)].map(async (el, i) => ({
        post: component.blockData[`items_${i}_entry_type`] == 'selection' ? await component.getPost(component.blockData[`items_${i}_post_selection`]) : undefined,
        heading: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : component.blockData[`items_${i}_heading`],
        subheading: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : component.blockData[`items_${i}_subheading`],
        subheading2: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : component.blockData[`items_${i}_subheading2`],
        paragraph_entry_type: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : component.blockData[`items_${i}_paragraph_entry_type`],
        paragraph: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : component.blockData[`items_${i}_paragraph`],
        button: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : component.blockData[`items_${i}_button`],
        image: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : await component.getImage(component.blockData[`items_${i}_image`]),
      }))).then((output) => {
        component.newItems = output; 
      })
    }
  },
  mounted() {
    if (this.$refs.drawer) {
      document.body.appendChild(this.$refs.drawer);
    }

    this.animate();
  },
  beforeUnmount() {
    if (this.$refs.drawer) {
      const component = this;
      const drawer = component.$refs.drawer;

      gsap.to(drawer.querySelector('.filter__drawer'), {
        x: '100%',
        duration: 0.4,
        onComplete: () => {
          drawer.remove();
        }
      });
    }
  },
  methods: {
    async getObjects(page, searchTerm) {
      const component = this;
      let filterYPosition;
      let filterTerms = [];
      let filterMust = [];
      let filterSort = [];

      component.currentPage = page;

      if (searchTerm) {
        filterMust.push({ "simple_query_string": { "query": searchTerm, "fuzzy_max_expansions": 20, "default_operator": "and" }})
      }

      if (component.activeFilters.includes('Has Image')) {
        filterMust.push({ "exists": { "field" : "Images" } });
      }

      if (component.embark_ID) {
        filterMust.push({ "term": { "Portfolios.Portfolio_ID" : `${component.embark_ID}` } });
      }

      if (this.page == undefined && this.$refs.filter) {
        setTimeout(() => {
          filterYPosition = window.scrollY + component.$refs.filter.getBoundingClientRect().top;
          window.scrollTo({ top: filterYPosition });
        }, 600);
      }

      if (component.aggregationMakerList.length > 0) {
        filterTerms.push({ "terms": { "Artist_Maker.sort_name" : component.aggregationMakerList }})
      }

      if (component.aggregationMediumList.length > 0) {
        filterTerms.push({ "terms": { "Medium" : component.aggregationMediumList }})
      }

      if (component.aggregationSupportList.length > 0) {
        filterTerms.push({ "terms": { "Support" : component.aggregationSupportList }})
      }

      if (component.aggregationYearList.length > 0) {
        filterTerms.push({ "terms": { "dates.era_labels" : component.aggregationYearList }})
      }

      if (component.aggregationTypeList.length > 0) {
        filterTerms.push({ "terms": { "Disp_Obj_Type" : component.aggregationTypeList }})
      }

      if (component.objectsSortBy == 'name') {
        filterSort.push({'Artist_Maker.sort_name' : component.objectsSort});
      } else if (component.objectsSort == 'year') {
        filterSort.push({'dates.start_year' : 'desc'});
      } else if (component.objectsSortBy == 'title') {
        filterSort.push({"Disp_Title": component.objectsSort});
      } else {
        filterSort.push({"accession_num_year": component.objectsSort});
      }

      // filterTerms.push({"accession_num_year": "asc"});
      // filterTerms.push({"Disp_Access_No": "asc"});

      await axios
        .get(`https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage/_search`, {
          auth: {
            username: 'Fr2fpegcBZ',
            password: 'Vi7vGnL3h2rtW5SuECoKRwTf'
          },
          params: {
            source_content_type: 'application/json',
            source: JSON.stringify({
              size: component.per_page + 1,
              from: 0 + ( component.per_page * (page - 1)),
              "sort": filterSort,
              "query" : {
                "bool": {
                  "should": (component.aggregationMakerList.length > 0 || component.aggregationMediumList.length > 0 || component.aggregationSupportList.length > 0 || component.aggregationYearList.length > 0 || component.aggregationTypeList.length > 0) ? filterTerms : undefined,
                  "must": filterMust.length > 0 ? filterMust : undefined,
                  "minimum_should_match" : filterTerms.length,
                },
              },
            })
          }
        })
        .then((output) => {

          component.totalObjects = output.data.hits.total.value;
          component.totalPages = Math.floor(output.headers['content-length'] / component.per_page);

          if (output.data.hits.hits.length < component.per_page + 1) {
            component.nextPageAvailable = false;
          } else {
            component.nextPageAvailable = true;
          }

          // Establishes aggregations. Prevents them from changing everytime we make a
          // request to the endpoint.
          if (component.aggregations == undefined) {
            component.getAggregations();
          }

          component.newItems = output.data.hits.hits.map((i) => {
            const img = i._source.Images.length > 0 ? i._source.Images[0] : undefined;
            const imgUrl = img ? `https://ccma-iiif-cache-service.fly.dev/iiif/2/${img.IIIF_URL.substring(img.IIIF_URL.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "")}/full/${encodeURIComponent('400,')}/0/default.jpg` : '';

            return {
              size: 'embark',
              heading: `${i._source.Disp_Maker_1}`,
              subheading: `<em>${i._source.Disp_Title}</em>`,
              subheading2: `${i._source.Disp_Create_DT}`,
              // subheading: `${i._source.Disp_Maker_1} ${i._source.Disp_Create_DT}`,
              button: {
                srOnly: true,
                title: 'View Object',
                url: `/objects/${i._source.embark_ID}`
              },
              image: img ? {
                caption: {
                  rendered: i._source.Disp_Medium,
                },
                alt_text: i._source.Disp_Medium,
                media_details: {
                  sizes: {
                    full: {
                      source_url: imgUrl,
                    },
                    mobile: {
                      source_url: imgUrl,
                    }
                  }
                }
              } : {
                caption: {
                  rendered: 'No Image Available',
                },
                alt_text: 'No Image Available',
                media_details: {
                  sizes: {
                    full: {
                      source_url: `/blanks/blank_${ Math.floor(Math.random() * (3 - 1 + 1) + 1) }.png`
                    },
                    mobile: {
                      source_url: `/blanks/blank_${ Math.floor(Math.random() * (3 - 1 + 1) + 1) }.png`
                    },
                  }
                }
              },
            }
          })
        });
    },
    async getAggregations() {
      const component = this;

      await axios
        .get(`https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage/_search`, {
          auth: {
            username: 'Fr2fpegcBZ',
            password: 'Vi7vGnL3h2rtW5SuECoKRwTf'
          },
          params: {
            source_content_type: 'application/json',
            source: JSON.stringify({
              "size": 0,
              "query": component.embark_ID ? {
                "bool": {
                  "must": [{
                    "term": {"Portfolios.Portfolio_ID": component.embark_ID}
                  }]
                }
              } : undefined,
              "aggs": { 
                "maker": { 
                  "terms": { 
                    "field": "Artist_Maker.sort_name",
                    "size": 3000,
                    "order": { "_key": "asc" }
                    // TODO: Add filter block here as .filtered, use to populate facets
                  }
                },
                // "medium": { 
                //   "terms": { 
                //     "field": "Medium",
                //     "size": 200
                //   }
                // },
                // "support": { 
                //   "terms": { 
                //     "field": "Support",
                //     "size": 200
                //   }
                // },
                "year": { 
                  "terms": { 
                    "field": "dates.era_labels",
                    "size": 3000,
                    "order": { "_key": "asc" }
                    // TODO: Add filter block here as .filtered, use to populate facets
                  }
                },
                "type": { 
                  "terms": { 
                    "field": "Disp_Obj_Type",
                    "size": 300,
                    "order": { "_key": "asc" }
                    // TODO: Add filter block here as .filtered, use to populate facets
                  }
                },
              }
            })
          }
        })
        .then((output) => {
          if (component.aggregations == undefined) {
            component.aggregations = output.data.aggregations;
          }
        });
    },
    async getPosts(page, searchTerm) {
      const component = this;

      component.currentPage = page;

      console.log(`${component.interface.endpoint}categories?parent=${component.items_category}`);

      await axios
        .get(`${component.interface.endpoint}categories?parent=${component.items_category}`)
        .then(async (output) => {
          let categories;
          let chr;
          let type = '';
          let meta_date = '';

          categories = output.data.map((c) => c.id);

          if ((component.showChronology == 'current' || component.showCurrent) && (component.items_type == 'events' || component.items_type == 'exhibitions')) {
            chr = '&chronologies=9'; // SHOW ONLY CURRENT
          } else if ((component.showChronology == 'past' || component.showPast) && (component.items_type == 'events' || component.items_type == 'exhibitions')) {
            chr = '&chronologies=8'; // SHOW ONLY PAST
          } else if ((component.showChronology == 'future' || component.showFuture) && (component.items_type == 'events' || component.items_type == 'exhibitions')) {
            chr = '&chronologies_exclude=8,9'; // EXCLUDE PAST AND CURRENT
          } else {
            if (component.$route.query.variant != 'traveling') {
              chr = '&chronologies_exclude=8'; // EXCLUDE PAST AS LONG AS WE ARENT IN TRAVELING EXHIBITIONS
            }
          }

          if (component.$route.query.variant == 'traveling') {
            type = '&variant=14';
          }

          if (component.items_type == 'events' || component.items_type == 'exhibitions') {
            if (component.showChronology) {
              meta_date = `&?filter[orderby]=meta_value&?filter[meta_key]=date&filter[order]=DESC`;
            } else {
              meta_date = `&?filter[orderby]=meta_value&?filter[meta_key]=date&filter[order]=ASC`;
            }
          }

          // EXAMPLE OF SORTING BY START DATE
          // console.log(`${component.interface.endpoint}${component.items_type == 'posts' ? 'posts' : component.items_type}?categories_exclude=1${chr}${type}${meta_date}&categories=${component.items_category}${categories.length > 0 ? `,${categories.toString()}` : '' }&per_page=${component.per_page}&page=${page}${searchTerm ? `&search=${searchTerm}` : ''}${component.alphabeticalOrder ? '&orderby=title' : ''}${component.reverseOrder ? '&order=asc' : ''}`);

          console.log(`${component.interface.endpoint}${component.items_type == 'posts' ? 'posts' : component.items_type}?categories_exclude=1${chr}${type}${meta_date}&categories=${component.items_category}${categories.length > 0 ? `,${categories.toString()}` : '' }&per_page=${component.per_page}&page=${page}${searchTerm ? `&search=${searchTerm}` : ''}${component.alphabeticalOrder ? '&orderby=title' : ''}${component.reverseOrder ? '&order=asc' : ''}`);
          await axios
            .get(`${component.interface.endpoint}${component.items_type == 'posts' ? 'posts' : component.items_type}?categories_exclude=1${chr}${type}${meta_date}&categories=${component.items_category}${categories.length > 0 ? `,${categories.toString()}` : '' }&per_page=${component.per_page}&page=${page}${searchTerm ? `&search=${searchTerm}` : ''}${component.alphabeticalOrder ? '&orderby=title' : ''}${component.reverseOrder ? '&order=asc' : ''}`)
            .then((output) => {

              component.totalPages = output.headers['x-wp-totalpages'];

              component.currentPage == component.totalPages ? component.nextPageAvailable = false : component.nextPageAvailable = true;

              component.newItems = output.data.map((i) => {
                if (i.acf.location != 'campus' && i.acf.location != 'downtown' && i.acf.location != 'virtual') {
                  i.acf.location = 'elsewhere';
                }

                return {
                  post: i,
                  event_date: i.acf.date ? component.formatDate(i.acf.date, 'events-raw') : undefined,
                }
              });

              // Temporary solution for ordering by start date
              if (component.items_type == 'events' || component.items_type == 'exhibitions') {
                if (component.alphabeticalOrder == false) {
                  if (component.showChronology == 'past') {
                    component.newItems.sort((a,b) => b.event_date.getTime() - a.event_date.getTime());
                  } else {
                    if (component.$route.query.variant == 'traveling') {
                      component.newItems.sort((a,b) => b.event_date.getTime() - a.event_date.getTime());
                    } else {
                      component.newItems.sort((a,b) => b.event_date.getTime() - a.event_date.getTime());
                    }
                  }
                }
              }

              component.pagination = component.preparedPagination(component.currentPage, component.totalPages, 6);
            });
        });
    },
    async getPost(i) {
      const component = this;
      let postObj;

      await axios
        .get(`${component.interface.endpoint}pages/${i}`)
        .then((output) => {
          postObj = output.data;
        });

      return await postObj;
    },
    async getImage(i) {
      const component = this;
      let imageObj;
      let newImageObj;

      if (i) {
        await axios
          .get(`${component.interface.endpoint}media/${i}`)
          .then((output) => {
            imageObj = output.data;

            // console.log(`${component.interface.endpoint}media/${i}`);
            // console.log(imageObj);

            // Below, the image object is pulling DESCRIPTION field from
            // the Media Library instead of CAPTION for formatting purposes
            newImageObj = {
              artist_name: imageObj.acf.artist_name,
              object_title: imageObj.acf.object_title,
              object_creation_date: imageObj.acf.object_creation_date,
              alt_text: imageObj.alt_text,
              caption: {
                rendered: imageObj.description.rendered.replace(/<img[^>]*>/g,"").replace(/<p[^>]*>|<\/p>/g, '').replace(/\r?\n|\r/g, "").replace(/<a[^>]*>|<\/a>/g, ''),
              },
              media_details: {
                sizes: {
                  desktop: {
                    source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=800,quality=75,format=webp`,
                  },
                  mobile: {
                    source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=400,quality=75,format=webp`,
                  },
                }
              }
            };
          });

        return await newImageObj;
      } else {
        return imageObj;
      }
    },
    formatDate(d, style) {
      let formattedDate;

      if (style == 'numeric') {
        formattedDate = new Date(d).toLocaleDateString('en-US', {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
          hour12: false
        })
        .replaceAll('/', '.');
      } else if (style == 'events') {
        formattedDate = new Date(`${d.substr(0,4)}-${d.substr(4,2)}-${d.substr(6,2)}T00:00:00`).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour12: false
        });
      } else if (style == 'events-raw') {
        formattedDate = new Date(`${d.substr(0,4)}-${d.substr(4,2)}-${d.substr(6,2)}T00:00:00`);
      } else {
        formattedDate = new Date(d).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour12: false
        });
      }
      return formattedDate;
    },
    loadFilters() {
      const component = this;
      let filtersType;

      if (this.items_type == 'events') {
        filtersType = filtersEvents;
      } else if (this.items_type == 'exhibitions') {
        filtersType = filtersExhibitions;
      } else if (this.items_type == 'objects') {
        filtersType = filtersObjects;
      }

      this.filters = filtersType.map((f) => ({
        name: f.name,
        items: f.items.map((i) => ({
          name: i,
          active: i == 'Has Image' && component.activeFilters.includes('Has Image') ? true : false,
        }))
      }));

      // Only applies to WP Rest API items because markup
      // Changes above based on Objects vs Everything else WP
      this.sorters = filtersSort.map((f) => ({
        name: f.name,
        items: f.items.map((i) => ({
          name: i,
          active: false,
        }))
      }));
    },
    resetFilter() {
      if (this.items_type == 'objects') {
        this.aggregationMakerList = [];
        this.aggregationMediumList = [];
        this.aggregationSupportList = [];
        this.aggregationYearList = [];
        this.aggregationTypeList = [];

        // for (const a of this.$refs.aggregationSelectOption) {
        //   a.selectedIndex = 0;
        // }
      }

      if (this.items_type == 'exhibitions' || this.items_type == 'events') {
        this.location = [];
        this.showPast = false;
        this.showCurrent = false;
        this.showFuture = false;
      }

      this.loadFilters();

      this.$refs.searchInput.$data.input = '';
      this.$refs.searchInput.debounceInput();
      this.items_type == 'objects' && this.$route.query.has_image != false ? this.activeFilters = ['Has Image'] : this.activeFilters = [];

      this.triggerNavigateTo();
    },
    toggleFilter(term, filter) {
      term.active = !term.active;

      if (term.active == true) {
        this.activeFilters.push(term.name);

        if (filter == 'location') {
          this.location.push(term.name);
        }
      } else {
        const index = this.activeFilters.indexOf(term.name);
        const location_index = this.location.indexOf(term.name);

        this.activeFilters.splice(index, 1);

        if (filter == 'location') {
          this.location.splice(location_index, 1);
        }
      }

      if (this.items_type == 'objects') {

        this.triggerNavigateTo();
        this.getObjects(1, this.$refs.searchInput.input ? this.$refs.searchInput.input : undefined);
      } else {
        this.triggerNavigateTo();
        this.getPosts(1, this.$refs.searchInput.input ? this.$refs.searchInput.input : undefined);
      }
    },
    toggleChronology(term) {
      term.active = !term.active;

      if (term.name == 'past') {
        this.showPast = !this.showPast;
        this.showCurrent = false;
        this.showFuture = false;
        this.filters[1].items.find(item => item.name == 'current').active = false;
        this.filters[1].items.find(item => item.name == 'future').active = false;
      } else if (term.name == 'current') {
        this.showCurrent = !this.showCurrent;
        this.showPast = false;
        this.showFuture = false;
        this.filters[1].items.find(item => item.name == 'past').active = false;
        this.filters[1].items.find(item => item.name == 'future').active = false;
      } else if (term.name == 'future') {
        this.showFuture = !this.showFuture;
        this.showCurrent = false;
        this.showPast = false;
        this.filters[1].items.find(item => item.name == 'past').active = false;
        this.filters[1].items.find(item => item.name == 'current').active = false;
      }

      this.triggerNavigateTo();
      this.getPosts(1, this.input);
    },
    toggleOrder(term) {
      term.active = !term.active;

      this.reverseOrder = !this.reverseOrder;

      this.getPosts(1);
    },
    toggleAlphabetical(term) {
      

      if (this.items_type == 'objects') {
        if (term == `Accession Number Descending`) {
          this.objectsSortBy = 'accession';
          this.objectsSort = 'desc';
        } else if (term == `Accession Number Ascending`) {
          this.objectsSortBy = 'accession';
          this.objectsSort = 'asc';
        } else if (term == `Alphabetical from  'A'`) {
          this.objectsSortBy = 'title';
          this.objectsSort = 'asc';
        } else if (term == `Alphabetical from  'Z'`) {
          this.objectsSortBy = 'title';
          this.objectsSort = 'desc';
        } else if (term == `By Artist Name Descending`) {
          this.objectsSortBy = 'name';
          this.objectsSort = 'desc';
        } else if (term == `By Artist Name Ascending`) {
          this.objectsSortBy = 'name';
          this.objectsSort = 'asc';
        } else if (term == `By Year`) {
          this.objectsSort = 'year';
        }

        this.triggerNavigateTo();
        this.getObjects(1, this.$refs.searchInput.input ? this.$refs.searchInput.input : undefined);
      } else {
        if (term == `Alphabetical from  'A'`) {
          if (this.reverseOrder == true && this.alphabeticalOrder == true) {
            this.reverseOrder = false;
            this.alphabeticalOrder = false;
          } else {
            this.reverseOrder = true;
            this.alphabeticalOrder = true;
          }
        } else if (term == `Alphabetical from  'Z'`) {
          if (this.reverseOrder == false && this.alphabeticalOrder == true) {
            this.reverseOrder = false;
            this.alphabeticalOrder = false;
          } else {
            this.reverseOrder = false;
            this.alphabeticalOrder = true;
          }
        }

        this.getPosts(1, this.$refs.searchInput.input ? this.$refs.searchInput.input : undefined);
      }
    },
    recieveInput(input) {
      const component = this;
      this.input = input;

      if (this.items_type == 'objects' && this.page) {
        component.triggerNavigateTo();

        this.getObjects(1, input);
      } else if (this.items_type == 'objects') {
        this.getObjects(1, input);
      } else {
        this.triggerNavigateTo();

        this.getPosts(1, input);
      }
    },
    aggregationChange(e, key) {
      const component = this;
      let term;

      if (e.target == undefined) {
        term = e; 
      } else {
        term = e.target.value;
      }

      if (key == 'maker') {
        this.aggregationMakerList.includes(term) ? 
          this.aggregationMakerList.splice(this.aggregationMakerList.indexOf(term), 1) : 
          this.aggregationMakerList.push(term);
      }

      if (key == 'medium') {
        this.aggregationMediumList.includes(term) ? 
          this.aggregationMediumList.splice(this.aggregationMediumList.indexOf(term), 1) : 
          this.aggregationMMediumList.push(term);
      }

      if (key == 'support') {
        this.aggregationSupportList.includes(term) ? 
          this.aggregationSupportList.splice(this.aggregationSupportList.indexOf(term), 1) : 
          this.aggregationSupportList.push(term);
      }

      if (key == 'year') {
        this.aggregationYearList.includes(term) ? 
          this.aggregationYearList.splice(this.aggregationYearList.indexOf(term), 1) : 
          this.aggregationYearList.push(term);
      }

      if (key == 'type') {
        this.aggregationTypeList.includes(term) ? 
          this.aggregationTypeList.splice(this.aggregationTypeList.indexOf(term), 1) : 
          this.aggregationTypeList.push(term);
      }

      component.triggerNavigateTo();

      // console.log(this.$route.fullPath.split('?').pop());

      this.getObjects(1, this.input);
    },
    checkQueryArray(a) {
      let p;
      
      Array.isArray(a) ? p = a : p = [a];
      return p;
    },
    triggerNavigateTo() {
      const component = this;
      let chrono;

      if (this.showPast == true) {
        chrono = 'past';
      } else if (this.showCurrent == true) {
        chrono = 'current';
      } else if (this.showFuture == true) {
        chrono = 'future';
      } else {
        chrono = '';
      }

      // These are seperate due to differences in Elasticsearch REST API and Wordpress REST API options
      if (component.items_type == 'objects') {
        navigateTo({
          path: `/objects/page-1`,
          query: {
            search: component.input,
            maker: component.aggregationMakerList,
            year: component.aggregationYearList,
            type: component.aggregationTypeList,
            sort: component.objectsSort,
            sortby: component.objectsSortBy,
            embark_id: component.$route.query.embark_id,
            has_image: component.activeFilters.includes('Has Image') ? true : false,
          }
        });
      } else {
        navigateTo({
          path: `/${component.items_type}/page-1`,
          query: {
            search: component.input,
            chronology: chrono,
            location: component.location,
            variant: component.$route.query.variant
          }
        });
      }
    },
    preparedPagination(currentPage, totalPages, rangeSize) {
      const range = [];
      const startPage = Math.max(1, currentPage - Math.floor(rangeSize / 2));
      const endPage = Math.min(totalPages, startPage + rangeSize - 1);

      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }

      if (range[0] > 1) {
        range.unshift('...');
      }

      if (range[range.length - 1] < totalPages) {
        range.push('...');
      }

      return range;
    },
    animate() {
      setTimeout(() => {
        if (this.$refs.filter) {

          gsap.to(this.$refs.filter.querySelectorAll('.horizontal-curtain'), {
            width: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "expo.out",
          });
        }
      }, 400);
    }
  }
}
</script>

<style lang="scss">
.article-grid {

  &__item {
    grid-column: span 12 / span 12;
    margin-bottom: 40px;

    .article-grid--curated & {
      grid-column: span 6 / span 6;

      @include breakpoint(large) {
        grid-column: span 3 / span 3;
        margin-bottom: 12vh;

        .article-grid--2-columns & {
          grid-column: span 6 / span 6;
        }

        .article-grid--3-columns & {
          grid-column: span 4 / span 4;
        }
      }
    }

    @include breakpoint(medium) {
      grid-column: span 6 / span 6;
      margin-bottom: 60px;
    }

    @include breakpoint(large) {
      grid-column: span 3 / span 3;
      margin-bottom: 12vh;

      .article-grid--2-columns & {
        grid-column: span 6 / span 6;
      }

      .article-grid--3-columns & {
        grid-column: span 4 / span 4;
      }

      .article-grid--6-columns & {
        grid-column: span 2 / span 2;
      }
    }

    &:nth-child(12n - 7) {  // 12n if neccessary
      .article-grid--curated & {
        @include breakpoint(large) {
          grid-column: span 2 / span 2;
        }
      }
    }

    &:nth-child(12n - 5) {
      .article-grid--curated & {
        @include breakpoint(large) {
          grid-column: span 4 / span 4;
        }
      }
    }

    &:nth-child(12n - 3) {
      .article-grid--curated & {
        @include breakpoint(large) {
          grid-column: span 4 / span 4;
        }
      }
    }

    &:nth-child(12n - 1) {
      .article-grid--curated & {
        @include breakpoint(large) {
          grid-column: span 2 / span 2;
        }
      }
    }
  }

  + .paragraph-style-2 {
    margin-top: 12vh;
  }
}
</style>