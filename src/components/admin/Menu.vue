<template>
    <div class="card">
       <Toast />

        <div class="flex align-items-center">
           <i class="pi pi-align-justify" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;"> Menu</h3>
        </div>

        <hr />

        <DataTable :value="menus" v-model:expandedRows="expandedRows" dataKey="id"
            @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" responsiveLayout="stack"
            v-model:filters="filtro">
            <template #header>
                <div class="flex justify-content-between">
                    <div class="flex">
                        <Button type="button" label="Cadastrar" class="p-button-info mr-1" icon="pi pi-plus" @click="cadastrarMenu()" />
                        <Button type="button" icon="pi pi-filter-slash" label="Limpar filtro" class="p-button-outlined mr-6" @click="limparFiltro()"/>
                        <Button icon="pi pi-plus" title="Expandir todos" @click="expandAll" class="p-button-outlined p-button-info mr-3" />
                        <Button icon="pi pi-minus" title="Recolher todos" @click="collapseAll" class="p-button-outlined p-button-info" />
                    </div>

                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filtro['global'].value" placeholder="Pesquisar"/>
                    </span>
                </div>
            </template>
            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column :expander="true" headerStyle="width: 3rem" />
            <Column field="label" header="Label" headerStyle="width: 12rem">
                <template #body="{ data }">
                    <span style="font-weight: 500;">{{ data.label }}</span>                                
                </template>
            </Column>
            <Column>
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-text mr-2 mb-2" @click="editarMenu(data.id)" />                                   
                </template>
            </Column>
            <Column field="icon" header="Ícone">
                <template #body="{ data }">
                    <span>{{ data.icon }}</span>
                </template>
            </Column>
            <Column field="sequencia" header="Sequência">
                <template #body="{ data }">
                    <span>{{ data.sequencia }}</span>
                </template>
            </Column>
            
            <template #expansion="row">
                
                <div class="col-11" style="float: right;">
                    <div class="orders-subtable">
                        <Button label="+ Adicionar item do menu" class="p-button-link mr-2 mb-2"  @click="cadastrarMenuItem(row.data.id)" />
                        <DataTable :value="row.data.itens" responsiveLayout="stack" v-if="row.data.itens.length">
                            <Column field="label" header="Label"></Column>
                            <Column field="icon" header="Ícone"></Column>
                            <Column field="path" header="Path"></Column>
                            <Column field="sequencia" header="Ordem"></Column>
                            <Column field="ativo" header="Status">
                                <template #body=" {data}">
                                    {{ data.ativo ? 'Ativo' : 'Inativo' }}
                                </template>
                            </Column>
                            <Column headerStyle="width:2rem">
                                <template #body=" {data}">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2 mb-2" @click="editarMenuItem(row.data.id, data.id)" />
                                </template>
                            </Column>
                            <Column headerStyle="width:2rem">
                                <template #body=" {data}">
                                    <Button v-if="data.ativo" icon="pi pi-check-circle" class="p-button-rounded p-button-info mr-2 mb-2" @click="desativarMenuItem(data.id)" />
                                    <Button v-if="!data.ativo" icon="pi pi-ban" class="p-button-rounded p-button-danger mr-2 mb-2" @click="ativarMenuItem(data.id)" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </template>
        </DataTable>
        
    </div>
</template>

<script>
    import { FilterMatchMode } from 'primevue/api';
    import MenuService from '../../service/MenuService';
    import MenuItemService from '../../service/MenuItemService';

    export default {
        name: 'MenuService',
        data() {
            return {
                menus: [],
                filtro: null,
				expandedRows: []
            }
        },
        created() {
            this.limparFiltro();
            this.carregarMenus();
        },
        methods: {
            carregarMenus() {
                MenuService.getMenus()
                    .then(({ data }) => {
                        if(data) {
                            this.menus = data;                            
                        }
                    });
            },

            cadastrarMenu() {
                this.$router.push(`/menu/cadastrar`);
            },

            editarMenu(menuId) {
                this.$router.push(`/menu/editar/${menuId}`);
            },

            cadastrarMenuItem(menuId) {
                this.$router.push(`/menu/${ menuId }/cadastrar-item`);
            },

            editarMenuItem(menuId, menuItemId) {
                this.$router.push(`/menu/${ menuId }/editar-item/${menuItemId}`);
            },

            desativarMenuItem(menuItemId) {
                MenuItemService.inativarMenuItem(menuItemId)
                    .then(({ data }) => {
                        this.carregarMenus();
                        this.$toast.add({severity: 'success', summary: 'Item inativado com sucesso.', life: 3000});
                    });
            },

            ativarMenuItem(menuItemId) {
                MenuItemService.ativarMenuItem(menuItemId)
                    .then(({ data }) => {
                        this.carregarMenus();
                        this.$toast.add({severity: 'success', summary: 'Item ativado com sucesso.', life: 3000});
                    });
            },


            limparFiltro() {
                this.filtro = {
                    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                    'codigo': {value: null, matchMode: FilterMatchMode.CONTAINS},
                    'label': {value: null, matchMode: FilterMatchMode.CONTAINS},
                }
            },
            onRowExpand(event) {
                //this.$toast.add({severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000});
            },
            onRowCollapse(event) {
                //this.$toast.add({severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000});
            },
            expandAll() {
                this.expandedRows = this.menus.filter(p => p.id);
                //this.$toast.add({severity: 'success', summary: 'All Rows Expanded', life: 3000});
            },
            collapseAll() {
                this.expandedRows = null;
                //this.$toast.add({severity: 'success', summary: 'All Rows Collapsed', life: 3000});
            }
        }
    }
</script>
