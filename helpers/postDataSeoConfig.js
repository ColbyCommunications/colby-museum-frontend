import axios from "axios";
import { useInterfaceStore } from "~/store/interface";

/**
 * @function postDataPageSEO
 * @parameter data Object - Post or page data
 * 
 * @description Populates page SEO from fetched backend metadata
 * @todo - Pass `data` as a ref and fill it lazily
 * 
 **/ 
const postDataPageSEO = async (data) => {
  // Unwrap page data, using embedded media data if available and falling back to defaults
  switch (true) {
    case (data._embedded && 'wp:featuredmedia' in data._embedded):
      useSeoMeta({
            ogTitle: () => `${data.title ? data.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'").replace('&amp;', '&').replace('&#038;',"&") + ' | ' : ''}Colby College Museum of Art`,
            title: () => `${data.title ? data.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'").replace('&amp;', '&').replace('&#038;',"&") + ' | ' : ''}Colby College Museum of Art`,
            ogDescription: () => data.excerpt?.rendered.replace(/<p[^>]*>|<\/p>/g, ''),
            description: () => data.excerpt?.rendered.replace(/<p[^>]*>|<\/p>/g, ''),
            ogImage: () => `${ data._embedded['wp:featuredmedia'].source_url }`,
          });
      return

    case (data.featured_media):
      const media = await axios
                    .get(`${useInterfaceStore().endpoint}media/${data.featured_media}`)

      const imagePath = media.data ? media.data.media_details?.sizes?.desktop?.source_url : `${useInterfaceStore().backend}wp-content/uploads/2025/03/default.jpg`
      useSeoMeta({
        ogTitle: () => `${todo.value.title ? todo.value.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'").replace('&amp;', '&').replace('&#038;',"&") + ' | ' : ''}Colby College Museum of Art · Colby College`,
        title: () => `${todo.value.title ? todo.value.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'").replace('&amp;', '&').replace('&#038;',"&") + ' | ' : ''}Colby College Museum of Art · Colby College`,
        ogDescription: () => todo.value.excerpt?.rendered.replace(/<p[^>]*>|<\/p>/g, ''),
        description: () => todo.value.excerpt?.rendered.replace(/<p[^>]*>|<\/p>/g, ''),
        ogImage: () => `${imagePath}`,
      });
      return

    default:
        useSeoMeta({
          ogTitle: () => `${data.title ? data.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'").replace('&amp;', '&').replace('&#038;',"&") + ' | ' : ''}Colby College Museum of Art`,
          title: () => `${data.title ? data.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'").replace('&amp;', '&').replace('&#038;',"&") + ' | ' : ''}Colby College Museum of Art`,
          ogDescription: () => data.excerpt?.rendered.replace(/<p[^>]*>|<\/p>/g, ''),
          description: () => data.excerpt?.rendered.replace(/<p[^>]*>|<\/p>/g, ''),
          ogImage: () => `${useInterfaceStore().backend}wp-content/uploads/2025/03/default.jpg`,
        });
  }
}

export default postDataPageSEO;