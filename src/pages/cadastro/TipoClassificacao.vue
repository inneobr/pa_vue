<template>
    <TipoClassificacao v-if="!isCadastrarOuEditar()"/>
    <TipoClassificacaoForm v-if="isCadastrarOuEditar()" :id="id" :tipoClassificacao="tipoClassificacao" /> 
</template>

<script>
    import TipoClassificacao from '../../components/cadastro/TipoClassificacao.vue';
    import TipoClassificacaoForm from '../../components/cadastro/TipoClassificacaoForm.vue';
        

    export default {
        name: 'Tipos de Classificação',
        components: { TipoClassificacao, TipoClassificacaoForm }, 
        data() {
            return {
                isCadastro: false,
                isEditar: false,
                tipoClassificacao:null
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

            editar(tipoClassificacao) {

                 if(tipoClassificacao) {
                     this.isEditar = true;
                     this.tipoClassificacao = tipoClassificacao;
                 }
                 else {
                     this.tipoClassificacao = null;
                     this.isEditar = false;
                 }
            },

            isCadastrarOuEditar() {
                return this.isCadastro || this.isEditar;
            },

            validarRouter() {
                const routerName = this.$route.name

                if(routerName === 'tipo-classificacao-cadastrar') {
                    this.isCadastro = true;
                    this.tipoClassificacao = null;
                }
                else if(routerName === 'tipo-classificacao-editar') {
                    const tipoClassificacao = this.$route.params.tipoClassificacao;
                    this.editar(tipoClassificacao);
                }
                else {
                    this.isCadastro = false;
                    this.isEditar = false;
                }
            }
        }
    }
</script>