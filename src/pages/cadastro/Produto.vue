<template>
    <Produto v-if="!isCadastrarOuEditar()" />
    <ProdutoForm v-if="isCadastrarOuEditar()" :id="id"
    />
</template>

<script>
    import Produto from '../../components/cadastro/Produto.vue';
    import ProdutoForm from '../../components/cadastro/ProdutoForm.vue';

    export default {
        name: 'Produtos',
        components: { Produto, ProdutoForm },
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
                if(routerName === 'cadastrarProduto') {
                    this.isCadastro = true;
                }
                else if(routerName === 'editarProduto') {
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