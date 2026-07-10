import axios from "axios";
import { useInterfaceStore } from "~/store/interface";

const pageSEO = async (props, type) => {
  const nuxtApp = useNuxtApp()
  const route = useRoute();
  const pageMeta = ref({});

  // 1. Ensure slug is a flat string even if route.params.slug is an array
  const slugString = computed(() => {
    if (!route.params.slug) return 'home'
    return Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
  })

  const endpointType = type ? type : 'pages'
  const endpointUrl = computed(() => `${props.interface.endpoint}${endpointType}`)

  // 2. Add a server-side timestamp to force the Cloudflare Worker to pull clean data from WordPress
  const cacheBuster = process.server ? Date.now() : ''

  const options = { 
    method: 'GET', 
    query: { 
      slug: slugString.value, 
      _embed: 'wp:featuredmedia',
      _cb: cacheBuster // Forces WordPress to bypass its own hosting caches
    },
    // 3. Crucial Fixes for Nuxt/Nitro SSR Cache Bypassing:
    key: `wp-seo-${route.path}-${endpointType}`, // Generates an isolated key per path
    getCachedData: () => null // Forces Nuxt to execute the fetch on every server hit
  }

  const { data, error, status } = await useFetch(() => endpointUrl.value, options)

  if (error.value) {
    console.error(`Encountered an error when fetching page metadata from ${endpointUrl.value}:`, error)
  }

  pageMeta.value = data.value?.at(0) ?? {} 

  let postImageUrl = `${useInterfaceStore().backend}wp-content/uploads/2025/03/default.jpg`

  nuxtApp.runWithContext(() => useSeoMeta({
    ogTitle: () => `${pageMeta.value.title ? pageMeta.value.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'").replace('&amp;', '&').replace('&#038;',"&") + ' | ' : ''}Colby College Museum of Art`,
    title: () => `${pageMeta.value.title ? pageMeta.value.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'").replace('&amp;', '&').replace('&#038;',"&") + ' | ' : ''}Colby College Museum of Art`,
    ogDescription: () => pageMeta.value.excerpt?.rendered?.replace(/<p[^>]*>|<\/p>/g, '') || '',
    description: () => pageMeta.value.excerpt?.rendered?.replace(/<p[^>]*>|<\/p>/g, '') || '',
    ogImage: () => postImageUrl,
  }));

  return { data, error, status }
}

export default pageSEO;