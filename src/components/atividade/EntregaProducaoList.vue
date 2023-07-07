<template>
    <div class="card">

        <Toast />

        <div class="flex align-items-center">
           <i class="pi pi-tablet mr-1" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;">Entrega de Produção</h3>
        </div>

        <hr />
        
        <DataTable 
            responsiveLayout="scroll"
            scrollDirection="both"
            showGridlines
            :value="pesagens"
            :scrollable="true"
        >

            <template #header>
                <TicketPesagemFiltro
                    :situacaoDesabilitada="true"
                    :totalRegistro="totalRegistro"
                    @filtrar="carregarDados"
                />
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="nroDocPesagem" header="Nr. Doc" style="width:5rem;" frozen>
                <template #body="{ data }">
                    <strong>{{ data.nroDocPesagem }}</strong>
                </template>
            </Column>
            <Column field="placa" header="Placa" style="width:6rem;" frozen>
                <template #body="{ data }">
                    <strong>{{ data.placa }}</strong>
                </template>
            </Column>
            <Column field="data" header="Entrada" style="width:11.5rem;" frozen>
                <template #body="{ data }">
                    <strong>{{ formatDate(data.data, 'DD/MM/YYYY') + ' ' + data.hora }}</strong>
                </template>
            </Column>
            <Column field="codProdutor" header="Produtor" style="width:6rem;" />
            <Column field="nomeProdutor" header="Nome Produtor" style="width:20rem;" />
            <Column field="codImovel" header="Imóvel" style="width:5rem;" />
            <Column field="codProduto" header="Produto" style="width:6rem;" />
            <Column field="produto" header="Descrição Produto" style="width:20rem;">
                <template #body="{ data }">
                    {{ data.produto?.descItem }}
                </template>
            </Column>
            <Column field="pesoEntrada" header="Peso Entrada" style="width:8rem;">
                <template #body="{ data }">
                    {{ formatDecimal(data.pesoEntrada, 0, 0) }} Kg
                </template>
            </Column>
            <Column field="pesoSaida" header="Peso Saída" style="width:7rem;">
                <template #body="{ data }">
                    {{ formatDecimal(data.pesoSaida, 0, 0) }} Kg
                </template>
            </Column>
            <Column field="pesoLiquido" header="Peso Líq." style="width:7rem;">
                <template #body="{ data }">
                    {{ formatDecimal(data.pesoLiquido, 0, 0) }} Kg
                </template>
            </Column>
            <Column field="nfProdutor" header="NF. Produtor" style="width:8rem;" />
            <Column field="motorista" header="Motorista" style="width:10rem;" />
            <Column field="safra" header="Safra" style="width:4rem;" />
            <Column header="Saída" style="width:11rem;">
                <template #body="{ data }">
                    {{ formatDate(data.dataSaida, 'DD/MM/YYYY') + ' ' + data.horaSaida }}
                </template>
            </Column>
            <Column field="clChuAvar" header="Chuv/Ava." style="width:6rem;">
                <template #body="{ data }">
                    {{ formatDecimal(data.clChuAvar, 1, 1) }}
                </template>
            </Column>
            <Column field="clImpureza" header="Imp." style="width:4rem;">
                <template #body="{ data }">
                    {{ formatDecimal(data.clImpureza, 1, 1) }}
                </template>
            </Column>
            <Column field="clUmidade" header="Umid." style="width:4rem;">
                <template #body="{ data }">
                    {{ formatDecimal(data.clUmidade, 1, 1) }}
                </template>
            </Column>
            <Column field="clPh" header="PH" style="width:4rem;">
                <template #body="{ data }">
                    {{ formatDecimal(data.clPh, 1, 1) }}
                </template>
            </Column>
            <Column field="clTbm" header="TBM" style="width:4rem;">
                <template #body="{ data }">
                    {{ formatDecimal(data.clTbm, 1, 1) }}
                </template>
            </Column>
            <Column field="situacao" header="Situação" style="width:7rem;" alignFrozen="right" frozen>
                <template #body>
                    <strong style="color:#E50000">
                        Pendente
                    </strong>
                </template>
            </Column>
            <Column header="Ações" style="width:8.3rem;" alignFrozen="right" frozen>
                <template #body>
                    <Button>
                        <i class="pi pi-arrow-right mr-1"></i>
                        Gerar RE
                    </Button>
                </template>
            </Column>
        </DataTable>
        <Paginator
            :rows="qtdRegistro"
            :totalRecords="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage"
        ></Paginator>
    </div>
</template>

<script>
    import PesagemService from '../../service/PesagemService';
    import TicketPesagemFiltro from '../consulta/TicketPesagemFiltro.vue';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        components: { TicketPesagemFiltro },
        data() {
            return {
                totalRegistro: 0,
                qtdRegistro: 10,
                pagina: 0,
                pesagens: [],
                filtros: {},
                historico: null,

                historicoDialog: false
            }
        },
        methods: {
            carregarDados(filtros = {}) {
                this.filtros = filtros;
                PesagemService.getPessagensPendentes(this.pagina, this.qtdRegistro, filtros)
                    .then(({ data }) => {
                        if(data) {
                            this.pesagens = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.pesagens = [];
                        this.qtdRegistro = 0;
                        this.totalRegistro = 0;
                    });
            },

            onPage(event) {
                this.pagina = event.page;
                this.qtdRegistro = event.rows;
                this.carregarDados();
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            formatDecimal(value, minimumFractionDigits = 2, maximumFractionDigits = 2) {
                return Formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
            }
        }
    }
</script>
