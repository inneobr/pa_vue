<template>
    <div class="card">

        <Toast />
        
        <div class="flex align-items-center">
            <i class="pi pi-shopping-bag mr-2" style="font-size: 2rem;"></i>
            <h3 style="margin:0;">{{ id ? 'Editar' : 'Cadastrar'}} Produtos</h3>
        </div>

        <hr />        

        <div class="col-12 sm:col-12 lg:col-8 border-panel">
            <div class="grid">
                <div class="col-4 sm:col-3 lg:col-2">
                    <label for="item"><strong>Código</strong></label>
                    <InputText
                        id="item"
                        class="w-full mt-1"
                        v-model="produto.codItem"
                        :disabled="disable || !isCadastro()"
                        :class="{'p-invalid': nomeIsInvalid}" maxlength="10"/>
                </div>
             
                <div class="col-8 sm:col-9 lg:col-5">
                    <label for="descricao"><strong>Descrição</strong></label>
                    <InputText
                        id="descricao"
                        class="w-full mt-1"
                        :disabled="disable"
                        v-model="produto.descItem"
                        :class="{'p-invalid': nomeIsInvalid}" maxlength="50"/>
                </div>   
                
                <div class="col-8 sm:col-9 lg:col-5">
                    <label for="filtroGrupoProduto"><strong>Grupo de produtos</strong></label>
                    <AutoComplete
                        field="codDesc"
                        :dropdown="true"
                        class="w-full mt-1"
                        v-model="grupoProduto"
                        id="filtroGrupoProduto"
                        placeholder="Selecionar"
                        :disabled="disable"
                        :suggestions="grupoProdutoFiltrados"
                        @keyup.enter="buscarGrupoProduto($event)"
                        @complete="buscarGrupoProduto($event)">
                    </AutoComplete>
                </div>

                <Fieldset legend="Produto AF." :toggleable="false" class="lg:col-12">
                    <div class="grid ">
                        <div class="col-4 sm:col-3 lg:col-4">
                            <label for="codcooperado"><strong>Código Cooperado</strong></label>
                            <InputText
                                id="codcooperado"
                                class="w-full mt-1"
                                :disabled="disable"
                                v-model="produto.codItemAfCoop"
                                :class="{'p-invalid': nomeIsInvalid}" maxlength="50"/>
                        </div>

                        <div class="col-8 sm:col-9 lg:col-8">
                            <label for="desccooperado"><strong>Descrição Cooperado</strong></label>
                            <InputText
                                class="w-full mt-1"
                                id="desccooperado"
                                :disabled="disable"
                                v-model="produto.descItemAfCoop"
                                :class="{'p-invalid': nomeIsInvalid}"  maxlength="50"/>
                        </div>

                        <div class="col-4 sm:col-3 lg:col-4">
                            <label for="codterceiro"><strong>Código Terceiro</strong></label>
                            <InputText
                                id="codterceiro"
                                class="w-full mt-1"
                                :disabled="disable"
                                v-model="produto.codItemAfTerc"
                                :class="{'p-invalid': nomeIsInvalid}"  maxlength="50"/>
                        </div>

                        <div class="col-8 sm:col-9 lg:col-8">
                            <label for="descterceiro"><strong>Descrição Terceiro</strong></label>
                            <InputText
                                id="descterceiro"
                                class="w-full mt-1"
                                :disabled="disable"
                                v-model="produto.descItemAfTerc"
                                :class="{'p-invalid': nomeIsInvalid}"  maxlength="50"/>
                        </div>
                    </div>
                </Fieldset>

                <Fieldset legend="Produto Fixação." :toggleable="false" class="lg:col-12">
                    <div class="grid ">
                        <div class="col-4 sm:col-3 lg:col-4">
                            <label for="codcooperado"><strong>Código Cooperado</strong></label>
                            <InputText
                                id="codcooperado"
                                class="w-full mt-1"
                                :disabled="disable"
                                v-model="produto.codItemFixaCoop"
                                :class="{'p-invalid': nomeIsInvalid}"/>
                        </div>

                        <div class="col-8 sm:col-9 lg:col-8">
                            <label for="desccooperado"><strong>Descrição Cooperado</strong></label>
                            <InputText
                                id="desccooperado"
                                class="w-full mt-1"
                                :disabled="disable"
                                v-model="produto.descItemFixaCoop"
                                :class="{'p-invalid': nomeIsInvalid}"/>
                        </div>

                        <div class="col-4 sm:col-3 lg:col-4">
                            <label for="codterceiro"><strong>Código Terceiro</strong></label>
                            <InputText
                                id="codterceiro"
                                class="w-full mt-1"
                                :disabled="disable"
                                v-model="produto.codItemFicaTerc"
                                :class="{'p-invalid': nomeIsInvalid}"/>
                        </div>

                        <div class="col-8 sm:col-9 lg:col-8">
                            <label for="descterceiro"><strong>Descrição Terceiro</strong></label>
                            <InputText
                                id="descterceiro"
                                class="w-full mt-1"
                                :disabled="disable"
                                v-model="produto.descItemFicaTerc"
                                :class="{'p-invalid': nomeIsInvalid}"/>
                        </div>
                    </div>
                </Fieldset>  
            </div>

            <DataTable :value="produto.referencias" 
                responsiveLayout="stack" 
                @sort="sort($event)"
                showGridlines
                scrollHeight="200px" scrollable>

                <Column field="id" header="Id" style="max-width: 100px" :sortable="true"/>
                <Column field="codRef" header="Referência" :sortable="true"/>
                <Column v-if="integration.visible" header="Ações" style="max-width: 100px; text-align: center;">
                    <template #body="{ data }">
                        <Button
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-danger flex-none"
                            title="Deletar"
                            @click="removerItem(data)"/>
                    </template>
                </Column> 

                <template #header>
                    <div class="flex justify-content-between align-items-center">
                        <label for="filtroGrupoProduto"><strong>Produto Referências</strong></label>
                        <div class="flex align-items-center">

                        <Dropdown v-if="integration.visible"
                            class="w-full m-1"
                            placeholder="Selecionar"
                            v-model="produtoReferenciaSelecionado" 
                            :options="produtoReferenciaFiltrados" 
                            filter optionLabel="codRef" 
                            emptyFilterMessage="Limpe o filtro para exibir todos os resultados." 
                            >
                            <template #value="data">
                                <div v-if="data.value" class="flex align-items-center">
                                    <div>{{ data.value.codRef }}</div>
                                </div>
                                <span v-else>
                                    {{ data.placeholder }}
                                </span>
                            </template>
                            <template #option="data">
                                <div class="flex align-items-center">
                                    <div>{{ data.option.codRef }}</div>
                                </div>
                            </template>
                        </Dropdown>

                        <Button v-if="integration.visible"
                            icon="pi pi-plus"
                            class="p-button p-component pt-2"
                            @click="vincularReferencia"/>
                        </div>
                    </div>
                </template>
            </DataTable>

            <br />

            <div class="flex align-items-center">
                <Button v-if="!integration.visible" label="Voltar" icon="pi pi-spinner" class="p-button p-component p-button-outlined mr-2" @click="voltar()" />
                <Button v-if="integration.visible" label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info mr-2" @click="salvar()" />
                <Button v-if="integration.visible" label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger" @click="voltar()" />
            </div>
        </div> 
    </div>        
