<template>
  <div class="core-list grid paragraph-style-2"
        v-html="innerHTML">
  </div>
</template>

<script>
export default {
  props: {
    attrs: {
      type: Object,
      required: true,
    },
    innerHTML: {
      type: String,
      required: false,
    }
  }
}
</script>

<style>
.core-list {
  ul li {
    list-style-type: disc;
  }

  ol li {
    list-style-type: decimal;
  }

  li {
    margin-left: 1.2vw;
  }
}
</style>