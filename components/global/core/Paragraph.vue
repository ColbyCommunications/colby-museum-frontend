<template>
  <div class="core-paragraph grid paragraph-style-2">
    <p v-html="attrs.content.replace(`${interface.backend}`, '/').replace(/\/$/, '')" />
  </div>
</template>

<script>
import { useInterfaceStore } from "~/store/interface";

export default {
  props: {
    attrs: {
      type: Object,
      required: true,
    }
  },
  async created() {
    this.interface = useInterfaceStore();
  },
}
</script>

<style lang="scss">
.core-paragraph {

  + div {
    margin-top: 100px;

    @include breakpoint(medium) {
      margin-top: 10vh;
    }
  }

  + .heading-style-3 {
    @include breakpoint(medium) {
      margin-top: 2.25vh;
    }
  }

  + .grid--video {
    @include breakpoint(medium) {
      margin-top: 5.9vh;
    }
  }
}
</style>