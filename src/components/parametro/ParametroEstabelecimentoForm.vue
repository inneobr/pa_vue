<template>
  <div class="card">
    <div class="flex justify-content-between">
        <div class="flex align-items-center">
            <i class="pi pi-cog mr-1" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;">Parâmetros de Estabelecimento</h3>
        </div>
    </div>
    <hr />

    <div class="grid col-12">
        <div class="col-12 lg:col-8">
            <label for="estabelecimento" class="ml-2">Estabelecimento <span class="ml-1" style="color:red">*</span></label>
            <div class="justify-content-between grid col-12 lg:col-8">
                <AutoComplete
                    class="col-6"
                    field="codNome"
                    :dropdown="true"
                    id="estabelecimento"
                    placeholder="Selecionar"
                    :forceSelection="true"
                    v-model="estabelecimentoSelecionado"
                    :suggestions="estabelecimentoOptions"
                    @complete="getEstabelecimentos($event)"
                    :class="{'p-invalid': estabelecimentoIsInvalid}"
                    :disabled="id"/>

            </div>                
         </div>
    </div>

        
        <Fieldset legend="Parâmetros" :toggleable="false" class="col-12 lg:col-8">
            <div class="grid">            
                <div class="field-checkbox col-6 lg:col-3">
                    <Checkbox id="logRecebeTransgenico" v-model="parametros.logRecebeTransgenico" :binary="true" />
                    <label for="logRecebeTransgenico">Recebe Trangênico</label>
                </div>

                <div class="field-checkbox col-6 lg:col-3">
                    <Checkbox id="entSafraAnt" v-model="parametros.entSafraAnt" :binary="true" />
                    <label for="entSafraAnt">Libera Entrada Safra Anterior</label>
                </div>

                <div class="field-checkbox col-6 lg:col-3">
                    <Checkbox id="demoVlAgregados" v-model="parametros.demoVlAgregados" :binary="true" />
                    <label for="demoVlAgregados">Dem. Val. Agregados Extrato</label>
                </div>

                <div class="field-checkbox col-6 lg:col-3">
                    <Checkbox id="logMaqCafe" v-model="parametros.logMaqCafe" :binary="true" />
                    <label for="logMaqCafe">Maquina Café</label>
                </div>
                
                <div class="field-checkbox col-6 lg:col-3">
                    <Checkbox id="logEntradaSemTik" v-model="parametros.logEntradaSemTik" :binary="true" />
                    <label for="logEntradaSemTik">Entrada Sem Ticket</label>
                </div>

                <div class="field-checkbox col-6 lg:col-3">
                    <Checkbox id="integraRe" v-model="parametros.integraRe" :binary="true" />
                    <label for="integraRe">Integra Re</label>
                </div>

                <div class="field-checkbox col-6 lg:col-3">
                    <Checkbox id="logSilo" v-model="parametros.logSilo" :binary="true" />
                    <label for="logSilo">Silo</label>
                </div>

                <div class="field-checkbox col-6 lg:col-3">
                    <Checkbox id="obrigaNfProdutor" v-model="parametros.obrigaNfProdutor" :binary="true" />
                    <label for="obrigaNfProdutor">Obriga NF produtor</label>
                </div>

                <div class="field-checkbox col-6 lg:col-3">
                    <Checkbox id="permitirEntradaCooperativa" v-model="parametros.permitirEntradaCooperativa" :binary="true" />
                    <label for="permitirEntradaCooperativa">Permitir entrada cooperativa</label>
                </div>

                <div class="field-checkbox col-6 lg:col-3">
                    <Checkbox id="logUbs" v-model="parametros.logUbs" :binary="true" />
                    <label for="logUbs">Ubs</label>
                </div>

                <div class="field-checkbox col-6 lg:col-3">
                    <Checkbox id="geraReGenesis" v-model="parametros.geraReGenesis" :binary="true" />
                    <label for="geraReGenesis">Gera RE Gênesis</label>
                </div>
            </div>
        </Fieldset>

        <Fieldset legend="Valores" :toggleable="false" class="col-12 lg:col-8">
            <div class="grid ">
                <div class="col-6 lg:col-3">
                    <label for="codEmitente"><strong>Cód. Cliente</strong></label>
                    <InputText :class="['w-full', 'mt-1', { 'p-invalid': validCodigoEmitente }]" id="codEmitente" v-model="parametros.codEmitente"/>                        
                </div>

                <div class="col-6 lg:col-3">
                    <label for="codImovel"><strong>Codigo Imóvel</strong></label>
                    <InputText class="w-full mt-1" id="codImovel" v-model="parametros.codImovel"/>                       
                </div>

                <div class="col-6 lg:col-3">
                    <label for="estado"><strong>UF Estabelecimento</strong></label>
                    <InputText :class="['w-full', 'mt-1']"  id="estado" v-model="parametros.estado"/>
                </div>

                <div class="col-6 lg:col-3">
                    <label for="sigla"><strong>Sigla</strong></label>
                    <InputText :class="['w-full', 'mt-1']" id="sigla" v-model="parametros.sigla"/>
                </div>

                <div class="col-6 lg:col-4">
                    <label for="provador"><strong>Provador Café</strong></label>
                    <InputText class="w-full mt-1" id="provador" v-model="parametros.provador" :disabled="!parametros.logMaqCafe"/>
                </div>

                <div class="col-6 lg:col-4">
                    <label for="nrUltTransf"><strong>Num. Ult. Transferência</strong></label>
                    <InputNumber  mode="decimal"  :minFractionDigits="0" :maxFractionDigits="5" 
                        v-model="parametros.nrUltTransf"
                        @keypress="isNumber($event)" :disabled="true"
                        id="nrUltTransf" 
                        class="w-full mt-1"/>
                </div>

                <div class="col-6 lg:col-4">
                    <label for="prazoCancNf"><strong>Prazo Cancelamento NF</strong></label>
                    <InputNumber  :class="['w-full', 'mt-1', {'p-invalid': prazovalid}]" 
                        v-model="parametros.prazoCancNf"                       
                        :minFractionDigits="0" :maxFractionDigits="5"
                        id="prazoCancNf"
                        @keypress="isNumber($event)" 
                        mode="decimal"/>
                </div> 

                <div class="align-items-center col-6 lg:col-4">
                    <label><strong>Situação</strong></label>
                    <div class="grid" style="padding: 10px 0px 0px 0px;">
                        <div class="field-checkbox col-6  lg:col-6">
                            <RadioButton name ="situacao" v-model="parametros.situacao" value ="LIBERADO_TOTAL" />
                            <label for="situacao">Liberado</label>
                        </div>

                        <div class="field-checkbox col-6 lg:col-6">
                            <RadioButton name ="situacao" v-model="parametros.situacao" value ="BLOQUEADO" />
                            <label for="situacao">Bloqueado Total</label>
                        </div>
                    </div>
                </div>

                <div class="col-6 lg:col-4">
                    <label for="logDesfazerFixacao"><strong>Desfazer a Fixação</strong></label>                            
                    <Dropdown
                        placeholder="Selecione"
                        id="logDesfazerFixacao"
                        class="w-full mt-1"
                        optionLabel="name"
                        v-model="cancelarFixacao"
                        :options="cancelarFixacaoOptions"/>
                </div> 

                <div class="col-6 lg:col-4">
                    <label for="dtMovtoAberto"><strong>Data Movimento Aberto</strong></label>
                    <InputText class="w-full mt-1 text-center" id="dtMovtoAberto" v-model="dtMovtoAberto" :disabled="true" placeholder="00/00/0000"/>                        
                </div>
                
                <div class="col-12 lg:col-12" v-if="cancelarFixacao != null && cancelarFixacao.value">
                    <label for="desMotCancFixacao"><strong>Motivo do cancelamento da nota de fixação<span style="color: red;">&nbsp;*</span></strong></label>
                    <Textarea class="col-12 lg:col-12 mt-2" id="desMotCancFixacao" v-model="parametros.desMotCancFixacao" rows="4" placeholder="Nota cancelada nos termos do ART. 11, I, ANEXO III, do RICMS-PR, decreto Nro. 7.871, de 29.9.2017"/>
                </div>
            </div>
        </Fieldset>

        <Fieldset legend="Horários de agendamento" :toggleable="false" class="col-12 lg:col-8">
            <div class="grid ">
                <div class="col-6 lg:col-3">
                    <label><strong>Manhã (Início)</strong></label>
                    <InputMask class="w-full mt-1" mask="99:99" placeholder="__:__" v-model="parametros.hrAgendaManhaIni"/>                        
                </div>

                <div class="col-6 lg:col-3">
                    <label><strong>Manhã (Fim)</strong></label>
                    <InputMask class="w-full mt-1" mask="99:99" placeholder="__:__" v-model="parametros.hrAgendaManhaFim"/>                       
                </div>

                <div class="col-6 lg:col-3">
                    <label><strong>Tarde (Início)</strong></label>
                    <InputMask class="w-full mt-1" mask="99:99" placeholder="__:__" v-model="parametros.hrAgendaTardeIni"/>
                </div>

                <div class="col-6 lg:col-3">
                    <label><strong>Tarde (Fim)</strong></label>
                    <InputMask class="w-full mt-1" mask="99:99" placeholder="__:__" v-model="parametros.hrAgendaTardeFim"/>
                </div>
            </div>
        </Fieldset>

        <Fieldset legend="Fundo de Assistência Mútua" :toggleable="false" class="col-12 lg:col-8">
                <div class="grid ">
                    <div class="field-checkbox col-6  lg:col-3">
                        <Checkbox id="famCoop" v-model="parametros.famCoop" :binary="true"/>
                        <label for="famCoop">FAM. Cooperado</label>
                    </div>

                    <div class="field-checkbox col-6 lg:col-3">
                        <Checkbox id="famTerc" v-model="parametros.famTerc" :binary="true"/>
                        <label for="famTerc">FAM. Terceiro</label>
                    </div>

                    <div class="field-checkbox col-6 lg:col-2">
                        <Checkbox id="famPc" v-model="parametros.famPc" :binary="true"/>
                        <label for="famPc">FAM. PC</label>
                    </div>

                    <div class="col-6 lg:col-4">
                        <div class="grid align-items-center">
                            <label class="col-3 label">Taxa:</label>
                            <div class="col-9 campo">
                                <InputNumber  mode="decimal" class="w-full" id="txFam"                                                                      
                                    :minFractionDigits="0" :maxFractionDigits="5" 
                                    v-model="parametros.txFam"                                    
                                    @keypress="isNumber($event)" 
                                    :disabled="isFamilia()"/>
                            </div>
                        </div>
                    </div>
                </div>
        </Fieldset>

        <Fieldset legend="Sementes" :toggleable="false" class="col-12 lg:col-8">
            <div class="justify-content-between align-items-center grid">
                <div class="col-3">
                    <div class="col-12">
                        <label class="col-12" for="nrcredencial"><strong>Nr. Credencial</strong></label>
                        <InputText id="nrcredencial" class="col-12 mt-1" v-model="parametros.credencial"/>   
                    </div>

                    <div class="col-12">
                        <label class="col-12" for="nrUltBcqs"><strong>Último BCQS</strong></label>
                        <InputText id="nrUltBcqs" class="col-12 mt-1" v-model="parametros.nrUltBcqs"/>   
                    </div>
                </div>

                <Fieldset legend="Nro RENASEN" :toggleable="false" class="col-8 p-4">
                    <div class="flex grid justify-content-between align-items-center">
                        <label class="col-6 xl:col-2" for="renasem"><strong>Produtor Semente</strong></label>
                        <InputText class="col-6 xl:col-4" id="renasem" v-model="parametros.renasem"/>  

                        <label class="col-6 xl:col-2" for="renasemComer"><strong>Comerciante</strong></label>
                        <InputText class="col-6 xl:col-4" id="renasemComer" v-model="parametros.renasemComer"/>  
                    </div>
                </Fieldset>               
            </div>
        </Fieldset>
        <hr />
        <div class="flex">
            <Button
                icon="pi pi-save"
                label="Salvar"
                :disabled="doubleClick"
                class="p-button-info mr-2"
                @click="salvarNovo()"/> 

            <Button
                icon="pi pi-times"
                label="Cancelar"
                class="p-button-danger"
                @click="voltar()"/>

            
        </div>
    </div>
  <Toast position="top-right" />
