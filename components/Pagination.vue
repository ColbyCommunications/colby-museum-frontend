<template>
  <div class="pagination">
    <ul>
      <li v-for="index in totalPages"></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    totalPages: {
      type: Number,
      required: true,
    }
  }
}
</script>