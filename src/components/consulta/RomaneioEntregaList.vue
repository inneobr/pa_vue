<template>
    <div class="card" id="romaneio-list">

        <Toast />

        <div class="flex align-items-center">
           <i class="pi pi-file mr-1" style="font-size: 1.4rem"></i>
           <h3 style="margin:0px 5px;">Romaneio de Entrega</h3>
        </div>

        <hr />
        
        <DataTable 
            responsiveLayout="scroll"
            v-model:selection="romaneio"
            selectionMode="single"
            scrollDirection="both"
            showGridlines
            :value="pesagens"
            :scrollable="true"
            @sort="sort($event)"
            >

            <template #header>
                <RomaneioEntregaFiltro
                    :totalRegistro="totalRegistro"
                    @filtrar="filtrar"
                />
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="nrRe" header="Nr. RE" style="width:6rem;" frozen sortable>
                <template #body="{ data }">
                    <strong>{{ formatDecimal(data.nrRe, 0, 0) }}</strong>
                </template>
            </Column>

            <Column field="pesoLiquido" header="Peso Líq." style="width:8rem;" frozen >
                <template #body="{ data }">
                    {{ formatDecimal(data.pesoLiquido, 0, 0) }} Kg
                </template>
            </Column>

            <Column field="rendaLiquidaAtu" header="Renda Líquida Atual(Kg)" style="width:8rem;" frozen >
                <template #body="{ data }">
                    {{ formatDecimal(data.itens[0].rendaLiquidaAtu, 0, 0) }} Kg
                </template>
            </Column>
            
            <Column field="saldo" header="Saldo" style="width:5rem;" frozen>
                <template #body="{ data }">
                    R$ {{ formatDecimal(data.saldo, 2, 9) }} 
                </template>
            </Column>

            <Column field="safra" header="Safra" style="width:5rem;" />

            <Column field="nrDocPes" header="Nr. Doc" style="width:7rem;" sortable>
                <template #body="{ data }">
                    {{ data.nrDocPes }}
                </template>
            </Column>

            <Column field="fmCodigo" header="Grupo de Produto" style="width:7rem;" >
                <template #body="{ data }">
                    <strong>{{ data.fmCodigo }}</strong>
                </template>
            </Column>

            <Column field="placa" header="Placa" style="width:7rem;" >
                <template #body="{ data }">
                    <strong>{{ data.placa }}</strong>
                </template>
            </Column>
            
            
            <Column field="codEmitente" header="Produtor" style="width:6rem;" sortable/>
            
            <Column field="dtEntrada" header="Data Entrada" style="width:11.5rem;" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.dtEntrada, 'DD/MM/YYYY') + ' ' + data.hrEntrada }}
                </template>
            </Column>

            <Column field="dtEmissao" header="Data Emissão" style="width:11.5rem;" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.dataCadastro, 'DD/MM/YYYY HH:mm:ss') }}
                </template>
            </Column>

            <Column field="matricula" header="Imóvel" style="width:5rem;" sortable/>
            <Column field="tulha" header="Moega" style="width:8rem;"  />
            <Column field="motorista" header="Motorista" style="width:10rem;" />
            <Column field="nrNfProd" header="NF. Produtor" style="width:9rem;" />
            <Column field="natureza" header="Natureza" style="width:9rem;" />
            <Column field="logIntegrado" header="Integrado" style="width:9rem;">
                <template #body="{ data }">
                    {{ data.logIntegrado? "Sim": "Não" }}
                </template>
            </Column>
            <Column header="Ações" style="width:9rem;" alignFrozen="right" frozen>
                <template #body="{ data }">
                    
                    <Button icon="pi pi-eye"
                        title="Editar"         
                        class="p-button-rounded p-button-info p-2 mr-2"    
                        @click="editar(data.id)">
                    </Button>
                    <Button icon="pi pi-list"
                        title="Movimentos do RE" 
                        class="p-button-rounded p-button-warning p-2 mr-2"
                        @click="visualizarMovimentosRe(data.nrRe)">
                    </Button>
                    <Button icon="pi pi-print"
                        title="Imprimir RE" 
                        class="p-button-rounded p-button-success p-2 mr-2"
                        @click="imprimirRelatorio(data)">
                    </Button>
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

    <RomaneioEntregaDetalhesList
        :romaneio="romaneioModal"
        :visivel="detalhesDialog"
        @fechar="fecharModalDetalhes()"
    />

    <RomaneioEntregaMovimentosRE
        :nrRe="nrRe"
        :visivel="movimentoReDialog"
        @fechar="fecharModalMovimentoRe()"
        />
