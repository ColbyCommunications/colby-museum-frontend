<template>
  <footer class="footer">
    <div class="footer__inner grid">
      <div class="footer__faux-col" />
      <div class="footer__locations">
        <div
          class="footer__location"
        >
          <h2>Campus Location</h2>
          <address><a href="https://www.google.com/maps/place/5600+Mayflower+Hill+Dr,+Waterville,+ME+04901/@44.5650198,-69.6606893,17z/data=!3m1!4b1!4m6!3m5!1s0x4cb1e45077d0e887:0x7f8cd7028d21465!8m2!3d44.5650198!4d-69.6606893!16s%2Fg%2F11bw3_cn68?entry=ttu" target="_blank">5600 Mayflower Hill Dr.<br>Waterville, ME 04901</a></address>
          <a href="tel:+1 207-859-5600">+1 207-859-5600</a>
          <span :class="[campusIsOpen ? 'open' : 'closed']">{{ campusIsOpen ? 'Open' : 'Closed' }} <span>10a-5p</span></span>
        </div>
        <div
          class="footer__location"
        >
          <h2>Downtown Location</h2>
          <address><a href="https://www.google.com/maps/@44.5498695,-69.6300326,3a,75y,70.06h,90t/data=!3m7!1e1!3m5!1s2ivqj8ZwfyHpM4m1vxP7fA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0%26panoid%3D2ivqj8ZwfyHpM4m1vxP7fA%26yaw%3D70.06!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI1MDMxMC4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D" target="_blank">93 Main St.,<br>Waterville, ME 04903</a></address>
          <a href="tel:+1 207-859-5600">+1 207-163-7734</a>
          <span :class="[downtownIsOpen ? 'open' : 'closed']">{{ downtownIsOpen ? 'Open' : 'Closed' }} <span>11a-7p</span></span>
        </div>
      </div>
      <div class="footer__links">
        <ul>
          <li v-for="(item, index) in primary">
            <NuxtLink
              :to="item.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '')"
              v-text="item.title"
            />
          </li>
        </ul>
        <ul>
          <li v-for="(item, index) in utility">
            <a :href="item.url" v-text="item.title" target="_blank" />
          </li>
        </ul>
      </div>
    </div>
    <div class="footer__inner grid">
      <div class="footer__secondary">
        <Btn
          :title="'Request Information'"
          :url="'/request-info'"
          :size="'large'"
        />
        <!-- <input class="footer__newsletter input" placeholder="Newsletter Sign Up" /> -->
        <!-- Begin Constant Contact Inline Form Code -->
        <div class="footer__newsletter-wrap">
          <IconArrow class="footer__newsletter-arrow" />
          <div class="ctct-inline-form" data-form-id="e6766102-4eba-4d73-bbb5-cc539b830136"></div>
        </div>
        <!-- End Constant Contact Inline Form Code -->
        <DarkLightModeBtn />
      </div>
    </div>
    <div class="footer__inner grid">
      <div class="footer__tertiary">
        <div class="heading-style-1"
          v-text="'Colby College Museum of Art'"
        />
        <p
          class="subheading-style-4"
          v-text="`Terms of Use, Privacy Policy, Non-Discrimination Policy© ${ new Date().getFullYear() } Colby Museum of Art. All rights reserved.`"
        />
      </div>
    </div>
  </footer>
</template>

<script>
import isOpen from '../helpers/isOpen';

