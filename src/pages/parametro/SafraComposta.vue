<template>
    <SafraCompostaList v-if="!isCadastrarOuEditar()" />
    <SafraCompostaForm v-if="isCadastrarOuEditar()" :id="id" :isCopia="isCopiar"/>
</template>

<script>
    import SafraCompostaList from '../../components/parametro/SafraCompostaList.vue';
    import SafraCompostaForm from '../../components/parametro/SafraCompostaForm.vue';

    export default {
        components: { SafraCompostaList, SafraCompostaForm },  
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
            isCadastrarOuEditar() {
                return this.isCadastro || this.isEditar || this.isCopiar;
            },
            validarRouter() {
                const routerName = this.$route.name
                if(routerName === 'safra-composta-cadastrar') {
                    this.id = null;
                    this.isCadastro = true;
                }
                else if(routerName === 'safra-composta-editar') {
                    const id = this.$route.params.id;
                    this.id = id ? id : null;
                    this.isEditar = !!id;
                }
                else if(routerName === 'safra-composta-copiar') {
                    const id = this.$route.params.id;
                    this.id = id ? id : null;
                    this.isCopiar = !!id;
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
