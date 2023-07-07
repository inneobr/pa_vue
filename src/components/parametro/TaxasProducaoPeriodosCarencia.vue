<template>
    <Dialog
        v-model:visible="visivel"
        :breakpoints="{'960px': '75vw', '640px': '90vw'}"
        :style="{width: '30vw'}"
        :maximizable="true"
        :modal="true"
        @show="carregarDados()"
        @hide="$emit('fechar')"
    >
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-book mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Períodos de Carência</h3>
            </div>
        </template>
        <div class="grid">        
            <div class="col-12">
                <DataTable 
                    responsiveLayout="scroll"
                    scrollDirection="both"
                    showGridlines
                    :value="lista"
                    :loading="carregando"
                >
                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="dataInicial" header="Início">
                        <template #body="{ data }">
                            {{  formatDate(data.dataInicial, 'DD/MM/YYYY') }}
                        </template>
                    </Column>
                    <Column field="dataFinal" header="Fim">
                        <template #body="{ data }">
                            {{  formatDate(data.dataFinal, 'DD/MM/YYYY') }}
                        </template>
                    </Column>

                    <Column field="quantidadeDiasCarencia" header="Dias" class="font-bold text-right"/>
                    
                    
                </DataTable>
            </div>
        </div>
        <template #footer>
            <Paginator
                v-model:first="firstRow"
                :rows="qtdRegistro"
                :totalRecords="totalRegistro"
                :rowsPerPageOptions="[5, 10, 20, 30]"
                @page="onPage"
            ></Paginator>
        </template>
    </Dialog>
</template>

<script>
    import TaxaProducaoService from '../../service/TaxasProducaoService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        emits: ['fechar'],
        props: {
			idTaxa: {
				type: String,
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
                qtdRegistro: 30,
                firstRow:0,
                pagina: 0,
                lista: [],
                carregando:false,
            }
        },
        methods: {
            carregarDados() {
                this.carregando=true;
                this.lista = [];

                if(!this.visivel) return;

                TaxaProducaoService.getPeriodosCarencia(
                     this.idTaxa,
                     this.pagina,
                     this.qtdRegistro
                )
                    .then(({ data }) => {
                        if(data) {
                            this.lista = data.content;
                            
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalElements;
                        }
                        //this.carregando=false;
                    })
                    .catch(error => {
                        console.error(error);
                        this.lista = [];
                        this.qtdRegistro = 0;
                        this.totalRegistro = 0;
                        //this.carregando=false;
                    })
                    .finally( () => {
                         this.carregando=false;
                    });
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
        }
    }
</script>