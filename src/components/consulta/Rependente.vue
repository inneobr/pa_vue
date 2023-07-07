<template>
  <div class="card">

    <div class="flex align-items-center">
        <i class="pi pi-window-minimize mr-2" style="font-size: 1.4rem"></i>
        <h3 style="margin:0px 5px;">Entrada de Produção</h3>
    </div>

    <hr />
    <Message v-if="service.msg_active" :severity="service.msg_type" :closable="true">{{ service.msg_content }}</Message>

    <DataTable showGridlines
        responsiveLayout="scroll"
        scrollDirection="both"
        selectionMode="single"
        v-model:selection="rePendenteSelecionada"
        :loading="loading"
        :value="database">

        <template #header>
            <div class="flex justify-content-between">
                <div class="flex">
                    <AutoComplete
                        :dropdown="true" 
                        class="w-full reset mr-1"
                        field="codigoNomeFantasia"
                        placeholder="Selecionar"
                        v-model="estabelecimento" 
                        @item-select="selecionarEstabelecimento()"       
                        @complete="carregarEstabelecimentos($event)"
                        :suggestions="selectOptions" 
                        :disabled="estabelecimentoDisabled"
                    />
                </div>

                <div>
                    <Button v-if="integration.visible" type="button" label="Entrada Ticket" class="p-button-info mr-1"    @click="openDialog()"></Button>
                    <Button v-if="integration.visible" type="button" label="Entrada Manual" class="p-button-outlined mr-1" @click="cadastrar()" :disabled="desabilitarEntradaSemTicket"></Button>
                </div>
            </div>
        </template>

        <template #empty>
            Nenhum registro encontrado.
        </template>

        <template #loading>
            Carregando... Por favor, aguarde.
        </template>

        <Column field="nrDocPes" header="Nr. Doc." frozen sortable/>
        
        <Column field="placa" header="Placa" sortable>
            <template #body="{data}">
                {{ data.placa.toUpperCase() }}
            </template>
        </Column>

        <Column header="Entrada">
            <template #body="{data}">
                {{ !!data.dtEntrada ? formatDateCustom(data.dtEntrada, "DD/MM/YYYY") + " " + (data.hrEntrada || "00:00:00") : "" }}
            </template>
        </Column>

        <Column field="produtorCodigo" header="Produtor" sortable/>
        <Column field="produtorNome" header="Nome Produtor" sortable/>
        <Column field="imovelMatricula" header="Imóvel" sortable/>
        <Column field="produtoCodigo" header="Produto" sortable/>
        <Column field="produtoDescricao" header="Produto Descrição" sortable/>

        <Column header="Peso Líquido" sortable style="text-align: right;">
            <template #body="{data}">
                {{ getDecimal(data.pesoLiquido, 0, 0) }}
            </template>
        </Column>

        <Column header="Renda Líquido" sortable style="text-align: right;">
            <template #body="{data}">
                {{ getDecimal(data.rendaLiquida, 0, 0) }}
            </template>
        </Column>

        <Column v-if="integration.visible" style="width:8.7rem; font-weight: bold;" header="Ações">
            <template #body="{ data }">
                <Button icon="pi pi-pencil"  class="p-button-rounded p-button-info p-2 mr-2"    title="Editar"         @click="editar(data.id)"></Button>
                <Button icon="pi pi-refresh" class="p-button-rounded p-button-success p-2 mr-2" title="Atualizar a RE" @click="verificarAtualizacaoRe(data)" :disabled="!estabelecimento || !!data.atualizandoRe"></Button>
                <Button icon="pi pi-trash"   class="p-button-rounded p-button-danger p-2"       title="Deletar"        @click="confirmarExclusao(data)"></Button>
            </template>            
        </Column>

    </DataTable>

    <Pesagem :codigo="service.codico" :visivel="dialog" @fechar="closeDialog()"/>

    <Paginator
        v-model:first="firstRow"
        :rows="qtdRegistro" 
        :totalRecords="totalRegistro"
        :rowsPerPageOptions="[5, 10, 20, 30]"
        @page="onPage">
    </Paginator>
  </div>

    <Dialog v-model:visible="excluirDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Deseja <strong>excluír</strong> a entrada de produção <strong>{{ rePendente.nrDocPes }}</strong>?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="excluirDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="excluir()" />
        </template>
    </Dialog>

    <Dialog v-model:visible="confirmarAtualizacaoRe" :style="{width: '300px'}" header="Atualização RE" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Data do movimento aberto <strong>{{ formatDateCustom(parametroEstabelecimento.dtMovtoAberto, "DD/MM/YYYY") }}</strong> é diferente da data atual. Continua?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="confirmarAtualizacaoRe = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="atualizarRe(confirmarAtualizacaoReDados, true)" />
        </template>
    </Dialog>
  
