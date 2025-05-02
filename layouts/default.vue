<template>
  <main id="main" class="layout">
    <slot />
  </main>
</template>

<style lang="scss">
.layout {
  min-height: 60vh;
}

.page {
  @include breakpoint(large) {
    min-height: 160vh;
  }

  &--objects {
    @include breakpoint(large) {
      min-height: 300vh;
    }
  }

  .has-text-align-center {
    text-align: center;
  }

  .grid {
    > h2,
    > h3,
    > p,
    > ul,
    > ol,
    > .video {
      grid-column: span 12 / span 12;

      @include breakpoint(medium) {
        grid-column: span 10 / span 10;
        grid-column-start: 2;
      }

      .full & {
        @include breakpoint(medium) {
          grid-column: span 12 / span 12;
        }
      }
    }

    &.full {
      > h2,
      > h3,
      > p,
      > ul,
      > ol,
      > .video {
        grid-column: span 12 / span 12;

        @include breakpoint(medium) {
          grid-column: span 12 / span 12;
        }
      }
    }
  }
}
</style>