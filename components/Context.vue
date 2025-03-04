<template>
  <div
    class="context"
    :class="[size ? `context--${ size }` : '', bordered == true ? 'context--bordered' : '']"
  >
    <component :is="headingElement"
      v-if="heading && button"
      class="context__heading"
      ref="heading"
    >
      <NuxtLink
        :to="fixedUrl"
      >
        <span class="sr-only"
          v-text="heading"
        />
        <span
          class="context__word-group"
          aria-hidden="true"
          v-html="preppedHeading"
        />
      </NuxtLink>
    </component>
    <component :is="headingElement"
      v-else-if="heading"
      class="context__heading"
      ref="heading"
    >
      <span class="sr-only"
        v-text="heading"
      />
      <span
        class="context__word-group"
        aria-hidden="true"
        v-html="preppedHeading"
      />
    </component>
    <div
      v-if="subheading"
      class="context__subheading"
      v-html="preppedSubheading"
      ref="subheading"
    />
    <div
      v-if="subheading2"
      class="context__subheading"
      v-html="preppedSubheading2"
      ref="subheading2"
    />
    <div
      v-if="image"
      class="context__image"
      :class="[image.alt_text == 'No Image Available' ? 'context__image--not-found' : '']"
      ref="image"
    >
      <div
        class="context__curtain"
        ref="curtain"
      />
      <NuxtLink
        v-if="button"
        :to="fixedUrl"
      >
        <Picture
          :alt="image.alt_text"
          :sizes="image.media_details.sizes"
        />
      </NuxtLink>
      <Picture
        v-else
        :alt="image.alt_text"
        :sizes="image.media_details.sizes"
      />
    </div>
    <p
      v-if="paragraph"
      class="context__p"
      ref="paragraph"
    >
      <span
        class="vertical-curtain"
      />
      <span v-html="preppedParagraph" />
    </p>
    <Btn
      v-if="button"
      class="context__btn"
      v-bind="button"
    />
  </div>
</template>

<script>
import gsap from 'gsap';

export default {
  props: {
    size: {
      type: String,
      required: false,
      default: 'medium',
    },
    bordered: {
      required: false,
      default: false,
    },
    heading: {
      type: String,
      required: false,
    },
    headingElement: {
      type: String,
      required: false,
      default: 'h2',
    },
    subheading: {
      type: String,
      required: false,
    },
    subheading2: {
      type: String,
      required: false,
    },
    image: {
      type: Object,
      required: false,
    },
    paragraph: {
      type: String,
      required: false,
    },
    button: {
      required: false,
    }
  },
  watch: {
    heading: {
      deep: true,
      handler() {
        this.animate();
      }
    },
    image: {
      deep: true,
      handler() {
        if (this.$refs.image) {
          this.$refs.image.classList.remove('context__image--broken');
        }
      }
    }
  },
  computed: {
    preppedHeading() {
      return this.heading.replace(/\S+/g, '<span class="context__word" aria-hidden="true"><span aria-hidden="true">$&</span></span>');
    },
    preppedSubheading() {
      return this.subheading.replace(/\S+/g, '<span class="context__word" aria-hidden="true"><span aria-hidden="true">$&</span></span>');
    },
    preppedSubheading2() {
      return this.subheading2.replace(/\S+/g, '<span class="context__word" aria-hidden="true"><span aria-hidden="true">$&</span></span>');
    },
    preppedParagraph() {
      return this.paragraph.replace(/\n/g, '<br />');
    },
    fixedUrl() {
      return this.button.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '');
    }
  },
  mounted() {
    this.animate();
  },
  methods: {
    animate() {
      setTimeout(() => {
        let heading = this.$refs.heading;
        let subheading = this.$refs.subheading;
        let subheading2 = this.$refs.subheading2;
        let curtain = this.$refs.curtain;
        let paragraph = this.$refs.paragraph;

        if (heading) {
          let headingWords = heading.querySelectorAll('.context__word span');

          gsap.to(headingWords,
            {
              scrollTrigger: {
                trigger: heading,
                toggleActions: 'restart none none reverse',
                start: 'top 85%',
              },
              y: 0,
              duration: 0.4,
              stagger: 0.1,
              ease: "expo.out",
            });

          gsap.to(heading,
            {
              '--border-width': 0,
              duration: 0.4,
              stagger: 0.1,
            });
        }

        if (subheading) {
          let subheadingWords = subheading.querySelectorAll('.context__word span');

          gsap.to(subheadingWords,
            {
              scrollTrigger: {
                trigger: subheading,
                toggleActions: 'restart none none reverse',
                start: 'top 85%',
              },
              y: 0,
              duration: 0.4,
              stagger: 0.01,
              ease: "expo.out",
            });
        }

        if (subheading2) {
          let subheadingWords = subheading2.querySelectorAll('.context__word span');

          gsap.to(subheadingWords,
            {
              scrollTrigger: {
                trigger: subheading2,
                toggleActions: 'restart none none reverse',
                start: 'top 85%',
              },
              y: 0,
              duration: 0.4,
              stagger: 0.01,
              ease: "expo.out",
            });
        }

        if (curtain) {
          gsap.to(curtain, {
            scrollTrigger: {
              trigger: curtain,
              toggleActions: 'restart none none reverse',
              start: 'top 85%',
              // markers: true,
            },
            height: 0,
            duration: 0.6,
            ease: "expo.out",
          });
        }

        if (paragraph) {
          let pcurtain = paragraph.querySelector('.vertical-curtain');

          gsap.to(pcurtain,
          {
            scrollTrigger: {
              trigger: subheading,
              toggleActions: 'restart none none reverse',
              start: 'top 85%',
            },
            height: 0,
            duration: 0.6,
            ease: "expo.out",
          });
        }
      }, 1000);
    }
  }
}
</script>

