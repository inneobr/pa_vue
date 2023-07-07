<template>
    <Dialog
        v-model:visible="visivel"
        :breakpoints="{'960px': '75vw', '640px': '90vw'}"
        :style="{width: '70vw'}"
        :maximizable="true"
        :modal="true"
        @show="carregarDados()"
        @hide="$emit('fechar')"
    >
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-book mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Estabelecimentos</h3>
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

                    <Column field="codigo" header="Código" style="width:10rem;" />
                    <Column field="nomeFantasia" header="Nome" />
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
    import GrupoClassificacaoService from '../../service/GrupoClassificacaoService';

    export default {
        emits: ['fechar'],
        props: {
			idGrupoClassificacao: {
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
                firstRow:0,
                totalRegistro: 0,
                qtdRegistro: 30,
                pagina: 0,
                lista: [],
                estabelecimento: null
            }
        },
        methods: {
            carregarDados() {
                
                if(!this.visivel) return;

                GrupoClassificacaoService.getEstabelecimentosPorGrupoClassificacao(
                    this.idGrupoClassificacao,
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
                        console.error(error);
                        this.lista = [];
                        this.qtdRegistro = 0;
                        this.totalRegistro = 0;
                    });
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;         
                
                this.carregarDados();
            }
        }
    }
</script>