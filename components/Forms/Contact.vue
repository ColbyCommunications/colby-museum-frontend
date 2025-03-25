<template>
  <form class="form" @submit.prevent="submitForm">
    <div class="form__inner grid">
      <div class="form__half-col">
        <label>Name</label>
        <input class="input" type="text" name="name" v-model="form.name"/>
      </div>
      <div class="form__half-col">
        <label>Email</label>
        <input class="input" type="email" name="email"  v-model="form.email"/>
      </div>
      <div class="form__full-col">
        <label>Message</label>
        <textarea class="input" name="message" v-model="form.message"></textarea>
      </div>
      <div class="form__full-col">
        <button
          class="big-arrow-btn"
          type="submit"
        >
          <span class="big-arrow-btn__word-wrap">
            <!-- <div
              class="horizontal-curtain"
              ref="curtain"
            /> -->
            Submit
          </span>
          <span class="big-arrow-btn__arrow-wrap">
            <svg ref="arrow" viewBox="0 0 146.6 46.5">
              <path d="m146.5 17-90-17-2 10.8 34.9 6.6H0v11h89.7l-35.3 7.4 2.2 10.7 90-18.7z" />
            </svg>
          </span>
        </button>
        <p class="paragraph-style-2" v-html="result" />
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  access_key: '4ed80fe0-85fe-429b-b472-83bce6d66a14',
  subject: 'New Submission from Web3Forms',
  name: '',
  email: '',
  message: '',

});

const result = ref('');
const status = ref('');
const alert = ref('');

const submitForm = async () => {
  result.value = "Please wait...";
  try {
    const response = await $fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: form.value,
    });

    console.log(response); // You can remove this line if you don't need it

    result.value = response.message;

    if (response.status === 200) {
      status.value = "success";
      alert.value = 'Thank you for your inquiry. Your submission was successful';
    } else {
      console.log(response); // Log for debugging, can be removed
      status.value = "error";
    }
  } catch (error) {
    console.log(error); // Log for debugging, can be removed
    status.value = "error";
    result.value = "Something went wrong!";
  } finally {
    // Reset form after submission
    form.value.name = "";
    form.value.email = "";
    form.value.message = "";

    // Clear result and status after 5 seconds
    setTimeout(() => {
      result.value = "";
      status.value = "";
    }, 5000);
  }
};
</script>

<style lang="scss">
.form {
  margin-top: 60px;

  @include breakpoint(large) {
    margin-top: 10vh;
  }

  &__full-col,
  &__half-col {
    display: grid;
    grid-column: span 12 / span 12;
    margin-bottom: 32px;

    @include breakpoint(large) {
      margin-bottom: 7.872vh;
    }
  }

  &__half-col {
    @include breakpoint(medium) {
      grid-column: span 6 / span 6;
    }
  }

  label {
    @include paragraph-style-2;

    display: inline-block;
    font-weight: 700;
    margin-bottom: 18px;

    @include breakpoint(medium) {
      margin-bottom: 2.214vh;
    }
  }

  .big-arrow-btn {
    justify-self: flex-end;
    cursor: pointer;
    padding: 0;
  }

  .big-arrow-btn__arrow-wrap svg {
    transform: none;
  }
}
</style>