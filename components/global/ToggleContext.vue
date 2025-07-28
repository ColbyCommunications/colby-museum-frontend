<template>
  <div class="toggle-context">
    <div class="toggle-context__inner grid">
      <div class="toggle-context__col">
        <div
          class="vertical-curtain"
          ref="pcurtain"
        />
        <p class="paragraph-style-1"
          v-html="paragraph.replace(/(?:\r\n|\r|\n)/g, '<br>')"
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
          v-else-if="large_paragraph"
          class="paragraph-style-1"
          v-html="large_paragraph.replace(/(?:\r\n|\r|\n)/g, '<br>')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap';

import { useInterfaceStore } from "~/store/interface";
import getImage from '~/helpers/getImage'

const getImageItem = async (el, i) => {
  return {
    button: component.blockData[`items_${i}_button`],
    image: await getImage(component.blockData[`items_${i}_image`]),
  }
}

export default {
  async setup(props) {
    const iface = useInterfaceStore();

    const { data } = useAsyncData( async () => {
      let newImage
      let newItems = []

      if (typeof props.items === 'number') {      
        const newItems = await Promise.all([...Array(this.items)].map(getImageItem))
      } else {
        newImage = await getImage(component.image);
      }      

      return { newImage, newItems }
    })

    return {
      interface: iface,
      newItems: data.value?.newItems,
      newImage: data.value?.newImage,
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
  watch: {
    items: {
      deep: false,
      async handler() {
        this.animate();
      }
    },
  },
  mounted() {
    this.animate();
  },
  methods: {
    toggleSlide(i) {
      this.activeSlide = i;
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
                toggleActions: 'restart none restart none',
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
      }, 2000);
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

  + div {
    margin-top: 40px;

    @include breakpoint(large) {
      margin-top: 5.9vh; // 813px / 48px
    }
  }
}
</style>