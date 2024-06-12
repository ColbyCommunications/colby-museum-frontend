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
    > p {
      grid-column: span 12 / span 12;

      @include breakpoint(medium) {
        grid-column: span 8 / span 8;
        grid-column-start: 3;
      }
    }
  }
}
</style>