<template>
<button class="chevron-btn">
  <svg style="enable-background:new 0 0 23 37.3" viewBox="0 0 23 37.3">
    <path d="m5 37.3-4.9-5L13.3 19 0 4.8 5.1 0 23 19.2z" />
  </svg>
  <span
    class="sr-only"
    v-text="title"
  />
</button>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    }
  }
}
</script>

<style lang="scss">
@use "sass:map";

.chevron-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 54px;
  height: 54px;
  padding: 0;
  background-color: map.get($layout-colors, accent);
  border: 5px solid map.get($layout-colors, color);
  border-radius: 100%;
  cursor: pointer;

  .dark-mode & {
    background-color: map.get($layout-dm-colors, accent);
    border: 5px solid map.get($layout-dm-colors, color);
  }

  @include breakpoint(medium) {
    width: 5.139vw; // 74 / 1440
    height: 5.139vw; // 74 / 1440
    border: 0.486vw solid map.get($layout-colors, color);

    .dark-mode & {
      border: 0.486vw solid map.get($layout-dm-colors, color);
    }
  }

  &:hover {
    background-color: map.get($layout-colors, ambiant);
  }

  svg {
    width: 16px;
    fill: map.get($layout-colors, color);
    transform: translateX(13%);

    .dark-mode & {
      fill: map.get($layout-dm-colors, color);
    }

    @include breakpoint(medium) {
      width: 1.6vw; // 16 / 1440
    }
  }
}
</style>