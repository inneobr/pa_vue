<template>
    <div class="card" id="pesagem-list">

        <Toast />

        <div class="flex align-items-center">
           <i class="pi pi-tablet mr-1" style="font-size: 1.4rem"></i>
           <h3 style="margin:0px 5px;">Ticket Pesagem</h3>
        </div>

        <hr />
        
        <DataTable 
            responsiveLayout="scroll"
            v-model:selection="pesagem"
            selectionMode="single"
            scrollDirection="both"
            showGridlines
            :value="pesagens"
            :scrollable="true">

            <template #header>
                <TicketPesagemFiltro
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

            <Column field="nroDocPesagem" header="Nr. Doc" style="width:5rem;" frozen sortable>
                <template #body="{ data }">
                    <strong>{{ data.nroDocPesagem }}</strong>
                </template>
            </Column>
            <Column field="placa" header="Placa" style="width:6rem;" frozen sortable>
                <template #body="{ data }">
                    <strong>{{ data.placa }}</strong>
                </template>
            </Column>
            <Column field="data" header="Entrada" style="width:11.5rem;" frozen sortable>
                <template #body="{ data }">
                    <strong>{{ formatDate(data.data, 'DD/MM/YYYY') + ' ' + data.hora }}</strong>
                </template>
            </Column>
            <Column field="codProduto" header="Produto" style="width:6rem;" sortable />
            <Column field="codigoMoega" header="Moega" style="width:8rem;" sortable />
            <Column field="codEstabelecimento" header="Estab." style="width:5rem;" />
            <Column field="codProdutor" header="Produtor" style="width:6rem;" sortable/>
            <Column field="matricula" header="Imóvel" style="width:5rem;" sortable/>
            <Column field="pesoEntrada" header="Peso Entrada" style="width:8rem;" sortable>
                <template #body="{ data }">
                    {{ formatDecimal(data.pesoEntrada, 0, 3) }} Kg
                </template>
            </Column>
            <Column field="pesoSaida" header="Peso Saída" style="width:7rem;" sortable>
                <template #body="{ data }">
                    {{ formatDecimal(data.pesoSaida, 0, 3) }} Kg
                </template>
            </Column>
            <Column field="pesoLiquido" header="Peso Líq." style="width:7rem;" sortable>
                <template #body="{ data }">
                    {{ formatDecimal(data.pesoLiquido, 0, 3) }} Kg
                </template>
            </Column>
            <Column field="nfProdutor" header="NF. Produtor" style="width:8rem;" sortable/>
            <Column field="motorista" header="Motorista" style="width:10rem;" sortable/>
            <Column field="safra" header="Safra" style="width:4rem;" sortable/>
            <Column header="Saída" style="width:11rem;" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.dataSaida, 'DD/MM/YYYY') + ' ' + data.horaSaida }}
                </template>
            </Column>
            <Column field="clChuAvar" header="Chuv/Ava." style="width:6rem;" sortable>
                <template #body="{ data }">
                    {{ formatDecimal(data.clChuAvar, 1, 1) }}
                </template>
            </Column>
            <Column field="clImpureza" header="Imp." style="width:4rem;" sortable>
                <template #body="{ data }">
                    {{ formatDecimal(data.clImpureza, 1, 1) }}
                </template>
            </Column>
            <Column field="clUmidade" header="Umid." style="width:4rem;" sortable>
                <template #body="{ data }">
                    {{ formatDecimal(data.clUmidade, 1, 1) }}
                </template>
            </Column>
            <Column field="clPh" header="PH" style="width:4rem;" sortable>
                <template #body="{ data }">
                    {{ formatDecimal(data.clPh, 1, 1) }}
                </template>
            </Column>
            <Column field="clTbm" header="TBM" style="width:4rem;" sortable>
                <template #body="{ data }">
                    {{ formatDecimal(data.clTbm, 1, 1) }}
                </template>
            </Column>
            <Column field="situacao" header="Situação" style="width:7rem;" alignFrozen="right" frozen sortable>
                <template #body="{ data }">
                    <strong v-if="data.status !== 'CONCLUIDO'" style="color:#E50000">
                        {{ getDescricaoSituacao(data.status) }}
                    </strong>
                    <strong v-if="data.status === 'CONCLUIDO'" style="color:#0000E5">
                        {{ getDescricaoSituacao(data.status) }}
                    </strong>
                </template>
            </Column>
            <Column header="Ações" style="width:4.5rem;" alignFrozen="right" frozen>
                <template #body="{ data }">
                    <Button title="Visualizar Histórico" icon="pi pi-list" class="p-button-rounded p-button-warning flex-none mr-2 mb-2"  @click="abrirHistorico(data)">
                        
                    </Button>
                </template>
            </Column>
        </DataTable>
        
        <Paginator
            v-model:first="firstRow"
            :rows="qtdRegistro"
            :total-records="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage"/>

        <hr />

        <div class="grid">
            <div class="col-6">
                <label for="observacoes"><strong>Observações</strong></label>
                <Textarea class="w-full" id="observacoes" v-model="pesagem.observacao" rows="3" :disabled="true"></Textarea>
            </div>
            <div class="col-6">
                <label for="medidorUmidade"><strong>Medidor de umidade</strong></label>
                <Textarea class="w-full" id="medidorUmidade" v-model="pesagem.leituraUmidade" rows="3" :disabled="true"></Textarea>
            </div>
        </div>
    </div>

    <TicketPesagemListHistorico
        :pesagem="historico"
        :visivel="historicoDialog"
        @fechar="fecharHistorico()"
    />
