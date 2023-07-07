<template>
    <div class="card">
        <Toast />

        <div class="flex align-items-center">
           <i class="pi pi-unlock" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;"> Usuários</h3>
        </div>

        <hr />
        
        <DataTable 
            responsiveLayout="stack"
            :value="usuarios"
            selectionMode="single"
            showGridlines="true"
            @sort="sort($event)">

            <template #header>
                <div class="flex justify-content-between">
                    <div class="flex">
                        <Button type="button" label="Cadastrar" class="p-button-info mr-1" icon="pi pi-plus" @click="cadastrar()" />
                        <Button type="button" icon="pi pi-filter-slash" label="Limpar filtro" class="p-button-outlined mr-1" @click="limparFiltro()"/>

                        <Button
                            v-if="filter.situacao == 'ATIVO'"
                            type="button"
                            icon="pi pi-ban"
                            label="Listar inativos"
                            class="p-button-outlined p-button-danger"
                            @click="filter.situacao = 'INATIVO'; carregarUsuarios()"/>

                        <Button
                            v-if="filter.situacao == 'INATIVO'"
                            type="button"
                            icon="pi pi-check-circle"
                            label="Listar ativos"
                            class="p-button-outlined"
                            @click="filter.situacao = 'ATIVO'; carregarUsuarios()"/>
                    </div>

                    <span class="p-input-icon-right">
                        <i class="pi pi-search" />
                        <InputText 
                            v-model="filter.perquisar"
                            placeholder="Pesquisar"
                            @keyup.enter="carregarUsuarios()"/>
                    </span>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="username" header="Login" sortable />
            <Column field="nome" header="Nome" sortable />
            <Column field="estabelecimento" header="Estabelecimento" sortable />            
            <Column field="regional" header="Regional" sortable />
            <Column field="dataIntegracao" header="Integrado" style="width:15rem;">
                <template #body="{ data }">
                    {{ formatDateCustom(data.dataIntegracao, 'DD/MM/YYYY HH:mm:ss') }}
                </template>
            </Column>
            <Column header="Ações" style="width:14rem;">
                <template #body="{ data }">
                    <div class="flex-none">
                        <Button v-if="data.ativo" icon="pi pi-list" class="p-button-rounded p-button-success flex-none mr-2" title="Visualizar perfis" @click="visualizarPerfis(data.id)" />
                        <Button v-if="data.ativo" icon="pi pi-pencil" class="p-button-rounded p-button-info flex-none mr-2" title="Editar" @click="editar(data.username)" />
                        <Button v-if="data.ativo" icon="pi pi-unlock" class="p-button-rounded p-button-warning flex-none mr-2" title="Resetar senha" @click="resetarSenha(data)" />
                        <Button v-if="data.ativo" class="p-button-rounded flex-none  p-button-info" icon="pi pi-check-circle" title="Inativar" @click="confirmarAtivarOuInativar(data)"/>
                        <Button v-if="!data.ativo" class="p-button-rounded flex-none p-button-danger" icon="pi pi-ban" title="Ativar" @click="confirmarAtivarOuInativar(data)"/>
                    </div>
                </template>
            </Column>
        </DataTable>

        <Paginator
            v-model:first="firstRow"
            :rows="qtdRegistro"
            :total-records="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage" />
    </div>

    <Dialog v-model:visible="ativarOuInativarDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Deseja <strong>{{ usuario.ativo ? 'inativar' : 'ativar' }}</strong> o usuário <strong>{{ usuario.nome }}</strong>?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarOuInativarDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()" />
        </template>
    </Dialog>

    <UsuarioModalPerfis
        :idUsuario="idUsuario"
        :visivel="perfilDialog"
        @fechar="ocultarPerfis()"/>

    <Dialog header="Resetar senha" v-model:visible="resetarSenhaDialog" :style="{width: '350px'}" :modal="true">
        <div class="confirmation-content">
            <p>Deseja alterar a senha do usuário <strong>{{ usuario.nome }}</strong>?</p>
            <InputText type="password" placeholder="Digite a nova senha" class="w-full" v-model="usuario.novaSenha" />
        </div>
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" @click="resetarSenhaOcultar()" class="p-button-text"/>
            <Button label="Alterar" icon="pi pi-check" @click="resetarSenhaAlterar()" class="p-button-text p-button-danger" autofocus />
        </template>
    </Dialog>
