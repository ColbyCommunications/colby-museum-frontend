<template>
  <svg class="icon-x" viewBox="0 0 51.9 51.1">
    <path d="m2.4 1.7 48.1 48M1.4 49.4l48-48" class="st0"/>
  </svg>
</template>

<style lang="scss">
@use "sass:map";

.icon-x {
  fill: none;
  stroke: map.get($layout-colors, color);
  stroke-width: 4;

  .dark-mode & {
    stroke: map.get($layout-dm-colors, color);
  }
}
</style>