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
        <NuxtPage :interface="interface"/>
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
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

import { useInterfaceStore } from '~/store/interface';

import footerItems from '~/assets/data/footer.yml';

function formatTime(t) {
      const time = t.split(':');
      const hour = parseInt(time[0]);
      const min = time[1];
      const sec = parseInt(time[2]);
      const ampm = (hour >= 12) ? " p.m." : " a.m.";

      return `${hour == 12 || hour == 0 ? 12 : hour % 12}:${min.replace(/\s/g, '').replace('am', ' a.m.').replace('pm', ' p.m.').replace(' - ', '&ndash;')}`;
    }

export default {
  async setup() {
    let footerItems = [];
    const iface = useInterfaceStore()
    const { data } = await useAsyncData( 'app', async () => {
      
      const menus = await $fetch(`${useInterfaceStore().endpoint}menus`)

      const { acf: globalOptions } = await $fetch(`${useInterfaceStore().endpointv3}options/options`)

      const events = await $fetch(`${useInterfaceStore().endpoint}events?categories_exclude=1&chronologies=9`)

      return { menus, globalOptions, events }
    })

    const menus = data.value?.menus ?? {}
    const events = data.value?.events ?? []
    const globalOptions = data.value?.globalOptions ?? {}

    const mainMenu = menus.site;
    const utilityMenu = menus.utility;
    const socialMenu = menus.social;

    const campusEvents = events.filter((event) => event.acf.location == 'campus');
    const downtownEvents = events.filter((event) => event.acf.location == 'downtown');

    let campusCurrentEvents = []
    if (campusEvents.length >= 1) {
      campusCurrentEvents = campusEvents.map((i) => ({
        heading: i.title.rendered,
        location: i.acf.location,
        time: `${formatTime(
            i.acf.start_time
        )}-${formatTime(i.acf.end_time)}`,
        button: {
            title: 'Event Details',
            url: i.link,
        },
      }));
    } else {
      campusCurrentEvents = [{
          location: 'No event scheduled for today.',
          // time: new Date().getDay() == 0 ? '12:00 p.m.–5:00 p.m.' : '10:00 a.m.–5:00 p.m.',
          button: {
            title: "What's On",
            url: '/exhibitions/page-1?chronology=current&location=campus',
          }
        }]
    }

    let downtownCurrentEvents = []
    if (downtownEvents.length >= 1) {
      downtownCurrentEvents = downtownEvents.map((i) => ({
        heading: i.title.rendered,
        location: i.acf.location,
        time: `${formatTime(
            i.acf.start_time
        )}-${formatTime(i.acf.end_time)}`,
        button: {
            title: 'Event Details',
            url: i.link,
        },
      }));
    } else {
      downtownCurrentEvents = [{
          location: 'No event scheduled for today.',
          // time: '11:00 a.m.–7:00 p.m.',
          button: {
            title: "What's On",
            url: '/exhibitions/page-1?chronology=current&location=downtown',
          }
        }]
    }

    return {
      globalOptions,
      interface: iface,
      mainMenu,
      utilityMenu,
      socialMenu,
      headerItems: [],
      footerItems: [],
      campusCurrentEvents,
      downtownCurrentEvents,
    }
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
};
</script>
