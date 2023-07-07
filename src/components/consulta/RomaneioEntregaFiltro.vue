<template>
    <div class="flex justify-content-between flex-column lg:flex-row">
        <div class="flex align-items-center lg:align-items-end flex-column lg:flex-row">
            <div class="mt-2 mr-2" style="min-width:10rem; max-width: 15rem;">
                <label for="estabelecimento"><strong>Estabelecimento</strong></label>
                <AutoComplete
                    class="w-full mt-2"
                    id="estabelecimento"
                    placeholder="Selecionar"
                    v-model="filtros.codEstabelecimento"
                    field="label"
                    :suggestions="estabelecimentosFiltrados"
                    :dropdown="true"
                    @complete="buscarEstabelecimento($event)"
                    @item-select="filtrar()"
                ></AutoComplete>
            </div>

            <!-- <div class="mt-2 mr-2" style="min-width:14rem;">
                <label><strong>Ticket de pesagem</strong></label>
                <div class="flex align-items-center mt-1">
                    <div class="overflow-hidden" style="width:6.5rem;">
                        <InputNumber v-model="filtros.nroDocPesagemInicial" />
                    </div>
                    <strong class="ml-2 mr-2">à</strong>
                    <div class="overflow-hidden" style="width:6.5rem;">
                        <InputNumber v-model="filtros.nroDocPesagemFinal" :min="filtros.nroDocPesagemInicial" :max="2147483647" />
                    </div>
                </div>
            </div> -->

            <div class="mt-2 mr-2" style="min-width:14rem;">
                <label><strong>Nr. Romaneio</strong></label>
                <div class="flex align-items-center mt-1">
                    <div class="overflow-hidden" style="width:6.5rem;">
                        <InputNumber v-model="filtros.nrReInicial" />
                    </div>
                    <strong class="ml-2 mr-2">à</strong>
                    <div class="overflow-hidden" style="width:6.5rem;">
                        <InputNumber v-model="filtros.nrReFinal" :min="filtros.nrReInicial" :max="999999999" />
                    </div>
                </div>
            </div>

            <div class="mt-2 mr-2">
                <label><strong>Período</strong></label>
                <div class="flex align-items-center mt-1">
                    <div class="overflow-hidden" style="width:6rem;">
                        <Calendar
                            class="w-full"
                            v-model="filtros.inicio"
                            autocomplete="off"
                            dateFormat="dd/mm/y"
                            
                        />
                    </div>
                    <strong class="ml-2 mr-2">à</strong>
                    <div class="overflow-hidden" style="width:6rem;">
                        <div class="p-inputgroup">
                            <Calendar
                                class="w-full"
                                v-model="filtros.termino"
                                autocomplete="off"
                                dateFormat="dd/mm/y"
                                :minDate="filtros.inicio"
                                
                            />
                            <!-- <Button 
                                icon="pi pi-trash"
                                style="border-radius: 0 10% 10% 0;"
                                @click="confirmarLimparPeriodo()"
                            ></Button> -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-2 mr-2">
                <Button
                    icon="pi pi-search"
                    label="Filtrar"
                    class="p-button-outlined "
                    style="padding: 0.4rem;"
                    @click="filtrar()"
                ></Button>

                <Button 
                type="button" 
                label="Limpar filtro" 
                class="p-button-outlined  mt-4 ml-2"
                icon="pi pi-filter-slash" 
                style="padding-top: 0.5rem; ; padding-right: 1.2rem; padding-left: 1.2rem"
                @click="limparFiltro()"></Button>

            </div>
        </div>

        <div class="flex align-items-end mt-2">
            <RomaneioEntregaExportarXls
                :totalRegistro="totalRegistro"
                :filtros="getFiltros()"
            />
            <Button 
                icon="pi pi-filter"
                label="Filtro Avançado"
                class="p-button-outlined"
                style="min-width: 150px; padding: 0.4rem;"
                @click="filtroDialog = true;"
            ></Button>
        </div>
    </div>

    <Dialog v-model:visible="limparPeriodoDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Deseja limpar o filtro de período?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="limparPeriodoDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="limparPariodo()" />
        </template>
    </Dialog>

    <Dialog v-model:visible="limparFiltroDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Deseja limpar o filtro?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="limparFiltroDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="limparFiltro()" />
        </template>
    </Dialog>

    <Dialog v-model:visible="filtroDialog" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :modal="true">
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-filter mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Filtro avançado</h3>
            </div>
        </template>
        
        <div class="grid">
            <div class="col-6">
                <label for="filtroEstabelecimento"><strong>Estabelecimento</strong></label>
                <AutoComplete
                    class="w-full mt-2"
                    id="filtroEstabelecimento"
                    placeholder="Selecionar"
                    v-model="filtros.codEstabelecimento"
                    field="label"
                    :suggestions="estabelecimentosFiltrados"
                    :dropdown="true"
                    @complete="buscarEstabelecimento($event)"
                ></AutoComplete>
            </div>

            <div class="col-6">
                <label for="filtroProduto"><strong>Código do produto</strong></label>
                <InputText class="w-full mt-2" id="filtroProduto" v-model="filtros.produto" />
            </div>

            <div class="col-6">
                <ProdutorFiltro
                    :selecionado="produtorSelecionado"
                    :paginacao="produtorConsulta"
                    @pesquisar="pesquisarProdutor"
                    @selecionado="selecionarProdutor"
                />
            </div>

            <div class="col-6">
                <label for="filtroImovel"><strong>Imóvel</strong></label>
                <AutoComplete
                    class="w-full mt-2"
                    placeholder="Selecionar"
                    field="matriculaNome"
                    v-model="imovelSelecionado"
                    :suggestions="imoveisFiltrados"
                    :dropdown="true"
                    :disabled="!produtorSelecionado.codProdutor"
                    @complete="buscarImoveis($event)"
                ></AutoComplete>
            </div>

            <div class="col-6">
                <label for="filtroGrupoProduto"><strong>Grupo de produto</strong></label>
                <AutoComplete
                    class="w-full mt-2"
                    id="filtroGrupoProduto"
                    placeholder="Selecionar"
                    field="codigoDescricao"
                    v-model="grupoProdutoSelecionado"
                    :suggestions="grupoProdutoFiltrados"
                    :dropdown="true"
                    @complete="buscarGrupoProduto($event)"
                ></AutoComplete>
            </div>

            <div class="col-3">
                <label for="filtroSafra"><strong>Safra</strong></label>
                <Calendar
                    class="w-full mt-2"
                    id="filtroSafra"
                    autocomplete="off"
                    dateFormat="yy"
                    view="year"
                    v-model="filtros.safra"
                    :maxDate="new Date()"
                />
            </div>

            <div class="col-3">
                <label for="filtroSituacao"><strong>Situação</strong></label>
                <Dropdown
                    class="w-full mt-2"
                    id="filtroSituacao"
                    optionLabel="label"
                    optionValue="value"
                    v-model="filtros.status"
                    :options="situacaoOpcoes"
                    :disabled="situacaoDesabilitada || false"
                />
            </div>

            <div class="col-4">
                <label><strong>Ticket de pesagem</strong></label>
                <div class="flex align-items-center mt-2">
                    <div class="overflow-hidden">
                        <InputNumber v-model="filtros.nroDocPesagemInicial" />
                    </div>
                    <strong class="ml-2 mr-2">à</strong>
                    <div class="overflow-hidden">
                        <InputNumber v-model="filtros.nroDocPesagemFinal" :min="filtros.nroDocPesagemInicial" />
                    </div>
                </div>
            </div>

            <div class="col-2">
                <label for="filtroPlaca"><strong>Placa</strong></label>
                <InputText class="w-full mt-2" id="filtroPlaca" v-model="filtros.placa" />
            </div>

            <div class="col-6">
                <label><strong>Período</strong></label>
                <div class="flex align-items-center mt-2">
                    <div class="overflow-hidden">
                        <Calendar
                            class="w-full"
                            v-model="filtros.inicio"
                            autocomplete="off"
                            dateFormat="dd/mm/y"
                        />
                    </div>
                    <strong class="ml-2 mr-2">à</strong>
                    <div class="overflow-hidden">
                        <Calendar
                            class="w-full"
                            v-model="filtros.termino"
                            autocomplete="off"
                            dateFormat="dd/mm/y"
                            :minDate="filtros.inicio"
                        />
                    </div>
                </div>
            </div>
            
            <div class="col-6">
                <label for="filtroMotorista"><strong>Motorista</strong></label>
                <InputText class="w-full mt-2" id="filtroMotorista" v-model="filtros.motorista" />
            </div>

            <div class="col-6">
                <label for="filtroPesagem"><strong>Pesagem</strong></label>
                <Dropdown
                    class="w-full mt-2"
                    id="filtroPesagem"
                    optionLabel="label"
                    optionValue="value"
                    v-model="filtros.tipoPesagemBalanca"
                    :options="pesagemOpcoes"
                />
            </div>
        </div>

        <template #footer>
            <Button 
                label="Limpar"
                icon="pi pi-trash"
                @click="confirmarLimparFiltro()"
            ></Button>
            <Button
                icon="pi pi-search"
                label="Filtrar"
                class="p-button-outlined"
                autofocus
                @click="filtrar()"
            ></Button>
        </template>
    </Dialog>
