<template>
  <nav aria-label="Breadcrumb" class="breadcrumbs" ref="breadcrumbs">
    <div class="breadcrumbs__inner grid">
      <div class="breadcrumbs__main">
        <ul>
          <li>
            <span class="context__word">
              <span>
                <NuxtLink
                  :to="'/'"
                >Home</NuxtLink>
              </span>
            </span>
          </li>
          <li
            v-for="(item, index) in items"
            :key="`breadcrumb_${index}`"
          >
            <span class="context__word">
              <span>
                <NuxtLink
                  :to="item.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '')"
                >
                  <IconArrow />
                  <!-- {{ item.title }} -->
                  <span v-html="item.title" />
                </NuxtLink>
              </span>
            </span>
          </li>
          <li v-if="manual">
            <span class="context__word">
              <span>
                <NuxtLink
                  :to="manual.url"
                >
                  <IconArrow />
                  <!-- {{ manual.title }} -->
                  <span v-html="manual.title" />
                </NuxtLink>
              </span>
            </span>
          </li>
          <li class="current">
            <span class="context__word">
              <span>
                <NuxtLink
                  :to="current.url"
                  aria-current="page"
                >
                  <IconArrow />
                  <!-- {{ current.title }} -->
                  <span v-html="current.title" />
                </NuxtLink>
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import gsap from 'gsap';

export default {
  props: {
    items: {
      required: false,
    },
    current: {
      type: Object,
      default: {
        url: '/',
        title: ''
      }
    },
    manual: {
      required: false,
    },
  },
  watch: {
    items: {
      deep: true,
      async handler() {
        setTimeout(() => {
          this.animate();
        }, 1000);
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.animate();
    }, 1000);
  },
  methods: {
    animate() {
      let list = this.$refs.breadcrumbs;

      if (list) {
        let listWords = list.querySelectorAll('.context__word span');

        gsap.to(listWords,
          {
            scrollTrigger: {
              trigger: this.$refs.breadcrumbs,
              toggleActions: 'restart none restart none',
              start: 'top 85%',
            },
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "expo.out",
          });
      }
    }
  }
}
</script>

<style lang="scss">
@use "sass:map";

.breadcrumbs {
  @extend .pagination;

  &__main {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    grid-column: span 12 / span 12;
  }

  svg {
    margin-left: 0;
    margin-right: 8px;

    @include breakpoint(medium) {
      margin-right: 0.833vw;
    }
  }

  ul {
    overflow-y: auto;
    overflow-x: scroll;
  }

  li > span,
  button,
  a {
    @include paragraph-style-2;

    @include breakpoint(large) {
      font-size: 1.389vw !important;
      letter-spacing: -0.033vw !important;
    }
  }

  li {
    white-space: nowrap;
  }

  li + li {
    margin-left: 8px;

    @include breakpoint(medium) {
      margin-left: 0.833vw;
    }
  }

  svg {
    @include breakpoint(medium) {
      width: 1.319vw;
      margin-left: 0;
    }
  }

  ul li.current a {
    color: map.get($layout-colors, ambiant);

    .dark-mode & {
      color: map.get($layout-dm-colors, ambiant);
    }
  }
}
</style>