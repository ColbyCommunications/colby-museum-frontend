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

export default {
  async setup(props) {
    definePageMeta({
      pageTransition: transitionConfig,
    });

    const { data, error } = await seoConfig(props, 'posts');

    const post = data.value[0];

    const title = post.title.rendered
      .replace(/–/g, '-')
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/’/g, "'");
    
    const excerpt = post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '');

    const components = post.block_data.map((component) => {
      
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
