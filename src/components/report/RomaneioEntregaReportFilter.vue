<template>
    <div class="card" id="romaneio-list">
        <Toast />
        <div class="flex align-items-center">
            <i class="pi pi-file mr-1" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;">Relatório - Romaneio de Entrega</h3>
        </div>
        <hr />

        <div class="mt-2 mr-2" style="min-width:10rem; max-width: 17.5rem;">
            <label for="estabelecimento"><strong>Estabelecimento</strong></label>
            <AutoComplete class="w-full mt-2" id="estabelecimento" placeholder="Selecionar"
                v-model="filtros.estabelecimento" field="label" :suggestions="estabelecimentosFiltrados" :dropdown="true"
                @complete="buscarEstabelecimento($event)"></AutoComplete>
        </div>

        <div class="mt-2 mr-2" style="min-width:14rem;">
            <label><strong>Número do Romaneio de Entrega</strong></label>
            <div class="flex align-items-center mt-1">
                <div class="overflow-hidden" style="width:8rem;">
                    <InputNumber v-model="reportFilter.numeroInicialRE" placeholder="0" :max="99999999" />
                </div>
                <strong class="ml-2 mr-2">à</strong>
                <div class="overflow-hidden" style="width:8rem;">
                    <InputNumber v-model="reportFilter.numeroFinalRE" placeholder="99.999.999" :max="99999999"
                        :min="reportFilter.numeroInicialRE" />
                </div>
            </div>
        </div>

        <div class="mt-2 mr-2" style="min-width:14rem;">
            <label><strong>Código do Produtor</strong></label>
            <div class="flex align-items-center mt-1">
                <div class="overflow-hidden" style="width:8rem;">
                    <InputNumber v-model="reportFilter.produtorInicial" placeholder="0" :max="99999999" />
                </div>
                <strong class="ml-2 mr-2">à</strong>
                <div class="overflow-hidden" style="width:8rem;">
                    <InputNumber v-model="reportFilter.produtorFinal" placeholder="99.999.999" :max="99999999"
                        :min="reportFilter.produtorInicial" />
                </div>
            </div>
        </div>

        <div class="mt-2 mr-2">
            <label><strong>Data de Emissão</strong></label>
            <div class="flex align-items-center mt-1">
                <div class="overflow-hidden" style="width:8rem;">
                    <Calendar class="w-full" v-model="reportFilter.dataInicialEmissao" autocomplete="off"
                        dateFormat="dd/mm/yy" />
                </div>
                <strong class="ml-2 mr-2">à</strong>
                <div class="overflow-hidden" style="width:8rem;">
                    <div class="p-inputgroup">
                        <Calendar class="w-full" v-model="reportFilter.dataFinalEmissao" autocomplete="off"
                            dateFormat="dd/mm/yy" :minDate="reportFilter.dataInicialEmissao" />
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-2 mr-2">
            <div class="field-checkbox">
                <Checkbox inputId="apenas-re-pendente" :binary="true" v-model="reportFilter.apenasREPendente"/>
                <label for="apenas-re-pendente"><strong>Imprimir apenas não impressas</strong></label>
            </div>
        </div>

        <div class="mt-2 mr-2">
            <Button icon="pi pi-print" label="Imprimir" class="p-button-success " style="padding: 0.4rem;"
                @click="imprimirRelatorio()"></Button>
        </div>


    </div>
</template>

<script>
import IntegracaoService from '../../service/IntegracaoService';
import StorageService from '../../service/StorageService';
import RecebimentoDeEntregaReportService from '../../service/RecebimentoDeEntregaReportService';
import EstabelecimentoService from '../../service/EstabelecimentoService';
import moment from 'moment';

