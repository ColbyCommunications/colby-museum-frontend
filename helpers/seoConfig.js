import axios from "axios";
import { useInterfaceStore } from "~/store/interface";

const pageSEO = async (props, type) => {
  const nuxtApp = useNuxtApp()
  const route = useRoute();
  const pageMeta = ref({});

  const slug = computed( () => route.params.slug ? route.params.slug : 'home' )
  const endpointType = type ? type : 'pages'
  const endpointUrl = computed( () => `${props.interface.endpoint}${endpointType}` )

  const options = { lazy: true,
                    method: 'GET', 
                    query: { slug: slug.value, _embed: 'wp:featuredmedia' } 
                  }
  const { data, error, status } = await useFetch( () => endpointUrl.value, options)

  if (error.value) {
    console.error(`Encountered an error when fetching page metadata from ${endpointUrl.value}:`,error)
    return
  }

  if (!data.value || !data.value.at(0)) {
    console.error(`Fetched empty data from ${endpointUrl.value} ${slug.value} and ${ status.value }!`)
    return
  }

  pageMeta.value = data.value.at(0)

  // Unwrap any embedded media data
  const { _embedded } = pageMeta.value
  let postImageUrl = `${useInterfaceStore().backend}wp-content/uploads/2025/03/default.jpg`

  // Because the component may have lost the app context, request it before setting meta.
  // Without this line the composable will error out, preventing prerendering meta tags 

  // See https://nuxt.com/docs/api/composables/use-nuxt-app#runwithcontext for more
  nuxtApp.runWithContext(() => useSeoMeta({
    ogTitle: () => `${pageMeta.value.title ? pageMeta.value.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'").replace('&amp;', '&').replace('&#038;',"&") + ' | ' : ''}Colby College Museum of Art`,
    title: () => `${pageMeta.value.title ? pageMeta.value.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'").replace('&amp;', '&').replace('&#038;',"&") + ' | ' : ''}Colby College Museum of Art`,
    ogDescription: () => pageMeta.value.excerpt?.rendered.replace(/<p[^>]*>|<\/p>/g, ''),
    description: () => pageMeta.value.excerpt?.rendered.replace(/<p[^>]*>|<\/p>/g, ''),
    ogImage: () => postImageUrl,
  }));
}

export default pageSEO;