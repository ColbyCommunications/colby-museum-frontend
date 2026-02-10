<script setup>
import { ref, onMounted } from 'vue';
import getImage from '~/helpers/getImage';
import { useInterfaceStore } from "~/store/interface";
import YTPlayer from 'yt-player'; // Assuming this is installed

// 1. Define Props
const props = defineProps({
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
});

// 2. Setup State & Refs
const iface = useInterfaceStore();
const active = ref(false);
const iframeRef = ref(null); // Corresponds to ref="iframeRef" in template
const videoRef = ref(null);  // Corresponds to ref="videoRef" in template
let player = null;           // Logic variable, doesn't need to be reactive

// 3. Async Data Fetching
// In Nuxt 3 <script setup>, top-level await is supported
const { data: newImage } = await useAsyncData(`video-poster-${props.image}`, async () => {
  return await getImage(props.image, iface.endpoint);
});

// 4. Methods
const setActive = () => {
  active.value = true;
  if (player) {
    player.play();
  }
};

// 5. Lifecycle Hooks
onMounted(() => {
  if (iframeRef.value) {
    player = new YTPlayer(iframeRef.value);
    player.load(props.id);
  }
});
</script>

<template>
  <div class="grid grid--video">
    <div
      ref="videoRef"
      @click="setActive"
      class="video"
    >
      <div
        class="video__overlay"
        :class="{'video__overlay--active': active === true}"
      >
        <IconPlay />
        <Picture
          v-if="newImage"
          :classes="'video__image object-cover'"
          :alt="newImage.alt_text"
          :sizes="newImage.media_details.sizes"
        />
      </div>
      <div ref="iframeRef" class="video__iframe"></div>
    </div>
  </div>
</template>

<style lang="scss">
@use "sass:map";

/* Styles remain exactly the same */
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