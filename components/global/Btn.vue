<template>
  <NuxtLink
    :class="[type == 'text' ? 'text-btn' : 'btn btn--light', size ? `btn--${size}` : '', srOnly ? 'sr-only' : '']"
    :to="fixedUrl"
    :target="target"
    ref="btn"
  >
    <div
      v-if="type == 'text'"
      class="horizontal-curtain"
      ref="curtain"
    />
    <div
      v-else
      class="btn-curtain"
      ref="curtain"
    />
    {{ title }}
  </NuxtLink>
</template>

<script>
import gsap from 'gsap';

import { useInterfaceStore } from "~/store/interface";

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
    },
    srOnly: {
      type: Boolean,
      required: false
    }
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
      setTimeout(() => {
        if (this.$refs.curtain) {
          gsap.to(this.$refs.curtain, {
            width: 0,
            duration: 0.4,
            ease: "expo.out",
          });
        }
      }, 400);
    },
    hasFileExtension(fileName) {
      return fileName.includes('.pdf');
    }
  }
}
</script>