<template>
    <Dialog
        v-model:visible="visivel"
        :style="{width: '750px', margin: '10%'}"
        :maximizable="false"
        :modal="true"
        @hide="fechar"
        @show="carregarDados"
    >
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-pencil mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Informar dados fiscais da RE: {{ dados == null ? "" : dados.nrRe }}</h3>
            </div>
        </template>

        <Message severity="warn" v-if="alertaCamposObrigatorios" @close="alertaCamposObrigatorios = false">{{ alertaMensagem }}</Message>

        <div class="grid p-fluid formgrid">

            <div class="col-4 sm:col-4 md:col-4 lg:col-3 xl:col-3">
                <div class="field">
                    <label for="pjNroNota"><strong>Nr. Nota Fiscal</strong></label>
                    <InputText class="w-full" v-model="dadosFiscais.pjNroNota" :maxlength="7" @keyup="aceitarApenasNumeros"  @change="preencherCampoNfe" />
                </div>
            </div>

            <div class="col-4 sm:col-3 md:col-3 lg:col-1 xl:col-1">
                <div class="field">
                    <label for="pjSerie"><strong>Série</strong></label>
                    <InputText class="w-full uppercase" v-model="dadosFiscais.pjSerie" :maxlength="3" @keyup="removerCaracteresEspeciais" @change="preencherCampoSerie" />
                </div>
            </div>

            <div class="col-4 sm:col-3 md:col-3 lg:col-2 xl:col-2">
                <div class="field">
                    <label for="pjDtEmissao"><strong>Data Emissão</strong></label>
                    <Calendar class="w-full" v-model="dadosFiscais.pjDtEmissao" dateFormat="dd/mm/yy" :maxDate="new Date()" @hide="preencherCampoAamm" />
                </div>
            </div> 

            <div class="col-4 sm:col-3 md:col-3 lg:col-2 xl:col-2">
                <div class="field">
                    <label for="pjNatOperacao"><strong>Nat. Operação</strong></label>
                    <InputText class="w-full" v-model="dadosFiscais.pjNatOper" :disabled="true" />
                </div>
            </div>

            <div class="col-4 sm:col-3 md:col-3 lg:col-2 xl:col-2">
                <div class="field">
                    <label for="pjVlTotNota"><strong>Valor Total</strong></label>
                    <InputNumber class="w-full" v-model="dadosFiscais.pjVlTotNota" mode="decimal" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="999999999" />
                </div>
            </div>

            <div class="col-4 sm:col-3 md:col-3 lg:col-2 xl:col-2">
                <div class="field">
                    <label for="pjQtTotNota"><strong>Qtd. Total</strong></label>
                    <InputNumber class="w-full" v-model="dadosFiscais.pjQtTotNota" mode="decimal" locale="pt-BR" :minFractionDigits="0" :maxFractionDigits="2" :min="0" :max="999999999" />
                </div>
            </div>

            <Fieldset legend="Chave de acesso" :toggleable="false">
                <div class="grid p-fluid formgrid">
                    <div class="col-6 sm:col-2 md:col-2 lg:col-2 xl:col-2">
                        <div class="field">
                            <label><strong>UF</strong></label>
                            <InputMask class="w-full" v-model="dadosFiscais.uf" mask="99" :disabled="true" />
                        </div>
                    </div>  
                        
                    <div class="col-6 sm:col-2 md:col-2 lg:col-2 xl:col-2">
                        <div class="field">
                            <label><strong>AAMM</strong></label>
                            <InputMask class="w-full" v-model="dadosFiscais.aamm" mask="9999" :disabled="true" />
                        </div>
                    </div> 

                    <div class="col-6 sm:col-3 md:col-4 lg:col-4 xl:col-4">
                        <div class="field">
                            <label><strong>CNPJ</strong></label>
                            <InputText class="w-full" v-model="dadosFiscais.cnpj" :disabled="true" />
                        </div>
                    </div> 

                    <div class="col-6 sm:col-2 md:col-2 lg:col-2 xl:col-2">
                        <div class="field">
                            <label><strong>MÓD</strong></label>
                            <InputText class="w-full" v-model="dadosFiscais.mod" :disabled="true" />
                        </div>
                    </div> 

                    <div class="col-2 sm:col-2 md:col-2 lg:col-2 xl:col-2">
                        <div class="field">
                            <label><strong>SÉRIE</strong></label>
                            <InputText class="w-full" v-model="dadosFiscais.serie" :disabled="true" />
                        </div>
                    </div> 

                    <div class="col-6 sm:col-3 md:col-3 lg:col-3 xl:col-3">
                        <div class="field">
                            <label><strong>NF-e</strong></label>
                            <InputText class="w-full" v-model="dadosFiscais.nfe" :disabled="true" />
                        </div>
                    </div> 

                    <div class="col-2 sm:col-2 md:col-2 lg:col-2 xl:col-2">
                        <div class="field">
                            <label><strong>F.NF-e</strong></label>
                            <InputMask class="w-full" v-model="dadosFiscais.fnfe" mask="9" />
                        </div>
                    </div> 

                    <div class="col-6 sm:col-3 md:col-3 lg:col-3 xl:col-3">
                        <div class="field">
                            <label><strong>CÓD</strong></label>
                            <InputMask class="w-full" v-model="dadosFiscais.cod" mask="99999999" />
                        </div>
                    </div> 

                    <div class="col-2 sm:col-2 md:col-2 lg:col-2 xl:col-2">
                        <div class="field">
                            <label><strong>DV</strong></label>
                            <InputMask class="w-full" v-model="dadosFiscais.dv" mask="9" />
                        </div>
                    </div>
                </div>
            </Fieldset>
        </div>

        <template #footer>
            <div class="mb-5 center">
                <Button
                    icon="pi pi-save"
                    label="Salvar"
                    :disabled="doubleClick"
                    class="p-button-info ml-1"
                    @click="salvar()"/>

                <Button
                    icon="pi pi-times"
                    label="Cancelar"
                    class="p-button-danger"
                    @click="fechar()"/>
            </div>
        </template>
    </Dialog>
