<template>
  <div class="toggle-context">
    <div class="toggle-context__inner grid">
      <div class="toggle-context__col">
        <div
          class="vertical-curtain"
          ref="pcurtain"
        />
        <p class="paragraph-style-2"
          v-text="paragraph"
        />
      </div>
      <div class="toggle-context__col">
        <div class="toggle-context__carousel">
          <div
            class="context__curtain"
            ref="curtain"
          />
          <div
            v-if="variant == 'carousel'"
            v-for="(item, index) in newItems"
            class="toggle-context__image"
            :class="{ 'toggle-context__image--active': activeSlide == index }"
          >
            <Picture
              :classes="'object-cover'"
              :alt="item.image.alt_text"
              :sizes="item.image.media_details.sizes"
            />
          </div>
          <div
            v-else
            class="toggle-context__image toggle-context__image--active"
          >
            <Picture
              v-if="newImage"
              :classes="'object-cover'"
              :alt="newImage.alt_text"
              :sizes="newImage.media_details.sizes"
            />
          </div>
        </div>
      </div>
      <div class="toggle-context__col">
        <ul
          v-if="newItems.length > 0"
          class="list-style-1"
          ref="list"
        >
          <li
            v-for="(item, index) in newItems"
          >
            <span class="context__word">
              <span>
                <NuxtLink
                  v-if="variant == 'carousel'"
                  v-text="item.button.title"
                  :to="item.button.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '')"
                  @mouseover="toggleSlide(index)"
                />
                <NuxtLink
                  v-else
                  v-text="item.button.title"
                  :to="item.button.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '')"
                />
              </span>
            </span>
          </li>
        </ul>
        <p
          v-else
          class="paragraph-style-1"
          v-html="large_paragraph"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import gsap from 'gsap';

import { useInterfaceStore } from "~/store/interface";

export default {
  data() {
    return {
      interface: undefined,
      newItems: [],
      newImage: undefined,
      activeSlide: 0,
    };
  },
  props: {
    variant: {
      type: String,
      required: false,
    },
    paragraph: {
      type: String,
      required: false,
    },
    large_paragraph: {
      type: String,
      required: false,
    },
    items: {
      required: false,
    },
    image: {
      required: false,
    },
    blockData: {
      type: Object,
      required: false,
    }
  },
  async created() {
    this.interface = useInterfaceStore();
    const component = this;

    if (typeof this.items === 'number') {

      await Promise.all([...Array(this.items)].map(async (el, i) => ({
        button: component.blockData[`items_${i}_button`],
        image: await component.getImage(component.blockData[`items_${i}_image`]),
      }))).then((output) => {
        component.newItems = output;
      })
    } else {
      this.newImage = await component.getImage(component.image);
    }
  },
  mounted() {
    this.animate();
  },
  methods: {
    toggleSlide(i) {
      this.activeSlide = i;
    },
    async getImage(i) {
      const component = this;
      let imageObj;

      await axios
        .get(`${component.interface.endpoint}media/${i}`)
        .then((output) => {
          imageObj = output.data;
        });

      return await imageObj;
    },
    animate() {
      setTimeout(() => {
        let list = this.$refs.list;
        let curtain = this.$refs.curtain;
        let pcurtain = this.$refs.pcurtain;

        if (list) {
          let listWords = list.querySelectorAll('.context__word span');

          gsap.to(listWords,
            {
              scrollTrigger: {
                trigger: list,
                toggleActions: 'restart none none reverse',
                start: 'top 90%',
              },
              y: 0,
              duration: 0.4,
              stagger: 0.1,
              ease: "expo.out",
            });
        }

        if (curtain) {
          gsap.to(curtain, {
            height: 0,
            duration: 0.6,
            ease: "expo.out",
          });
        }

        if (pcurtain) {
          gsap.fromTo(pcurtain,
          {
            top: 0,
            bottom: 'auto',
          },
          {
            height: 0,
            duration: 0.6,
            ease: "expo.out",
          });
        }
      }, 1000);
    }
  }
}
</script>

<style lang="scss">
@use "sass:map";

.toggle-context {

  &__col {
    position: relative;
    grid-column: span 12 / span 12;

    @include breakpoint(medium) {
      grid-column: span 6 / span 6;
    }

    @include breakpoint(large) {
      grid-column: span 4 / span 4;
    }
  }

  &__col + &__col {
    margin-top: 32px;
    
    @include breakpoint(medium) {
      margin-top: 0;
    }
  }

  &__carousel {
    position: relative;
    padding-bottom: 109%;
  }

  &__image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      visibility: hidden;
      transition: 0.8s $ease-default;

      &--active {
        opacity: 1;
        visibility: visible;
        transition: $transition-default;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }
}
</style>