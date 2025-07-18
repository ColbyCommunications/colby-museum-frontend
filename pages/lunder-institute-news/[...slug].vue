$route.<template>
  <div class="page page--default">
    <Breadcrumbs
      v-if="$route.params.slug != ''"
      :current="{
        title: title,
        url: $route.fullPath,
      }"
      :manual="{
        title: 'Lunder Institute News',
        url: '/news/page-1?category=6',
      }"
    />
    <IntroContext
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
import { useInterfaceStore } from '~/store/interface';

export default {
  async setup(props) {
    const route = useRoute()
    const iface = useInterfaceStore()

    definePageMeta({
      pageTransition: transitionConfig,
    });

    const { data: post } = await useAsyncData(`lunder-news-${route.params.slug}`, async () => {
      const { data } = await seoConfig({interface: iface}, 'posts');

      const post = computed(() => data.value.at(0));

      return post.value
    })

    const title = post.value?.title?.rendered
      .replace(/–/g, '-')
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/’/g, "'");
    
    const excerpt = post.value?.excerpt?.rendered?.replace(/<\/?[^>]+(>|$)/g, '');

    const components = post.value?.block_data?.map((component) => {
      
      component.type = component.blockName
        .replace('acf/','')
        .replace(/\//g,'-');

      return {
        type: component.type,
        ...component.attrs.data,
        attrs: component.attrs.data ? undefined : component.attrs,
        innerHTML: component.rendered ? component.rendered : undefined,
      };
    });

    return {
      title,
      excerpt,
      components,
      breadcrumbs: []
    };
  },
  props: {
    interface: {
      required: false,
    },
  },
}
</script>
