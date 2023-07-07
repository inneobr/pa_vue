<template>
    <GrupoProdutoList v-if="!isCadastrarOuEditar()" />
    <GrupoProdutoForm
        v-if="isCadastrarOuEditar()"
        :id="id"
    />
</template>

<script>
    import GrupoProdutoList from '../../components/cadastro/GrupoProdutoList.vue';
    import GrupoProdutoForm from '../../components/cadastro/GrupoProdutoForm.vue';

    export default {
        name: 'GrupoProduto',
        components: { GrupoProdutoList, GrupoProdutoForm },
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
            isCadastrarOuEditar() {
                return this.isCadastro || this.isEditar;
            },

            validarRouter() {
                const routerName = this.$route.name
                if(routerName === 'cadastrarGrupoProduto') {
                    this.isCadastro = true;
                    this.isEditar = false;
                    this.id = null;
                }
                else if(routerName === 'editarGrupoProduto') {
                    const id = this.$route.params.id;
                    this.id = id ? id : null;
                    this.isEditar = !!id ? true : false;
                    this.isCadastro = false;
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