export default {
  data() {
    return {
      campusIsOpen: undefined,
      downtownIsOpen: undefined,
    };
  },
  props: {
    primary: {
      type: Array,
      required: false,
    },
    utility: {
      type: Array,
      required: false,
    },
  },
  mounted() {
    this.campusIsOpen = isOpen('10:00:00', '17:00:00', 'campus');
    this.downtownIsOpen = isOpen('11:00:00', '19:00:00', 'downtown');

    setInterval(() => {
      this.campusIsOpen = isOpen('10:00:00', '17:00:00', 'campus');
      this.downtownIsOpen = isOpen('11:00:00', '19:00:00', 'downtown');
    }, 60 * 1000);

    const ccScript1 = document.createElement('script');
    const ccScript2 = document.createElement('script');

    ccScript1.innerHTML = 'var _ctct_m = "47ec7668b176ee2c3f56b68b9b753b33";';

    ccScript2.id = 'signupScript';
    ccScript2.src = '//static.ctctcdn.com/js/signup-form-widget/current/signup-form-widget.min.js';
    ccScript2.async = true;
    ccScript2.defer = true;

    document.body.appendChild(ccScript1);
    document.body.appendChild(ccScript2);

    setTimeout(() => {
      document.getElementById('email_address_1').placeholder = 'Newsletter Sign Up';
    }, 6000);
  },
}
</script>

<style lang="scss">
@use "sass:map";

