<template>
    <nav aria-label="Breadcrumb" class="breadcrumbs" ref="breadcrumbs">
        <div class="breadcrumbs__inner grid">
            <div class="breadcrumbs__main">
                <ul>
                    <li>
                        <span class="context__word">
                            <span>
                                <NuxtLink :to="'/'">Home</NuxtLink>
                            </span>
                        </span>
                    </li>
                    <li v-for="(item, index) in items" :key="`breadcrumb_${index}`">
                        <span class="context__word">
                            <span>
                                <NuxtLink
                                    :to="item.url.replace(/^.*\/\/[^\/]+/, '').replace(/\/$/, '')"
                                >
                                    <IconArrow />
                                    <span v-html="item.title" />
                                </NuxtLink>
                            </span>
                        </span>
                    </li>
                    <li v-if="Array.isArray(manual)" v-for="(item, index) in manual">
                        <span class="context__word">
                            <span>
                                <NuxtLink :to="item.url">
                                    <IconArrow />
                                    <span v-html="item.title" />
                                </NuxtLink>
                            </span>
                        </span>
                    </li>
                    <li v-else-if="manual">
                        <span class="context__word">
                            <span>
                                <NuxtLink :to="manual.url">
                                    <IconArrow />
                                    <span v-html="manual.title" />
                                </NuxtLink>
                            </span>
                        </span>
                    </li>
                    <li class="current">
                        <span class="context__word">
                            <span>
                                <NuxtLink :to="current.url" aria-current="page">
                                    <IconArrow />
                                    <span v-html="current.title" />
                                </NuxtLink>
                            </span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import gsap from 'gsap';

    // 1. Replaces the 'props' option
    const props = defineProps({
        items: {
            required: false,
        },
        current: {
            type: Object,
            // Use a factory function for object/array defaults
            default: () => ({
                url: '/',
                title: '',
            }),
        },
        manual: {
            required: false,
        },
    });

    // 2. Replaces this.$refs.breadcrumbs
    // This 'breadcrumbs' ref is automatically linked to the ref="breadcrumbs" in the template
    const breadcrumbs = ref(null);

    // 3. Replaces the 'animate' method
    const animate = () => {
        let mm = gsap.matchMedia();

        let list = breadcrumbs.value; // Use breadcrumbs.value instead of this.$refs.breadcrumbs

        if (list) {
            let listWords = list.querySelectorAll('.context__word span');

            mm.add('(prefers-reduced-motion: no-preference)', () => {
                gsap.to(listWords, {
                    scrollTrigger: {
                        trigger: breadcrumbs.value, // Use .value
                        toggleActions: 'restart none restart none',
                        start: 'top 85%',
                    },
                    y: 0,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: 'expo.out',
                });
            });

            mm.add('(prefers-reduced-motion: reduce)', () => {
                gsap.to(listWords, {
                    y: 0,
                    duration: 0,
                    ease: 'expo.out',
                });
            });
        }
    };

    // 4. Replaces the 'mounted' hook
    onMounted(() => {
        setTimeout(() => {
            animate(); // Call the function directly
        }, 100);
    });
</script>

<style lang="scss">
    /* The styles remain exactly the same */
    @use 'sass:map';

    .breadcrumbs {
        @extend .pagination;

        &__main {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            grid-column: span 12 / span 12;
        }

        svg {
            margin-left: 0;
            margin-right: 8px; //test

            @include breakpoint(medium) {
                margin-right: 0.833vw;
            }
        }

        ul {
            overflow-y: auto;
            overflow-x: auto;
        }

        li > span,
        button,
        a {
            @include paragraph-style-2;

            @include breakpoint(large) {
                font-size: 1.389vw !important;
                letter-spacing: -0.033vw !important;
            }
        }

        li {
            white-space: nowrap;
        }

        li + li {
            margin-left: 8px;

            @include breakpoint(medium) {
                margin-left: 0.833vw;
            }
        }

        svg {
            @include breakpoint(medium) {
                width: 1.319vw;
                margin-left: 0;
            }
        }

        ul li.current a {
            color: map.get($layout-colors, ambiant);

            .dark-mode & {
                color: map.get($layout-dm-colors, ambiant);
            }
        }
    }
</style>
