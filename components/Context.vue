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
        :target="button.target"
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
        :target="button.target"
      >
        <Picture
          :alt="image.alt_text"
          :sizes="image.media_details.sizes"
          :loading="layoutPosition > 0 ? 'lazy' : 'eager'"
        />
      </NuxtLink>
      <Picture
        v-else
        :alt="image.alt_text"
        :sizes="image.media_details.sizes"
        :loading="layoutPosition > 0 ? 'lazy' : 'eager'"
      />
    </div>
    <p
      v-if="caption"
      class="context__caption"
      ref="caption"
    >
      <span
        class="vertical-curtain"
      />
      <span v-html="preppedCaption" />
    </p>
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

import { useInterfaceStore } from "~/store/interface";

/**
 * @function spanWrapWords
 * 
 * @argument {String} text - input text
 * 
 * @return `text` with each word wrapped in <span></span>
 * 
 **/ 
const spanWrapWords = (text) => {
  return text.replace(/\S+/g, '<span class="context__word" aria-hidden="true"><span aria-hidden="true">$&</span></span>');
}

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
    caption: {
      type: String,
      required: false,
    },
    paragraph: {
      type: String,
      required: false,
    },
    button: {
      required: false,
    },
    layoutPosition: {
      type: Number,
      default: 0
    }
  },
  watch: {
    // heading: {
    //   deep: true,
    //   handler() {
    //     this.animate();
    //   }
    // },
    // subheading: {
    //   deep: true,
    //   handler() {
    //     this.animate();
    //   }
    // },
    // image: {
    //   deep: true,
    //   handler() {
    //     this.animate();
    //     if (this.$refs.image) {
    //       this.$refs.image.classList.remove('context__image--broken');
    //     }
    //   }
    // }
  },
  computed: {
    preppedHeading() {
      return spanWrapWords(this.heading ?? '');
    },
    preppedSubheading() {
      return spanWrapWords(this.subheading ?? '');
    },
    preppedSubheading2() {
      return spanWrapWords(this.subheading2 ?? '');
    },
    preppedCaption() {
      return this.caption.replace(/\n/g, '<br />');
    },
    preppedParagraph() {
      return this.paragraph.replace(/\n/g, '<br />').replaceAll(`${this.interface.backend}`, '/').replace(/\/$/, '').replaceAll('/"', '"');
    },
    fixedUrl() {
      return this.button.url.replace(`${this.interface.backend}`, '/').replace(/\/$/, '');
    }
  },
  setup() {
    const iface = useInterfaceStore()
    return {
      interface: iface
    }
  },
  // async created() {
  //   this.interface = useInterfaceStore();
  // },
  mounted() {
    this.animate();

    let previousHeight = document.body.scrollHeight;

    // if (this.size != 'embark') {
    //   this.animateInterval = setInterval(() => {
    //     const currentHeight = document.body.scrollHeight;
    //     if (currentHeight !== previousHeight) {
    //       // console.log('Page length changed!');
    //       previousHeight = currentHeight; // Update the height

    //       this.animate();
    //     }
    //   }, 2000);
    // }
  },
  unmounted() {
    clearInterval(this.animateInterval);
    this.animateInterval = null;
  },
  methods: {
    animate() {
      let mm = gsap.matchMedia();

      setTimeout(() => {
        let heading = this.$refs.heading;
        let subheading = this.$refs.subheading;
        let subheading2 = this.$refs.subheading2;
        let curtain = this.$refs.curtain;
        let paragraph = this.$refs.paragraph;
        let caption = this.$refs.caption;

        if (heading) {
          let headingWords = heading.querySelectorAll('.context__word span');

          mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.to(headingWords,
              {
                scrollTrigger: {
                  trigger: heading,
                  toggleActions: 'restart none none none',
                  start: 'top 95%',
                },
                y: 0,
                duration: 0.2,
                stagger: 0.05,
                ease: "expo.out",
              });

            gsap.to(heading,
              {
                '--border-width': 0,
                duration: 0.2,
                stagger: 0.1,
              });
          });

          mm.add("(prefers-reduced-motion: reduce)", () => {
            gsap.to(headingWords,
              {
                y: 0,
                duration: 0,
                ease: "expo.out",
              });

            gsap.to(heading,
              {
                '--border-width': 0,
                duration: 0,
              });
          });
        }

        if (subheading) {
          let subheadingWords = subheading.querySelectorAll('.context__word span');
          let subheadingWordWraps = subheading.querySelectorAll('.context__word');

          mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.to(subheadingWords,
              {
                scrollTrigger: {
                  trigger: subheading,
                  toggleActions: 'restart none none none',
                  start: 'top 95%',
                },
                y: 0,
                duration: 0.2,
                stagger: 0.005,
                ease: "expo.out",
              });

            if (this.size == 'medium') {
              gsap.to(subheadingWordWraps,
                {
                  scrollTrigger: {
                    trigger: subheading,
                    toggleActions: 'restart none none none',
                    start: 'top 95%',
                  },
                  duration: 0.2,
                  stagger: 0.01,
                  overflow: 'visible',
                  ease: "expo.out",
                });
              }
          });

          mm.add("(prefers-reduced-motion: reduce)", () => {
            gsap.to(subheadingWords,
              {
                y: 0,
                duration: 0,
                ease: "expo.out",
              });

            if (this.size == 'medium') {
              gsap.to(subheadingWordWraps,
                {
                  duration: 0,
                  overflow: 'visible',
                  ease: "expo.out",
                });
              }
          });
        }

        if (subheading2) {
          let subheadingWords = subheading2.querySelectorAll('.context__word span');

          mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.to(subheadingWords,
              {
                scrollTrigger: {
                  trigger: subheading2,
                  toggleActions: 'restart none none none',
                  start: 'top 95%',
                },
                y: 0,
                duration: 0.2,
                stagger: 0.01,
                ease: "expo.out",
              });
          });

          mm.add("(prefers-reduced-motion: reduce)", () => {
            gsap.to(subheadingWords,
              {
                y: 0,
                duration: 0,
                ease: "expo.out",
              });
          });
        }

        if (curtain) {
          mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.to(curtain, {
              scrollTrigger: {
                trigger: curtain,
                toggleActions: 'restart none none none',
                start: 'top 95%',
                // markers: true,
              },
              height: 0,
              duration: 0.4,
              ease: "expo.out",
            });
          });

          mm.add("(prefers-reduced-motion: reduce)", () => {
            gsap.to(curtain, {
              height: 0,
              duration: 0,
              ease: "expo.out",
            });
          });
        }

        if (paragraph) {
          let pcurtain = paragraph.querySelector('.vertical-curtain');
          
          mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.to(pcurtain,
            {
              scrollTrigger: {
                trigger: subheading,
                toggleActions: 'restart none none none',
                start: 'top 95%',
              },
              height: 0,
              duration: 0.3,
              ease: "expo.out",
            });
          });

          mm.add("(prefers-reduced-motion: reduce)", () => {
            gsap.to(pcurtain,
            {
              height: 0,
              duration: 0,
              ease: "expo.out",
            });
          });
        }

        if (caption) {
          let ccurtain = caption.querySelector('.vertical-curtain');

          gsap.to(ccurtain,
          {
            scrollTrigger: {
              trigger: subheading,
              toggleActions: 'restart none none none',
              start: 'top 95%',
            },
            height: 0,
            duration: 0.3,
            ease: "expo.out",
          });
        }
      }, 900); // VERY IMPORTANT DELAY FOR ANIMATIONS TO TRIGGER APPROPRIATELY AFTER API LOAD. CAUTION 1100
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

    .sr-only--heading & {
      @extend .sr-only;
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

    .context--embark & {
      @extend .heading-style-embark;
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
    overflow: hidden !important;
    display: inline-block;

    .context--embark .context__subheading & {
      padding-right: 0.5vw;

      @include breakpoint(large) {
        padding-right: 0.15vw;
      }
    }

    span {
      will-change: transform;
      display: inline-block;
      transform: translateY(100%);
    }
  }

  &__heading + &__image {
    margin-top: 1.476vh; // 813px / 12px
  }

  &__subheading {
    .sr-only--excerpt & {
      @extend .sr-only;
    }

    .context--xlarge & {
      @extend .subheading-style-1;
    }

    .context--large & {
      @extend .subheading-style-1;
    }

    .context--medium & {
      @extend .subheading-style-4;
      // @extend .paragraph-style-3;
    }

    .context--small & {
      @extend .subheading-style-4;
    }

    .context--embark & {
      @extend .subheading-style-embark;

      &:nth-of-type(1) {
        font-style: italic;
      }
    }

    // Special styling for object detail title subheading
    &:nth-of-type(1) {
      .page--object & {
        font-style: italic;
        margin-top: 0 !important;

        .context__word {
          padding-right: 0.25vw;
          margin-left: -0.2vw;
        }
      }
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
  &__image + &__caption,
  &__image + .btn,
  &__image + .text-btn {
    margin-top: 1.230vh; // 813px / 10px
  }

  &__curtain {
    will-change: transform;
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

  &__caption {
    position: relative;
    @extend .paragraph-style-3;

    @include breakpoint(large) {
      font-size: 1vw;
    }

    span {
      display: contents;
    }

    i,
    em {
      @include breakpoint(large) {
        padding-right: 0.1vw;
      }
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

    .context--embark & {
      @extend .paragraph-style-3;

      @include breakpoint(large) {
        font-size: 1vw;
      }
    }
  }
}
</style>