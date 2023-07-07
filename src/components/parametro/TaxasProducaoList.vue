<template>
    <div class="card">
        <Toast />
        <div class="flex align-items-center">
            <i class="pi pi-cog mr-1" style="font-size: 1.4rem"></i>
            <h4 style="margin:0px 5px;">Taxas de Produção</h4>
        </div>
        <hr />
    
        <DataTable
            scrollable 
            responsiveLayout="stack"    
            showGridlines
            selectionMode="single"
            v-model:selection="taxaProducaoSelecionada"
            :value="taxaProducao" 
            @sort="onSort($event)"     >

            <template #header>
                <TaxasProducaoFiltro
                    :visible="visible"
                    @filtrar="carregarTaxasProducao"/>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>            
            
            <Column field="descricao" header="Descrição" style="width:16rem;" frozen :sortable="true"/> 
            <Column field="safra" header="Safra" style="width:5rem;" frozen :sortable="true"/>
            
            <Column field="dataAtualizacao" header="Atualização" style="width:11rem;">
                <template #body="{ data }">
                    {{ formatDateCustom(data.dataAtualizacao, 'DD/MM/YYYY HH:mm:ss') }}
                </template>
            </Column>

            <Column field="cobraRecepcao" header="Cobra Recepção?" style="width:10rem;">
                <template #body="{data}">
                    {{ data.cobraRecepcao? 'Sim':'Não'}}
                </template>
            </Column>

            <Column field="tipoCobraRecepcaoPor" header="Tipo Cobrança Recepção" style="width:13rem;">
                <template #body="{data}">
                    {{ data.tipoCobraRecepcaoPor === 'ENTRADA'? 'Entrada': 'Fixação'  }}
                </template>
            </Column>

            <Column field="valorTaxaRecepcao" header="Vlr. Taxa Recepção" style="width:10rem;">
                <template #body="{data}">
                    {{ 'R$ ' + formatDecimal(data.valorTaxaRecepcao, 2, 9) }}
                </template>"
            </Column>

            <Column field="cobraSecagem" header="Cobra Sec./Limp.?" style="width:12rem;">
                <template #body="{data}">
                    {{ data.cobraSecagem? 'Sim':'Não'}}
                </template>
            </Column>

            <Column field="tipoCobraSecagemNa" header="Tipo Cobr. Secagem" style="width:12rem;">
                <template #body="{data}">
                    {{ data.tipoCobraSecagemNa === 'NENHUM'? 'Nenhum': data.tipoCobraSecagemNa === 'ENTRADA'? 'Entrada': 'Fixação'  }}
                </template>
            </Column>

            <Column field="tipoCobrancaSecagemPor" header="Tipo Cobr. Secagem Por" style="width:12rem;">
                <template #body="{data}">
                    {{ data.tipoCobrancaSecagemPor === 'NENHUM'? 'Nenhum': data.tipoCobrancaSecagemPor === 'VALOR'? 'Valor': 'Em Quilos'  }}
                </template>
            </Column>

            <Column field="cobrancaArmazenagem" header="Cobra Armazenagem?" style="width:11rem;">
                <template #body="{data}">
                    {{ data.cobrancaArmazenagem? 'Sim':'Não'}}
                </template>
            </Column>

            <Column field="valorArmazenagem" header="Valor Armazenagem" style="width:10rem;" >
                <template #body="{data}">
                    {{ 'R$ ' + formatDecimal(data.valorArmazenagem, 9, 9) }}
                </template>"
            </Column>

            <Column field="dataCobrancaArmazenagem" header="Data Corte" style="width:8rem;">
                <template #body="{ data }">
                    {{ formatDateCustom(data.dataCobrancaArmazenagem, 'DD/MM/YYYY') }}
                </template>
            </Column>

            <Column field="dataIntegracao" header="Data Integração" style="width:11rem;">
                <template #body="{ data }">
                    {{ formatDateCustom(data.dataIntegracao, 'DD/MM/YYYY HH:mm:ss') }}
                </template>
            </Column> 

            <Column header="Ações" style="min-width:310px;" alignFrozen="right" frozen>
                <template #body="{ data }">
                    <div class="flex-none">
                        <Button title="Copiar" v-if="integration.visible" class="p-button-rounded m-2 bg-blue-400" icon="pi pi-copy" @click="copiar(data.id)"/>
                        <Button title="Visualizar Histórico" icon="pi pi-list" class="p-button-rounded p-button-warning flex-none mr-2 mb-2" @click="visualizarHistorico(data.id)"></Button>
                        <Button title="Editar" v-if="integration.visible" icon="pi pi-pencil" class="p-button-rounded p-button-info flex-none mr-2 mb-2" @click="editar(data.id)"></Button>
                        <Button title="Visualizar Grupo de Produtos" class="p-button-rounded p-button-success flex-none mr-2 mb-2"  icon="pi pi-shopping-bag" @click="visualizarGrupoProduto(data.id)"></Button>
                        <Button title="Visualizar Estabelecimentos" class="p-button-rounded p-button-success flex-none mr-2 mb-2"  icon="pi pi-home" @click="visualizarEstabelecimentos(data.id)"></Button>
                        <Button title="Visualizar Períodos de Carência" class="p-button-rounded p-button-success flex-none mr-2 mb-2"  icon="pi pi-calendar" @click="visualizarPeriodosCarencia(data.id)"></Button>
                        <Button v-if="integration.visible" class="p-button-rounded p-button-warning flex-none m-2" icon="pi pi-send" title="Sincronizar com ERP" @click="sincronizar(data.id)"></Button>                    
                        
                        <Button title="Deletar" v-if="integration.visible" icon="pi pi-trash" class="p-button-rounded p-button-danger flex-none mr-2 mb-2" @click="confirmarDeletar(data)"></Button>
                    </div>
                </template>
            </Column>
        </DataTable>
        <Paginator
            v-model:first="firstRow"
            :rows="qtdRegistro"
            :totalRecords="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage">
        </Paginator>


        <Dialog v-model:visible="ativarDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
            <div class="flex align-items-center justify-content-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>Deseja <strong>{{ item.ativo ? 'inativar' : 'ativar' }}</strong> a Taxa de Produção?</span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarDialog = false" />
                <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()" />
            </template>
        </Dialog>
        
        <TaxasProducaoHistoricos
            :tipoPagina="tipoPagina"
            :idRegistro="idTaxasProducao"
            :visivel="historicoDialog"
            @fechar="ocultarHistorico()"
        />

        <TaxaEstabelecimentos
            :idTaxa="idTaxa"
            :visivel="estabelecimentosDialog"
            @fechar="ocultarEstabelecimentos()"
        />

        <TaxaPeriodoCarencia
            :idTaxa="idTaxa"
            :visivel="periodoCarenciaDialog"
            @fechar="ocultarPeriodosCarencia()"
        />

        <TaxaGrupoProduto
            :idTaxa="idTaxa"
            :visivel="grupoProdutoDialog"
            @fechar="ocultarGrupoProduto()"
        />

    </div>

    <Dialog v-model:visible="excluirDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <span>Deseja <strong>excluir</strong> a Taxa de Produção <strong>{{ taxaExcluir.descricao }}</strong>?</span>
            
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="excluirDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="deletar(taxaExcluir.id)" />
        </template>
    </Dialog>

