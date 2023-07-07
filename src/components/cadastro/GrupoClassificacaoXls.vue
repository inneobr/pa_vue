<template>
    <Button
        class="p-button-rounded m-2 surface-400"
        icon="pi pi-file-excel"
        @click="exportar()"
    ></Button>
</template>

<script>
    import ExportarPlanilha from '../../utilities/ExportarPlanilha';
    import GrupoClassificacaoService from '../../service/GrupoClassificacaoService';

    export default {
        name: 'Grupo Classificacao Xls',
        props: {
            idGrupoClassificacao: {
                type: Number,
                required: true
            },
            nomeArquivo: {
                type: String,
                required: true
            }
        },

        methods: {
            exportar() {
                const id = this.idGrupoClassificacao;
                GrupoClassificacaoService.getDetalhes(id)
                    .then(({ data }) => {
                        if(data) {
                            this.gerarPlanilha(data);
                        }
                    }); 
            },

            gerarPlanilha(dados) {
                const colunas = [];
                const tipos = {};
                const formatos = {};

                colunas.push({name: "teorClassificacaoInicial", title: "Teor Inicial"});
                tipos["teorClassificacaoInicial"] = "n";
                formatos["teorClassificacaoInicial"] = "0.0";

                if(dados.teorPorFaixa) {
                    colunas.push({name: "teorClassificacaoFinal", title: "Teor Final"});
                    tipos["teorClassificacaoFinal"] = "n";
                    formatos["teorClassificacaoFinal"] = "0.0";
                }
                
                if(dados.ph) {
                    colunas.push({name: "phEntrada", title: "PH Entrada"});
                    tipos["phEntrada"] = "n";
                    formatos["phEntrada"] = "0.0";
                }

                if(dados.phCorrigido) {
                    colunas.push({name: "phCorrigido", title: "PH Corrigido"});
                    tipos["phCorrigido"] = "n";
                    formatos["phCorrigido"] = "0.0";
                }

                if(dados.resultadoDesconto) {
                    colunas.push({name: "percentualDesconto", title: "% Desconto"});
                    tipos["percentualDesconto"] = "n";
                    formatos["percentualDesconto"] = "0.00%";
                    dados.detalhes = dados.detalhes.map(item => {
                        item["percentualDesconto"] = item["percentualDesconto"] / 100;
                        return item;
                    });
                }

                if(dados.referencia) {
                    colunas.push({name: "codigoReferencia", title: "Cód. Referência"});
                    formatos["codigoReferencia"] = "0.0";
                }

                if(dados.resultadoTaxaSecagemKg) {
                    colunas.push({name: "taxaSecagemQuilo", title: "Taxa Secagem Kg"});
                    tipos["taxaSecagemQuilo"] = "n";
                    formatos["taxaSecagemQuilo"] = "0.0";
                }
                
                if(dados.resultadoTaxaSecagemValor) {
                    colunas.push({name: "taxaSecagemValor", title: "Taxa Secagem Valor"});
                    tipos["taxaSecagemValor"] = "n";
                    formatos["taxaSecagemValor"] = "0.0";
                }

                ExportarPlanilha({
                    cols: colunas,
                    rows: dados.detalhes,
                    types: tipos,
                    formats: formatos,
                    filename: this.nomeArquivo + '.xls',
                    bookType: 'biff8'
                });
            },
        }
    }
</script>