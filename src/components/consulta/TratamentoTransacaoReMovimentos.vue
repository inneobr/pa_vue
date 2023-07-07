<template>
    <Dialog
        v-model:visible="visivel"
        :breakpoints="{'960px': '75vw', '640px': '90vw'}"
        :style="{width: '70vw'}"
        :maximizable="true"
        :modal="true"
        @show="carregarMovimentos()"
        @hide="$emit('fechar')"
    >
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-book mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Movimentos RE</h3>
            </div>
        </template>

        <div class="grid">

            <div class="col-12">
                <DataTable 
                    responsiveLayout="stack"
                    showGridlines
                    :value="movimentos"
                >
                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="codEstabel" header="Estabelecimento" style="width:4rem;" />
                    <Column field="idRe" header="Id Re" style="width:4rem;" />
                    <Column field="nrRe" header="Número Re" style="width:4rem;" />
                    <Column field="dataHoraMovimento" header="Data Hora Movimento" style="width:4rem;">
                        <template #body="{ data }">
                            {{ formatDate(data.dataHoraMovimento, 'DD/MM/YYYY HH:mm:SS') }}
                        </template>
                    </Column>
                    <Column field="descricaoMovimento" header="Movimento" style="width:4rem;" />
                    <Column field="descricaoStatusMovimento" header="Status do Movimento" style="width:4rem;" />
                    <Column field="mensagem" header="Mensagem" style="width:6rem;" />
                    <Column header="Ações" style="width:3rem;">
                        <template #body="{ data }">
                            <Button v-if="data.movimento !== 'CRIACAO_RE'" class="p-button-rounded p-button-warning flex-none mr-3" 
                            icon="pi pi-send" 
                            title="Reenviar" 
                            @click="reenviar(data.id)"></Button>
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
    //import { number } from 'yup/lib/locale';
    import TratamentoTransacaoReService from '../../service/TratamentoTransacaoReService'
    import Formatacao from '../../utilities/Formatacao';
    //import TratamentoDeError from '../../utilities/TratamentoDeError';

    export default {
        emits: ['fechar'],
        props: {
			idRe: {
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
                qtdRegistro: 10,
                pagina: 0,
                firstRow: 0,
                estabelecimento: null,
                movimentos:[]
            }
        },
        methods: {            
            carregarMovimentos() {
                TratamentoTransacaoReService.getMovimentos(this.idRe, this.pagina, this.qtdRegistro, this.filtros, this.ordenar)
                    .then(({ data }) => {
                         if(data) {
                            this.movimentos = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                         }
                    })
                    .catch(error => {
                         this.movimentos = [];
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

            formatDecimal(value, minimumFractionDigits = 2, maximumFractionDigits = 2) {
                return Formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
            },

            reenviar(id){
                TratamentoTransacaoReService.reenviar(id)
                    .then( ({ data }) => {
                        this.$toast.add({
                            severity:'success', 
                            detail:'Movimento reenvido com sucesso!', 
                            life: 3000
                        })
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'error', 
                            detail:'Ocorreu um erro ao reenviar o movimento!' + error, 
                            life: 3000
                        })
                    })
            }
        }
    }
</script>