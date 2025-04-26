<template>
  <div
    class="ordered-list-section"
    ref="orderedListSection"
  >
    <div class="ordered-list-section__inner grid">
      <div class="ordered-list-section__main">
        <Context
          v-if="heading"
          :heading="heading"
          :size="'large'"
        />
        <ol>
          <li
            v-for="(item, index) in newItems"
          >
            <div
              class="vertical-curtain"
            />
            <span v-html="item.text.replaceAll(`${this.interface.backend}`, '/').replace(/\/$/, '')" />
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap';

import { useInterfaceStore } from "~/store/interface";

export default {
  data() {
    return {
      newItems: [],
    };
  },
  props: {
    heading: {
      required: false,
    },
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
    this.interface = useInterfaceStore();

    if (typeof component.items === 'number') {
      component.newItems = [...Array(this.items)].map((el, i) => ({
        text: component.blockData[`items_${i}_text`],
      }));
    }
  },
  mounted() {
    this.animate();
  },
  methods: {
    animate() {
      setTimeout(() => {
        let curtains = this.$refs.orderedListSection.querySelectorAll('.vertical-curtain');

        if (curtains) {
          gsap.fromTo(curtains,
          {
            top: 0,
            bottom: 'auto',
          },
          {
            height: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "expo.out",
          });
        }
      })
    }
  }
}
</script>

<style lang="scss">
@use "sass:map";

.ordered-list-section {
  &__main {
    grid-column: span 12 / span 12;

    @include breakpoint(medium) {
      grid-column: span 8 / span 8;
      grid-column-start: 3;
    }
  }

  .context {
    margin-bottom: 64px;

    @include breakpoint(large) {
      margin-bottom: 7.872vh;
    }
  }

  ol {
    counter-reset: olli 0;
  }

  li {
    @include paragraph-style-1;

    position: relative;
    display: flex;
    counter-increment: olli 0;

    &::before {
      @include subheading-style-2;
      @extend .border-global--all;

      position: relative;
      display: table;
      flex-shrink: 0;
      width: 80px;
      padding: 1px 0;
      margin-right: 24px;
      counter-increment: olli;
      content: counter(olli, decimal-leading-zero);
      font-weight: 700;
      border-radius: 100px;
      text-align: center;

      @include breakpoint(large) {
        width: 6.944vw;
        padding: 0.2vw 0;
        margin-right: 2.222vw;
        border-radius: 6.944vw;
      }
    }
  }

  li + li {
    margin-top: 12px;

    @include breakpoint(large) {
      margin-top: 2vh;
    }
  }

  + div {
    margin-top: 40px;

    @include breakpoint(large) {
      margin-top: 5.9vh; // 813px / 48px
    }
  }
}
</style>