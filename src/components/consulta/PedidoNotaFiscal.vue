<template>
    <div class="card">
        <Toast />

        <div class="flex align-items-center">
           <i class="pi pi-file" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;"> Pedidos de Nota Fiscal</h3>
        </div>
        <hr />

        <DataTable
            showGridlines
            selectionMode="single"
            responsiveLayout="stack"
            :value="database" 
            v-model:selection="pedido"
            bodyClass="align-items-center">

            <template #header>
                <PedidoNotaFiscalFiltro @filtrar="getNfRemessa"/>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="codEstabel" header="Estabelecimento"/>

            <Column field="nrRe" header="Nr. RE">
                <template #body="{ data }">
                    {{ data.nrRe }}
                </template>
            </Column>

            <Column field="funcaoNota" header="Função"/>

            <Column field="dtCriacao"  header="Data Criação" >
                <template #body="{ data }">
                    <div class="grid mt-2">
                        <span class="mt-1">{{ formatDate(data.dtCriacao, 'DD/MM/YYYY') + ' '+ data.hrCriacao}}</span>
                    </div>
                </template>
            </Column>
            <Column field="dtUltMov"  header="Data Últ. Movto" >
                <template #body="{ data }">
                    <div class="grid mt-2">
                        <span class="mt-1">{{ formatDate(data.dtUltMov, 'DD/MM/YYYY') + ' '+ data.hrUltMov}}</span>
                    </div>
                </template>
            </Column>
            <Column field="seqItem" header="Seq."/>
            <Column field="codRefer" header="Cód. Ref."/>
            <Column field="natOperacao" header="Nat. Operação"/>
            <Column field="nrDocto" header="Nr. NF"/>
            <Column field="quantidade" header="Quantidade" style="text-align: right;">
                <template #body="{ data }">
                    {{ formatDecimal(data.quantidade) }}
                </template>
            </Column>
            <Column field="descricaoStatus" header="Status"/>

            <Column header="Ações" style="width:8rem;">
                    <template #body="{ data }">
                        <Button class="p-button-rounded flex-none mr-3" icon="pi pi-pencil" title="Informar dados fiscais" @click="editarDadosFiscais(data)" :disabled="!data.pendenciasFiscais"></Button>
                        <Button class="p-button-rounded p-button-warning flex-none mr-3" icon="pi pi-send" title="Sincronizar com ERP" @click="sincronizar(data.id)"></Button>
                    </template>
                </Column>
        </DataTable>

        <Paginator v-model:first="firstRow" :rows="qtdRegistro" :totalRecords="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]" @page="onPage">
        </Paginator>
    </div>

    <div class="grid dashboard">
        <div class="col-12 md:col-4">
            <div class="card widget-expenses">
                <div class=card-header>
                    <h5>Resumo</h5>
                    <div>
                        <!--
                            <Button icon="pi pi-ellipsis-h" class="p-button-rounded p-button-text p-button-plain" @click="toggle"></Button>
                            <Menu ref="menu" :popup="true" :model="items"></Menu>
                        -->
                    </div>
                </div>
                <div class="card-subheader mb-2 pb-3">
                    Total de pedidos de nota fiscal por status
                </div>

                <div class="flex justify-content-between align-items-center my-2 item">
                    <div class="flex flex-column">
                        <div>
                            <i class="pi pi-clock type mb-2" style="font-size: 13pt;"></i>
                            <span class="value mb-1 ml-3" style="font-size: 1.5rem;">{{ this.indicadores.aguardandoIntegracao }}</span>
                        </div>                        
                        <span class="subtext">Aguardando Integração</span>
                    </div>
                    
                    <Button
                        icon="pi pi-send"
                        label="Sincronizar"
                        class="p-button-outlined ml-2"
                        :disabled="this.indicadores.aguardandoIntegracao == 0"
                        title="Enviar pedido de nota para o ERP"
                        @click="sincronizarComErpPorStatus('AGUARDANDO_INTEGRACAO')"/> 
                </div>
                <div class="flex justify-content-between align-items-center my-2 item">
                    <div class="flex flex-column">
                        <div>
                            <i class="pi pi-play type mb-2" style="font-size: 13pt;"></i>
                            <span class="value mb-1 ml-3" style="font-size: 1.5rem;">{{ this.indicadores.emProcesso }}</span>
                        </div>
                        <span class="subtext">Em Processamento</span>
                    </div>
                    
                    <Button
                        icon="pi pi-send"
                        label="Sincronizar"
                        class="p-button-outlined ml-2"
                        :disabled="this.indicadores.emProcesso == 0"
                        title="Enviar pedido de nota para o ERP"
                        @click="sincronizarComErpPorStatus('EM_PROCESSAMENTO')"/> 
                </div>
                <div class="flex justify-content-between align-items-center my-2 item">
                    <div class="flex flex-column">
                        <div>
                            <i class="pi pi-history type mb-2" style="font-size: 13pt;"></i>
                            <span class="value mb-1 ml-3" style="font-size: 1.5rem;">{{ this.indicadores.aguardandoTotvs }}</span>
                        </div>
                        <span class="subtext">Aguardando TOTVS</span>
                    </div>
                    
                    <Button
                        icon="pi pi-send"
                        label="Sincronizar"
                        class="p-button-outlined ml-2"
                        :disabled="this.indicadores.aguardandoTotvs == 0"
                        title="Enviar pedido de nota para o ERP"
                        @click="sincronizarComErpPorStatus('AGUARDANDO_TOTVS')"/> 

                </div>
                <div class="flex justify-content-between align-items-center my-2 item">
                    <div class="flex flex-column">
                        <div>
                            <i class="pi pi-check-square type mb-2" style="font-size: 13pt;"></i>
                            <span class="value mb-1 ml-3" style="font-size: 1.5rem;">{{ this.indicadores.nfeGerada }}</span>
                        </div>
                        <span class="subtext">NFe Gerada</span>
                    </div>

                </div>
            </div>
        </div>

        <div class="col-12 md:col-8">
            <div class="card widget-traffic height-100">
                <div class="card-header">
                    <h5>Pedidos por função</h5>
                    <Button label="Pie/Doughnut Data" class="p-button-text" @click="togglePieDoughnut()"></Button>
                    <Button label="Semi/Full Data" class="p-button-text mx-2" @click="changePieDoughnutDataView()"></Button>
                </div>
                <div class="flex grid">
                    <div class="col-12 md:col-3 left flex flex-column justify-content-evenly">
                        <div class="total flex flex-column">
                            <span class="title mb-2">Total geral</span>
                            <span class="value mb-5">{{this.indicadores.total}}</span>
                        </div>

                        <div class="info flex justify-content-between">
                            <div class="organic flex flex-column">
                                <span class="title mb-1" title="PF">Gera</span>
                                <span class="value" style="font-size: 1.5rem">{{ this.indicadores.funcaoGera }}</span>
                            </div>
                            <div class="direct flex flex-column">
                                <span class="title mb-1" title="PJ com NFE">Escritura</span>
                                <span class="value" style="font-size: 1.5rem">{{ this.indicadores.funcaoEscritura }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 md:col-9 right flex justify-content-center">
                        <Chart ref="pie" type="pie" :data="pieData" :height="350"></Chart>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <PedidoNotaFiscalModalDadosFiscais :visivel="dialogDadosFiscais" :dados="dados" @fechar="fecharDadosFiscais" />
</template>

<script>
    import NfRemessaService from '../../service/NfRemessaService'
    import PedidoNotaFiscalFiltro from './PedidoNotaFiscalFiltro.vue';
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';
    import Paginator from 'primevue/paginator';
    import PedidoNotaFiscalModalDadosFiscais from './PedidoNotaFiscalModalDadosFiscais.vue';

    export default {
        components: { PedidoNotaFiscalFiltro, Paginator, PedidoNotaFiscalModalDadosFiscais },
        data() {
            return {
                database: [], 
                pedido: null,  
                filtros: {},
                totalRegistro: 0,
                qtdRegistro: 10,
                pagina: 0,
                firstRow: 0,
                pieData: null,
                indicadores: {
                    "funcaoGera": 0,
                    "funcaoEscritura": 0
                },
                storange: StorageService.getControlePagina("PEDIDO_NOTA_FISCAL"),
                
                dados: null,
                dialogDadosFiscais: false
            }
        },

        created() {
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;
            this.filtros = this.storange.filtros ? this.storange.filtros : {};
        },

        mounted(){
            this.refreshChart();
        },

        methods:{
            editarDadosFiscais(dados) {
                this.dados = dados;
                this.dialogDadosFiscais = true;
            },

            fecharDadosFiscais() {
                this.dialogDadosFiscais = false;
                this.dados = null;
                this.getNfRemessa(this.filtros, true);
            },

            getNfRemessa(filtros = {}, iconePageUm = false) {
                this.filtros = filtros;
                let ordenar = 'dtCriacao,codEstabel,desc';
                if (iconePageUm) {this.pagina = 1; this.firstRow = 0;}                

                NfRemessaService.getNfRemessa(this.pagina, this.qtdRegistro, ordenar, filtros)
                    .then(({ data }) => {
                        if(data) {                            
                            this.database = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                            StorageService.setControlePagina("PEDIDO_NOTA_FISCAL", this.pagina, this.firstRow, this.qtdRegistro, this.filtros);


                            NfRemessaService.buscarIndicadores(this.filtros)
                            .then(({ data }) => {
                                this.indicadores = data;
                                this.refreshChart();
                            })
                            .catch(error => {
                                this.database = [];
                                this.qtdRegistro = 0;
                                this.totalRegistro = 0;
                                this.indicadores = {};
                            });   

                        }
                    })
                    .catch(error => {
                        this.database = [];
                        this.qtdRegistro = 0;
                        this.totalRegistro = 0;
                        this.indicadores = {};
                    });

                this.refreshChart();
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.qtdRegistro = event.rows;
                this.firstRow = event.rows * event.page;
                this.getNfRemessa(this.filtros);
            },
            formatDecimal(value, minimumFractionDigits = 4, maximumFractionDigits = 4) {
                return Formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
            },
            togglePieDoughnut() {
                this.$refs.pie.chart.config.options.cutout = this.$refs.pie.chart.config.options.cutout ? 0 : 50;
                this.$refs.pie.chart.update();
            },
            changePieDoughnutDataView() {
                if (this.$refs.pie.chart.config.options.circumference === 180) {
                    this.$refs.pie.chart.config.options.circumference = 360;
                    this.$refs.pie.chart.config.options.rotation = 0;
                } else {
                    this.$refs.pie.chart.config.options.circumference = 180;
                    this.$refs.pie.chart.config.options.rotation = -1 * 90;
                }

                this.$refs.pie.chart.update();
            },
            refreshChart() {
                this.pieData = this.getPieData();
            },
            getPieData() {
                const { limeColor, blueColor } = this.getColors();
                const borderColor = getComputedStyle(document.body).getPropertyValue('--divider-color') || 'rgba(160, 167, 181, .3)';
                return {
                    labels: ['Gera', 'Escritura'],
                    datasets: [
                        {
                            data: [this.indicadores.funcaoGera, this.indicadores.funcaoEscritura],
                            backgroundColor: [
                                blueColor,
                                limeColor
                            ],
                            borderColor
                        }
                    ]
                }
            },
            getColors() {
                const isLight = this.$appState.layoutMode === 'light';
                return {
                    pinkColor: isLight ? '#EC407A' : '#F48FB1',
                    purpleColor: isLight ? '#AB47BC' : '#CE93D8',
                    deeppurpleColor: isLight ? '#7E57C2' : '#B39DDB',
                    indigoColor: isLight ? '#5C6BC0' : '#9FA8DA',
                    blueColor: isLight ? '#42A5F5' : '#90CAF9',
                    lightblueColor: isLight ? '#29B6F6' : '#81D4FA',
                    cyanColor: isLight ? '#00ACC1' : '#4DD0E1',
                    tealColor: isLight ? '#26A69A' : '#80CBC4',
                    greenColor: isLight ? '#66BB6A' : '#A5D6A7',
                    lightgreenColor: isLight ? '#9CCC65' : '#C5E1A5',
                    limeColor: isLight ? '#D4E157' : '#E6EE9C',
                    yellowColor: isLight ? 'FFEE58' : '#FFF59D',
                    amberColor: isLight ? '#FFCA28' : '#FFE082',
                    orangeColor: isLight ? '#FFA726' : '#FFCC80',
                    deeporangeColor: isLight ? '#FF7043' : '#FFAB91',
                    brownColor: isLight ? '#8D6E63' : '#BCAAA4'
                }
            },

            sincronizar(id) {
                NfRemessaService.sincronizarComERP(id)
                    .then(() => {
                        this.$toast.add({
                            severity:"success",
                            detail: "Sincronização solicitada com sucesso.", 
                            life: 5000
                        });
                        this.getNfRemessa(this.filtros);
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:"error",
                            detail: "Erro ao tentar sincronizar.", 
                            life: 5000
                        });
                    });
            },

            sincronizarComErpPorStatus(status){
                NfRemessaService.sincronizarComErpPorStatus(status, this.filtros)
                    .then(() => {
                        this.$toast.add({
                            severity:"success",
                            detail: "Sincronização solicitada com sucesso.", 
                            life: 5000
                        });
                        this.getNfRemessa(this.filtros);
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:"error",
                            detail: "Erro ao tentar sincronizar.", 
                            life: 5000
                        });
                    });
            }
        }
    }
</script>