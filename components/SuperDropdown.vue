<template>
  <div
    class="super-dropdown"
    :class="[active ? 'super-dropdown--active' : '', `super-dropdown--${size}`, sort ? 'super-dropdown--sort' : '']"
    @mouseleave="active = false"
  >
    <button
      class="super-dropdown__btn"
      @click="toggleActive()"
    >
      <span class="super-dropdown__heading">
        {{ heading }}
      </span>
      <IconArrow class="super-dropdown__arrow" />
    </button>
    <div class="super-dropdown__drawer">
      <div
        v-if="event"
        class="super-dropdown__event"
      >
        <div class="super-dropdown__event-heading" v-html="event.heading" />
        <div class="super-dropdown__event-paragraph paragraph-style-3" v-text="event.location" />
        <div class="super-dropdown__event-bottom">
          <span>
            <div v-if="event.time" class="super-dropdown__event-time paragraph-style-3" v-text="event.time"/>
            <ActivityTag />
          </span>
          <Btn
            v-if="event.button"
            :size="'small'"
            :title="event.button.title"
            :url="event.button.url"
            @click="toggleActive()"
          />
        </div>
      </div>
      <ul
        class="super-dropdown__ul"
        v-if="items"
      >
        <li v-for="(item, index) in items">
          <NuxtLink :to="item.url" target="_blank">{{ item.title }}</NuxtLink>
        </li>
      </ul>
      <slot v-if="sort" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: false,
    };
  },
  props: {
    size: {
      type: String,
      required: false,
      default: 'medium',
    },
    heading: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: false,
    },
    event: {
      type: Object,
      required: false,
    },
    sort: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  methods: {
    toggleActive() {
      this.active = !this.active;
    }
  }
}
</script>

<style lang="scss">
@use "sass:map";

