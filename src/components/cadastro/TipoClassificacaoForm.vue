<template>
    <div class="card">
        <Toast />

        <div class="flex align-items-center">
            <i class="pi pi-list mr-2" style="font-size: 2rem;"></i>
            <h3 style="margin:0;">{{ this.tipoClassificacao ? 'Editar' : 'Cadastrar' }} Tipo de Classificação</h3>
        </div>

        <hr />

        <div class="grid">

            <div class="col-6">
                <label for="tipo"><strong>Tipo<span style="color: red;">&nbsp;*</span></strong></label>

                <Dropdown 
                    id="tipo"
                    v-model="selectedTipo" 
                    :options="tipoDropDown" 
                    optionLabel="valor"
                    optionValue="chave" 
                    placeholder="Selecionar"
                    v-on:change="buscarTipo()"
                    :class="['w-full', 'mt-1', {'p-invalid': tipoIsInvalid}]"></Dropdown>
            </div>

            <div class="col-12">

                <Fieldset class="grupo-produto">
                    <template #legend>
                        <strong>Classificação</strong>
                    </template>

                    <div class="field-checkbox">
                        <Checkbox id="resultadoDesconto" v-model="resultadoDesconto" :binary="true"  />
                        <label for="resultadoDesconto">Resultado (%) Desconto</label>
                    </div>

                    <div class="field-checkbox">
                        <Checkbox id="resultadoTaxaSecagemKg" v-model="resultadoTaxaSecagemKg" :binary="true"  />
                        <label for="resultadoTaxaSecagemKg">Taxa De Secagem Em Quilos</label>
                    </div>

                    <div class="field-checkbox">
                        <Checkbox id="resultadoTaxaSecagemValor" v-model="resultadoTaxaSecagemValor" :binary="true"  />
                        <label for="resultadoTaxaSecagemValor">Taxa De Secagem Em Valor</label>
                    </div>

                    <div class="field-checkbox">
                        <Checkbox id="teorPorFaixa" v-model="teorPorFaixa" :binary="true"  />
                        <label for="teorPorFaixa">(%) Teor Por Faixa</label>
                    </div>

                    <div class="field-checkbox">
                        <Checkbox id="controlePorSafra" v-model="controlePorSafra" :binary="true"  />
                        <label for="controlePorSafra">Controle Por Safra</label>
                    </div>

                    <div class="field-checkbox">
                        <Checkbox id="ph" v-model="ph" :binary="true"  />
                        <label for="ph">PH</label>
                    </div>

                    <div class="field-checkbox">
                        <Checkbox id="phCorrigido" v-model="phCorrigido" :binary="true"  />
                        <label for="phCorrigido">PH Corrigido</label>
                    </div>

                    <div class="field-checkbox">
                        <Checkbox id="referencia" v-model="referencia" :binary="true"  />
                        <label for="referencia">Referência</label>
                    </div>

                </Fieldset>

            </div>
                
        </div>

    <hr />
    <div class="flex align-items-center">
        <Button label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info" @click="salvar()" :disabled="doubleClick"/>
        <Button label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger ml-2" @click="voltar()" />
    </div>

    </div>
</template>

