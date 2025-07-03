<template>
  <div class="page page--object">
    <IntroContext
      :heading="artist"
      :headingElement="'h1'"
      :subheading="title"
      :subheading2="period"
    />
    <MediaContext
      v-if="images"
      :variant="'offset'"
      :items="images"
      :items_type="'objects'"
      :autoplay="false"
    />
    <MetaDataList
      :heading="'Object Details'"
      :items="items"
    />
    <div class="core-paragraph grid full paragraph-style-2" type="core-paragraph">
      <p>Object information is a work in progress and is updated as new research becomes available. Information about images and permissions is available <NuxtLink href="/collection/requests">here</NuxtLink>.</p>
    </div>
    <BigArrowBtnSection
      :button="{
        reverse: true,
        title: 'Search the Collection',
        url: '/objects/page-1?has_image=false'
      }"
    />
  </div>
</template>

<script>
import axios from 'axios';

import transitionConfig from '../helpers/transitionConfig';
import { useInterfaceStore } from "~/store/interface";

const setPageMeta = async () => {
    const nuxtApp = useNuxtApp()
    const route = useRoute();
    const pageMeta = ref()
    
    const user = 'Fr2fpegcBZ'
    const pass = 'Vi7vGnL3h2rtW5SuECoKRwTf'

    const endpointUrl = computed( () => `https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage/_source/object%2F${encodeURIComponent(route.params.slug[0])}` )

    let authToken
    if (process.client) {
      authToken = btoa(`${user}:${pass}`)
    } 
    else {
      authToken = Buffer.from(`${user}:${pass}`).toString('base64')
    }

    const {data, error, status} = await useFetch(endpointUrl.value, { credentials: 'include', headers: { authorization: `Basic ${authToken}` } })

    if (error.value) {
      console.error(`Could not fetch metadata from ${endpointUrl.value}`,error.value)
      return
    }

    pageMeta.value = data.value
    const fallbackImage = computed( () => `${useInterfaceStore().backend}wp-content/uploads/2025/03/default.jpg`)

    nuxtApp.runWithContext(() => {
      useSeoMeta({
        ogTitle: () => `${pageMeta.value.Disp_Title ? pageMeta.value.Disp_Title.replace(/&quot;/g, '\"').replace(/&#39;/g, "\'") + ' | ' + pageMeta.value.Disp_Maker_1.replace(/&quot;/g, '\"').replace(/&#39;/g, "\'") + ' | ' : ''}Colby College Museum of Art`,
        title: () => `${pageMeta.value.Disp_Title ? pageMeta.value.Disp_Title.replace(/&quot;/g, '\"').replace(/&#39;/g, "\'") + ' | ' + pageMeta.value.Disp_Maker_1.replace(/&quot;/g, '\"').replace(/&#39;/g, "\'") + ' | ' : ''}Colby College Museum of Art`,
        ogDescription: () => pageMeta.value?.Disp_Medium,
        description: () => pageMeta.value?.Disp_Medium,
        ogImage: () => pageMeta.value?.Images?.length > 0 ? `https://ccma-iiif-cache-service.fly.dev/iiif/2/${pageMeta.value.Images[0].IIIF_URL.substring(pageMeta.value.Images[0].IIIF_URL.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "")}/full/${encodeURIComponent('400,')}/0/default.jpg` : fallbackImage ,
      });
    }) 

    return data    
}

export default {
  async setup(props) {
    definePageMeta({
      pageTransition: transitionConfig,
    });

    const data = await setPageMeta()

    const post = data.value;

    let title = post.Disp_Title === '' ? 'Untitled' : post.Disp_Title?.replace(/–/g, '-')
                                                        .replace(/“/g, '"')
                                                        .replace(/”/g, '"')
                                                        .replace(/’/g, "'")

    const artist = post.Disp_Maker_1;
    const period = post.Disp_Create_DT;
    
    let images = []    
    if (post.Images.length > 0) {
      images = post.Images.map((i) => ({
        image: {
          caption: {
            rendered: `<strong>${post.Disp_Maker_1}</strong>, <i>${post.Disp_Title}</i>, ${post.Disp_Create_DT}. ${post.Disp_Medium}${post.Disp_Dimen ? ', ' + post.Disp_Dimen : ''}. Colby College Museum of Art${post.Dedication ? ', ' + post.Dedication : ''}; ${post.Disp_Access_No}`,
          },
          alt_text: post.Disp_Medium,
          media_details: {
            sizes: {
              full: {
                source_url: `https://ccma-iiif-cache-service.fly.dev/iiif/2/${i.IIIF_URL.substring(i.IIIF_URL.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "")}/full/1800%2C/0/default.jpg`,
              },
              mobile: {
                source_url: `https://ccma-iiif-cache-service.fly.dev/iiif/2/${i.IIIF_URL.substring(i.IIIF_URL.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "")}/full/400%2C/0/default.jpg`,
              }
            }
          }
        }
      }))
    }

    const items = [
      {
        heading: 'Object Type',
        paragraph: post.Disp_Obj_Type,
      },
      {
        heading: 'Medium',
        paragraph: post.Disp_Medium,
      },
      {
        heading: 'Dimensions',
        paragraph: post.Disp_Dimen,
      },
      {
        heading: 'Credit Line',
        paragraph: post.Dedication,
      },
      {
        heading: 'Accession Number',
        paragraph: post.Disp_Access_No,
      },
    ]

    return {
      title,
      artist,
      period,
      images,
      items,
    };    
  },
  props: {
    interface: {
      required: false,
    },
  },
}
</script>
