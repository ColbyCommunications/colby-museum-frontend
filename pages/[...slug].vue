
<template>
  <div class="page page--default">
    <Breadcrumbs
      v-if="$route.params.slug != ''"
      :items="breadcrumbs"
      :current="{
        title: title,
        url: fullPath,
      }"
    />
    <IntroContext
      :class="[heading_visible ? '' : 'sr-only--heading', excerpt_visible ? '' : 'sr-only--excerpt']"
      :heading="title"
      :headingElement="'h1'"
      :subheading="excerpt"
    />
    <BaseModule
      v-for="(item, index) in components"
      :moduleData="item"
    />
  </div>
</template>

<script>
import axios from 'axios';

import transitionConfig from '../helpers/transitionConfig';
import seoConfig from '../helpers/seoConfig';

export default {
  setup(props) {
    seoConfig(props);

    definePageMeta({
      pageTransition: transitionConfig,
    });
  },
  data() {
    return {
      title: undefined,
      fullPath: undefined,
      excerpt: undefined,
      intro_visible: undefined,
      breadcrumbs: undefined,
      components: undefined,
      excerpt_visible: true,
      heading_visible: true,
    };
  },
  props: {
    interface: {
      required: false,
    },
  },
  async created() {
    const page = this;
    const slug = this.$route.params.slug;
    let pageName;

    this.fullPath = this.$route.fullPath;

    if (Array.isArray(slug)) {
      pageName = slug[slug.length - 1];
    } else if (slug) {
      pageName = slug;
    } else {
      pageName = 'home';
    }

    const pageDatas = await axios
      .get(`${this.interface.endpoint}pages?slug=${pageName}`)

    const post = pageDatas.data.at(0)

    if (!post) return

    page.title = post.title.rendered
      .replace(/–/g, '-')
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/’/g, "'");
    
    page.excerpt = post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '');
    page.intro_visible = post.acf.intro_visible;
    page.heading_visible = post.acf.heading_visible;
    page.excerpt_visible = post.acf.excerpt_visible;

    page.getBreadcrumbs(post);

    let medias = []
    if ('wp:attachment' in post._links && post._links['wp:attachment'].at(0)) {
      const attachmentHref = post._links['wp:attachment'].at(0).href

      const mediaDatas = await axios.get(`${attachmentHref}&per_page=20`)
      medias = mediaDatas.data
    }

    page.components = post.block_data.map((component) => {
      
      let compData = component.attrs.data      

      // if (component.type === 'acf/media-context') {
      //   compData = compData.map( (cd,i) => {
      //     // TODO: embed media data if medias.find( m.id === item_${i}_image ) 
      //     const media = medias.find( m => `item_${i}_image` in cd && m.id === cd[`item_${i}_image`] )
      //     if (!media) return cd

      //     cd._embedded['wp:attachment'] = media
      //   })
      // }

      component.type = component.blockName
        .replace('acf/','')
        .replace(/\//g,'-');

      return {
        type: component.type,
        ...compData,
        medias,
        attrs: component.attrs.data ? undefined : component.attrs,
        innerHTML: component.rendered ? component.rendered : undefined,
      };
    });

  },
  mounted() {
    const timeLeft = ref(1);

    setInterval(async () => {
      if (timeLeft.value === 1) {
        if (this.hasFileExtension(this.$route.path)) {
          navigateTo(`${this.interface.backend}${this.$route.path}`, {
            external: true
          })

          history.pushState(null, document.title, location.href);
          window.addEventListener('popstate', (event) => {
            history.pushState(null, document.title, location.href);
          });
        }
      }

      timeLeft.value = timeLeft.value - 1;
    }, 100);
  },
  methods: {
    async getBreadcrumbs(post) {
      const component = this;

      await axios
        .get(`${this.interface.endpoint}breadcrumbs/${post.id}`)
        .then((output_b) => {
          component.breadcrumbs = output_b.data;
        });
    },
    hasFileExtension(fileName) {
      return fileName.includes('.pdf');
    }
  }
}
</script>
