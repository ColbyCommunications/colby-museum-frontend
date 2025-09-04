<template>
  <div ref="accordion">
    <slot :toggleActive="toggleActive" :active="active" />
  </div>
</template>

<script>
export default {
  name: 'accordion',
  setup() {
    return {
      active: [],
    };
  },
  props: {
    single: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    toggleActive(b, e) {
      const panel = e.target.closest('[data-accordion-panel]');
      const panelSiblings = this.getSiblings(panel);
      const window = panel.querySelector('[data-accordion-window]');
      const content = panel.querySelector('[data-accordion-content]');

      if (this.active.includes(b)) {
        this.active = this.active.filter((item) => item !== b);
      } else {
        this.active.push(b);
      }

      this.active.includes(b)
        ? window.setAttribute(
            'style',
            `height: ${content.offsetHeight}px; visibility: visible;`
          )
        : window.setAttribute('style', 'height: 0; visibility: hidden;');

      if (this.single == true) {
        this.active = this.active.filter((item) => item == b);
        panelSiblings
          .filter((item) => item.localName !== 'code')
          .forEach((sibling) => {
            const siblingWindow = sibling.querySelector('[data-accordion-window]');
            siblingWindow.setAttribute('style', 'height: 0; visibility: hidden;');
          });
      }
    },
    getSiblings(element) {
      let siblings = [];
      let sibling = element.parentNode.firstChild;

      while (sibling) {
        if (sibling.nodeType === 1 && sibling !== element) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
      }

      return siblings;
    },
  },
};
</script>

<style lang="scss">
@use "sass:map";

.accordion {

  &__panel + &__panel {
    @extend .border-global--top;
  }

  &__header {
    margin: 0;

    button {
      @include paragraph-style-2();

      font-weight: 700;
    }
  }

  &__arrow-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: transparent;
    transition: $transition-default;
    fill: map.get($layout-colors, color);

    .dark-mode & {
      fill: map.get($layout-dm-colors, color);
    }

    [aria-expanded='true'] & {
      // background-color: $navy;
    }

    svg {
      width: 20px;
      // fill: $navy;
      transition: $transition-default;

      @include breakpoint(medium) {
        width: 1.875vw;
      }

      [aria-expanded='true'] & {
        transform: rotate(180deg);
      }
    }
  }

  &__button {
    z-index: 10;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    border: 0;
    padding: 20px 0;
    width: 100%;
    text-align: left;
    appearance: none;
    cursor: pointer;
    background-color: transparent;
    color: map.get($layout-colors, color);

    .dark-mode & {
      color: map.get($layout-dm-colors, color);
    }

    @include breakpoint(large) {
      padding: 2.952vh 0;
    }
  }

  &__window {
    margin: 0;
    height: 0;
    overflow: hidden;
    visibility: hidden;
    transition: .2s ease-in-out;
  }

  &__content {
    padding: 0 0 20px;

    @include breakpoint(large) {
      padding: 0 0 2.952vh;
    }
  }

  p:nth-child(1) {
    margin-top: 0;
  }
}
</style>