</template>

<script>
    import RomaneioEntregaExportarXls from './RomaneioEntregaExportarXls.vue'
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import Formatacao from '../../utilities/Formatacao';
    import StorageService from '../../service/StorageService';
    import ProdutorFiltro from '../cadastro/ProdutorFiltro.vue';
    import produtorService from '../../service/ProdutorService';
    import ImoveisService from '../../service/ImoveisService';

    export default {
        emits: ['filtrar'],
        components: { RomaneioEntregaExportarXls, ProdutorFiltro },
        props: {
            totalRegistro: {
                type: Number,
                required: true
            },
            situacaoDesabilitada: {
                type: Boolean,
                required: false
            }
        },
        data() {
            return {
                codEstablecimento: null,

                limparPeriodoDialog: false,
                limparFiltroDialog: false,
                filtroDialog: false,
                
                filtros: {},

                produtorSelecionado: {},
                produtorConsulta: {},

                imovelSelecionado: null,
                imoveisFiltrados: [],

                estabelecimentos: [],
                estabelecimentosFiltrados: [],

                grupoProdutoSelecionado: null,
                grupoProdutoFiltrados: [],

                situacaoOpcoes: [
                    { label: 'Todas' },
                    { label: 'Criação de RE', value: 'CRIACAO_RE'},
                    { label: 'Solicitado número RE', value: 'SOLICITADO_NRO_RE'},
                    { label: 'Envio RE Datasul', value: 'ENVIO_RE_DATASUL'},
                    { label: 'Solicitado NF remessa', value: 'SOLICITADO_NF_REMESSA'},
                    { label: 'Aberto', value: 'ABERTO' }
                ],

                pesagemOpcoes: [
                    { label: 'Todas' },
                    { label: 'Automática', value: 'AUTOMATICA' },
                    { label: 'Manual', value: 'MANUAL' }
                ],

                storange: StorageService.getControlePagina("ROMANEIO_ENTREGA"),
            }
        },
        
        created(){

        },
        
        async mounted() {
            console.log('Início - carregarEstabelecimento');
            
            await this.carregarEstabelecimentos();

            console.log('Fim    - carregarEstabelecimento');

            if(this.storange.filtros){
                this.filtros = this.storange.filtros;

                if(this.filtros.codEstabelecimento){
                    this.selecionarEstabelecimento(this.filtros.codEstabelecimento);
                }

                if(!!this.filtros.grupoProdutoSelecionado) {
                    this.grupoProdutoSelecionado = this.filtros.grupoProdutoSelecionado;
                }
                else {
                    this.grupoProdutoSelecionado = null;
                }

                if(!!this.filtros.produtorSelecionado && !!this.filtros.produtorSelecionado.codProdutor) {
                    this.produtorSelecionado = this.filtros.produtorSelecionado;
                }
                else {
                    this.produtorSelecionado = {};
                }

                if(!!this.filtros.imovelSelecionado) {
                    this.imovelSelecionado = this.filtros.imovelSelecionado;
                }
                else {
                    this.imovelSelecionado = null;
                }

                if(this.filtros.inicio) {
                    this.filtros.inicio = Formatacao.convertStringToDate(this.filtros.inicio, 'DD/MM/YYYY');
                }

                if(this.filtros.termino) {
                    this.filtros.termino = Formatacao.convertStringToDate(this.filtros.termino, 'DD/MM/YYYY');
                }
            }
            else{
                this.filtros = {};

                //Ticket de Pesagem
                this.filtros.nroDocPesagemInicial = 0;
                this.filtros.nroDocPesagemFinal = 2147483647;
                
                //Datas no filtro
                this.filtros.inicio = Formatacao.subtrairDias(new Date(), 180);
                this.filtros.termino = new Date();

                this.filtros.nrReInicial = 0;
                this.filtros.nrReFinal = 999999999;

                this.selecionarEstabelecimento();
                
            }

            this.filtrar();
            
        },

        methods: {
            
            filtrar() {
                //console.log('Teste 2');
                const filtros= this.getFiltros();

console.log('nrReInicial: ', filtros.nrReInicial);
console.log('nrReFinal: ',filtros.nrReFinal);

                this.filtroDialog = false;
                this.$emit('filtrar', filtros);
            },

            carregarEstabelecimentos2() {
                               
                EstabelecimentoService.getTodosEstabelecimentosSilo()
                    .then(({ data }) => {
                        this.estabelecimentos = data.map(item => {
                            item["label"] = `${ item.codigo } - ${ item.nomeFantasia}`;
                            return item;
                        });

                        console.log('Teste 1');

                        let codEstabelecimento = StorageService.getUser().estabelecimento;
                        let codigoSelecionar = 0;

                        if(codEstabelecimento == '001'){
                            //Se estabelecimento 001 então recupera o primeiro silo da lista.
                            this.filtros.codEstabelecimento = this.estabelecimentos[0];

                        }
                        else{

                            //Selecionar o silo a que pertence o usuario logado.
                            this.estabelecimentos.map(item => {
                                if(item.codigo === codEstabelecimento ){
                                    
                                    this.filtros.codEstabelecimento = item;
                                    codigoSelecionar = codEstabelecimento;
                                }
                            });
                            
                            //Caso usuario logado nao seja de estab silo entao Seleciona o Silo da mesma regional.
                            if(codigoSelecionar === 0){

                                let codRegional = StorageService.getUser().regional;
                                console.log('codRegional: ', codRegional );
                                this.estabelecimentos.map(item => {
                                    
                                    if(item.codigoRegional === codRegional ){
                                        this.filtros.codEstabelecimento = item;

                                    }
                                    
                                });
                            }
                        }
                    });
            },

            async carregarEstabelecimentos() {
                
                const {data} = await EstabelecimentoService.getTodosEstabelecimentosSilo();
                
                if(data) {

                    this.estabelecimentos = data.map(item => {
                        item["label"] = `${ item.codigo } - ${ item.nomeFantasia}`;
                        return item;
                    });
               
                }
            },

            getFiltros() {
                const filtros = Object.assign({}, this.filtros);

                if(filtros.codEstabelecimento) {
                    filtros.codEstabelecimento = filtros.codEstabelecimento.codigo;
                }

                if(!!this.grupoProdutoSelecionado) {
                    filtros.grupoProdutoSelecionado = this.grupoProdutoSelecionado;
                    filtros.codigoGrupoProduto = this.grupoProdutoSelecionado.fmCodigo;
                }
                else {
                    filtros.grupoProdutoSelecionado = undefined;
                    filtros.codigoGrupoProduto = undefined;
                }

                if(!!this.produtorSelecionado && !!this.produtorSelecionado.codProdutor) {
                    filtros.produtorSelecionado = this.produtorSelecionado;
                    filtros.produtor = this.produtorSelecionado.codProdutor;
                }
                else {
                    filtros.produtorSelecionado = undefined;
                    filtros.produtor = undefined;
                }

                if(!!this.imovelSelecionado) {
                    filtros.imovelSelecionado = this.imovelSelecionado;
                    filtros.matriculaImovel = this.imovelSelecionado.matricula;
                }
                else {
                    filtros.imovelSelecionado = undefined;
                    filtros.matriculaImovel = undefined;
                }

                if(filtros.inicio) {
                    filtros.inicio = Formatacao.formatDateCustom(filtros.inicio, 'DD/MM/YYYY');
                }
                else {
                    filtros.inicio = undefined;
                }

                if(filtros.termino) {
                    filtros.termino = Formatacao.formatDateCustom(filtros.termino, 'DD/MM/YYYY');
                }
                else {
                    filtros.termino = undefined;
                }

                if(filtros.safra) {
                    filtros.safra = Formatacao.formatDateCustom(filtros.safra, 'YYYY');
                }
                else {
                    filtros.safra = undefined;
                }

                if(this.filtros.nrReInicial !== undefined && this.filtros.nrReInicial !== null){
                    filtros.nrReInicial = this.filtros.nrReInicial;
                }

                if(this.filtros.nrReFinal !== undefined && this.filtros.nrReFinal !== null){
                    filtros.nrReFinal = this.filtros.nrReFinal;
                }

console.log('this - nrReInicial: ', this.filtros.nrReInicial);
console.log('this - nrReFinal: ',this.filtros.nrReFinal);
console.log('get - nrReInicial: ', filtros.nrReInicial);
console.log('get - nrReFinal: ',filtros.nrReFinal);
                
                return filtros;
            },

            confirmarLimparPeriodo() {
                this.limparPeriodoDialog = true;
            },

            limparPariodo() {
                this.limparPeriodoDialog = false;

                if(this.filtros) {
                    this.filtros.inicio = null;
                    this.filtros.termino = null;
                }

                this.filtrar();
            },

            confirmarLimparFiltro() {
                this.limparFiltroDialog = true;
            },

            limparFiltro() {
                
                this.filtros = {

                    inicio : Formatacao.subtrairDias(new Date(), 180),
                    termino : new Date(),
                    nrReInicial : 0,
                    nrReFinal : 999999999
                };
                this.selecionarEstabelecimento();

                this.filtrar();
            },

            buscarEstabelecimento(event) {
                setTimeout(() => {
                    if(!event.query.trim().length) {
                        this.estabelecimentosFiltrados = [...this.estabelecimentos];
                    }
                    else {
                        this.estabelecimentosFiltrados = this.estabelecimentos.filter((item) => {
                            return item.label.toLowerCase().startsWith(event.query.toLowerCase());
                        });
                    }
                }, 250);
            },

            buscarImoveis(event) {
                const produtor = this.produtorSelecionado;
                if(produtor == undefined && produtor == null) return;
                const matriculaOuDescricao = !event.query.trim().length ? undefined : event.query;
                ImoveisService.pesquisarPorCodigoProdutorEMatriculaOuDescricaoSemSerTransferencia(produtor.codProdutor, matriculaOuDescricao)
                    .then(({ data }) => {
                        if(data) {
                            this.imoveisFiltrados = data;
                            this.imoveisFiltrados.unshift({
                                matriculaNome: "Todos"
                            });
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.imoveisFiltrados = [];
                    });
            },

            buscarGrupoProduto(event) {
                const codigoOuDescricao = !event.query.trim().length ? undefined : event.query;
                GrupoProdutoService.buscarPorCodigoOuDescricao(codigoOuDescricao)
                    .then(({ data }) => {
                        if(data) {
                            this.grupoProdutoFiltrados = data;
                            this.grupoProdutoFiltrados.unshift({
                                codigoDescricao: "Todos"
                            });
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.grupoProdutoFiltrados = [];
                    });
            },

            selecionarEstabelecimento(codEstabelecimento = 0){

                if(codEstabelecimento === 0){
                    codEstabelecimento = StorageService.getUser().estabelecimento;
                }

                let encontrou = false;

                if(codEstabelecimento == '001'){
                    //Se estabelecimento 001 então recupera o primeiro silo da lista.
                    this.filtros.codEstabelecimento = this.estabelecimentos[0];
                }
                else{

                    //Selecionar o silo a que pertence o usuario logado.
                    this.estabelecimentos.map(item => {
                        if(item.codigo === codEstabelecimento ){
                            
                            console.log('Item: ',item);

                            this.filtros.codEstabelecimento = item;
                            encontrou = true;
                        }
                    });
                    
                    //Caso usuario logado nao seja de estab silo entao Seleciona o Silo da mesma regional.
                    if(!encontrou){

                        let codRegional = StorageService.getUser().regional;
                        
                        this.estabelecimentos.map(item => {
                            
                            if(item.codigoRegional === codRegional ){
                                this.filtros.codEstabelecimento = item;
                                encontrou = true;
                            }
                            
                        });
                    }

                }
            },

            /* INICIO METODOS PARA SELECIONAR O PRODUTOR */
            pesquisarProdutor(filtros) {
                produtorService.pesquisarProdutor(filtros)
                    .then(({ data }) => {
                        if(data) {
                            this.produtorConsulta = data;
                        }
                    })
                    .catch(error => {
                        this.produtorConsulta = {}
                    });
            },

            selecionarProdutor(codProdutor) {
                this.imovelSelecionado = null;

                if(codProdutor == undefined || codProdutor == null || codProdutor.trim() == "") {
                    this.produtorSelecionado = {};
                    return;
                }

                produtorService.buscarPorCodigoProdutor(codProdutor)
                    .then(({ data }) => {
                        if(data) {
                            this.produtorSelecionado = data;
                        }
                    })
                    .catch(error => {
                        this.produtorSelecionado = {};

                        if(!!error && !!error.response) {
                            const { data } = error.response;

                            this.$toast.add({
                                severity:'error', 
                                summary: 'Falha ao buscar produtor',
                                detail: data.message,
                                life: 5000
                            });
                        }
                    });
            }
        },
    }
</script>
