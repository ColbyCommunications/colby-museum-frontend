<template>
  <div ref="paragraph" class="core-paragraph grid paragraph-style-2">
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

    console.log('test');
  },
  methods: {
    animate() {
      let mm = gsap.matchMedia();
      let paragraph = this.$refs.paragraph;

      if (paragraph) {
        let pcurtain = paragraph.querySelector('.vertical-curtain');
        
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.to(pcurtain,
          {
            scrollTrigger: {
              trigger: subheading,
              toggleActions: 'restart none none reverse',
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
    }
  }
}
</script>

<style lang="scss">
.core-paragraph {
  position: relative;

  .vertical-curtain {
    display: block;
  }

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