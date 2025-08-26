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
import getImage from '~/helpers/getImage'  
import { useInterfaceStore } from "~/store/interface";
import YTPlayer from 'yt-player';

export default {
  async setup(props) {
    const iface = useInterfaceStore();

    const { data } = await useAsyncData( `video-poster-${props.image}`, async () => {
      const img = await getImage(props.image, iface.endpoint);

      return img
    })

    return {
      interface: iface,
      active: false,
      player: null,
      newImage: data.value,
    };
  },
  mounted() {
    this.player = new YTPlayer(this.$refs.iframe);

    this.player.load(this.id);
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
      margin-top: 12vh;
    }
  }
}
</style>