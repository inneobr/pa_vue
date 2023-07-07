<template>
    <NaturezaOperacaoList v-if="!isCadastrarOuEditar()" />
    <NaturezaOperacaoForm
        v-if="isCadastrarOuEditar()"
        :id="id"
    />
</template>

<script>
    import NaturezaOperacaoList from '../../components/parametro/NaturezaOperacaoList.vue';
    import NaturezaOperacaoForm from '../../components/parametro/NaturezaOperacaoForm.vue';

    export default {
        components: { NaturezaOperacaoList, NaturezaOperacaoForm },
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
                if(routerName === 'naturezaOperacaoCadastrar') {
                    this.id = null;
                    this.isCadastro = true;
                }
                else if(routerName === 'naturezaOperacaoEditar') {
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
