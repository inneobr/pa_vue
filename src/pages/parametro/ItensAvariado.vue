<template>
    <ItensAvariadoList v-if="!isCadastrarOuEditar()" />
    <ItensAvariadoForm v-if="isCadastrarOuEditar()" :id="id" :isCopiar="isCopiar"/>
</template>

<script>
    import ItensAvariadoList from '../../components/parametro/ItensAvariadoList.vue';
    import ItensAvariadoForm from '../../components/parametro/ItensAvariadoForm.vue';

    export default {
        components: { ItensAvariadoList, ItensAvariadoForm },
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
                if(routerName === 'itens-avariados-cadastrar') {
                    this.id = null;
                    this.isCadastro = true;
                }
                else if(routerName === 'itens-avariados-editar') {
                    const id = this.$route.params.id;
                    this.id = id ? id : null;
                    this.isEditar = !!id;
                }
                else if(routerName === 'itens-avariados-copiar') {
                    const id = this.$route.params.id;
                    this.copiar(id);
                    this.isCopiar = true;                    
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
