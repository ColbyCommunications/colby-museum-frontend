<template>
  <div class="dark-light-mode-btn">
    <span v-text="interface.dark ? 'Light Mode' : 'Dark Mode'" />
    <button @click="toggleMode()">
      <span class="sr-only" v-text="interface.dark ? 'Change to Light Mode' : 'Change to Dark Mode'" />
      <IconMoon :class="[ !interface.dark ? 'active' : '' ]" />
      <IconSun :class="[ interface.dark ? 'active' : '' ]"  />
    </button>
  </div>
</template>

<script>
import { useInterfaceStore } from "~/store/interface";

export default {
  data() {
    return {
      interface: undefined,
      dark: undefined,
    };
  },
  created() {
    this.interface = useInterfaceStore();

    if (localStorage.getItem('darkMode') == 'true') {
      this.interface.toggleDark();
    }
  },
  methods: {
    toggleMode() {
      this.interface.toggleDark();
    }
  }
}
</script>

<style lang="scss">
@use "sass:map";

.dark-light-mode-btn {
  display: flex;
  align-items: center;

  span {
    @include paragraph-style-2;

    display: inline-block;
    font-weight: 700;
  }

  span + button {
    margin-left: 20px;

    @include breakpoint(large) {
      margin-left: 1.667vw;
    }
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    padding: 0;
    background-color: map.get($layout-colors, accent);
    border: 4px solid;
    border-color: map.get($layout-colors, color);
    border-radius: 100%;
    cursor: pointer;

    .dark-mode & {
      background-color: map.get($layout-dm-colors, accent);
      border-color: map.get($layout-dm-colors, color);
    }

    @include breakpoint(large) {
      width: 4.444vw;
      height: 4.444vw;
      border: 0.278vw solid;
    }

    &:hover {
      background-color: map.get($layout-colors, ambiant);

      .dark-mode & {
        background-color: map.get($layout-dm-colors, ambiant);
      }

      svg {
        fill: map.get($layout-colors, accent);
      }
    }

    svg {
      position: absolute;
      width: 30px;
      height: 60px;
      fill: map.get($layout-colors, color);
      opacity: 0;
      transition: 0.2s opacity $ease-default;

      .dark-mode & {
        fill: map.get($layout-dm-colors, color);
      }

      &.active {
        opacity: 1;
      }

      @include breakpoint(large) {
        width: 2.083vw;
        height: 2.083vw;
      }
    }
  }
}
</style>