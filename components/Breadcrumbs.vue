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
          >
          <span class="context__word">
              <span>
                <NuxtLink
                  :to="item.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '')"
                >
                  <IconArrow />
                  {{ item.title }}
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
                  {{ current.title }}
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
    }
  },
  mounted() {
    this.animate();
  },
  methods: {
    animate() {
      setTimeout(() => {
        let list = this.$refs.breadcrumbs;

        if (list) {
          let listWords = list.querySelectorAll('.context__word span');

          gsap.to(listWords,
            {
              y: 0,
              duration: 0.4,
              stagger: 0.1,
              ease: "expo.out",
            });
        }
      }, 600)
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
    margin-right: 16px;

    @include breakpoint(medium) {
      margin-right: 1.111vw;
    }
  }

  ul {
    overflow-y: auto;
    overflow-x: scroll;
  }

  li {
    white-space: nowrap;
  }

  li + li {
    margin-left: 16px;

    @include breakpoint(medium) {
      margin-left: 1.111vw;
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