<template>
    <ProdutoReferencia v-if="!isCadastrarOuEditar()" />
    <ProdutoReferenciaForm v-if="isCadastrarOuEditar()" :id="id"/>
</template>

<script>
    import ProdutoReferencia from '../../components/cadastro/ProdutoReferencia.vue';
    import ProdutoReferenciaForm from '../../components/cadastro/ProdutoReferenciaForm.vue';

    export default {
        name: 'Referencia Produtos',
        components: { ProdutoReferencia, ProdutoReferenciaForm },

        data() {
            return {
                isCadastro: false,
                isEditar: false,
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
                if(routerName === 'cadastrar-referencia') {
                    this.isCadastro = true;
                }
                else if(routerName === 'editar-referencia') {
                    const id = this.$route.params.id;
                    this.editar(id);
                }
                else {
                    this.isCadastro = false;
                    this.isEditar = false;
                    this.id = null;
                }
            }
        }
    }
</script>

<style>
    .icon-title {
        font-size: 1.3rem; 
        font-weight: bold;
    }
</style>