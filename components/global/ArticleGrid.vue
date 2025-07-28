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
      v-if="((items_type == 'events' || items_type == 'exhibitions' || items_type == 'objects') && $route.query.variant != 'traveling' ) && per_page >= 20"
      class="filter"
      ref="filter"
    >
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
              @mouseleave="drawerScrollTop()"
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
                    v-text="item.name == 'future' ? 'upcoming' : item.name"
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
        v-if="items_type == 'objects' && newItems.length == 0 && !isLoading"
        class="article-grid__no-results heading-style-1"
        v-text="`No results for ${input ? input : $route.query.search} found...`"
      />
      <div
        v-if="(items_type == 'exhibitions' || items_type == 'events') && filteredItems.length == 0 && !isLoading"
        class="article-grid__no-results heading-style-1"
        v-text="`No results found...`"
      />
      <div
        v-if="items_type == 'posts' && currentPage == 1 && per_page >= 20"
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
          :openNewTab="item.openNewTab"
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
    <div v-if="Number(totalPages) && per_page >= 20 && items_type != 'collection' && items_type != 'manual' && (filteredItems.length > 0 || newItems.length > 0)" class="pagination">
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
import gsap from 'gsap';

import { useInterfaceStore } from "~/store/interface";
import fetchWith from '~/helpers/fetchWith'
import filtersEvents from '~/assets/data/filters-events.yml';
import filtersExhibitions from '~/assets/data/filters-exhibitions.yml';
import filtersObjects from '~/assets/data/filters-objects.yml';
import filtersSort from '~/assets/data/filters-sort.yml';

const sorters = []
// TODO:
// const sorters = filtersSort.map((f) => ({
//   name: f.name,
//   items: f.items.map((i) => ({
//     name: i,
//     active: false,
//   }))
// }));

// TODO: Load from iface  
const endpoint = 'https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage'
const username = 'Fr2fpegcBZ'
const password = 'Vi7vGnL3h2rtW5SuECoKRwTf'

/**
 * @function makeElasticQuery
 * 
 * 
 * 
 **/ 
const makeElasticQuery = ({ searchTerm, 
                            activeFilters, 
                            page, 
                            per_page, 
                            embark_ID, 
                            aggregationMakerList,
                            aggregationMediumList,
                            aggregationSupportList,
                            aggregationYearList,
                            aggregationTypeList,
                            objectsSortBy,
                            objectsSort,
                            variant }) => {
  let filterTerms = [];
  let filterMust = [];
  let filterSort = [];

  if (searchTerm) {
    filterMust.push({ "simple_query_string": { "query": searchTerm, "fuzzy_max_expansions": 20, "default_operator": "and" }})
  }

  if (activeFilters.includes('Has Image')) {
    filterMust.push({ "exists": { "field" : "Images" } });
  }

  // Set the collection filter but show only objects with images if it's a curated peek 
  if (embark_ID) {
    filterMust.push({ "term": { "Portfolios.Portfolio_ID" : `${embark_ID}` }});

    if (variant === 'curated') {
      filterMust.push({ "exists": {"field": "Images" }});
    }
  }

  if (aggregationMakerList.length > 0) {
    filterTerms.push({ "terms": { "Artist_Maker.sort_name" : aggregationMakerList }})
  }

  if (aggregationMediumList.length > 0) {
    filterTerms.push({ "terms": { "Medium" : aggregationMediumList }})
  }

  if (aggregationSupportList.length > 0) {
    filterTerms.push({ "terms": { "Support" : aggregationSupportList }})
  }

  if (aggregationYearList.length > 0) {
    filterTerms.push({ "terms": { "dates.era_labels" : aggregationYearList }})
  }

  if (aggregationTypeList.length > 0) {
    filterTerms.push({ "terms": { "Disp_Obj_Type" : aggregationTypeList }})
  }

  if (objectsSortBy == 'name') {
    filterSort.push({'Artist_Maker.sort_name' : objectsSort});
  } else if (objectsSort == 'year') {
    filterSort.push({'dates.start_year' : 'desc'});
  } else if (objectsSortBy == 'title') {
    filterSort.push({"Disp_Title": objectsSort});
  } else {
    filterSort.push({"accession_num_year": objectsSort});
  }

  const should = (aggregationMakerList.length > 0 || aggregationMediumList.length > 0 || aggregationSupportList.length > 0 || aggregationYearList.length > 0 || aggregationTypeList.length > 0) ? filterTerms : undefined
  const must = filterMust.length > 0 ? filterMust : undefined

  const searchQuery = { size: per_page + 1,
                        from: 0 + ( per_page * (page - 1)),
                        sort: filterSort,
                        query: {
                          bool: {
                            should,
                            must,
                            minimum_should_match: filterTerms.length,
                          }
                        }
                      }

  return searchQuery
}

