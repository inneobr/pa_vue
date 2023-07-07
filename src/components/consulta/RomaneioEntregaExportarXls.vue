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
    import RomaneioEntregaService from '../../service/RomaneioEntregaService';
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
                    RomaneioEntregaService.getRomaneios(0, this.totalRegistro, this.filtros)
                        .then(({ data }) => {
                            if(data && data.content) {
                                const dados = data.content.map(item => {
                                    item['data'] = Formatacao.formatDateCustom(item.data, 'DD/MM/YYYY') + ' ' + item.hora;
                                    item['dataSaida'] = Formatacao.formatDateCustom(item.dataSaida, 'DD/MM/YYYY') + ' ' + item.horaSaida;
                                    item['situacao'] = this.getDescricaoSituacao(item.status);
                                    console.log('#Item: ',item);
                                    //item.set('rendaLiquidaAtuN', 123456);//item.itens[0].rendaLiquidaAtu);

                                    //item.set('rendaLiquidaAtu', '123');
                                    item.rendaLiquidaAtu = item.itens[0].rendaLiquidaAtu;

                                    console.log('@Item: ',item);

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
                    {name: "nrRe", title: "Nr. RE"},
                    {name: "placa", title: "Placa"},
                    {name: "dtEntrada", title: "Entrada"},
                    {name: "nrDocPes", title: "Nr. Doc"},
                    {name: "fmCodigo", title: "Grupo de Produto"},
                    {name: "tulha", title: "Moega"},
                    {name: "codEstabel", title: "Estab."},
                    {name: "codEmitente", title: "Produtor"},
                    {name: "matricula", title: "Imóvel"},
                    {name: "pesoBruto", title: "Peso Bruto"},
                    {name: "taraVeiculo", title: "Tara Veículo"},
                    {name: "taraSacaria", title: "Tara Sacaria"},
                    {name: "pesoLiquido", title: "Peso Líq."},
                    {name: "motorista", title: "Motorista"},
                    {name: "safra", title: "Safra"},
                    {name: "rendaLiquidaAtu", title: "Renda Líq. Atual(Kg)"}
                ];

                ExportarPlanilha({
                    cols: colunas,
                    rows: dados,
                    types:{
                        nrRe: 'n',
                        nrDocPes: 'n',
                        codEmitente: 'n',
                        pesoBruto: 'n',
                        taraVeiculo:  'n',
                        taraSacaria:  'n',
                        pesoLiquido:  'n',
                        safra: 'n',
                        matricula: 'n',
                        rendaLiquidaAtu:'n'
                    },
                    formats:{
                        nrRe: '###,###,##0',
                        nrDocPes: '#,##0',
                        matricula: '#,##0',
                        codEmitente: '#,##0',
                        pesoBruto: '#,##0 "Kg"',
                        taraVeiculo:  '#,##0 "Kg"',
                        taraSacaria:  '#,##0 "Kg"',
                        pesoLiquido:  '#,##0 "Kg"',
                        safra: '####',
                        rendaLiquidaAtu:'#,##0 "Kg"'
                    },
                    filename: 'romaneios_de_entrega.xls',
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
                if(codigo === "ATIVO") {
                    return "Ativo";
                }
                else if(codigo === "INATIVO") {
                    return "Inativo";
                }
            }
        }
    }
</script>