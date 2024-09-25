<template>
  <div class="grid">
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
        <picture>
          <source media="(min-width:768px)" :srcset="image.srcset">
          <img
            class="video__image object-cover"
            :src="image.src"
            :alt="image.alt"
          />
        </picture>
      </div>
      <div ref="iframe" class="video__iframe"></div>
    </div>
  </div>
</template>

<script>
import YTPlayer from 'yt-player';

export default {
  data() {
    return {
      active: false,
      player: null,
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
      type: Object,
      required: true,
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

  + div {
    margin-top: 100px;

    @include breakpoint(medium) {
      margin-top: 14.76vh;
    }
  }
}
</style>