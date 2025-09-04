
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
    <DonateForm />
    <div class="core-paragraph grid paragraph-style-2" type="core-paragraph">
      <p><strong>Contact</strong><br>Christina DeYoung, associate director of museum development<br>207-509-1630 (mobile)<br><a href="mailto:cdeyoung@colby.edu">cdeyoung@colby.edu</a></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import transitionConfig from '../helpers/transitionConfig';
import seoConfig from '../helpers/seoConfig';
import { useInterfaceStore } from '~/store/interface'

export default {
  async setup(props) {
    const iface = useInterfaceStore()
    const route = useRoute()

    useSeoMeta({
      ogTitle: () => 'Friends of Art | Colby College Museum of Art',
      title: () => 'Friends of Art | Colby College Museum of Art',
      ogDescription: () => 'Friends of Art at the Colby College Museum of Art.',
      description: () => 'Friends of Art at the Colby College Museum of Art.',
    });

    definePageMeta({
      pageTransition: transitionConfig,
    });

    const { data } = await useAsyncData('friends-of-art', async () => {
      const data = await $fetch(`${iface.endpoint}pages?slug=friends-of-art`)
      const post = data?.at(0)

      const crumbs = await $fetch(`${iface.endpoint}breadcrumbs/${post?.id}`)

      return { post, crumbs }
    })

    const post = data.value?.post
    const breadcrumbs = data.value?.crumbs

    const title = post?.title?.rendered
      .replace(/–/g, '-')
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/’/g, "'");
    
    const excerpt = post?.excerpt?.rendered?.replace(/<\/?[^>]+(>|$)/g, '');
    const heading_visible = post?.acf?.heading_visible;
    const excerpt_visible = post?.acf?.excerpt_visible;

    const components = post?.block_data?.map((component) => {
      
      component.type = component.blockName
        .replace('acf/','')
        .replace(/\//g,'-');

      return {
        type: component.type,
        ...component.attrs.data,
        attrs: component.attrs.data ? undefined : component.attrs,
      };
    });
    // console.log(route)
    return {
      title,
      fullPath: route.fullPath,
      excerpt,
      breadcrumbs,
      components,
      heading_visible,
      excerpt_visible
    };
  }
}
</script>
