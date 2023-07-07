<template>
    <div class="card col-12 p-4">
        <div class="w-full align-items-center">            
            <h3>
                <i class="pi pi-building" style="font-size: 1.4rem"></i> 
                {{ estabelecimentoId ? 'Editar' : 'Cadastrar' }} estabelecimento
            </h3>
            <hr /> 
        </div>

        <div class="grid">
            <div class="col-4 lg:col-1">
                <label for="codigo"><strong>Código<span style="color: red;">&nbsp;*</span></strong></label>
                <InputText class="w-full mt-2" id="codigo" v-model="codigo" :disabled="integration.disable || editar" :maxlength="12"/>
            </div>

            <div class="col-4 lg:col-2">                
                <label for="codigoRegional"><strong>É Regional?</strong></label>                
                <div class="grid align-items-center form mt-1">
                     <div class="col-6" >
                        <RadioButton name="isRegional" value="Sim" v-model="isRegional" id="isRegional" @change="habilitaDesabilitaRegional()" :disabled="integration.disable"/>
                        <label for="isReginal"> Sim</label>
                    </div>

                    <div class="col-6">
                        <RadioButton name="isRegional" value="Nao" v-model="isRegional" id="isRegional" @change="habilitaDesabilitaRegional()" :disabled="integration.disable"/>
                        <label for="isReginal"> Não</label>
                    </div>
                </div>               
            </div>

            <div class="col-4 lg:col-3" v-show="!enableRegional">
                <label for="codigoRegional"><strong>Regional<span style="color: red;">&nbsp;*</span></strong></label>
                <AutoComplete :class="['w-full', 'mt-2', {'p-invalid': invalid.regional}]"
                    @complete="getRegionalCodNome($event)"
                    :suggestions="regionaisFiltro"
                    :disabled="integration.disable"
                    id="codigoRegional"
                    v-model="regional"
                    field="codNome"
                    dropdown="true"/>
            </div>

            <div class="col-12 lg:col-6">  
                <label for="razao-social"><strong>Razão Social<span style="color: red;">&nbsp;*</span></strong></label>
                <InputText :class="['w-full', 'mt-2', {'p-invalid': invalid.razaoSocial}]" id="razao-social" v-model="razaoSocial" :disabled="integration.disable" :maxlength="50"/>
            </div>

            <div class="col-6 lg:col-3">
                <label for="nome-fantasia"><strong>Nome Fantasia<span style="color: red;">&nbsp;*</span></strong></label>
                <InputText :class="['w-full', 'mt-1', {'p-invalid': invalid.nomeFantasia}]" id="nome-fantasia" v-model="nomeFantasia" :disabled="integration.disable" :maxlength="50"/>
            </div>

            <div class="col-6 lg:col-3">
                <label for="endereco"><strong>Endereço<span style="color: red;">&nbsp;*</span></strong></label>
                <InputText :class="['w-full', 'mt-1', {'p-invalid': invalid.endereco}]"  id="endereco" v-model="endereco" :disabled="integration.disable" :maxlength="50"/>
            </div>

            <div class="col-4 lg:col-2">
                <label for="bairro"><strong>Bairro<span style="color: red;">&nbsp;*</span></strong></label>
                <InputText :class="['w-full', 'mt-1', {'p-invalid': invalid.bairro}]" id="bairro" v-model="bairro" :disabled="integration.disable" :maxlength="30"/>
            </div>

            <div class="col-4 lg:col-2">
                <label for="cidade"><strong>Cidade<span style="color: red;">&nbsp;*</span></strong></label>
                <InputText :class="['w-full', 'mt-1', {'p-invalid': invalid.cidade}]"  id="cidade" v-model="cidade" :disabled="integration.disable" :maxlength="30"/>
            </div>

            <div class="col-4 lg:col-2">
                <label for="estado"><strong>Estado<span style="color: red;">&nbsp;*</span></strong></label>
                <InputText :class="['w-full', 'mt-1', {'p-invalid': invalid.estado}]"  id="estado" v-model="estado" :disabled="integration.disable" :maxlength="2"/>
            </div>

            <div class="col-4 lg:col-3">
                <label for="cnpj"><strong>CNPJ<span style="color: red;">&nbsp;*</span></strong></label>
                <InputMask :class="['w-full', 'mt-1', {'p-invalid': invalid.cnpj}]" id="cnpj" v-model="cnpj" mask="99.999.999/9999-99" :disabled="integration.disable" @blur="getCNPJValido()"/>
            </div>

            <div class="col-4 lg:col-3">
                <label for="inscricao-estadual"><strong>Inscrição Estadual</strong></label>
                <InputText class="w-full mt-1" id="inscricao-estadual" v-model="inscricaoEstadual" :disabled="integration.disable" :maxlength="15"/>
            </div>            

            <div class="col-4 lg:col-3">
                <label for="email"><strong>Email</strong></label>
                <InputText :class="['w-full', 'mt-1', {'p-invalid': invalid.email}]" id="email" v-model="email" :disabled="integration.disable" @blur="getEmailValid()"/>
            </div>

            <div class="col-4 lg:col-3">
                <label for="telefone"><strong>Telefone</strong></label>
                <InputMask :class="['w-full', 'mt-1', {'p-invalid': invalid.telefone}]" id="telefone" v-model="telefone" :maxlength="18" mask="+55 (99) 99999999?9" :disabled="integration.disable"/> 
            </div> 

            <div class="col-4 lg:col-2">                
                <label><strong>É Matriz?</strong></label>                
                <div class="grid align-items-center form mt-1">
                     <div class="col-6" >
                        <RadioButton name="isMatriz" value="Sim" v-model="isMatriz" id="isMatriz" :disabled="integration.disable"/>
                        <label for="isMatriz"> Sim</label>
                    </div>

                    <div class="col-6">
                        <RadioButton name="isMatriz" value="Nao" v-model="isMatriz" id="isMatriz" :disabled="integration.disable"/>
                        <label for="isMatriz"> Não</label>
                    </div>
                </div>               
            </div>

            <div class="w-full align-items-center p-2">
                <Button v-if="!integration.visible" label="Voltar" icon="pi pi-spinner" class="p-button p-component p-button-outlined m-2" @click="voltar()" />
                <Button v-if="integration.visible" label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info m-2" @click="salvar()" :disabled="doubleClick"/>
                <Button v-if="integration.visible" label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger m-2" @click="voltar()" />                
            </div>
        <Toast />
        </div>
    </div>
