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
                    :value="registros">

                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="dataAlteracao" header="Data" style="width:11rem;">
                        <template #body="{ data }">
                            {{ formatDate(data.dataCadastro, 'DD/MM/YYYY HH:mm:ss') }}
                        </template>
                    </Column>
                    <Column field="username" header="Usuário" style="width:10rem;" />
                    <Column field="movimento" header="Movimento" style="width:15rem;" />
                    <Column field="observacao" header="Observação"/>
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
    import Formatacao from '../../utilities/Formatacao';

    export default {
        emits: ['fechar'],
        props: {
			registros: null,
            historicoTotalPaginas: null, 
            historicoTotalRegistros: null,
            total: null,

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
            }
        },
        methods: {
            carregarHistorico() {
                if(!this.visivel) return;
                this.qtdRegistro = this.historicoTotalPaginas;
                this.totalRegistro = this.historicoTotalRegistros;
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