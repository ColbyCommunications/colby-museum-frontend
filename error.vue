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
    padding: 0 3.75em;

    h2 {
      font-size: 2.5rem;
    }

    p {
      font-size: 2rem;
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