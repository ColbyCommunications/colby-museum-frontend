<template>
  <main id="main" class="layout">
    <slot />
  </main>
</template>

<style lang="scss">
.page {
  @include breakpoint(large) {
    min-height: 160vh;
  }

  .grid {
    > h2,
    > h3,
    > p,
    > ul,
    > .video {
      grid-column: span 12 / span 12;

      @include breakpoint(medium) {
        grid-column: span 10 / span 10;
        grid-column-start: 2;
      }
    }
  }
}
</style>