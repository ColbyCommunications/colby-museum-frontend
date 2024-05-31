<template>
  <button class="search-btn">
    <span class="sr-only" v-text="'Input term to begin search automatically'" />
    <IconMagnifyingGlass />
    <IconX />
  </button>
</template>

<style lang="scss">
@use "sass:map";

.search-btn {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  background-color: transparent;
  border: 0;
  appearance: none;
  cursor: pointer;

  @include breakpoint(medium) {
    width: 4.861vw;
    height: 4.861vw;
  }

  &:hover {
    background-color: map.get($layout-colors, ambiant);

    .dark-mode & {
      background-color: map.get($layout-dm-colors, ambiant);
    }

    svg {
      stroke: map.get($layout-colors, accent);
    }
  }

  &.active {

    .icon-magnifying-glass {
      opacity: 0;
    }

    .icon-x {
      width: 80%;
      opacity: 1;
    }
  }

  &:disabled {
    pointer-events: none;
  }

  .icon-magnifying-glass {
    position: absolute;
    width: 90%;

    @include breakpoint(medium) {
      position: static;
    }
  }

  .icon-x {
    position: absolute;
    opacity: 0;
  }
}
</style>