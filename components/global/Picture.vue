<template>
  <picture>
    <source
      media="(min-width:768px)"
      :srcset="sizes.desktop ? sizes.desktop.source_url : sizes.full.source_url"
    >
    <img
      :class="classes"
      :src="sizes.mobile.source_url"
      :alt="alt"
      :loading="loading"
      :aspect-ratio="sizes.mobile.aspect_ratio ?? ''"
      width="100%"
      height="50%"
      @error="handle404"
    />
  </picture>
</template>

<script>
export default {
  setup() {
    return {
      error: false,
    }
  },
  props: {
    classes: {
      type: String,
      required: false,
    },
    alt: {
      type: String,
      required: false,
    },
    sizes: {
      type: Object,
      required: false,
    },
    loading: {
      required: false,
      default: 'lazy'
    }
  },
  methods: {
    handle404(e) {
      e.target.onerror = null;
  
      if (this.error == false) {

        // console.log('Handling 404');
        Array.from(e.target.parentNode.children).forEach(element => {
          element.srcset = `/blanks/blank_${ Math.floor(Math.random() * (3 - 1 + 1) + 1) }.png`;
        });
        e.target.src = `/blanks/blank_${ Math.floor(Math.random() * (3 - 1 + 1) + 1) }.png`;
        e.target.alt = 'Image Not Found';

        e.target.closest('.context__image').classList.add('context__image--broken');

        this.error = true;
      }
    }
  }
}
</script>