const getAggregations = async ({embark_ID, username, password}) => {
  const query = embark_ID ? {
            "bool": {
              "must": [{
                "term": {"Portfolios.Portfolio_ID": embark_ID}
              }]
            }
          } : undefined

  const aggsQuery = {
          size: 0,
          query,
          aggs: { 
            "maker": { 
              "terms": { 
                "field": "Artist_Maker.sort_name",
                "exclude": [""],
                "size": 3000,
                "order": { "_key": "asc" }
              }
              // TODO: Add 'missing' handling with code path in filter assignments to check for 'No Maker' and use a not exists query
              // TODO: Add filter block here as .filtered, use to populate facets
              // "aggs": {
              //  "filtered": {} 
              // }
            },
            "year": { 
              "terms": { 
                "field": "dates.era_labels",
                "order": { "start": "desc" },
                "size": 3000
              },
              "aggs": {
                "start": { "max": { "field": "dates.start_year" } }
                // TODO: Add filter block here as .filtered, use to populate facets
                // "filtered": {} 
              }
            },
            "type": { 
              "terms": { 
                "field": "Disp_Obj_Type",
                "exclude": [""],
                "size": 300,
                "order": { "_key": "asc" }
                // TODO: Add filter block here as .filtered, use to populate facets
              }
            },
          }
        }

  const output = await fetchWith(`https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage/_search`, aggsQuery, username, password)

  return output.aggregations
}

/**
 * @function getPost
 * 
 * @param {Number} i Post number to get
 * @param {String} endpoint WP Rest endpoint to use 
 **/ 
const getPost = async (i, endpoint) => {
  const pagesUrl = new URL(`pages/${i}`, endpoint)
  const postsUrl = new URL(`posts/${i}`, endpoint)

  // TODO: WTF!! Either check for empty return or sense post vs page another way.
  // Remove this soon!
  let page, post
  try {
    const page = await $fetch(pagesUrl.href) 
    return page 
  } catch {
    const post = await $fetch(postsUrl.href)
    return post
  }

  return
}

/**
 * @function getPostItems
 * 
 * @param {String} page The page to request
 * @param {String} itemsCategory The category item type
 * @param {String} searchTerm The term to search for, if any
 * @param {String} endpoint The WP endpoint to request from
 * 
 * @returns {Array} Sorted array of post items
 **/ 
