<template>
    <header
        class="header"
        role="banner"
        ref="header"
        :class="[
            iface.search ? 'header--search-active' : '',
            drawerActive ? 'header--drawer-active' : '',
        ]"
    >
        <div class="header__inner grid">
            <div class="header__top">
                <SuperDropdown
                    class="header__ribbon--desktop"
                    :heading="'Colby Arts'"
                    :items="utility"
                    aria-label="Utility Menu"
                />
            </div>
            <div class="header__utility">
                <NuxtLink class="header__logo" @click="closeDrawer()" :to="'/'">
                    <span class="sr-only" v-text="'Return to Homepage'" />
                    <Logo />
                </NuxtLink>
                <div class="header__activity">
                    <SearchInput ref="searchInput" :placeholder="'Search Colby Museum'" />
                    <SuperDropdown
                        :class="[dropdownClassCampus]"
                        :size="'large'"
                        :heading="dropdownHeadingCampus"
                        :events="campusEvent"
                    />
                    <SuperDropdown
                        :class="[dropdownClassDowntown]"
                        :size="'large'"
                        :heading="dropdownHeadingDowntown"
                        :events="downtownEvent"
                    />
                </div>
                <div class="header__btn-group">
                    <SearchBtn
                        class="header__search-btn"
                        :class="{ active: iface.search }"
                        @click="toggleSearch()"
                    />
                    <button
                        class="header__hamburger"
                        :aria-expanded="drawerActive"
                        @click="toggleDrawer()"
                    >
                        <span></span>
                    </button>
                </div>
            </div>
        </div>
        <div class="header__drawer">
            <div class="header__inner grid">
                <nav class="header__primary" aria-label="Primary Menu">
                    <ul>
                        <li
                            v-for="(item, index) in primary"
                            :key="index"
                            :class="{ active: active == index }"
                            @keyup.left="keyboardLeft($event)"
                            @keyup.right="keyboardRight($event)"
                        >
                            <NuxtLink
                                :to="item.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '')"
                                @click="closeDrawer()"
                                @mousedown.prevent
                                >{{ item.title.replace('amp;', '') }}</NuxtLink
                            >
                            <button
                                v-if="item.children"
                                class="header__dropdown-btn"
                                @click="toggleActive(index)"
                            >
                                <IconArrow />
                            </button>
                            <ul v-if="item.children" class="header__dropdown">
                                <li v-for="(child, cIndex) in item.children" :key="cIndex">
                                    <NuxtLink
                                        :to="
                                            $route.path ==
                                            child.url
                                                .replace(/^.*\/\/[^\/]+/, '')
                                                .replace(/\/$/, '')
                                                ? undefined
                                                : child.url
                                                      .replace(/^.*\/\/[^\/]+/, '')
                                                      .replace(/\/$/, '')
                                        "
                                        @click="closeDrawer()"
                                        >{{ child.title.replace('amp;', '') }}</NuxtLink
                                    >
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <div class="header__secondary-mobile">
                    <SuperDropdown
                        class="header__ribbon--mobile"
                        :heading="'Colby Arts'"
                        :items="utility"
                    />
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import { useInterfaceStore } from '~/store/interface';
    import isOpen from '../helpers/isOpen';

    // --- Props ---
    const props = defineProps({
        utility: {
            type: Array,
            required: false,
        },
        primary: {
            type: Array,
            required: false,
        },
        campusEvent: {
            type: Array,
            required: false,
        },
        downtownEvent: {
            type: Array,
            required: false,
        },
        globalOptions: {
            type: Object,
            required: false,
        },
    });

    // --- Setup & State ---
    const iface = useInterfaceStore();
    const route = useRoute();

    watch(
        () => iface.debouncedSearchText,
        (newSearchTerm) => {
            // This code only runs 2 seconds AFTER the user stops typing
            if (newSearchTerm) {
                navigateTo({
                    path: '/search',
                    query: {
                        page: 1,
                        search: newSearchTerm,
                    },
                });
            }
        }
    );

    // Template Refs
    const header = ref(null);
    const searchInput = ref(null);

    // Reactive State
    const active = ref(undefined);
    const drawerActive = ref(false);
    const searchActive = ref(false);
    const input = ref('');

    // --- Computed Logic (Opening Hours) ---

    // Calculate Campus Status
    const campusStatus = computed(() => {
        // Guard clause if globalOptions isn't loaded yet
        if (!props.globalOptions) return { isOpen: false, until: '' };

        let status = isOpen(props.globalOptions.campus_hours, 'campus');
        let isOpenBool = status.isOpen;
        let untilStr = status.until;

        if (props.globalOptions.campus_closed_override) {
            isOpenBool = false;
            untilStr = props.globalOptions.campus_closed_override_message;
        }

        return { isOpen: isOpenBool, until: untilStr };
    });

    // Calculate Downtown Status
    const downtownStatus = computed(() => {
        if (!props.globalOptions) return { isOpen: false, until: '' };

        let status = isOpen(props.globalOptions.downtown_hours, 'downtown');
        let isOpenBool = status.isOpen;
        let untilStr = status.until;

        if (props.globalOptions.downtown_closed_override) {
            isOpenBool = false;
            untilStr = props.globalOptions.downtown_closed_override_message;
        }

        return { isOpen: isOpenBool, until: untilStr };
    });

    // Dropdown Classes
    const dropdownClassCampus = computed(() => (campusStatus.value.isOpen ? 'open' : 'closed'));
    const dropdownClassDowntown = computed(() => (downtownStatus.value.isOpen ? 'open' : 'closed'));

    // Dropdown Headings
    const dropdownHeadingCampus = computed(() => {
        const status = `until ${campusStatus.value.until}`;
        return `Campus Today — ${status}`;
    });

    const dropdownHeadingDowntown = computed(() => {
        const status = `until ${downtownStatus.value.until}`;
        return `Downtown Today — ${status}`;
    });

    // --- Methods ---

    const closeDrawer = () => {
        if (process.client) window.scrollTo(0, 0);
        drawerActive.value = false;
        active.value = undefined;
        if (process.client) document.body.style.overflow = '';
    };

    const toggleSearch = () => {
        searchActive.value = !searchActive.value;
        iface.setSearch(!searchActive.value);
        closeDrawer();
    };

    const toggleDrawer = () => {
        if (process.client) window.scrollTo(0, 0);
        drawerActive.value = !drawerActive.value;
        active.value = undefined;

        if (process.client) {
            if (drawerActive.value === true) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }

        iface.setDrawer(drawerActive.value);
    };

    const toggleActive = (i) => {
        if (active.value === i) {
            active.value = undefined;
        } else {
            active.value = i;
        }
    };

    const keyboardRight = (e) => {
        // Note: e.srcElement is non-standard, but kept for compatibility with original logic.
        // e.target is preferred.
        const target = e.target || e.srcElement;
        if (target.parentNode.nextSibling) {
            target.parentNode.nextSibling.getElementsByTagName('a')[0].focus();
        } else {
            // Logic commented out in original, keeping it commented
            // header.value.getElementsByClassName('header__search-btn')[0].focus();
        }
    };

    const keyboardLeft = (e) => {
        const target = e.target || e.srcElement;
        if (target.parentNode.previousSibling) {
            target.parentNode.previousSibling.getElementsByTagName('a')[0].focus();
        }
    };
