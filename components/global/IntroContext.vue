<template>
    <div class="intro-context" :class="{ 'intro-context--buttoned': button }">
        <div class="intro-context__inner grid">
            <div class="intro-context__main">
                <Context
                    :size="'xlarge'"
                    :heading="heading"
                    :headingElement="headingElement"
                    :subheading="subheading"
                    :subheading2="subheading2"
                    :paragraph="paragraph"
                />
                <BigArrowBtn v-if="button" v-bind="button" />
            </div>
        </div>
    </div>
</template>

<script>
    import Paragraph from './core/Paragraph.vue';

    export default {
        props: {
            heading: {
                // type: String,
                required: true,
            },
            headingElement: {
                type: String,
                required: false,
                default: 'h2',
            },
            subheading: {
                type: String,
                required: false,
            },
            subheading2: {
                type: String,
                required: false,
            },
            paragraph: {
                type: String,
                required: false,
                default: '',
            },
            button: {
                required: false,
            },
        },
    };
</script>

<style lang="scss">
    .intro-context {
        &.sr-only--heading.sr-only--excerpt {
            @extend .sr-only;
        }

        @include breakpoint(large) {
            min-height: 4.235vw;
        }

        &__main {
            grid-column: span 12 / span 12;

            display: flex;
            flex-direction: column;

            @include breakpoint(medium) {
                .intro-context--buttoned & {
                    flex-direction: row;
                    justify-content: space-between;
                }
            }
        }

        .context + .big-arrow-btn {
            margin-top: 32px;

            @include breakpoint(medium) {
                margin-top: 0;
            }
        }

        + div {
            margin-top: 40px;

            @include breakpoint(large) {
                margin-top: 5.9vh; // 813px / 48px
            }
        }

        + .intro-context {
            margin-top: 100px;

            @include breakpoint(large) {
                margin-top: 12vh;
            }
        }

        + .article-grid--posts {
            margin-top: 100px;

            @include breakpoint(large) {
                margin-top: 6vh; // 12vh prior
            }
        }

        + .core-paragraph {
            @include breakpoint(large) {
                margin-top: 2.9vh;
            }
        }

        // + .media-context {
        //   margin-top: 80px;

        //   @include breakpoint(medium) {
        //     margin-top: 9.84vh;
        //   }
        // }
    }
</style>