<script>

    import TipoClassificacaoService from '../../service/TipoClassificacaoService';
    import TratamentoDeError from '../../utilities/TratamentoDeError';


    export default {
        name: 'TipoClassificacaoForm',
        props: {
            tipoClassificacao:{
                type: String,
                required : false
            }
        },

        data() {
            return {

                id: null,

                //Pagina
                tipoDropDown: null,
                selectedTipo: null,
                
                
                //checkbox
                resultadoDesconto: false,
                resultadoTaxaSecagemKg: false,
                resultadoTaxaSecagemValor: false,
                teorPorFaixa: false,
                controlePorSafra: false,
                ph: false,
                phCorrigido: false,
                referencia: false,


                //CadaCasdatro
                dataCadastro: null,

                dataCadastro: null,
                dataAtualizacao: null,

                ativo: null,
                doubleClick: false,
                
                //Validação da Página
                tipoIsInvalid: null,
                areaIsInvalid: null,
                tituloModalIsInvalid: null,
                conteudoModalIsInvalid: null
                
            }
        },
        created() {

            this.carregarDados();
            
        },
        methods: {            
            carregarDados() {

                //carrega a dropdown tipo
                this.buscarTipo();

                if(!this.tipoClassificacao) return;

                TipoClassificacaoService.getTipoCadastroPorTipo(this.tipoClassificacao)
                     .then(({ data }) => {
                         if(data) {

                            this.selectedTipo = data.tipoClassificacao;

                            this.resultadoDesconto =  data.resultadoDesconto;
                            this.resultadoTaxaSecagemKg = data.resultadoTaxaSecagemKg;
                            this.resultadoTaxaSecagemValor = data.resultadoTaxaSecagemValor;
                            this.teorPorFaixa = data.teorPorFaixa;
                            this.controlePorSafra = data.controlePorSafra;
                            this.ph = data.ph;
                            this.phCorrigido = data.phCorrigido;
                            this.referencia = data.referencia;
                            this.id = data.id;

                         }
                         else {
                            this.voltar();

                         }
                     })
                     .catch(error => {
                         TratamentoDeError(error, false);
                         this.voltar();
                     });

            },

            buscarTipo(){

                TipoClassificacaoService.getTipos()
                    .then(({ data }) => {
                        if(data) {
                            this.tipoDropDown = [...data];
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.tipoDropDown = [];
                    });
            },

            

            voltar() {
                //this.limparCampos();
                this.$router.push(`/tipo-classificacao`);
            },
            
            validarCampos() {
                
                let isValid = true;

                this.tipoIsInvalid = false;
                

                if(!this.selectedTipo) {
                    this.tipoIsInvalid = true;
                    isValid = false;
                }


                /**Nova - Inicio */

                if(this.resultadoTaxaSecagemKg)
                {
                    if(this.selectedTipo !== 'UMIDADE')
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'O CheckBox Taxa de Secagem em Quilos está selecionado porém este deve ser somente usado para o tipo Umidade.', 
                            life: 3000
                        });
                        return;
                    }
                }

                if(this.resultadoTaxaSecagemValor)
                {
                    if(this.selectedTipo !== 'UMIDADE')
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'O CheckBox Taxa de Secagem em Valor está selecionado porém este deve ser somente usado para o tipo Umidade.', 
                            life: 3000
                        });
                        return;
                    }
                }

                if(this.teorPorFaixa)
                {
                    if(this.selectedTipo !== 'CHUVA_AVARIADO' && this.selectedTipo !== 'PH') 
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'O CheckBox (%) Teor Por Faixa está selecionado porém este deve ser somente usado para o tipo Chuva e Avariado ou PH.', 
                            life: 3000
                        });
                        return;
                    }
                }

                if(this.ph)
                {
                    if(this.selectedTipo !== 'PH')
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'O CheckBox PH está selecionado porém este deve ser somente usado para o tipo PH.', 
                            life: 3000
                        });
                        return;
                    }
                }

                if(this.phCorrigido)
                {
                    if(this.selectedTipo !== 'PH')
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'O CheckBox PH Corrigido está selecionado porém este deve ser somente usado para o tipo PH.', 
                            life: 3000
                        });
                        return;
                    }
                }

                if(this.referencia)
                {
                    if(this.selectedTipo !== 'PH'){
                        this.$toast.add({
                            severity:'error', 
                            detail:'O CheckBox Referência está selecionado porém este deve ser somente usado para o tipo PH.', 
                            life: 3000
                        });
                        return;
                    }
                }
            

                /**Nova - Fim */

                
                if(this.selectedTipo === 'IMPUREZA')
                {
                    if(this.teorPorFaixa)
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'Quando o tipo for igual a Impureza o campo (%) Teor por Faixa não deve ser selecionado.', 
                            life: 3000
                        });
                        return;
                    }                    
                }

                if(this.selectedTipo === 'UMIDADE')
                {
                    if(!this.resultadoTaxaSecagemKg)
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'Quando o tipo for igual a Umidade o campo Resultado Taxa de Secagem em Quilos deve ser selecionado.', 
                            life: 3000
                        });
                        return;
                    }

                    if(!this.resultadoTaxaSecagemValor)
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'Quando o tipo for igual a Umidade o campo Resultado Taxa de Secagem em Valor deve ser selecionado.', 
                            life: 3000
                        });
                        return;
                    }

                    if(this.teorPorFaixa)
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'Quando o tipo for igual a Umidade o campo (%) Teor por Faixa NÃO deve ser selecionado.', 
                            life: 3000
                        });
                        return;
                    }   
                }

                if(this.selectedTipo === 'CHUVA_AVARIADO')
                {
                    if(!this.teorPorFaixa)
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'Quando o tipo for igual a Chuva e Avariado o campo (%) Teor por Faixa deve ser selecionado.', 
                            life: 3000
                        });
                        return;
                    }
                }

                if(this.selectedTipo === 'PH')
                {
                    if(!this.ph)
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'Quando o tipo for igual a PH o checkbox PH deve ser selecionado.', 
                            life: 3000
                        });
                        return;
                    }

                    if(!this.phCorrigido)
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'Quando o tipo for igual a PH o checkbox PH Corrigido deve ser selecionado.', 
                            life: 3000
                        });
                        return;
                    }

                    if(!this.referencia)
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'Quando o tipo for igual a PH o checkbox Referência deve ser selecionado.', 
                            life: 3000
                        });
                        return;
                    }

                    if(!this.teorPorFaixa)
                    {
                        this.$toast.add({
                            severity:'error', 
                            detail:'Quando o tipo for igual a PH o checkbox (%) Teor Por Faixa deve ser selecionado.', 
                            life: 3000
                        });
                        return;
                    }

                    
                }

                if(!isValid) {
                    this.$toast.add({
                        severity:'error', 
                        detail:'Preencher os campos obrigatórios.', 
                        life: 3000
                    });
                    return;
                }
                
                return isValid;
            },

            getDados() {

                return {
                    id:null,
                    tipoClassificacao: this.selectedTipo,
                    resultadoDesconto: this.resultadoDesconto,
                    resultadoTaxaSecagemKg: this.resultadoTaxaSecagemKg,
                    resultadoTaxaSecagemValor: this.resultadoTaxaSecagemValor,
                    teorPorFaixa: this.teorPorFaixa,
                    controlePorSafra: this.controlePorSafra,
                    ph: this.ph,
                    phCorrigido: this.phCorrigido,
                    referencia: this.referencia
                }
            },

            salvar() {

                if(!this.validarCampos() && !this.doubleClick) return;
                this.doubleClick = true;
                
                const dados = this.getDados();

                //Verifica se é Inclusão ou Edição
                if(this.tipoClassificacao) {
                    dados['id'] = this.id;
                    dados['tipoClassificacao'] = this.tipoClassificacao;

                    this.atualizar(dados);
                }
                else {
                    this.cadastrar(dados);
                }

            },

            //método para atualizar
            atualizar(dados) {

                TipoClassificacaoService.atualizar(dados)
                    .then(response => {
                        this.$toast.add({
                            severity:'success', 
                            detail:'A Informação de Recurso do Sistema foi atualizado com sucesso!', 
                            life: 3000
                        });
                        
                        this.voltar();

                    })
                    .catch(error => {
                        this.doubleClick = false;
                        this.$toast.add(TratamentoDeError(error, false));
                    });
            },

            //método para cadastrar
            cadastrar(dados) {

                TipoClassificacaoService.cadastrar(dados)
                    .then(response => {
                        this.$toast.add({
                            severity:'success',
                            detail:'O Tipo de Classificação foi cadastrado com sucesso!', 
                            life: 3000
                        });
                        
                        this.dialog = true,
                        this.cancelarDialog = false;
                        this.salvarDialog = true;

                        this.voltar();


                    })
                    .catch(error => {
                        this.doubleClick = false;
                        this.$toast.add(TratamentoDeError(error, true));
                    });
            },

            //Limpa Campos
            limparCampos() {
                
                this.selectedTipo = null,

                //checkbox
                this.resultadoDesconto =  false,
                this.resultadoTaxaSecagemKg = false,
                this.resultadoTaxaSecagemValor = false,
                this.teorPorFaixa = false,
                this.controlePorSafra = false,
                this.ph = false,
                this.phCorrigido = false,
                this.referencia = false,
                
                this.dataCadastro = null,
                this.dataCadastro = null,
                this.dataAtualizacao = null,
                this.ativo = null,
                
                
                this.dialog = false;
                this.cancelarDialog = false;
                this.salvarDialog = false;
            }
        }
    }
</script>