.footer {
  margin-top: 100px;
  padding-bottom: 40px;

  @include breakpoint(medium) {
    padding-bottom: 80px;
  }

  @include breakpoint(large) {
    margin-top: 12.300vh;
    padding-bottom: 9vh;
  }

  &__inner + &__inner {
    margin-top: 50px;

    @include breakpoint(medium) {
      margin-top: 80px;
    }

    @include breakpoint(large) {
      margin-top: 9vh;
    }
  }

  &__faux-col {
    grid-column: span 12 / span 12;
    padding-top: 60px;
    @extend .border-global--top;

    @include breakpoint(large) {
      padding-top: 9vh;
    }

    &::before {
      display: none;
    }
  }

  &__locations {
    grid-column: span 12 / span 12;

    @include breakpoint(medium) {
      display: flex;
    }

    @include breakpoint(large) {
      grid-column: span 7 / span 7;
    }
  }

  &__locations + &__links {
    margin-top: 52px;

    @include breakpoint(large) {
      margin-top: 0;
    }
  }

  &__location {
    h2 {
      @extend .subheading-style-4;

      text-transform: uppercase;

      + address {
        margin-top: 16px;

        @include breakpoint(large) {
          margin-top: 1.4vh;
        }
      }
    }

    h2,
    a,
    span {
      font-weight: 700;
    }

    a,
    span {
      @extend .paragraph-style-2;
    }

    a {
      color: map.get($layout-colors, color);
      text-decoration: none;

      .dark-mode & {
        color: map.get($layout-dm-colors, color);
      }

      &:hover {
        color: map.get($layout-colors, ambiant);

        .dark-mode & {
          color: map.get($layout-dm-colors, ambiant);
        }
      }
    }

    > a {
      display: block;
      margin-top: 0;
    }

    > span {
      display: inline-flex;
      align-items: center;
      margin-top: 20px;

      @include breakpoint(large) {
        margin-top: 3vh;
      }

      &::before {
        @extend .activity-signal;
      }

      &.closed::before {
        background-color: map.get($signal-colors, closed);
      }
    }

    span span {
      font-weight: 400;
      margin-left: 6px;

      @include breakpoint(medium) {
        margin-left: 0.417vw;
      }
    }
  }

  &__location + &__location {
    margin-top: 52px;

    @include breakpoint(medium) {
      margin-top: 0;
      margin-left: 6.111vw;
    }
  }

  &__links {
    grid-column: span 12 / span 12;

    @include breakpoint(large) {
      display: flex;
      justify-content: space-between;
      grid-column: span 5 / span 5;
    }
  }

  ul + ul {
    margin-top: 52px;

    @include breakpoint(medium) {
      margin-top: 30px;
    }

    @include breakpoint(large) {
      margin-top: 0;
    }
  }

  li {
    @include paragraph-style-2;

    @include breakpoint(medium) {
      display: inline-block;
      margin-bottom: 10px;
      margin-right: 26px;
    }

    @include breakpoint(large) {
      display: block;
      margin-bottom: 0;
      margin-right: 0;
    }

    a {
      color: map.get($layout-colors, color);
      font-weight: 700;
      text-decoration: none;

      .dark-mode & {
        color: map.get($layout-dm-colors, color);
      }

      &:hover {
        color: map.get($layout-colors, ambiant);

        .dark-mode & {
          color: map.get($layout-dm-colors, ambiant);
        }
      }
    }
  }

  &__secondary {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__secondary,
  &__tertiary {
    grid-column: span 12 / span 12;

    @include breakpoint(large) {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .btn + .input,
  .input + .dark-light-mode-btn {
    margin-top: 32px;

    @include breakpoint(large) {
      margin-top: 0;
    }
  }

  &__newsletter.input,
  div.ctct-form-embed form.ctct-form-custom input.ctct-form-element {

    @include breakpoint(medium) {
      width: 80vw;
    }

    @include breakpoint(large) {
      width: 44vw;
    }
    
  }

  .heading-style-1 {
    font-size: 40px;
    flex-shrink: 0;
    color: map.get($layout-colors, ambiant);

    .dark-mode & {
      color: map.get($layout-dm-colors, ambiant);
    }

    @include breakpoint(medium) {
      font-size: 3.611vw; // 52px / 1440px
    }
  }

  .heading-style-1 + .subheading-style-4 {
    margin-top: 40px;

    @include breakpoint(medium) {
      margin-top: 20px;
    }

    @include breakpoint(large) {
      margin-top: 0;
      margin-left: 20vw;
    }
  }

  .btn-curtain {
    display: none;
  }

  &__newsletter-wrap {
    position: relative;
    width: 100%;

    @include breakpoint(medium) {
      width: auto;
    }
  }

  &__newsletter-arrow {
    position: absolute;
    top: 50%;
    right: 0;
    width: 28px;
    margin-right: 6px;
    fill: map.get($layout-colors, color);
    transform: translateY(-50%) rotate(-90deg);
    transition: transform 0.2s $ease-default;
    pointer-events: none;

    @include breakpoint(medium) {
      width: 1.875vw;
      margin-right: 1.667vw;
    }

    .dark-mode & {
      fill: map.get($layout-dm-colors, color);
    }
  }

  .ctct-inline-form {
    margin: 32px 0;

    @include breakpoint(large) {
      margin: 0;
    }
  }

  .ctct-form-custom > .ctct-form-header,
  .ctct-form-custom > .ctct-form-text {
    display: none;
  }

  .ctct-form-defaults {
    padding: 0 !important;
    background-color: transparent !important;
  }

  div.ctct-form-embed form.ctct-form-custom {
    min-height: 0;
  }

  div.ctct-form-embed form.ctct-form-custom div.ctct-form-field {
    margin-bottom: 0;
  }

  div.ctct-form-embed form.ctct-form-custom label.ctct-form-label {
    @extend .sr-only;
  }

  div.ctct-form-embed form.ctct-form-custom input.ctct-form-element {
    @extend .input;

    height: auto !important;
  }

  div.ctct-form-embed div.ctct-form-defaults p.ctct-form-footer {
    padding: 0;
  }

  div.ctct-form-embed div.ctct-form-defaults h2.ctct-form-header {
    @extend .heading-style-3;

    color: map.get($layout-colors, color);

    .dark-mode & {
      color: map.get($layout-dm-colors, color);
    }
  }

  div.ctct-form-embed div.ctct-form-defaults p.ctct-form-text {
    @extend .paragraph-style-3;

    color: map.get($layout-colors, color);

    .dark-mode & {
      color: map.get($layout-dm-colors, color);
    }
  }

  .ctct-form-button {
    display: none !important;
  }

  #first_name_field_1,
  #last_name_field_1,
  #gdpr_text,
  #ctct_recaptcha_1 {
    display: none;
  }
}
</style>