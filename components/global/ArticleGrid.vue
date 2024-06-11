<template>
  <div
    class="article-grid"
    :class="[`article-grid--${variant} article-grid--${columns}-columns`, items_type == 'posts' ? 'article-grid--posts' : '']"
  >
    <MediaContext
      v-if="items_type == 'posts' && newItems.length > 0"
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
      v-if="(items_type == 'events' || items_type == 'exhibitions' || items_type == 'objects' && page == undefined) && per_page >= 20"
      class="filter"
      ref="filter"
    >
      <NuxtLink
        v-if="page == undefined && items_type == 'objects'"
        id="browse-no-filter"
        class="btn--light btn--small"
        :to="'/objects/page-1'"
      >
        Browse Without Filter
      </NuxtLink>
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
                  :class="[objectsSort == 'asc' ? 'checkbox--active' : '']"
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
                  :class="[objectsSort == 'desc' ? 'checkbox--active' : '']"
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
        v-if="aggregationMaker != '' || aggregationMedium != '' || aggregationSupport != ''"
        class="filter__inner grid"
      >
        <div class="filter__pill-list">
          <button
            v-if="aggregationMaker != ''"
            class="filter__pill"
            @click="aggregationRemove('maker')"
          >
            <IconX />
            {{ aggregationMaker }}
          </button>
          <button
            v-if="aggregationMedium != ''"
            class="filter__pill"
            @click="aggregationRemove('medium')"
          >
            <IconX />
            {{ aggregationMedium }}
          </button>
          <button
            v-if="aggregationSupport != ''"
            class="filter__pill"
            @click="aggregationRemove('support')"
          >
            <IconX />
            {{ aggregationSupport }}
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
          <div class="dropdown" v-for="(aggregation, key, index) in aggregations">
            <select class="input" ref="aggregationSelectOption" :name="key" @change="aggregationChange($event, key)">
              <option value="" v-text="key" />
              <option
                v-for="(bucket, index) in aggregation.buckets"
                :value="bucket.key"
                v-text="bucket.key"
              />
            </select>
            <IconArrow class="super-dropdown__arrow" />
          </div>
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
                    @click="item.name == 'past' || item.name == 'current' ? toggleChronology(item) : toggleFilter(item)"
                  >
                </div>
                <label
                  v-text="item.name"
                  @click="item.name == 'past' || item.name == 'current' ? toggleChronology(item) : toggleFilter(item)"
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
    <div v-if="Number(totalPages) && per_page >= 20" class="pagination">
      <div class="pagination__inner grid">
        <div class="pagination__main">
          <NuxtLink
            v-if="page"
            class="pagination__btn pagination__btn--prev"
            :class="[currentPage == 1 ? 'pagination__btn--inactive' : '']"
            :to="`/objects/page-${Number(page) - 1}`"
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
            v-text="`Page ${currentPage} | Objects ${(per_page * (currentPage - 1)) + 1} — ${per_page * (currentPage)}`"
          />
          <ul v-else>
            <li
              v-for="index in Number(totalPages)"
              :class="[currentPage == index ? 'active' : '']"
              :key="index"
            >
              <button @click="getPosts(index)">
                <span class="sr-only">Go to Page </span>{{ index }}
                <IconArrow />
              </button>
            </li>
          </ul>
          <NuxtLink
            v-if="page"
            class="pagination__btn pagination__btn--next"
            :class="[currentPage == Number(totalPages) ? 'pagination__btn--inactive' : '']"
            :to="`/objects/page-${Number(page) + 1}`"
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
      currentPage: undefined,
      pages: undefined,
      filters: undefined,
      sorters: undefined,
      activeFilters: [],
      showPast: false,
      showCurrent: false,
      drawerActive: false,
      reverseOrder: false,
      alphabeticalOrder: false,
      input: undefined,
      objectsSort: 'asc',
      aggregations: undefined,
      aggregationMaker: '',
      aggregationMedium: '',
      aggregationSupport: '',
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
      this.loadFilters();
      
      this.page ? this.getObjects(this.page) : this.getObjects(1);

      // Sets the Has Image option to true on load.
      // Would like to improve this as it essentially requires
      // A second API call on load
      setTimeout(() => {
        this.toggleFilter(this.filters[0].items[0]);
      }, 1000);
    } else if (component.items_type == 'collection') {
      this.getObjects(1);
    // Initial setup for events filter. Would like to make this automated based on WP API Schema
    } else if (component.items_type == 'events' || component.items_type == 'exhibitions') {

      // Would consolidate all this to resetFilter function but it breaks due to being in
      // created hook and not mounted and data within sub component not being ready yet.
      // Will consolidate later and export whole filter.
      this.loadFilters();
      this.getPosts(1);
    
    // If selecting group of posts
    } else if (this.items_type != 'manual') {

      this.getPosts(1);

    // If selecting items individually
    } else if (typeof this.items === 'number') {

      await Promise.all([...Array(this.items)].map(async (el, i) => ({
        post: component.blockData[`items_${i}_entry_type`] == 'selection' ? await component.getPost(component.blockData[`items_${i}_post_selection`]) : undefined,
        heading: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : component.blockData[`items_${i}_heading`],
        subheading: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : component.blockData[`items_${i}_subheading`],
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

      if (this.page == undefined) {
        setTimeout(() => {
          filterYPosition = window.scrollY + component.$refs.filter.getBoundingClientRect().top;
          window.scrollTo({ top: filterYPosition });
        }, 600);
      }

      if (component.aggregationMaker != '') {
        filterTerms.push({ "term": { "Sort_Artist" : component.aggregationMaker }})
      }

      if (component.aggregationMedium != '') {
        filterTerms.push({ "term": { "Medium" : component.aggregationMedium }})
      }

      if (component.aggregationSupport != '') {
        filterTerms.push({ "term": { "Support" : component.aggregationSupport}})
      }

      console.log(filterTerms.length);

      await axios
        .get(`https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage/_search`, {
          auth: {
            username: 'Fr2fpegcBZ',
            password: 'Vi7vGnL3h2rtW5SuECoKRwTf'
          },
          params: {
            source_content_type: 'application/json',
            source: JSON.stringify({
              size: component.per_page,
              from: 0 + ( component.per_page * (page - 1)),
              "sort": [
                {'Disp_Title' : component.objectsSort}
              ],
              "query" : {
                "bool": {
                  "should": (component.aggregationMaker != '' || component.aggregationMedium != '' || component.aggregationSupport != '') ? filterTerms : undefined,
                  "must": filterMust.length > 0 ? filterMust : undefined,
                  // "must": component.activeFilters.includes('Has Image') ? [
                  //   { "exists": { "field" : "Images" } }
                  // ] : undefined,
                  "minimum_should_match" : filterTerms.length,
                },
              },
              "aggs": { 
                "maker": { 
                  "terms": { 
                    "field": "Sort_Artist",
                    "size": 200
                  }
                },
                "medium": { 
                  "terms": { 
                    "field": "Medium",
                    "size": 200
                  }
                },
                "support": { 
                  "terms": { 
                    "field": "Support",
                    "size": 200
                  }
                },
              }
            })
          }
        })
        .then((output) => {
          console.log(output);

          component.totalPages = Math.floor(output.headers['content-length'] / component.per_page);

          // Establishes aggregations. Prevents them from changing everytime we make a
          // request to the endpoint.
          if (component.aggregations == undefined) {
            component.aggregations = output.data.aggregations;
          }

          component.newItems = output.data.hits.hits.map((i) => {
            const img = i._source.Images.length > 0 ? i._source.Images[0] : undefined;
            const imgUrl = img ? `https://ccma-iiif-cache-service.fly.dev/iiif/2/${img.IIIF_URL.substring(img.IIIF_URL.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "")}/full/${encodeURIComponent('400,')}/0/default.jpg` : '';

            return {
              heading: i._source.Disp_Title && (i._source.Disp_Title.length > 70) ? i._source.Disp_Title.substring(0, 69) + '...' : i._source.Disp_Title,
              subheading: i._source.Disp_Maker_1,
              button: {
                title: 'Learn More',
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
    async getPosts(page, searchTerm) {
      const component = this;

      component.currentPage = page;

      await axios
        .get(`${component.interface.endpoint}categories?parent=${component.items_category}`)
        .then(async (output) => {
          let categories;
          let chr;

          categories = output.data.map((c) => c.id);

          if ((component.showChronology == 'current' || component.showCurrent) && (component.items_type == 'events' || component.items_type == 'exhibitions')) {
            chr = '&chronologies=9';
          } else if ((component.showChronology == 'past' || component.showPast) && (component.items_type == 'events' || component.items_type == 'exhibitions')) {
            chr = '&chronologies=8';
          } else if ((component.showChronology == 'future' || component.showFuture) && (component.items_type == 'events' || component.items_type == 'exhibitions')) {
            chr = '&chronologies_exclude=8,9';
          } else {
            chr = '&chronologies_exclude=8';
          }

          await axios
            .get(`${component.interface.endpoint}${component.items_type}?categories_exclude=1${chr}&categories=${component.items_category}${categories.length > 0 ? `,${categories.toString()}` : '' }&per_page=${component.per_page}&page=${page}${searchTerm ? `&search=${searchTerm}` : ''}${component.alphabeticalOrder ? '&orderby=title' : ''}${component.reverseOrder ? '&order=asc' : ''}`)
            .then((output) => {

              component.totalPages = output.headers['x-wp-totalpages'];

              component.newItems = output.data.map((i) => {
                if (i.acf.location != 'campus' && i.acf.location != 'downtown' && i.acf.location != 'virtual') {
                  i.acf.location = 'elsewhere';
                }

                return {
                  post: i,
                  event_date: i.acf.date ? component.formatDate(i.acf.date, 'events-raw') : undefined,
                }
              });

              if (component.items_type == 'events' || component.items_type == 'exhibitions') {
                if (component.alphabeticalOrder == false) {
                  component.newItems.sort((a,b) => a.event_date.getTime() - b.event_date.getTime());
                }
              }
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

            newImageObj = {
              alt_text: imageObj.alt_text,
              caption: {
                rendered: imageObj.caption.rendered,
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
          active: false,
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
        this.aggregationMaker = '';
        this.aggregationMedium = '';
        this.aggregationSupport = '';

        for (const a of this.$refs.aggregationSelectOption) {
          a.selectedIndex = 0;
        }
      }

      this.loadFilters();

      this.$refs.searchInput.$data.input = '';
      this.$refs.searchInput.debounceInput();
      this.activeFilters = [];
    },
    toggleFilter(term) {
      term.active = !term.active;

      console.log(term.name);

      if (term.active == true) {
        this.activeFilters.push(term.name);
      } else {
        const index = this.activeFilters.indexOf(term.name);

        this.activeFilters.splice(index, 1);
      }

      if (this.items_type == 'objects' && this.page == undefined) {
        this.getObjects(1, this.$refs.searchInput.input ? this.$refs.searchInput.input : undefined);
      }

      console.log(this.activeFilters);
    },
    togglePast(term) {
      term.active = !term.active;
      this.showPast = !this.showPast;

      this.getPosts(1);
    },
    toggleChronology(term) {
      term.active = !term.active;

      if (term.name == 'past') {
        this.showPast = !this.showPast;
      } else if (term.name == 'current') {
        this.showCurrent = !this.showCurrent;
      }

      this.getPosts(1);
    },
    toggleOrder(term) {
      term.active = !term.active;

      this.reverseOrder = !this.reverseOrder;

      this.getPosts(1);
    },
    toggleAlphabetical(term) {
      

      if (this.items_type == 'objects') {
        if (term == `Alphabetical from  'A'`) {
          this.objectsSort = 'asc';
        } else if (term == `Alphabetical from  'Z'`) {
          this.objectsSort = 'desc';
        }

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
      this.input = input;

      if (this.items_type == 'objects') {
        this.getObjects(1, input);
      } else {
        this.getPosts(1, input);
      }
    },
    aggregationChange(e, key) {
      if (key == 'maker') {
        this.aggregationMaker = e.target.value;
      }

      if (key == 'medium') {
        this.aggregationMedium = e.target.value;
      }

      if (key == 'support') {
        this.aggregationSupport = e.target.value;
      }

      this.getObjects(1, this.input);
    },
    aggregationRemove(key) {
      const select = this.$refs.aggregationSelectOption.find(a => {
        return a[0].innerHTML == key;
      });

      select.selectedIndex = 0;

      if (key == 'maker') {
        this.aggregationMaker = '';
      }

      if (key == 'medium') {
        this.aggregationMedium = '';
      }

      if (key == 'support') {
        this.aggregationSupport = '';
      }

      this.getObjects(1, this.input);
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

    @include breakpoint(medium) {
      grid-column: span 6 / span 6;
      margin-bottom: 60px;
    }

    @include breakpoint(large) {
      grid-column: span 3 / span 3;
      margin-bottom: 14.760vh;

      .article-grid--2-columns & {
        grid-column: span 6 / span 6;
      }

      .article-grid--3-columns & {
        grid-column: span 4 / span 4;
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
}
</style>