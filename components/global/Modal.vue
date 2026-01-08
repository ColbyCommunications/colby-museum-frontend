<template>
    <div class="modal" :class="[interface.modal ? 'modal--active' : '']" ref="modal">
        <button class="modal__button" @click="toggleModal()">
            <span class="sr-only" v-text="'Close modal'" />
            <IconX />
        </button>
        <slot />
    </div>
</template>

<script>
    import { useInterfaceStore } from '~/store/interface';
    import gsap from 'gsap';

    export default {
        setup() {
            return {
                interface: useInterfaceStore(),
            };
        },
        mounted() {
            if (this.$refs.modal) {
                document.body.appendChild(this.$refs.modal);
            }
        },
        beforeUnmount() {
            const component = this;
            const modal = component.$refs.modal;

            gsap.to(modal, {
                x: '-100%',
                duration: 0.4,
                onComplete: () => {
                    modal.remove();
                },
            });
        },
        methods: {
            toggleModal() {
                this.interface.toggleModal();
            },
        },
    };
</script>

<style lang="scss">
    @use 'sass:map';

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        display: grid;
        align-items: center;
        width: 100vw;
        height: 100vh;
        color: map.get($layout-colors, color);
        background-color: map.get($layout-colors, background);
        transform: translateX(-100%);
        visibility: hidden;
        transition: $transition-default;

        .dark-mode & {
            color: map.get($layout-dm-colors, color);
            background-color: map.get($layout-dm-colors, background);
        }

        &--active {
            transform: translateX(0);
            visibility: visible;
        }

        .media-context__image img {
            object-fit: contain;
            object-position: center;
        }

        .media-context__caption {
            display: none;
        }

        &__button {
            position: absolute;
            z-index: 10;
            top: 2.08vw;
            right: 4.167vw;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 44px;
            height: 44px;
            padding: 0;
            background-color: transparent;
            border: 0;
            appearance: none;
            cursor: pointer;

            @include breakpoint(medium) {
                width: 4.861vw;
                height: 4.861vw;
            }

            &:hover {
                background-color: map.get($layout-colors, ambiant);

                .dark-mode & {
                    background-color: map.get($layout-dm-colors, ambiant);
                }

                svg {
                    stroke: map.get($layout-colors, accent);
                }
            }

            .icon-x {
                width: 80%;
            }
        }
    }
</style>
