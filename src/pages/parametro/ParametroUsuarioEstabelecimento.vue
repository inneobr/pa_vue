<template>
    <ParametroEstabelecimentoUsuario v-if="!isCadastrarOuEditar()"/>
    <ParametroEstabelecimentoUsuarioForm v-if="isCadastrarOuEditar()" :id="id"/>
</template>

<script>
    import ParametroEstabelecimentoUsuario from '../../components/parametro/UsuarioEstabelecimento.vue'
    import ParametroEstabelecimentoUsuarioForm from '../../components/parametro/UsuarioEstabelecimentoForm.vue'
    export default {
        name: 'ParametroEstabeleciemnto',
        components: { ParametroEstabelecimentoUsuario, ParametroEstabelecimentoUsuarioForm },
        data() {
            return {
                isCadastro: false,
                isEditar: false,
                id: null
            }
        },

        computed: {
            currentUser() {
                return this.$store.state.auth.user;
            }                
        },

        created() {
            this.router();
        },

        updated(){
            this.router();
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

            router() {
                const routerName = this.$route.name
                if(routerName === 'parametro-estabelecimento-cadastro') {
                    this.isCadastro = true;
                }
                else if(routerName === 'parametro-estabelecimento-editar') {
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