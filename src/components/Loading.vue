<template>
    <Dialog v-model:visible="visible" modal="true" :closable="false">
        <div class="col-12 align-items-center grid">
            <ProgressSpinner class="col-4"/>
            <strong class="col-8 text-center">{{ response }}</strong>
        </div>
    </Dialog>
</template>

<script>
    import ProgressSpinner from 'primevue/progressspinner';
    export default {
        components: {ProgressSpinner},
        props: {
            visible: {
                type: Boolean,
                required: true
            },
        },

        data() {
            return {
                response: "Carregando! Pode demorar alguns minutos... Aguarde!",
            }
        },
    }
</script>