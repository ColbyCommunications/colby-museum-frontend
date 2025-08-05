<template>
  <Header
    :primary="[]"
    :utility="[]"
    :campusEvent="[]"
    :downtownEvent="[]"
    :globalOptions="[]"
  />
  <div class="page page--default">
    <h2>{{ error?.statusCode }}</h2>
    <p>
      Oops! The page you’re looking for doesn’t exist.
    </p>
    <BigArrowBtn :url="'/'"
                 :reverse="true"
                 title="Go Back Home" />
  </div>
</template>

<style lang="scss">
  div.page.page--default {
    font-family: $font-primary;
    margin: 1em 3.75em;

    h2 {
      font-size: 2.5rem;
      margin: 0.5em 0.5em;
    }

    p {
      font-size: 2rem;
      margin: 0.5em 0.5em;
    }

    .big-arrow-btn {
      margin: 0.5em 0.5em;
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