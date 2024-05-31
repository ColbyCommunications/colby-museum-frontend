const pageSEO = (props, type) => {
  const route = useRoute();
  const todo = ref({});

  // console.log(route);

  useFetch(() => 
    fetch(`${props.interface.endpoint}${type ? type : 'pages'}?slug=${route.params.slug ? route.params.slug : 'home'}`)
      .then(res => res.json())
      .then((output) => (todo.value = output[0]))
  )
  
  // console.log(todo.value);

  useSeoMeta({
    ogTitle: () => `${todo.value.title ? todo.value.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'") + ' | ' : ''}Colby College Museum of Art · Colby College`,
    title: () => `${todo.value.title ? todo.value.title?.rendered.replace(/&quot;/g, '\"').replace('&#8217;',"'") + ' | ' : ''}Colby College Museum of Art · Colby College`,
    ogDescription: () => todo.value.excerpt?.rendered,
    description: () => todo.value.excerpt?.rendered,
  });
}

export default pageSEO;