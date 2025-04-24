
<template>
  <div
    class="media-context"
    :class="[Number(reverse) ? 'media-context--reverse' : '', variant ? `media-context--${variant}` : '', newItems.length == 1 ? 'media-context--single-slide' : '']"
    ref="mediacontext"
  >
    <div class="media-context__inner grid">
      <div
        ref="carousel"
        class="media-context__media"
      >
        <div class="media-context__media-inner">
          <div
            v-if="items_type == 'objects' && variant == 'offset'"
            class="horizontal-curtain horiztonal-curtain--loader"
            :class="loaded ? 'horizontal-curtain--inactive' : ''"
          >
            <ClientOnly>
              <l-ring color="black" size="80"></l-ring>
            </ClientOnly>
          </div>
          <div
            class="horizontal-curtain"
            ref="curtain"
          />
          <div
            v-if="variant == 'overflow' && (newItems.length > 0 || items)"
            class="media-context__chevrons"
          >
            <ChevronBtn
              @click="changeSlide('prev')"
              :title="'Previous Slide'"
            />
            <ChevronBtn
              @click="changeSlide('next')"
              :title="'Next Slide'"
            />
          </div>
          <div class="glide" data-glide-window>
            <div class="glide__track" data-glide-el="track">
              <ul class="glide__slides">
                <li
                  v-if="items_type == 'objects'"
                  v-for="(item, index) in items"
                  class="glide__slide"
                > 
                  <button
                    class="media-context__image"
                    v-if="modal"
                    @click="toggleModal()"
                  >
                    <Picture
                      :classes="'object-cover'"
                      :alt="item.image.alt_text"
                      :sizes="item.image.media_details.sizes"
                      :loading="'eager'"
                    />
                  </button>
                  <div
                    class="media-context__image"
                    v-else
                  >
                    <NuxtLink
                      v-if="item.button"
                      :to="item.button.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '')"
                    >
                      <Picture
                        :classes="'object-cover'"
                        :alt="item.image.alt_text"
                        :sizes="item.image.media_details.sizes"
                        :loading="'eager'"
                      />
                    </NuxtLink>
                    <VueImageZoomer
                      v-else-if="artificialDelayFinished"
                      :regular="item.image.media_details.sizes.full.source_url"
                      :click-zoom="true"
                      :lazyload="index == 0 ? false : true"
                    />
                    <div
                      v-if="item.image.caption && variant == 'full-width'"
                      class="media-context__caption"
                      v-html="item.image.caption.rendered.replace(/<\/?[^>]+(>|$)/g, '')"
                    />
                  </div>
                </li>
                <li
                  v-else-if="newItems.length"
                  v-for="(item, index) in newItems"
                  class="glide__slide"
                > 
                  <!-- Conditional logic for either manual or post image -->
                  <div
                    v-if="variant == 'overflow'"
                    class="glide__context"
                  >
                    <Context
                      v-if="item.post && item.post.type == 'post'"
                      :size="'small'"
                      :heading="item.post.title.rendered"
                      :subheading="formatDate(item.post.date)"
                      :button="{
                        title: 'Read News',
                        url: item.post.link
                      }"
                    />
                    <Context
                      v-else-if="item.post && (item.post.type == 'events' || item.post.type == 'exhibitions')"
                      :size="'small'"
                      :heading="item.post.title.rendered"
                      :subheading="formatDate(item.post.acf.date, 'events') + (item.post.acf.end_date && item.post.acf.date != item.post.acf.end_date ? `&ndash;${formatDate(item.post.acf.end_date, 'events')}` : '' )"
                      :subheading2="item.post.type == 'events' ? `${formatTime(item.post.acf.start_time)}&ndash;${formatTime(item.post.acf.end_time)}` : undefined"
                      :button="{
                        title: item.post.type == 'events' ? 'Event Details' : 'Exhibition Details',
                        url: item.post.link
                      }"
                    />
                    <Context
                      v-else-if="item.post"
                      :size="'small'"
                      :subheading="formatDate(item.post.date)"
                      :heading="item.post.title.rendered"
                      :button="{
                        title: 'Read News',
                        url: item.post.link
                      }"
                    />
                    <Context
                      v-else
                      :size="'small'"
                      :heading="item.heading"
                      :subheading="item.subheading"
                      :button="item.button"
                    />
                  </div>
                  <div
                    v-if="item.post"
                    class="media-context__image"
                  >
                    <NuxtLink
                      :to="item.post.link.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '')"
                    >
                      <PictureLoader
                        :classes="'object-cover'"
                        :post="item.post"
                        :loading="'eager'"
                      />
                    </NuxtLink>
                    <div
                      v-if="!item.post && item.image.caption && variant == 'full-width'"
                      class="media-context__caption"
                      v-html="item.image.caption.rendered.replace(/<\/?[^>]+(>|$)/g)"
                    />
                  </div>
                  <div
                    v-else
                    class="media-context__image"
                  >
                    <NuxtLink
                      v-if="item.button"
                      :to="item.button.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '')"
                    >
                      <Picture
                        :classes="'object-cover'"
                        :alt="item.image.alt_text"
                        :sizes="item.image.media_details.sizes"
                        :loading="'eager'"
                      />
                    </NuxtLink>
                    <Picture
                      v-else
                      :classes="'object-cover'"
                      :alt="item.image.alt_text"
                      :sizes="item.image.media_details.sizes"
                      :loading="'eager'"
                    />
                    <div
                      v-if="item.image.caption.rendered && variant == 'full-width'"
                      class="media-context__caption"
                      :class="{ 'media-context__caption--active' : activeSlide == index }"
                      v-html="item.image.caption.rendered"
                    />
                  </div>
                  <div
                    v-if="variant == 'overflow'"
                    class="glide__small-context"
                  >
                    <Context
                      v-if="item.post && item.post.type == 'post'"
                      :size="'small'"
                      :paragraph="item.post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '')"
                    />
                    <Context
                      v-else-if="item.post && (item.post.type == 'events' || item.post.type == 'exhibitions')"
                      :size="'small'"
                      :paragraph="item.post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '')"
                    />
                    <Context
                      v-else-if="item.post"
                      :size="'small'"
                      :paragraph="item.post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '')"
                    />
                    <Context
                      v-else
                      :size="'small'"
                      :paragraph="item.paragraph"
                    />
                  </div>
                  <!-- END Conditional logic for either manual or post image -->
                </li>
              </ul>
            </div>
          </div>
          <div
            class="media-context__controls"
            v-if="variant != 'offset' && variant != 'overflow' && newItems.length > 1"
          >
            <div
              v-if="newItems.length > 1"
              class="media-context__bullets"
            >
              <button
                v-for="(item, index) in newItems"
                class="media-context__bullet"
                :class="{ 'media-context__bullet--active' : activeSlide == index }"
                v-text="`Navigate to slide ${index}`"
                @click="changeSlide(index)"
              />
            </div>
            <div
              class="media-context__autoplay checkbox"
              :class="{'checkbox--active': !stopped}"
            >
              <div class="checkbox__main">
                <input :id="`autoplay-btn--${id}`" type="checkbox" name="autoplay" value="true" @click="toggleAutoplay()">
              </div>
              <label :for="`autoplay-btn--${id}`">Autoplay</label>
            </div>
          </div>
          <div
            v-if="items_type == 'objects' && variant == 'offset'"
            class="media-context__label paragraph-style-2"
          >
            <IconZoomMagnifyingGlass /><strong>Click Image to Zoom</strong>
          </div>
        </div>
      </div>
      <div
        v-if="variant != 'full-width' && variant != 'offset' && variant != 'overflow'"
        class="media-context__context"
      >
        <div
          v-for="(item, index) in newItems"
          class="media-context__context-panel"
          :class="{ 'media-context__context-panel--active': activeSlide == index }"
        >
          <Context
            v-if="item.post && item.post.type == 'post'"
            :size="'small'"
            :heading="item.post.title.rendered"
            :subheading="formatDate(item.post.date)"
            :paragraph="item.post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '')"
            :button="{
              title: 'Read News',
              url: item.post.link
            }"
          />
          <Context
            v-else-if="item.post && (item.post.type == 'events' || item.post.type == 'exhibitions')"
            :size="'small'"
            :heading="item.post.title.rendered"
            :subheading="formatDate(item.post.acf.date, 'events') + (item.post.acf.end_date && item.post.acf.date != item.post.acf.end_date ? `-${formatDate(item.post.acf.end_date, 'events')}` : '' )"
            :paragraph="item.post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '')"
            :button="{
              title: item.post.type == 'events' ? 'Event Details' : 'Exhibition Details',
              url: item.post.link
            }"
          />
          <Context
            v-else-if="item.post"
            :size="'small'"
            :subheading="formatDate(item.post.date)"
            :heading="item.post.title.rendered"
            :paragraph="item.post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '')"
            :button="{
              title: 'Read News',
              url: item.post.link
            }"
          />
          <Context
            v-else
            :size="'small'"
            :heading="item.heading"
            :subheading="item.subheading"
            :paragraph="item.paragraph"
            :button="item.button"
          />
        </div>
      </div>
      <div
        v-if="variant == 'offset'"
        class="media-context__context"
      >
        <BigArrowBtn
          v-if="button"
          v-bind="button"
        />
        <div
          class="media-context__chevrons"
        >
          <ChevronBtn
            v-if="newItems.length > 1 || items.length > 1"
            @click="changeSlide('prev')"
            :title="'Previous Slide'"
          />
          <ChevronBtn
            v-if="newItems.length > 1 || items.length > 1"
            @click="changeSlide('next')"
            :title="'Next Slide'"
          />
        </div>
        <div class="media-context__mini-captions">
          <div
            class="vertical-curtain"
            ref="pcurtain"
          />
          <div
            v-if="typeof items != 'number'"
            v-for="(item, index) in items"
          >
            <p
              class="media-context__context-panel"
              :class="{ 'media-context__context-panel--active': activeSlide == index }"
            >
              <span v-html="item.image.caption.rendered" />
            </p>
          </div>
          <div
            v-else
            v-for="(item, index) in newItems"
          >
            <CaptionLoader
              v-if="item.post"
              class="media-context__context-panel"
              :class="{ 'media-context__context-panel--active': activeSlide == index }"
              :post="item.post"
            />
            <p
              v-else
              class="media-context__context-panel"
              :class="{ 'media-context__context-panel--active': activeSlide == index }"
              v-html="item.image.caption.rendered.replace(/<\/?[^>]+(>|$)/g, '')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Glide from '@glidejs/glide';
