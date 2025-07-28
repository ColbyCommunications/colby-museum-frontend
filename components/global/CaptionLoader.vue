<template>
  <p
    v-if="image"
    v-html="image.caption.rendered.replace(/<\/?[^>]+(>|$)/g, '')"
  />
</template>

<script>
import { useInterfaceStore } from "~/store/interface";
import getImage from '~/helpers/getImage'

export default {
  async setup() {
    const image = await getImage(this.post.featured_media, this.interface.endpoint);

    return {
      interface: useInterfaceStore(),
      image: undefined,
    }
  },
  props: {
    post: {
      type: Object,
      required: false,
    },
  },
  methods: {
  }
}
</script>