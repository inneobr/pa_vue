<template>
    <div class="card">
        <Toast />

        <div class="flex align-items-center">
           <i class="pi pi-cog mr-1" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;"> Parâmetros de Estabelecimento</h3>
        </div>

        <hr />

        <DataTable 
            showGridlines 
            responsiveLayout="stack" 
            :value="parametros" 
            selectionMode="single"
            @sort="sort($event)"
            v-model:selection="parametroEstabelecimentoSelecionado">

            <template #header>
                <div class="grid justify-content-between">
                    <div class="col-12 xl:col-9 grid align-items-center">
                        <Button v-if="integration.visible"
                            @click="cadastrarNovo()"
                            class="p-button-info m-1" 
                            icon="pi pi-plus" 
                            label="Cadastrar" 
                            type="button" />
                    
                        <Button icon="pi pi-filter-slash" 
                            class="p-button-outlined m-1"
                            @click="limparFiltro()" 
                            label="Limpar filtro" 
                            type="button"/>

                        <Button @click="situacao = 'INATIVO'; carregarParametros()"                           
                            class="p-button-outlined p-button-danger m-1"
                            v-if="situacao == 'ATIVO'"
                            label="Listar inativos"
                            icon="pi pi-ban"
                            type="button"/>

                        <Button @click="situacao = 'ATIVO'; carregarParametros()"
                            v-if="situacao == 'INATIVO'"
                            class="p-button-outlined m-1"
                            icon="pi pi-check-circle"
                            label="Listar ativos"                            
                            type="button"/>

                    </div>

                    <div class="col-12 xl:col-3">
                        <InputText class="w-full" v-model="filtros" placeholder="Pesquisar" @change="carregarParametros()" />
                    </div>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="codigo" header="Código" style="width:8rem;" sortable=""/>            
            <Column field="nomeEst" header="Nome" />
            <Column field="dtMovtoAberto" header="Data Movimento" style="width:10rem;">
                <template #body="{ data }">
                    {{ formatDate(data.dtMovtoAberto, 'DD/MM/YYYY') }} 
                </template>
            </Column>
            <Column field="codEmitente" header="Cód. Emitente" />
            <Column field="codImovel" header="Cód. Imóvel" />
            <Column field="logUbs" header="Ubs">
                <template #body="{ data }">
                    {{ data.logUbs ? 'Sim' : 'Não' }}
                </template>
            </Column>
            <Column field="logSilo" header="Silo">
                <template #body="{ data }">
                    {{ data.logSilo ? 'Sim' : 'Não' }}
                </template>
            </Column>
            <Column field="logMaqCafe" header="Maq. Café">
                <template #body="{ data }">
                    {{ data.logMaqCafe ? 'Sim' : 'Não' }}
                </template>
            </Column>
            <Column field="logEntradaSemTik" header="Ent. S/ Ticket">
                <template #body="{ data }">
                    {{ data.logEntradaSemTik ? 'Sim' : 'Não' }}
                </template>
            </Column>

            <Column field="dataIntegracao" header="Integração" style="width:12rem;">
                <template #body="{ data }">
                    {{ formatDate(data.dataIntegracao, 'DD/MM/YYYY HH:mm:ss') }} 
                </template>
            </Column>

            <Column header="Ações" style="width:10rem;">
                <template #body="{ data }">
                    <div class="flex-none">
                        <Button v-if="situacao == 'ATIVO'" title="Visualizar Histórico" icon="pi pi-list" class="p-button-rounded p-button-warning flex-none mr-2" @click="visualizarHistorico(data.codigo)"/>
                        <Button v-if="integration.visible && situacao == 'ATIVO'" icon="pi pi-pencil"  class="p-button-rounded p-button-info flex-none mr-2" title="Editar" @click="editarParametro(data.id)" />

                        <Button v-if="!data.ativo && integration.visible" icon="pi pi-ban" class="p-button-rounded p-button-danger flex-none" title="Ativar" @click="confirmarAtivarOuInativar(data)" />
                        <Button v-if="data.ativo && integration.visible" icon="pi pi-check-circle" class="p-button-rounded p-button-info flex-none" title="Inativar" @click="confirmarAtivarOuInativar(data)" />
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
            <span>Deseja <strong>{{ parametro.ativo ? 'inativar' : 'ativar' }}</strong> o Parâmetro do Estabelecimento  <strong>{{ parametro.codNomeEstab }}</strong>?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarOuInativarDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()" />
        </template>
    </Dialog>

    <ParametroEstabelecimentoHistorico
        :codigo="codEstabelecimento"
        :visivel="historicoDialog"
        @fechar="ocultarHistorico()"/>