</script>

<style lang="scss">
    @use 'sass:map';

    .header {
        position: relative;
        z-index: 100;
        margin-bottom: 60px;

        @include breakpoint(large) {
            margin-bottom: 7.872vh;
        }

        &__top,
        &__utility,
        &__primary,
        &__secondary-mobile {
            grid-column: span 12 / span 12;
        }

        &__top {
            position: relative;
            z-index: 3;
            display: flex;
            justify-content: flex-end;
        }

        &__top + &__utility {
            @include breakpoint(large) {
                margin-top: 2.214vh;
            }
        }

        &__utility {
            position: relative;
            z-index: 2;

            @include breakpoint(large) {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .search .search-btn {
                @include breakpoint(medium) {
                    height: 3.861vw;
                }
            }
        }

        &__ribbon {
            &--desktop {
                visibility: hidden;

                @include breakpoint(large) {
                    visibility: visible;
                }
            }

            &--mobile {
                display: block;

                @include breakpoint(large) {
                    display: none;
                }

                .super-dropdown__btn {
                    justify-content: space-between;
                }

                .super-dropdown__drawer {
                    position: static;
                    transform: none;
                    padding: 0 22px 24px 22px;
                }
            }
        }

        &__logo {
            &:hover svg {
                fill: map.get($layout-colors, ambiant);

                .dark-mode & {
                    fill: map.get($layout-dm-colors, ambiant);
                }
            }

            svg {
                width: 77px;
                fill: map.get($layout-colors, color);

                .dark-mode & {
                    fill: map.get($layout-dm-colors, color);
                }

                @include breakpoint(large) {
                    width: 7.361vw;
                }
            }
        }

        &__logo + &__activity {
            margin-top: 40px;

            @include breakpoint(large) {
                margin-top: 0;
            }
        }

        &__activity {
            position: relative;

            @include breakpoint(medium) {
                display: flex;
                justify-content: flex-end;
            }

            .super-dropdown {
                @include breakpoint(medium) {
                    flex-shrink: 0;
                }

                &:nth-of-type(2) {
                    z-index: 2;
                }

                .header--search-active & {
                    @include breakpoint(medium) {
                        opacity: 0;
                        visibility: hidden;
                    }
                }
            }

            .super-dropdown + .super-dropdown {
                margin-top: 16px;

                @include breakpoint(medium) {
                    margin-top: 0;
                    margin-left: 2.778vw;
                }
            }

            .search {
                width: 100%;
                height: 0;
                opacity: 0;
                visibility: hidden;

                @include breakpoint(medium) {
                    z-index: 2;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

                .header--search-active & {
                    opacity: 1;
                    visibility: visible;
                    height: auto;
                }
            }

            .search + .super-dropdown {
                .header--search-active & {
                    margin-top: 64px;

                    @include breakpoint(medium) {
                        margin-top: 0;
                    }
                }
            }
        }

        &__btn-group {
            display: flex;
            align-items: center;
            position: absolute;
            top: 32px;
            right: 0;

            @include breakpoint(large) {
                position: static;
            }
        }

        &__hamburger {
            display: flex;
            align-items: center;
            width: 54px;
            height: 54px;
            padding: 0;
            margin-left: 24px;
            appearance: none;
            border: 0;
            background-color: transparent;

            @include breakpoint(large) {
                display: none;
            }

            &[aria-expanded='true'] {
                background-color: map.get($layout-colors, ambiant);

                span {
                    background-color: transparent !important;

                    &::before {
                        top: 0;
                        transform: rotate(45deg);
                    }

                    &::after {
                        top: 0;
                        width: 100%;
                        transform: rotate(-45deg);
                    }

                    &::before,
                    &::after {
                        background-color: map.get($layout-colors, accent);
                    }
                }
            }

            span {
                position: relative;
                display: block;
                width: 54px;
                height: 4px;
                background-color: transparent;
                transition: $transition-default;

                .header--active & {
                    background-color: $white;
                }

                &::before,
                &::after {
                    position: absolute;
                    left: 0;
                    border-radius: inherit;
                    width: 100%;
                    height: 100%;
                    background-color: map.get($layout-colors, color);
                    transform-origin: center;
                    transition: inherit;
                    content: '';

                    .dark-mode & {
                        background-color: map.get($layout-dm-colors, color);
                    }
                }

                &::before {
                    top: -10px;
                }

                &::after {
                    top: 10px;
                }
            }
        }

        &__drawer {
            position: fixed;
            z-index: 5;
            top: 188px;
            left: 0;
            width: 100vw;
            height: calc(100vh - 188px);
            padding-bottom: 20px;
            background-color: map.get($layout-colors, background);
            transform: translateY(120%);
            transition: $transition-default;
            overflow-y: scroll;
            visibility: hidden;

            .dark-mode & {
                background-color: map.get($layout-dm-colors, background);
            }

            @include breakpoint(large) {
                position: static;
                width: auto;
                height: auto;
                margin-top: 24px;
                background-color: transparent;
                transform: none;
                overflow-y: visible;
                visibility: visible;
            }

            @include breakpoint(large) {
                margin-top: 5vh;
            }

            .header--drawer-active & {
                transform: translateY(0);
                visibility: visible;
            }
        }

        &__primary {
            > ul {
                // @include breakpoint(large) {
                //   display: flex;
                //   justify-content: space-between;
                //   border-bottom: 4px solid map.get($layout-colors, color);

                //   .dark-mode & {
                //     border-bottom: 4px solid map.get($layout-dm-colors, color);
                //   }
                // }

                @include breakpoint(large) {
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 0.492vh solid map.get($layout-colors, color);

                    .dark-mode & {
                        border-bottom: 0.492vh solid map.get($layout-dm-colors, color);
                    }
                }
            }

            > ul > li {
                @include heading-style-3;

                position: relative;

                @include breakpoint(large) {
                    font-size: 1.944vw; // 28px / 1440px
                    padding: 1.476vh 0 1.876vh;
                    margin-bottom: -0.4vh;
                }

                > a {
                    display: inline-block;
                    text-decoration: none;
                    color: map.get($layout-colors, color);
                    border-bottom: 4px solid map.get($layout-colors, color);

                    .dark-mode & {
                        color: map.get($layout-dm-colors, color);
                        border-bottom: 4px solid map.get($layout-dm-colors, color);
                    }

                    @include breakpoint(large) {
                        border-bottom: none;

                        .dark-mode & {
                            border-bottom: none;
                        }
                    }
                }

                &.active > a {
                    color: map.get($layout-colors, ambiant);

                    .dark-mode & {
                        color: map.get($layout-dm-colors, ambiant);
                    }
                }

                + li {
                    margin-top: 30px;

                    @include breakpoint(large) {
                        margin-top: 0;
                    }
                }
            }

            > ul > li:hover,
            > ul > li:focus-within {
                > a {
                    @include breakpoint(large) {
                        color: map.get($layout-colors, ambiant);

                        .dark-mode & {
                            color: map.get($layout-dm-colors, ambiant);
                        }
                    }
                }
            }
        }

        &__secondary-mobile {
            display: block;
            margin-top: 60px;

            @include breakpoint(large) {
                display: none;
            }

            .super-dropdown__btn {
                display: flex;
                width: 100%;
                justify-content: space-between;
            }

            .super-dropdown__ul {
                text-align: left;
            }
        }

        &__dropdown-btn {
            position: absolute;
            top: 0;
            right: 0;
            width: 28px;
            padding: 0;
            background-color: transparent;
            border: 0;
            appearance: none;
            transition: $transition-default;

            @include breakpoint(large) {
                display: none;
            }

            li.active & {
                transform: rotate(180deg);
            }

            svg {
                fill: map.get($layout-colors, color);

                .dark-mode & {
                    fill: map.get($layout-dm-colors, color);
                }
            }
        }

        &__dropdown {
            height: 0;
            padding: 0 22px;
            opacity: 0;
            visibility: hidden;
            background-color: map.get($layout-colors, ambiant);

            .dark-mode & {
                background-color: map.get($layout-dm-colors, ambiant);
            }

            @include breakpoint(large) {
                position: absolute;
                bottom: 0;
                left: 0;
                height: auto;
                padding: 1.23vh 1.389vw;
                transform: translateY(100%);
            }

            li.active & {
                height: auto;
                padding: 10px 22px;
                opacity: 1;
                visibility: visible;
            }

            li:last-child &,
            li:nth-last-child(2) & {
                @include breakpoint(large) {
                    right: 0;
                    left: auto;
                }
            }

            li:hover &,
            li:focus-within & {
                @include breakpoint(large) {
                    opacity: 1;
                    visibility: visible;
                }
            }

            li {
                @include paragraph-style-3;

                font-size: rem-calc(20px);

                @include breakpoint(large) {
                    font-size: 1.389vw; // 20px / 1440px
                }

                a {
                    color: map.get($layout-colors, accent);
                    text-decoration: none;

                    @include breakpoint(large) {
                        white-space: nowrap;
                    }

                    &:hover {
                        color: map.get($layout-colors, hover);

                        .dark-mode & {
                            color: map.get($layout-dm-colors, hover);
                        }
                    }
                }
            }

            li + li {
                margin-top: 1vh;
            }
        }
    }
</style>
