<template>
  <div ref="paragraphRef" class="core-paragraph grid paragraph-style-2" >
    <p v-html="attrs.content.replace(`${iface.backend}`, '/').replace(/\/$/, '')" :style="{ fontWeight: attrs.style?.typography?.fontWeight, fontStyle: attrs.style?.typography?.fontStyle }" :class="attrs.fontSize"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useInterfaceStore } from "~/store/interface";
import gsap from 'gsap';

// 1. Define Props
const props = defineProps({
  attrs: {
    type: Object,
    required: true,
  }
});

console.log(props);
// 2. Setup State & Refs
const iface = useInterfaceStore();
const paragraphRef = ref(null);

// 3. Lifecycle & Animations
onMounted(() => {
  let mm = gsap.matchMedia();

  if (paragraphRef.value) {
    let pcurtain = paragraphRef.value.querySelector('.vertical-curtain');
    
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(pcurtain, {
        scrollTrigger: {
          trigger: paragraphRef.value, // Fixed: original code referenced an undefined 'subheading'
          toggleActions: 'restart none none reverse',
          start: 'top 95%',
        },
        height: 0,
        duration: 0.3,
        ease: "expo.out",
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.to(pcurtain, {
        height: 0,
        duration: 0,
        ease: "expo.out",
      });
    });
  }
});
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

  .x-large {
    font-size: 2.5rem;
    line-height: 1.4;
  }

  .large {
    font-size: 2rem;
    line-height: 1.2;
  }
  
  .medium {
    font-size: 1.25rem;
    line-height: 1.5;
  }
  
  .small {
    font-size: 1rem;
    line-height: 1.3;
  }
}
</style>