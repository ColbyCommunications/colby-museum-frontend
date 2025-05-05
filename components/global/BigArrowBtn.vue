<template>
  <NuxtLink
    class="big-arrow-btn"
    :class="[reverse ? 'big-arrow-btn--reverse' : '']"
    :to="fixedUrl"
  >
    <span class="big-arrow-btn__word-wrap">
      <div
        class="horizontal-curtain"
        ref="curtain"
      />
      {{ title }}
    </span>
    <span class="big-arrow-btn__arrow-wrap">
      <svg ref="arrow" viewBox="0 0 146.6 46.5">
        <path d="m146.5 17-90-17-2 10.8 34.9 6.6H0v11h89.7l-35.3 7.4 2.2 10.7 90-18.7z" />
      </svg>
    </span>
  </NuxtLink>
</template>

<script>
import gsap from 'gsap';

import { useInterfaceStore } from "~/store/interface";

export default {
  props: {
    reverse: {
      type: Boolean,
      required: false,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  computed: {
    fixedUrl() {
      if (this.hasFileExtension(this.url)) {
        return this.url;
      } else {
        return this.url.replace(`${this.interface.backend}`, '/').replace(/\/$/, ''); 
      }
    }
  },
  async created() {
    this.interface = useInterfaceStore();
  },
  mounted() {
    this.animate();
  },
  methods: {
    animate() {
      let mm = gsap.matchMedia();
      let arrow = this.$refs.arrow;
      let curtain = this.$refs.curtain;

      setTimeout(() => {
        if (arrow) {
          mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.to(curtain, {
              scrollTrigger: {
                trigger: arrow,
                toggleActions: 'restart none none reverse',
                start: 'top 80%',
              },
              width: 0,
              duration: 0.4,
              ease: "expo.out",
            });

            gsap.to(arrow, {
              scrollTrigger: {
                trigger: arrow,
                toggleActions: 'restart none none reverse',
                start: 'top 80%',
              },
              x: 0,
              duration: 0.6,
              ease: "expo.out",
            });
          });

          mm.add("(prefers-reduced-motion: reduce)", () => {
            gsap.to(curtain, {
              width: 0,
              duration: 0,
              ease: "expo.out",
            });

            gsap.to(arrow, {
              x: 0,
              duration: 0,
              ease: "expo.out",
            });
          });
        }
      }, 600);
    },
    hasFileExtension(fileName) {
      return fileName.includes('.pdf');
    }
  }
}
</script>

<style lang="scss">
@use "sass:map";

.big-arrow-btn {
  @include heading-style-3();

  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  color: map.get($layout-colors, color);
  text-decoration: none;
  appearance: none;
  background-color: transparent;
  border: none;

  .dark-mode & {
    color: map.get($layout-dm-colors, color);
  }

  &:hover {
    color: map.get($layout-colors, ambiant);

    .dark-mode & {
      color: map.get($layout-dm-colors, ambiant);
    }

    svg {
      fill: map.get($layout-colors, ambiant);

      .dark-mode & {
        fill: map.get($layout-dm-colors, ambiant);
      }
    }
  }

  &__word-wrap {
    position: relative;
  }

  &__arrow-wrap {
    display: inline-flex;
    overflow: hidden;
    margin-left: 20px;

    @include breakpoint(medium) {
      margin-left: 1.389vw;
    }

    svg {
      transform: translateX(-100%);
    }
  }

  svg {
    width: 95px;
    fill: map.get($layout-colors, color);

    .dark-mode & {
      fill: map.get($layout-dm-colors, color);
    }

    @include breakpoint(medium) {
      width: 9vw;
    }
  }

  &__arrow-wrap {
    .big-arrow-btn--reverse & {
      order: -1;
      margin-right: 20px;
      margin-left: 0;

      @include breakpoint(medium) {
        margin-right: 1.389vw;
      }
    }
  }

  &--reverse {
    svg {
      transform: rotate(180deg) translateX(-100%);
    }
  }
}
</style>