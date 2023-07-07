<template>
  <Toast />
    <div class="card"> 
        <div class="flex justify-content-between">
            <div class="flex align-items-center">
                <i class="pi pi-check-square mr-2" style="font-size: 1.5rem;"></i>
                <h4 style="margin:0;">{{ id ? 'Editar' : 'Cadastrar'}} Safra Composta</h4>
            </div>
            <Toast/>
            
        </div>
        
        <Message v-if="message_worn_visible" severity="warn" :closable="false">{{ message_worn }}</Message><hr />

        <div class="grid">

            <div class="col-12 md:col-1">
                <label><strong>Ano Base</strong></label>
                <InputText class="w-full mt-1" v-model="anoBase" :disabled="true" />
            </div>

            <div class="col-12 md:col-2">
                <label><strong>Tipo Safra<span class="ml-1" style="color: red;">*</span></strong></label>
                <div class="grid mt-2  border-radio">
                    <div class="col-6">
                        <div class="field-radiobutton">
                            <RadioButton
                                :class="{'p-invalid': tipoSafraIsInvalid}"
                                inputId="verao"
                                value="VERAO"
                                v-model="content.tipoSafra"
                                @change="gerarDescricao()"
                                :disabled="id != null && isCopia != true"
                            />
                            <label for="verao">Verão</label>
                        </div>
                    </div>

                    <div class="col-6">
                        <div class="field-radiobutton">
                            <RadioButton
                                :class="{'p-invalid': tipoSafraIsInvalid}"
                                inputId="inverno"
                                value="INVERNO"
                                v-model="content.tipoSafra"
                                @change="gerarDescricao()"
                                :disabled="id != null && isCopia != true"
                            />
                            <label for="inverno">Inverno</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 md:col-3">
                <label><strong>Tipo Produto<span class="ml-1" style="color: red;">*</span></strong></label>
                <AutoComplete
                    :class="{'p-invalid': tipoProdutoIsInvalid}"
                    class="w-full mt-1"
                    v-model="tipoProdutoSelecionado"
                    field="nome"
                    :dropdown="true"
                    :suggestions="tiposProdutosFiltrados"
                    :forceSelection="true"
                    @item-select="gerarDescricao()"
                    @complete="buscarTipoProduto($event)"
                    :disabled="id != null && isCopia != true"
                />
            </div>

            <div class="col-12 md:col-3">
                <label><strong>Descrição<span class="ml-1" style="color: red;">*</span></strong></label>
                <InputText
                    :class="{'p-invalid': nomeSafraIsInvalid}"
                    class="w-full mt-1"
                    v-model="content.nomeSafra"
                    :disabled="integration.disable"
                />
            </div>
        </div>

        <div class="grid">
            <div class="col-12 md:col-9">
                <Fieldset>
                    <template #legend>
                        <strong>Estabelecimentos<span class="ml-1" style="color: red;">*</span></strong>
                    </template>

                    <PickList v-model="estabelecimentos" dataKey="id" listStyle="height:200px;">
                        <template #sourceheader>
                            Disponíveis
                        </template>
                        <template #targetheader>
                            Vinculados
                        </template>
                        <template #item="{ item }">
                            <span >{{ item.codigo }} - {{ item.nomeFantasia }}</span>
                        </template>
                    </PickList>
                </Fieldset>
        
                <div class="flex align-items-center mr-1 ml-1 mt-3" style="border:1px solid #CECECE; border-radius:3px; overflow: hidden;">
                    <div class="mr-4" style="background: #F1F5F5; padding: 20px; border-right: 1px solid #CECECE;">
                        <div style="width: 110px; text-align: center;">
                            <strong>Data Início</strong>
                        </div>
                    </div>

                    <div>
                        <strong class="mr-2">Dia<span class="ml-1" style="color: red;">*</span></strong>
                        <div class="mr-4" style="width: 8rem;">
                            <Dropdown
                                class="w-full"
                                v-model="content.diaInicial"
                                :options="dias"
                                :class="{'p-invalid': diaInicialIsInvalid}" :disabled="integration.disable"
                            />
                        </div>
                    </div>

                    <div>    
                        <strong class="mr-2">Mês<span class="ml-1" style="color: red;">*</span></strong>
                        <div class="mr-4" style="width: 8rem;">
                            <Dropdown
                                class="w-full"
                                v-model="content.mesInicial"
                                :options="mes"
                                :class="{'p-invalid': mesInicialIsInvalid}" :disabled="integration.disable"
                            />
                        </div>
                    </div>
                        
                    <div>
                        <strong class="mr-2">Ano Base<span class="ml-1" style="color: red;">*</span></strong>
                        <div class="mr-4" style="width: 8rem;">
                            <Dropdown
                                class="w-full"
                                v-model="content.anoInicialOperacao"
                                optionLabel="descricao"
                                optionValue="valor"
                                :options="operacao"
                                :class="{'p-invalid': anoInicialOperacaoIsInvalid}" :disabled="integration.disable"
                                @change="calcularAnoInicial()"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <strong class="mr-2">Qtd.<span class="ml-1" style="color: red;">*</span></strong>
                        <div class="mr-4" style="width: 8rem;">
                            <Dropdown
                                class="w-full"
                                v-model="content.anoInicialQuantidade"
                                optionLabel="descricao"
                                optionValue="valor"
                                :options="quantidade"
                                :class="{'p-invalid': anoInicialQuantidadeIsInvalid}" :disabled="integration.disable"
                                @change="calcularAnoInicial()"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <strong class="mr-2">Ano</strong>
                        <div class="mr-4" style="width: 8rem;">
                            <InputText class="w-full" v-model="anoInicial" :disabled="true" />
                        </div>
                    </div>

                </div>

                <div class="flex align-items-center mr-1 ml-1 mt-3" style="border:1px solid #CECECE; border-radius:3px; overflow: hidden;">
                    <div class="mr-4" style="background: #F1F5F5; padding: 20px; border-right: 1px solid #CECECE;">
                        <div style="width: 110px; text-align: center;">
                            <strong>Data Fim</strong>
                        </div>
                    </div>

                    <div>
                        <strong class="mr-2">Dia<span class="ml-1" style="color: red;">*</span></strong>
                        <div class="mr-4" style="width: 8rem;">
                            <Dropdown
                                class="w-full"
                                v-model="content.diaFinal"
                                :options="dias"
                                :class="{'p-invalid': diaFinalIsInvalid}" :disabled="integration.disable"
                            />
                        </div>
                    </div>

                    <div>
                        <strong class="mr-2">Mês<span class="ml-1" style="color: red;">*</span></strong>
                        <div class="mr-4" style="width: 8rem;">
                            <Dropdown
                                class="w-full"
                                v-model="content.mesFinal"
                                :options="mes"
                                :class="{'p-invalid': mesFinalIsInvalid}" :disabled="integration.disable"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <strong class="mr-2">Ano Base<span class="ml-1" style="color: red;">*</span></strong>
                        <div class="mr-4" style="width: 8rem;">
                            <Dropdown
                                class="w-full"
                                v-model="content.anoFinalOperacao"
                                optionLabel="descricao"
                                optionValue="valor"
                                :options="operacao"
                                :class="{'p-invalid': anoFinalOperacaoIsInvalid}" :disabled="integration.disable"
                                @change="calcularAnoFinal()"
                            />
                        </div>
                    </div>
                    
                    <div>    
                        <strong class="mr-2">Qtd.<span class="ml-1" style="color: red;">*</span></strong>
                        <div class="mr-4" style="width: 8rem;">
                            <Dropdown
                                class="w-full"
                                v-model="content.anoFinalQuantidade"
                                optionLabel="descricao"
                                optionValue="valor"
                                :options="quantidade"
                                :class="{'p-invalid': anoFinalQuantidadeIsInvalid}" :disabled="integration.disable"
                                @change="calcularAnoFinal()"
                            />
                        </div>
                    </div>

                    <div> 
                        <strong class="mr-2">Ano</strong>
                        <div class="mr-4" style="width: 8rem;">
                            <InputText class="w-full" v-model="anoFinal" :disabled="true" />
                        </div>
                    </div>
                </div>

                <div class="flex align-items-center mr-1 ml-1 mt-3" style="border:1px solid #CECECE; border-radius:3px; overflow: hidden;">
                    <div class="mr-4" style="background: #F1F5F5; padding: 20px; border-right: 1px solid #CECECE;">
                        <div style="width: 110px; text-align: center;">
                            <strong>Safra Composta</strong>
                        </div>
                    </div>

                    <div>
                        <strong class="mr-2">Ano Base<span class="ml-1" style="color: red;">*</span></strong>
                        <div class="mr-4" style="width: 8rem;">
                            <Dropdown
                                class="w-full"
                                v-model="content.safraPlantioOperacao"
                                optionLabel="descricao"
                                optionValue="valor"
                                :options="operacao"
                                :class="{'p-invalid': safraPlantioOperacaoIsInvalid}" :disabled="integration.disable"
                                @change="calcularSafra()"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <strong class="mr-2">Qtd.<span class="ml-1" style="color: red;">*</span></strong>
                        <div class="mr-4" style="width: 8rem;">
                            <Dropdown
                                class="w-full"
                                v-model="content.safraPlantioQuantidade"
                                optionLabel="descricao"
                                optionValue="valor"
                                :options="quantidade"
                                :class="{'p-invalid': safraPlantioQuantidadeIsInvalid}" :disabled="integration.disable"
                                @change="calcularSafra()"
                            />
                        </div>
                    </div>

                    <div>
                        <strong class="mr-2">Ano Base<span class="ml-1" style="color: red;">*</span></strong>
                        <div class="mr-4" style="width: 8rem;">
                            <Dropdown
                                class="w-full"
                                v-model="content.safraColheitaOperacao"
                                optionLabel="descricao"
                                optionValue="valor"
                                :options="operacao"
                                :class="{'p-invalid': safraColheitaOperacaoIsInvalid}" :disabled="integration.disable"
                                @change="calcularSafra()"
                            />
                        </div>
                    </div>
                        
                    <div>
                        <strong class="mr-2">Qtd.<span class="ml-1" style="color: red;">*</span></strong>
                        <div class="mr-4" style="width: 8rem;">
                            <Dropdown
                                class="w-full"
                                v-model="content.safraColheitaQuantidade"
                                optionLabel="descricao"
                                optionValue="valor"
                                :options="quantidade"
                                :class="{'p-invalid': safraColheitaQuantidadeIsInvalid}" :disabled="integration.disable"
                                @change="calcularSafra()"
                            />
                        </div>
                    </div>

                    <div>
                        <strong class="mr-2">Safra</strong>
                        <div style="width: 8rem;">
                            <InputText class="w-full" v-model="safraComposta" :disabled="true" />
                        </div>
                    </div>
                    
                </div>

                <div class="col-12 flex align-items-center">
                    <Button v-if="integration.visible"
                        icon="pi pi-save"
                        label="Salvar"
                        :disabled="doubleClick"
                        class="p-button-info mr-1"
                        @click="salvar"/>

                    <Button v-if="integration.visible"
                        icon="pi pi-times"
                        label="Cancelar"
                        class="p-button-danger"
                        @click="voltar()"/>

                    <Button v-if="!integration.visible"
                        icon="pi pi-spinner"
                        label="Voltar"
                        class="p-button-outlined"
                        @click="voltar()"/>    
                </div>

            </div>
        </div> 
    </div>
