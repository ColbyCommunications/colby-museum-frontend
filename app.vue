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
                <NuxtPage :interface="iface" />
            </NuxtLayout>
            <Footer :primary="mainMenu" :utility="socialMenu" :globalOptions="globalOptions" />
        </div>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { ScrollSmoother } from 'gsap/ScrollSmoother';
    import { useInterfaceStore } from '~/store/interface';
    import formatTimeRange from '~/helpers/formatTimeRange';

    // Helper function
    // function formatTime(t) {
    //     const time = t.split(':');
    //     const hour = parseInt(time[0]);
    //     const min = time[1];
    //     const sec = parseInt(time[2]);
    //     const ampm = hour >= 12 ? ' p.m.' : ' a.m.';

    //     return `${hour == 12 || hour == 0 ? 12 : hour % 12}:${min
    //         .replace(/\s/g, '')
    //         .replace('am', ' a.m.')
    //         .replace('pm', ' p.m.')
    //         .replace(' - ', '&ndash;')}`;
    // }

    // --- Logic from setup() is now at the top level ---

    const iface = useInterfaceStore(); // This variable is now used directly in the template

    const { data } = await useAsyncData('app', async () => {
        const menus = await $fetch(`${useInterfaceStore().endpoint}menus`);
        const { acf: globalOptions } = await $fetch(
            `${useInterfaceStore().endpointv3}options/options`
        );
        const events = await $fetch(
            `${useInterfaceStore().endpoint}events?categories_exclude=1&chronologies=9`
        );
        return { menus, globalOptions, events };
    });

    // --- Data processing ---

    const menus = data.value?.menus ?? {};
    const events = data.value?.events ?? [];
    const globalOptions = data.value?.globalOptions ?? {};

    const mainMenu = menus.site;
    const utilityMenu = menus.utility;
    const socialMenu = menus.social;

    const campusEvents = events.filter((event) => event.acf.location == 'campus');
    const downtownEvents = events.filter((event) => event.acf.location == 'downtown');

    // --- Variables are automatically exposed to the template ---

    let campusCurrentEvents = [];
    if (campusEvents.length >= 1) {
        campusCurrentEvents = campusEvents.map((i) => ({
            heading: i.title.rendered,
            location: i.acf.location,
            time: `${formatTimeRange(i.acf.start_time, i.acf.end_time)}`,
            button: {
                title: 'Event Details',
                url: i.link,
            },
        }));
    } else {
        campusCurrentEvents = [
            {
                location: 'No event scheduled for today.',
                button: {
                    title: "What's On View",
                    url: '/exhibitions/page-1?chronology=current&location=campus',
                },
            },
        ];
    }

    let downtownCurrentEvents = [];
    if (downtownEvents.length >= 1) {
        downtownCurrentEvents = downtownEvents.map((i) => ({
            heading: i.title.rendered,
            location: i.acf.location,
            time: `${formatTimeRange(i.acf.start_time, i.acf.end_time)}`,
            button: {
                title: 'Event Details',
                url: i.link,
            },
        }));
    } else {
        downtownCurrentEvents = [
            {
                location: 'No event scheduled for today.',
                button: {
                    title: "What's On View",
                    url: '/exhibitions/page-1?chronology=current&location=downtown',
                },
            },
        ];
    }

    // const interface = iface; // <--- REMOVED THIS RESERVED WORD
    const headerItems = [];
    const footerItems = [];

    // --- Lifecycle Hooks ---

    onMounted(() => {
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

        setTimeout(() => {
            // ScrollSmoother.create({
            //     smooth: 1.1,
            //     effects: true,
            // });
        }, 600);
    });
</script>
