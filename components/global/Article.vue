<template>
  <article
    class="article"
    :class="`article--hover-${hover}`"
  >
    <Context
      v-if="post && post.type == 'post'"
      :size="size"
      :bordered="bordered"
      :heading="post.title.rendered"
      :subheading="formatDate(post.date)"
      :image="stagedImage"
      :layoutPosition="layoutPosition"
      :button="{
        type: button_type,
        title: 'Read News',
        url: post.link,
        target: openNewTab ? '_blank' : '_self',
      }"
    />
    <Context
      v-else-if="post && (post.type == 'events' || post.type == 'exhibitions')"
      :size="size"
      :bordered="bordered"
      :heading="post.title.rendered"
      :subheading="formatDate(post.acf.date, 'events') + (post.acf.end_date && post.acf.end_date != '' && post.acf.date != post.acf.end_date ? `&ndash;${formatDate(post.acf.end_date, 'events')}` : '' )"
      :subheading2="post.type == 'events' ? `${formatTime(post.acf.start_time)}&ndash;${formatTime(post.acf.end_time)}` : undefined"
      :image="stagedImage"
      :layoutPosition="layoutPosition"
      :button="{
        type: button_type,
        title: post.type == 'events' ? 'Event Details' : 'Exhibition Details',
        url: post.link
      }"
    />
    <Context
      v-else-if="post && post.type == 'collections'"
      :size="size"
      :bordered="bordered"
      :heading="post.title.rendered"
      :image="stagedImage"
      :layoutPosition="layoutPosition"
      :button="{
        srOnly: true,
        type: button_type,
        title: 'Collection Details',
        url: post.link
      }"
    />
    <Context
      v-else-if="post"
      :size="size"
      :bordered="bordered"
      :heading="post.title.rendered"
      :subheading="formatDate(post.date)"
      :image="stagedImage"
      :layoutPosition="layoutPosition"
      :button="{
        type: button_type,
        title: 'Read News',
        url: post.link
      }"
    />
    <Context
      v-else
      :size="size"
      :bordered="bordered"
      :heading="paragraph_entry_type == 'description' && image ? image.artist_name : heading"
      :subheading="paragraph_entry_type == 'description' && image ? image.object_title : subheading"
      :subheading2="paragraph_entry_type == 'description' && image ? image.object_creation_date : subheading2"
      :image="image"
      :layoutPosition="layoutPosition"
      :caption="paragraph_entry_type == 'description' && image ? image.caption.rendered : undefined"
      :paragraph="paragraph"
      :button="stagedButton"
    />
  </article>
</template>

<script>
import axios from 'axios';
import { useInterfaceStore } from "~/store/interface";

export default {
  data() {
    return {
      interface: undefined,
      stagedImage: undefined,
      stagedButton: undefined,
    };
  },
  watch: {
    post: {
      deep: true,
      async handler() {
        this.updateImage();
      }
    },
    button: {
      deep: true,
      async handler() {
        this.setupButton();
      }
    }
  },
  async created() {
    this.interface = useInterfaceStore();

    this.setupButton();
    this.updateImage();
  },
  // async mounted() {
  //   this.updateImage();
  // },
  props: {
    post: {
      type: Object,
      required: false,
    },
    size: {
      type: String,
      required: false,
      default: 'medium',
    },
    bordered: {
      required: false,
      default: false,
    },
    hover: {
      type: String,
      required: false,
      default: 'default'
    },
    heading: {
      type: String,
      required: false,
    },
    subheading: {
      type: String,
      required: false,
    },
    subheading2: {
      type: String,
      required: false,
    },
    image: {
      type: Object,
      required: false,
    },
    paragraph_entry_type: {
      type: String,
      required: false,
    },
    paragraph: {
      type: String,
      required: false,
    },
    button_type: {
      type: String,
      required: false,
      default: 'default',
    },
    button: {
      required: false,
    },
    openNewTab: {
      type: Boolean,
      required: false,
    },
    layoutPosition: {
      type: Number,
      default: 0
    }
  },
  methods: {
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
    async getImage(i) {
      const component = this;

      let imageObj
      let newImageObj

      // Check for embedded media and remove the outer Array if it's there
      switch (true) {
        case ('wp:featuredmedia' in this.post._embedded
                && Array.isArray(this.post._embedded['wp:featuredmedia'])):
        
          if (!this.post._embedded['wp:featuredmedia'].at(0)) return

          imageObj = this.post._embedded['wp:featuredmedia'].at(0)
          break

        case ('wp:featuredmedia' in this.post._embedded
                && typeof this.post._embedded['wp:featuredmedia'] === 'object'):
          imageObj = this.post._embedded['wp:featuredmedia']
          break

        // Otherwise fetch from the endpoint
        default:
          const img = await axios.get(`${component.interface.endpoint}media/${i}`)
          imageObj = img.data
      }

      // Construct the GUID for media records that don't emit it
      // @TODO -- remove the imagedelivery plugin's -scaled.jpg bit in a smarter way
      if (!imageObj.guid?.rendered) {
        imageObj.guid = { rendered: imageObj.source_url.replace('-scaled.jpg','.jpg') }
      }

      const mediaDetails = imageObj.media_details

      let imageAspect
      if (mediaDetails.height > 0 && mediaDetails.width > 0) {
        imageAspect = mediaDetails.height / mediaDetails.width
      }

      const desktop = { aspect_ratio: imageAspect,
                        source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=1200,quality=75,format=webp` }

      const mobile = { aspect_ratio: imageAspect,
                       source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageObj.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=600,quality=75,format=webp` }

      newImageObj = {
        artist_name: imageObj.acf.artist_name,
        object_title: imageObj.acf.object_title,
        object_creation_date: imageObj.acf.object_creation_date,
        alt_text: imageObj.alt_text,
        caption: {
          rendered: imageObj.caption.rendered,
        },
        media_details: {
          sizes: {
            desktop,
            mobile
          }
        }
      }

      return newImageObj;
    },
    async updateImage() {
      if (this.post) {
        // console.log(this.post);
        this.stagedImage = this.post.featured_media ? await this.getImage(this.post.featured_media) : undefined;
      }
    },
    async setupButton() {
      if (this.button) {
        this.stagedButton = {
          srOnly: this.button.srOnly,
          type: this.hover == 'all' ? 'text' : this.button_type,
          title: this.button.title,
          url: this.button.url,
          target: this.button.target,
        };
      }
    }
  }
}
</script>

<style lang="scss">
@use "sass:map";

.article {
  &--hover-all {
    &:hover {
      .context__heading,
      .context__heading a,
      .context__subheading,
      .context__p,
      .text-btn {
        color: map.get($layout-colors, ambiant);

        .dark-mode & {
          color: map.get($layout-dm-colors, ambiant);
        }
      }

      .context__image a img {
        outline: solid map.get($layout-colors, ambiant) 6px;
      }
    }
  }

  .context__heading,
  .context__subheading {
    text-decoration: none;
  }
}
</style>