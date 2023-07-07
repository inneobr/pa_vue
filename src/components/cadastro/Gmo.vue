<template>
    <div class="card">
        <Toast />

        <div class="flex align-items-center">
            <i class="pi pi-list mr-1" style="font-size: 2rem;"></i>
            <h3 style="margin:0px 5px;">Tipo GMO</h3>
        </div>

        <hr />
        
        <DataTable 
            showGridlines
            responsiveLayout="stack"
            :loading="carregando"   
            @sort="sort($event)"
            selectionMode="single"
            :value="gmos"
        >

            <template #header>
                <div class="flex justify-content-between">
                    <div class="flex">
                        <Button v-if="integration.visible" type="button" label="Cadastrar" class="p-button-info mr-2" icon="pi pi-plus" @click="cadastrar()" />
                        <Button type="button" icon="pi pi-filter-slash" label="Limpar filtro" class="p-button-outlined mr-2" @click="limparFiltro()"/>

                        <Button
                            v-if="situacao == 'ATIVO'"
                            type="button"
                            icon="pi pi-ban"
                            label="Listar inativos"
                            class="p-button-outlined p-button-danger mr-2"
                            style="padding: 0.4rem;"
                            @click="situacao = 'INATIVO'; carregarGmo()"
                        ></Button>

                        <Button
                            v-if="situacao == 'INATIVO'"
                            type="button"
                            icon="pi pi-check-circle"
                            label="Listar ativos"
                            class="p-button-outlined mr-2"
                            style="padding: 0.4rem;"
                            @click="situacao = 'ATIVO'; carregarGmo()"
                        ></Button>
                    </div>

                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filtro" placeholder="Pesquisar" @change="carregarGmo()" />
                    </span>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>
            
            <Column field="tipoGmo" header="Nome" sortable />
            <Column field="perDeclarada" header="% Declarada"/>
            <Column field="perTestada" header="% Testada"/>
            <Column field="vlKit" header="Valor Kit"/>
            <Column field="dataIntegracao" header="Data e Hora Integração">
                <template #body="{ data }">
                    {{ formatDate(data.dataIntegracao, 'DD/MM/YYYY HH:mm:SS') }} 
                </template>
            </Column>
            
            <Column header="Ações" style="width:8rem;">
                <template #body="{ data }">
                    <div class="flex-none">
                        <Button v-if="!integration.visible" icon="pi pi-eye" class="p-button-rounded p-button-outlined flex-none mr-2" title="Visualizar" @click="editar(data.id)" />
                        <Button v-if="integration.visible" icon="pi pi-pencil" class="p-button-rounded p-button-info flex-none mr-2" title="Editar" @click="editar(data.id)" />
                        <Button v-if="!data.ativo && integration.visible" icon="pi pi-ban" class="p-button-rounded p-button-danger flex-none" title="Ativar" @click="confirmarAtivarOuInativar(data)" />
                        <Button v-if="data.ativo && integration.visible" icon="pi pi-check-circle" class="p-button-rounded p-button-sucess flex-none" title="Inativar" @click="confirmarAtivarOuInativar(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <Paginator
            v-model:first="pagina"
            :rows="qtdRegistro"
            :total-records="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage"/>
    </div>

    <Dialog v-model:visible="ativarOuInativarDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <span>Deseja <strong>{{ gmo.ativo ? 'Inativar' : 'ativar' }}</strong> o tipo GMO <strong>{{ gmo.tipoGmo }}</strong>?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarOuInativarDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()" />
        </template>
    </Dialog>
</template>

<script>
    import IntegracaoService from '../../service/IntegracaoService'
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';
    import GmoService from '../../service/GmoService';
    

    export default {
        name: 'Gmos',
        data() {
            return {
                carregando: false,
                totalRegistro: 0,
                qtdRegistro: 10,
                pagina: 0,
                gmos: [],
                filtro: null,
                situacao: 'ATIVO',
                ordenar: 'tipoGmo',
                
                gmo: {},
                integration: {},
                ativarOuInativarDialog: false,
                storange: StorageService.getControlePagina("TIPO_GMO"),
            }
        },
        created() {
            //verifica se o filtro está vazio
            if(this.storange.default == undefined){
                this.filter = this.storange.filtros;
            }
            this.pagina = this.storange.numero;
            this.qtdRegistro = this.storange.qtdRegistro;  

            this.limparFiltro();
            this.carregarGmo();
            this.getIntegrationOptons();
        },
        methods: {
            getIntegrationOptons(){
                const paginaAtual = "TIPO_GMO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                        }
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'info', 
                            summary: 'PARÂMETROS DE PÁGINA NÂO DEFINIDOS', 
                            detail:'Você deve cadastrar os parâmetros para esta página no menu lateral em: Painel de Integrações.',
                            life: 10000
                        });
                    });
            },

            carregarGmo() {
                this.carregando = true;
                GmoService.getGmo(this.pagina, this.qtdRegistro, this.ordenar, this.filtro, this.situacao)
                    .then(({ data }) => {
                        if(data) {
                            this.gmos = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                            this.carregando = false;
                        }
                    })
                    .catch(error => {
                        this.gmos = [];
                        this.carregando = false;
                    });
            },

            cadastrar() {
                this.$router.push(`/gmo/cadastrar`);
            },

            editar(id) {
                this.$router.push(`/gmo/editar/${id}`);
            },

            limparFiltro() {
                //this.filtro = {
                //    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                //    'tipoGmo': {value: null, matchMode: FilterMatchMode.CONTAINS}
                //}
                this.filtro = null;
                this.carregarGmo();
            },

            confirmarAtivarOuInativar(gmo) {
                this.gmo = gmo;
                this.ativarOuInativarDialog = true;
            },

            ativarOuInativar() {
                if(this.gmo.ativo) {
                    GmoService.inativar(this.gmo.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O tipo GMO ${ this.gmo.tipoGmo } foi inativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregarGmo();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao inativar o tipo GMO ${ this.gmo.tipoGmo }!`, 
                                life: 3000
                            });
                        });
                }
                else {
                    GmoService.ativar(this.gmo.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O tipo GMO ${ this.gmo.tipoGmo } foi ativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregarGmo();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao ativar o tipo GMO ${ this.gmo.tipoGmo }!`, 
                                life: 3000
                            });
                        });
                }
            },

            onPage(event) {
                this.pagina = event.page;
                this.qtdRegistro = event.rows;
                StorageService.setControlePagina("TIPO_GMO", this.pagina, this.qtdRegistro);
                this.carregarGmo();
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.gmos = [];
                this.carregarGmo();
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            formatDecimal(value, minimumFractionDigits = 2, maximumFractionDigits = 2) {
                return Formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
            },
        }
    }
</script>
