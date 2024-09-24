<template>
  <div class="search">
    <SearchBtn disabled />
    <input
      class="input search__input"
      :placeholder="placeholder"
      v-model="input"
      v-on:input="debounceInput"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';

export default {
  data() {
    return {
      debounce: debounce,
      input: '',
      debouncedInput: '',
    }
  },
  props: {
    placeholder: {
      type: String,
      required: false,
      default: 'Search Colby Museum',
    }
  },
  methods: {
    debounceInput: debounce(function (event) { // event is the object parameter given to 'yourCoolFunction' if any
      this.debouncedInput = this.input;
      this.$emit('debounced-input', this.debouncedInput);
    }, 2000),
  }
}
</script>

<style lang="scss">
@use "sass:map";

.search {
  position: relative;
  display: flex;
  align-items: center;

  &:focus-within {
    .icon-magnifying-glass {
      stroke: map.get($layout-colors, accent);

      .dark-mode & {
        stroke: map.get($layout-dm-colors, accent);
      }

      @include breakpoint(medium) {
        stroke: map.get($layout-colors, color);

        .dark-mode & {
          stroke: map.get($layout-dm-colors, color);
        }
      }
    }
  }

  .search-btn {
    position: absolute;
    top: 17.5px;
    left: 16px;
    width: 24px;
    height: 24px;

    @include breakpoint(medium) {
      position: static;
      width: 6.861vw;
      height: 6.861vw;
    }
  }

  .icon-magnifying-glass {
    stroke-width: 10;

    @include breakpoint(medium) {
      stroke-width: 6;
    }

    @include breakpoint(large) {
      stroke-width: 4;
    }
  }

  .search-btn + &__input {
    @include breakpoint(medium) {
      margin-left: 1.667vw;
    }
  }

  &__input.input {
    padding: 16px 16px 16px 48px;

    @include breakpoint(medium) {
      padding: 15px 16px;
    }

    @include breakpoint(large) {
      padding: 2.214vh 1.667vw;
    }
  }
}
</style>