<template>
  <div
    class="big-arrow-btn-section"
    :class="`big-arrow-btn-section--align-${align}`"
  >
    <div class="big-arrow-btn-section__inner grid">
      <div class="big-arrow-btn-section__main">
        <BigArrowBtn
          v-bind="button"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default  {
  props: {
    button: {
      required: false,
    },
    align: {
      required: false,
      default: 'left',
    }
  }
}
</script>

<style lang="scss">
.big-arrow-btn-section {
  margin-top: 100px;

  @include breakpoint(medium) {
    margin-top: 10vh;
  }

  &--align-right {
    @include breakpoint(medium) {
      position: relative;
      transform: translateY(-100%);
      margin-top: 0;
      overflow: visible;
      pointer-events: none;
    }
  }

  &__main {
    grid-column: span 12 / span 12;

    .big-arrow-btn-section--align-right & {
      @include breakpoint(medium) {
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  a {
    pointer-events: all;
  }
}
</style>