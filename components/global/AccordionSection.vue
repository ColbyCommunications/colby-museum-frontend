<template>
  <div class="accordion-section" ref="accordionSection">
    <div class="accordion-section__inner grid">
      <div class="accordion-section__main">
        <Context
          v-if="heading"
          :heading="heading"
          :size="'large'"
        />
        <Accordion
          class="accordion"
          v-slot="accordion"
          :single="true"
        >
          <article
            v-for="(item, index) in newItems"
            class="accordion__panel"
            data-accordion-panel
          >
            <h3 class="accordion__header">
              <button
                class="accordion__button"
                data-accordion-button
                :aria-expanded="accordion.active.includes(index) ? true : false"
                @click="accordion.toggleActive(index, $event)"
              >
                <span class="context__word"><span>{{ item.heading }}</span></span>
                <span class="accordion__arrow-btn">
                  <IconArrow class="accordion__arrow" />
                </span>
              </button>
            </h3>
            <div
              class="accordion__window"
              data-accordion-window
            >
              <div
                class="accordion__content"
                data-accordion-content
                v-html="`<p>${item.context.replace(/\n{2}/g, '&nbsp;</p><p>').replace(/\n/g, '&nbsp;<br />')}</p>`"
              />
            </div>
          </article>
        </Accordion>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';

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

    if (typeof component.items === 'number') {
      component.newItems = [...Array(this.items)].map((el, i) => ({
        heading: component.blockData[`items_${i}_heading`],
        context: component.blockData[`items_${i}_context`],
      }));
    }
  },
  mounted() {
    this.animate();
  },
  methods: {
    animate() {
      setTimeout(() => {
        let words = this.$refs.accordionSection.querySelectorAll('.accordion .context__word span');
        let borders = this.$refs.accordionSection.querySelectorAll('.accordion__panel');

        gsap.to(words,
          {
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "expo.out",
          });

        gsap.to(borders,
          {
            '--border-width': 0,
            duration: 0.4,
            stagger: 0.1,
          });
      }, 400);
    }
  }
}
</script>

<style lang="scss">
@use "sass:map";

.accordion-section {
  &__main {
    grid-column: span 12 / span 12;

    @include breakpoint(medium) {
      grid-column: span 8 / span 8;
      grid-column-start: 3;
    }
  }

  p {
    @extend .paragraph-style-3;
  }

  + div {
    margin-top: 40px;

    @include breakpoint(large) {
      margin-top: 5.9vh; // 813px / 48px
    }
  }
}
</style>

