<template>
    <div class="card">
        <Toast />
        
        <div class="flex align-items-center">
            <i class="pi pi-th-large mr-2" style="font-size: 2rem;"></i>
            <h3 style="margin:0;">{{ isCadastro() ? 'Cadastrar' : 'Editar' }} Grupo de Produto</h3>
        </div>

        <hr />

        <div class="grid">
            <div class="col-8 sm:col-9 lg:col-2">
                <label for="codigo"><strong>Código<span style="color:red;">&nbsp;*</span></strong></label>
                <InputText 
                    id="codigo" 
                    v-model="grupo.fmCodigo"
                    class="w-full mt-1"
                    :class="{'p-invalid': codigoIsInvalid}"
                    :disabled="!isCadastro()"
                />
            </div>

            <div class="col-6 sm:col-4 lg:col-8">
                <label for="descricao"><strong>Descrição<span style="color:red;">&nbsp;*</span></strong></label>
                <InputText 
                    class="w-full mt-1" 
                    id="descricao" 
                    :class="{'p-invalid': descricaoIsInvalid}"
                    v-model="grupo.descricao" 
                    :disabled="disable"/>
            </div>

            <!-- <div class="col-6 sm:col-4 lg:col-2">
                <label for="ativo"><strong>Situação</strong></label>
                <Dropdown
                    placeholder="Selecionar"
                    id="Ativo"
                    class="w-full mt-1"
                    optionLabel="nome"
                    v-model="ativo"
                    :options="ativoOpcoes"
                    :disabled="integration.disable"/>
            </div> -->
        </div>

        <Fieldset class="grupo-produto">
            <template #legend>
                <strong>Característica</strong>
            </template>

            <div class="grid">
                <div class="col-6 sm:col-4 lg:col-3">
                    <label for="tipoProduto"><strong>Tipo de produto <span style="color:red;">&nbsp;*</span></strong></label>
                    <AutoComplete
                        placeholder="Selecionar"
                        class="w-full mt-1"
                        id="tipoProduto"
                        :class="{'p-invalid': tipoProdutoIsInvalid}"
                        v-model="tipoProdutoSelecionado"
                        field="nome"
                        :suggestions="tiposProdutosFiltrados"
                        :dropdown="true"
                        @complete="buscarTiposProdutos($event)"
                        :change="verificaTipoCafe()"
                        :disabled="disable"/>
                </div>

                <div class="col-6 sm:col-4 lg:col-3">
                    <label for="referencia"><strong>Referência À Fixar</strong></label>
                    <Dropdown
                        placeholder="Selecionar"
                        id="referencia"
                        class="w-full mt-1"
                        v-model="grupo.referencia"
                        optionValue="codigo"
                        optionLabel="descricao"
                        :options="referencia"
                        :disabled="disable"/>
                </div>

                <div class="col-6 sm:col-4 lg:col-3">
                    <label for="referFixado"><strong>Referência Fixado</strong></label>
                    <Dropdown
                        placeholder="Selecionar"
                        id="referFixado"
                        class="w-full mt-1"
                        v-model="grupo.referFixado"
                        optionValue="codigo"
                        optionLabel="descricao"
                        :options="referencia"
                        :disabled="disable"/>
                </div>

                <div class="col-6 sm:col-4 lg:col-3">
                    <label for="kgsc"><strong>Kg/Saca</strong><span style="color:red;">&nbsp;*</span></label>
                    <InputNumber
                        :class="{'p-invalid': kgScIsInvalid}"
                        :disabled="disable"
                        v-model="grupo.kgSc"
                        :max='10000' :min='1'
                        class="w-full mt-1"
                        mode="decimal"
                        id="kgsc"/>
                </div>

                <div class="field-checkbox col-6 sm:col-4 lg:col-3">
                    <Checkbox id="logTransgenico" v-model="grupo.logTransgenico" :binary="true" @change="inativarTipoGmo()" :disabled="disable"/>
                    <label for="logTransgenico">Transgênico</label>
                </div>
                
                <div class="field-checkbox col-6 sm:col-4 lg:col-3">
                    <Checkbox id="transferencia" v-model="grupo.transferencia" :binary="true" :disabled="disable"/>
                    <label for="transferencia">Permite Transferência entre Produtores</label>
                </div>
                
                <div class="field-checkbox col-6 sm:col-4 lg:col-6">
                    <Checkbox id="logRetirada" v-model="grupo.logRetirada" :binary="true" :disabled="disable" />
                    <label for="logRetirada">Permite Retirada</label>
                </div>
                
                <div class="field-checkbox col-6 sm:col-4 lg:col-3">
                    <Checkbox id="desmembramento" v-model="grupo.desmembramento" :binary="true" :disabled="disable" @change="desmembramentoClick" />
                    <label for="desmembramento">Permite Desmembramento</label>
                </div>

                <div class="field-checkbox col-6 sm:col-4 lg:col-3">
                    <Checkbox id="permiteDesmembraTercCoop" v-model="grupo.permiteDesmembraTercCoop" :binary="true" :disabled="disable || disabledPermiteDesmembraTercCoop"/>
                    <label for="permiteDesmembraTercCoop">Permite Desmembramento entre Cooperado e Terceiro</label>
                </div>

                <div class="field-checkbox col-6 sm:col-4 lg:col-3">
                    <Checkbox id="cafeBeneficiado" v-model="grupo.cafeBeneficiado" :binary="true" :disabled="disable || disableCafe"/>
                    <label for="cafeBeneficiado">Café Beneficiado</label>
                </div>

                <div class="field-checkbox col-6 sm:col-4 lg:col-3">
                    <Checkbox id="cafeCoco" v-model="grupo.cafeCoco" :binary="true" :disabled="disable || disableCafe"/>
                    <label for="cafeCoco">Café Coco</label>
                </div>

                <div class="col-6 sm:col-4 lg:col-3">
                    <label for="entradaRe"><strong>Entrada RE</strong><span style="color:red;">&nbsp;*</span></label>
                    <Dropdown
                        placeholder="Selecionar"
                        class="w-full mt-1"
                        id="referFixado"
                        v-model="grupo.entradaRe"
                        optionValue="Chave"
                        optionLabel="Valor"
                        :class="{'p-invalid': entradaReIsInvalid}"
                        :options="entradaRe"
                        :disabled="disable"/>
                </div>

                <div v-if="grupo.entradaRe === 'CONDICAO'" class="col-6 sm:col-3 lg:col-2">
                    <label for="condChuvAvarSinal"><strong>Condição Chuv/Avar Sinal</strong><span style="color:red;">&nbsp;*</span></label>
                    <InputText 
                        :disabled="disable"
                        v-model="grupo.condChuvAvarSinal"
                        class="w-full mt-1"
                        id="condChuvAvarSinal"
                        :class="{'p-invalid': condChuvAvarSinalIsInvalid}"/>
                </div>

                <div v-if="grupo.entradaRe === 'CONDICAO'" class="col-6 sm:col-3 lg:col-2">
                    <label for="condChuvAvarSinal"><strong>Condição Chuv/Avar Valor</strong><span style="color:red;">&nbsp;*</span></label>
                    <InputNumber
                        :disabled="disable"
                        v-model="grupo.condChuvAvarValor"
                        class="w-full mt-1"
                        id="condChuvAvarValor"
                        mode="decimal"
                        :minFractionDigits="0" :maxFractionDigits="2"
                        :max='999' :min='0'
                        :class="{'p-invalid': condChuvAvarValorIsInvalid }"/>
                    
                </div>

            </div>
        </Fieldset>

        <Fieldset class="grupo-produto">
            <template #legend>
                <strong>Classificação</strong>
            </template>

            <div class="grid">
                <div class="col-9">
                    <div class="grid">                        
                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="impureza" v-model="grupo.impureza" :binary="true" :disabled="disable"/>
                            <label for="impureza">Impureza</label>
                        </div>
                        
                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="umidade" v-model="grupo.umidade" :binary="true" :disabled="disable"/>
                            <label for="umidade">Umidade</label>
                        </div>
                        
                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="chuvAvar" v-model="grupo.chuvAvar" :binary="true" :disabled="disable"/>
                            <label for="chuvAvar">Chuvado/Avariado</label>
                        </div>

                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="phEntrada" v-model="grupo.phEntrada" :binary="true" @click="phEntradaClick" :disabled="disable"/>
                            <label for="phEntrada">PH Entrada</label>
                        </div>

                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="logBandinha" v-model="grupo.logBandinha" :binary="true" :disabled="disable"/>
                            <label for="logBandinha">Bandinha</label>
                        </div>

                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="tbm" v-model="grupo.tbm" :binary="true" :disabled="disable"/>
                            <label for="tbm">TBM</label>
                        </div>

                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="tipo" v-model="grupo.tipo" :binary="true" :disabled="disable"/>
                            <label for="tipo">Tipo</label>
                        </div>

                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="bebida" v-model="grupo.bebida" :binary="true" :disabled="disable"/>
                            <label for="bebida">Bebida</label>
                        </div>

                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="cafeEscolha" v-model="grupo.cafeEscolha" :binary="true" :disabled="disable"/>
                            <label for="cafeEscolha">Café Escolha</label>
                        </div>

                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="cata" v-model="grupo.cata" :binary="true" :disabled="disable"/>
                            <label for="cata">Cata</label>
                        </div>

                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="qualiProduto" v-model="grupo.qualiProduto" :binary="true" :disabled="disable"/>
                            <label for="qualiProduto">Qualidade produto</label>
                        </div>

                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="semente" v-model="grupo.semente" :binary="true" :disabled="disable"/>
                            <label for="semente">Semente</label>
                        </div>

                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="nrLaudo" v-model="grupo.nrLaudo" :binary="true" :disabled="disable"/>
                            <label for="nrLaudo">Nr. Laudo</label>
                        </div>

                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="nrOrdCampo" v-model="grupo.nrOrdCampo" :binary="true" :disabled="disable"/>
                            <label for="nrOrdCampo">Nr. Ordem Campo</label>
                        </div>
                        
                        <!-- <div class="field-checkbox col-6 sm:col-4 lg:col-3">
                            <Checkbox id="chuvAvar" v-model="grupo.chuvAvar" :binary="true" :disabled="disable"/>
                            <label for="chuvAvar">Chuvado/Avariado</label>
                        </div> -->
                        
                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="lote" v-model="grupo.lote" :binary="true" :disabled="disable"/>
                            <label for="lote">Lote</label>
                        </div>
                        
                        <!-- <div class="field-checkbox col-6 sm:col-4 lg:col-3">
                            <Checkbox id="logBandinha" v-model="grupo.logBandinha" :binary="true" :disabled="disable"/>
                            <label for="logBandinha">Bandinha</label>
                        </div> -->
                        
                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="fnt" v-model="grupo.fnt" :binary="true" :disabled="disable"/>
                            <label for="fnt">FNT</label>
                        </div>

                        <div class="field-checkbox col-6 sm:col-4 lg:col-2">
                            <Checkbox id="lote" v-model="grupo.densidade" :binary="true" :disabled="disable"/>
                            <label for="lote">Densidade</label>
                        </div>

                    </div>
                </div>

                <div class="col-3">
                    <div class="grid">
                        <div class="col-6 sm:col-4 lg:col-12">
                            <label for="phMinimo"><strong>PH Minimo</strong></label>
                            <InputNumber
                                id="phMinimo"
                                mode="decimal"
                                class="w-full mt-1"
                                max="100"
                                min="0"
                                v-model="grupo.phMinimo"
                                :disabled="!grupo.phEntrada || disable"
                                :class="{'p-invalid': phIsInvalid}"/>
                        </div>
                        <div class="col-6 sm:col-4 lg:col-12">
                            <label for="percImpureza"><strong>% Acréscimo Impureza</strong></label>
                            <InputNumber
                                id="percImpureza"
                                mode="decimal"
                                class="w-full mt-1"
                                v-model="grupo.percImpureza"
                                :minFractionDigits="2"
                                :maxFractionDigits="5" 
                                :max='10000' :min='0'
                                :disabled="!grupo.phEntrada || disable"
                                :class="{'p-invalid': impurezaIsValid}"/>
                        </div>
                    </div>
                </div>
            </div>
        </Fieldset>

        <div class="grid">
            <div class="col-6">
                <Fieldset class="grupo-produto" style="min-height:12rem;">
                    <template #legend>
                        <strong>Sub Produto</strong>
                    </template>
                    
                    <div class="flex align-items-center">
                        <div class="col-5" style="text-align:right;">
                            <label for="fmCodigoSub" class="text-right">
                                <strong>Grupo de Produto:</strong>
                            </label>
                        </div>
                        <div class="col-7">
                            <InputText class="w-full mt-1" 
                                id="fmCodigoSub" 
                                v-model="grupo.fmCodigoSub"
                                :class="{'p-invalid': fmCodigoIsInvalid}"
                                :disabled="disable"/>
                        </div>
                    </div>

                    <div class="flex align-items-center">
                        <div class="col-5" style="text-align:right;">
                            <label for="itSub" class="text-right">
                                <strong>Produto:</strong>
                            </label>
                        </div>
                        <div class="col-7">
                            <InputText class="w-full mt-1" id="itSubCoop" 
                                v-model="grupo.itSubCoop" 
                                :class="{'p-invalid': itSubCoopIsInvalid}"
                                :disabled="disable"/>
                        </div>
                    </div>
                </Fieldset>
            </div>
            
            <div class="col-6">
                <Fieldset class="grupo-produto" style="min-height:12rem;">
                    <template #legend>
                        <strong>Secagem/Limpeza</strong>
                    </template>

                    <div class="flex align-items-center">
                        <div class="col-5" style="text-align:right;">
                            <label for="itTaxa" class="text-right">
                                <strong>Produto Taxa:</strong>
                            </label>
                        </div>
                        <div class="col-7">
                            <InputText class="w-full mt-1" id="itTaxa" v-model="grupo.itTaxaCoop" :disabled="disable"/>
                        </div>
                    </div>
                </Fieldset>
            </div>
        </div>

        
        <Fieldset  v-show="grupo.logTransgenico" >
            <template #legend>
                <strong>Tipo GMO</strong>
            </template>

            <DataTable :value="grupo.listGrupoProdutoGmo" responsiveLayout="scroll">
                <template #header>
                    <div v-if="integration.visible" class="flex justify-content-between align-items-center">
                        <strong style="font-size: 18px;">Tipo GMO</strong>
                        <div class="flex align-items-center">
                            <AutoComplete
                                placeholder="Selecionar"
                                class="w-full mr-1"
                                id="tipoProduto"
                                v-model="tipoGmoSelecionado"
                                field="tipoGmo"
                                :suggestions="tipoGmoFiltradoList"
                                :dropdown="true"
                                :disabled="!isTipoGmo()"
                                @complete="buscarTipoGmo($event)"/>

                            <Button
                                icon="pi pi-plus"
                                class="p-button p-component"
                                :disabled="!isTipoGmo()"
                                @click="vincularGmo()" />
                        </div>
                    </div>
                </template>

                <Column header="Descrição">
                    <template #body="{ data }">
                        {{ data.tipoGmo.tipoGmo }}
                    </template>
                </Column>

                <Column header="% Declarada">
                    <template #body="{ data }">
                        {{ data.tipoGmo.perDeclarada }}
                    </template>
                </Column>

                <Column header="% Testada">
                    <template #body="{ data }">
                        {{ data.tipoGmo.perTestada }}
                    </template>
                </Column>

                <Column header="Valor Kit">
                    <template #body="{ data }">
                        {{ data.tipoGmo.vlKit }}
                    </template>
                </Column>

                <Column header="ID" style="width:25rem;">
                    <template #body="{ data }">
                        {{ data.tipoGmo.id }}
                    </template>
                </Column>
                <Column field="ativo" header="Situação" style="width:10rem;">
                    <template #body="{ data }">
                        {{ data.ativo ? 'Ativo' : 'Inativo' }}
                    </template>
                </Column>
                <Column v-if="integration.visible" header="Ações" style="width:5rem;">
                    <template #body="{ data }">
                        <Button
                            v-if="data.ativo"
                            icon="pi pi-check-circle"
                            class="p-button-rounded p-button-sucess flex-none"
                            title="Inativar"
                            :disabled="!grupo.logTransgenico"
                            @click="ativarOuInativar(data)"
                        />
                        <Button
                            v-if="!data.ativo"
                            icon="pi pi-ban"
                            class="p-button-rounded  p-button-danger flex-none"
                            title="Ativar"
                            :disabled="!grupo.logTransgenico"
                            @click="ativarOuInativar(data)"
                        />
                    </template>
                </Column>
            </DataTable>
        </Fieldset>
        

        <br />

        <div class="flex align-items-center">
            <Button v-if="!integration.visible"  label="Voltar" icon="pi pi-spinner" class="p-button p-component p-button-outlined mr-2"  @click="voltar()" />
            <Button v-if="integration.visible" label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info mr-2" @click="salvar()" :disabled="doubleClick"/>
            <Button v-if="integration.visible" label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger mr-2"  @click="voltar()" />
        </div>
    </div>
