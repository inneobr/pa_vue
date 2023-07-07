<template>
    <ParametroEstabelecimento v-if="!isCadastrarOuEditar()"/>
    <ParametroEstabelecimentoForm v-if="isCadastrarOuEditar()" :id="id"/>
</template>

<script>
    import ParametroEstabelecimento from '../../components/parametro/ParametroEstabelecimento.vue';
    import ParametroEstabelecimentoForm from '../../components/parametro/ParametroEstabelecimentoForm.vue';
    export default {
      components: { ParametroEstabelecimento, ParametroEstabelecimentoForm },

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
                if(routerName === 'parametros-estabelecimento-cadastrar') {
                    this.id = null;
                    this.isCadastro = true;
                }

                else if(routerName === 'parametros-estabelecimento-editar') {
                    const id = this.$route.params.id;
                    this.id = id ? id : null;
                    this.isEditar = !!id;
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