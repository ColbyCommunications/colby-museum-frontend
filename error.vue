<template>
  <Header
    :primary="[]"
    :utility="[]"
    :campusEvent="[]"
    :downtownEvent="[]"
    :globalOptions="[]"
  />
  <div class="page page--default">
    <h1>Oops! {{ error?.message }}</h1>
    <h2>Error {{ error?.statusCode }}</h2>

    <p v-html="error.stack" />

    <BigArrowBtn :url="'/'"
                 :reverse="true"
                 title="Go Back Home" />
  </div>
</template>

<style lang="scss">
  div.page.page--default {
    font-family: $font-primary;
    margin: 1rem 3.75rem;

    h1 {
      font-size: 3rem;
      margin: 0.5rem 0.5rem;
    }

    h2 {
      font-size: 2.5rem;
      margin: 1rem 0.5rem;
    }

    p, span {
      font-size: 2rem;
      margin: 0.5rem 0.5rem;
    }

    .big-arrow-btn {
      margin: 0.5rem 0.5rem;
    }
  }
</style>

<script>
export default {
  props: {
    error: {
      type: Object,
    }
  },
  setup(props) {
    return { ...props }
  },
};
</script>