<template>
  <div class="core-list grid paragraph-style-2">
    <!-- <p v-html="attrs.content" /> -->
     {{ innerHTML }}
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

<style>
.core-list {
  ul li {
    list-style-type: disc;
  }

  li {
    margin-left: 1.2vw;
  }
}
</style>