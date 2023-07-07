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
                <h3 style="margin:0px 5px;">Histórico de Pesagem</h3>
            </div>
        </template>
        <div class="grid">
            <div class="col-2">
                <label for="historicoSafra"><strong>Safra</strong></label>
                <InputText class="w-full mt-1" id="historicoSafra" v-model="pesagem.safra" :disabled="true" />
            </div>

            <div class="col-6">
                <label for="historicoEstabelecimento"><strong>Estabelecimento</strong></label>
                <InputText class="w-full mt-1" id="historicoEstabelecimento" v-model="estabelecimento" :disabled="true" />
            </div>

            <div class="col-2">
                <label for="historicoTicket"><strong>Ticket</strong></label>
                <InputText class="w-full mt-1" id="historicoTicket" v-model="pesagem.nroDocPesagem" :disabled="true" />
            </div>
        
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

                    <Column field="data" header="Data" style="width:7rem;">
                        <template #body="{ data }">
                            {{ formatDate(data.data, 'DD/MM/YYYY') }}
                        </template>
                    </Column>
                    <Column field="hora" header="Hora" style="width:5.5rem;" />
                    <Column field="codUsuario" header="Usuário" style="width:10rem;" />
                    <Column field="transacao" header="Transação" style="width:15rem;" />
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
                @page="onPage"
            ></Paginator>
        </template>
    </Dialog>
</template>

<script>
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import HistoricoPesagemService from '../../service/HistoricoPesagemService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        emits: ['fechar'],
        props: {
			pesagem: {
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
                lista: [],
                estabelecimento: null
            }
        },
        methods: {
            carregarHistorico() {
                if(!this.visivel) return;

                this.carregarEstabelecimento();
                HistoricoPesagemService.getHistoricoPessagensPorSafraETicket(
                    this.pagina, 
                    this.qtdRegistro, 
                    this.pesagem.codEstabelecimento,
                    this.pesagem.safra, 
                    this.pesagem.nroDocPesagem
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

            carregarEstabelecimento() {
                EstabelecimentoService.getEstabelecimentosPorCodigo(this.pesagem.codEstabelecimento)
                    .then(({ data }) => {
                        if(data) {
                            this.estabelecimento = `${ data.codigo } - ${ data.nomeFantasia }`;
                        }
                        else {
                            this.estabelecimento = this.pesagem.codEstabelecimento;
                        }
                    })
                    .catch(error => {
                        this.estabelecimento = this.pesagem.codEstabelecimento;
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