</template>

<script>
    import TratamentoDeError from '../../utilities/TratamentoDeError';
    import UsuarioService from '../../service/UsuarioService';
    import UsuarioModalPerfis from './UsuarioModalPerfis.vue';
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        name: 'Usuarios',
        components: { UsuarioModalPerfis },
        data() {
            return {
                pagina: 0,
                firstRow: 0,
                totalRegistro: 0,
                qtdRegistro: 10,  

                usuarios: [],
                filter: {},
                ordenar: 'nome, asc',
                
                usuario: {},
                idUsuario: null,
                ativarOuInativarDialog: false,
                perfilDialog: false,
                resetarSenhaDialog: false,
                storange: StorageService.getControlePagina("USUARIO"),    
            }
        },

        created() {
            //verifica se o filtro está vazio
            this.filter.situacao = "ATIVO";
            if(this.storange.default == undefined){
                this.filter = this.storange.filtros;
            }
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro; 
            this.carregarUsuarios();
        },

        methods: {
            carregarUsuarios() {               
                UsuarioService.getUsuarioPaginadoFiltro(
                    this.pagina, this.qtdRegistro,
                    this.ordenar = 'codUsuario,asc',
                    this.filter
                )
                .then(({ data }) => {
                    if(data) {
                        this.usuarios = data.content;
                        this.qtdRegistro = data.pageable.pageSize;
                        this.totalRegistro = data.totalElements;
                    }
                });
                StorageService.setControlePaginaFilter("USUARIO", this.pagina, this.firstRow, this.qtdRegistro, this.filter);               
            },

            cadastrar() {
                this.$router.push(`/usuario/cadastrar`);
            },

            editar(username) {                
                this.$router.push(`/usuario/editar/${username}`);
            },

            limparFiltro() {
                this.filter = {};
                this.filter.situacao = "ATIVO";
                this.carregarUsuarios();
            },

            confirmarAtivarOuInativar(usuario) {
                this.usuario = usuario;
                this.ativarOuInativarDialog = true;
            },

            ativarOuInativar() {
                if(this.usuario.ativo) {
                    UsuarioService.inativar(this.usuario.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O usuário ${ this.usuario.nome } foi inativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregarUsuarios();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao inativar o usuário ${ this.usuario.nome }!`, 
                                life: 3000
                            });
                        });
                }
                else {
                    UsuarioService.ativar(this.usuario.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O usuário ${ this.usuario.nome } foi ativado com sucesso!`, 
                                life: 3000
                            });
                            
                            this.carregarUsuarios();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao ativar o usuário ${ this.usuario.nome }!`, 
                                life: 3000
                            });
                        });
                }
            },

            formatDateCustom(date, format) {
                return Formatacao.formatDateCustom(date, format);
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows; 
                this.carregarUsuarios();
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.carregarUsuarios();
            },

            visualizarPerfis(id) {
                this.perfilDialog = true;
                this.idUsuario = id;
            },

            ocultarPerfis() {
                this.perfilDialog = false;
                this.idUsuario = null;
            },

            resetarSenha(usuario) {
                this.resetarSenhaDialog = true;
                this.usuario = Object.assign({}, usuario);
            },

            resetarSenhaAlterar() {
                UsuarioService.resetarSenha(this.usuario)
                    .then(({ data }) => {
                        this.$toast.add({
                            severity:'success',
                            detail:`A senha do usuário ${ this.usuario.nome } foi resetada com sucesso!`, 
                            life: 3000
                        });

                        this.resetarSenhaOcultar();
                    })
                    .catch(error => {
                        this.$toast.add(TratamentoDeError(error, false));
                    });
            },

            resetarSenhaOcultar() {
                this.resetarSenhaDialog = false;
                this.usuario = {};
            }
        }
    }
</script>
