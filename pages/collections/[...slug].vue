<template>
  <div class="page page--default">
    <Breadcrumbs
      v-if="$route.params.slug != ''"
      :current="{
        title: title,
        url: fullPath,
      }"
      :manual="[
        {
          title: 'Collection',
          url: '/collection',
        },
        {
          title: 'About the Collection',
          url: '/collection/about-the-collection',
        }
      ]"
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
    <BigArrowBtnSection
      :button="{
        reverse: true,
        title: 'About the Collection',
        url: '/collection/about-the-collection'
      }"
    />
    <BigArrowBtnSection
      v-if="embark_id"
      :align="'right'"
      :button="{
        title: 'View all works in this collection',
        url: `/objects/page-1?embark_id=${embark_id}`
      }"
    />
  </div>
</template>

<script>
import axios from 'axios';

import transitionConfig from '../helpers/transitionConfig';
import seoConfig from '../helpers/seoConfig';

export default {
  async setup(props) {
    const { data } = await seoConfig(props, 'collections');

    definePageMeta({
      pageTransition: transitionConfig,
    });

    const post = data.value[0];

    const embark_id = post.acf.embark_id;

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
      embark_id,
      components,
    }
  },
  props: {
    interface: {
      required: false,
    },
  }
}
</script>
