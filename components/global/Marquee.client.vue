<template>
  <div
    class="marquee"
    tabindex="0"
  >
    <div
      class="marquee__rail-wrap"
      ref="marqueeWrap"
      v-resize:debounce="calculateWidth"
    >
      <div
        class="marquee__rail marquee__rail-1"
        ref="marqueeOriginal"
      >
        <span
          v-for="(item, index) in newItems"
          :key="`marquee_${index}`"
          v-text="item.heading"
        />
      </div>
      <div class="marquee__rail marquee__rail-2">
        <span
          v-for="(item, index) in newItems"
          :key="`marquee2_${index}`"
          v-text="item.heading"
        />
      </div>
      <div class="marquee__rail marquee__rail-3">
        <span
          v-for="(item, index) in newItems"
          :key="`marquee3_${index}`"
          v-text="item.heading"
        />
      </div>
      <div class="marquee__rail marquee__rail-4">
        <span
          v-for="(item, index) in newItems"
          :key="`marquee4_${index}`"
          v-text="item.heading"
        />
      </div>
    </div>
  </div>
</template>

<script>
// This component file name has been amended as a client.vue
// due to vue-resize-directive not playing nice with nuxt
// inherit SSR. Read up on the problem here: https://harlanzw.com/blog/nuxt3-hydration-node-mismatch

import gsap from 'gsap';
import resize from 'vue-resize-directive';

export default {
  directives: {
    resize,
  },
  data() {
    return {
      newItems: [],
      width: undefined,
      marqueeAnimation: undefined,
    };
  },
  props: {
    items: {
      required: true,
    },
    blockData: {
      type: Object,
      required: false,
    }
  },
  created() {
    const component = this;

    if (typeof this.items === 'number') {
      component.newItems = [...Array(this.items)].map((el, i) => ({
        heading: component.blockData[`items_${i}_heading`],
      }));

      // console.log(component.newItems);
    }
  },
  mounted() {
    setTimeout(() => {
      this.width = this.$refs.marqueeOriginal.offsetWidth;
      this.animate();
    }, 500);
  },
  methods: {
    calculateWidth() {
      this.marqueeAnimation.kill();
      this.width = this.$refs.marqueeOriginal.offsetWidth;
      this.animate();
    },
    animate() {
      this.marqueeAnimation = gsap.fromTo(this.$refs.marqueeWrap, 20,
        {
          x: 0,
          ease: 'none',
        },
        {
          x: -this.width,
          repeat: -1,
          ease: 'none',
        });
    },
  },
};
</script>

<style lang="scss">
@use "sass:map";

.marquee {
  font-family: $font-primary;
  font-size: 60px;
  font-weight: 200;
  font-style: normal;
  line-height: 110%;
  letter-spacing: -0.8px;
  text-transform: uppercase;
  color: map.get($layout-colors, accent);
  width: 100%;
  margin: 100px 0;
  overflow: hidden;
  overflow-x: scroll;
  white-space: nowrap;
  scrollbar-width: none;
  background-color: map.get($layout-colors, ambiant);

  @include breakpoint(large) {
    margin: 14.760vw 0;
    font-size: 6.250vw;
    letter-spacing: -0.056vw;
  }

  &::-webkit-scrollbar {
    height: 0 !important;
    width: 0 !important;
  }
}

.marquee__rail {
  display: inline;

  span {
    display: inline-block;

    &::before {
      display: inline-block;
      padding: 0 4vw;
      color: map.get($layout-colors, hover);
      content: '/';
    }
  }
}
</style>
