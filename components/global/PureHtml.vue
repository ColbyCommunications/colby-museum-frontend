<script>
  import { defineComponent,h } from 'vue';

  export default defineComponent({
    props: {
      tag: {
        type: String,
        required: true,
      },
      html: {
        type: String,
        required: true,
      },
    },
    setup(props, { slots }) {
      return () => h(props.tag, { innerHTML: props.html });
    },
  });
</script>