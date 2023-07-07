<template>
    <Estabelecimentos v-if="!isCadastrarOuEditar()" :codigo="currentUser.estabelecimento"/>
    <EstabelecimentoForm 
        v-if="isCadastrarOuEditar()"
        :estabelecimentoId="estabelecimentoId"
    />
</template>

<script>
    import Estabelecimentos from '../../components/cadastro/Estabelecimentos.vue';
    import EstabelecimentoForm from '../../components/cadastro/EstabelecimentoForm.vue';

    export default {
        name: 'Estabelecimento',
        components: { Estabelecimentos, EstabelecimentoForm },
        data() {
            return {
                isCadastro: false,
                isEditar: false,
                estabelecimentoId: null
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

            editar(estabelecimentoId) {
                if(estabelecimentoId) {
                    this.estabelecimentoId = estabelecimentoId;
                    this.isEditar = true;
                }
                else {
                    this.estabelecimentoId = null;
                    this.isEditar = false;
                }
            },

            isCadastrarOuEditar() {
                return this.isCadastro || this.isEditar;
            },

            validarRouter() {
                const routerName = this.$route.name
                if(routerName === 'cadastrarEstabeleicmento') {
                    this.isCadastro = true;
                }
                else if(routerName === 'editarEstabeleicmento') {
                    const estabelecimentoId = this.$route.params.estabelecimentoId;
                    this.editar(estabelecimentoId);
                }
                else {
                    this.isCadastro = false;
                    this.isEditar = false;
                    this.estabelecimentoId = null;
                }
            }
        }
    }
</script>
