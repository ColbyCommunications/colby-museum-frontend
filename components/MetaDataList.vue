<template>
  <div ref="metaDataList" class="meta-data-list">
    <div class="meta-data-list__inner grid">
      <div class="meta-data-list__top">
        <h3
          class="meta-data-list__heading heading-style-3"
          v-html="preppedHeading(heading)"
        />
      </div>
      <div class="meta-data-list__main">
        <div
          v-for="(item, index) in items"
          class="meta-data-list__item"
        >
          <h3
            class="paragraph-style-3 paragraph-style-3--display"
          >
            <strong v-html="preppedHeading(item.heading)" />
          </h3>
          <p
            class="paragraph-style-3"
          >
            <span class="context__word">
              <span v-html="item.paragraph" />
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap';

export default {
  props: {
    heading: {
      type: String,
      required: false,
    },
    items: {
      type: Array,
      required: false,
    }
  },
  mounted() {
    this.animate();
  },
  methods: {
    preppedHeading(heading) {
      return heading.replace(/\S+/g, '<span class="context__word"><span>$&</span></span>');
    },
    animate() {
      setTimeout(() => {
        let words = this.$refs.metaDataList.querySelectorAll('.context__word span');
        let borders = this.$refs.metaDataList.querySelectorAll('.meta-data-list__main');

        gsap.to(words,
          {
            scrollTrigger: {
              trigger: this.$refs.metaDataList,
              toggleActions: 'restart none none reverse',
              start: 'top 90%',
            },
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "expo.out",
          });

        gsap.to(borders,
          {
            scrollTrigger: {
              trigger: this.$refs.metaDataList,
              toggleActions: 'restart none none reverse',
              start: 'top 90%',
            },
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

.meta-data-list {

  &__top,
  &__main {
    grid-column: span 12 / span 12;
  }

  &__top + &__main {
    padding-top: 40px;
    margin-top: 40px;
    
    @extend .border-global--top;

    @include breakpoint(large) {
      padding-top: 4.92vh;
      margin-top: 4.92vh;
    }
  }

  &__main {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: map.get($grid-column-gutter, small);

    @include breakpoint(medium) {
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: map.get($grid-column-gutter, large);
    }
  }

  &__heading {
    text-transform: uppercase;
  }

  &__item {
    grid-column: span 1 / span 1;
  }

  + .core-paragraph {
    margin-top: 12vh;
  }
}
</style>