</template>

<script>
    import NfRemessaService from '../../service/NfRemessaService';

    export default {
        props: {
            visivel: {
                type: Boolean,
                required: true
            },
            dados: {
                type: Object,
                required: false
            }
        },

        data() {
            return {
                dadosFiscais: {},
                doubleClick: false,
                
                alertaMensagem: "",
                alertaCamposObrigatorios: false
            }
        },
    
        created() {
            this.limparCampos();
        },
        
        updated() {
            this.limparCampos();
        },

        methods: {
            limparCampos() {
                this.doubleClick = false;
                this.dadosFiscais = {};
                
            },

            carregarDados() {
                if(!this.dados) return;
                NfRemessaService.buscarChaveAcesso(this.dados.idRecEntrega)
                    .then(({ data }) => {
                        this.dadosFiscais = data;
                    })
                    .catch(error => {
                        const toast = {
                            severity:'error', 
                            summary: 'Falha ao buscar dados da chave de acesso',
                            detail: error,
                            life: 15000
                        }

                        if(!!error && !!error.response && !!error.response.data) {
                            const { message } = error.response.data;
                            toast.detail = message;
                        }
                        
                        this.$toast.add(toast);
                    });
            },

            aceitarApenasNumeros(event) {
                if(!event || !event.target || !event.target.value) return;
                event.target.value = event.target.value.replace(/[^0-9]/g, "");
            },

            removerCaracteresEspeciais(event) {
                if(!event || !event.target || !event.target.value) return;
                event.target.value = event.target.value.replace(/[^a-zA-Z0-9]/g, "");
            },

            fechar() {
                this.limparCampos();
                this.$emit("fechar");
            },

            validarCamposNf() {
                const campos = [];
                if(!this.dadosFiscais.pjNroNota) {
                    campos.push("Nr. Nota Fiscal");
                }

                if(!this.dadosFiscais.pjSerie) {
                    campos.push("Série");
                }

                if(!this.dadosFiscais.pjDtEmissao) {
                    campos.push("Data Emissão");
                }

                if(!this.dadosFiscais.pjVlTotNota) {
                    campos.push("Valor Total");
                }

                if(!this.dadosFiscais.pjQtTotNota) {
                    campos.push("Qtd. Total");
                }

                if(!this.dadosFiscais.fnfe) {
                    campos.push("F.NF-e");
                }

                if(!this.dadosFiscais.cod) {
                    campos.push("CÓD");
                }

                if(!this.dadosFiscais.dv) {
                    campos.push("DV");
                }

                if(campos.length > 0) {
                    this.doubleClick = false;
                    this.alertaCamposObrigatorios = true;

                    const mensagem = campos.join('", "');
                    if(campos.length > 1) {
                        this.alertaMensagem = "Os campos \"" + mensagem + "\" são obrigatórios.";
                    }
                    else {
                        this.alertaMensagem = "O campo \"" + mensagem + "\" é obrigatório.";
                    }

                    return false;
                }

                return true;
            },

            salvar() {
                this.doubleClick = true;

                if(!this.validarCamposNf()) return;

                let chaveAcesso = "";
                chaveAcesso += !!this.dadosFiscais.uf    ? this.dadosFiscais.uf    : "  ";
                chaveAcesso += !!this.dadosFiscais.aamm  ? this.dadosFiscais.aamm  : "    ";
                chaveAcesso += !!this.dadosFiscais.cnpj  ? this.dadosFiscais.cnpj  : "              ";
                chaveAcesso += !!this.dadosFiscais.mod   ? this.dadosFiscais.mod   : "  ";
                chaveAcesso += !!this.dadosFiscais.serie ? this.dadosFiscais.serie : "   ";
                chaveAcesso += !!this.dadosFiscais.nfe   ? this.dadosFiscais.nfe   : "         ";
                chaveAcesso += !!this.dadosFiscais.fnfe  ? this.dadosFiscais.fnfe  : " ";
                chaveAcesso += !!this.dadosFiscais.cod   ? this.dadosFiscais.cod   : "        ";
                chaveAcesso += !!this.dadosFiscais.dv    ? this.dadosFiscais.dv    : " ";

                this.dadosFiscais.pjChaveAcesso = chaveAcesso;

                NfRemessaService.atualizarDadosFiscais(this.dados.id, this.dadosFiscais)
                    .then(({ data }) => {
                        this.doubleClick = false;

                        if(!!data) {
                            this.$toast.add({
                                severity:'success', 
                                summary: 'Atualização RE ' + this.dados.nrRe,
                                detail: 'Dados fiscais atualizados.',
                                life: 15000
                            });
                        }
                        else {
                            this.$toast.add({
                                severity:'error', 
                                summary: 'Atualização RE ' + this.dados.nrRe,
                                detail: 'Falha ao atualizar dados fiscais.',
                                life: 15000
                            });
                        }

                        this.fechar();
                    })
                    .catch(error => {
                        if(!!error && !!error.response && !!error.response.data) {
                            const { message } = error.response.data;
                            this.$toast.add({
                                severity:'error', 
                                summary: 'Atualização RE ' + this.dados.nrRe,
                                detail: message,
                                life: 15000
                            });
                        }
                        else {
                            this.$toast.add({
                                severity:'error', 
                                summary: 'Atualização RE ' + this.dados.nrRe,
                                detail: 'Falha ao atualizar dados fiscais.',
                                life: 15000
                            });
                        }
                        
                        this.doubleClick = false;
                        this.fechar();
                    });
            },

            preencherCampoAamm() {
                if(this.dadosFiscais.pjDtEmissao == null || this.dadosFiscais.pjDtEmissao == undefined) return;

                const emissao = this.dadosFiscais.pjDtEmissao;
                let ano = emissao.getFullYear() + "";
                let mes = emissao.getMonth() + 1;
                
                if(mes < 10) {
                    mes = "0" + mes;
                }

                this.dadosFiscais.aamm = ano.substring(2, 4) + mes;
            },

            adicionarZeros(valor, quantidadeTotal) {
                let valorComZeros = String(valor);
                let quantidade = valorComZeros.length;
                    
                while(quantidade < quantidadeTotal) {
                    valorComZeros = "0" + valorComZeros;
                    quantidade++;
                }
                
                return valorComZeros;
            },

            preencherCampoNfe() {
                if(this.dadosFiscais.pjNroNota == null || this.dadosFiscais.pjNroNota == undefined) return;
                this.dadosFiscais.nfe = this.adicionarZeros(this.dadosFiscais.pjNroNota, 9);
            },

            preencherCampoSerie() {
                if(this.dadosFiscais.pjSerie == null || this.dadosFiscais.pjSerie == undefined) return;
                this.dadosFiscais.serie = this.adicionarZeros(this.dadosFiscais.pjSerie, 3);
            }
        }
    }
</script>