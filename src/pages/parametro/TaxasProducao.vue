<template>
    <TaxasProducaoList v-if="!isCadastrarOuEditar()" />
    <TaxasProducaoForm v-if="isCadastrarOuEditar()" :id="id" :isCopiar="isCopiar" :isEditar="isEditar"/>
</template>

<script>
    import TaxasProducaoList from '../../components/parametro/TaxasProducaoList.vue';
    import TaxasProducaoForm from '../../components/parametro/TaxasProducaoForm.vue';

    export default {
        components: { TaxasProducaoList, TaxasProducaoForm },
        data() {
            return {
                isCadastro: false,
                isEditar: false,
                isCopiar: false, 
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
                return this.isCadastro || this.isEditar || this.isCopiar;
            },

            validarRouter() {
                const routerName = this.$route.name
                if(routerName === 'taxas-producao-cadastrar') {
                    this.id = null;
                    this.isCadastro = true;
                }
                else if(routerName === 'taxas-producao-editar') {
                    const id = this.$route.params.id;
                    this.editar(id);
                }
                else if(routerName === 'taxas-producao-copiar') {
                    const id = this.$route.params.id;
                    this.copiar(id);
                }
                else {
                    this.isCadastro = false;
                    this.isEditar = false;
                    this.isCopiar = false; 
                    this.id = null;
                }
            }
        }
    }
</script>
