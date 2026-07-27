<template>
    <div
      class="core-audio grid"
    >
        <audio controls :src="attrs.src" class="audio-player"></audio>
    </div>
</template>
  
<script setup>
    const props = defineProps({
        attrs: {
            type: Object,
            required: true,
        }
    });

</script>
  
<style scoped>
.core-audio {
    margin-bottom: 2rem;
}
audio {
    width: 300px; /* Changes the horizontal size */
    display: block;
}

@media (min-width: 768px) {
  audio {
    width: 500px; /* Locks into a specific desktop size */
  }
}

/* Media Query: Adjusts size for large desktop monitors */
@media (min-width: 1200px) {
  audio {
    width: 600px; 
  }
}
</style>