</template>

<script>
    import IntegracaoService from '../../service/IntegracaoService'
    import TipoProdutoService from '../../service/TipoProdutoService';
    import SafraCompostaService from '../../service/SafraCompostaService';

    export default {
        props: {
            id: {
                type: String,
                required: false
            },

            isCopia: {
                type: Boolean,
                required: false
            },           
        },
        data() {
            return {
                content: {},
                dias: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                mes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                quantidade: [
                    { descricao: "0", valor: 0 },
                    { descricao: "1", valor: 1 }
                ],
                operacao: [
                    { descricao: "-", valor: "SUBTRAIR" },
                    { descricao: "+", valor: "SOMAR" }
                ],

                anoBase: new Date().getFullYear(),
                anoInicial: null,
                anoFinal: null,
                plantio: null,
                colheita: null,
                safraComposta: null,
                doubleClick: false,
                estabelecimentos: [[],[]],

                tipoProdutoSelecionado: null,
                tiposProdutosFiltrados: [],

                tipoSafraIsInvalid: false,
                tipoProdutoIsInvalid: false,
                nomeSafraIsInvalid: false,
                diaInicialIsInvalid: false,
                mesInicialIsInvalid: false,
                anoInicialOperacaoIsInvalid: false,
                anoInicialQuantidadeIsInvalid: false,
                diaFinalIsInvalid: false,
                mesFinalIsInvalid: false,
                anoFinalOperacaoIsInvalid: false,
                anoFinalQuantidadeIsInvalid: false,
                safraPlantioOperacaoIsInvalid: false,
                safraPlantioQuantidadeIsInvalid: false,
                safraColheitaOperacaoIsInvalid: false,
                safraColheitaQuantidadeIsInvalid: false,
                estabelecimentosIsInvalid:false,

                message_worn: '',
                message_worn_visible: false,
                integration: {},
            }
        },
        created() {
            this.integration = {
                visible: false,
                disable: true
            }
            this.getIntegrationOptons();
            if(this.id) {
                this.carregarDados();
            }
        },
        methods: {
            getIntegrationOptons(){
                const paginaAtual = "SAFRA_COMPOSTA";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                        }
                    })
            },
            
            carregarDados() {
                SafraCompostaService.getSafraCompostaPorId(this.id)
                    .then(({ data }) => {
                        this.content = data;
                        this.tipoProdutoSelecionado = {
                            id: data.tipoProdutoId,
                            nome: data.tipoProdutoNome
                        };

                        this.calcularAnoInicial();
                        this.calcularAnoFinal();
                        this.calcularSafra();
                        
                        if(this.isCopia == true) {
                            this.content["id"] = undefined;
                            this.content["nomeSafra"] = this.content["nomeSafra"] + " - ( cópia )";
                            this.carregarEstabelecimentos();
                        }
                        else {
                            this.carregarEstabelecimentos(data.estabelecimentos);
                        }
                    })
                    .catch(error => {
                        this.voltar();
                    });
            },

            calcularAnoInicial() {
                const operacao = this.content.anoInicialOperacao;
                const quantidade = this.content.anoInicialQuantidade;

                if(operacao == undefined || quantidade == undefined) return;

                this.anoInicial = this.calcular(operacao, quantidade);
            },

            calcularAnoFinal() {
                const operacao = this.content.anoFinalOperacao;
                const quantidade = this.content.anoFinalQuantidade;

                if(operacao == undefined || quantidade == undefined) return;

                this.anoFinal = this.calcular(operacao, quantidade);
            },

            calcularSafraPlantio() {
                const operacao = this.content.safraPlantioOperacao;
                const quantidade = this.content.safraPlantioQuantidade;

                if(operacao == undefined || quantidade == undefined) return;

                return this.calcular(operacao, quantidade);
            },

            calcularSafraColheita() {
                const operacao = this.content.safraColheitaOperacao;
                const quantidade = this.content.safraColheitaQuantidade;

                if(operacao == undefined || quantidade == undefined) return;

                return this.calcular(operacao, quantidade);
            },

            calcularSafra() {
                this.plantio = this.calcularSafraPlantio();
                this.colheita = this.calcularSafraColheita();

                if(this.plantio == undefined || this.colheita == undefined) return;

                this.safraComposta = this.plantio + "/" + this.colheita;
            },

            calcular(operacao, quantidade) {
                const anoBase = this.anoBase;

                if(operacao == "SOMAR") {
                    return anoBase + quantidade;
                }

                return anoBase - quantidade;
            },

            voltar() {
                this.$router.push(`/safra-composta`);
            },

            carregarEstabelecimentos(vinculados = []) {
                const tipoSafra = this.content.tipoSafra; 
                const tipoProduto = this.tipoProdutoSelecionado;
                
                if(tipoSafra == undefined || tipoProduto == undefined) return;

                SafraCompostaService.estabelecimentosSemVinculo(tipoSafra, tipoProduto.id)
                    .then(({ data }) => {
                        if(data) {
                            const disponiveis = data.filter(disponivel => {
                                const item = vinculados.find(vinculado => {
                                    return vinculado.id === disponivel.id;
                                });
                                return item === undefined;
                            });    
                            this.estabelecimentos = [disponiveis, vinculados];
                        }
                        else {
                            this.estabelecimentos = [[], []];
                        }
                    })
                    .catch(error => {
                        this.estabelecimentos = [[], []];
                    });
            },

            buscarTipoProduto(event) {
                const nome = !event.query.trim().length ? "" : event.query;
                TipoProdutoService.buscarTipoProdutoPorNome(nome)
                    .then(({ data }) => {
                        if(data) {
                            this.tiposProdutosFiltrados = data;
                        }
                        else {
                            this.tiposProdutosFiltrados = [];
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.tiposProdutosFiltrados = [];
                    });
            },

            gerarDescricao() {
                if(this.tipoProdutoSelecionado == null || this.content.tipoSafra == undefined) return;

                const nome = this.tipoProdutoSelecionado.nome;
                const tipoSafra = this.content.tipoSafra;
                const nomeSafra = `Safra ${ nome.toLocaleLowerCase() } ${ tipoSafra == "VERAO" ? "verão" : "inverno" }`;
                this.content.nomeSafra = nomeSafra.toLocaleUpperCase();

                this.carregarEstabelecimentos();
            },

            validarCampos() {
                let isValid = true;
                this.estabelecimentosIsInvalid = false;

                if(this.content.tipoSafra == undefined || this.content.tipoSafra == null) {
                    this.tipoSafraIsInvalid = true;
                    isValid = false;
                }

                if(this.tipoProdutoSelecionado == undefined || this.tipoProdutoSelecionado == null) {
                    this.tipoProdutoIsInvalid = true;
                    isValid = false;
                }

                if(this.content.nomeSafra == undefined || this.content.nomeSafra == null) {
                    this.nomeSafraIsInvalid = true;
                    isValid = false;
                }

                if(this.estabelecimentos[1].length <= 0) {
                    this.estabelecimentosIsInvalid = true;
                    isValid = false;
                }
                
                if(this.content.diaInicial == undefined || this.content.diaInicial == null) {
                    this.diaInicialIsInvalid = true;
                    isValid = false;
                }
                                
                if(this.content.mesInicial == undefined || this.content.mesInicial == null) {
                    this.mesInicialIsInvalid = true;
                    isValid = false;
                }
                                
                if(this.content.anoInicialOperacao == undefined || this.content.anoInicialOperacao == null) {
                    this.anoInicialOperacaoIsInvalid = true;
                    isValid = false;
                }
                                
                if(this.content.anoInicialQuantidade == undefined || this.content.anoInicialQuantidade == null) {
                    this.anoInicialQuantidadeIsInvalid = true;
                    isValid = false;
                }
                                
                if(this.content.diaFinal == undefined || this.content.diaFinal == null) {
                    this.diaFinalIsInvalid = true;
                    isValid = false;
                }

                if(this.content.mesFinal == undefined || this.content.mesFinal == null) {
                    this.mesFinalIsInvalid = true;
                    isValid = false;
                }

                if(this.content.anoFinalOperacao == undefined || this.content.anoFinalOperacao == null) {
                    this.anoFinalOperacaoIsInvalid = true;
                    isValid = false;
                }
                
                if(this.content.anoFinalQuantidade == undefined || this.content.anoFinalQuantidade == null) {
                    this.anoFinalQuantidadeIsInvalid = true;
                    isValid = false;
                }
                
                if(this.content.safraPlantioOperacao == undefined || this.content.safraPlantioOperacao == null) {
                    this.safraPlantioOperacaoIsInvalid = true;
                    isValid = false;
                }
                
                if(this.content.safraPlantioQuantidade == undefined || this.content.safraPlantioQuantidade == null) {
                    this.safraPlantioQuantidadeIsInvalid = true;
                    isValid = false;
                }

                if(this.content.safraColheitaOperacao == undefined || this.content.safraColheitaOperacao == null) {
                    this.safraColheitaOperacaoIsInvalid = true;
                    isValid = false;
                }
                
                if(this.content.safraColheitaQuantidade == undefined || this.content.safraColheitaQuantidade == null) {
                    this.safraColheitaQuantidadeIsInvalid = true;
                    isValid = false;
                }

                if(!isValid) {

                    this.$toast.add({
                        severity:'warn', 
                        summary: 'Alerta', 
                        detail:'Preencher os campos obrigatórios.', 
                        life: 5000
                    });

                    if(this.estabelecimentosIsInvalid){
                        this.$toast.add({
                            severity:'warn', 
                            summary: 'Alerta', 
                            detail:'Favor selecionar pelo menos 1 estabelecimento.', 
                            life: 5000
                        });
                    }
                }

                if(this.anoInicial > this.anoFinal){
                    isValid = false;
                    this.$toast.add({
                            severity:'warn', 
                            summary: 'Atenção!', 
                            detail:'O ano inicial não pode ser maior que o ano final, favor corrigir a parametrização.', 
                            life: 10000
                        });
                }

                if(this.plantio > this.colheita){
                    isValid = false;
                    this.$toast.add({
                            severity:'warn', 
                            summary: 'Atenção!', 
                            detail:'A safra composta inicial não pode ser maior que a final, favor corrigir a parametrização.', 
                            life: 10000
                        });
                }

                return isValid;
            },

            salvar() {
                if(!this.validarCampos() && !this.doubleClick) return;
                this.doubleClick = true;
                const content = Object.assign({}, this.content);
                content["estabelecimentos"] = this.estabelecimentos[1];
                content["tipoProdutoId"] = this.tipoProdutoSelecionado.id;

                if(this.id && this.isCopia != true) {
                    this.atualizar(content);
                }
                else {
                    this.cadastrar(content);
                }
            },

            cadastrar(content) {
                SafraCompostaService.cadastrar(content)
                    .then(response => {                       
                        this.$toast.add({
                            severity:'success',
                            detail:'A safra composta foi cadastrado com sucesso!',
                            life: 5000
                        }); 
                        setTimeout(() => {
                            this.voltar();
                        }, 2000);                       
                    })
                    .catch(error => {
                        this.message_worn = error.message;
                        this.message_worn_visible = true;
                        this.doubleClick = false;
                    });
            },

            atualizar(content) {
                SafraCompostaService.atualizar(content)
                    .then(response => {    
                        this.$toast.add({
                            severity:'success',
                            detail:'A safra composta foi atualizada com sucesso!',
                            life: 5000
                        });
                        
                        setTimeout(() => {
                            this.voltar();
                        }, 2000);  
                    })
                    .catch(error => {
                        this.message_worn = error.message;
                        this.message_worn_visible = true;
                        this.doubleClick = false;
                    });
            },
        }
    }
</script>

<style>
    .border-radio{
        border: #cecece solid 1px; 
        margin-top: 2px !important;       
        height: 32px;        
    }
</style>