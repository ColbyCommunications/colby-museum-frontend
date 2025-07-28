<template>
  <Picture
    v-if="image"
    :classes="classes"
    :alt="image.alt_text"
    :sizes="image.media_details.sizes"
    :loading="loading"
  />
</template>

<script>
import { useInterfaceStore } from "~/store/interface";
import getImage from '~/helpers/getImage'

export default {
  async setup() {
    const iface = useInterfaceStore();
    const { data: image } = await useAsyncData( await getImage(this.post.featured_media, iface.endpoint) )

    return {
      interface: iface,
      image,
    }
  },
  props: {
    classes: {
      type: String,
      required: false,
    },
    post: {
      type: Object,
      required: false,
    },
    loading: {
      required: false,
      default: 'lazy'
    },
    desktopWidth: {
      required: false,
      default: 1200,
    }
  },
  methods: {
  }
}
</script>