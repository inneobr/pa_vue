<template>
    <GrupoClassificacao v-if="!isCadastrarOuEditar()"/>
    <GrupoClassificacaoForm v-if="isCadastrarOuEditar()" :id="id" :isCopiar="isCopiar" :isApenasVisulizacao="isApenasVisulizacao"/>
</template>

<script>
    import GrupoClassificacao from '../../components/cadastro/GrupoClassificacao.vue';
    import GrupoClassificacaoForm from '../../components/cadastro/GrupoClassificacaoForm.vue';
    
    export default {
        name: 'Estabelecimento',
        components: { GrupoClassificacao, GrupoClassificacaoForm },
        data() {
            return {
                isCadastro: false,
                isEditar: false,
                isCopiar: false,
                isApenasVisulizacao:false,
                id: null,
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

            visualizar(id) {
                if(id) {
                    this.id = id;
                    this.isApenasVisulizacao = true;
                }
                else {
                    this.id = null;
                    this.isApenasVisulizacao = false;
                }
            },

            copiar(id){
                if(id) {
                    this.id = id;
                    this.isCopiar = true;
                }else {
                    this.id = null;
                    this.isCopiar = false;
                }
            },

            isCadastrarOuEditar() {
                return this.isCadastro || this.isEditar || this.isCopiar || this.isApenasVisulizacao;
            },

            metodoIsApenasVisualizar(){
                return this.isApenasVisulizacao;
            },

            validarRouter() {
                const routerName = this.$route.name
                if(routerName === 'cadastrarGrupoClassificacao') {
                    this.isCadastro = true;
                }
                else if(routerName === 'editarGrupoClassificacao') {
                    const id = this.$route.params.id;
                    this.editar(id);
                }
                else if(routerName === 'visualizarGrupoClassificacao') {
                    const id = this.$route.params.id;
                    this.visualizar(id);
                }
                else if(routerName === 'copiarGrupoClassificacao') {
                    const id = this.$route.params.id;
                    this.copiar(id);
                    this.isCopiar = true;                    
                }
                else {
                    this.isCadastro = false;
                    this.isEditar = false;
                    this.isCopiar = false;
                    this.isApenasVisulizacao=false;
                    this.id = null;
                }
            }
        }
    }
</script>
