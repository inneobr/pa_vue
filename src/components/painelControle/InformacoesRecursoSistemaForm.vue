<template>
    <div class="card">
        <Toast />

        <h5>{{ id ? 'Editar' : 'Cadastrar' }} Informação de Recurso do Sistema</h5>

        <hr />

        <div class="grid">            
            <div class="col-6">
                <label for="pagina"><strong>Página<span style="color: red;">&nbsp;*</span></strong></label>
                
                <Dropdown 
                    id="idPagina"
                    v-model="selectedPagina" 
                    :options="paginasDropDown" 
                    optionLabel="valor"
                    optionValue="chave" 
                    placeholder="Selecionar"
                    v-on:change="buscarArea()"
                    :class="['w-full', 'mt-1', {'p-invalid': paginaIsInvalid}]"/> 
            </div>

            <div class="col-6">
                <label for="area"><strong>Área<span style="color: red;">&nbsp;*</span></strong></label>
                
                <Dropdown
                    id="idArea"
                    v-model="selectedArea" 
                    :options="areaDropDown" 
                    optionLabel="valor"
                    optionValue="chave" 
                    placeholder="Selecionar" 
                    :class="['w-full', 'mt-1', {'p-invalid': areaIsInvalid}]"/> 
            </div>

            <div class="col-12">
                <label for="tituloModal"><strong>Título Modal<span style="color: red;">&nbsp;*</span></strong></label>
                <InputText id="titulo-modal" :class="['w-full', 'mt-1', {'p-invalid': tituloModalIsInvalid}]"  v-model="tituloModal" />
            </div>

            <div class="col-12">
                <Editor v-model="conteudoModal" id="conteudo-modal" editorStyle="height: 320px" :class="['w-full', 'mt-1', {'p-invalid': conteudoModalIsInvalid}]"/>
            </div>
            
        </div>

        <br />

        <div class="flex align-items-center">
            <Button label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info" @click="salvar()" :disabled="this.doubleClick"/>
            <Button label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger mr-2" @click="voltar()" />
        </div>
    </div>
</template>


<script>

import InformacoesRecursoSistemaService from '../../service/InformacoesRecursoSistemaService';


    export default {
        name: 'InformacoesRecursoSistemaForm',
        props: {
            id: {
                type: String,
                required: false
            }
        },
        data() {
            return {

                //Pagina
                paginasDropDown: null,
                selectedPagina: null,
                //Area
                areaDropDown: null,
                selectedArea: null,
                //Titulo da Modal
                tituloModal:null,
                //Conteudo Modal
                conteudoModal : null,
                //CadaCasdatro
                dataCadastro:null,

                dataCadastro: null,
                dataAtualizacao: null,

                ativo: null,                

                //Validação da Página
                paginaIsInvalid:null,
                areaIsInvalid:null,
                tituloModalIsInvalid:null,
                conteudoModalIsInvalid:null,
                doubleClick: false,
                
            }
        },
        created() {            
            this.carregarDados();
            
        },
        methods: {            
            carregarDados() {
                this.buscarPagina();

                if(!this.id) return;

                InformacoesRecursoSistemaService.getInformacoesRecursoSistemaPorId(this.id)
                    .then(({ data }) => {
                        if(data) {

                            this.tituloModal = data.tituloModal;
                            this.conteudoModal = data.conteudo;
                            this.selectedPagina = data.paginaName;
                            this.dataCadastro = data.dataCadastro;

                            this.buscarArea();

                            this.selectedArea = data.paginaArea;
                        

                        }
                        else {
                            this.voltar();
                        }
                    })
                    .catch(error => {
                        this.voltar();
                    });
            },

            buscarPagina(){

                InformacoesRecursoSistemaService.getPaginas()
                    .then(({ data }) => {
                        if(data) {
                            this.paginasDropDown = [...data];
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.paginasDropDown = [];
                    });
            },

            buscarArea(){
                InformacoesRecursoSistemaService.getAreas(this.selectedPagina)
                    .then(({ data }) => {
                        if(data) {
                            this.areaDropDown = [...data];
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.areaDropDown = [];
                    });
            },

            voltar() {
                this.limparCampos();
                this.$router.push(`/info-recurso-sistema`);
            },

            validarCampos() {
                
                let isValid = true;

                this.paginaIsInvalid = false;
                this.areaIsInvalid = false;
                this.tituloModalIsInvalid = false;
                this.conteudoModalIsInvalid = false;

                if(!this.selectedPagina) {
                    this.paginaIsInvalid = true;
                    isValid = false;
                }

                if(!this.selectedArea) {
                    this.areaIsInvalid = true;
                    isValid = false;
                }

                if(!this.tituloModal) {
                    this.tituloModalIsInvalid = true;
                    isValid = false;
                }

                if(!this.conteudoModal) {
                    this.conteudoModalIsInvalid = true;
                    isValid = false;
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
                     paginaArea: this.selectedArea,
                     tituloModal: this.tituloModal,
                     conteudo: this.conteudoModal
                }
            },

            salvar() {

                if(!this.validarCampos() && !this.doubleClick) return;
                this.doubleClick  =true;
                const dados = this.getDados();

                //Verifica se é Inclusão ou Edição
                if(this.id) {
                    dados['id'] = this.id;
                    this.atualizar(dados);
                }
                else {
                    this.cadastrar(dados);
                }

            },

            //método para atualizar
            atualizar(dados) {

                InformacoesRecursoSistemaService.atualizar(dados)
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
                        console.error(error);
                        this.$toast.add({
                            severity:'error', 
                            detail:'Falha ao atualizar a Informação de Recurso do Sistema!',
                            life: 3000
                        });
                    });
            },

            //método para cadastrar
            cadastrar(dados) {

                InformacoesRecursoSistemaService.cadastrar(dados)
                    .then(response => {
                        this.$toast.add({
                            severity:'success',
                            detail:'A Informação de Recurso do Sistema foi cadastrado com sucesso!', 
                            life: 3000
                        });
                        
                        this.dialog = true,
                        this.cancelarDialog = false;
                        this.salvarDialog = true;
                    })
                    .catch(error => {
                        this.doubleClick = false;
                        this.$toast.add({
                            severity:'error', 
                            detail:'Falha ao cadastrar a Informação de Recurso do Sistema!', 
                            life: 3000
                        });
                    });
            },

            //Limpa Campos
            limparCampos() {
                //this.id = null;
                this.tituloModal = null;
                this.conteudoModal = null;
                this.selectedArea = null;
                this.selectedPagina = null;
                
                this.dialog = false;
                this.cancelarDialog = false;
                this.salvarDialog = false;
            }
        }
    }
</script>