</template>

<script>
    import ParametroEstabelecimentoService from '../../service/ParametroEstabelecimentoService';
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import Formatacao from '../../utilities/Formatacao';
    export default {
        name: 'Parâmetros de Estabelecimentos',
        props: {
            id: {
                type: String,
                required: true
            }
        },

        data() {
            return {
                parametros: {},
                dtMovtoAberto: null,
                estabelecimentoOptions: null,
                
                cancelarFixacao: {},
                cancelarFixacaoOptions: [
                    {name: 'Cancelado', value: true},
                    {name: 'Devolvendo', value: false}
                ], 
                doubleClick: false,
                estabelecimentoIsInvalid: false,
                estabelecimentoSelecionado: null
            }
        },

        created(){
            this.getParametros();
        },

        methods: {
            getParametros() {
                if(this.id == null) return;
                ParametroEstabelecimentoService.getParametrosPorid(this.id)
                    .then(({ data }) => {
                        if(data) {                        
                            this.parametros = data;
                            this.getEstabelecimento(data.codigo)
                            this.dtMovtoAberto = this.formatDate(data.dtMovtoAberto, 'DD/MM/YYYY');

                            this.cancelarFixacao = this.cancelarFixacaoOptions.find(item => {
                                return item.value === data.logDesfazerFixacao;
                            });
                        }
                    });
                },

            getEstabelecimentos(event) {              
                const dados = !event.query.trim().length ? '' : event.query;
                EstabelecimentoService.getEstabelecimentosPorCodigoOuDescricao(dados)
                    .then(({ data }) => {
                        if(data) {
                            this.estabelecimentoOptions = [...data];
                        }
                    });
            },

            getEstabelecimento(codigo){
                EstabelecimentoService.getEstabelecimentosPorCodigo(codigo)
                    .then(({ data }) => {
                        if(data) {
                            this.estabelecimentoSelecionado = data;
                        }
                    });
            },            

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            validarCampos(){
                let isValid = true;

                if(!this.estabelecimentoSelecionado){
                    this.estabelecimentoIsInvalid = true;
                    isValid = false;
                }

                if(!isValid) {
                    this.$toast.add({
                        severity:'warn', 
                        summary: 'Alerta!', 
                        detail:'Favor preencher todos os campos obrigatórios!', 
                        life: 5000
                    });
                }

                return isValid;
            },

            salvarNovo(){
                if(!this.validarCampos() && !this.doubleClick) return;
                this.doubleClick = true;

                if(!!this.estabelecimentoSelecionado && !!this.estabelecimentoSelecionado.codigo) {
                    this.parametros.codigo = this.estabelecimentoSelecionado.codigo;
                }
                
                if(this.id == null){
                    this.parametros['ativo'] = true;
                    this.parametros['logDesfazerFixacao'] = this.cancelarFixacao != null ? this.cancelarFixacao.value : null;

                    if(this.parametros.desMotCancFixacao == undefined){
                        this.parametros.desMotCancFixacao = "Nota cancelada nos termos do ART. 11, I, ANEXO III, do RICMS-PR, decreto Nro. 7.871, de 29.9.2017";
                    }

                    console.log(JSON.stringify(this.parametros));
                    ParametroEstabelecimentoService.salvarParametros(this.parametros)
                        .then(response => {
                            this.$toast.add({
                                severity:'success', 
                                detail:'O Parametro salvo com sucesso!', 
                                life: 5000
                            });
                            this.voltar();
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
                }else{
                    this.parametros['ativo'] = true;
                    this.parametros['logDesfazerFixacao'] = this.cancelarFixacao.value;                  
                    console.log(JSON.stringify(this.parametros));
                    ParametroEstabelecimentoService.updateParametros(this.parametros)
                        .then(response => {
                            this.$toast.add({
                                severity:'success', 
                                detail:'O Parametro salvo com sucesso!', 
                                life: 5000
                            });
                            this.voltar();
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            console.error(error);
                            this.$toast.add({
                                severity:'error', 
                                detail:'Parametro Estabelecimento não foi salvo!',
                                life: 5000
                            });
                        });
                }
            },


            voltar() {
                this.$router.push(`/parametros-estabelecimento`);
            },   

            isFamilia(){
                if(this.parametros.famCoop){
                    return false;
                }
                if(this.parametros.famTerc){
                    return false;
                }
                if(this.parametros.famPc){
                    return false;
                }   
                return true;            
            },

            isNumber: function(evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                    evt.preventDefault();;
                } else {
                    return true;
                }
            }
        }
    }
</script>