<template>
    <div class="card">
        <Toast />

        <h5>{{ menuId ? 'Editar' : 'Criar' }} Menu Item</h5>

        <hr />

        <div class="grid">
            <div class="col-6">
                <label for="Label"><strong>Label</strong></label>
                <InputText class="w-full mt-1" id="Label" v-model="database.label" />
            </div>

            <div class="col-3">
                <label for="icon"><strong>Icon</strong></label>
                <InputText class="w-full mt-1" id="icon" v-model="database.icon" />
            </div>

            <div class="col-4">
                <label for="path"><strong>Path</strong></label>
                <InputText class="w-full mt-1" id="icon" v-model="database.path" />
            </div>

            <div class="col-2">
                <label for="sequencia"><strong>Sequência</strong></label>
                <InputText class="w-full mt-1" id="sequencia" v-model="database.sequencia" />
            </div>

            <div class="col-3">
                <label for="ativo"><strong>Ativo?</strong></label>
                <Dropdown class="w-full mt-1" id="Ativo" v-model="database.ativo" :options="ativoOpcoes" optionLabel="nome" />                
            </div>
        </div>

        <br />

        <div class="flex align-items-center">
            <Button label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info" @click="salvar()" :disabled="doubleClick"/>
            <Button label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger ml-2" @click="voltar()" />
        </div>
    </div>
</template>

<script>
    import MenuItemService from '../../service/MenuItemService';

    export default {
        name: 'MenuItemForm',
        props: {
            menuId: {
                type: String,
                required: true
            },
            menuItemId: {
                type: String,
                required: false
            },
        },
        data() {
            return {
                database: {},               
                ativoOpcoes: [
                    {nome: 'Sim', valor: true},
                    {nome: 'Não', valor: false}
                ], 
                doubleClick: false,
            }
        },
        created() {
            this.carregarDados();
        },
        methods: {            
            carregarDados() {
                if(!this.menuItemId) return;

                MenuItemService.getMenuItem(this.menuItemId)
                    .then(({ data }) => {
                        if(data) {
                            console.log(data)
                            this.database = data;                           
                            this.database.ativo = this.ativoOpcoes.find(item => { return item.valor === data.ativo });
                        }
                        else {
                            this.voltar();
                        }
                    })
                    .catch(error => {
                        this.voltar();
                    });
            },

            voltar() {
                this.$router.push(`/menus`);
            },
            salvar() {                
                if(this.doubleClick) return;
                this.database['idMenu'] = this.menuId;
                console.log(JSON.stringify(this.database))

                if(this.menuItemId) {
                    this.atualizar();
                }

                if(this.menuItemId == undefined) {
                    this.cadastrar();
                }
            },

            atualizar() {
                MenuItemService.putMenuItem(this.database)
                    .then(response => {
                        this.$toast.add({
                            severity:'success', 
                            summary: 'Sucesso', 
                            detail:'O menu foi atualizado!', 
                            life: 3000
                        });
                        this.voltar();
                    })
                    .catch(error => {
                        this.doubleClick = false;
                        this.$toast.add({
                            severity:'error', 
                            summary: 'Falha', 
                            detail:'O menu item não foi atualizado!', 
                            life: 3000
                        });
                    });
            },

            cadastrar() {
                console.log(JSON.stringify(this.database))
                MenuItemService.postMenuItem(this.database)
                    .then(response => {
                        this.$toast.add({
                            severity:'success', 
                            summary: 'Sucesso',
                            detail:'O menu item foi cadastrado!',
                            life: 3000
                        });
                        this.voltar();
                    })
                    .catch(error => {
                        this.doubleClick = false;
                        this.$toast.add({
                            severity:'error',
                            summary: 'Falha',
                            detail:'O menu item não foi cadastrado!',
                            life: 3000
                        });
                    });
            },
        }
    }
</script>
