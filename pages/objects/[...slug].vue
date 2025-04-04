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
    <div class="core-paragraph grid paragraph-style-2" type="core-paragraph">
      <p>Object information is a work in progress and is updated as new research becomes available. Information about images and permissions is available <NuxtLink href="/collection/requests">here</NuxtLink>.</p>
    </div>
    <BigArrowBtnSection
      :button="{
        reverse: true,
        title: 'Search the Collection',
        url: '/objects/page-1'
      }"
    />
  </div>
</template>

<script>
import axios from 'axios';

import transitionConfig from '../helpers/transitionConfig';

export default {
  setup(props) {
    const route = useRoute();
    const todo = ref({})

    useFetch(() => 
      axios.get(`https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage/_source/object%2F${encodeURIComponent(route.params.slug[0])}`, {
        auth: {
          username: 'Fr2fpegcBZ',
          password: 'Vi7vGnL3h2rtW5SuECoKRwTf'
        }
      })
      .then((output) => (todo.value = output.data))
    )

    useSeoMeta({
      ogTitle: () => `${todo.value.Disp_Title ? todo.value.Disp_Title.replace(/&quot;/g, '\"').replace(/&#39;/g, "\'") + ' | ' + todo.value.Disp_Maker_1.replace(/&quot;/g, '\"').replace(/&#39;/g, "\'") + ' | ' : ''}Colby College Museum of Art · Colby College`,
      title: () => `${todo.value.Disp_Title ? todo.value.Disp_Title.replace(/&quot;/g, '\"').replace(/&#39;/g, "\'") + ' | ' + todo.value.Disp_Maker_1.replace(/&quot;/g, '\"').replace(/&#39;/g, "\'") + ' | ' : ''}Colby College Museum of Art · Colby College`,
      ogDescription: () => todo.value?.Disp_Medium,
      description: () => todo.value?.Disp_Medium,
      ogImage: () => `https://master-7rqtwti-fr35dlu44eniu.us-4.platformsh.site/wp-content/uploads/2025/03/default.jpg`,
    });

    definePageMeta({
      pageTransition: transitionConfig,
    });
  },
  data() {
    return {
      title: undefined,
      artist: undefined,
      period: undefined,
      images: undefined,
      items: undefined,
    };
  },
  props: {
    interface: {
      required: false,
    },
  },
  async mounted() {
    const page = this;

    // console.log(encodeURIComponent(this.$route.params.slug[0]));
    console.log(`https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage/_source/object%2F${encodeURIComponent(this.$route.params.slug[0])}`);

    await axios
      .get(`https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage/_source/object%2F${encodeURIComponent(this.$route.params.slug[0])}`, {
        auth: {
          username: 'Fr2fpegcBZ',
          password: 'Vi7vGnL3h2rtW5SuECoKRwTf'
        }
      })
      .then((output) => {
        console.log(output.data);
        const post = output.data;

        page.title = post.Disp_Title
          .replace(/–/g, '-')
          .replace(/“/g, '"')
          .replace(/”/g, '"')
          .replace(/’/g, "'");

        page.title == '' ? page.title = 'Untitled' : page.title;
        page.artist = post.Disp_Maker_1;
        page.period = post.Disp_Create_DT;

        // page.images = post.Images.length > 0 ? `https://ccma-iiif-cache-service.fly.dev/iiif/2/${post.Disp_Access_No}_001_cd/full/2200%2C/0/default.jpg` : undefined;
        
        if (post.Images.length > 0) {
          page.images = post.Images.map((i) => ({
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

        page.items = [
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
      });
  }
}
</script>