</template>

<script>
    import parametroEstabelecimentoService from '../../service/ParametroEstabelecimentoService';
    import estabelecimentoService from '../../service/EstabelecimentoService';
    import SafraCompostaService from '../../service/SafraCompostaService';
    import IntegracaoService from '../../service/IntegracaoService';
    import RependenteService from'../../service/RependenteService';
    import Formatacao from '../../utilities/Formatacao';
    import Pesagem from '../consulta/FiltroPesagem.vue';
    import moment from 'moment';
    import StorageService from '../../service/StorageService';

    export default { 
        name: 'Entrada Re',
        components: { Pesagem },  
        data() {
            return {
                qtdRegistro: 10,
                pagina: 0,
                firstRow: 0,
                totalRegistro: 0,


                service: {},
                database: [],  
                dialog: false,   
                integration: {},            
                selectOptions: [],
                estabelecimento: null,

                parametroEstabelecimento: null,
                desabilitarEntradaSemTicket: true,

                rePendente: null,
                excluirDialog: false,
                confirmarAtualizacaoRe: false,
                confirmarAtualizacaoReDados: null,

                estabelecimentoDisabled: false,

                rePendenteSelecionada: null
            }
        },

        methods: {
            getIntegrationOptons(){
                const paginaAtual = "ENTRADA_PRODUCAO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                        }
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'info', 
                            summary: 'PARÂMETROS DE PÁGINA NÂO DEFINIDOS', 
                            detail:'Você deve cadastrar os parâmetros para esta página no menu lateral em item: Parâmetros de Integração.',
                            life: 10000
                        });
                    });
            },

            getSetup(dados){
                RependenteService.getRependente(dados, this.pagina, this.qtdRegistro)
                    .then(({ data }) => {
                        if(data) {
                            this.database = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                        }
                    });
            },

            carregarEstabelecimentos(event) {
                const codigoOuNomeFantasia = !event.query.trim().length ? undefined : event.query;
                estabelecimentoService.buscarPorUsuarioAutenticadoComHierarquiaEstabelecimentoQueSejaSilo(codigoOuNomeFantasia)
                    .then(({ data }) => {
                        if(data) {
                            this.selectOptions = data.map(item => {
                                item["codigoNomeFantasia"] = item.codigo + " - " + item.nomeFantasia;
                                return item;
                            });
                        }
                    })
                    .catch(error => {
                        this.selectOptions = [];
                    });
            },

            selecionarEstabelecimento() {
                if(this.estabelecimento == undefined || this.estabelecimento == null) { return; }

                this.service.codico = this.estabelecimento.codigo;
                this.getSetup(this.service.codico);

                const usuario = StorageService.getUser();
                StorageService.setEntradaProducao({ username: usuario.username, estabelecimento: this.estabelecimento });

                parametroEstabelecimentoService.buscarPorCodigoEstabelecimento(this.estabelecimento.codigo)
                    .then(({ data }) => {
                        if(data) {
                            this.parametroEstabelecimento = data;
                            this.desabilitarEntradaSemTicket = !data.logEntradaSemTik;
                        }
                    })
                    .catch(error => {
                        this.desabilitarEntradaSemTicket = true;
                    
                        if(!!error && !!error.response) {
                            const { data } = error.response;
                            this.$toast.add({
                                severity:'error',
                                summary: 'Falha ao carregar parâmetros do estabelecimento',
                                detail: data.message, 
                                life: 50000
                            });
                        }
                    });
            },

            getDecimal(value, minimumFractionDigits = 3, maximumFractionDigits = 11) {
                return Formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
            },

            formatDateCustom(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            cadastrar() {
                this.$router.push(`/entrada-producao/cadastrar/${ this.estabelecimento.codigo }`);
            },

            editar(id) {
                this.$router.push(`/entrada-producao/editar/${id}`);
            },

            confirmarExclusao(rePendente) {
                this.rePendente = rePendente;
                this.excluirDialog = true;
            },

            excluir() {
                RependenteService.excluir(this.rePendente.id)
                    .then(response => {
                        this.$toast.add({
                            severity:'success',
                            detail: "Entrada de produção excluída com sucesso!",
                            life: 15000
                        });

                        this.rePendente = null;
                        this.excluirDialog = false;
                        this.getSetup(this.service.codico);
                    })
                    .catch(error => {

                        if(!!error && !!error.response) {
                            const { message } = error.response.data;
                            this.$toast.add({
                                severity:'error',
                                summary: 'Falha ao excluír a entrada de produção.' ,
                                detail: message, 
                                life: 15000
                            });    
                        }
                        else {
                            this.$toast.add({
                                severity:'error',
                                summary: 'Falha ao excluír a entrada de produção.' ,
                                detail: error, 
                                life: 15000
                            });
                        }
                    });
            },

            async verificarAtualizacaoRe(registro) {
                const codigoEstabelecimento = this.estabelecimento.codigo;

                try {
                    const { data } = await parametroEstabelecimentoService.getDataMovimentoAberto(codigoEstabelecimento);
                    
                    if(!!data && !!data.dataMovimentoAberto) {
                        const dataAtual = moment(this.getDataCorrente(), "YYYY-MM-DD");
                        const dataEntrada = moment(registro.dtEntrada);
                        const dataMovimentoAberto = moment(data.dataMovimentoAberto, "YYYY-MM-DD");

                        if(dataMovimentoAberto.isAfter(dataAtual)) {
                            this.$toast.add({
                                severity:'warn', 
                                summary: 'Atualização de RE', 
                                detail:'Data de emissão da RE não pode ser maior que a data atual.',
                                life: 10000
                            });
                        }
                        else if(dataEntrada.isAfter(dataMovimentoAberto)) {
                            this.$toast.add({
                                severity:'warn', 
                                summary: 'Atualização de RE', 
                                detail:`A data de recebimento da RE está maior que a data de emissão da nota (ft0114). Favor ajustar a data para prosseguir.`,
                                life: 10000
                            });
                        }
                        else if(dataMovimentoAberto.isBefore(dataAtual)) {
                            this.$toast.add({
                                severity:'warn', 
                                summary: 'Atualização de RE', 
                                detail:`A data do movimento aberto ${ dataMovimentoAberto.format('DD/MM/YYYY') } é diferente da data atual não é possível prosseguir. Encerre o dia ${ dataMovimentoAberto.format('DD') } para continuar.`,
                                life: 10000
                            });
                        }
                        else {
                            this.atualizarRe(registro);
                        }
                    }
                    else {
                        this.$toast.add({
                            severity:'error', 
                            summary: 'Atualização de RE', 
                            detail:'Não tem movimento em aberto para o estabelecimento, favor entrar em contato com Suporte TI.',
                            life: 10000
                        });
                    }
                }
                catch({ response }) {
                    if(!!response && !!response.data) {
                        const { mensagem } = response.data
                        this.$toast.add({
                            severity:'error', 
                            summary: 'Atualização de RE', 
                            detail: mensagem,
                            life: 10000
                        });
                    }
                    else {
                        this.$toast.add({
                            severity:'error', 
                            summary: 'Atualização de RE', 
                            detail: 'Falha ao consultar data do movimento aberto.',
                            life: 10000
                        });
                    }
                }
            },

            verificarToleranciaRecebimentoSemente(dados) {
                const safra = moment(dados.dtEntrada).year();

                return new Promise((resolve, reject) => {
                    SafraCompostaService.verificarToleranciaRecebimentoSemente(dados.codigoEstabelecimento, safra, dados.codigoGrupoProduto, dados.nrOrdCampo, dados.nrLaudo)
                    .then(({ data }) => {
                        if(!!data && !!data.tipoRetorno && data.tipoRetorno.toUpperCase() == "AVISO") {
                            this.$toast.add({
                                severity:'warn', 
                                summary: 'Aviso',
                                detail: data.mensagem,
                                life: 10000
                            });
                            resolve(data);
                        }
                        else if(!!data && !!data.tipoRetorno && data.tipoRetorno.toUpperCase() == "ERRO") {
                            this.$toast.add({
                                severity:'error', 
                                summary: 'Falha',
                                detail: data.mensagem,
                                life: 10000
                            });
                            reject(data);
                        }
                        else {
                            resolve(data);
                        }
                    })
                    .catch(({ response }) => {
                        reject(response.data);
                    });
                });
            },

            atualizarRe(dados, permitirDataMovimentoAbertoMenorQueDataAtual = false) {
                dados.atualizandoRe = true;
                this.confirmarAtualizacaoRe = false;
                this.confirmarAtualizacaoReDados = null;

                this.$toast.add({
                    severity:'warn', 
                    summary: 'Atualização da RE', 
                    detail: 'A atualização da RE foi iniciada.',
                    life: 10000
                });

                this.verificarToleranciaRecebimentoSemente(dados)
                    .then(() => {
                        RependenteService.atualizarRe(dados.id, permitirDataMovimentoAbertoMenorQueDataAtual)
                            .then(({ data }) => {
                                const { integrated, message } = data;

                                if(integrated) {
                                    this.$toast.add({
                                        severity:'success', 
                                        summary: 'Atualização de RE', 
                                        detail: message,
                                        life: 20000
                                    });

                                    this.selecionarEstabelecimento();
                                }
                                else {
                                    this.$toast.add({
                                        severity:'warn', 
                                        summary: 'Atualização de RE', 
                                        detail: message,
                                        life: 20000
                                    });
                                }
                            })
                            .catch(({ response }) => {
                                dados.atualizandoRe = false;
                                if(!!response && !!response.data) {
                                    const { message } = response.data;
                                    this.$toast.add({
                                        severity:'error', 
                                        summary: 'Atualização de RE', 
                                        detail: message,
                                        life: 20000
                                    });
                                }
                                else {
                                    this.$toast.add({
                                        severity:'error', 
                                        summary: 'Atualização de RE', 
                                        detail: 'Falha ao atualizar RE.',
                                        life: 20000
                                    });
                                    console.log('Falha ao atualizar RE.', response);
                                }
                            });
                    })
                    .catch(error => {
                        console.log('Falha ao atualizar RE (verificarToleranciaRecebimentoSemente):', error);

                        if(!!error && !!error.mensagem) {

                            this.$toast.add({
                                severity:'error', 
                                summary: 'Atualizar RE', 
                                detail: error.mensagem,
                                life: 10000
                            });
                        }
                        else {
                            this.$toast.add({
                                severity:'error', 
                                summary: 'Atualização de RE', 
                                detail: 'Falha ao atualizar RE.',
                                life: 10000
                            });
                        }
                    });
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.firstRow = event.page * event.rows;
                this.qtdRegistro = event.rows;
                this.getSetup(this.service.codico);
            },

            openDialog(){
                this.dialog = true;
            },

            closeDialog(){
                this.dialog = false;
            },

            getDataCorrente() {
                const data = new Date();
                let mes = data.getMonth() + 1;
                if(mes < 10) mes = '0' + mes;
                return  `${ data.getFullYear() }-${ mes }-${ data.getDate() }`; 
            }
        },

        created(){
            this.getIntegrationOptons();

            let usuario = StorageService.getUser();
            let entradaProducaoTemp = StorageService.getEntradaProducao();
            
            if(!!entradaProducaoTemp) {
                if(usuario.username === entradaProducaoTemp.username) {
                    this.estabelecimento = entradaProducaoTemp.estabelecimento;
                    this.selecionarEstabelecimento();
                }
                else {
                    entradaProducaoTemp = null;
                }
            }

            if(!entradaProducaoTemp) {
                estabelecimentoService.buscarPorUsuarioAutenticadoComHierarquiaEstabelecimentoQueSejaSilo("", 1)
                    .then(({ data }) => {
                        if(!!data && data.length > 0) {
                            const item = data[0];
                            item["codigoNomeFantasia"] = item.codigo + " - " + item.nomeFantasia;
                            this.estabelecimento = item;
                            this.selecionarEstabelecimento();
                        }
                        else {
                            this.estabelecimentoDisabled = true;
                            this.service.msg_active  = true;
                            this.service.msg_type    = "warn";
                            this.service.msg_content = "Não existe permissão de usuário vs estabelecimento ativa.";
                            StorageService.setEntradaProducao();
                        }
                    });
            }
        }
    }
</script>