</template>

<script>
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import ValidarDocumentoService from '../../service/ValidarDocumentoService'
    import Formatacao from '../../utilities/Formatacao';
    import TratamentoDeError from '../../utilities/TratamentoDeError';
    import IntegracaoService from '../../service/IntegracaoService'
    

    export default {
        name: 'EstabelecimentoForm',
        props: {
            estabelecimentoId: {
                type: String,
                required: false
            }
        },
        data() {
            return {
                dataCadastro: null,
                dataAtualizacao: null,
                codigo: null,
                regional: null,
                regionais: [],
                regionaisFiltro: {},

                razaoSocial: null,
                nomeFantasia: null,
                endereco: null,
                bairro: null,
                cidade: null,
                estado: null,
                cnpj: null,
                inscricaoEstadual: null,
                email: null,
                telefone: null,
                isRegional:'Nao',
                isMatriz: 'Nao',
                enableRegional:false,
                colRegional:'col-7',
                editar: false,

                ativo: null,
                ativoOpcoes: [
                    {nome: 'Sim', valor: true},
                    {nome: 'Não', valor: false}
                ],                
             
                invalid: {},
                integration: {},
                doubleClick: false,
                cnpjInvalido: false
            }
        },
        created() {
            this.carregarDados();
            this.getIntegrationOptons();  
            if(this.estabelecimentoId != undefined){
                this.editar = true;
            }          
        },
        methods: {  
            getCNPJValido(){
                let documento = {
                    cnpj: this.cnpj
                }
                ValidarDocumentoService.getDocumentoValido(documento)
                    .then(({ data }) => {
                        if(data.bloqueado){
                            if(this.razaoSocial != data.nomeCadastro && this.estabelecimentoId == null){
                                this.invalid.cnpj = true;
                                this.$toast.add({
                                    severity:'error', 
                                    summary: 'CNPJ JÁ CADASTRADO', 
                                    detail: data.message,
                                    life: 15000
                                });
                                this.cnpjInvalido = true;
                            }
                        }
                        else{
                            this.invalid.cnpj = false;
                            this.cnpjInvalido = false;
                        }
                    })
                    .catch(error => {
                        this.invalid.cnpj = true;
                        this.cnpjInvalido = true;
                        this.$toast.add({
                            severity:'error', 
                            summary: 'CNPJ INVÁLIDO', 
                            detail: 'Verifique os números do CNPJ digitado antes de proceguir.',
                            life: 15000
                        })
                    });
            },

            getEmailValid(){
                this.invalid.email = false;
                if(this.email === undefined || this.email === null || this.email === "") return;
                var mail =  /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
                if(!mail.test(this.email)){
                       this.invalid.email = true;
                       return true;
                }else{
                    this.invalid.email = false;
                    return false;
                }
            },

            getIntegrationOptons(){
                const paginaAtual = "ESTABELECIMENTO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                        }
                    })
            },
          
            carregarDados() {
                if(!this.estabelecimentoId) return;

                EstabelecimentoService.getEstabelecimentosPorId(this.estabelecimentoId)
                    .then(({ data }) => {
                        if(data) {
                            this.dataCadastro = Formatacao.formatDateCustom(data.dataCadastro, 'DD/MM/YYYY HH:mm');
                            this.dataAtualizacao = Formatacao.formatDateCustom(data.dataAtualizacao, 'DD/MM/YYYY HH:mm');
                            this.codigo = data.codigo;
                            this.razaoSocial = data.razaoSocial;
                            this.nomeFantasia = data.nomeFantasia;
                            this.endereco = data.endereco;
                            this.bairro = data.bairro;
                            this.cidade = data.cidade;
                            this.estado = data.estado;
                            this.cnpj = data.cnpj;
                            this.email = data.email;
                            this.telefone = data.telefone;
                            this.inscricaoEstadual = data.inscricaoEstadual;

                            if(data.regional){
                                this.isRegional = 'Sim';
                            }
                            else{
                                this.isRegional = 'Nao';
                            }
                            
                            if(data.matriz){
                                this.isMatriz = 'Sim';
                            }else{
                                this.isMatriz = 'Nao';
                            }
                            this.habilitaDesabilitaRegional();    
                            this.ativo = this.ativoOpcoes.find(item => { return item.valor === data.ativo });     
                            EstabelecimentoService.getEstabelecimentosPorCodigo(data.codigoRegional)
                                .then(({ data }) => {
                                    if(data) {
                                        this.regional = data;
                                    }
                                });
                        }
                        else {
                            this.voltar();
                        }
                    })
                    .catch(error => {
                        this.voltar();
                    });
            },

            getRegionalCodNome(event) {
                const dados = !event.query.trim().length ? 'a' : event.query;
                setTimeout(() => {
                    EstabelecimentoService.getRegionais(dados)
                        .then(({ data }) => {
                            this.regionaisFiltro = [...data];
                        });
                }, 250);
            },

            buscarVinculos(){
                if(!this.estabelecimentoId) return;
                EstabelecimentoService.getRegionalPorCodigo(this.codigo)
                    .then(({ data }) => {
                        data.content.find(item => {
                            if(item.codigo != this.codigo){
                                this.carregarDados();
                                this.$toast.add({
                                    severity:'info', 
                                    summary: 'ESTABELECIMENTO REGIONAL', 
                                    detail:'Antes de proceguir você deve selecionar uma nova regional para o estabelecimento.' + item.codNome,
                                    life: 9000
                                });
                                
                            }
                        });
                });
            },

            voltar() {
                this.$router.push(`/estabelecimentos`);
            },

            validarCampos() {
                let  invalido = false;
                this.invalid = {};
                if(this.isRegional === 'Nao' && !this.regional) {
                    this.invalid.regional = true;
                    invalido = true;
                }

                if(!this.codigo) {
                    this.$toast.add({
                        severity: "error", 
                        detail:"Campo ( Código ) obrigatório.", 
                        life: 10000
                    });
                    this.invalid.codigo = true;
                   invalido = true;
                }

                if(!this.razaoSocial) {
                    this.$toast.add({
                        severity: "error", 
                        detail:"Campo ( Razão Social ) obrigatório.", 
                        life: 10000
                    });
                    this.invalid.razaoSocial = true;
                    invalido = true;
                }

                if(!this.nomeFantasia) {
                    this.$toast.add({
                        severity: "error", 
                        detail:"Campo ( Nome Fantasia ) obrigatório.", 
                        life: 10000
                    });
                    this.invalid.nomeFantasia = true;
                    invalido = true;
                }

                if(!this.endereco){
                    this.$toast.add({
                        severity: "error", 
                        detail:"Campo ( Endereço ) obrigatório.", 
                        life: 10000
                    });
                    this.invalid.endereco = true;
                    invalido = true;
                }
                
                if(!this.bairro){
                    this.$toast.add({
                        severity: "error", 
                        detail:"Campo ( Bairro ) obrigatório.", 
                        life: 10000
                    });
                    this.invalid.bairro = true;
                    invalido = true;
                }

                if(!this.cidade){
                    this.$toast.add({
                        severity: "error", 
                        detail:"Campo ( Cidade ) obrigatório.", 
                        life: 10000
                    });
                    this.invalid.cidade = true;
                    invalido = true;
                }

                if(!this.estado){
                    this.$toast.add({
                        severity: "error", 
                        detail:"Campo ( Estado ) obrigatório.", 
                        life: 10000
                    });
                    this.invalid.estado = true;
                    invalido= true;
                }           

                if(!this.cnpj) { 
                    this.$toast.add({
                        severity: "error", 
                        detail:"Campo ( CNPJ ) obrigatório.", 
                        life: 10000
                    });                   
                    this.invalid.cnpj = true;
                    invalido = true;
                }

                if(this.cnpjInvalido){
                    this.invalid.cnpj = true;
                    invalido = true; 
                }

                if(invalido){
                    this.$toast.add({
                        severity: "error", 
                        detail:"Verifique os campos obrigatórios para poder prosseguir com o Cadastro / Atualização", 
                        life: 10000
                    }); 
                }
                return invalido;
            },

            getDados() {
                let codigoRegional = this.codigo;
                let matriz = false;
                if(this.isRegional  == "Nao") {
                    codigoRegional = this.regional.codigo
                }

                if(this.isMatriz  == "Sim") {
                    matriz = true;
                }
                
                return {
                    codigo: this.codigo,
                    codigoRegional: codigoRegional,
                    razaoSocial: this.razaoSocial,
                    nomeFantasia: this.nomeFantasia,
                    endereco: this.endereco,
                    bairro: this.bairro,
                    cidade: this.cidade,
                    estado: this.estado,
                    cnpj: this.cnpj,
                    email: this.email,
                    telefone: this.telefone,
                    inscricaoEstadual: this.inscricaoEstadual,
                    ativo: this.ativo?.valor || true,
                    matriz: matriz
                }
            },

            salvar() {
                if(this.validarCampos() && !this.doubleClick) return;
                this.doubleClick = false;
                console.log(JSON.stringify(this.getDados()))
                if(!this.estabelecimentoId){
                    EstabelecimentoService.cadastrar(this.getDados())
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:'O estabelecimento foi cadastrado com sucesso!', 
                                life: 3000
                            }); 
                            this.voltar();
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            this.$toast.add(TratamentoDeError(error))
                        });
                }else{
                    EstabelecimentoService.atualizar(this.getDados())
                        .then(response => {
                            this.$toast.add({
                                severity:'success', 
                                detail:'O estabelecimento foi atualizado com sucesso!', 
                                life: 3000
                            });

                            this.voltar();
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            this.$toast.add(TratamentoDeError(error))
                        });
                }                                              
            },

            habilitaDesabilitaRegional(){
                if(this.isRegional === 'Sim'){
                    this.enableRegional = true;
                    this.colRegional = "col-10"
                }
                else if(this.isRegional === 'Nao'){  
                    this.buscarVinculos()       
                    this.enableRegional = false;
                    this.colRegional = "col-7";
                    this.regional=null;
                }
            }

        }
    }
        
    
</script>
