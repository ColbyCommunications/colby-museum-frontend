<template>
  <header
    class="header"
    role="banner"
    ref="header"
    :class="[searchActive ? 'header--search-active' : '', drawerActive ? 'header--drawer-active' : '']"
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
        <NuxtLink
          class="header__logo"
          @click="closeDrawer()"
          :to="'/'"
        >
          <span class="sr-only" v-text="'Return to Homepage'" />
          <Logo />
        </NuxtLink>
        <div class="header__activity">
          <SearchInput
            ref="searchInput"
            :placeholder="'Search Colby Museum'"
            @debounced-input="recieveInput"
          />
          <SuperDropdown
            :class="[campusIsOpen ? 'open' : 'closed']"
            :size="'large'"
            :heading="'Campus Today'"
            :events="campusEvent"
          />
          <SuperDropdown
            :class="[downtownIsOpen ? 'open' : 'closed']"
            :size="'large'"
            :heading="'Downtown Today'"
            :events="downtownEvent"
          />
        </div>
        <div class="header__btn-group">
          <SearchBtn
            class="header__search-btn"
            :class="{'active': searchActive}"
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
              :class="{'active' : active == index}"
              @keyup.left="keyboardLeft($event)"
              @keyup.right="keyboardRight($event)"
            >
              <NuxtLink
                :to="item.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '')"
                @click="closeDrawer()"
                @mousedown="(event) => { event.preventDefault(); }"
              >{{ item.title.replace('amp;', '') }}</NuxtLink>
              <button
                v-if="item.children"
                class="header__dropdown-btn"
                @click="toggleActive(index)"
              >
                <IconArrow />
              </button>
              <ul v-if="item.children" class="header__dropdown">
                <li v-for="(child, index) in item.children">
                  <NuxtLink
                    :to="$route.path == child.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '') ? undefined : child.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '')"
                    @click="closeDrawer()"
                  >{{ child.title.replace('amp;', '') }}</NuxtLink>
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

<script>
import { useInterfaceStore } from "~/store/interface";
import isOpen from '../helpers/isOpen';

export default {
  data() {
    return {
      interface: undefined,
      active: undefined,
      drawerActive: false,
      searchActive: false,
      input: '',
      campusIsOpen: undefined,
      downtownIsOpen: undefined,
    };
  },
  created() {
    this.interface = useInterfaceStore();

    this.campusIsOpen = isOpen('10:00:00', '17:00:00', 'campus');
    this.downtownIsOpen = isOpen('11:00:00', '19:00:00', 'downtown');

    setInterval(() => {
      if (this.globalOptions) {
        if (this.globalOptions.campus_closed_override) {
          this.campusIsOpen = false;
        } else {
          this.campusIsOpen = isOpen('10:00:00', '17:00:00', 'campus');
        }

        if (this.globalOptions.downtown_closed_override) {
          this.downtownIsOpen = false;
        } else {
          this.downtownIsOpen = isOpen('11:00:00', '19:00:00', 'downtown');
        }
      }
    }, 60 * 1000);
  },
  props: {
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
      default: [
        {
          location: 'No event scheduled for today.',
          // time: new Date().getDay() == 0 ? '12:00 p.m.–5:00 p.m.' : '10:00 a.m.–5:00 p.m.',
          button: {
            title: "What's On",
            url: '/exhibitions-and-events/exhibitions',
          }
        }
      ]
    },
    downtownEvent: {
      type: Array,
      required: false,
      default: [
        {
          location: 'No event scheduled for today.',
          // time: '11:00 a.m.–7:00 p.m.',
          button: {
            title: "What's On",
            url: '/exhibitions-and-events/exhibitions',
          }
        }
      ]
    },
    globalOptions: {
      type: Object,
      required: false
    }
  },
  watch: {
    globalOptions: {
      deep: true,
      async handler() {
        if (this.globalOptions.campus_closed_override) {
          this.campusIsOpen = false;
        } else {
          this.campusIsOpen = isOpen('10:00:00', '17:00:00', 'campus');
        }

        if (this.globalOptions.downtown_closed_override) {
          this.downtownIsOpen = false;
        } else {
          this.downtownIsOpen = isOpen('11:00:00', '19:00:00', 'downtown');
        }
      }
    }
  },
  methods: {
    toggleSearch() {
      this.searchActive = !this.searchActive;
      this.closeDrawer();
    },
    toggleDrawer() {
      window.scrollTo(0, 0);
      this.drawerActive = !this.drawerActive;
      this.active = undefined;

      if (this.drawerActive == true) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      this.interface.setDrawer(this.drawerActive);
    },
    closeDrawer() {
      window.scrollTo(0, 0);
      this.drawerActive = false;
      this.active = undefined;
      document.body.style.overflow = '';
    },
    toggleActive(i) {
      if (this.active == i) {
        this.active = undefined;
      } else {
        this.active = i;
      }
    },
    recieveInput(input) {
      const component = this;
      const slug = this.$route.params.slug;

      component.input = input;

      navigateTo({
        path: '/search',
        query: {
          page: 1,
          search: component.input,
        }
      });
    },
    keyboardRight(e) {
      if (e.srcElement.parentNode.nextSibling) {
        e.srcElement.parentNode.nextSibling.getElementsByTagName('a')[0].focus();
      } else {
        // this.$refs.header.getElementsByClassName('header__search-btn')[0].focus();
      }
    },
    keyboardLeft(e) {
      if (e.srcElement.parentNode.previousSibling) {
        e.srcElement.parentNode.previousSibling.getElementsByTagName('a')[0].focus();
      }
    }
  }
}
</script>

<style lang="scss">
@use "sass:map";

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
      padding: 1.230vh 1.389vw;
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