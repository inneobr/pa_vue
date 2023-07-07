<template>
    <Dialog
        v-model:visible="visivel"
        :breakpoints="{'960px': '75vw', '640px': '90vw'}"
        :style="{width: '70vw'}"
        :maximizable="true"
        :modal="true"
        @show="carregarHistorico()"
        @hide="$emit('fechar')"
    >
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-book mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Histórico</h3>
            </div>
        </template>
        <div class="grid">        
            <div class="col-12">
                <DataTable 
                    responsiveLayout="scroll"
                    scrollDirection="both"
                    showGridlines
                    :value="lista"
                >
                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="dataCadastro" header="Data" style="width:11rem;">
                        <template #body="{ data }">
                            {{ formatDate(data.dataCadastro, 'DD/MM/YYYY HH:mm:SS') }} 
                        </template>
                    </Column>
                    <Column field="username" header="Usuário" style="width:10rem;" />
                    <Column field="movimento" header="Movimento" style="width:15rem;" />
                    <Column field="observacao" header="Observação">
                        <template #body="{ data }">
                            <Textarea 
                                v-model:value="data.observacao"
                                class="w-full"
                                rows="2"
                                :disabled="true"
                            ></Textarea>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <template #footer>
            <Paginator
                v-model:first="firstRow"
                :rows="qtdRegistro"
                :total-records="totalRegistro"
                :rowsPerPageOptions="[5, 10, 20, 30]"
                @page="onPage"></Paginator>
        </template>
    </Dialog>
</template>

<script>
    import TaxaProducaoService from '../../service/TaxasProducaoService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        emits: ['fechar'],
        props: {
            visivel: {
                type: Boolean,
                required: true
            },
            tipoPagina: {
				type: String,
				required: false
			},
            idRegistro:{
                type: Number,
				required: false
            }
        },
        data() {
            return {
                totalRegistro: 0,
                qtdRegistro: 5,
                firstRow: 0,
                pagina: 0,
                lista: [],
                
            }
        },
        methods: {
            carregarHistorico() {

                if(!this.visivel) return;

                TaxaProducaoService.getHistorico(
                    this.idRegistro,
                    this.pagina,
                    this.qtdRegistro
                )
                    .then(({ data }) => {
                        if(data) {
                            this.lista = data.content;

                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalElements;

                        }
                    })
                    .catch(error => {
                        this.lista = [];
                        this.qtdRegistro = 0;
                        this.totalRegistro = 0;
                    });
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;

                this.carregarHistorico();
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },
        }
    }
</script>