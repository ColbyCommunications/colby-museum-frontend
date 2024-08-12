<template>
    <div>Hello World</div>
</template>

<script>
    // import axios from 'axios';
    // import { gsap } from 'gsap';
    // import { ScrollTrigger } from "gsap/ScrollTrigger";
    // import { ScrollSmoother } from 'gsap/ScrollSmoother';

    // import { useInterfaceStore } from "~/store/interface";

    // import footerItems from '~/assets/data/footer.yml';

    // export default {
    //   // setup() {
    //   //   useHead({
    //   //     titleTemplate: '%s | Colby College Museum of Art · Colby College',
    //   //   }),
    //   // },
    //   data() {
    //     return {
    //       interface: undefined,
    //       mainMenu: [],
    //       utilityMenu: [],
    //       socialMenu: [],
    //       headerItems: [],
    //       footerItems: [],
    //       campusCurrentEvent: undefined,
    //       downtownCurrentEvent: undefined,
    //     }
    //   },
    //   created() {
    //     const component = this;
    //     let campusEvents;
    //     let downtownEvents;

    //     this.interface = useInterfaceStore();

    //     // this.headerItems = headerItems;
    //     this.footerItems = footerItems;

    //     axios
    //       .get(`${this.interface.endpoint}menus/10`)
    //       .then((output) => {
    //         component.mainMenu = output.data;
    //       });

    //     axios
    //       .get(`${this.interface.endpoint}menus/12`)
    //       .then((output) => {
    //         component.utilityMenu = output.data;
    //       });

    //     axios
    //       .get(`${this.interface.endpoint}menus/11`)
    //       .then((output) => {
    //         component.socialMenu = output.data;
    //       });

    //     axios
    //       .get(`${this.interface.endpoint}events?categories_exclude=1&chronologies=9`)
    //       .then((output) => {
    //         campusEvents = output.data.filter((event) => event.acf.location == 'campus');
    //         downtownEvents = output.data.filter((event) => event.acf.location == 'downtown');

    //         if (campusEvents.length >= 1) {
    //           component.campusCurrentEvent = {
    //             heading: campusEvents[0].title.rendered,
    //             location: campusEvents[0].acf.location,
    //             time: `${component.formatTime(campusEvents[0].acf.start_time)} - ${component.formatTime(campusEvents[0].acf.end_time)}`,
    //             button: {
    //               title: 'Event Details',
    //               url: campusEvents[0].link
    //             }
    //           }
    //         }

    //         if (downtownEvents.length >= 1) {
    //           component.downtownCurrentEvent = {
    //             heading: downtownEvents[0].title.rendered,
    //             location: downtownEvents[0].acf.location,
    //             time: `${component.formatTime(downtownEvents[0].acf.start_time)} - ${component.formatTime(downtownEvents[0].acf.end_time)}`,
    //             button: {
    //               title: 'Event Details',
    //               url: downtownEvents[0].link
    //             }
    //           }
    //         }
    //       });
    //   },
    //   mounted() {
    //     gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    //     setTimeout(() => {
    //       ScrollSmoother.create({
    //         smooth: 1.1,
    //         effects: true,
    //       });
    //     }, 600);
    //   },
    //   methods: {
    //     formatTime(t) {
    //       const time = t.split(':');
    //       const hour = parseInt(time[0]);
    //       const min = time[1];
    //       const sec = parseInt(time[2]);
    //       const ampm = (hour >= 12) ? "p" : "a";

    //       return `${hour == 12 || hour == 0 ? 12 : hour % 12}${ampm}`
    //     }
    //   }
    // }
</script>
