<script>
  import { defineComponent,h } from 'vue';
  import DOMPurify from 'isomorphic-dompurify'

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
      return () => h(props.tag, { innerHTML: DOMPurify.sanitize(props.html) });
    },
  });
</script>