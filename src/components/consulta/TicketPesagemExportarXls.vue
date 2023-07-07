<template>
    <Button 
        icon="pi pi-file-excel"
        label="Exportar para Excel"
        title="Exportar para Excel"
        class="p-button-outlined mr-1"
        style="min-width: 9rem; padding: 0.4rem;"
        @click="exportar()"
    ></Button>
</template>

<script>
    import PesagemService from '../../service/PesagemService';
    import ExportarPlanilha from '../../utilities/ExportarPlanilha';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        props: {
            totalRegistro: {
                type: Number,
                required: true
            },
            filtros: {
                type: Object,
                required: true
            }
        },
        methods: {
            getDadosExportar() {
                return new Promise((resolve, reject) => {
                    PesagemService.getPessagens(0, this.totalRegistro, this.filtros)
                        .then(({ data }) => {
                            if(data && data.content) {
                                const dados = data.content.map(item => {
                                    item['data'] = Formatacao.formatDateCustom(item.data, 'DD/MM/YYYY') + ' ' + item.hora;
                                    item['dataSaida'] = Formatacao.formatDateCustom(item.dataSaida, 'DD/MM/YYYY') + ' ' + item.horaSaida;
                                    item['situacao'] = this.getDescricaoSituacao(item.status);
                                    return item;
                                });
                                
                                resolve(dados);
                            }
                            else {
                                reject("Falha ao obter dados!");
                            }
                        })
                        .catch(error => {
                            reject("Falha ao obter dados!", error);
                        });
                });
            },

            estruturaExportar(dados) {
                const colunas = [
                    {name: "nroDocPesagem", title: "Nr. Doc"},
                    {name: "placa", title: "Placa"},
                    {name: "data", title: "Entrada"},
                    {name: "codProduto", title: "Produto"},
                    {name: "codigoMoega", title: "Mega"},
                    {name: "codEstabelecimento", title: "Estab."},
                    {name: "codProdutor", title: "Produtor"},
                    {name: "codImovel", title: "Imóvel"},
                    {name: "pesoEntrada", title: "Peso Entrada"},
                    {name: "pesoSaida", title: "Peso Saída"},
                    {name: "pesoLiquido", title: "Peso Líq."},
                    {name: "nfProdutor", title: "NF. Produtor"},
                    {name: "motorista", title: "Motorista"},
                    {name: "safra", title: "Safra"},
                    {name: "dataSaida", title: "Saída"},
                    {name: "clChuAvar", title: "Chuv/Ava."},
                    {name: "clImpureza", title: "Imp."},
                    {name: "clUmidade", title: "Umid."},
                    {name: "clPh", title: "PH"},
                    {name: "clTbm", title: "TBM"},
                    {name: "situacao", title: "Situação"}
                ];

                ExportarPlanilha({
                    cols: colunas,
                    rows: dados,
                    types:{
                        nroDocPesagem: 'n',
                        codProdutor: 'n',
                        pesoEntrada: 'n',
                        pesoSaida:  'n',
                        pesoLiquido:  'n',
                        safra: 'n',
                        clChuAvar: 'n',
                        clImpureza: 'n',
                        clUmidade: 'n',
                        clPh: 'n',
                        clTbm: 'n',
                        codImovel: 'n'
                    },
                    formats:{
                        nroDocPesagem: '#,##0',
                        codProdutor: '#,##0',
                        pesoEntrada: '#,##0 "Kg"',
                        pesoSaida:  '#,##0 "Kg"',
                        pesoLiquido:  '#,##0 "Kg"',
                        safra: '####',
                        clChuAvar: '#0.0',
                        clImpureza: '#0.0',
                        clUmidade: '#0.0',
                        clPh: '#0.0',
                        clTbm: '#0.0'
                    },
                    filename: 'ticket_pesagem.xls',
                    bookType: 'biff8'
                });
            },

            exportar() {
                this.getDadosExportar()
                    .then(dados => {
                        this.estruturaExportar(dados);
                    });
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
            }
        }
    }
</script>