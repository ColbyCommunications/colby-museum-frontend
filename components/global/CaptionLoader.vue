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
  async setup(props) {
    const iface = useInterfaceStore()
    const image = await getImage(props.post?.featured_media, iface.endpoint);

    return {
      interface: iface,
      image,
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