</template>

<script>
    import TicketPesagemListHistorico from './TicketPesagemListHistorico.vue';
    import IntegracaoService from '../../service/IntegracaoService';
    import TicketPesagemFiltro from './TicketPesagemFiltro.vue';
    import PesagemService from '../../service/PesagemService';
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';
    import Paginator from 'primevue/paginator';

    export default {
        name: 'TicketPesagemList',
        components: { Paginator, TicketPesagemFiltro, TicketPesagemListHistorico },
        data() {
            return {
                totalRegistro: 0,
                qtdRegistro: 10,
                pagina: 0,
                firstRow: 0,
                pesagens: [],
                filtros: {},
                pesagem: {},
                historico: null,
                ordenar:null,
                integration: {},
                historicoDialog: false,
                storange: StorageService.getControlePagina("TICKET_PESAGEM"),
            }
        },

        created() {
            this.pagina = this.storange.numero;
            this.qtdRegistro = this.storange.qtdRegistro;  
            this.getIntegrationOptons();
        },
        methods: {

            getIntegrationOptons(){
                const paginaAtual = "TICKET_PESAGEM";
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
                console.log('Valor Filtro - 1', filtros);
                console.log('Valor Filtro - 2', this.filtros);

                this.filtros = filtros;

                console.log('Valor Filtro - 3', filtros);
                console.log('Valor Filtro - 4', this.filtros);

                this.carregarDados();
            },

            carregarDados() {                
                console.log('Valor Filtro - X!', this.filtros);

                PesagemService.getPessagens(this.pagina, this.qtdRegistro, this.filtros, this.ordenar)
                    .then(({ data }) => {
                        if(data) {
                            this.pesagens = data.content;

                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalElements;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.pesagens = [];
                        this.qtdRegistro = 0;
                        this.totalRegistro = 0;
                    });
                    StorageService.setControlePagina("TICKET_PESAGEM", this.pagina, this.qtdRegistro);
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;   

                this.carregarDados();
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            formatDecimal(value, minimumFractionDigits = 2, maximumFractionDigits = 2) {
                return Formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
            },

            getDescricaoSituacao(codigo) {
                if(codigo === "AGUARDANDO_RE") {
                    return "Aguard. RE";
                }
                else if(codigo === "GERANDO_RE") {
                    return "Gerando RE";
                }
                else if(codigo === "CONCLUIDO") {
                    return "Concluído";
                }
            },

            abrirHistorico(dados) {
                this.historicoDialog = true;
                this.historico = dados;
            },

            fecharHistorico() {
                this.historicoDialog = false;
                this.historico = null;
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.pesagens = [];
                this.carregarDados();
            },
        }
    }
</script>
