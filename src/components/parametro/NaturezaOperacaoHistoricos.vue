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
                    @sort="sort($event)" 
                    showGridlines
                    :value="lista"
                >
                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="dataAtualizacao" header="Data" style="width:11rem;" sortable>
                        <template #body="{ data }">
                            {{ formatDate(data.dataAtualizacao, 'DD/MM/YYYY HH:mm:ss') }}
                        </template>
                    </Column>
                    <Column field="usuario" header="Usuário" style="width:10rem;" />
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
                :rowsPerPageOptions="[5, 10, 20, 30]"
                @page="onPage"
            ></Paginator>
        </template>
    </Dialog>
</template>

<script>
    import NaturezaOperacaoService from '../../service/NaturezaOperacaoService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        emits: ['fechar'],
        props: {            
			descricao: {
				type: String,
				required: false
			},           
			codGrupo: {
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
                qtdRegistro: 5,
                pagina: 0,
                lista: [],
                ordenar: 'dataAtualizacao,asc'
            }
        },
        methods: {
            carregarHistorico() {
                if(!this.visivel) return;
                NaturezaOperacaoService.getHistoricoPorNatureza(
                    this.codGrupo,
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

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.carregarHistorico();  
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.qtdRegistro = event.rows;
                this.carregarHistorico();
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },
        }
    }
</script>