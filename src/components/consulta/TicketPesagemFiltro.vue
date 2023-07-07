<template>
    <div class="flex justify-content-between flex-column lg:flex-row">
        <div class="flex align-items-center lg:align-items-end flex-column lg:flex-row">
            <div class="mt-2 mr-2" style="min-width:15rem;">
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
                ></AutoComplete>
            </div>

            <div class="mt-2 mr-2" style="min-width:14rem;">
                <label><strong>Ticket de pesagem</strong></label>
                <div class="flex align-items-center mt-1">
                    <div class="overflow-hidden" style="width:6rem;">
                        <InputNumber v-model="filtros.nroDocPesagemInicial" />
                    </div>
                    <strong class="ml-2 mr-2">à</strong>
                    <div class="overflow-hidden" style="width:6rem;">
                        <InputNumber v-model="filtros.nroDocPesagemFinal" :min="filtros.nroDocPesagemInicial" />
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
                    <div class="overflow-hidden" style="width:8.3rem;">
                        <div class="p-inputgroup">
                            <Calendar
                                class="w-full"
                                v-model="filtros.termino"
                                autocomplete="off"
                                dateFormat="dd/mm/y"
                                :minDate="filtros.inicio"
                            />
                            <Button 
                                icon="pi pi-trash"
                                style="border-radius: 0 10% 10% 0;"
                                @click="confirmarLimparPeriodo()"
                            ></Button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-2 mr-2">
                <Button
                    icon="pi pi-search"
                    label="Filtrar"
                    class="p-button-outlined"
                    style="padding: 0.4rem;"
                    @click="filtrar()"
                ></Button>
            </div>
        </div>

        <div class="flex align-items-end mt-2">
            <TicketPesagemExportarXls
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
                <label for="filtroProduto"><strong>Produto</strong></label>
                <InputText class="w-full mt-2" id="filtroProduto" v-model="filtros.produto" />
            </div>

            <div class="col-6">
                <label for="filtroProdutor"><strong>Produtor</strong></label>
                <InputText class="w-full mt-2" id="filtroProdutor" v-model="filtros.produtor" />
            </div>

            <div class="col-6">
                <label for="filtroImovel"><strong>Imóvel</strong></label>
                <InputText class="w-full mt-2" id="filtroImovel" v-model="filtros.imovel" />
            </div>

            <div class="col-6">
                <label for="filtroGrupoProduto"><strong>Grupo de produto</strong></label>
                <AutoComplete
                    class="w-full mt-2"
                    id="filtroGrupoProduto"
                    placeholder="Selecionar"
                    v-model="filtros.grupoProdutoid"
                    field="label"
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
    import TicketPesagemExportarXls from './TicketPesagemExportarXls.vue'
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import Formatacao from '../../utilities/Formatacao';
    import StorageService from '../../service/StorageService';

    export default {
        emits: ['filtrar'],
        components: { TicketPesagemExportarXls },
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

                estabelecimentos: [],
                estabelecimentosFiltrados: [],
                grupoProdutoFiltrados: [],

                situacaoOpcoes: [
                    { label: 'Todas' },
                    { label: 'Aguard. RE', value: 'AGUARDANDO_RE' },
                    { label: 'Gerando RE', value: 'GERANDO_RE' },
                    { label: 'Concluído', value: 'CONCLUIDO' }
                ],

                pesagemOpcoes: [
                    { label: 'Todas' },
                    { label: 'Automática', value: 'AUTOMATICA' },
                    { label: 'Manual', value: 'MANUAL' }
                ]
            }
        },
        created() {
            const estabelecimento =  StorageService.getEstabelecimento();
            if(!!estabelecimento) {
                this.codEstablecimento = estabelecimento.codigo;
            }

            this.limparFiltro();
            this.carregarEstabelecimentos();
        },
        methods: {
            filtrar() {
                const filtros= this.getFiltros();
                this.filtroDialog = false;
                this.$emit('filtrar', filtros);
            },

            carregarEstabelecimentos() {
                EstabelecimentoService.getEstabelecimentosPorEstabelecimentoDoUsuario(this.codEstablecimento)
                    .then(({ data }) => {
                        this.estabelecimentos = data.map(item => {
                            item["label"] = `${ item.codigo } - ${ item.nomeFantasia}`;
                            return item;
                        });
                    });
            },

            getFiltros() {
                const filtros = Object.assign({}, this.filtros);

                if(filtros.codEstabelecimento) {
                    filtros.codEstabelecimento = filtros.codEstabelecimento.codigo;
                }

                if(filtros.grupoProdutoid) {
                    filtros.grupoProdutoid = filtros.grupoProdutoid.id
                }

                if(filtros.inicio) {
                    filtros.inicio = Formatacao.formatDateCustom(filtros.inicio, 'DD/MM/YYYY');
                }

                if(filtros.termino) {
                    filtros.termino = Formatacao.formatDateCustom(filtros.termino, 'DD/MM/YYYY');
                }

                if(filtros.safra) {
                    filtros.safra = Formatacao.formatDateCustom(filtros.safra, 'YYYY');
                }

                if(filtros.tipoPesagemBalanca) {
                    filtros.tipoPesagemBalanca = filtros.tipoPesagemBalanca.value;
                }

                if(filtros.status) {
                    filtros.status = filtros.status.value;
                }

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
                const estabelecimento = StorageService.getEstabelecimento();
                if(!estabelecimento) return;

                estabelecimento['label'] = `${ estabelecimento.codigo } - ${ estabelecimento.nomeFantasia}`;
                this.limparFiltroDialog = false;
                this.filtros = {
                    codEstabelecimento: estabelecimento
                }

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

            buscarGrupoProduto(event) {
                const codigoOuDescricao = !event.query.trim().length ? 'a' : event.query;
                GrupoProdutoService.getGrupoPorCodigoOuDescricao(codigoOuDescricao)
                    .then(({ data }) => {
                        if(data) {
                            this.grupoProdutoFiltrados = data.map(item => {
                                item["label"] = `${ item.fmCodigo } - ${ item.descricao }`;
                                return item;
                            });
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.grupoProdutoFiltrados = [];
                    });
            },
        },
    }
</script>
