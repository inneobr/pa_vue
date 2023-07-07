<template>
    <Dialog
        v-model:visible="visivel"
        :breakpoints="{'960px': '75vw', '640px': '90vw'}"
        :style="{width: '70vw'}"
        :maximizable="true"
        :modal="true"
        @show="carregarEstabelecimento()"
        @hide="$emit('fechar')"
    >
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-book mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Romaneio Entrega</h3>
            </div>
        </template>
        <div class="grid">
            <div class="col-2">
                <label><strong>Safra</strong></label>
                <InputText class="w-full mt-1" v-model="romaneio.safra" :disabled="true" />
            </div>

            <div class="col-4">
                <label><strong>Estabelecimento</strong></label>
                <InputText class="w-full mt-1" v-model="estabelecimento" :disabled="true" />
            </div>

            <div class="col-2">
                <label><strong>Nr. Doc.</strong></label>
                <InputText class="w-full mt-1" v-model="romaneio.nrDocPes" :disabled="true" />
            </div>

            <div class="col-2">
                <label><strong>Nr. RE</strong></label>
                <InputText class="w-full mt-1" v-model="romaneio.nrRe" :disabled="true" />
            </div>

            <div class="col-2">
                <label><strong>Placa</strong></label>
                <InputText class="w-full mt-1" v-model="romaneio.placa" :disabled="true" />
            </div>
        
            <div class="col-12">
                <DataTable 
                    responsiveLayout="scroll"
                    scrollDirection="both"
                    showGridlines
                    :value="romaneio.itens"
                >
                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="itCodigo" header="Produto" style="width:4rem;" />
                    <Column field="codRefer" header="Cód. Ref." style="width:4rem;" />
                    <Column field="impureza" header="Impureza" style="width:4rem;" >
                        <template #body="{ data }">
                            {{ formatDecimal(data.impureza, 0, 2) }}
                        </template>
                    </Column>
                    <Column field="perDescImpur" header="% Desc. Impureza" style="width:6rem;" >
                        <template #body="{ data }">
                            {{ formatDecimal(data.perDescImpur, 0, 2) }}
                        </template>
                    </Column>
                    <Column field="umidade" header="Umidade" style="width:4rem;" >
                        <template #body="{ data }">
                            {{ formatDecimal(data.umidade, 0, 2) }}
                        </template>
                    </Column>
                    <Column field="perDescUmid" header="% Desc. Umidade" style="width:6rem;" >
                        <template #body="{ data }">
                            {{ formatDecimal(data.perDescUmid, 0, 2) }}
                        </template>
                    </Column>
                    <Column field="chuvAvar" header="Chu/Ava" style="width:4rem;" >
                        <template #body="{ data }">
                            {{ formatDecimal(data.chuvAvar, 0, 2) }}
                        </template>
                    </Column>
                    <Column field="perDescChuv" header="% Desc. Chu/Ava" style="width:6rem;" >
                        <template #body="{ data }">
                            {{ formatDecimal(data.perDescChuv, 0, 2) }}
                        </template>
                    </Column>
                    <Column field="pesoLiquido" header="Peso Líq." style="width:5rem;" >
                        <template #body="{ data }">
                            {{ formatDecimal(data.pesoLiquido, 0, 2) }} Kg
                        </template>
                    </Column>
                    
                </DataTable>
            </div>
        </div>
        <template #footer>
            <Paginator
                :rows="qtdRegistro"
                :totalRecords="totalRegistro"
                :rowsPerPageOptions="[3, 5, 10, 20, 30]"
                @page="onPage"
            ></Paginator>
        </template>
    </Dialog>
</template>

<script>
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        emits: ['fechar'],
        props: {
			romaneio: {
				type: Object,
				required: false
			},
            visivel: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                totalRegistro: 0,
                qtdRegistro: 3,
                pagina: 0,
                estabelecimento: null
            }
        },
        methods: {            
            carregarEstabelecimento() {
                EstabelecimentoService.getEstabelecimentosPorCodigo(this.romaneio.codEstabel)
                    .then(({ data }) => {
                        if(data) {
                            this.estabelecimento = `${ data.codigo } - ${ data.nomeFantasia }`;
                        }
                        else {
                            this.estabelecimento = this.romaneio.codEstabelecimento;
                        }
                    })
                    .catch(error => {
                        this.estabelecimento = this.romaneio.codEstabelecimento;
                    });
            },

            onPage(event) {
                this.pagina = event.page;
                this.qtdRegistro = event.rows;
                this.carregarHistorico();
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