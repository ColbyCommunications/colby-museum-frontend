<template>
  <div class="big-arrow-btn-section">
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
    }
  }
}
</script>

<style lang="scss">
.big-arrow-btn-section {
  margin-top: 100px;

  @include breakpoint(medium) {
    margin-top: 14.76vh;
  }

  &__main {
    grid-column: span 12 / span 12;
  }
}
</style>