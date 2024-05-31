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
