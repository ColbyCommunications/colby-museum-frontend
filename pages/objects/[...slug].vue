<template>
  <div class="page page--object">
    <Modal v-if="images">
      <MediaContext
        :variant="'full-width'"
        :items="images"
        :items_type="'objects'"
      />
    </Modal>
    <IntroContext
      :heading="title"
      :headingElement="'h1'"
      :subheading="artist"
      :subheading2="period"
    />
    <MediaContext
      v-if="images"
      :modal="true"
      :variant="'offset'"
      :items="images"
      :items_type="'objects'"
    />
    <MetaDataList
      :heading="'Object Details'"
      :items="items"
    />
    <BigArrowBtnSection
      :button="{
        reverse: true,
        title: 'Search the Collection',
        url: '/objects'
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

    // useFetch(() => 
    //   axios.get(`https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage/_source/https:%2F%2Fmuseum-data.colby.edu%2Fcollection%2Fembark%2FObjects-1%2Finfo%2F${encodeURIComponent(route.params.slug[0])}`, {
    //     auth: {
    //       username: 'Fr2fpegcBZ',
    //       password: 'Vi7vGnL3h2rtW5SuECoKRwTf'
    //     }
    //   })
    //   .then((output) => (todo.value = output.data))
    // )

    todo.value = [];

    // console.log(todo.value);

    useSeoMeta({
      ogTitle: () => `${todo.value.Disp_Title ? todo.value.Disp_Title.replace(/&quot;/g, '\"').replace(/&#39;/g, "\'") + ' | ' : ''}Colby College Museum of Art · Colby College`,
      title: () => `${todo.value.Disp_Title ? todo.value.Disp_Title.replace(/&quot;/g, '\"').replace(/&#39;/g, "\'") + ' | ' : ''}Colby College Museum of Art · Colby College`,
      ogDescription: () => todo.value?.Disp_Medium,
      description: () => todo.value?.Disp_Medium,
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
    console.log(`https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage/_source/https:%2F%2Fmuseum-data.colby.edu%2Fcollection%2Fembark%2FObjects-1%2Finfo%2F${encodeURIComponent(this.$route.params.slug[0])}`);

    await axios
      .get(`https://ccma-search-proof-8365887253.us-east-1.bonsaisearch.net/stage/_source/https:%2F%2Fmuseum-data.colby.edu%2Fcollection%2Fembark%2FObjects-1%2Finfo%2F${encodeURIComponent(this.$route.params.slug[0])}`, {
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
                rendered: `${post.Disp_Maker_1}, ${post.Disp_Title}, ${post.Disp_Create_DT}. ${post.Disp_Medium}${post.Disp_Dimen ? ', ' + post.Disp_Dimen : ''}. Colby College Museum of Art${post.Dedication ? ', ' + post.Dedication : ''}; ${post.Disp_Access_No}`,
              },
              alt_text: post.Disp_Medium,
              media_details: {
                sizes: {
                  full: {
                    source_url: `https://ccma-iiif-cache-service.fly.dev/iiif/2/${i.IIIF_URL.substring(i.IIIF_URL.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "")}/full/800%2C/0/default.jpg`,
                  },
                  mobile: {
                    source_url: `https://ccma-iiif-cache-service.fly.dev/iiif/2/${i.IIIF_URL.substring(i.IIIF_URL.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "")}/full/800%2C/0/default.jpg`,
                  }
                }
              }
            }
          }))
        }

        page.items = [
          {
            heading: 'Classification',
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
            heading: 'Provenance',
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
