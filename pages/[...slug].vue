<template>
    <div class="page page--default">hello world</div>
</template>

<script>
    import axios from 'axios';

    import transitionConfig from '../helpers/transitionConfig';
    import seoConfig from '../helpers/seoConfig';

    export default {
        setup(props) {
            seoConfig(props);

            definePageMeta({
                pageTransition: transitionConfig,
            });
        },
        data() {
            return {
                title: undefined,
                fullPath: undefined,
                excerpt: undefined,
                breadcrumbs: undefined,
                components: undefined,
            };
        },
        props: {
            interface: {
                required: false,
            },
        },
        async created() {
            const page = this;
            const slug = this.$route.params.slug;
            let pageName;

            this.fullPath = this.$route.fullPath;

            console.log(this.$route);
            // console.log(this.$route.params);
            // console.log(this.$route.params.slug);
            // console.log(`${this.interface.endpoint}pages?slug=${this.$route.params.slug ? this.$route.params.slug : 'home'}`);
            // console.log(slug[slug.length - 1]);

            if (Array.isArray(slug)) {
                pageName = slug[slug.length - 1];
            } else if (slug) {
                pageName = slug;
            } else {
                pageName = 'home';
            }

            let response = await useFetch(`https://www.colby.edu/endpoints/v1/courses/`);
            console.log(response);
        },
        methods: {
            async getBreadcrumbs(post) {
                const component = this;

                await axios
                    .get(`${this.interface.endpoint}breadcrumbs/${post.id}`)
                    .then((output_b) => {
                        component.breadcrumbs = output_b.data;
                    });
            },
        },
    };
</script>