</template>

<script>
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import TipoProdutoService from '../../service/TipoProdutoService';
    import IntegracaoService from '../../service/IntegracaoService'
    import GmoService from '../../service/GmoService';
    export default {
        name: 'grupoProdutoForm',
        props: {
            id: {
                type: String,
                required: false
            },
        },
        data() {
            return {
                grupo: {},

                ativo: true,
                ativoOpcoes: [
                    {nome: 'Ativo', valor: true},
                    {nome: 'Inativo', valor: false}
                ],

                referencia: [
                    { codigo: "TIPO", descricao: "Tipo" },
                    { codigo: "NENHUM", descricao: "Nenhum" }
                ],

                tiposProdutosFiltrados: [],
                tipoProdutoSelecionado: null,

                grupoProdutoGmo: null,
                tipoGmoList: [],
                tipoGmoFiltradoList: [],
                tipoGmoSelecionado: null,

                codigoIsInvalid: false,
                descricaoIsInvalid: false,
                tipoProdutoIsInvalid: false,
                phIsInvalid: false,
                impurezaIsValid: false,
                kgScIsInvalid: false,
                fmCodigoIsInvalid: false,
                itSubCoopIsInvalid: false,
                entradaReIsInvalid : false,
                condChuvAvarSinalIsInvalid : false,
                condChuvAvarValorIsInvalid : false,
                
                integration: {},
                disable: false,
                doubleClick: false,
                disabledPermiteDesmembraTercCoop: true,
                disableCafe:null,
                
                entradaRe : {},

            }
        },

        
        created() {
                        
            this.carregarDados();

            this.getIntegrationOptons();
            
            this.carregarDropDownEntradaRe();
        },

        methods: {
            getIntegrationOptons(){
                const paginaAtual = "GRUPO_PRODUTO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                            this.disable = data.disable;
                        }
                    })
            },

            isCadastro() {
                this.ativo = this.ativoOpcoes.find(item => {
                    return item.valor == true;
                });
                return this.id == undefined || this.id == null || this.id == '';
            },

            carregarDados() {
                if(this.isCadastro()) return;

                GrupoProdutoService.getGrupoPorid(this.id)
                    .then(({ data }) => {
                        if(data) {
                            this.grupo = data;
                            this.tipoProdutoSelecionado = data.tipoProduto;
                            this.ativo = this.ativoOpcoes.find(item => {
                                return item.valor == data.ativo;
                            });
                            this.desmembramentoClick();
                            this.verificaTipoCafe();
                        }
                        else {
                            this.voltar();
                        }
                    })
                    .catch(error => {
                        this.voltar();
                    });
            },

            carregarDropDownEntradaRe(){
                GrupoProdutoService.getEntradaRe()
                    .then(({ data }) => {
                        if(data) {
                            this.entradaRe = data;
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            },

            voltar() {
                this.$router.push(`/grupo-produto`);
            },

            isCamposPreenchidos() {
                let isValid = true;
                
                this.codigoIsInvalid = false;
                this.descricaoIsInvalid = false;
                this.tipoProdutoIsInvalid = false;
                this.phIsInvalid = false;
                this.fmCodigoIsInvalid = false;
                this.itSubCoopIsInvalid = false;
                this.kgScIsInvalid = false;
                this.entradaReIsInvalid = false;
                this.condChuvAvarSinalIsInvalid = false;
                this.condChuvAvarValorIsInvalid = false;


                if(!this.grupo.fmCodigo) {
                    this.$toast.add({
                        severity:'warn',
                        detail:'O campo Código não foi preenchido.', 
                        life: 5000
                    });
                    this.codigoIsInvalid = true;
                    isValid = false;
                }

                if(!this.grupo.descricao) {
                    this.$toast.add({
                        severity:'warn',
                        detail:'O campo Descrição não foi preenchido.', 
                        life: 5000
                    });
                    this.descricaoIsInvalid = true;
                    isValid = false;
                }

                if(!this.tipoProdutoSelecionado) {
                    this.$toast.add({
                        severity:'warn',
                        detail:'O campo Tipo de Produto não foi selecionado.', 
                        life: 5000
                    });
                    this.tipoProdutoIsInvalid = true;
                    isValid = false;
                }

                if(this.grupo.phEntrada === true && this.grupo.phMinimo == undefined || this.grupo.phEntrada === true && this.grupo.phMinimo == null || this.grupo.phEntrada === true && this.grupo.phMinimo == "") {
                    this.$toast.add({
                        severity:'warn',
                        detail:'PH foi selecionado mas o campo PH Mínimo não foi preenchido.', 
                        life: 5000
                    });
                    this.phIsInvalid = true;
                    isValid = false;
                }
                

                if(this.grupo.tbm === true){
                    if( this.grupo.fmCodigoSub == undefined || this.grupo.fmCodigoSub == null || this.grupo.fmCodigoSub == "")
                    {
                        this.$toast.add({
                            severity:'warn',
                            detail:'TBM foi selecionado mas o campo Grupo do Produto do Sub Produto não foi informado.', 
                            life: 5000
                        });
                        
                        this.fmCodigoIsInvalid = true;
                        isValid = false;
                    }

                    if( this.grupo.itSubCoop == undefined || this.grupo.itSubCoop == null || this.grupo.itSubCoop == "")
                    {
                        this.$toast.add({
                            severity:'warn',
                            detail:'TBM selecionado mas o campo Produto do Sub Produto não foi informado.', 
                            life: 5000
                        });
                        this.itSubCoopIsInvalid = true;                        
                        isValid = false;
                    }

                }

                if(this.grupo.kgSc == undefined || this.grupo.kgSc == null || this.grupo.kgSc == ""){               
                    this.$toast.add({
                        severity:'warn',
                        detail:'O campo Kg/Saca não foi preenchido.', 
                        life: 5000
                    });
                    
                    this.kgScIsInvalid = true;
                    isValid = false;
                }

                if(this.grupo.entradaRe == undefined || this.grupo.entradaRe == null || this.grupo.entradaRe == ""){
                    this.$toast.add({
                            severity:'warn',
                            detail:'O campo Entrada Re não foi selecionado', 
                            life: 5000
                        });

                    this.entradaReIsInvalid = true;
                    isValid = false;
                }
                else{
                    
                    if(this.grupo.entradaRe === 'CONDICAO'){
                        //Se condição então precisa estar preenchido os campos de Sinal e Valor
                        if(this.grupo.condChuvAvarSinal == undefined || this.grupo.condChuvAvarSinal == null || this.grupo.condChuvAvarSinal == ""){               

                            this.$toast.add({
                                severity:'warn',
                                detail:'Quando a Entrada Re selecionada for igual a Condição, é necessário preencher o campo  Condição Chuv/Avar Sinal', 
                                life: 5000
                            });

                            this.condChuvAvarSinalIsInvalid = true;
                            isValid = false;
                        }

                        if(this.grupo.condChuvAvarValor == undefined || this.grupo.condChuvAvarValor == null || this.grupo.condChuvAvarValor == ""){               

                            this.$toast.add({
                                severity:'warn',
                                detail:'Quando a Entrada Re selecionada for igual a Condição, é necessário preencher o campo  Condição Chuv/Avar Valor', 
                                life: 5000
                            });

                            this.condChuvAvarValorIsInvalid = true;
                            isValid = false;
                        }
                    }
                }

                if(!this.validaCampoSinal()){

                    this.$toast.add({
                        severity:'warn',
                        detail:'O campo Condição Chuv/Avar Sinal não contém um sinal válido. Favor informar valores >, <, =, >= ou <=', 
                        life: 5000
                    });
                    this.condChuvAvarSinalIsInvalid = true;
                    isValid=false;
                }

                if(!isValid) {
                    this.$toast.add({
                        severity:'error',
                        detail:'Preencher os campos obrigatórios!', 
                        life: 3000
                    });
                    return;
                }                

                return isValid;
            },

            getDados() {
                const grupo = this.grupo;
                grupo['ativo'] = this.ativo?.valor || true;
                grupo['tipoProduto'] = this.tipoProdutoSelecionado;

                return grupo;
            },

            salvar() {
                

                if(!this.isCamposPreenchidos() && !this.doubleClick) return;
                

                this.doubleClick = true;

                const grupo = this.getDados();
                GrupoProdutoService.cadastrarOuAtualizar(grupo)
                    .then(response => {
                        if(this.id) {
                            this.$toast.add({
                                severity:'success',
                                detail:'O Grupo foi atualizado com sucesso!', 
                                life: 3000
                            });
                            
                            this.voltar();
                        }
                        else {
                            this.doubleClick = false;
                            this.$toast.add({
                                severity:'warn',
                                detail: response.message,
                                life: 3000
                            });
                            this.voltar();
                        }
                    })
                    .catch(({ response }) => {
                        this.doubleClick = false;
                        this.$toast.add({
                            severity: "warn",
                            detail: response.data.message, 
                            life: 5000
                        });

                        for(let message of response.data.exception.split('\n')) {
                            console.log(message);
                        }
                    });
            },

            validaCampoSinal(){
                
                let isValido = false;

                //if(this.grupo.entradaRe == undefined || this.grupo.entradaRe == null || this.grupo.entradaRe == "" || this.grupo.entradaRe === 'PERMITE' || this.grupo.entradaRe === 'NAO_PERMITE'){
                if(this.grupo.entradaRe !== 'CONDICAO'){
                    return true;    
                }

                
                let sinalDigitado = this.grupo.condChuvAvarSinal;
                const sinaisPossiveis = [ ">", "<", "=", ">=", "<=" ];

                sinaisPossiveis.forEach(function(sinal) {
                    
                    if(sinalDigitado === sinal){
                        isValido = true;
                    }

                });

                return isValido;
            },

            limparCampos() {
                this.grupo = {};

                this.tipoProdutoSelecionado = null;
                this.tipoGmoSelecionado = null;

                this.dialog = false;
                this.cancelarDialog = false;
                this.salvarDialog = false;
            },

            buscarTiposProdutos(event) {
                const nome = !event.query.trim().length ? null : event.query;
                TipoProdutoService.buscarTipoProdutoPorNome(nome)
                    .then(({ data }) => {
                        if(data) {
                            this.tiposProdutosFiltrados = data;
                            
                            this.tiposProdutosFiltrados.sort((a,b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0))


                        }
                    })
                    .catch(error => {
                        this.tiposProdutosFiltrados = [];
                    });
            },

            buscarTipoGmo(event) {
                const tipoGmo = !event.query.trim().length ? undefined : event.query;
                GmoService.pesquisarPorTipoGmo(tipoGmo)
                    .then(({ data }) => {
                        if(data) {
                            this.tipoGmoFiltradoList = [...data];
                        }
                    })
                    .catch(error => {
                        this.tipoGmoFiltradoList = [];
                    });
            },

            isTipoGmoVinculado() {
                if(!this.grupo.listGrupoProdutoGmo) return false;

                const tipoGmo = this.grupo.listGrupoProdutoGmo.find(item => {
                    return item.tipoGmo.id === this.tipoGmoSelecionado.id;
                });

                return !!tipoGmo;
            },

            vincularGmo() {
                if(!this.tipoGmoSelecionado) {
                    this.$toast.add({
                        severity:'error',
                        detail:'Por favor, selecione um Tipo GMO para vincular!', 
                        life: 3000
                    });
                    return;
                }

                if(this.isTipoGmoVinculado()) {
                    this.$toast.add({
                        severity:'error',
                        detail:'O Tipo GMO já está vinculado!', 
                        life: 3000
                    });
                    return;
                }

                if(!this.grupo.listGrupoProdutoGmo) {
                    this.grupo.listGrupoProdutoGmo = [];
                }

                const grupoProdutoGmo = {
                    tipoGmo: this.tipoGmoSelecionado,
                    ativo: true
                }

                this.grupo.listGrupoProdutoGmo.push(grupoProdutoGmo);
                this.tipoGmoSelecionado = null;
            },

            ativarOuInativar(grupoProdutoGmo) {
                if(!grupoProdutoGmo) return;

                const id = grupoProdutoGmo.tipoGmo.id;
                this.grupo.listGrupoProdutoGmo = this.grupo.listGrupoProdutoGmo.map(item => {
                    if(item.tipoGmo.id === id) {
                        item.ativo = !item.ativo;
                    }
                    return item;
                });
            },
            
            // inativarTipoGmo() {
            //     if(!this.grupo.logTransgenico && !this.id) {
            //         this.grupo.listGrupoProdutoGmo = [];
            //     }
            //     else if(!this.grupo.logTransgenico) {
            //         this.grupo.listGrupoProdutoGmo = this.grupo.listGrupoProdutoGmo.map(item => {
            //             item.ativo = false;
            //             return item;
            //         });
            //     }
            // },

            isTipoGmo() {
                return this.grupo.logTransgenico;
            },

            phEntradaClick(){
                this.grupo.phMinimo = null;
                this.grupo.percImpureza = null;
            },

            desmembramentoClick(){
                
                
                console.log("Desmembramento: ", this.grupo.desmembramento);


                //console.log('Grupo.desmembramento: ', this.grupo.desmembramento);
                //console.log('Grupo.cata: ', this.grupo.cata);

                if(this.grupo.desmembramento){
                    this.disabledPermiteDesmembraTercCoop = false;
                }
                else{
                    this.disabledPermiteDesmembraTercCoop = true;
                    this.grupo.permiteDesmembraTercCoop = false;
                }
                    
            },

            verificaTipoCafe(){
                
                let tipoSelecionado = "";
                if(this.tipoProdutoSelecionado != null){
                    tipoSelecionado = this.tipoProdutoSelecionado.nome;
                }

                if(tipoSelecionado === "CAFÉ" || 
                    tipoSelecionado === 'CAFE' || 
                    tipoSelecionado ==='Café' || 
                    tipoSelecionado === 'Cafe' || 
                    tipoSelecionado === 'cafe' || 
                    tipoSelecionado === 'café' ){
                    this.disableCafe = false;                    
                }
                else{
                    this.disableCafe = true;
                    this.grupo.cafeCoco = false;
                    this.grupo.cafeBeneficiado = false;                    
                }
                
            },

            impurezaClick(){
                this.grupo.percImpureza = null;
            }

        },
    }
</script>

<style>
    .grupo-produto .p-fieldset-content {
        padding: 0;
    }
</style>