export default {
    name: 'RomaneioEntregaList',
    components: {},
    data() {
        return {
            reportFilter: {
                estabelecimento: null,
                numeroInicialRE: 0,
                numeroFinalRE: 99999999,
                dataInicialEmissao: moment(new Date()).subtract(30, 'days').toDate(),
                dataFinalEmissao: new Date(),
                produtorInicial: 0,
                produtorFinal: 99999999,
                apenasREPendente: false,
            },

            filtros: {},
            integration: {},
            estabelecimentos: [],
            estabelecimentosFiltrados: [],
            grupoProdutoFiltrados: [],
            storange: StorageService.getControlePagina("ROMANEIO_ENTREGA_REPORT"),
        }
    },

    created() {
        this.getIntegrationOptons();
    },

    async mounted() {
        await this.carregarEstabelecimentos();
    },

    methods: {

        getIntegrationOptons() {
            const paginaAtual = "ROMANEIO_ENTREGA";
            IntegracaoService.getIntegrationOptions(paginaAtual)
                .then(({ data }) => {
                    if (data) {
                        this.integration = data;
                    }
                })
                .catch(error => {
                    this.$toast.add({
                        severity: 'info',
                        summary: 'PARÂMETROS DE PÁGINA NÂO DEFINIDOS',
                        detail: 'Você deve cadastrar os parâmetros para esta página no menu lateral em item: Parâmetros de Integração.',
                        life: 10000
                    });
                });
        },

        async carregarEstabelecimentos() {
            const { data } = await EstabelecimentoService.getTodosEstabelecimentosSilo();
            if (data) {
                this.estabelecimentos = data.map(item => {
                    item["label"] = `${item.codigo} - ${item.nomeFantasia}`;
                    return item;
                });
            }
        },

        buscarEstabelecimento(event) {
            setTimeout(() => {
                if (!event.query.trim().length) {
                    this.estabelecimentosFiltrados = [...this.estabelecimentos];
                }
                else {
                    this.estabelecimentosFiltrados = this.estabelecimentos.filter((item) => {
                        return item.label.toLowerCase().startsWith(event.query.toLowerCase());
                    });
                }
            }, 250);
        },

        imprimirRelatorio() {
            if (!this.validarFiltros()) return;

            this.reportFilter.estabelecimento = this.filtros.estabelecimento.codigo;

            RecebimentoDeEntregaReportService.putImprimirRelatorio(this.reportFilter)
                .then(response => {
                    let urlBlobObject = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                    window.open(urlBlobObject);
                })
            
        },

        validarFiltros(){
            console.log('validarFiltros', this.reportFilter);

            if(!this.filtros.estabelecimento){
                this.$toast.add({
                    severity:'warn', 
                    detail:'Informe o Estabelecimento.', 
                    life: 3000
                });
                return false;
            }
            
            if(this.reportFilter.numeroInicialRE == null){
                this.$toast.add({
                    severity:'warn', 
                    detail:'Informe o número inicial do romaneio.',
                    life: 3000
                });
                return false;
            }

            if(this.reportFilter.numeroFinalRE == null){
                this.$toast.add({
                    severity:'warn', 
                    detail:'Informe o número final do romaneio.', 
                    life: 3000
                });
                return false;
            }

            if(this.reportFilter.produtorInicial == null){
                this.$toast.add({
                    severity:'warn', 
                    detail:'Informe o produtor inicial.', 
                    life: 3000
                });
                return false;
            }

            if(this.reportFilter.produtorFinal == null){
                this.$toast.add({
                    severity:'warn', 
                    detail:'Informe o produtor final.', 
                    life: 3000
                });
                return false;
            }

            if(this.reportFilter.dataInicialEmissao == null){
                this.$toast.add({
                    severity:'warn', 
                    detail:'Informe a data inicial.', 
                    life: 3000
                });
                return false;
            }

            if(this.reportFilter.dataFinalEmissao == null){
                this.$toast.add({
                    severity:'warn', 
                    detail:'Informe a data final.', 
                    life: 3000
                });
                return false;
            }

            return true;
        },

        fazerDownloadPDF(urlBlobObject) {
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

