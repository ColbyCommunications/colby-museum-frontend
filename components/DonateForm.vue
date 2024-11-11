<template>
  <div class="donate-form">
    <div class="donate-form__inner grid">
      <div class="donate-form__main">
        <div id="bbox-root">&nbsp;</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      window.bboxInit = function () {
      bbox.showForm('58d84867-c131-4a69-a6d4-81c6acf09f52');
      };(function () {
      var e = document.createElement('script'); e.async = true;
      e.src = 'https://bbox.blackbaudhosting.com/webforms/bbox-min.js';
      document.getElementsByTagName('head')[0].appendChild(e);
      } ());var DDCONF = {API_KEY: "5TJh82ubOAlX1EP", campaign: document.title};

      if (doublethedonation) {
        doublethedonation.integrations.embed.onlineexpress.v1.init();
      }
    }, 1000);
  }
}
</script>

<style lang="scss">
#bbox-root {
  width: 100%;
}

.donate-form {
  &__main {
    grid-column: span 8 / span 8;
    grid-column-start: 3;
  }
}
</style>