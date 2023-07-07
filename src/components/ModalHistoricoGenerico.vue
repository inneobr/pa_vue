<template>
    <Dialog
        v-model:visible="visivel"
        :breakpoints="{'960px': '75vw', '640px': '90vw'}"
        :style="{width: '70vw'}"
        :maximizable="true"
        :modal="true"
        @show="carregarHistorico()"
        @hide="$emit('fechar')">

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
                    :value="lista">

                    <template #header>
                        <strong style="font-size: 16px;">{{ descricao }}</strong>
                    </template>
                    
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
                :rows="qtdRegistro"
                :totalRecords="totalRegistro"
                :rowsPerPageOptions="[3, 5, 10, 20, 30]"
                @page="onPage">
            </Paginator>
        </template>
    </Dialog>
</template>

<script>
    import HistoricoGenericoService from '../service/HistoricoGenericoService';
    import Formatacao from '../utilities/Formatacao';

    export default {
        emits: ['fechar'],
        props: {
			id: {
				type: String,
				required: false
			},
            descricao: {
				type: String,
				required: false
            },
            codigoPagina: {
				type: String,
				required: true
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
                lista: [],
                estabelecimento: null
            }
        },
        methods: {
            carregarHistorico() {
                if(!this.visivel) return;
                
                HistoricoGenericoService.getHistoricoGenericoComPaginacao(
                    this.id,
                    this.codigoPagina,
                    this.pagina,
                    this.qtdRegistro
                )
                    .then(({ data }) => {
                        if(data) {
                            this.lista = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.lista = [];
                        this.qtdRegistro = 0;
                        this.totalRegistro = 0;
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
        }
    }
</script>