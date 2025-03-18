<template>
  <div class="core-paragraph grid paragraph-style-2">
    <p v-html="attrs.content" />
  </div>
</template>

<script>
export default {
  props: {
    attrs: {
      type: Object,
      required: true,
    }
  }
}
</script>

<style lang="scss">
.core-paragraph {

  + div {
    margin-top: 100px;

    @include breakpoint(medium) {
      margin-top: 11vh;
    }
  }
}
</style>