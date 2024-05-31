<template>
  <svg class="icon-magnifying-glass" style="enable-background:new 0 0 67.3 67.3" viewBox="0 0 67.3 67.3">
    <path d="M50.9 50.9c11.2-11.2 11.2-29.3 0-40.5s-29.3-11.2-40.5 0-11.2 29.3 0 40.5 29.3 11.2 40.5 0zM52.1 52.1l13.8 13.8" />
  </svg>
</template>

<style lang="scss">
@use "sass:map";

.icon-magnifying-glass {
  fill: none;
  stroke: map.get($layout-colors, color);
  stroke-width: 6;
  stroke-miterlimit: 10;
  overflow: visible;

  .dark-mode & {
    stroke: map.get($layout-dm-colors, color);
  }

  @include breakpoint(large) {
    stroke-width: 4;
  }
}
</style>