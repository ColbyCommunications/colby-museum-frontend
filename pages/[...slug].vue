<!-- CCMA Site index slug handler -->
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
import transitionConfig from '../helpers/transitionConfig';
import seoConfig from '../helpers/seoConfig';

export default {
  async setup(props) {
    const route = useRoute()
    definePageMeta({
      pageTransition: transitionConfig,
    });

    const { data } = await useAsyncData(`posts-${route.params.slug}`, async () => {
      const { data } = await seoConfig(props)

      const pageData = computed( () => data.value?.at(0) )

      const url = computed( () => `https://museum-backend.colby.edu/wp-json/wp/v2/breadcrumbs/${ pageData.value.id }` )
      
      const crumbData = await $fetch(url.value) 
      const breadcrumbs = crumbData ? crumbData : []

      return { pageData, breadcrumbs }
    })

    const pageData = data.value?.pageData
    const breadcrumbs = data.value?.breadcrumbs 

    const title = pageData?.title?.rendered
      .replace(/–/g, '-')
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/’/g, "'");
    
    const excerpt = pageData?.excerpt?.rendered.replace(/<\/?[^>]+(>|$)/g, '');
    const intro_visible = pageData?.acf?.intro_visible;
    const heading_visible = pageData?.acf?.heading_visible;
    const excerpt_visible = pageData?.acf?.excerpt_visible;

    const components = (pageData?.block_data ?? []).map((comp, i) => {
      let component = { ...comp }
      component.type = component.blockName
        .replace('acf/','')
        .replace(/\//g,'-');

      return {
        layoutPosition: i,
        type: component.type,
        ...component.attrs.data,
        attrs: component.attrs.data ? undefined : component.attrs,
        innerHTML: component.rendered ? component.rendered : undefined,
      };
    });

    return { title, 
             excerpt, 
             intro_visible, 
             heading_visible, 
             excerpt_visible, 
             breadcrumbs,
             components, 
             pageData,
             fullPath: route.fullPath }
  },
  props: {
    interface: {
      required: false,
    },
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
    hasFileExtension(fileName) {
      return fileName.includes('.pdf');
    }
  }
}
</script>
