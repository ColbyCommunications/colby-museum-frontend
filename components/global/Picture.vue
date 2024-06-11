<template>
  <picture>
    <source
      media="(min-width:768px)"
      :srcset="sizes.desktop ? sizes.desktop.source_url : sizes.full.source_url"
    >
    <img
      :class="classes"
      :src="sizes.mobile.source_url"
      :alt="alt"
      :loading="loading"
    />
  </picture>
</template>

<script>
export default {
  props: {
    classes: {
      type: String,
      required: false,
    },
    alt: {
      type: String,
      required: false,
    },
    sizes: {
      type: Object,
      required: false,
    },
    loading: {
      required: false,
      default: 'lazy'
    }
  }
}
</script>