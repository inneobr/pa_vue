<template>
    <Rependente v-if="!isCadastrarOuEditar()"/>
    <RependenteForm v-if="isCadastrarOuEditar()" :id="id" :ticket="isTicket"/>
</template>

<script>
    import Rependente from '../../components/consulta/Rependente.vue';
    import RependenteForm from '../../components/consulta/RependenteForm.vue'
export default {
    components: { Rependente, RependenteForm }, 
    data() {
        return {
            isCadastro: false,
            isEditar: false,
            isTicket: false,
            id: null
        }
    },

    created() {
            this.validarRouter();
    },
    updated() {
        this.validarRouter();
    },

    methods: {
        validarRouter() {
            const routerName = this.$route.name
            if(routerName === 'entrada-producao-cadastrar') {
                this.id = null;
                this.isCadastro = true;
            }
            else if(routerName === 'entrada-producao-editar') {
                const id = this.$route.params.id;
                this.id = id ? id : null;
                this.isEditar = !!id;
            }
            else if(routerName === 'entrada-producao-entrada-ticket') {
                this.isTicket = true;
            }
            else {
                this.isCadastro = false;
                this.isEditar = false;
                this.isTicket = false;
                this.id = null;
            }
        },

        isCadastrarOuEditar() {
            return this.isCadastro || this.isEditar || this.isTicket; 
        },
    }
}
</script>