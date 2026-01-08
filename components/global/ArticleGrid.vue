<template>
    <div
        class="article-grid"
        :class="[
            `article-grid--${variant} article-grid--${columns}-columns`,
            items_type == 'posts' ? 'article-grid--posts' : '',
        ]"
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
            v-if="
                (items_type == 'events' ||
                    items_type == 'exhibitions' ||
                    items_type == 'objects') &&
                $route.query.variant != 'traveling' &&
                per_page >= 20
            "
            class="filter"
            ref="filterRef"
        >
            <div class="filter__inner grid">
                <div class="filter__input">
                    <div class="horizontal-curtain" />

                    <div class="search">
                        <SearchBtn disabled />
                        <input
                            class="input search__input"
                            :placeholder="'Search'"
                            type="search"
                            v-model="searchInputRef"
                            @keyup.enter="recieveInput"
                        />
                    </div>
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
                    <SuperDropdown :size="'large'" :heading="'Sort'" :sort="true">
                        <ul v-if="items_type == 'objects'" class="filter__list">
                            <li>
                                <div
                                    class="checkbox checkbox--small"
                                    :class="[
                                        objectsSort == 'desc' && objectsSortBy == 'accession'
                                            ? 'checkbox--active'
                                            : '',
                                    ]"
                                >
                                    <div class="checkbox__main">
                                        <input
                                            type="radio"
                                            :name="`filter_alphabetical`"
                                            :value="`Accession Number Descending`"
                                            @click="
                                                toggleAlphabetical(`Accession Number Descending`)
                                            "
                                        />
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
                                    :class="[
                                        objectsSort == 'asc' && objectsSortBy == 'accession'
                                            ? 'checkbox--active'
                                            : '',
                                    ]"
                                >
                                    <div class="checkbox__main">
                                        <input
                                            type="radio"
                                            :name="`filter_alphabetical`"
                                            :value="`Accession Number Ascending`"
                                            @click="
                                                toggleAlphabetical(`Accession Number Ascending`)
                                            "
                                        />
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
                                    :class="[
                                        objectsSort == 'asc' && objectsSortBy == 'title'
                                            ? 'checkbox--active'
                                            : '',
                                    ]"
                                >
                                    <div class="checkbox__main">
                                        <input
                                            type="radio"
                                            :name="`filter_alphabetical`"
                                            :value="`Alphabetical from  'A'`"
                                            @click="toggleAlphabetical(`Alphabetical from  'A'`)"
                                        />
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
                                    :class="[
                                        objectsSort == 'desc' && objectsSortBy == 'title'
                                            ? 'checkbox--active'
                                            : '',
                                    ]"
                                >
                                    <div class="checkbox__main">
                                        <input
                                            type="radio"
                                            :name="`filter_alphabetical`"
                                            :value="`Alphabetical from  'Z'`"
                                            @click="toggleAlphabetical(`Alphabetical from  'Z'`)"
                                        />
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
                                    :class="[
                                        objectsSort == 'desc' && objectsSortBy == 'name'
                                            ? 'checkbox--active'
                                            : '',
                                    ]"
                                >
                                    <div class="checkbox__main">
                                        <input
                                            type="radio"
                                            :name="`filter_alphabetical`"
                                            :value="`By Artist Name Descending`"
                                            @click="toggleAlphabetical(`By Artist Name Descending`)"
                                        />
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
                                    :class="[
                                        objectsSort == 'asc' && objectsSortBy == 'name'
                                            ? 'checkbox--active'
                                            : '',
                                    ]"
                                >
                                    <div class="checkbox__main">
                                        <input
                                            type="radio"
                                            :name="`filter_alphabetical`"
                                            :value="`By Artist Name Ascending`"
                                            @click="toggleAlphabetical(`By Artist Name Ascending`)"
                                        />
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
                                    :class="[
                                        alphabeticalOrder && reverseOrder ? 'checkbox--active' : '',
                                    ]"
                                >
                                    <div class="checkbox__main">
                                        <input
                                            type="radio"
                                            :name="`filter_alphabetical`"
                                            :value="`Alphabetical from  'A'`"
                                            @click="toggleAlphabetical(`Alphabetical from  'A'`)"
                                        />
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
                                    :class="[
                                        alphabeticalOrder && reverseOrder == false
                                            ? 'checkbox--active'
                                            : '',
                                    ]"
                                >
                                    <div class="checkbox__main">
                                        <input
                                            type="radio"
                                            :name="`filter_alphabetical`"
                                            :value="`Alphabetical from  'Z'`"
                                            @click="toggleAlphabetical(`Alphabetical from  'Z'`)"
                                        />
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
                v-if="
                    aggregationMakerList.length > 0 ||
                    aggregationMediumList.length > 0 ||
                    aggregationSupportList.length > 0 ||
                    aggregationYearList.length > 0 ||
                    aggregationTypeList.length > 0
                "
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
            <div ref="drawerRef">
                <div class="filter__drawer" :class="{ 'filter__drawer--active': drawerActive }">
                    <div class="filter__drawer-top">
                        <h3 class="filter__heading heading-style-3" v-text="'Filters'" />
                        <button class="filter__close-btn" @click="drawerActive = !drawerActive">
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
                                        :class="[
                                            aggregationMakerList.includes(bucket.key) ||
                                            aggregationTypeList.includes(bucket.key) ||
                                            aggregationYearList.includes(bucket.key)
                                                ? 'checkbox--active'
                                                : '',
                                        ]"
                                    >
                                        <div class="checkbox__main">
                                            <input
                                                type="radio"
                                                :name="`filter_${key}`"
                                                :value="bucket.key"
                                                @click="aggregationChange($event, key)"
                                            />
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
                    <div v-for="(filter, index) in filters" class="filter__drawer-group">
                        <h3 class="heading-style-3" v-text="filter.name" />
                        <ul class="filter__list">
                            <li v-for="(item, index) in filter.items">
                                <div
                                    class="checkbox checkbox--small"
                                    :class="[item.active ? 'checkbox--active' : '']"
                                >
                                    <div class="checkbox__main">
                                        <input
                                            type="radio"
                                            :name="`filter_${filter.name}`"
                                            :value="item.name"
                                            @click="
                                                item.name == 'past' ||
                                                item.name == 'current' ||
                                                item.name == 'future'
                                                    ? toggleChronology(item)
                                                    : toggleFilter(item, filter.name)
                                            "
                                        />
                                    </div>
                                    <label
                                        v-text="item.name == 'future' ? 'upcoming' : item.name"
                                        @click="
                                            item.name == 'past' ||
                                            item.name == 'current' ||
                                            item.name == 'future'
                                                ? toggleChronology(item)
                                                : toggleFilter(item, filter.name)
                                        "
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
                v-if="
                    (items_type == 'exhibitions' || items_type == 'events') &&
                    filteredItems.length == 0 &&
                    !isLoading
                "
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
            <div v-else v-for="(item, index) in items" class="article-grid__item">
                <Article
                    v-bind="item"
                    :hover="hover"
                    :bordered="bordered"
                    :button_type="button_type"
                />
            </div>
        </div>
        <div
            v-if="
                Number(totalPages) &&
                per_page >= 20 &&
                items_type != 'collection' &&
                items_type != 'manual' &&
                (filteredItems.length > 0 || newItems.length > 0)
            "
            class="pagination"
        >
            <div class="pagination__inner grid">
                <div class="pagination__main">
                    <NuxtLink
                        v-if="page"
                        class="pagination__btn pagination__btn--prev"
                        :class="[currentPage == 1 ? 'pagination__btn--inactive' : '']"
                        :to="`/${items_type == 'posts' ? 'news' : items_type}/page-${
                            Number(page) - 1
                        }${
                            $route.query.search ||
                            $route.query.maker ||
                            $route.query.year ||
                            $route.query.type ||
                            $route.query.sort ||
                            $route.query.sortby ||
                            $route.query.has_image ||
                            $route.query.chronology ||
                            $route.query.location ||
                            $route.query.variant ||
                            $route.query.category ||
                            $route.query.embark_id
                                ? '?' + $route.fullPath.split('?').pop()
                                : ''
                        }`"
                        ><IconArrow />Previous</NuxtLink
                    >
                    <button
                        v-else
                        aria-label="Previous Page"
                        class="pagination__btn pagination__btn--prev"
                        :class="[currentPage == 1 ? 'pagination__btn--inactive' : '']"
                        @click="
                            items_type == 'objects'
                                ? getObjects(currentPage - 1, input)
                                : getPosts(currentPage - 1, input)
                        "
                    >
                        <IconArrow />Previous
                    </button>
                    <div
                        v-if="items_type == 'objects'"
                        class="pagination__label"
                        v-text="
                            `Page ${currentPage} | Objects ${per_page * (currentPage - 1) + 1} — ${
                                per_page * currentPage
                            } | ${totalObjects} Total Objects`
                        "
                    />
                    <ul v-else>
                        <li
                            v-for="index in pagination"
                            :class="[currentPage == index ? 'active' : '']"
                            :key="index"
                        >
                            <span v-if="index == '...'"> ... </span>
                            <NuxtLink
                                v-else
                                :to="`/${
                                    items_type == 'posts' ? 'news' : items_type
                                }/page-${index}${
                                    $route.query.search ||
                                    $route.query.maker ||
                                    $route.query.year ||
                                    $route.query.type ||
                                    $route.query.sort ||
                                    $route.query.sortby ||
                                    $route.query.has_image ||
                                    $route.query.chronology ||
                                    $route.query.location ||
                                    $route.query.variant ||
                                    $route.query.category ||
                                    $route.query.embark_id
                                        ? '?' + $route.fullPath.split('?').pop()
                                        : ''
                                }`"
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
                        :to="`/${items_type == 'posts' ? 'news' : items_type}/page-${
                            Number(page) + 1
                        }${
                            $route.query.search ||
                            $route.query.maker ||
                            $route.query.year ||
                            $route.query.type ||
                            $route.query.sort ||
                            $route.query.sortby ||
                            $route.query.has_image ||
                            $route.query.chronology ||
                            $route.query.location ||
                            $route.query.category ||
                            $route.query.embark_id
                                ? '?' + $route.fullPath.split('?').pop()
                                : ''
                        }`"
                        >Next<IconArrow
                    /></NuxtLink>
                    <button
                        v-else
                        aria-label="Next Page"
                        class="pagination__btn pagination__btn--next"
                        :class="[
                            currentPage == Number(totalPages) ? 'pagination__btn--inactive' : '',
                        ]"
                        @click="
                            items_type == 'objects'
                                ? getObjects(currentPage + 1, input)
                                : getPosts(currentPage + 1, input)
                        "
                    >
                        Next<IconArrow />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
    import gsap from 'gsap';

    import { useInterfaceStore } from '~/store/interface';
    import fetchWith from '~/helpers/fetchWith';
    import filtersEvents from '~/assets/data/filters-events.yml';
    import filtersExhibitions from '~/assets/data/filters-exhibitions.yml';
    import filtersObjects from '~/assets/data/filters-objects.yml';
    import filtersSort from '~/assets/data/filters-sort.yml';

    // --- Constants & Config ---

    const sorters = filtersSort.map((f) => ({
        name: f.name,
        items: f.items.map((i) => ({
            name: i,
            active: false,
        })),
    }));

    // TODO: Load from iface
    const endpoint = 'https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage';
    const username = 'Fr2fpegcBZ';
    const password = 'Vi7vGnL3h2rtW5SuECoKRwTf';

    // --- Helper Functions ---

    const makeElasticQuery = ({
        searchTerm,
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
        variant,
    }) => {
        let filterTerms = [];
        let filterMust = [];
        let filterSort = [];

        if (searchTerm) {
            filterMust.push({
                simple_query_string: {
                    query: searchTerm,
                    fuzzy_max_expansions: 20,
                    default_operator: 'and',
                },
            });
        }

        if (activeFilters.includes('Has Image')) {
            filterMust.push({ exists: { field: 'Images' } });
        }

        // Set the collection filter but show only objects with images if it's a curated peek
        if (embark_ID) {
            filterMust.push({ term: { 'Portfolios.Portfolio_ID': `${embark_ID}` } });

            if (variant === 'curated') {
                filterMust.push({ exists: { field: 'Images' } });
            }
        }

        if (aggregationMakerList.length > 0) {
            filterTerms.push({ terms: { 'Artist_Maker.sort_name': aggregationMakerList } });
        }

        if (aggregationMediumList.length > 0) {
            filterTerms.push({ terms: { Medium: aggregationMediumList } });
        }

        if (aggregationSupportList.length > 0) {
            filterTerms.push({ terms: { Support: aggregationSupportList } });
        }

        if (aggregationYearList.length > 0) {
            filterTerms.push({ terms: { 'dates.era_labels': aggregationYearList } });
        }

        if (aggregationTypeList.length > 0) {
            filterTerms.push({ terms: { Disp_Obj_Type: aggregationTypeList } });
        }

        if (objectsSortBy === 'name') {
            filterSort.push({ 'Artist_Maker.sort_name': objectsSort });
        } else if (objectsSort === 'year') {
            filterSort.push({ 'dates.start_year': 'desc' });
        } else if (objectsSortBy === 'title') {
            filterSort.push({ Disp_Title: objectsSort });
        } else {
            filterSort.push({ accession_num_year: objectsSort });
        }

        const should =
            aggregationMakerList.length > 0 ||
            aggregationMediumList.length > 0 ||
            aggregationSupportList.length > 0 ||
            aggregationYearList.length > 0 ||
            aggregationTypeList.length > 0
                ? filterTerms
                : [];
        const must = filterMust.length > 0 ? filterMust : [];

        const size = Number(per_page) + 1;
        const from = Number(per_page) * (Number(page) - 1);
        const searchQuery = {
            size,
            from,
            sort: filterSort,
            query: {
                bool: {
                    should,
                    must,
                    minimum_should_match: filterTerms.length,
                },
            },
        };

        return searchQuery;
    };

    const getAggregations = async ({ embark_ID, username, password }) => {
        const query = embark_ID
            ? {
                  bool: {
                      must: [
                          {
                              term: { 'Portfolios.Portfolio_ID': embark_ID },
                          },
                      ],
                  },
              }
            : undefined;

        const aggsQuery = {
            size: 0,
            query,
            aggs: {
                maker: {
                    terms: {
                        field: 'Artist_Maker.sort_name',
                        exclude: [''],
                        size: 3000,
                        order: { _key: 'asc' },
                    },
                },
                year: {
                    terms: {
                        field: 'dates.era_labels',
                        order: { start: 'desc' },
                        size: 3000,
                    },
                    aggs: {
                        start: { max: { field: 'dates.start_year' } },
                    },
                },
                type: {
                    terms: {
                        field: 'Disp_Obj_Type',
                        exclude: [''],
                        size: 300,
                        order: { _key: 'asc' },
                    },
                },
            },
        };

        const output = await fetchWith(
            `https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage/_search`,
            aggsQuery,
            username,
            password
        );

        return output.aggregations;
    };

    const getPost = async (i, endpoint) => {
        const pagesUrl = new URL(`pages/${i}`, endpoint);
        const postsUrl = new URL(`posts/${i}`, endpoint);

        try {
            const page = await $fetch(pagesUrl.href);
            return page;
        } catch {
            const post = await $fetch(postsUrl.href);
            return post;
        }
    };

    const getPostItems = async ({
        page,
        itemsCategory,
        itemsType,
        searchTerm,
        showChronology,
        showCurrent,
        showPast,
        showFuture,
        perPage,
        endpoint,
        endpointCustom,
        alphabeticalOrder,
        reverseOrder,
        route,
    }) => {
        const catsParams = { parent: itemsCategory };
        const catsUrl = new URL('categories', endpoint);

        const catsResp = await $fetch(catsUrl.href, { params: catsParams });
        const categories = (catsResp ?? []).map((c) => c.id);

        let pageParams = {
            _embed: 'wp:featuredmedia',
            page: page,
            per_page: perPage,
            categories_exclude: '1',
            categories: categories + [itemsCategory],
        };

        if (searchTerm) {
            pageParams.search = searchTerm;
        }

        if (alphabeticalOrder) {
            pageParams.orderby = 'title';
        }

        if (reverseOrder) {
            pageParams.order = 'ASC';
        }

        if (
            (showChronology == 'current' || showCurrent) &&
            (itemsType === 'events' || itemsType === 'exhibitions')
        ) {
            pageParams.chronologies = '9';
        } else if (
            (showChronology === 'past' || showPast) &&
            (itemsType === 'events' || itemsType === 'exhibitions')
        ) {
            pageParams.chronologies = '8';
        } else if (
            (showChronology === 'future' || showFuture) &&
            (itemsType === 'events' || itemsType === 'exhibitions')
        ) {
            pageParams.chronologies_exclude = '8,9';
        } else if (itemsType === 'events') {
            pageParams.chronologies_exclude = '8';
        }

        if (route.query.variant === 'traveling') {
            pageParams.variant = '14';
        }

        // if (itemsType === 'events') {
        //     if (showChronology) {
        //         pageParams['filter[orderby]'] = 'meta_value';
        //         pageParams['filter[order]'] = 'DESC';
        //         pageParams['filter[meta_key]'] = 'date';
        //     } else {
        //         pageParams['filter[orderby]'] = 'meta_value';
        //         pageParams['filter[order]'] = 'ASC';
        //         pageParams['filter[meta_key]'] = 'date';
        //     }
        // }

        if (itemsType === 'exhibitions' || 'events') {
            endpoint = endpointCustom;

            if (itemsType === 'exhibitions') {
                if (showPast) {
                    pageParams = {
                        chronology: 'past',
                        orderby: 'end_date',
                        order: 'DESC',
                        limit: perPage,
                        page,
                    };
                } else if (showFuture) {
                    pageParams = {
                        orderby: 'date',
                        order: 'DESC',
                        chronology: 'future',
                        page,
                        limit: perPage,
                    };
                } else if (showCurrent) {
                    pageParams = {
                        orderby: 'date',
                        order: 'DESC',
                        chronology: 'current',
                        page,
                        limit: perPage,
                    };
                } else {
                    pageParams = {
                        orderby: 'date',
                        order: 'DESC',
                        chronology: 'all',
                        page,
                        limit: perPage,
                    };
                }
            } else if (itemsType === 'events') {
                if (showPast) {
                    pageParams = {
                        chronology: 'past',
                        orderby: 'end_date',
                        order: 'DESC',
                        limit: perPage,
                        page,
                    };
                } else if (showFuture) {
                    pageParams = {
                        orderby: 'date',
                        order: 'ASC',
                        chronology: 'future',
                        page,
                        limit: perPage,
                    };
                } else if (showCurrent) {
                    pageParams = {
                        orderby: 'date',
                        order: 'ASC',
                        chronology: 'current',
                        page,
                        limit: perPage,
                    };
                } else {
                    pageParams = {
                        orderby: 'date',
                        order: 'ASC',
                        chronology: 'current-future',
                        page,
                        limit: perPage,
                    };
                }
            }

            if (alphabeticalOrder) {
                pageParams.orderby = 'title';
                pageParams.order = 'DESC';
            }

            if (reverseOrder) {
                pageParams.orderby = 'title';
                pageParams.order = 'ASC';
            }

            if (searchTerm) {
                pageParams.search = searchTerm;
            }

            if (route.query.location) {
                pageParams.location = route.query.location;
            }

            if (route.query.variant === 'traveling') {
                pageParams.variant = '14';
            }
        }

        const pageReqUrl = new URL(itemsType, endpoint);

        const pageResp = await $fetch.raw(pageReqUrl.href, {
            params: pageParams,
        });

        const totalPages = pageResp.headers.get('x-wp-totalpages');

        let postItems = pageResp._data.map((i) => {
            if (
                i.acf.location != 'campus' &&
                i.acf.location != 'downtown' &&
                i.acf.location != 'virtual'
            ) {
                i.acf.location = 'elsewhere';
            }

            return {
                post: i,
                event_date: i.acf.date ? formatDate(i.acf.date, 'events-raw') : undefined,
                end_date: i.acf.end_date ? formatDate(i.acf.end_date, 'events-raw') : undefined,
            };
        });

        // if (alphabeticalOrder === false) {
        //     if (itemsType === 'events') {
        //         if (showChronology === 'future') {
        //             postItems.sort((a, b) => a.event_date.getTime() - b.event_date.getTime());
        //         } else if (showChronology === 'past') {
        //             postItems.sort((a, b) =>
        //                 itemsType === 'events'
        //                     ? b.event_date.getTime() - a.event_date.getTime()
        //                     : b.end_date.getTime() - a.end_date.getTime()
        //             );
        //         } else {
        //             if (route.query.variant === 'traveling') {
        //                 postItems.sort((a, b) => b.event_date.getTime() - a.event_date.getTime());
        //             } else {
        //                 postItems.sort((a, b) =>
        //                     itemsType === 'events'
        //                         ? a.event_date.getTime() - b.event_date.getTime()
        //                         : b.event_date.getTime() - a.event_date.getTime()
        //                 );
        //             }
        //         }
        //     }
        // }
        console.log(postItems);
        console.log(totalPages);
        return { items: postItems, totalPages };
    };

    const getObjectCount = async (query, endpoint, username, password, perPage) => {
        let q = { ...query };
        delete q.size;
        delete q.from;
        delete q.sort;

        const response = await fetchWith(`${endpoint}/_count`, q, username, password);

        return { totalObjects: response.count, totalPages: response.count / perPage };
    };

    const getImage = async (i, endpoint) => {
        if (!i) return;

        const url = new URL(`media/${i}`, endpoint);
        const imageObj = await $fetch(url.href);

        const mediaDetails = imageObj.media_details;

        let imageAspect;
        if (mediaDetails.height > 0 && mediaDetails.width > 0) {
            imageAspect = mediaDetails.height / mediaDetails.width;
        }

        return {
            artist_name: imageObj.acf.artist_name,
            object_title: imageObj.acf.object_title,
            object_creation_date: imageObj.acf.object_creation_date,
            alt_text: imageObj.alt_text,
            caption: {
                rendered: imageObj.description.rendered
                    .replace(/<img[^>]*>/g, '')
                    .replace(/<p[^>]*>|<\/p>/g, '')
                    .replace(/\r?\n|\r/g, '')
                    .replace(/<a[^>]*>|<\/a>/g, ''),
            },
            media_details: {
                sizes: {
                    desktop: {
                        aspect_ratio: imageAspect,
                        source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered
                            .replace('https://', '')
                            .replace('http://', '')
                            .replace('wp-content/uploads/', '')
                            .replace('wp-json/wp/v2/', '')}/w=800,quality=75,format=webp`,
                    },
                    mobile: {
                        aspect_ratio: imageAspect,
                        source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered
                            .replace('https://', '')
                            .replace('http://', '')
                            .replace('wp-content/uploads/', '')
                            .replace('wp-json/wp/v2/', '')}/w=400,quality=75,format=webp`,
                    },
                },
            },
        };
    };

    const getObjectItems = async (page, searchTerm, queryArgs) => {
        const searchQuery = makeElasticQuery({ searchTerm, page, ...queryArgs });
        const { totalObjects, totalPages } = await getObjectCount(
            searchQuery,
            endpoint,
            username,
            password,
            queryArgs.per_page
        );

        const response = await fetchWith(`${endpoint}/_search`, searchQuery, username, password);

        const items = response.hits.hits.map((i) => {
            const img = i._source.Images.length > 0 ? i._source.Images[0] : undefined;
            const imgUrl = img
                ? `https://ccma-iiif-cache-service.fly.dev/iiif/2/${img.IIIF_URL.substring(
                      img.IIIF_URL.lastIndexOf('/') + 1
                  ).replace(/\.[^/.]+$/, '')}/full/${encodeURIComponent(
                      `${queryArgs.columns === '6' ? '300,' : '400,'}`
                  )}/0/default.jpg`
                : '';

            return {
                size: 'embark',
                heading: `${i._source.Disp_Maker_1}`,
                subheading: `<em>${i._source.Disp_Title}</em>`,
                subheading2: `${i._source.Disp_Create_DT}`,
                button: {
                    srOnly: true,
                    title: 'View Object',
                    url: `/objects/${i._source.embark_ID}`,
                },
                image: img
                    ? {
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
                                  },
                              },
                          },
                      }
                    : {
                          caption: {
                              rendered: 'No Image Available',
                          },
                          alt_text: 'No Image Available',
                          media_details: {
                              sizes: {
                                  full: {
                                      source_url: `/blanks/blank_${Math.floor(
                                          Math.random() * (3 - 1 + 1) + 1
                                      )}.png`,
                                  },
                                  mobile: {
                                      source_url: `/blanks/blank_${Math.floor(
                                          Math.random() * (3 - 1 + 1) + 1
                                      )}.png`,
                                  },
                              },
                          },
                      },
            };
        });

        return { items, totalObjects, totalPages, query: searchQuery };
    };

    const loadFilters = (items_type, activeFilters) => {
        let active = activeFilters ?? [];
        let filtersConfig;
        switch (items_type) {
            case 'events':
                filtersConfig = filtersEvents;
                break;
            case 'exhibitions':
                filtersConfig = filtersExhibitions;
                break;
            case 'objects':
                filtersConfig = filtersObjects;
                break;
            default:
                return [];
        }

        const filters = filtersConfig.map((f) => ({
            name: f.name,
            items: f.items.map((i) => ({
                name: i,
                active: i === 'Has Image' && active.includes('Has Image') ? true : false,
            })),
        }));

        return filters;
    };

    const wrapArray = (item) => {
        return Array.isArray(item) ? item : [item];
    };

    const formatDate = (d, style) => {
        switch (style) {
            case 'numeric':
                return new Date(d)
                    .toLocaleDateString('en-US', {
                        year: '2-digit',
                        month: 'numeric',
                        day: 'numeric',
                        hour12: false,
                    })
                    .replaceAll('/', '.');

            case 'events':
                return new Date(
                    `${d.substr(0, 4)}-${d.substr(4, 2)}-${d.substr(6, 2)}T00:00:00`
                ).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
                    hour12: false,
                });

            case 'events-raw':
                return new Date(`${d.substr(0, 4)}-${d.substr(4, 2)}-${d.substr(6, 2)}T00:00:00`);

            default:
                return new Date(d).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
                    hour12: false,
                });
        }
    };

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
    };

    const openNewTab = (blockData, i) => {
        if (
            blockData[`items_${i}_entry_type`] == 'selection' &&
            blockData[`items_${i}_open_new_tab`]
        ) {
            return blockData[`items_${i}_open_new_tab`] == 1;
        }

        return false;
    };

    // --- Component Setup ---

    const props = defineProps({
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
        },
        activeFilters: {
            type: Array,
            required: false,
            default: () => [],
        },
    });

    const route = useRoute();
    const iface = useInterfaceStore();

    // Refs for state
    const activeFilters = ref(props.activeFilters ?? []);
    const aggregationMakerList = ref([]);
    const aggregationTypeList = ref([]);
    const aggregationYearList = ref([]);
    const aggregationMediumList = ref([]);
    const aggregationSupportList = ref([]);
    const alphabeticalOrder = ref(false);
    const reverseOrder = ref(false);
    const currentPage = ref(props.page ?? 1);
    const objectsSort = ref('desc');
    const objectsSortBy = ref('accession');
    const showPast = ref(false);
    const showCurrent = ref(false);
    const showFuture = ref(false);
    const filters = ref(loadFilters(props.items_type, activeFilters.value));
    const newItems = ref([]);
    const totalObjects = ref(undefined);
    const totalPages = ref(undefined);
    const isLoading = ref(true);
    const nextPageAvailable = ref(false);
    const aggregations = ref({});
    const pagination = ref([]);
    const location = ref([]);
    const input = ref(undefined);
    const drawerActive = ref(false);

    // Template Refs
    const filterRef = ref(null);
    const drawerRef = ref(null);
    const searchInputRef = ref(null);

    // Initial Data Loading Logic (migrated from original setup switch)
    const initData = async () => {
        switch (true) {
            case props.items_type === 'objects':
                activeFilters.value = route.query.has_image !== 'false' ? ['Has Image'] : [];
                aggregationMakerList.value = route.query.maker ? wrapArray(route.query.maker) : [];
                aggregationYearList.value = route.query.year ? wrapArray(route.query.year) : [];
                aggregationTypeList.value = route.query.type ? wrapArray(route.query.type) : [];

                if (route.query.sort === 'desc' || !route.query.sort) {
                    objectsSort.value = 'desc';
                } else {
                    objectsSort.value = route.query.sort;
                }

                if (route.query.sortby === 'accession' || !route.query.sort) {
                    objectsSortBy.value = 'accession';
                } else {
                    objectsSortBy.value = route.query.sortby;
                }

                const queryArgs = {
                    ...props,
                    activeFilters: activeFilters.value,
                    aggregationMakerList: aggregationMakerList.value,
                    aggregationMediumList: aggregationMediumList.value,
                    aggregationSupportList: aggregationSupportList.value,
                    aggregationYearList: aggregationYearList.value,
                    aggregationTypeList: aggregationTypeList.value,
                    objectsSortBy: objectsSortBy.value,
                    objectsSort: objectsSort.value,
                };

                const { data } = await useAsyncData(
                    `articlegrid-${props.page}-${route.query.search}`,
                    async () => {
                        let response;
                        if (props.page) {
                            response = await getObjectItems(
                                props.page,
                                route.query.search,
                                queryArgs
                            );
                        } else {
                            response = await getObjectItems(1, route.query.search, queryArgs);
                        }

                        const aggs = await getAggregations({
                            query: response.query,
                            username,
                            password,
                        });

                        return {
                            items: response.items,
                            totalObjects: response.totalObjects,
                            totalPages: response.totalPages,
                            aggregations: aggs,
                        };
                    }
                );

                newItems.value = data.value?.items;
                totalObjects.value = data.value?.totalObjects;
                totalPages.value = data.value?.totalPages;
                aggregations.value = data.value?.aggregations;

                nextPageAvailable.value = !(newItems.value?.length < props.per_page + 1);
                isLoading.value = false;
                break;

            case props.items_type == 'collection':
                const args = {
                    ...props,
                    searchTerm: route.query.search,
                    activeFilters: activeFilters.value,
                    aggregationMakerList: aggregationMakerList.value,
                    aggregationMediumList: aggregationMediumList.value,
                    aggregationSupportList: aggregationSupportList.value,
                    aggregationYearList: aggregationYearList.value,
                    aggregationTypeList: aggregationTypeList.value,
                    objectsSortBy: objectsSortBy.value,
                    objectsSort: objectsSort.value,
                    page: currentPage.value,
                };

                const { data: collexData } = await useAsyncData(
                    `collection-${currentPage.value}-${route.query.search}-${props.embark_ID}`,
                    async () => {
                        const {
                            items: hits,
                            totalObjects: tObj,
                            totalPages: tPages,
                        } = await getObjectItems(currentPage.value, route.query.search, args);
                        return { hits, tObj, tPages };
                    }
                );

                newItems.value = collexData.value?.hits;
                totalObjects.value = collexData.value?.tObj;
                totalPages.value = collexData.value?.tPages;

                nextPageAvailable.value = !(collexData.value?.hits?.length < props.per_page + 1);
                isLoading.value = false;
                break;

            case props.items_type === 'events' || props.items_type === 'exhibitions': {
                console.log('init data - events or exhibits');
                if (route.query.search) {
                    searchInputRef.value = route.query.search;
                }
                if (route.query.chronology) {
                    if (route.query.chronology === 'past') {
                        showPast.value = true;
                    } else if (route.query.chronology === 'current') {
                        showCurrent.value = true;
                    } else if (route.query.chronology === 'future') {
                        showFuture.value = true;
                    }
                    filters.value[1].items.find(
                        (item) => item.name === route.query.chronology
                    ).active = true;
                }

                if (route.query.location) {
                    location.value = route.query.location ? wrapArray(route.query.location) : [];
                    location.value.forEach((l) => {
                        filters.value[0].items.find((item) => item.name == l).active = true;
                    });
                    activeFilters.value.push(...location.value);
                }

                const postItemsParams = {
                    alphabeticalOrder: alphabeticalOrder.value,
                    endpoint: iface.endpoint,
                    endpointCustom: iface.endpointcustom,
                    itemsCategory: props.items_category,
                    itemsType: props.items_type,
                    page: currentPage.value,
                    perPage: props.per_page,
                    reverseOrder: reverseOrder.value,
                    route: route,
                    searchTerm: route.query.search,
                    showChronology: props.showChronology,
                    showPast: showPast.value,
                    showFuture: showFuture.value,
                    showCurrent: showCurrent.value,
                };

                const { data: response } = await useAsyncData(
                    `postItems-${Object.values(postItemsParams).join('')}`,
                    async () => {
                        return await getPostItems(postItemsParams);
                    }
                );

                if (!response.value) {
                    throw createError({
                        statusCode: 404,
                        statusMessage: 'Page Not Found',
                    });
                }
                totalPages.value = response.value?.totalPages;
                newItems.value = response.value?.items;

                nextPageAvailable.value = currentPage.value < response.value?.totalPages;
                pagination.value = pageRange(currentPage.value, response.value.totalPages, 6);
                isLoading.value = false;
                break;
            }

            case props.items_type != 'manual': {
                const postItemsParams = {
                    page: currentPage.value,
                    itemsCategory: props.items_category,
                    itemsType: props.items_type,
                    searchTerm: route.query.search,
                    showChronology: props.showChronology,
                    perPage: props.per_page,
                    endpoint: iface.endpoint,
                    endpointCustom: iface.endpointcustom,
                    route: route,
                };

                const { data: posts } = await useAsyncData(
                    `ag-manual-${Object.values(postItemsParams).join('')}`,
                    async () => {
                        return await getPostItems(postItemsParams);
                    }
                );

                newItems.value = posts.value?.items;
                totalPages.value = posts.value?.totalPages;
                nextPageAvailable.value = posts.value?.totalPages === currentPage.value;

                pagination.value = pageRange(currentPage.value, posts.value?.totalPages, 6);
                isLoading.value = false;
                break;
            }

            case typeof props.items === 'number':
                const reqSignature = Object.entries(props.blockData)
                    .filter(
                        ([k, v]) =>
                            k.endsWith('_image') ||
                            k.endsWith('_heading') ||
                            k.endsWith('_subheading')
                    )
                    .map(([k, v]) => v)
                    .join('-');

                const { data: postDatas } = await useAsyncData(
                    `ag-number-${route.fullPath}-${props.items}-${reqSignature}`,
                    async () => {
                        const posts = [...Array(props.items)].map(async (el, i) => {
                            const entryType = props.blockData[`items_${i}_entry_type`];

                            if (entryType === 'selection') {
                                const selection = props.blockData[`items_${i}_post_selection`];
                                const post = await getPost(selection, iface.endpoint);
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
                                };
                            }

                            let image;
                            if (props.blockData[`items_${i}_image`]) {
                                image = await getImage(
                                    props.blockData[`items_${i}_image`],
                                    iface.endpoint
                                );
                            }

                            return {
                                post: undefined,
                                heading: props.blockData[`items_${i}_heading`],
                                subheading: props.blockData[`items_${i}_subheading`],
                                subheading2: props.blockData[`items_${i}_subheading2`],
                                paragraph_entry_type:
                                    props.blockData[`items_${i}_paragraph_entry_type`],
                                paragraph: props.blockData[`items_${i}_paragraph`],
                                button: props.blockData[`items_${i}_button`],
                                image,
                                openNewTab: openNewTab(props.blockData, i),
                            };
                        });
                        return await Promise.all(posts);
                    }
                );

                newItems.value = postDatas.value;
                break;
        }
    };
    // Execute initialization
    await initData();

    // --- Computed ---

    const filteredItems = computed(() => {
        let result;
        if (activeFilters.value.length > 0 && newItems.value[0]?.post) {
            result = newItems.value.filter((item) =>
                Object.values(item.post.acf).some((k) => activeFilters.value.includes(k))
            );
        } else {
            result = newItems.value;
        }
        return result;
    });

    // --- Methods ---

    const triggerNavigateTo = () => {
        let chrono = '';
        if (showPast.value === true) {
            chrono = 'past';
        } else if (showCurrent.value === true) {
            chrono = 'current';
        } else if (showFuture.value === true) {
            chrono = 'future';
        }

        if (props.items_type === 'objects') {
            navigateTo({
                path: `/objects/page-1`,
                query: {
                    search: input.value,
                    maker: aggregationMakerList.value,
                    year: aggregationYearList.value,
                    type: aggregationTypeList.value,
                    sort: objectsSort.value,
                    sortby: objectsSortBy.value,
                    embark_id: route.query.embark_id,
                    has_image: activeFilters.value.includes('Has Image') ? true : false,
                },
            });
        } else {
            navigateTo({
                path: `/${props.items_type}/page-1`,
                query: {
                    search: input.value,
                    chronology: chrono,
                    location: location.value,
                    variant: route.query.variant,
                },
            });
        }
    };

    const animate = () => {
        setTimeout(() => {
            if (filterRef.value?.querySelector('.horizontal-curtain')) {
                gsap.to(filterRef.value.querySelectorAll('.horizontal-curtain'), {
                    width: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: 'expo.out',
                });
            }
        }, 150);
    };

    const drawerScrollTop = () => {
        if (!drawerRef.value) return;
        const drawer = drawerRef.value.querySelector('.filter__drawer');
        if (drawer) drawer.scrollTop = 0;
    };

    const getObjects = async (page, searchTerm) => {
        let filterYPosition;
        currentPage.value = page;

        if (page === undefined && filterRef.value) {
            setTimeout(() => {
                filterYPosition = window.scrollY + filterRef.value.getBoundingClientRect().top;
                window.scrollTo({ top: filterYPosition });
            }, 600);
        }

        const queryArgs = {
            searchTerm,
            activeFilters: activeFilters.value,
            page: props.page, // or currentPage.value? Original used props.page in some contexts but updated local currentPage.
            per_page: props.per_page,
            embark_ID: props.embark_ID,
            aggregationMakerList: aggregationMakerList.value,
            aggregationMediumList: aggregationMediumList.value,
            aggregationSupportList: aggregationSupportList.value,
            aggregationYearList: aggregationYearList.value,
            aggregationTypeList: aggregationTypeList.value,
            objectsSortBy: objectsSortBy.value,
            objectsSort: objectsSort.value,
            variant: props.variant,
        };

        const {
            items: hits,
            query: searchQuery,
            totalObjects: tObj,
            totalPages: tPages,
        } = await getObjectItems(page, searchTerm, queryArgs);

        newItems.value = hits;
        totalObjects.value = tObj;
        totalPages.value = tPages;

        nextPageAvailable.value = !(hits.length < props.per_page + 1);

        if (aggregations.value === undefined) {
            aggregations.value = await getAggregations(searchQuery, username, password);
        }

        animate();
        isLoading.value = false;
    };

    const getPosts = async (page, searchTerm) => {
        const postItemsParams = {
            page,
            itemsCategory: props.items_category,
            itemsType: props.items_type,
            searchTerm,
            showChronology: props.showChronology,
            showCurrent: showCurrent.value,
            showPast: showPast.value,
            showFuture: showFuture.value,
            perPage: props.per_page,
            endpoint: iface.endpoint,
            endpointCustom: iface.endpointcustom,
            alphabeticalOrder: alphabeticalOrder.value,
            reverseOrder: reverseOrder.value,
            route: route,
        };
        const { items, totalPages: tPages } = await getPostItems(postItemsParams);

        currentPage.value = page;
        totalPages.value = tPages;
        nextPageAvailable.value = tPages === currentPage.value;
        newItems.value = items;
        pagination.value = pageRange(page, tPages, 6);
        isLoading.value = false;
    };

    const resetFilter = () => {
        if (props.items_type == 'objects') {
            aggregationMakerList.value = [];
            aggregationMediumList.value = [];
            aggregationSupportList.value = [];
            aggregationYearList.value = [];
            aggregationTypeList.value = [];
        }

        if (props.items_type == 'exhibitions' || props.items_type == 'events') {
            location.value = [];
            showPast.value = false;
            showCurrent.value = false;
            showFuture.value = false;
        }

        filters.value = loadFilters(props.items_type, activeFilters.value);

        if (props.items_type == 'objects' && route.query.has_image != false) {
            activeFilters.value = ['Has Image'];
        } else {
            activeFilters.value = [];
        }

        // Reset input ref
        if (searchInputRef.value) {
            // Assuming the SearchInput component exposes 'input'
            // If not, this might need adjustment based on that child component
            searchInputRef.value = '';
        }

        triggerNavigateTo();
    };

    const toggleFilter = (term, filterName) => {
        term.active = !term.active;

        if (term.active == true) {
            activeFilters.value.push(term.name);
            if (filterName == 'location') {
                location.value.push(term.name);
            }
        } else {
            const index = activeFilters.value.indexOf(term.name);
            const location_index = location.value.indexOf(term.name);

            activeFilters.value.splice(index, 1);
            if (filterName == 'location') {
                location.value.splice(location_index, 1);
            }
        }

        if (props.items_type == 'objects') {
            triggerNavigateTo();
            getObjects(1, searchInputRef.value);
        } else {
            triggerNavigateTo();
            getPosts(1, searchInputRef.value);
        }
    };

    const toggleChronology = (term) => {
        term.active = !term.active;

        if (term.name == 'past') {
            showPast.value = !showPast.value;
            showCurrent.value = false;
            showFuture.value = false;
            filters.value[1].items.find((item) => item.name == 'current').active = false;
            filters.value[1].items.find((item) => item.name == 'future').active = false;
        } else if (term.name == 'current') {
            showCurrent.value = !showCurrent.value;
            showPast.value = false;
            showFuture.value = false;
            filters.value[1].items.find((item) => item.name == 'past').active = false;
            filters.value[1].items.find((item) => item.name == 'future').active = false;
        } else if (term.name == 'future') {
            showFuture.value = !showFuture.value;
            showCurrent.value = false;
            showPast.value = false;
            filters.value[1].items.find((item) => item.name == 'past').active = false;
            filters.value[1].items.find((item) => item.name == 'current').active = false;
        }

        triggerNavigateTo();
        getPosts(1, input.value);
    };

    const toggleAlphabetical = (term) => {
        if (props.items_type == 'objects') {
            if (term == `Accession Number Descending`) {
                objectsSortBy.value = 'accession';
                objectsSort.value = 'desc';
            } else if (term == `Accession Number Ascending`) {
                objectsSortBy.value = 'accession';
                objectsSort.value = 'asc';
            } else if (term == `Alphabetical from  'A'`) {
                objectsSortBy.value = 'title';
                objectsSort.value = 'asc';
            } else if (term == `Alphabetical from  'Z'`) {
                objectsSortBy.value = 'title';
                objectsSort.value = 'desc';
            } else if (term == `By Artist Name Descending`) {
                objectsSortBy.value = 'name';
                objectsSort.value = 'desc';
            } else if (term == `By Artist Name Ascending`) {
                objectsSortBy.value = 'name';
                objectsSort.value = 'asc';
            } else if (term == `By Year`) {
                objectsSort.value = 'year';
            }

            triggerNavigateTo();
            getObjects(1, searchInputRef.value);
        } else {
            if (term == `Alphabetical from  'A'`) {
                if (reverseOrder.value == true && alphabeticalOrder.value == true) {
                    reverseOrder.value = false;
                    alphabeticalOrder.value = false;
                } else {
                    reverseOrder.value = true;
                    alphabeticalOrder.value = true;
                }
            } else if (term == `Alphabetical from  'Z'`) {
                if (reverseOrder.value == false && alphabeticalOrder.value == true) {
                    reverseOrder.value = false;
                    alphabeticalOrder.value = false;
                } else {
                    reverseOrder.value = false;
                    alphabeticalOrder.value = true;
                }
            }

            getPosts(1, searchInputRef.value);
        }
    };

    const recieveInput = () => {
        input.value = searchInputRef.value;

        if (props.items_type === 'objects' && props.page) {
            triggerNavigateTo();
            getObjects(1, searchInputRef.value);
        } else if (props.items_type === 'objects') {
            getObjects(1, searchInputRef.value);
        } else {
            triggerNavigateTo();
            getPosts(1, searchInputRef.value);
        }
    };

    const aggregationChange = (e, key) => {
        let term;
        if (e.target == undefined) {
            term = e;
        } else {
            term = e.target.value;
        }

        if (key == 'maker') {
            aggregationMakerList.value.includes(term)
                ? aggregationMakerList.value.splice(aggregationMakerList.value.indexOf(term), 1)
                : aggregationMakerList.value.push(term);
        }

        if (key == 'medium') {
            aggregationMediumList.value.includes(term)
                ? aggregationMediumList.value.splice(aggregationMediumList.value.indexOf(term), 1)
                : aggregationMediumList.value.push(term);
        }

        if (key == 'support') {
            aggregationSupportList.value.includes(term)
                ? aggregationSupportList.value.splice(aggregationSupportList.value.indexOf(term), 1)
                : aggregationSupportList.value.push(term);
        }

        if (key == 'year') {
            aggregationYearList.value.includes(term)
                ? aggregationYearList.value.splice(aggregationYearList.value.indexOf(term), 1)
                : aggregationYearList.value.push(term);
        }

        if (key == 'type') {
            aggregationTypeList.value.includes(term)
                ? aggregationTypeList.value.splice(aggregationTypeList.value.indexOf(term), 1)
                : aggregationTypeList.value.push(term);
        }

        triggerNavigateTo();
        getObjects(1, input.value);
    };

    // --- Watchers ---

    watch(
        newItems,
        async () => {
            animate();
        },
        { deep: true }
    );

    // --- Lifecycle ---

    onMounted(() => {
        if (drawerRef.value) {
            document.body.appendChild(drawerRef.value);
        }
        animate();
    });

    onBeforeUnmount(() => {
        if (drawerRef.value) {
            const drawer = drawerRef.value;
            gsap.to(drawer.querySelector('.filter__drawer'), {
                x: '100%',
                duration: 0.4,
                onComplete: () => {
                    drawer.remove();
                },
            });
        }
    });
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

            &:nth-child(12n - 7) {
                // 12n if neccessary
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
