<template>
  <div class="grid grid--video">
    <div
      ref="video"
      @click="setActive()"
      class="video"
    >
      <div
        class="video__overlay"
        :class="{'video__overlay--active': active == true}"
      >
        <IconPlay />
        <Picture
          v-if="newImage"
          :classes="'video__image object-cover'"
          :alt="newImage.alt_text"
          :sizes="newImage.media_details.sizes"
        />
      </div>
      <div ref="iframe" class="video__iframe"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import YTPlayer from 'yt-player';

import { useInterfaceStore } from "~/store/interface";

export default {
  data() {
    return {
      interface: undefined,
      active: false,
      player: null,
      newImage: undefined,
    };
  },
  async created() {
    this.interface = useInterfaceStore();
    const component = this;

    this.newImage = await component.getImage(component.image);
  },
  mounted() {
    setTimeout(() => {
      this.player = new YTPlayer(this.$refs.iframe);

      this.player.load(this.id);
    }, 2000);
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    image: {
      required: true,
    },
    blockData: {
      type: Object,
      required: false,
    }
  },
  methods: {
    setActive() {
      this.active = true;

      this.player.play();
    },
    async getImage(i) {
      const component = this;
      let imageObj;
      let newImageObj;

      await axios
        .get(`${component.interface.endpoint}media/${i}`)
        .then((output) => {
          imageObj = output.data;

          newImageObj = {
            alt_text: imageObj.alt_text,
            caption: {
              rendered: imageObj.caption.rendered,
            },
            media_details: {
              sizes: {
                desktop: {
                  source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=1200,quality=75,format=webp`,
                },
                mobile: {
                  source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=600,quality=75,format=webp`,
                },
              }
            }
          };
        });

      return await newImageObj;
    },
  },
}
</script>

<style lang="scss">
@use "sass:map";

.video {
  position: relative;
  padding-bottom: 56.25%;
  overflow: hidden;

  &__overlay {
    z-index: 10;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    transition: $transition-default;

    &:hover {
      svg {
        fill: map.get($layout-colors, ambiant);
        transform: scale(1.2);
      }
    }

    &--active {
      visibility: hidden;
      opacity: 0;
    }

    svg {
      z-index: 10;
      width: 60px;
      height: 60px;
      fill: map.get($layout-colors, background);
      transition: $transition-default;

      @include breakpoint(medium) {
        width: 80px;
        height: 80px;
      }

      &:hover {
        fill: map.get($layout-colors, ambiant);
      }
    }
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.grid--video {
  + div {
    margin-top: 100px;

    @include breakpoint(medium) {
      margin-top: 13.284vh;
    }
  }
}
</style>