const getPostItems = async ({page, 
                            itemsCategory,  
                            itemsType, 
                            searchTerm, 
                            showChronology, 
                            showCurrent, 
                            showPast,
                            showFuture,
                            perPage,
                            endpoint,
                            alphabeticalOrder,
                            reverseOrder, 
                            route}) => {

  // Construct the URL, validate it, and request
  const terminated = endpoint.endsWith('/') ? endpoint : endpoint + '/'
  const catsParams = { parent: itemsCategory }
  const catsUrl = new URL('categories', endpoint)
  // console.log('setting up to boop')
  const catsResp = await $fetch(catsUrl.href, { params: catsParams }) 
  const categories = (catsResp ?? []).map((c) => c.id)

  let pageParams = { _embed: 'wp:featuredmedia',
                     page: page,
                     per_page: perPage,
                     categories_exclude: '1',
                     categories: categories + [ itemsCategory ] }

  if (searchTerm) {
    pageParams.search = searchTerm
  }

  if (alphabeticalOrder) {
    pageParams.orderby = 'title'
  }

  if (reverseOrder) {
    pageParams.order = 'asc'
  }

  if ((showChronology == 'current' || showCurrent) 
      && (itemsType === 'events' || itemsType === 'exhibitions')) {
    // SHOW ONLY CURRENT

    pageParams.chronologies = '9'
  } else if ((showChronology === 'past' || showPast) 
    && (itemsType === 'events' || itemsType === 'exhibitions')) {
    // SHOW ONLY PAST

    pageParams.chronologies = '8'
  } else if ((showChronology === 'future' || showFuture) && (itemsType === 'events' || itemsType === 'exhibitions')) {
    // EXCLUDE PAST AND CURRENT

    pageParams.chronologies_exclude = '8,9'
  } else if (itemsType === 'events') {
    // EXCLUDE PAST AS LONG AS WE ARENT IN EXHIBITIONS

    pageParams.chronologies_exclude = '8'
  }
  

  if (route.query.variant === 'traveling') {
    pageParams.variant = '14'
  }

  if (itemsType === 'events' || itemsType === 'exhibitions') {
    if (showChronology) {
      pageParams['filter[orderby]'] = 'meta_value'
      pageParams['filter[order]'] = 'DESC'
      pageParams['filter[meta_key]'] = 'date'
    } else {
      pageParams['filter[orderby]'] = 'meta_value'
      pageParams['filter[order]'] = 'ASC'
      pageParams['filter[meta_key]'] = 'date'
    }
  }

  // NB: Requesting raw() to use headers
  const pageReqUrl = new URL(itemsType, endpoint)

  const pageResp = await $fetch.raw(pageReqUrl.href, { params: pageParams })

  const totalPages = pageResp.headers.get('x-wp-totalpages');

  let postItems = pageResp._data.map((i) => {
    if (i.acf.location != 'campus' && i.acf.location != 'downtown' && i.acf.location != 'virtual') {
      i.acf.location = 'elsewhere';
    }

    return {
      post: i,
      event_date: i.acf.date ? formatDate(i.acf.date, 'events-raw') : undefined,
      end_date: i.acf.end_date ? formatDate(i.acf.end_date, 'events-raw') : undefined,
    }
  });

  // Temporary solution for ordering by start date
  // NB: Sort _this_ result page -- p. useless if totalPages > 1 🙃!
  if (alphabeticalOrder === false) {
    if (itemsType === 'events' || itemsType === 'exhibitions') {
      if (showChronology === 'future') {
        postItems.sort((a,b) => a.event_date.getTime() - b.event_date.getTime());
      } else if (showChronology === 'past') {
        postItems.sort((a,b) => itemsType === 'events' ? b.event_date.getTime() - a.event_date.getTime() : b.end_date.getTime() - a.end_date.getTime());
      } else {
        if (route.query.variant === 'traveling') {
          postItems.sort((a,b) => b.event_date.getTime() - a.event_date.getTime());
        } else {
          postItems.sort((a,b) => itemsType === 'events' ? a.event_date.getTime() - b.event_date.getTime() : b.event_date.getTime() - a.event_date.getTime());
        }
      }
    }
  }
  // console.log('done boopping')
  // console.log(postItems)
  return { items: postItems, totalPages }
}

// Loads from _count API
const getObjectCount = async (query, endpoint, username, password, perPage) => {
  // Create a mutable clone and remove keys not legal in count requests
  let q = {...query}
  delete q.size
  delete q.from
  delete q.sort

  const response = await fetchWith(`${endpoint}/_count`, q, username, password)

  return { totalObjects: response.count, totalPages: response.count / perPage }
}

/**
 * @function getImage
 * 
 * @param {Number} i Image number to fetch
 * @param {String} endpoint WP REST Endpoint to use
 **/ 