import gsap from 'gsap';
import axios from 'axios';
import { useInterfaceStore } from "~/store/interface";
import { VueImageZoomer } from 'vue-image-zoomer';

export default {
  components: {
    VueImageZoomer
  },
  data() {
    return {
      id: undefined,
      interface: undefined,
      newItems: [],
      activeSlide: 0,
      window: undefined,
      glide: undefined,
      autoplay: false,
      perView: 1,
      stopped: true,
      gap: 0,
      artificialDelayFinished: true,
      loaded: false,
    };
  },
  props: {
    modal: {
      type: Boolean,
      required: false,
      default: false,
    },
    variant: {
      type: String,
      required: false,
    },
    reverse: {
      required: false,
    },
    button: {
      required: false,
    },
    items_type: {
      required: false,
      default: 'manual',
    },
    showChronology: {
      required: false,
    },
    showVariant: {
      required: false,
    },
    collection: {
      required: false,
    },
    items: {
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

    if (this.items_type != 'manual' && this.items_type != 'objects' && this.items_type != 'collection') {

      this.getPosts().then(() => {
        component.renderGlide();
      });
    } else if (this.items_type == 'collection') {
      this.getPost(component.collection,'collections').then((output) => {
        component.getCollection(output.acf.embark_id);
        component.renderGlide();
      });
    } else if (typeof this.items === 'number') {

      await Promise.all([...Array(this.items)].map(async (el, i) => ({
        post: component.blockData[`items_${i}_entry_type`] == 'selection' ? await component.getPost(component.blockData[`items_${i}_${component.blockData[`items_${i}_selection_type`]}_selection`], component.blockData[`items_${i}_selection_type`]) : undefined,
        heading: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : component.blockData[`items_${i}_heading`],
        subheading: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : component.blockData[`items_${i}_subheading`],
        paragraph: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : component.blockData[`items_${i}_paragraph`],
        button: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : component.blockData[`items_${i}_button`],
        image: component.blockData[`items_${i}_entry_type`] == 'selection' ? undefined : await component.getImage(component.blockData[`items_${i}_image`]),
      }))).then((output) => {
        component.newItems = output;
        component.renderGlide();
      })
    } else {
      component.renderGlide();
    }
  },
  async mounted() {
    this.id = self.crypto.randomUUID();

    if (this.items_type == 'objects') {
      const { ring } = await import('ldrs');
      ring.register();

      this.resizeZooms();
    }
  },
  unmounted() {
    clearInterval(this.zoomInterval);
    this.zoomInterval = null;
  },
  methods: {
    renderGlide() {
      setTimeout(() => {
        this.animate();
        this.window = this.$refs.carousel.querySelector("[data-glide-window]");

        let breakpoints = null;

        if (this.variant == 'full-width') {
          this.autoplay = 4000;
          this.stopped = false;
        }

        if (this.variant == 'overflow') {
          this.perView = 3;
          this.gap = 40;

          breakpoints = {
              1000: {
                perView: 2
              },
              600: {
                perView: 1
              }
            }
        }

        if (this.window) {
          this.glide = new Glide(this.window, {
            type: 'slider',
            gap: this.gap,
            animationDuration: 600,
            swipeThreshold: false,
            autoplay: this.autoplay,
            perView: this.perView,
            breakpoints: breakpoints,
          }).mount();

          this.glide.on("run", () => {
            this.activeSlide = this.glide.index;
          });
          // this.glide.mount();
        }
      }, 1000); // VERY IMPORTANT DELAY FOR LOADING AND CONTEXT ANIMATIONS TO GEL NICELY
    },
    changeSlide(s) {
      if (s == 'next') {
        s = '>';
      } else if (s == 'prev') {
        s = '<';
      } else {
        s = `=${s}`;
      }

      this.glide.go(s);
    },
    pauseCarousel() {
      if (this.glide) {
        this.glide.pause();
      }
    },
    playCarousel() {
      if (this.glide) {
        this.glide.play();
      }
    },
    toggleAutoplay() {

      if (this.stopped) {
        this.playCarousel();
        this.stopped = false;
      } else {
        this.pauseCarousel();
        this.stopped = true;
      }
    },
    formatDate(d, style) {
      let formattedDate;

      if (style == 'numeric') {
        formattedDate = new Date(d).toLocaleDateString('en-US', {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
          hour12: false
        })
        .replaceAll('/', '.');
      } else if (style == 'events') {
        formattedDate = new Date(`${d.substr(0,4)}-${d.substr(4,2)}-${d.substr(6,2)}T00:00:00`).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour12: false
        });
      } else if (style == 'events-raw') {
        formattedDate = new Date(`${d.substr(0,4)}-${d.substr(4,2)}-${d.substr(6,2)}T00:00:00`);
      } else {
        formattedDate = new Date(d).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour12: false
        });
      }
      return formattedDate;
    },
    formatTime(t) {
      const time = t.split(':');
      const hour = parseInt(time[0]);
      const min = time[1];
      const sec = parseInt(time[2]);
      const ampm = (hour >= 12) ? " p.m." : " a.m.";

      return `${hour == 12 || hour == 0 ? 12 : hour % 12}:${min.replace(/\s/g, '').replace('am', ' a.m.').replace('pm', ' p.m.')}`;
    },
    async getPosts() {
      const component = this;
      let chr;
      let type = '';
      let meta_date;

      if ((component.showChronology == 'current') && (component.items_type == 'events' || component.items_type == 'exhibitions')) {
        chr = '&chronologies=9';
      } else if ((component.showChronology == 'past') && (component.items_type == 'events' || component.items_type == 'exhibitions')) {
        chr = '&chronologies=8';
      } else if ((component.showChronology == 'future') && (component.items_type == 'events' || component.items_type == 'exhibitions')) {
        chr = '&chronologies_exclude=8,9';
      } else {
        if (component.showVariant != 'traveling') {
          chr = '&chronologies_exclude=8'; // EXCLUDE PAST AS LONG AS WE ARENT IN TRAVELING EXHIBITIONS
        }
      }

      if (component.showVariant == 'traveling') {
        type = '&variant=14';
      }

      // console.log(`${component.interface.endpoint}${component.items_type}?categories_exclude=1${chr}${type}&per_page=5&page=1`);

      console.log(`${component.interface.endpoint}${component.items_type}?categories_exclude=1${chr}${type}&per_page=8&page=1`);

      await axios
        .get(`${component.interface.endpoint}${component.items_type}?categories_exclude=1${chr}${type}&per_page=8&page=1`)
        .then((output) => {
          component.newItems = output.data.map((i) => ({
            post: i,
            event_date: i.acf.date ? component.formatDate(i.acf.date, 'events-raw') : undefined,
            end_date: i.acf.end_date ? component.formatDate(i.acf.end_date, 'events-raw') : undefined,
          }));

          // Temporary solution for ordering by start date
          if (component.items_type == 'events') {
            component.newItems.sort((a,b) => a.event_date.getTime() - b.event_date.getTime());
          } else if (component.items_type == 'exhibitions') {
            if (component.showChronology == 'future') {
              component.newItems.sort((a,b) => a.event_date.getTime() - b.event_date.getTime());
            } else if (component.showChronology == 'past') {
              component.newItems.sort((a,b) => b.end_date.getTime() - a.end_date.getTime());
            } else {
              component.newItems.sort((a,b) => b.event_date.getTime() - a.event_date.getTime());
            }
          }
        });
    },
    async getPost(i, type) {
      const component = this;
      let postObj;

      await axios
        .get(`${component.interface.endpoint}${type}/${i}`)
        .then((output) => {
          postObj = output.data;
        });

      return await postObj;
    },
    async getImage(i) {
      const component = this;
      let imageObj;
      let newImageObj;

      await axios
        .get(`${component.interface.endpoint}media/${i}`)
        .then((output) => {
          imageObj = output.data;

          // console.log(imageObj);

          newImageObj = {
            alt_text: imageObj.alt_text,
            caption: {
              rendered: imageObj.description.rendered.replace(/<img[^>]*>/g,"").replace(/<p[^>]*>|<\/p>/g, '').replace(/\r?\n|\r/g, "").replace(/<a[^>]*>|<\/a>/g, ''),
            },
            media_details: {
              sizes: {
                desktop: {
                  source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=1800,quality=75,format=webp`,
                },
                mobile: {
                  source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=1200,quality=75,format=webp`,
                },
              }
            }
          };
        });

      return await newImageObj;
    },
    async getCollection(i) {
      const component = this;

      await axios
        .get(`https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/future/_source/collection%2F${i}`, {
          auth: {
            username: 'Fr2fpegcBZ',
            password: 'Vi7vGnL3h2rtW5SuECoKRwTf'
          },
        })
        .then(async (output) => {
          const concatedObjs = output.data.objects.slice(0, 7);

          component.newItems = await Promise.all(concatedObjs.map(async (i) => {

            return await component.getObject(i.ident.replace('object/', ''));
          }));
        });
    },
    async getObject(i) {
      const component = this;
      let obj;
      let img;
      let imgUrl;

      await axios
        .get(`https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/future/_source/object%2F${i}`, {
          auth: {
            username: 'Fr2fpegcBZ',
            password: 'Vi7vGnL3h2rtW5SuECoKRwTf'
          },
        })
        .then((output) => {
          let i = output.data;

          img = i.Images.length > 0 ? i.Images[0] : undefined;
          imgUrl = img ? `https://ccma-iiif-cache-service.fly.dev/iiif/2/${img.IIIF_URL.substring(img.IIIF_URL.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "")}/full/${encodeURIComponent('400,')}/0/default.jpg` : '';

          obj = {
            heading: i.Disp_Title,
            subheading: i.Disp_Maker_1,
            button: {
              title: 'Learn More',
              url: `/objects/${i.embark_ID}`
            },
            image: img ? {
              caption: {
                rendered: i.Disp_Medium,
              },
              alt_text: i.Disp_Medium,
              media_details: {
                sizes: {
                  full: {
                    source_url: imgUrl,
                  },
                  mobile: {
                    source_url: imgUrl,
                  }
                }
              }
            } : {
              caption: {
                rendered: 'No Image Available',
              },
              alt_text: 'No Image Available',
              media_details: {
                sizes: {
                  full: {
                    source_url: `/blanks/blank_${ Math.floor(Math.random() * (3 - 1 + 1) + 1) }.png`
                  },
                  mobile: {
                    source_url: `/blanks/blank_${ Math.floor(Math.random() * (3 - 1 + 1) + 1) }.png`
                  },
                }
              }
            },
          } // END RETURN
        });
      
      return await obj;
    },
    animate() {
      setTimeout(() => {
        let pcurtain = this.$refs.pcurtain;

        gsap.to(this.$refs.curtain, {
          width: 0,
          duration: 0.4,
          ease: "expo.out",
        });

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

      }, 400);
    },
    toggleModal() {
      this.interface.toggleModal();
    },
    resizeZooms() {
      this.zoomInterval = setInterval(() => {
        const vhs = this.$refs.mediacontext.getElementsByClassName('vh--outer');
        
        Array.from(vhs).forEach((vh) => {
          // console.log(vh.querySelector('img').width);

          vh.style.width = `${vh.querySelector('img').width}px`
        });

        this.loaded = true;
      }, 1000);
    }
  }
}
</script>