<style lang="scss">
@use "sass:map";

.context {
  
  &__heading,
  &__heading a,
  &__subheading,
  &__p {
    color: map.get($layout-colors, color);
    text-decoration: none;

    .dark-mode & {
      color: map.get($layout-dm-colors, color);
    }
  }

  &__heading {
    position: relative;
    // overflow: hidden;

    a:hover {
      color: map.get($layout-colors, ambiant);

      .dark-mode & {
        color: map.get($layout-dm-colors, ambiant);
      }
    }

    .context--xlarge & {
      @extend .heading-style-1;
      @extend .heading-style-1--display;
    }

    .context--large & {
      @extend .heading-style-2;
    }

    .context--medium & {
      @extend .heading-style-3;
    }

    .context--small & {
      @extend .heading-style-3;
    }

    .context--bordered & {
      padding-bottom: 8px;
      margin-bottom: 8px;

      @extend .border-global--bottom;

      // border-bottom: 4px solid map.get($layout-colors, color);

      // .dark-mode & {
      //   border-bottom: 4px solid map.get($layout-dm-colors, color);
      // }

      @include breakpoint(large) {
        padding-bottom: 0.984vh;
        margin-bottom: 0.984vh;
        // border-bottom: 0.492vh solid map.get($layout-colors, color);

        // .dark-mode & {
        //   border-bottom: 0.492vh solid map.get($layout-dm-colors, color);
        // }
      }
    }
  }

  &__word {
    overflow: hidden;
    display: inline-block;

    span {
      display: inline-block;
      transform: translateY(100%);
    }
  }

  &__heading + &__image {
    margin-top: 1.476vh; // 813px / 12px
  }

  &__subheading {
    .context--xlarge & {
      @extend .subheading-style-1;
    }

    .context--large & {
      @extend .subheading-style-1;
    }

    .context--medium & {
      @extend .subheading-style-4;
    }

    .context--small & {
      @extend .subheading-style-4;
    }
  }

  &__subheading + &__image {
    margin-top: 1.476vh; // 813px / 12px
  }

  &__image {
    position: relative;
    font-size: 0;

    &--not-found,
    &--broken {
      background-color: #e7f0f4;

      &::before {
        @include paragraph-style-3;

        position: absolute;
        top: 50%;
        z-index: 2;
        width: 100%;
        padding: 0 5px;
        content: 'No Image Available';
        font-style: italic;
        text-align: center;
        color: map.get($layout-colors, color);
        transform: translateY(-50%);
        pointer-events: none;
        opacity: 0.5;

        .dark-mode & {
          color: map.get($layout-dm-colors, color);
        }
      }
      
      .dark-mode & {
        background-color: #0c2f59;
      }
    }

    &--broken {
      &::before {
        content: 'Image Error';
      }
    }
  }

  &__image + &__p,
  &__image + .btn,
  &__image + .text-btn {
    margin-top: 1.230vh; // 813px / 10px
  }

  &__curtain {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: map.get($layout-colors, background);

    .dark-mode & {
      background-color: map.get($layout-dm-colors, background);
    }
  }

  &__p {
    position: relative;
    
    span {
      display: contents;
    }

    .vertical-curtain {
      display: block;
    }

    .context--xlarge & {
      @extend .paragraph-style-1;
    }

    .context--large & {
      @extend .paragraph-style-1;
    }

    .context--medium & {
      @extend .paragraph-style-2;
    }

    .context--small & {
      @extend .paragraph-style-3;
    }
  }
}
</style>