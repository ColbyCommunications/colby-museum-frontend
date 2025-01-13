<template>
  <NuxtLink
    :class="[type == 'text' ? 'text-btn' : 'btn btn--light', size ? `btn--${size}` : '', srOnly ? 'sr-only' : '']"
    :to="fixedUrl"
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
      return this.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '');
    }
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
    }
  }
}
</script>