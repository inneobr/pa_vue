<template>
    <div class="card" id="tratamentoTransacaoRe-list">

        <Toast />

        <div class="flex align-items-center">
           <i class="pi pi-file mr-1" style="font-size: 1.4rem"></i>
           <h3 style="margin:0px 5px;">Tratamento Transação RE</h3>
        </div>

        <hr />
        
        <DataTable 
            responsiveLayout="stack"
            v-model:selection="transacaoSelecionada"
            selectionMode="single"
            showGridlines
            :value="transacoes"
            @sort="sort($event)">

            <template #header>
                
                <div class="grid w-full">
                    
                    <div class="col-4 mt-4">
                        <label><strong>Estabelecimento</strong></label>

                        <Dropdown class="w-full mt-2"
                            id="estabelecimento"
                            placeholder="Selecione"
                            v-model="estabelecimentoSelecionado"
                            :options="estabelecimento"
                            optionLabel="label"/>
                        
                    </div> 

                    <div class="col-6 xl:col-4 mt-2">
                        
                        <div class="grid w-full">
                            <Button type="button" 
                                label="Filtrar" 
                                class="p-button-outlined mt-6 ml-1"
                                icon="pi pi-filter" 
                                style="padding: 0.4rem;"
                                @click="filtrar()"/>
                    
                            <Button
                                type="button" 
                                label="Limpar Filtros" 
                                class="p-button-outlined mt-6 ml-1"
                                icon="pi pi-filter-slash" 
                                style="padding: 0.4rem;"
                                @click="limparfiltros()"/>
                          
                        </div>        
                    </div>
                    
                </div>

            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="codEstabel" header="Código Estabelecimento" style="width:5rem;" sortable />
            <Column field="idRe" header="Id RE" style="width:5rem;" sortable />
            <Column field="nrRe" header="Número RE" style="width:5rem;" sortable />
            <Column field="movimentoAtual" header="Movimento Atual" style="width:5rem;" sortable >
                <template #body="{ data }">
                    {{ data.descricaoMovimentoAtual }}
                </template>
            </Column>
            <Column field="statusMovimentoAtual" header="Status Movimento Atual" style="width:5rem;" sortable >
                <template #body="{ data }">
                    {{ data.descricaoStatusMovimentoAtual }}
                </template>
            </Column>
            <Column field="dataUltimoMovimento" header="Data Últ. Mov." style="width:11.5rem;" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.dataUltimoMovimento, 'DD/MM/YYYY HH:mm:SS') }}
                </template>
            </Column>
            <Column header="Ações" style="width:3rem;">
                <template #body="{ data }">
                    
                    <Button icon="pi pi-eye"
                        title="Visualizar Movimentos da RE"         
                        class="p-button-rounded p-button-info p-2 mr-2"    
                        @click="abrirMovimentos(data.idRe)">
                    </Button>
                    
                </template>
            </Column>
        </DataTable>
        <Paginator
            v-model:first="firstRow"
            :rows="qtdRegistro"
            :total-records="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage" />
    </div>

    <Movimentos
            :idRe="idRe"
            :visivel="movimentoReDialog"
            @fechar="fecharMovimentos()"
        />

</template>

<script>
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';
    import Paginator from 'primevue/paginator';
    import TratamentoTransacaoReService from '../../service/TratamentoTransacaoReService';
    import Movimentos from '../consulta/TratamentoTransacaoReMovimentos.vue';

    export default {
        name: 'TratamentoTransacaoRE_List',
        components: { Paginator, Movimentos },
        data() {
            return {
                totalRegistro: 0,
                qtdRegistro: 30,
                pagina: 0,
                firstRow: 0,
                                
                transacoes: [],
                transacaoSelecionada: {},
                
                ordenar:'id',
                integration: {},
                
                
                movimentoReDialog:false,
                irRe: null,

                estabelecimento: null,
                estabelecimentoSelecionado: null,

                filtros:{},

                storange: StorageService.getControlePagina("TRATAR_TRANSACOES"),
            }
        },

        created() {
            
            if(this.storange.default == undefined){
                this.filtros = this.storange.filtros;
            }
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;   

            console.log("Filtro do Create: ", this.filtros.estabelecimento);
            
            //this.getIntegrationOptons();
            this.carregarDados();
            this.carregarEstabelecimentos();
        },
        methods: {

            // getIntegrationOptons(){
            //     const paginaAtual = "ROMANEIO_ENTREGA";
            //     IntegracaoService.getIntegrationOptions(paginaAtual)
            //         .then(({ data }) => {
            //             if(data) {
            //                 this.integration = data;
            //             }
            //         })
            //         .catch(error => {
            //             this.$toast.add({
            //                 severity:'info', 
            //                 summary: 'PARÂMETROS DE PÁGINA NÂO DEFINIDOS', 
            //                 detail:'Você deve cadastrar os parâmetros para esta página no menu lateral em item: Parâmetros de Integração.',
            //                 life: 10000
            //             });
            //         });
            // },

            

            filtrar(){
                console.log(this.estabelecimentoSelecionado);
                this.filtros.estabelecimento = this.estabelecimentoSelecionado.codigo;
                //console.log('Filtros: ',this.filtros.estabelecimento);
                this.carregarDados();
            },

            limparfiltros(){
                this.filtros = {};
                this.pagina = 0;
                this.firstRow= 0;
                this.carregarDados();
                this.carregarEstabelecimentos();
            },

            carregarDados() {
                
                TratamentoTransacaoReService.getTransacoes(this.pagina, this.qtdRegistro, this.ordenar, this.filtros)
                    .then(({ data }) => {
                        this.transacoes = data.content;
                        
                        this.qtdRegistro = data.pageable.pageSize;
                        this.totalRegistro = data.totalElements;  
                        
                        StorageService.setControlePagina("TRATAR_TRANSACOES", this.pagina, this.qtdRegistro, this.ordenar, this.filtros);
                    })
                    .catch(error => {
                        console.log(error);
                        this.transacoes = [];
                        this.qtdRegistro = 0;
                        this.totalRegistro = 0;
                    });
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.carregarDados();   
            }, 
            
            onPage(event) {          
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;                     
                this.carregarDados();
            },

            carregarEstabelecimentos() {

                console.log("Filtro do CarregarEstabelecimentos(): ", this.filtros.estabelecimento);

                EstabelecimentoService.getTodosEstabelecimentosSilo()
                    .then(({ data }) => {
                        if(data) {
                            
                            const estabelecimentos = data.map(item => {
                                item["label"] = item.codigo + " - " + item.nomeFantasia;
                                return item;
                            });

                            estabelecimentos.unshift({label: "Todos"});

                            this.estabelecimento = [...estabelecimentos];

                            if(this.filtros.estabelecimento != undefined){   
                                this.estabelecimentoSelecionado = this.estabelecimento.find(x=>x.codigo === this.filtros.estabelecimento);
                            }
                            if(this.estabelecimentoSelecionado == null){
                                 this.estabelecimentoSelecionado = this.estabelecimento[0];
                            }

                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.estabelecimento = [];
                    });
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },
            
            abrirMovimentos(idRe){
                this.idRe = idRe;
                this.movimentoReDialog = true;
            },

            fecharMovimentos(){
                this.idRe = null;
                this.movimentoReDialog = false;
            }
            
        }
    }
</script>

