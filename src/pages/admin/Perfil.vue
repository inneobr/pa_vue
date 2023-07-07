<template>
    <Perfil v-if="!isCadastrar()" />
    <PerfilForm v-if="isCadastrar()" :perfilId="perfilId"/>
</template>

<script>
    import Perfil from '../../components/admin/Perfil.vue';
    import PerfilForm from '../../components/admin/PerfilForm.vue';

    export default {
        name: 'Menus',
        components: { Perfil, PerfilForm },
        data() {
            return {
                isCadastro: false,
                isEditar: false,
                perfilId: null
            }
        },
        created() {
            this.validarRouter();
        },
        updated() {
            this.validarRouter();
        },
        methods: {
            editar(perfilId) {
                if(perfilId) {
                    this.perfilId = perfilId;
                    this.isEditar = true;
                }
                else {
                    this.perfilId = null;
                    this.isEditar = false;
                }
            },

            isCadastrar() {
                return this.isCadastro || this.isEditar;
            },

            validarRouter() {
                const routerName = this.$route.name
                if(routerName === 'cadastrarPerfil') {
                    this.isCadastro = true;
                }
                else if(routerName === 'editarPerfil') {
                    const perfilId = this.$route.params.perfilId;
                    this.editar(perfilId);
                }
                else {
                    this.isCadastro = false;
                    this.isEditar = false;
                    this.perfilId = null;
                }
            }
        }
    }
</script>