const getImage = async (i, endpoint) => {
  if (!i) return
  // console.log(i,endpoint)
  const url = new URL(`media/${i}`, endpoint)
  const imageObj = await $fetch(url.href)

  const mediaDetails = imageObj.media_details

  let imageAspect
  if (mediaDetails.height > 0 && mediaDetails.width > 0) {
    imageAspect = mediaDetails.height / mediaDetails.width
  }

  // Below, the image object is pulling DESCRIPTION field from
  // the Media Library instead of CAPTION for formatting purposes
  const mappedData = {
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
          aspect_ratio: imageAspect,
          source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=800,quality=75,format=webp`,
        },
        mobile: {
          aspect_ratio: imageAspect,
          source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=400,quality=75,format=webp`,
        },
      }
    }
  };

  return mappedData
}

// Loads from _search API
const getObjectItems = async (page, searchTerm, component) => {  
  const searchQuery = makeElasticQuery({searchTerm, page, ...component})

  const { totalObjects, totalPages } = await getObjectCount(searchQuery, endpoint, username, password, component.per_page)

  const response = await fetchWith(`${endpoint}/_search`, searchQuery, username, password)

  const items = response.hits.hits.map((i) => {
    const img = i._source.Images.length > 0 ? i._source.Images[0] : undefined;
    const imgUrl = img ? `https://ccma-iiif-cache-service.fly.dev/iiif/2/${img.IIIF_URL.substring(img.IIIF_URL.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "")}/full/${encodeURIComponent(`${component.columns === '6' ? '300,' : '400,'}`)}/0/default.jpg` : '';

    return {
      size: 'embark',
      heading: `${i._source.Disp_Maker_1}`,
      subheading: `<em>${i._source.Disp_Title}</em>`,
      subheading2: `${i._source.Disp_Create_DT}`,
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

  return { items, totalObjects, totalPages, query: searchQuery }
}

/**
 * @function loadFilters
 * 
 * @param {String} items_type Filter type to load
 * @param {Array} activeFilters Currently loaded filters
 * 
 **/ 
const loadFilters = (items_type, activeFilters) => {
  let filtersConfig;
  switch (items_type) {
    case 'events':
      filtersConfig = filtersEvents;
      break
    case 'exhibitions':
      filtersConfig = filtersExhibitions;
      break
    case 'objects':
      filtersConfig = filtersObjects;
      break
    default:
      return []
  }
  const filters = []

  // TODO:
  // const filters = filtersConfig.map((f) => ({
  //   name: f.name,
  //   items: f.items.map((i) => ({
  //     name: i,
  //     active: i === 'Has Image' && activeFilters.includes('Has Image') ? true : false,
  //   }))
  // }));

  return filters
}

/**
 * @function wrapArray
 * 
 * @param {Any|Array} item - the item to wrap
 * 
 * @returns `item` if it's an array or Array(item)
 * 
 **/ 
const wrapArray = (item) => {
  return Array.isArray(item) ? item : [ item ] ;
}

/**
 * @function formatDate
 * 
 **/
const formatDate = (d, style) => {
  switch (style) {
    case 'numeric':
      return new Date(d).toLocaleDateString('en-US', {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour12: false
      })
      .replaceAll('/', '.');

    case 'events':
      return new Date(`${d.substr(0,4)}-${d.substr(4,2)}-${d.substr(6,2)}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour12: false
      });

    case 'events-raw':
      return new Date(`${d.substr(0,4)}-${d.substr(4,2)}-${d.substr(6,2)}T00:00:00`);

    default:
      return new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour12: false
      });
  }
}

/**
 * @function pageRange
 * 
 * @returns {Array} Range of page numbers to render in the pagination control
 * 
 **/ 
const pageRange = (currentPage, totalPages, rangeSize) => {
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
}

const openNewTab = (blockData, i) => {
  if (
      blockData[`items_${i}_entry_type`] == 'selection' &&
      blockData[`items_${i}_open_new_tab`]
  ) {
      return blockData[`items_${i}_open_new_tab`] == 1;
  }

  return false;
}

export default {
  async setup(props) {
    const route = useRoute()
    const iface = useInterfaceStore();

    let activeFilters = []
    let aggregationMakerList = []
    let aggregationTypeList = []
    let aggregationYearList = []
    let aggregationMediumList = []
    let aggregationSupportList = []
    let currentPage = props.page ?? 1
    let objectsSort = ''
    let objectsSortBy = ''
    let showPast = false
    let showCurrent = false
    let showFuture = false
    let filters = loadFilters(props.items_type, props.activeFilters ?? [])
    let newItems = []
    let totalObjects = undefined
    let isLoading = true
    let nextPageAvailable = false
    let aggregations = []
    let pagination = []

    let items, totalPages

    // Set up the grid's various forms based on componen input params
    switch (true) {
      case (props.items_type === 'objects'):
        activeFilters = route.query.has_image !== 'false' ? ['Has Image'] : [];
        aggregationMakerList = route.query.maker ? wrapArray(route.query.maker) : [];
        aggregationYearList = route.query.year ? wrapArray(route.query.year) : [];
        aggregationTypeList = route.query.type ? wrapArray(route.query.type) : [];
        
        if (route.query.sort === 'desc' || route.query.sort === null) {
          objectsSort = 'desc';
        } else {
          objectsSort = route.query.sort;
        }

        if (route.query.sortby === 'accession' || route.query.sort === null) {
          objectsSortBy = 'accession';
        } else {
          objectsSortBy = route.query.sortby;
        }

        const queryArgs = { ...props,
                            activeFilters,  
                            aggregationMakerList,
                            aggregationMediumList,
                            aggregationSupportList,
                            aggregationYearList,
                            aggregationTypeList,
                            objectsSortBy,
                            objectsSort
                          }
        let response

        // TODO: All these useAsyncData calls need keys to disambiguate their cache entries
        const { data } = await useAsyncData(`articlegrid-${props.page}-${route.query.search}`, async () => {
          if (props.page) {
            response = await getObjectItems(props.page, route.query.search, queryArgs)
          } else {
            response = await getObjectItems(1, route.query.search, queryArgs)
          }

          aggregations = await getAggregations({query: response.query, username, password});

          return { items: response.items, totalObjects: response.totalObjects, totalPages: response.totalPages }
        }) 

        newItems = data.value.items
        totalObjects = data.value.totalObjects
        totalPages = data.value.totalPages

        // Check paged hit lengths and disable buttons
        if (newItems.length < props.per_page + 1) {
          nextPageAvailable = false;
        } else {
          nextPageAvailable = true;
        }

        // Establishes aggregations. Prevents them from changing everytime we make a
        // request to the endpoint.

        isLoading = false
        break
      case (props.items_type == 'collection'):
        // TODO:
        // this.getObjects(1);
        break

      case (props.items_type == 'events' || props.items_type == 'exhibitions'): {  
        if (route.query.chronology) {
          // Deal with chronology flags. Different sorting order based on chronology
          if (route.query.chronology == 'past') {
            showPast = true;
          } else if (route.query.chronology == 'current') {
            showCurrent = true;
          } else if (route.query.chronology == 'future') {
            showFuture = true;
          }

          // filters[1].items.find(item => item.name === route.query.chronology).active = true;
        } else {
          // component.showPast = true;
        }

        if (route.query.location) {

          location = route.query.location ? wrapArray(route.query.location) : [];
          location.forEach((l) => {
            // filters[0].items.find(item => item.name == l ).active = true;
          });

          activeFilters.push(...location);
        }

        const postItemsParams = {
          page: currentPage, 
          itemsCategory: props.items_category,  
          itemsType: props.items_type, 
          searchTerm: route.query.search, 
          showChronology: props.showChronology, 
          perPage: props.per_page,
          endpoint: iface.endpoint,
          route: route
        }
        const { data: response } = await useAsyncData(`postItems-${ Object.values(postItemsParams ).join('') }`, async () => {
          const posts = await getPostItems(postItemsParams) 

          return posts 
        })
        // console.log('got events')
        totalPages = response.value.totalPages;
        newItems = response.value.items
        nextPageAvailable = response.value.totalPages === currentPage

        pagination = pageRange(currentPage, response.value.totalPages, 6);
        isLoading = false;
        // console.log(newItems, totalPages)
        // console.log('finished events', newItems)
        break
      }

      // If selecting group of posts
      case (props.items_type != 'manual'): {
              const postItemsParams = {
                page: currentPage, 
                itemsCategory: props.items_category,  
                itemsType: props.items_type, 
                searchTerm: route.query.search, 
                showChronology: props.showChronology, 
                perPage: props.per_page,
                endpoint: iface.endpoint,
                route: route
              }
      
              const { data: posts } = await useAsyncData( `ag-manual-${ Object.values(postItemsParams).join('') }`, async () => {
                // console.log('boopin that boop')
      
                const p = await getPostItems(postItemsParams)        
                // console.log('booped that boop',response)
      
      
                return p
              })
              // console.log('got manual')
              newItems = posts.value?.items
              totalPages = posts.value?.totalPages
              nextPageAvailable = posts.value?.totalPages === currentPage
      
              pagination = pageRange(currentPage, posts.value?.totalPages, 6);
              isLoading = false;
              
              // console.log('finished manual', newItems)
              break
            }
      // If selecting items individually
      case (typeof props.items === 'number'):
        const { data: postDatas } = await useAsyncData( `ag-number-${route.fullPath}-${props.items}`, async () => {
          const posts = [...Array(props.items)].map(async (el, i) => {
            const entryType = props.blockData[`items_${i}_entry_type`]

            if (entryType === 'selection') {
              const selection = props.blockData[`items_${i}_post_selection`]
              const post = await getPost(selection, iface.endpoint)

              return {
                post,
                heading: undefined,
                subheading: undefined,
                subheadgin2: undefined,
                paragraph_entry_type: undefined,
                paragraph: undefined,
                button: undefined,
                image: undefined,
                openNewTab: openNewTab(props.blockData, i),
              }
            }

            const image = await getImage(props.blockData[`items_${i}_image`], iface.endpoint)

            return {
                  post: undefined,
                  heading: props.blockData[`items_${i}_heading`],
                  subheading: props.blockData[`items_${i}_subheading`],
                  subheading2: props.blockData[`items_${i}_subheading2`],
                  paragraph_entry_type: props.blockData[`items_${i}_paragraph_entry_type`],
                  paragraph: props.blockData[`items_${i}_paragraph`],
                  button: props.blockData[`items_${i}_button`],
                  image,
                  openNewTab: openNewTab(props.blockData, i),
                }
          })

          const items = await Promise.all(posts)

          return items
        })

        newItems = postDatas.value
        break
    }

    return {
      interface: iface,
      newItems,
      totalPages,
      totalObjects,
      currentPage,
      pages: undefined,
      nextPageAvailable,
      pagination,
      filters,
      sorters,
      activeFilters,
      showPast: false,
      showCurrent: false,
      showFuture: false,
      drawerActive: false,
      reverseOrder: false,
      alphabeticalOrder: false,
      location: [],
      input: undefined,
      objectsSort,
      objectsSortBy,
      aggregations,
      aggregationMakerList,
      aggregationMediumList,
      aggregationSupportList,
      aggregationYearList,
      aggregationTypeList,
      aggregationMaker: '',
      aggregationMedium: '',
      aggregationSupport: '',
      aggregationYear: '',
      aggregationType: '',
      isLoading,
    };
  },
  watch: {
    newItems: {
      deep: true,
      async handler() {
        this.animate();
      }
    }
  },
  computed: {
    filteredItems() {
      const component = this;
      let filteredItems;

      if (this.activeFilters.length > 0 && this.newItems[0]?.post) {
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
      let filterYPosition;

      this.currentPage = page;

      if (page === undefined && this.$refs.filter) {
        setTimeout(() => {
          filterYPosition = window.scrollY + this.$refs.filter.getBoundingClientRect().top;
          window.scrollTo({ top: filterYPosition });
        }, 600);
      }

      const { items: hits, query: searchQuery, totalObjects, totalPages } = await getObjectItems(page, searchTerm, this)

      this.newItems = hits
      this.totalObjects = totalObjects
      this.totalPages = totalPages

      // Check paged hit lengths and disable buttons
      if (hits.length < this.per_page + 1) {
        this.nextPageAvailable = false;
      } else {
        this.nextPageAvailable = true;
      }

      // Establishes aggregations. Prevents them from changing everytime we make a
      // request to the endpoint.
      if (this.aggregations === undefined) {
        this.aggregations = await getAggregations(searchQuery, username, password);
      }

      this.animate()
      this.isLoading = false;
    },
    async getPosts(page, searchTerm) {
      const postItemsParams = {
        page, 
        itemsCategory: this.items_category,  
        itemsType: this.items_type, 
        searchTerm, 
        showChronology: this.showChronology, 
        showCurrent: this.showCurrent, 
        showPast: this.showPast,
        showFuture: this.showFuture,
        perPage: this.per_page,
        endpoint: this.interface.endpoint,
        alphabeticalOrder: this.alphabeticalOrder,
        reverseOrder: this.reverseOrder, 
        route: this.$route
      }
      const { items, totalPages } = await getPostItems(postItemsParams)

      this.currentPage = page;
      this.totalPages = totalPages;
      this.nextPageAvailable = totalPages === this.currentPage
      this.newItems = items

      this.pagination = this.preparedPagination(component.currentPage, component.totalPages, 6);
      this.isLoading = false;
    },
    formatDate,
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

      this.filters = loadFilters(this.items_type, this.activeFilters);

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
      const drawer = this.$refs.drawer.querySelector('.filter__drawer');
      let term;

      // console.log(drawer);

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
    drawerScrollTop() {
      const drawer = this.$refs.drawer.querySelector('.filter__drawer');

      drawer.scrollTop = 0;
    },
    animate() {
      setTimeout(() => {
        if (this.$refs.filter?.querySelector('.horizontal-curtain')) {

          gsap.to(this.$refs.filter.querySelectorAll('.horizontal-curtain'), {
            width: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "expo.out",
          });

          // console.log('gsap fired');
        }

        // console.log('animation fired');
      }, 150);
    }
  }
}
</script>

<style lang="scss">
.article-grid {

  &__no-results {
    grid-column: span 12 / span 12;
    margin-bottom: 2.25vh;
  }

  &__item {
    grid-column: span 12 / span 12;
    margin-bottom: 40px;

    .article-grid--curated & {
      grid-column: span 6 / span 6;

      @include breakpoint(large) {
        grid-column: span 3 / span 3;
        margin-bottom: 10vh;

        .article-grid--2-columns & {
          grid-column: span 6 / span 6;
        }

        .article-grid--3-columns & {
          grid-column: span 4 / span 4;
        }
      }
    }

    .article-grid--6-columns & {
      grid-column: span 6 / span 6;

      @include breakpoint(medium) {
        grid-column: span 3 / span 3;
      }

      @include breakpoint(large) {
        grid-column: span 2 / span 2;
      }
    }

    @include breakpoint(medium) {
      grid-column: span 6 / span 6;
      margin-bottom: 60px;
    }

    @include breakpoint(large) {
      grid-column: span 3 / span 3;
      margin-bottom: 10vh;

      .article-grid--2-columns & {
        grid-column: span 6 / span 6;
      }

      .article-grid--3-columns & {
        grid-column: span 4 / span 4;
      }

      .article-grid--event-meta & {
        margin-bottom: 5.9vh;
      }
    }

    &:nth-child(12n - 7) {  // 12n if neccessary
      .article-grid--curated & {
        @include breakpoint(large) {
          grid-column: span 2 / span 2;
        }
      }
    }

    &:nth-child(1) {
      .article-grid--2-columns.article-grid--logos & {
        @include breakpoint(large) {
          grid-column: span 2 / span 2;
        }
      }
    }

    &:nth-child(2) {
      .article-grid--2-columns.article-grid--logos & {
        @include breakpoint(large) {
          grid-column: span 10 / span 10;
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
    margin-top: 0;
  }

  &--event-meta + .paragraph-style-2 {
    margin-top: 5.9vh;
  }

  + .marquee {
    margin-top: 0;
  }
}
</style>