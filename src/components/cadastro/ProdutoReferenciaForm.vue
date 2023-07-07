<template>
    <div class="card">
        <Toast />

        <div class="flex align-items-center">
            <i class="pi pi-shopping-bag mr-2" style="font-size: 2rem;"></i>
            <h3 style="margin:0;">{{ id ? 'Editar' : 'Cadastrar'}} Referência de Produtos</h3>
        </div><hr /> 

        <div class="col-12 sm:col-12 lg:col-6 border-panel">                
                
            <div class="grid">
                

                <div class="col-12 sm:col-3 lg:col-12">
                    <label for="referencia"><strong>Referência</strong></label>
                    <InputText :class="['w-full', 'mt-1', {'p-invalid': refvalid}]" id="referencia" v-model="referencia.codRef"/>
                </div>

                

                <div class="col-12 flex align-items-center">
                    <Button label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info" @click="salvar()" :disabled="doubleClick"/>
                    <Button label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger ml-2" @click="voltar()" />
                </div>
            </div>
        </div>        
    </div>   
    
</template>

<script>
    import Formatacao from '../../utilities/Formatacao';
    import ProdutoReferenciaService from '../../service/ProdutoReferenciaService';

    export default {
        name: 'Referencia Produtos',
        props: {
            id: {
                type: String,
                required: false
            },
        },

        data() {
            return {
                referencia: {}, 
                ativo: null,
                regvalid: false,
                itemvalid: false,
                refvalid: false,
                ativalid: false,
                doubleClick: false,
            }
        }, 

        created() {
            this.carregarDados();
        },

        methods: {
            isCadastro() {
                return this.id == undefined || this.id == null || this.id == '';
            },

            carregarDados() { 
                if(this.isCadastro()) return;
                  
                ProdutoReferenciaService.getidReferencia(this.id)
                    .then(({ data }) => {
                        if(data) {             
                            this.referencia = data;                           
                        }else {
                            this.voltar();
                        }
                    });
            },
            voltar() {
                this.$router.push(`/referencia-produto`);
            }, 

            isCamposPreenchidos() {
                let isValid = true;         

                if(!this.referencia.codRef) {
                    this.refvalid = true;
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
                                detail:'Referência atualizado com sucesso!', 
                                life: 3000
                            });

                            this.voltar();
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            this.$toast.add({
                                severity:'error', 
                                detail:'Falha ao atualizar Referência!', 
                                life: 3000
                            });
                        });
                }
                else {
                    this.cadastrar()
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:'Referência foi cadastrado com sucesso!',
                                life: 3000
                            });

                            console.log('*Sucesso: ', response);

                            this.voltar();;
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            this.$toast.add({
                                severity:'error',
                                detail:'Falha ao cadastrar Referência!',
                                life: 3000
                            });

                            console.log('*Erro: ', error);

                        });
                }
            },
            
            atualizar() {  
                const referencia = this.referencia;         
                //referencia['ativo'] = this.ativo?.valor;

                return new Promise((resolve, reject) => {              
                    ProdutoReferenciaService.atualizar(referencia)
                        .then(response => {
                            console.log("*Entrou no then");
                            resolve(response);
                        })
                        .catch(error => {
                            console.log("*Entrou no catch");
                            reject(error);
                        });
                });
            },

            cadastrar() {
                return new Promise((resolve, reject) => {
                    ProdutoReferenciaService.cadastrar(this.referencia)
                        .then(response => {
                            console.log("*Entrou no then - Cadastrar");
                            resolve(response);
                        })
                        .catch(error => {
                            console.log("*Entrou no catch - Cadastrar");
                            reject(error);
                        });
                });
            },

            limparCampos() {
                this.referencia.codErp = null;
                this.referencia.codRef = null;

                this.ativo = null;
                this.dialog = false;
                this.cancelarDialog = false;
                this.salvarDialog = false;
            }
        }
    }
</script>
