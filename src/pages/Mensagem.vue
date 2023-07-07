<template>
    <MensagemDetalhado 
        v-if="mensagemId"
        :mensagemId="mensagemId"
    />

    <Mensagens
        v-if="!mensagemId"
        :matricula="33"
    />
</template>

<script>
    import MensagemDetalhado from '../components/MensagemDetalhado.vue';
    import Mensagens from '../components/Mensagens.vue';

    export default {
        components: { MensagemDetalhado, Mensagens },

        data() {
            return {
                mensagemId: null
            }
        },

        created() {
            this.carregarMensagem();
        },

        updated() {
            this.carregarMensagem();
        },
        
        methods: {
            carregarMensagem() {
                const mensagemId = this.$route.params.mensagemId;
                this.mensagemId = mensagemId ? parseInt(mensagemId) : null;
            }
        }
    }
</script>