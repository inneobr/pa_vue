<template>
    <TabelaPrecoList v-if="!isCadastrarOuEditar()" />
</template>

<script>
    import TabelaPrecoList from '../../components/parametro/TabelaPrecoList.vue';

    export default {
        components: { TabelaPrecoList },
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
                return this.isCadastro || this.isEditar ;
            },

            validarRouter() {
                const routerName = this.$route.name
                // if(routerName === 'taxas-producao-cadastrar') {
                //     this.id = null;
                //     this.isCadastro = true;
                // }
                // else if(routerName === 'taxas-producao-editar') {
                //     const id = this.$route.params.id;
                //     this.editar(id);
                // }
                // else if(routerName === 'taxas-producao-copiar') {
                //     const id = this.$route.params.id;
                //     this.copiar(id);
                // }
                // else {
                    // this.isCadastro = false;
                    // this.isEditar = false;
                    // this.isCopiar = false; 
                    // this.id = null;
                //}

                if(routerName === 'tabela-preco') {
                    this.isCadastro = false;
                    this.isEditar = false;
                    this.id = null;
                }
                
            }
        }
    }
</script>
