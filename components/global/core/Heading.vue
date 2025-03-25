<template>
  <div
    class="core-heading grid"
    :class="`heading-style-${attrs.level}`"
  >
    <component
      :is="`h${attrs.level}`"
      v-text="attrs.content"
    />
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
.core-heading {
  + div {
    margin-top: 12vh;
  }
}
</style>
