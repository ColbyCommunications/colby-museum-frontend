<template>
  <div>
    <h2>Oops! Something went wrong with that page. The error code was {{ error?.statusCode }}</h2>
    <span>{{ error.message }}</span>
    <div v-html="error.stack" />
    <button @click="handleError">Go Home</button>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>