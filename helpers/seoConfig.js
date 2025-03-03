import axios from "axios";
import { useInterfaceStore } from "~/store/interface";

const pageSEO = (props, type) => {
  const route = useRoute();
  const todo = ref({});
  let imagePath;

  // console.log(route);

  useFetch(() => 
    fetch(`${props.interface.endpoint}${type ? type : 'pages'}?slug=${route.params.slug ? route.params.slug : 'home'}`)
      .then(res => res.json())
      .then((output) => (todo.value = output[0]))
      .then(async () => { 
        let imageObj;
  
        await axios
          .get(`${useInterfaceStore().endpoint}media/${todo.value.featured_media}`)
          .then((output) => {
            imageObj = output.data;
            imagePath = imageObj ? imageObj.media_details.sizes.desktop.source_url : '';
            console.log(imagePath);
          })
          .then(() => {
            useSeoMeta({
              ogTitle: () => `${todo.value.title ? todo.value.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'").replace('&#038;',"&") + ' | ' : ''}Colby College Museum of Art · Colby College`,
              title: () => `${todo.value.title ? todo.value.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'").replace('&#038;',"&") + ' | ' : ''}Colby College Museum of Art · Colby College`,
              ogDescription: () => todo.value.excerpt?.rendered.replace(/<p[^>]*>|<\/p>/g, ''),
              description: () => todo.value.excerpt?.rendered.replace(/<p[^>]*>|<\/p>/g, ''),
              ogImage: () => `${imagePath}`,
            });
          });
       })
      .then(() => {
        // console.log('HERE');
        // console.log(todo.value);

        
      })
  )
}

export default pageSEO;