<template>
  <component
    :is="getComponent"
    v-bind="moduleData"
    :blockData="moduleData"
  />
</template>

<script>
export default {
  props: {
    moduleData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    getComponent() {
      const { type } = this.moduleData;

      return `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
    },
  },
};
</script>