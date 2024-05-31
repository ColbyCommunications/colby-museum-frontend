<template>
  <p
    v-if="image"
    v-html="image.caption.rendered.replace(/<\/?[^>]+(>|$)/g, '')"
  />
</template>

<script>
import axios from 'axios';
import { useInterfaceStore } from "~/store/interface";

export default {
  data() {
    return {
      image: undefined,
    }
  },
  props: {
    post: {
      type: Object,
      required: false,
    },
  },
  created() {
    this.interface = useInterfaceStore();
  },
  async mounted() {
    this.image = await this.getImage(this.post.featured_media);
  },
  methods: {
    async getImage(i) {
      const component = this;
      let imageObj;

      await axios
        .get(`${component.interface.endpoint}media/${i}`)
        .then((output) => {
          imageObj = output.data;
        });

      return await imageObj;
    }
  }
}
</script>