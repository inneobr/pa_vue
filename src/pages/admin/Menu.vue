<template>
    <Menu 
        v-if="!isCadastrar()"
    />

    <MenuForm 
        v-if="isCadastrar() && isMenuAction" 
        :menuId="menuId"
    />
    
    <MenuItemForm 
        v-if="isCadastrar() && !isMenuAction" 
        :menuId="menuId"
        :menuItemId="menuItemId"
    />
</template>

<script>
    import Menu from '../../components/admin/Menu.vue';
    import MenuForm from '../../components/admin/MenuForm.vue';
    import MenuItemForm from '../../components/admin/MenuItemForm.vue';

    export default {
        name: 'Menus',
        components: { Menu, MenuForm, MenuItemForm},
        data() {
            return {
                isCadastro: false,
                isEditar: false,
                isMenuAction: true,
                menuId: null,
                menuItemId: null,
            }
        },
        created() {
            this.validarRouter();
        },
        updated() {
            this.validarRouter();
        },
        methods: {
            editar(menuId) {
                this.isMenuAction = true;
                if(menuId) {
                    this.menuId = menuId;
                    this.isEditar = true;
                }
                else {
                    this.menuId = null;
                    this.isEditar = false;
                }
            },

            isCadastrar() {
                return this.isCadastro || this.isEditar;
            },

            editarItem(menuId, menuItemId) {
                this.isMenuAction = false;
                if(menuItemId) {
                    this.menuId = menuId;
                    this.menuItemId = menuItemId;
                    this.isEditar = true;
                }
                else {
                    this.menuId = null;
                    this.menuItemId = null;
                    this.isEditar = false;
                }
            },

            validarRouter() {
                const routerName = this.$route.name
                if(routerName === 'cadastrarMenu') {
                    this.isMenuAction = true;
                    this.isCadastro = true;
                }else
                if(routerName === 'cadastrarMenuItem') {
                    this.menuId = this.$route.params.menuId;
                    this.isMenuAction = false;
                    this.isCadastro = true;
                }
                else if(routerName === 'editarMenu') {                    
                    const menuId = this.$route.params.menuId;
                    this.isMenuAction = true;
                    this.editar(menuId);

                }else if(routerName === 'editarMenuItem') {
                    const menuId = this.$route.params.menuId;
                    const menuItemId = this.$route.params.menuItemId;
                    this.isMenuAction = false;
                    this.editarItem(menuId, menuItemId);
                }
                else {
                    this.isMenuAction = true;
                    this.isCadastro = false;
                    this.isEditar = false;
                    this.menuItemId = null;
                    this.menuId = null;
                }
            }
        }
    }
</script>