.super-dropdown {
  position: relative;
  z-index: 1;

  &--active {
    width: 100%;
    z-index: 11;

    @include breakpoint(medium) {
      width: auto;
    }
  }

  &--large {
    flex-grow: 1;

    @include breakpoint(large) {
      width: 27.222vw;

      .filter__drawer & {
        width: auto;
      }
    }
  }

  &--sort {
    @include breakpoint(medium) {
      width: 100%;
    }
  }

  &__btn {
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px 22px;
    background-color: map.get($layout-colors, color);
    border: 0;
    appearance: none;
    cursor: pointer;

    .dark-mode & {
      background-color: map.get($layout-dm-colors, color);
    }

    @include breakpoint(medium) {
      padding: 1vh 1.528vw;
    }

    .super-dropdown--large & {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 15px 16px;
      background-color: map.get($layout-colors, accent);
      border: 4px solid map.get($layout-colors, color);

      .dark-mode & {
        background-color: map.get($layout-dm-colors, accent);
        border: 4px solid map.get($layout-dm-colors, color);
      }

      @include breakpoint(large) {
        padding: 2.214vh 1.667vw;
        border: 0.278vw solid map.get($layout-colors, color);

        .dark-mode & {
          border: 0.278vw solid map.get($layout-dm-colors, color);
        }
      }
    }

    .super-dropdown:hover & {
      background-color: map.get($layout-colors, ambiant);

      .dark-mode & {
        background-color: map.get($layout-dm-colors, ambiant);
      }
    }

    .super-dropdown--active & {
      width: 100%;

      @include breakpoint(medium) {
        width: 300px;
      }

      @include breakpoint(large) {
        width: 29.361vw;
      }
    }

    .super-dropdown--large.super-dropdown--active & {
      width: 100%;
    }
  }

  &__heading {
    @include paragraph-style-3;

    display: inline-flex;
    align-items: center;
    font-size: rem-calc(20px);
    font-weight: 700;
    color: map.get($layout-colors, accent);
    white-space: nowrap;

    .dark-mode & {
      color: map.get($layout-dm-colors, accent);
    }

    .super-dropdown:hover & {
      .dark-mode & {
        color: map.get($layout-colors, accent);
      }
    }

    .super-dropdown--large & {
      color: map.get($layout-colors, color);

      .dark-mode & {
        color: map.get($layout-dm-colors, color);
      }

      &::before {
        @extend .activity-signal;

        @include breakpoint(medium) {
          font-size: 1.389vw; // 20px / 1440px
        }

        .filter__drawer & {
          display: none;
        }
      }
    }

    .super-dropdown--large.super-dropdown:hover & {
      color: map.get($layout-colors, accent);
    }

    .super-dropdown--sort & {
      &::before {
        display: none;
      }
    }

    .closed & {
      &::before {
        background-color: map.get($signal-colors, closed);
      }
    }

    .filter__drawer & {
      text-transform: capitalize;
    }
  }

  &__arrow {
    width: 28px;
    margin-left: 6px;
    fill: map.get($layout-colors, accent);
    transition: transform 0.2s $ease-default;

    @include breakpoint(medium) {
      width: 1.875vw;
      margin-left: 0.417vw;
    }

    .dark-mode & {
      fill: map.get($layout-dm-colors, accent);
    }

    .super-dropdown:hover & {
      fill: map.get($layout-colors, hover);
    }

    .super-dropdown--active & {
      transform: rotate(180deg);
    }

    .super-dropdown--large & {
      fill: map.get($layout-colors, color);

      .dark-mode & {
        fill: map.get($layout-dm-colors, color); 
      }
    }

    .super-dropdown--large.super-dropdown:hover & {
      fill: map.get($layout-colors, hover);
    }
  }

  &__drawer {
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 30px 24px 30px;
    background-color: map.get($layout-colors, color);
    transform: translateY(calc(100% - 0.5px));
    opacity: 0;
    visibility: hidden;

    .dark-mode & {
      background-color: map.get($layout-dm-colors, color);
    }

    @include breakpoint(large) {
      padding: 0 3.690vh 1.667vw 3.690vh;
    }

    .super-dropdown--active & {
      opacity: 1;
      visibility: visible;
    }

    .super-dropdown--large & {
      padding: 24px 16px;
      background-color: map.get($layout-colors, accent);
      border: 4px solid map.get($layout-colors, color);
      border-top: 0;

      .dark-mode & {
        background-color: map.get($layout-dm-colors, accent);
        border: 4px solid map.get($layout-dm-colors, color);
      }

      @include breakpoint(large) {
        padding: 1.667vw 3.690vh;
        border: 0.278vw solid map.get($layout-colors, color);
        border-top: 0;

        .dark-mode & {
          border: 0.278vw solid map.get($layout-dm-colors, color);
          border-top: 0;
        }
      }
    }

    .super-dropdown:hover & {
      background-color: map.get($layout-colors, ambiant);

      .dark-mode & {
        background-color: map.get($layout-dm-colors, ambiant);
      }
    }
  }

  &__event {
    color: map.get($layout-colors, color);

    .dark-mode & {
      color: map.get($layout-dm-colors, color);
    }

    .super-dropdown--large.super-dropdown:hover & {
      color: map.get($layout-colors, accent);
    }
  }

  &__event-heading {
    @extend .paragraph-style-2;

    font-weight: 700;
    color: inherit;
  }

  &__event-paragraph {
    text-transform: capitalize;
  }

  &__event-bottom {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 14px;

    @include breakpoint(large) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.968vh;
    }

    span {
      display: flex;
      align-items: center;
    }

    span + .btn {
      margin-top: 14px;

      @include breakpoint(large) {
        margin-top: 0;
      }
    }

    .btn:hover {
      color: map.get($layout-colors, color);
      background-color: map.get($layout-colors, hover);

      .dark-mode & {
        color: map.get($layout-colors, color);
        background-color: map.get($layout-colors, hover);
      }
    }
  }

  &__event-time + .activity-tag {
    margin-left: 8px;
   
    @include breakpoint(large) {
      margin-left: 0.556vw;
    }
  }

  &__ul {
    @extend .list-style-3;

    text-align: right;

    a {
      text-decoration: none;
      color: map.get($layout-colors, accent);

      .dark-mode & {
        color: map.get($layout-dm-colors, accent);
      }

      .super-dropdown:hover & {
        .dark-mode & {
          color: map.get($layout-colors, accent);
        }
      }

      &:hover {
        color: map.get($layout-colors, hover);

        .dark-mode & {
          color: map.get($layout-dm-colors, hover);
        }

        .super-dropdown:hover & {
          .dark-mode & {
            color: map.get($layout-colors, hover);
          }
        }
      }
    }
  }

  &__event-time.paragraph-style-3 {
    @include breakpoint(large) {
      font-size: 1.025vw; // OVERRIDE required because we're having challenging spacing with new time format
    }
  }
}
</style>