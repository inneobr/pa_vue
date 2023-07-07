<template>
    <InformacoesRecursoSistema v-if="!isCadastrarOuEditar()"/>
    <InformacoesRecursoSistemaForm v-if="isCadastrarOuEditar()" :id="id" /> 
</template>

<script>
    import InformacoesRecursoSistema from '../../components/painelControle/InformacoesRecursoSistema.vue';
    import InformacoesRecursoSistemaForm from '../../components/painelControle/InformacoesRecursoSistemaForm.vue';
    

    export default {
        name: 'Informação de Recurso do Sistema',
        components: { InformacoesRecursoSistema, InformacoesRecursoSistemaForm }, 
        data() {
            return {
                isCadastro: false,
                isEditar: false,
                id:null
            }
        },

        created() {
            this.validarRouter();
        },

        updated() {
            this.validarRouter();
        },

        computed: {
            currentUser() {
                return this.$store.state.auth.user;
            }                
        },

        methods: {         

            editar(id) {

                 if(id) {
                     this.id = id;
                     this.isEditar = true;
                 }
                 else {
                     this.id = null;
                     this.isEditar = false;
                 }
            },

            isCadastrarOuEditar() {
                return this.isCadastro || this.isEditar;
            },

            validarRouter() {
                const routerName = this.$route.name

                if(routerName === 'informacoes-recurso-sistema-cadastrar') {
                    this.isCadastro = true;
                    this.id = null;
                }
                else if(routerName === 'informacoes-recurso-sistema-editar') {
                    const id = this.$route.params.id;
                    this.editar(id);
                }
                else {
                    this.isCadastro = false;
                    this.isEditar = false;
                }
            }
        }
    }
</script>
