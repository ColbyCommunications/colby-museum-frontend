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

    <AccordionSection :items="[{ heading: 'Stack trace', context: error.stack }]"/>

    <BigArrowBtn :url="'/'"
                 :reverse="true"
                 title="Go to Museum Home" />
  </div>
</template>

<style lang="scss">
  @use "sass:map";

  .hidden {
    display: none;
  }

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

    button.trace-toggle {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 54px;
      height: 54px;
      padding: 0;
      background-color: map.get($layout-colors, accent);
      border: 5px solid map.get($layout-colors, color);
      border-radius: 100%;
      cursor: pointer;

      .dark-mode & {
        background-color: map.get($layout-dm-colors, accent);
        border: 5px solid map.get($layout-dm-colors, color);
      }

      @include breakpoint(medium) {
        width: 5.139vw; // 74 / 1440
        height: 5.139vw; // 74 / 1440
        border: 0.486vw solid map.get($layout-colors, color);

        .dark-mode & {
          border: 0.486vw solid map.get($layout-dm-colors, color);
        }
      }

      &:hover {
        background-color: map.get($layout-colors, ambiant);
      }
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
    useSeoMeta({
      title: 'Not Found | Colby College Museum of Art'
    })

    return { trace: ref(false) }
  },
  methods: {
    toggleTrace() {
      this.trace = !this.trace
    }
  }
};
</script>