</template>

<script>
    import RomaneioEntregaDetalhesList from './RomaneioEntregaDetalhesList.vue';
    import IntegracaoService from '../../service/IntegracaoService';
    import RomaneioEntregaFiltro from './RomaneioEntregaFiltro.vue';
    import RomaneioEntregaService from '../../service/RomaneioEntregaService';
    import Formatacao from '../../utilities/Formatacao';
    import RomaneioEntregaMovimentosRE from './RomaneioEntregaMovimentosRE.vue';
    import StorageService from '../../service/StorageService';
    import Paginator from 'primevue/paginator';
    import RecebimentoDeEntregaReportService from '../../service/RecebimentoDeEntregaReportService';
import { writeFile } from 'xlsx';

    export default {
        name: 'RomaneioEntregaList',
        components: { RomaneioEntregaFiltro, RomaneioEntregaDetalhesList, RomaneioEntregaMovimentosRE, Paginator },
        data() {
            return {
                totalRegistro: 0,
                qtdRegistro: 30,
                pagina: 0,
                firstRow: 0,
                pesagens: [],
                filtros: {},
                romaneio: {},
                romaneioModal: null,
                ordenar:null,
                integration: {},
                detalhesDialog: false,
                
                movimentoReDialog:false,
                nrRe: null,

                storange: StorageService.getControlePagina("ROMANEIO_ENTREGA"),
            }
        },

        created() {
            
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.default? this.qtdRegistro : this.storange.qtdRegistro; 
            
            this.getIntegrationOptons();

        },
        methods: {

            getIntegrationOptons(){
                const paginaAtual = "ROMANEIO_ENTREGA";
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

            filtrar(filtros = {}){

                this.filtros = filtros;

                this.carregarDados();
            },

            carregarDados() {
                
                console.log('qtdRegistro', this.qtdRegistro);
                
                RomaneioEntregaService.getRomaneios(this.pagina, this.qtdRegistro, this.filtros, this.ordenar)
                    .then(({ data }) => {
                        if(data) {
                            this.pesagens = data.content;
                                                        
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalElements;

                            StorageService.setControlePagina("ROMANEIO_ENTREGA", this.pagina, this.firstRow, this.qtdRegistro, this.filtros);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.pesagens = [];
                        this.qtdRegistro = 0;
                        this.totalRegistro = 0;
                    });
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;   
                this.carregarDados();
            },

            sort(event) {

                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.pesagens = [];
                this.carregarDados();
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            formatDecimal(value, minimumFractionDigits = 2, maximumFractionDigits = 2) {
                return Formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
            },

            getDescricaoSituacao(codigo) {
                if(codigo === "ATIVO") {
                    return "Ativo";
                }
                else if(codigo === "INATIVO") {
                    return "Inativo";
                }
            },

            abrirModalDetalhes(dados) {
                this.detalhesDialog = true;
                this.romaneioModal = dados;
            },

            fecharModalDetalhes() {
                this.detalhesDialog = false;
                this.romaneioModal = null;
            },

            editar(id) {
                this.$router.push(`/romaneio-entrega/consultar/${id}`);
            },
            
            visualizarMovimentosRe(nrRe){
                this.movimentoReDialog = true;
                this.nrRe = nrRe;
                console.log(this.nrRe);
            },

            fecharModalMovimentoRe(){
                this.movimentoReDialog = false;
                this.nrRe = null;
            },

            imprimirRelatorio(dados){
                let reportFilter = {
                    estabelecimento: dados.codEstabel,
                    numeroInicialRE: dados.nrRe,
                    numeroFinalRE: dados.nrRe,
                    dataInicialEmissao: dados.dtEmissao,
                    dataFinalEmissao: dados.dtEmissao,
                    produtorInicial: dados.codEmitente,
                    produtorFinal: dados.codEmitente,
                    apenasREPendente: false
                };

                RecebimentoDeEntregaReportService.putImprimirRelatorio(reportFilter)
                .then(response => { 
                    let urlBlobObject = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                    window.open(urlBlobObject);
                })
            },

            fazerDownloadPDF(urlBlobObject){
                let link = document.createElement('a');
                link.href = urlBlobObject;  
                link.download = "romaneio-entrega.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
        }
    }
</script>

