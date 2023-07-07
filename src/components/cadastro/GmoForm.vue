<template>
    <div class="card">
        <Toast />

        <div class="flex align-items-center">
            <i class="pi pi-list mr-2" style="font-size: 2rem;"></i>
            <h3 style="margin:0;">{{ isCadastro() ? 'Cadastrar' : 'Editar' }} Tipo GMO</h3>
        </div>

        <hr />

        <div class="grid col-12 sm:col-7">
            <div class="col-12">
                <label for="nome"><strong>Nome<span style="color:red;">&nbsp;*</span></strong></label>
                <InputText 
                    class="w-full mt-1"
                    :class="{'p-invalid': nomeIsInvalid}"
                    id="nome"
                    v-model="gmo.tipoGmo"
                    :disabled="!isCadastro() || disable"
                />
            </div>

            

                <div class="col-4">
                    <label for="declarada"><strong>% Declarada<span style="color:red;">&nbsp;*</span></strong></label>
                    <InputNumber 
                        class="w-full mt-1" 
                        :class="{'p-invalid': nomeIsInvalid}" 
                        id="declarada" 
                        v-model="gmo.perDeclarada"
                        mode="decimal"
                        :disabled="disable"
                        :minFractionDigits="2" :maxFractionDigits="5"
                        :max="999999999"
                        @keypress="isNumber($event)"
                    />
                </div>

                <div class="col-4">
                    <label for="testada"><strong>% Testada<span style="color:red;">&nbsp;*</span></strong></label>
                    <InputNumber
                        class="w-full mt-1"
                        :class="{'p-invalid': nomeIsInvalid}"
                        id="testada"
                        v-model="gmo.perTestada"
                        mode="decimal"
                        :disabled="disable"
                        :minFractionDigits="2" :maxFractionDigits="5"
                        :max="999999999"
                        @keypress="isNumber($event)"
                    />
                </div>

                <div class="col-4">
                    <label for="kit"><strong>Valor Kit<span style="color:red;">&nbsp;*</span></strong></label>
                    <InputNumber
                        class="w-full mt-1"
                        :class="{'p-invalid': nomeIsInvalid}"
                        :disabled="disable"
                        id="kit"
                        v-model="gmo.vlKit"
                        mode="decimal"
                        :minFractionDigits="2" :maxFractionDigits="5"
                        :max="999999999"
                        @keypress="isNumber($event)"
                    />
                </div>

            <div class="col-12 sm:col-12 lg:col-12">
                <label for="obsRomaneio"><strong>Observação Romaneio</strong></label>
                <Textarea class="w-full mt-1" id="obsRomaneio" v-model="gmo.obsRomaneio" rows="5" cols="30" maxlength="1000" :disabled="disable"/>
            </div> 

        </div>

            

        <br />

        <div class="flex align-items-center">
            <Button v-if="!integration.visible" label="Voltar" icon="pi pi-spinner" class="p-button p-component p-button-outlined mr-2" @click="voltar()" />
            <Button v-if="integration.visible" label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info mr-2" @click="salvar()" :disabled="doubleClick"/>
            <Button v-if="integration.visible" label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger mr-2" @click="voltar()" />
            
        </div>
    </div>   
</template>

<script>
    import IntegracaoService from '../../service/IntegracaoService';
    import Formatacao from '../../utilities/Formatacao';
    import GmoService from '../../service/GmoService';
    import TratamentoDeError from '../../utilities/TratamentoDeError';

    export default {
        name: 'Gmo Formulário',
        props: {
            id: {
                type: String,
                required: false
            },
        },
        data() {
            return {
                gmo: {},
                doubleClick: false,
                disable: true,
                nomeIsInvalid: false,
                integration: {},
                ativo: "Select",
                ativoOpcoes: [
                    {nome: 'Sim', valor: true},
                    {nome: 'Não', valor: false}
                ],
            }
        },
        created() {
            this.carregarDados();
            this.getIntegrationOptons();
        },

        methods: {
            getIntegrationOptons(){
                const paginaAtual = "TIPO_GMO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                            this.disable = data.disable;
                        }
                    })
            },

            isCadastro() {
                return this.id == undefined || this.id == null || this.id == '';
            },

            isNumber: function(evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                    evt.preventDefault();;
                } else {
                    return true;
                }
            },

            carregarDados() {
                if(this.isCadastro()) return;
                this.isEdition = true;
                GmoService.getGmoid(this.id)
                    .then(({ data }) => {
                        if(data) {
                            const dataCadastro = data['dataCadastro'];
                            data['dataCadastro'] = Formatacao.formatDateCustom(dataCadastro, 'DD/MM/YYYY HH:mm');
                            this.ativo = this.ativoOpcoes.find(item => { return item.valor === data.ativo });
                            const dataAtualizacao = data['dataAtualizacao'];
                            data['dataAtualizacao'] = Formatacao.formatDateCustom(dataAtualizacao, 'DD/MM/YYYY HH:mm');
                            
                            this.gmo = data;
                        }
                        else {
                            this.voltar();
                        }
                    })
                    .catch(error => {
                        this.voltar();
                    });
            },

            voltar() {
                this.$router.push(`/gmo`);
            },
                        
            isCamposPreenchidos() {
                let isValid = true;

                if(!this.gmo.tipoGmo) {
                    this.nomeIsInvalid = true;
                    isValid = false;
                }

                if(!isValid) {
                    this.$toast.add({
                        severity:'error', 
                        summary: 'Falha', 
                        detail:'Preencher os campos obrigatórios.', 
                        life: 3000
                    });
                    return;
                }

                return isValid;
            },

            salvar() {
                if(!this.isCamposPreenchidos() && !this.doubleClick) return;
                this.doubleClick = true;
                if(this.id) {

                    this.atualizar()
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:'O tipo foi atualizado com sucesso!', 
                                life: 3000
                            });

                            this.voltar();
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            this.$toast.add(TratamentoDeError(error, false));
                        });
                }
                else {
                    
                    this.gmo.idUnico = this.gmo.tipoGmo.replace(/\s/g, '');

                    this.cadastrar()
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:'O tipo foi cadastrado com sucesso!',
                                life: 3000
                            });
                            this.voltar();
                        })
                        .catch(reject => {
                            this.doubleClick = false;
                            this.$toast.add(TratamentoDeError(reject, true));                            
                        });
                }
            },

            atualizar() {
                return new Promise((resolve, reject) => {
                    GmoService.atualizar(this.gmo)
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            reject(error);
                        });
                });
            },

            cadastrar() {
                return new Promise((resolve, reject) => {
                    GmoService.cadastrar(this.gmo)
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            reject(error);
                        });
                });
            },

            limparCampos() {
                this.gmo = {};
                this.ativo = null;
            }
        }
    }
</script>