</template>

<script>
    import ProdutoService from '../../service/ProdutoService';
    import IntegracaoService from '../../service/IntegracaoService'
    import TratamentoDeError from '../../utilities/TratamentoDeError';
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import ProdutoReferenciaService from '../../service/ProdutoReferenciaService';

    export default {
        name: 'Produto',
        props: {
            id: {
                type: String,
                required: false
            },
        },
        data() {
            return {
                produto: {},                               
                click: false,
                indexRep: null,
                grupoProduto: null,
                grupoProdutoFiltrados: [],
                codigoGrupo:null,
                disable: false,
                integration: {},
                produtoReferenciaList: [],
                produtoReferenciaFiltrados: [],
                produtoReferenciaSelecionado: null,
                pesquisaReferencia:'6',
                
            }
        },
        created() {
            this.carregarDados();
            this.getIntegrationOptons();
            this.buscarReferencia();
        },
        methods: {
            getIntegrationOptons(){
                const paginaAtual = "PRODUTO";
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
                
                ProdutoService.getidProduto(this.id)
                    .then(({ data }) => {
                        if(data) {                            
                            this.produto = data;
                            this.carregarGrupoProduto(data.fmCodigo);
                        }
                        else {
                            this.voltar();
                        }
                    })
                    .catch(error => {
                        this.voltar();
                    });
            },

            async carregarGrupoProduto(codigoGrupo){
                const {data} = await GrupoProdutoService.getGrupoPorCodigoOuDescricao(codigoGrupo);
                    if( data ) { 
                        
                        this.grupoProduto = data[0];
                    }                    
            },

            buscarGrupoProduto(event) {              
                const codigoOuDescricao = !event.query.trim().length ? 's' : event.query;
                GrupoProdutoService.getPorDescricao(codigoOuDescricao)
                    .then(({ data }) => {
                        if(data) {
                            this.grupoProdutoFiltrados = [...data];
                        }
                    })
                    .catch(error => {
                        this.grupoProdutoFiltrados = [];
                    });
            },
            
            buscarReferencia(event) {                
                const codigo = !event.query.trim().length ? '' : event.query;

                console.log(codigo);
                
                ProdutoReferenciaService.getProdutoReferenciaNome(codigo)
                    .then(({ data }) => {
                        if(data) {
                            this.produtoReferenciaFiltrados = data;   
                            console.log(data)                         
                        }
                        this.getAdicionados();                        
                    })
                    .catch(error => {
                        this.produtoReferenciaFiltrados = [];
                    });                    
            }, 
            
            buscarReferencia() {                
                
                ProdutoReferenciaService.getProdutoReferenciaNome('')
                    .then(({ data }) => {
                        if(data) {
                            this.produtoReferenciaFiltrados = data;   
                            console.log(data)                         
                        }
                        this.getAdicionados();                        
                    })
                    .catch(error => {
                        this.produtoReferenciaFiltrados = [];
                    });                    
            }, 

            removerItem(item){
                this.produto.referencias.splice(this.produto.referencias.indexOf(item), 1);
                this.buscarReferencia();
            },

            getAdicionados(){
                if(this.produto.referencias == undefined) {return};
                this.produto.referencias.find(item => {                  
                    const index = this.produtoReferenciaFiltrados.findIndex(referencia => {
                        return item.codRef == referencia.codRef;
                    });
                    this.produtoReferenciaFiltrados.splice(index, 1);
                });

                if(this.produtoReferenciaFiltrados.length <= 0){
                    this.$toast.add({
                        severity:'info',
                        detail:'Todas as refêrencias foram cadastradas.', 
                        life: 3000
                    });
                }             
            },

            vincularReferencia(index) {                
                if(!this.produtoReferenciaSelecionado) {
                    this.$toast.add({
                        severity:'error',
                        detail:'Por favor, selecione uma referência para vincular!', 
                        life: 3000
                    });
                    return;
                }

                if(!this.produto.referencias) {
                    this.produto.referencias = [];
                }

                this.produto.referencias.push(this.produtoReferenciaSelecionado);
                this.produtoReferenciaSelecionado = null;
                this.buscarReferencia();

            },
            

            voltar() {
                this.$router.push(`/produtos`);
            },

            isCamposPreenchidos() {
                let isValid = true;

                if(!this.produto.descItem) {
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

            getGrupoProdutoCodigo(){
                if(!this.grupoProduto){
                    return '';
                }
                return this.grupoProduto.fmCodigo;
            },

            getDados(){
                this.produto['grupoProduto'] = this.grupoProduto;

                this.produto.fmCodigo = this.grupoProduto.fmCodigo;

                return this.produto;
            },

            salvar() {
                if(this.click == true) return;
                if(!this.isCamposPreenchidos()) return;               
                if(this.id) {
                    this.click = true;
                    this.atualizar()
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:'O produto foi atualizado com sucesso!', 
                                life: 3000
                            });                            
                            this.voltar();
                        })
                        .catch(error => {
                            this.$toast.add(TratamentoDeError(error, false));
                        });
                }
                else {
                    this.click = true;
                    this.cadastrar()             
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:'O Produto foi cadastrado com sucesso!',
                                life: 3000
                            });
                            this.voltar();
                            //this.confirmarNovoCadastro();
                        })
                        .catch(error => {
                            this.$toast.add(TratamentoDeError(error, true));
                        });
                }
            },

            atualizar() {
                return new Promise((resolve, reject) => {
                    ProdutoService.atualizar(this.getDados())
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            },

            cadastrar() {
                return new Promise((resolve, reject) => {
                    ProdutoService.cadastrar(this.getDados())
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            },

            limparCampos() {
                window.location.reload();
            }
        }
    }
</script>