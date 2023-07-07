<template>
    <Gmo v-if="!isCadastrar()" />
    <GmoForm v-if="isCadastrar()" :id="id"/>
</template>

<script>
    import Gmo from '../../components/cadastro/Gmo.vue';
    import GmoForm from '../../components/cadastro/GmoForm.vue';

    export default {
        name: 'Gmos',
        components: { Gmo, GmoForm },
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

            isCadastrar() {
                return this.isCadastro || this.isEditar;
            },

            validarRouter() {
                const routerName = this.$route.name
                if(routerName === 'cadastrarGmo') {
                    this.isCadastro = true;
                }
                else if(routerName === 'editarGmo') {                    
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