<template>
    <div class="card">
        <Toast />

        <div class="flex align-items-center">
           <i class="pi pi-unlock" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;"> Perfil de Usuário</h3>
        </div>

        <hr />
        
        <DataTable 
            responsiveLayout="stack"
            :loading="carregando"
            :value="todos"
            @sort="sort($event)"
        >

            <template #header>
                <div class="flex justify-content-between align-items-center">
                    <div class="flex">
                        <Button type="button" label="Cadastrar" class="p-button-info mr-1" icon="pi pi-plus" @click="cadastrar()" />
                        <Button type="button" icon="pi pi-filter-slash" label="Limpar filtro" class="p-button-outlined mr-1" @click="limparFiltro()"/>

                        <Button
                            v-if="situacao == 'ATIVO'"
                            type="button"
                            icon="pi pi-ban"
                            label="Listar inativos"
                            class="p-button-outlined p-button-danger"
                            @click="situacao = 'INATIVO'; carregarPerfis()"
                        ></Button>
                        <Button
                            v-if="situacao == 'INATIVO'"
                            type="button"
                            icon="pi pi-check-circle"
                            label="Listar ativos"
                            class="p-button-outlined"
                            @click="situacao = 'ATIVO'; carregarPerfis()"
                        ></Button>
                    </div>

                    <div class="flex align-items-center">
                        <div class="mr-3">
                            <RadioButton class="mr-1" id="perfil" value="PERFIL" v-model="tipoFiltro" @change="onTipoFiltro();" />
                            <label for="perfil">Perfil</label>
                        </div>

                        <div class="mr-3">
                            <RadioButton class="mr-1" id="usuario" value="USUARIO" v-model="tipoFiltro" @change="onTipoFiltro();" />
                            <label for="usuario">Usuário</label>
                        </div>

                        <div class="mr-3">
                            <RadioButton class="mr-1" id="menu" value="MENU_ITENS" v-model="tipoFiltro" @change="onTipoFiltro();" />
                            <label for="menu">Menu</label>
                        </div>

                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText
                                v-model="filtro"
                                placeholder="Pesquisar"
                                @change="carregarPerfis()"
                            />
                        </span>
                    </div>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="nome" header="Descrição" style="width:15rem;" sortable />
            <Column field="descricao" header="Observação" sortable />
            <Column header="Situação" style="width:1rem;text-align:center;">
                <template #body="{ data }">
                    {{ data.ativo ? 'Ativo' : 'Inativo' }}
                </template>
            </Column>
            <Column header="Opções" style="width:14rem;">
                <template #body="{ data }">
                    <div class="flex-none">
                        <Button icon="pi pi-users" class="p-button-rounded p-button-success flex-none mr-2" title="Visualizar usuários" @click="visualizarUsuarios(data.id)" />
                        <Button icon="pi pi-list" class="p-button-rounded p-button-info flex-none mr-2" title="Visualizar menus" @click="visualizarMenuItens(data.id)" />
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning flex-none mr-2" @click="editar(data.id)" />
                        <Button v-if="data.ativo" class="p-button-rounded flex-none p-button-info" icon="pi pi-check-circle" title="Inativar" @click="confirmarAtivarOuInativar(data)"/> 
                        <Button  v-if="!data.ativo" class="p-button-rounded p-button-danger flex-none" icon="pi pi-ban" title="Ativar" @click="confirmarAtivarOuInativar(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <Paginator
            :rows="qtdRegistro"
            :totalRecords="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage">
        </Paginator>
    </div>

    <Dialog v-model:visible="ativarOuInativarDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Deseja <strong>{{ perfil.ativo ? 'inativar' : 'ativar' }}</strong> o perfil <strong>{{ perfil.nome }}</strong>?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarOuInativarDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()" />
        </template>
    </Dialog>

    <PerfilModalUsuario
        :idPerfil="idPerfil"
        :visivel="usuarioDialog"
        @fechar="ocultarUsuarios()"
    />

    <PerfilModalMenuItens
        :idPerfil="idPerfil"
        :visivel="menuItemDialog"
        @fechar="ocultarMenuItens()"
    />
</template>

<script>
    import PerfilService from '../../service/PerfilService';
    import PerfilModalUsuario from './PerfilModalUsuarios.vue';
    import PerfilModalMenuItens from './PerfilModalMenuItens.vue';

    export default {
        components: { PerfilModalUsuario, PerfilModalMenuItens },
        data() {
            return {
                todos: [],
                filtro: null,
                situacao: 'ATIVO',
                tipoFiltro: 'PERFIL',

                carregando: false,
                pagina: 0,
                qtdRegistro: 10,
                totalRegistro: 0,
                ordenar: 'nome',
                
                perfil: {},
                idPerfil: null,
                usuarioDialog: false,
                menuItemDialog: false,
                ativarOuInativarDialog: false
            }
        },
        created() {
            this.carregarPerfis();
        },
        methods: {
            carregarPerfis() {
                this.carregando = true;
                PerfilService.getPerfisPaginado(
                    this.pagina,
                    this.qtdRegistro,
                    this.ordenar,
                    this.tipoFiltro,
                    this.filtro,
                    this.situacao
                )
                    .then(({ data }) => {
                        if(data) {
                            this.todos = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                        }
                        this.carregando = false;
                    });
            },

            cadastrar() {
                this.$router.push(`/perfil/cadastrar`);
            },

            editar(menuId) {
                this.$router.push(`/perfil/editar/${menuId}`);
            },

            limparFiltro() {
                this.filtro = null;
                this.carregarPerfis();
            },

            confirmarAtivarOuInativar(perfil) {
                this.perfil = perfil;
                this.ativarOuInativarDialog = true;
            },

            ativarOuInativar() {
                if(this.perfil.ativo) {
                    PerfilService.inativar(this.perfil.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O perfil ${ this.perfil.nome } foi inativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregarPerfis();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao inativar o perfil ${ this.usuario.nome }!`, 
                                life: 3000
                            });
                        });
                }
                else {
                    PerfilService.ativar(this.perfil.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O perfil ${ this.perfil.nome } foi ativado com sucesso!`, 
                                life: 3000
                            });
                            
                            this.carregarPerfis();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao ativar o perfil ${ this.usuario.nome }!`, 
                                life: 3000
                            });
                        });
                }
            },

            onPage(event) {
                this.pagina = event.page;
                this.qtdRegistro = event.rows;
                this.carregarPerfis();
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.todos = [];
                this.carregarPerfis();
            },

            visualizarUsuarios(id) {
                this.usuarioDialog = true;
                this.idPerfil = id;
            },

            ocultarUsuarios() {
                this.usuarioDialog = false;
                this.idPerfil = null;
            },

            visualizarMenuItens(id) {
                this.menuItemDialog = true;
                this.idPerfil = id;
            },

            ocultarMenuItens() {
                this.menuItemDialog = false;
                this.idPerfil = null;
            },

            onTipoFiltro() {
                if(this.filtro === null || this.filtro === "") return;
                this.carregarPerfis();
            }
        }
    }
</script>