<template>
  <Picture
    v-if="image"
    :classes="classes"
    :alt="image.alt_text"
    :sizes="image.media_details.sizes"
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
    classes: {
      type: String,
      required: false,
    },
    post: {
      type: Object,
      required: false,
    },
  },
  created() {
    this.interface = useInterfaceStore();
  },
  async mounted() {
    // console.log(`Image ID: ${this.post.featured_media}`);
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
          // console.log(imageObj);
        });

      return await imageObj;
    }
  }
}
</script>