<template>
    <TransitionGroup name="bounce" tag="div" class="TheModal">
        <div v-if="currentModal" key="overlay" class="overlay" @click.self="close"></div>
        <div v-if="currentModal" :key="currentModal.name" class="modal">
            <Component :is="currentModal.name" v-bind="currentModal.props" class="content"/>
        </div>
    </TransitionGroup>
</template>


<script>
/* eslint-disable vue/no-unused-components */
import { mapGetters } from 'vuex';
import ScoreboardModal from './modals/ScoreboardModal';
import ObjectivesModal from './modals/ObjectivesModal';
import ObjectiveConfirmModal from './modals/ObjectiveConfirmModal';
import RedirectPlayerModal from './modals/RedirectPlayerModal';
import ResetGameModal from './modals/ResetGameModal';

export default {
    components: {
        ScoreboardModal,
        ObjectivesModal,
        ObjectiveConfirmModal,
        RedirectPlayerModal,
        ResetGameModal,
    },

    computed: mapGetters(['currentModal']),

    mounted() {
        window.addEventListener('keydown', this.onKeyPress);
    },

    beforeDestroy() {
        window.removeEventListener('keydown', this.onKeyPress);
    },

    methods: {
        onKeyPress(event) {
            if (event.key === 'Escape' || event.key === 'Esc') {
                this.close();
            }
        },

        close() {
            if (this.currentModal) {
                this.$store.commit('POP_MODAL');
            }
        },
    },
};
</script>


<style lang="scss" scoped>
@import 'settings.scss';
.TheModal {
    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        user-select: none;

        background-color: rgba($bg00, 0.75);
    }

    .modal {
        z-index: 500;
        position: absolute;
        display: flex;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        pointer-events: none;

        .content {
            z-index: 1;
            width: 43rem;
            overflow: hidden;
            border: $border;
            background-color: $bg00;
            pointer-events: auto;
        }
    }

    .bounce-enter-active, .bounce-leave-active {
        transition: opacity 0.1s linear;
        &.modal {
            transition-duration: 0.2s;
            transition-timing-function: cubic-bezier(0.6, 0, 0.2, 1.65);
            transition-property: opacity, transform;
        }
    }

    .bounce-enter, .bounce-leave-to {
        opacity: 0;
        &.modal {
            transform: scale(0.85);
        }
    }
}
</style>