</template>

<script>
    import TaxasProducaoFiltro from '../../components/parametro/TaxasProducaoFiltro.vue';
    import TaxaProducaoService from '../../service/TaxasProducaoService';
    import TaxasProducaoHistoricos from './TaxasProducaoHistoricos.vue';
    import IntegracaoService from '../../service/IntegracaoService';
    import Formatacao from '../../utilities/Formatacao';
    import TaxaEstabelecimentos from './TaxasProducaoEstabelecimentos.vue';
    import TaxaPeriodoCarencia from './TaxasProducaoPeriodosCarencia.vue';
    import TaxaGrupoProduto from './TaxasProducaoGrupoProduto.vue';
    import StorageService from '../../service/StorageService';
    import Paginator from 'primevue/paginator';

    export default {
        components: { TaxasProducaoFiltro, TaxasProducaoHistoricos, TaxaEstabelecimentos, TaxaPeriodoCarencia, TaxaGrupoProduto, Paginator },
        data() {
            return {
                pagina: 0,
                firstRow: 0,
                qtdRegistro: 10,
                totalRegistro: 0,
                sort:"safra,id",
                situacao:"ATIVO",
                filtros: {},
                
                item: null,
                taxaProducao: [],
                taxaProducaoSelecionada:{},
                historicoDialog: false,
                idTaxasProducao: null,
                integration: {},
                visible: true,

                tipoPagina:'',
                ativarDialog: false,
                grupoProdutoDialog:false,
                estabelecimentosDialog:false,
                periodoCarenciaDialog:false,
                idGrupoClassificacao:null,
                idTaxa:null,
                excluirDialog:false,
                taxaExcluir:null,                
                storange: StorageService.getControlePagina("TAXA_PRODUCAO"),
            }
        },

        created() {

            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;

            //verifica se o filtro está vazio
            this.filtros = this.storange.filtros? this.storange.filtros:{};

            this.carregarTaxasProducao(this.filtros);
            this.getIntegrationOptons();
        },

        methods: {  
            getIntegrationOptons(){
                const paginaAtual = "TAXA_PRODUCAO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                            this.visible = data.visible;
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

            
            formatDecimal(value, minimumFractionDigits = 2, maximumFractionDigits = 2) {
                return Formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
            },
            

            carregarTaxasProducao(filtros = {}) {                
                
                this.filtros = {...filtros};
                
                TaxaProducaoService.getTaxasProducao(this.pagina, this.qtdRegistro, this.filtros, this.sort, this.situacao)
                    .then(({ data }) => {

                        this.taxaProducao = data.content;
                        this.qtdRegistro = data.pageable.pageSize;
                        this.totalRegistro = data.totalElements;
                        StorageService.setControlePagina("TAXA_PRODUCAO", this.pagina, this.firstRow, this.qtdRegistro, this.filtros);
                    });
            },
            
            formatDateCustom(date, format) {
                return Formatacao.formatDateCustom(date, format);
            },

            editar(id) {
                this.$router.push(`/taxas-producao/editar/${ id }`);
            }, 

            onPage(event) {          
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;                     
                this.carregarTaxasProducao(this.filtros);
            },

            onSort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.sort = `${ sortField }` + `,id,${sortOrder}`;
                this.carregarTaxasProducao(this.filtros);
            },

            visualizarHistorico(id) {
                this.historicoDialog = true;
                this.idTaxasProducao = id;
            },
            
            copiar(id) {
                this.$router.push(`/taxas-producao/copiar/${id}`);
            },

            ocultarHistorico(){
                this.historicoDialog = false;
                this.idTaxasProducao = null;
            },

            confirmarDeletar(taxa) {
                this.taxaExcluir = taxa;
                this.excluirDialog = true;
            },

            deletar(id){
                TaxaProducaoService.deletarTaxa(id)
                    .then(response => {                            
                            this.$toast.add({
                                severity:'success',
                                detail:'A Taxa de Produção foi excluída com sucesso!', 
                                life: 3000
                            });
                            
                            this.carregarTaxasProducao(this.filtros);
                    })
                    .catch(error => {
                        if(this.id) {
                            this.$toast.add({
                                severity:'error', 
                                detail:'Falha ao excluir a Taxa de Produção!', 
                                life: 3000
                            });
                        }
                        else {
                            this.$toast.add({
                                severity:'error',
                                detail:'Falha ao excluir a Taxa de Produção!',
                                life: 3000
                            });
                        }
                    });
                    
                    this.excluirDialog = false
            },

            visualizarEstabelecimentos(id){
                this.estabelecimentosDialog = true;
                this.idTaxa = id;
            },

            ocultarEstabelecimentos(){
                this.estabelecimentosDialog = false;
                this.idTaxa = null;
            },

            visualizarPeriodosCarencia(id){
                this.periodoCarenciaDialog = true;
                this.idTaxa = id;
            },

            ocultarPeriodosCarencia(){
                this.periodoCarenciaDialog = false;
                this.idTaxa = null;
            },

            visualizarGrupoProduto(id){
                this.grupoProdutoDialog = true;
                this.idTaxa = id;
            },

            ocultarGrupoProduto(){
                this.grupoProdutoDialog = false;
                this.idTaxa = null;
            },

            sincronizar(id) {
                
                TaxaProducaoService.sincronizarComERP(id)
                    .then(() => {
                        
                            this.$toast.add({
                                severity:"success",
                                detail: "Sincronização solicitada com sucesso.", 
                                life: 3000
                            });
                            
                            this.carregarTaxasProducao(this.filtros);
                            
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:"error",
                            detail: "Erro ao tentar sincronizar.", 
                            life: 3000
                        });
                    })
                    .finally(() => {
                        //Aguarda 3 segundos para aguardar o retorno da integração.
                        setTimeout(() => { 
                            this.carregarTaxasProducao(this.filtros);
                        }, 3000);

                    });
            },

        }
    }
</script>