<style lang="scss">
@use "sass:map";
// @import "node_modules/@glidejs/glide/src/assets/sass/glide.core";

.media-context {
  &--inactive {
    display: none;
  }

  &__inner {
    .media-context--overflow & {
      padding: 0;
    }
  }

  &__media,
  &__context {
    grid-column: span 12 / span 12;

    .media-context--overflow & {
      grid-column: span 11 / span 11;
    }

    @include breakpoint(medium) {
      grid-column: span 6 / span 6;

      .media-context--full-width & {
        grid-column: span 12 / span 12;
      }
    }
  }

  &__media + &__context {
    margin-top: 32px;

    @include breakpoint(medium) {
      margin-top: 0;
    }
  }

  &__media {
    position: relative;

    .media-context--full-width & {
      overflow: hidden;
    }

    @include breakpoint(medium) {
      .media-context--offset & {
        grid-column: span 8 / span 8;
      }

      .media-context--full-width & {
        position: relative;
        padding-bottom: 73%;

        .media-context__media-inner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
      }

      .media-context--full-width.media-context--single-slide & {
        padding-bottom: 53%;
      }
    }

    @include breakpoint(large) {
      .media-context--full-width & {
        padding-bottom: 68%;
      }

      .media-context--full-width.media-context--single-slide & {
        padding-bottom: 53%;
      }
    }
  }

  &__carousel {
    width: 100%;
  }

  .glide + &__controls {
    margin-top: 0.738vh; // 813 / 6

    .media-context--full-width & {
      margin-top: 4.920vh; // 813 / 40
    }
  }

  &__controls {
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: center;

    .media-context--full-width & {
      display: block;

      @include breakpoint(medium) {
        // display: flex;
        // flex-direction: row;
        // justify-content: space-between;
      }
    }
  }

  &__bullets {
    display: flex;
    justify-content: center;

    .media-context--full-width & {
      justify-content: flex-start;
    }
  }

  &__bullets + .checkbox {
    margin-top: 20px;

    @include breakpoint(medium) {
      margin-top: 2.25vh;
    }
  }

  &__context {
    position: relative;
    height: 260px;

    @include breakpoint(medium) {
      height: auto;
    }

    .media-context--reverse & {
      @include breakpoint(medium) {
        order: -1;
      }
    }

    .media-context--offset & {
      height: auto;

      @include breakpoint(medium) {
        grid-column: span 4 / span 4;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }

  &__autoplay,
  .checkbox {
    display: none;

    .media-context--full-width & {
      display: flex;
      justify-content: flex-start;
    }
  }

  &__context-panel {
    opacity: 0;
    visibility: hidden;
    transition: $transition-default;
    position: absolute;
    top: 0;
    left: 0;

    @include breakpoint(medium) {
      width: 100%;
      height: 100%;
      display: flex;

      .media-context--offset & {
        align-items: flex-end;
      }
    }

    &--active {
      opacity: 1;
      visibility: visible;
    }
  }

  button {
    cursor: pointer;
  }

  &__image {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    background-color: transparent;
    border: 0;
    appearance: none;

    @include breakpoint(medium) {
      padding-bottom: 74%;
    }

    .media-context--full-width & {
      padding-bottom: 176%;

      @include breakpoint(medium) {
        padding-bottom: 53%;
      }
    }

    .media-context--staggered & {
      @include breakpoint(medium) {
        padding-bottom: 70%;
      }
    }

    .media-context--overflow & {
      padding-bottom: 0;

      img {
        position: static;
      }
    }

    picture {
      &:nth-child(1) {
        img {
          .page--object & {
            object-fit: contain;
            object-position: center;
            width: 100%;
            height: 100%;

            @include breakpoint(medium) {
              width: auto;
              // max-width: 100%;
              height: 100%;
            }
          }
        }
      }

      &:nth-child(2) {
        img {
          .page--object & {
            object-fit: cover;
          }
        }
      }
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
    }

    .vh--rel {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  &__bullet {
    display: block;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 0;
    color: map.get($layout-colors, color);
    background-color: map.get($layout-colors, accent);
    border: 5px solid map.get($layout-colors, color);
    border-radius: 100%;
    cursor: pointer;

    .dark-mode & {
      color: map.get($layout-dm-colors, color);
      background-color: map.get($layout-dm-colors, accent);
      border: 5px solid map.get($layout-dm-colors, color);
    }

    @include breakpoint(medium) {
      width: 1.667vw;
      height: 1.667vw;
      border: 0.347vw solid map.get($layout-colors, color);

      .dark-mode & {
        border: 0.347vw solid map.get($layout-dm-colors, color);
      }
    }

    .media-context--full-width & {
      width: 46px;
      height: 46px;

      @include breakpoint(medium) {
        width: 4.167vw;
        height: 4.167vw;
      }
    }

    &--active {
      background-color: map.get($layout-colors, color);

      .dark-mode & {
        background-color: map.get($layout-dm-colors, color);
      }
    }

    &:hover {
      background-color: map.get($layout-colors, ambiant);

      .dark-mode & {
        background-color: map.get($layout-dm-colors, ambiant);
      }
    }
  }

  &__bullet + &__bullet {
    margin-left: 4px;

    @include breakpoint(medium) {
      margin-left: 0.278vw;
    }

    .media-context--full-width & {
      margin-left: 8px;

      @include breakpoint(medium) {
        margin-left: 0.833vw;
      }
    }
  }

  &__caption {
    @include paragraph-style-3;

    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 18px;
    color: map.get($layout-colors, accent);
    font-weight: 300;
    background-color: map.get($layout-colors, ambiant);
    transition: $transition-default;

    @include breakpoint(medium) {
      max-height: 0;
      max-width: 50%;
      padding: 0 2.222vw; // 0 32px
      overflow: hidden;
      transform: translateY(100%);
    }

    &--active {
      @include breakpoint(medium) {
        max-height: 20vh;
        padding: 2vh 2.222vw; // 20px 32px
      }
    }
  }

  &__chevrons {
    display: flex;
    margin-top: 20px;

    @include breakpoint(medium) {
      display: block;
      margin-top: 0;
    }

    .media-context--overflow & {
      display: flex;
      padding-left: calc(map.get($grid-column-gutter, large) / 2);
      margin-bottom: 20px;
      @include breakpoint(medium) {
        padding-left: 4.167vw;
        margin-bottom: 3.69vh;
      }
    }

    .chevron-btn:first-child {
      svg {
        transform: rotate(180deg) translateX(13%);
      }
    }

    .chevron-btn + .chevron-btn {
      margin-left: 14px;

      @include breakpoint(medium) {
        margin-top: 1.845vh;
        margin-left: 0;
      }

      .media-context--overflow & {
        @include breakpoint(medium) {
          margin-top: 0;
          margin-left: 1.667vw;
        }
      }
    }
  }

  &__mini-captions {
    position: relative;
    height: 140px;
    margin-top: 20px;

    @include breakpoint(medium) {
      margin-top: 0;
      height: 30%;
    }

    p {
      @include paragraph-style-3;
    }

    > div {
      @include breakpoint(medium) {
        top: auto;
        bottom: 0;
        height: auto;
      }
    }
  }

  &__label {
    display: flex;
    align-items: center;

    .icon-zoom {
      width: 20px;
      margin-right: 6px;

      .dark-mode & {
        fill: $white;
      }

      @include breakpoint(medium) {
        width: 1.389vw;
        margin-right: 0.417vw;
      }
    }
  }

  + div:not(.meta-data-list) {
    margin-top: 100px;

    @include breakpoint(medium) {
      margin-top: 12vh;
    }
  }

  + .meta-data-list {
    @include breakpoint(medium) {
      margin-top: 12vh;
    }
  }

  .vh--message {
    @include subheading-style-4;
    background-color: $black;

    display: none;
  }

  .vh--none {
    &:hover {
      cursor: zoom-out;
    }
  }

  .horiztonal-curtain--loader {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.6s cubic-bezier(0.5, 0, 0.75, 0);
    max-height: 100vh;

    l-ring {
      opacity: 1;
      transition: $transition-default;
    }

    &.horizontal-curtain--inactive {
      max-height: 0;

      l-ring {
        opacity: 0;
      }
    }
  }
}

.glide {
  .media-context--overflow & {
    padding: 0 calc(map.get($grid-column-gutter, large) / 2);

    @include breakpoint(medium) {
      padding: 0 4.167vw;
    }
  }

  &__track {
    .media-context--full-width & {
      overflow: visible;
    }

    .media-context--overflow & {
      overflow: visible;
    }
  }

  &__slides {
    .media-context--full-width & {
      overflow: visible;
    }
  }

  &__slide {
    display: block;

    .media-context--full-width & {
      overflow-y: visible;
    }
  }

  &__context {
    margin-bottom: 1.476vh;
  }

  &__small-context {
    margin-top: 1.476vh;

    .context__p {
      @include breakpoint(large) {
        font-size: 1.1vw;
      }
    }
  }

  + .media-context__label {
    margin-top: 5px;

    @include breakpoint(large) {
      margin-top: 3.542vh;
    }
  }
}
</style>