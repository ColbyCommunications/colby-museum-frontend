<template>
  <div class="donate-form">
    <div class="donate-form__inner grid">
      <div class="donate-form__main">
        <div id="bbox-root"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      window.bboxInit = function () {
      bbox.showForm('5274e7f7-f60f-4a50-ad90-e33d15a9744d');
    };
    (function () {
      var e = document.createElement('script'); e.async = true; e.id = 'donateformscript';
      e.src = 'https://bbox.blackbaudhosting.com/webforms/bbox-min.js';
      document.getElementsByTagName('head')[0].appendChild(e);
    } ());
    }, 1000);
  },
  unmounted() {
    document.getElementsByTagName('head').removeChild(document.getElementById('donateformscript'));
  },
}
</script>

<style lang="scss">
#bbox-root {
  width: 100%;
}

.donate-form {
  &__main {

    form {
      zoom: 130%;
    }

    #bbox-msg-wrapper {
      width: 50px;
    }

    grid-column: span 12 / span 12;
    font-family: 'Libre Franklin';

    .BBFormSection {
      max-width: 100% !important;
      .BBFormSectionHeading {
        font-weight: 600 !important;
        border-bottom-color: #000 !important;
      }
    }

    input, select, textarea {
      border: 1px solid black !important;
    }

    input[type=checkbox]{
      appearance: auto;
    }

    input[type=submit]{
      background-color: #000 !important;
    }
    label.BBFormRadioPaymentSelected {
      background-color: #000 !important;
    }
    label.BBFormRadioPaymentNotSelected {
      color: #000 !important;
      border-color: #000 !important;
    }
  }
}
</style>