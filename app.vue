<template>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <a
        id="skip-to-main-content-btn"
        class="btn--light btn--small"
        href="#main"
        v-text="'Skip to Main Content'"
      />
      <Header
        :primary="mainMenu"
        :utility="utilityMenu"
        :campusEvent="campusCurrentEvents"
        :downtownEvent="downtownCurrentEvents"
        :globalOptions="globalOptions"
      />
      <NuxtLayout>
        <NuxtPage :interface="interface" />
      </NuxtLayout>
      <Footer
        :primary="mainMenu"
        :utility="socialMenu"
        :globalOptions="globalOptions"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

import { useInterfaceStore } from '~/store/interface';

import footerItems from '~/assets/data/footer.yml';

export default {
  data() {
    return {
      globalOptions: {},
      interface: undefined,
      mainMenu: [],
      utilityMenu: [],
      socialMenu: [],
      headerItems: [],
      footerItems: [],
      campusCurrentEvents: undefined,
      downtownCurrentEvents: undefined,
    };
  },
  created() {
    const component = this;
    let campusEvents;
    let downtownEvents;

    this.interface = useInterfaceStore();

    // this.headerItems = headerItems;
    this.footerItems = footerItems;

    axios.get(`${this.interface.endpoint}menus`).then((output) => {
      component.mainMenu = output.data.site;
      component.utilityMenu = output.data.utility;
      component.socialMenu = output.data.social;
    });

    axios.get(`${this.interface.endpointv3}options/options`).then((output) => {
      component.globalOptions = output.data.acf;
    });

    axios
      .get(`${this.interface.endpoint}events?categories_exclude=1&chronologies=9`)
      .then((output) => {
          campusEvents = output.data.filter((event) => event.acf.location == 'campus');
          downtownEvents = output.data.filter((event) => event.acf.location == 'downtown');

          if (campusEvents.length >= 1) {
            component.campusCurrentEvents = campusEvents.map((i) => ({
              heading: i.title.rendered,
              location: i.acf.location,
              time: `${component.formatTime(
                  i.acf.start_time
              )}-${component.formatTime(i.acf.end_time)}`,
              button: {
                  title: 'Event Details',
                  url: i.link,
              },
            }));
          }

          if (downtownEvents.length >= 1) {
            component.downtownCurrentEvents = downtownEvents.map((i) => ({
              heading: i.title.rendered,
              location: i.acf.location,
              time: `${component.formatTime(
                  i.acf.start_time
              )}-${component.formatTime(i.acf.end_time)}`,
              button: {
                  title: 'Event Details',
                  url: i.link,
              },
            }));
          }
      });
  },
  mounted() {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    setTimeout(() => {
      // ScrollSmoother.create({
      //     smooth: 1.1,
      //     effects: true,
      // });
    }, 600);
  },
  methods: {
    formatTime(t) {
      const time = t.split(':');
      const hour = parseInt(time[0]);
      const min = time[1];
      const sec = parseInt(time[2]);
      const ampm = (hour >= 12) ? " p.m." : " a.m.";

      return `${hour == 12 || hour == 0 ? 12 : hour % 12}:${min.replace(/\s/g, '').replace('am', ' a.m.').replace('pm', ' p.m.').replace(' - ', '&ndash;')}`;
    },
  },
};
</script>