</template>

<script>
    import ParametroEstabelecimentoService from '../../service/ParametroEstabelecimentoService';
    import ParametroEstabelecimentoHistorico from './ParametroEstabelecimentoHistorico.vue';
    import IntegracaoService from '../../service/IntegracaoService';
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        components: { ParametroEstabelecimentoHistorico, ParametroEstabelecimentoService },
        name: 'Parametros Estabelecimentos',

        props: {
			id: {
				type: String,
				required: true
			}
		},

        data() {
            return {
                pagina: 0,
                firstRow: 0,
                totalRegistro: 0,
                qtdRegistro: 10, 

                
                parametro: {},
                parametros: [],                
                carregando: false,

                filtros: null,                
                historicoDialog: false,
                codEstabelecimento: null,
                situacao: 'ATIVO',
                ativarOuInativarDialog: false,
                integration: {},
                parametroEstabelecimentoSelecionado: {},
                storange: StorageService.getControlePagina("PARAMETRO_ESTABELECIMENTO"), 
            }
        },
        
        mounted() {
            this.filtros = this.storange.filtros ? this.storange.filtros : null;
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro; 

            this.carregarParametros();
            this.getIntegrationOptons();
        },
        methods: {
            getIntegrationOptons(){
                const paginaAtual = "PARAMETRO_ESTABELECIMENTO";
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
                            detail:'Você deve cadastrar os parâmetros para esta página no menu lateral em item: Parâmetros de Integração.',
                            life: 10000
                        });
                    });
            },

            carregarParametros() {
                this.carregando = true;
                ParametroEstabelecimentoService.getParametroPages(
                    this.pagina,
                    this.qtdRegistro,
                    this.filtros,
                    this.situacao, this.ordenar
                )
                    .then(({ data }) => {
                        if(data) {                      
                            this.parametros = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;        
                            this.carregando = false;
                        }
                    })
                    .catch(error => {
                        this.parametros = [];
                        this.carregando = false;
                    });
                StorageService.setControlePagina("PARAMETRO_ESTABELECIMENTO", this.pagina, this.firstRow, this.qtdRegistro, this.filtros);
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;  
                this.carregarParametros();
            },

            sort(event) {
                const sortField = event.sortField == "codigo" ? "estabelecimento." + event.sortField : event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.parametros = [];
                this.carregarParametros();
            },


            limparFiltro() {
                this.filtros = null;
                this.carregarParametros();
            },

            cadastrarNovo() {
                this.$router.push(`/parametros-estabelecimento/cadastrar`);
            },

            editarParametro(id) {
                this.$router.push(`parametros-estabelecimento/editar/${ id }`);
            },

            ocultarHistorico() {
                this.historicoDialog = false;
                this.codEstabelecimento = null;
            },

            visualizarHistorico(codigo) {
                this.historicoDialog = true;
                this.codEstabelecimento = codigo;
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            confirmarAtivarOuInativar(parametro) {
                this.parametro = parametro;
                this.ativarOuInativarDialog = true;
            },

            ativarOuInativar() {
                debugger
                if(this.parametro.ativo) {
                    ParametroEstabelecimentoService.inativar(this.parametro.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O Parâmetro de Estabelecimento ${ this.parametro.codNomeEstab }, foi inativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregarParametros();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao inativar o Parâmetro de Estabelecimento ${ this.parametro.codNomeEstab }!`, 
                                life: 3000
                            });
                        });
                }
                else {
                    ParametroEstabelecimentoService.ativar(this.parametro.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O Parâmetro de Estabelecimento ${ this.parametro.codNomeEstab }, foi ativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregarParametros();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail: `Falha ao ativar o Parâmetro de Estabelecimento  ${ this.parametro.codNomeEstab }!`, 
                                life: 3000
                            });
                        });
                }
            },
        }
    }
</script>