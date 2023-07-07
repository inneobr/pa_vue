<template>
    <Usuarios v-if="!isCadastrarOuEditar()" />
    <UsuarioForm 
        v-if="isCadastrarOuEditar()"
        :login="username"
    />
</template>

<script>
    import Usuarios from '../../components/admin/Usuarios.vue';
    import UsuarioForm from '../../components/admin/UsuarioForm.vue';

    export default {
        name: 'Usuario',
        components: { Usuarios, UsuarioForm },
        data() {
            return {
                isCadastro: false,
                isEditar: false,
                username: null
            }
        },
        created() {
            this.validarRouter();
        },
        updated() {
            this.validarRouter();
        },
        methods: {
            editar(username) {
                if(username) {
                    this.username = username;
                    this.isEditar = true;
                }
                else {
                    this.username = null;
                    this.isEditar = false;
                }
            },

            isCadastrarOuEditar() {
                return this.isCadastro || this.isEditar;
            },

            validarRouter() {
                const routerName = this.$route.name
                if(routerName === 'cadastrarUsuario') {
                    this.isCadastro = true;
                }
                else if(routerName === 'editarUsuario') {
                    const username = this.$route.params.username;
                    this.editar(username);
                }
                else {
                    this.isCadastro = false;
                    this.isEditar = false;
                    this.username = null;
                }
            }
        }
    }
</script>
