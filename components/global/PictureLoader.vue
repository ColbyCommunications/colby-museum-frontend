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
    loading: {
      required: false,
      default: 'lazy'
    },
    desktopWidth: {
      required: false,
      default: 1200,
    }
  },
  created() {
    this.interface = useInterfaceStore();
  },
  async mounted() {
    console.log(`Image ID: ${this.post.featured_media}`);
    this.image = await this.getImage(this.post.featured_media);
  },
  methods: {
    async getImage(i) {
      const component = this;
      let imageObj;
      let newImageObj;

      await axios
        .get(`${component.interface.endpoint}media/${i}`)
        .then((output) => {
          imageObj = output.data;
          // console.log(imageObj);
          // console.log(`https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=1200,quality=75,format=webp`);

          newImageObj = {
            alt_text: imageObj.alt_text,
            caption: {
              rendered: imageObj.caption.rendered,
            },
            media_details: {
              sizes: {
                desktop: {
                  source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=${component.desktopWidth},quality=75,format=webp`,
                },
                mobile: {
                  source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=600,quality=75,format=webp`,
                },
              }
            }
          };

        });

      return await newImageObj;
    }
  }
}
</script>