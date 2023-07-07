<template>
    <div class="card">
        <Toast />       

        <div class="flex justify-content-between">
            <div class="flex align-items-center">
                <i class="pi pi-window-minimize mr-2" style="font-size: 1.8rem;"></i>
                <!-- <h3 style="margin:0;"> {{ isCadastro() ? 'Cadastrar' : 'Editar' }} Grupo de Classificação</h3> -->
                <h3 style="margin:0;"> {{ gerarTitulo() }} Grupo de Classificação</h3>
           </div>
        </div>
            <Message severity="warn" closable="true" @close="message_error_visible = false"  v-if="message_error_visible"><span v-html="message_error"></span></Message>
        <hr />

        <div class="grid col-12 lg:col-6">
                <div class="col-12 lg:col-6">
                    <label for="descricao"><strong>Descrição do Grupo</strong></label>
                    <InputText class="w-full mt-1" :class="{'p-invalid': desc_error }" id="descricao" v-model="grupo.descricao" :disabled="integration.disable"/>
                </div>

                <div class="col-6 lg:col-6">
                    <label for="tipo"><strong>Tipo</strong></label>
                    <Dropdown id="tipo"
                        class="w-full mt-1"
                        :class="{'p-invalid': tipo_error }"
                        v-model="tipoClassificacaoSelecionado" 
                        :options="tipoClassificacaoFiltrados" 
                        optionLabel="tipo" 
                        placeholder="Selecione"
                        :disabled="!isCadastro() || integration.disable"
                        @change="novoGrupoLinhas(); isdisabledUploadXLS = false;"
                    />
                </div>                
        </div>
        <TabView>            
            <TabPanel>                
                <template #header>
                    <i class="pi pi-chart-bar mr-1" style="font-size: 1.0rem;"></i>
                    <span>Classificação</span>
                </template>

                <div class="col-12">
                    <div class="flex">
                        <FileUpload v-if="integration.visible"
                            class="p-button"
                            mode="basic"
                            chooseLabel="Carregar XLS"
                            ref="uploadXls" 
                            :auto="true"
                            :disabled="isdisabledUploadXLS"
                            :customUpload="true"
                            @uploader="uploadXlsAction"
                        />
                        <Button v-if="integration.visible" :disabled="isdisabledUploadXLS" icon="pi" class="p-button mr-2" @click="visualizarInformacao('GRUPO_CLASSIFICACAO_XLSX')">
                            <i class="pi pi-info-circle" style=""></i>
                        </Button>

                        <Button v-if="integration.visible"
                            type="button"
                            icon="pi pi-trash"
                            label="Excluir Todos"
                            class="p-button p-button-danger mr-2"
                            style="padding: 0.4rem;"
                            :disabled="isdisabledUploadXLS"
                            @click="confirmarExclusaoTodos()"
                        ></Button>
                    </div>
                </div>
                <div class="col-12 lg:col-10">
                    <DataTable 
                        :value="grupo.detalhes" 
                        editMode="cell" 
                        showGridlines
                        @cell-edit-complete="onCellEditComplete" 
                        class="editable-cells-table" 
                        v-model:filters="filters" 
                        :scrollable="true" 
                        scrollHeight="400px"
                        responsiveLayout="stack"
                        >

                        <Column field="teorClassificacaoInicial" header="Teor Inicial">
                            <template #body="{ data }">
                                {{ formatDecimal(data.teorClassificacaoInicial, 1, 1)}}
                                
                            </template>
                            <template #editor="{ data, field, index}">
                                <InputText v-model="data[field]" style="width:8rem; overflow: hidden;" :disabled="integration.disable" />
                            </template>
                        </Column>

                        <Column v-if="tipoClassificacaoSelecionado.teorPorFaixa" field="teorClassificacaoFinal" header="Teor Final">
                            <template #body="{ data }">
                                {{ formatDecimal(data.teorClassificacaoFinal, 1, 1) }}
                            </template>
                            <template #editor="{ data, field, index }">
                                <InputText v-model="data[field]" style="width:8rem; overflow: hidden;" :disabled="integration.disable" />
                            </template>
                        </Column>

                        <Column v-if="tipoClassificacaoSelecionado.ph" field="phEntrada" header="PH Entrada">
                            <template #body="{ data }">
                                {{ data.phEntrada }}
                            </template>
                            <template #editor="{ data, field, index }">
                                <InputText v-model="data[field]" style="width:8rem; overflow: hidden;" :disabled="integration.disable" />
                            </template>
                        </Column>

                        <Column v-if="tipoClassificacaoSelecionado.phCorrigido" field="phCorrigido" header="PH Corrigido">
                            <template #body="{ data }">
                                {{ data.phCorrigido }}
                            </template>
                            <template #editor="{ data, field, index }">
                                <InputText v-model="data[field]" style="width:8rem; overflow: hidden;" :disabled="integration.disable" />
                            </template>
                        </Column>

                        <Column v-if="tipoClassificacaoSelecionado.resultadoDesconto" field="percentualDesconto" header="% Desconto">
                            <template #body="{ data }">
                                {{ formatDecimal(data.percentualDesconto, 1, 2) }}
                            </template>
                            <template #editor="{ data, field , index}">
                                <InputText v-model="data[field]" style="width:8rem; overflow: hidden;" :disabled="integration.disable"/>
                            </template>
                        </Column>                   

                        <Column v-if="tipoClassificacaoSelecionado.referencia" field="codigoReferencia" header="Cód. Referência" style="width: 8rem;">
                            <template #editor="{ data, field, index }">
                                <Dropdown :disabled="integration.disable"
                                    style="width:8rem;"
                                    v-model="data[field]"
                                    :options="referenciasFiltradas"
                                    filter
                                    optionLabel="codRef"
                                    optionValue="codRef"
                                    @filter="buscarReferencia"
                                    @focus="iniciarBuscaReferencia"
                                    placeholder="Referência"
                                />
                            </template>
                        </Column>

                        <Column v-if="tipoClassificacaoSelecionado.resultadoTaxaSecagemKg" field="taxaSecagemQuilo" header="Taxa Secagem Kg">
                            <template #body="{ data }">
                                {{ formatDecimal(data.taxaSecagemQuilo, 2, 9) }}
                            </template>
                            <template #editor="{ data, field , index}">
                                <InputText v-model="data[field]" style="width:8rem; overflow: hidden;" :disabled="integration.disable"/>
                            </template>
                        </Column>

                        <Column v-if="tipoClassificacaoSelecionado.resultadoTaxaSecagemValor" field="taxaSecagemValor" header="Taxa Secagem Valor">
                            <template #body="{ data }">
                                {{ formatDecimal(data.taxaSecagemValor, 2, 9) }}
                            </template>
                            <template #editor="{ data, field , index}">
                                <InputText v-model="data[field]" style="width:8rem; overflow: hidden;" :disabled="integration.disable"/>
                            </template>
                        </Column>

                        <Column v-if="tipoClassificacaoSelecionado.ativo && integration.visible" header="Ações" alignFrozen="right" frozen>
                            <template #body="{ index }">
                                <div class="flex-none">
                                    <Button icon="pi pi-plus" class="p-button-rounded p-button-warning flex-none mr-1" @click="novaLinha(index)" />                                
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-sucess flex-none" @click="removerLinha(index)"/>
                                </div>
                            </template>
                        </Column>
                    </DataTable> 
                </div>

                <!-- <div>
                    {{ JSON.stringify(grupo.detalhes) }}
                </div> -->

            </TabPanel>            
            
            <TabPanel :disabled="!tipoClassificacaoSelecionado.controlePorSafra">
                <template #header> 
                    <div :class="{'warn': safra_error }">                   
                        <i class="pi pi-calendar mr-1"  style="font-size: 1.0rem;"></i>
                            <span>Safra</span>
                    </div>
                </template>
                
                <PickList class="col-12 lg:col-8" 
                        v-model="safras" dataKey="id" 
                        listStyle="height:500px;" 
                        v-if="integration.visible">
                    <template #sourceheader>
                        Disponíveis
                    </template>
                    <template #targetheader>
                        Vinculados
                    </template>
                    <template #item="{ item }">
                        <span> {{ item.safra }} </span>
                    </template>
                </PickList>

                <DataTable 
                    showGridlines
                    responsiveLayout="stack"
                    :value="safras[1]"
                    v-if="!integration.visible">

                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="safra" header="Safra">
                        <template #body="{ data }">
                            <i class="pi pi-calendar mr-1"></i>
                            {{ data.safra }}
                        </template>
                    </Column>
                
                </DataTable>

            </TabPanel>

            <TabPanel>
                <template #header> 
                    <div :class="{'warn': grupo_erro }">
                        <i class="pi pi-shopping-bag mr-1" style="font-size: 1.0rem;;"></i>
                        <span>Grupo De Produtos</span>
                    </div>
                </template>                           

                <PickList class="col-12 lg:col-8" 
                        v-model="grupoProduto" dataKey="id" 
                        listStyle="height:500px;"
                        v-if="integration.visible">
                    <template #sourceheader>
                        Disponíveis
                    </template>
                    <template #targetheader>
                        Vinculados
                    </template>
                    <template #item="{ item }">
                        <span>{{ item.fmCodigo }} - {{ item.descricao }}</span>
                    </template>
                </PickList>

                <DataTable 
                    showGridlines
                    responsiveLayout="stack"
                    :value="grupoProduto[1]"
                    v-if="!integration.visible">

                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="fmCodigo" header="Código" style="width:6rem;"/>
                    <Column field="descricao" header="Estabelecimento"/>
                
                </DataTable>

            </TabPanel>

            <TabPanel>
                <template #header>
                    <div :class="{'warn': stb_erro }">
                        <i class="pi pi-home mr-1" style="font-size: 1.0rem;"></i>
                        <span>Estabelecimentos</span>
                    </div>
                </template>

                <PickList class="col-12 lg:col-8" 
                        v-model="estabPickList" dataKey="id" 
                        listStyle="height:500px;" 
                        v-if="integration.visible">
                    <template #sourceheader>
                        Disponíveis
                    </template>                    
                    <template #targetheader>
                        <div :class="{'warn': stb_erro}">
                            Vinculados
                        </div>
                    </template>                    
                    <template #item="{ item }">
                        <span>{{ item.codigo }} - {{ item.nomeFantasia }}</span>
                    </template>
                </PickList>

                <DataTable 
                    showGridlines
                    v-if="!integration.visible"
                    responsiveLayout="stack"
                    :value="estabPickList[1]">

                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="codigo" header="Código" style="width:6rem;"/>
                    <Column field="nomeFantasia" header="Estabelecimento"/>
                
                </DataTable>
            </TabPanel>
        </TabView>

        <hr />
        <div class="flex">
            <Button v-if="integration.visible" type="button" label="Salvar" class="p-button-info mr-1" icon="pi pi-plus" @click="salvar()" :disabled="doubleClick"/>
            <Button v-if="integration.visible" label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger mr-2" @click="voltar()" />
            <Button v-if="!integration.visible" label="Voltar" icon="pi pi-spinner" class="p-button p-component p-button-outlined mr-2" @click="voltar()" />
        </div>        
    </div>

    <Modalinformacao 
        :visivel="informacaoDialog"
        :paginaArea="paginaArea"
        @fechar="ocultarInformacao()"
    />
</template>

<script>
    import GrupoClassificacaoService from '../../service/GrupoClassificacaoService';
    import ProdutoReferenciaService from '../../service/ProdutoReferenciaService';
    import TipoClassificacaoService from '../../service/TipoClassificacaoService';
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import IntegracaoService from '../../service/IntegracaoService';
    import SafraService from '../../service/SafraService';
    import Formatacao from '../../utilities/Formatacao';
    import {FilterMatchMode} from 'primevue/api';
    import { read, utils } from 'xlsx';
    import Modalinformacao from '../ModalInformacao.vue';

    export default {
        props: {
            id: {
                type: String,
                required: false
            },

            isCopiar: {
                type: Boolean,
                required: false
            },

            isApenasVisulizacao:{
                type: Boolean,
                required: false
            }
        },
        components: {
            Modalinformacao
        },

        data() {
            return {
                editingRows: [],
                columns: null,
                filters: {
                    'teorClassificacaoInicial': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
                },
                grupo: {detalhes: []},  
                detalhesSalvar: {},              
                safras: [[],[]],
               
                grupoProduto: [[],[]], 
                tipoClassificacaoFiltrados: [],
                tipoClassificacaoSelecionado: {},

                estabPickList: [[], []],

                referenciasFiltradas: [],

                desc_error: false,
                tipo_error: false,
                safra_error: false,
                grupo_erro: false,
                stb_erro: false,
                gselect_error: false,
                message_error: null,
                message_error_visible: false,
                integration: {},
                isdisabledUploadXLS: true,
                doubleClick: false,
                informacaoDialog:false,
                paginaArea:'',
            }
        },        

        created() {
            if(this.isApenasVisulizacao){
                this.integration.visible=false;
            }else{
                this.getIntegrationOptons();       
            }   
            
        },

        methods: { 

            formatDecimal(value, minimumFractionDigits = 2, maximumFractionDigits = 2) {
                if(value === null) return "";
                return Formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
            },

            getIntegrationOptons(){
                const paginaAtual = "GRUPO_CLASSIFICACAO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                        }
                    })
            },

            carregarGrupoClassificacao(){
                GrupoClassificacaoService.getGruposClassificacaoUnico(this.id)
                    .then(({ data }) => { 
                        if( data ) { 
                            //console.log('Data!!', data);
                            this.grupo = data;
                            if(this.isCopiar) this.grupo['descricao'] = this.grupo.descricao + " - ( cópia )";
                            this.carregarTipoClassificacao(data.tipoClassificacao);
                            this.carregarGruposProdutos(data.grupoProdutos);
                            this.carregarSafras(data.safras);
                            this.carregarEstabelecimento(data.estabelecimentos);
                            this.isdisabledUploadXLS = false;
                            if(data.detalhes.length == 0){
                                this.novaLinha();
                            }
                        }
                    });                     
            },

            async carregarTipoClassificacao(tipoClassificacao){
                const {data} = await TipoClassificacaoService.getTiposClassificacao();

                    if( data ) { 
                        this.tipoClassificacaoFiltrados = data; 

                        if(tipoClassificacao != undefined){                            
                            this.tipoClassificacaoSelecionado = this.tipoClassificacaoFiltrados.find(item => {
                                return item.tipoClassificacao == tipoClassificacao.tipoClassificacao;
                            });
                        }                        
                    }                    
            },

            carregarSafras(vinculados = []){
                SafraService.getTodasSafras()
                    .then(({ data }) => { 
                            if(data) {
                                let disponiveis = data.map(item => {
                                    return {
                                        safra: item,
                                    }
                                })
                                
                                disponiveis = disponiveis.filter(disponivel => {
                                const item = vinculados.find(vinculado => {
                                    return vinculado.safra === disponivel.safra;
                                });
                                    return item === undefined;
                                });
                                this.safras = [disponiveis, vinculados];
                            }
                            else {
                                this.safras = [[], []];
                            }
                        })
                        .catch(error => {
                            this.safras = [[], []];
                            console.error(error);
                        });
            },

            carregarGruposProdutos(vinculados = []){
                GrupoProdutoService.listarGruposProdutos()
                    .then(({ data }) => { 
                        if(data) {
                            let disponiveis = data;
                                
                            disponiveis = disponiveis.filter(disponivel => {
                                const item = vinculados.find(vinculado => {
                                    return vinculado.descricao === disponivel.descricao;
                                });

                                return item === undefined;
                            });

                            let classificacaoDisponivel = [];
                            if(disponiveis != null){
                                classificacaoDisponivel = disponiveis.map(grupoProduto => {
                                    return {
                                        id: null,
                                        idGrupoProduto: grupoProduto.id,
                                        fmCodigo: grupoProduto.fmCodigo,
                                        descricao: grupoProduto.descricao,
                                        //estabelecimentos: this.estabelecimentos,
                                    }
                                })
                            }

                            this.grupoProduto = [classificacaoDisponivel, vinculados];                                                        
                        }
                        else {
                            this.grupoProduto = [[], []];
                        }
                    })
                    .catch(error => {
                        this.grupoProduto = [[], []];
                    });
            },

            carregarEstabelecimento(vinculados = []) {
                EstabelecimentoService.getTodosEstabelecimentosSilo()
                    .then(({ data }) => {
                        if(data) {

                            let disponiveis = data;
                            
                            disponiveis = disponiveis.filter(disponivel => {
                                const item = vinculados.find(vinculado => {
                                    return vinculado.codigo === disponivel.codigo;
                                });

                                return item === undefined;
                            });


                            let estabelecimentoDisponivel = [];
                            if(disponiveis != null){
                                estabelecimentoDisponivel = disponiveis.map(estabelecimento => {
                                    return {
                                         id: null,
                                         idEstabelecimento: estabelecimento.id,
                                         codigo: estabelecimento.codigo,
                                         nomeFantasia: estabelecimento.nomeFantasia,
                                    }
                                 })
                            }

                            this.estabPickList = [estabelecimentoDisponivel, vinculados];

                        }
                        else{
                            this.estabPickList = [[], []];
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.estabPickList = [[], []];
                    });
            },
          
            getDados() {
                let grupoClassificacao = this.grupo;
                
                this.corrigirDetalhes(this.grupo.detalhes);
                grupoClassificacao.detalhes = this.detalhesSalvar;

                grupoClassificacao['tipoClassificacao'] = this.tipoClassificacaoSelecionado;
                grupoClassificacao['safras'] = this.safras[1];
                grupoClassificacao['grupoProdutos'] = this.grupoProduto[1];
                grupoClassificacao['estabelecimentos'] = this.estabPickList[1];

                // let json = JSON.stringify(this.grupo.detalhes);
                // console.log('json: ', json);
                
                return grupoClassificacao;
            },

            corrigirDetalhes(detalhes){
                                
                let detalhesValidos = [];
                
                for (var i = 0; i <= detalhes.length-1; i++) {
                    
                    let item = {
                        teorClassificacaoInicial:null,
                        teorClassificacaoFinal:null,
                        percentualDesconto:null,
                        taxaSecagemQuilo:null,
                        taxaSecagemValor:null,
                        phEntrada:null,
                        phCorrigido:null,
                        codigoReferencia:null
                    };

                    if(detalhes[i].teorClassificacaoInicial !== undefined && detalhes[i].teorClassificacaoInicial !== null){
                        
                        item.teorClassificacaoInicial = this.converterNumero( detalhes[i].teorClassificacaoInicial );
                    }

                    if(detalhes[i].teorClassificacaoFinal !== undefined && detalhes[i].teorClassificacaoFinal !== null){
                        
                        item.teorClassificacaoFinal = this.converterNumero( detalhes[i].teorClassificacaoFinal )
                    }

                    if(detalhes[i].percentualDesconto !== undefined && detalhes[i].percentualDesconto !== null){
                        
                        item.percentualDesconto =  this.converterNumero( detalhes[i].percentualDesconto ); 
                    }

                    if(detalhes[i].taxaSecagemQuilo !== undefined && detalhes[i].taxaSecagemQuilo !== null){
                        
                        item.taxaSecagemQuilo = this.converterNumero( detalhes[i].taxaSecagemQuilo ); 
                    }
                    
                    if(detalhes[i].taxaSecagemValor !== undefined && detalhes[i].taxaSecagemValor !== null){
                        
                        item.taxaSecagemValor = this.converterNumero( detalhes[i].taxaSecagemValor ); 
                    }

                    if(detalhes[i].phEntrada !== undefined && detalhes[i].phEntrada !== null){
                        
                        item.phEntrada = this.converterNumero( detalhes[i].phEntrada ); 
                    }

                    if(detalhes[i].phCorrigido !== undefined && detalhes[i].phCorrigido !== null){
                        
                        item.phCorrigido = this.converterNumero( detalhes[i].phCorrigido ); 
                    }

                    if(detalhes[i].codigoReferencia !== undefined && detalhes[i].codigoReferencia !== null){
                        item.codigoReferencia = detalhes[i].codigoReferencia;
                    }

                    
                    if(item.teorClassificacaoInicial === null && 
                       item.teorClassificacaoFinal === null &&
                       item.percentualDesconto === null &&
                       item.taxaSecagemQuilo === null &&
                       item.taxaSecagemValor === null &&
                       item.phEntrada === null &&
                       item.phCorrigido === null ){
                        continue; //Não envia valores das linhas que estão nulas para o back
                       }
                       else{
                        detalhesValidos.push(item);                       
                       }
                    
                    
                }
                this.detalhesSalvar = detalhesValidos;
            },

            novaLinha(index = undefined){
                const detalhe = {
                    teorClassificacaoInicial:null,
                    teorClassificacaoFinal: null,
                    phEntrada: null,
                    percentualDesconto: null,
                    phCorrigido: null,
                    codigoReferencia: '',
                    taxaSecagemQuilo: null,
                    taxaSecagemValor: null,
                };

                if(index == undefined) {
                    this.grupo.detalhes.push(detalhe); 
                }
                else {
                    this.grupo.detalhes.splice(index + 1, 0, detalhe); 
                }
            },

            novoGrupoLinhas(){
                this.grupo.detalhes.splice(0);
                for (var i = 1; i <= 10; i++) {
                    this.novaLinha();
                }                
            },

            removerLinha(item){

                if(this.grupo.detalhes.length !== 1)
                {
                    this.grupo.detalhes.splice(item, 1);  
                }
                              
            },

            confirmarExclusaoTodos(){
                this.removerTodasLinhas();
                this.novoGrupoLinhas();                
            },

            removerTodasLinhas(){
                this.grupo.detalhes.splice(0,this.grupo.detalhes.length);
            },

            salvar() {
                if(!this.isCamposPreenchidos() && !this.doubleClick) return;
                this.doubleClick = true;

                this.carregarTeor(this.grupo.detalhes);
                
                if(this.id && !this.isCopiar) {
                    GrupoClassificacaoService.atualizar(this.getDados())
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:'O grupo foi atualizado com sucesso!', 
                                life: 3000
                            });

                            this.voltar();
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            this.message_error = error.response.data;
                            this.message_error_visible = true;
                            if(this.message_error !== undefined || this.message_error !== null) {
                                this.message_error = this.message_error.replace("/\n/g", "<br />");
                            }
                        });
                }
                else {
                    GrupoClassificacaoService.cadastrar(this.getDados())
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:'O Grupo de Classificação foi cadastrado com sucesso!',
                                life: 3000
                            });                            
                            this.voltar();
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            
                            //console.log("Mensagem Erro: ", error);
                            this.message_error = error.response.data;
                            this.message_error_visible = true;
                            
                            this.message_error = this.message_error.replace(/\n/g, "<br />");

                            
                        });    
                }
            },

            atualizar() {
                return new Promise((resolve, reject) => {
                    GrupoClassificacaoService.atualizar(this.getDados())
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
                    GrupoClassificacaoService.cadastrar(this.getDados())
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            reject(error);
                        });
                });
            },
          

            carregarTeor(detalhes){
                let detalhesValidos =[];
                for (var i = 0; i <= detalhes.length-1; i++) {
                    if(detalhes[i].teorClassificacaoFinal == null || detalhes[i].teorClassificacaoInicial > detalhes[i].teorClassificacaoFinal){                       
                        this.grupo.detalhes[i].teorClassificacaoFinal = this.grupo.detalhes[i].teorClassificacaoInicial;
                    }

                    if(detalhes[i].teorClassificacaoInicial != null){
                        detalhesValidos.push(detalhes[i]);                       
                    }
                }
                this.grupo.detalhes = detalhesValidos;
            },

            isCamposPreenchidos() {
                let isValid = true;  
                this.message_error = null;


                if(!this.grupo.descricao) {
                    this.desc_error = true;
                    isValid = false;

                    if(this.message_error != null)
                        this.message_error = this.message_error + `<br />` + `É necessário preencher o campo Descrição do Grupo.`;
                    else
                        this.message_error = `É necessário preencher o campo Descrição do Grupo.`;

                    this.message_error_visible = true;

                }else{
                    this.desc_error = false;
                }

                
                
                if(Object.keys(this.tipoClassificacaoSelecionado).length == 0){
                    this.tipo_error = true;
                    isValid = false;

                    if(this.message_error != null)
                        this.message_error = this.message_error + `<br />` + `É necessário selecionar o Tipo.`;
                    else
                        this.message_error = `É necessário selecionar o Tipo.`;

                    this.message_error_visible = true;

                }else{
                    this.tipo_error = false;
                }

                if(this.grupoProduto[1].length  <= 0){
                    this.grupo_erro = true;
                    isValid = false;

                    if(this.message_error != null)
                        this.message_error = this.message_error + `<br />` + `É necessário vincular um ou mais Grupo de Produtos.`;
                    else
                        this.message_error = `É necessário vincular um ou mais Grupo de Produtos.`;
                    
                    this.message_error_visible = true;
                }else{
                    this.grupo_erro = false;
                }

                if(this.estabPickList[1].length <= 0){
                    isValid = false;
                    this.stb_erro = true;
                    this.gselect_error = true;

                    
                    if(this.message_error != null)
                        this.message_error = this.message_error + `<br />` + `É necessário vincular um ou mais Estabelecimentos.`;
                    else
                        this.message_error = `É necessário vincular um ou mais Estabelecimentos.`;

                    this.message_error_visible = true;
                    
                    
                    //console.log(this.message_error);
                    //console.log(this.message_error_visible);

                }else{
                    this.stb_erro = false;
                }
                if(!isValid) {
                    this.$toast.add({
                        severity:'error',
                        detail:'Preencher os campos obrigatórios.', 
                        life: 3000
                    });
                }
                return isValid;
            },
            
            isCadastro() {
                return this.id == undefined || this.id == null || this.id == '';
            },

            isAtivo(){  
                if(this.isCadastro() && this.tipoClassificacaoSelecionado.tipoClassificacao == undefined){
                    return true;
                }                
            },

            voltar() {
                this.$router.push(`/grupo-classificacao`);
            },

            onCellEditComplete(event) {

                let { data, newValue, field } = event;

                if(newValue === undefined || newValue === null) return;
                
                if(field === 'codigoReferencia'){
                    data[field] = newValue;
                    return;
                }

                let optinsNumberParse = {style: 'decimal', currency: 'BRL', minimumFractionDigits: 1, maximumFractionDigits: 2};

                
                let newValueReplaced = this.converterNumero(newValue);
                
                console.log('field: ', field);
                console.log('newValue: ', newValue);
                console.log('newValueReplaced: ', newValueReplaced);

                if( isNaN(newValueReplaced) ){
                    this.$toast.add({
                         severity:'error',
                         detail:'O número digitado não é válido.', 
                         life: 3000
                    });
                    data[field] = 0;
                    return;
                }
                
                switch (field) {
                    case 'teorClassificacaoInicial':
                        optinsNumberParse.minimumFractionDigits = 1;
                        optinsNumberParse.maximumFractionDigits = 1;
                        data[field] = Number.parseFloat(newValueReplaced).toLocaleString('pt-BR', optinsNumberParse);
                        break;
                    case 'teorClassificacaoFinal':
                        optinsNumberParse.minimumFractionDigits = 1;
                        optinsNumberParse.maximumFractionDigits = 1;
                        data[field] = Number.parseFloat(newValueReplaced).toLocaleString('pt-BR', optinsNumberParse);
                        break;
                    case 'percentualDesconto':
                        optinsNumberParse.minimumFractionDigits = 1;
                        optinsNumberParse.maximumFractionDigits = 2;
                        data[field] = Number.parseFloat(newValueReplaced).toLocaleString('pt-BR', optinsNumberParse);
                        break;
                    case 'taxaSecagemQuilo':
                        optinsNumberParse.minimumFractionDigits = 1;
                        optinsNumberParse.maximumFractionDigits = 9;
                        data[field] = Number.parseFloat(newValueReplaced).toLocaleString('pt-BR', optinsNumberParse);
                        break;
                    case 'taxaSecagemValor':
                        optinsNumberParse.minimumFractionDigits = 2;
                        optinsNumberParse.maximumFractionDigits = 9;
                        data[field] = Number.parseFloat(newValueReplaced).toLocaleString('pt-BR', optinsNumberParse);
                        break;
                    default:
                        data[field] = newValueReplaced;
                        break;
                }               
            },
            
            uploadXlsAction(event) {
                const _this = this;
                const fileUpload = event;
                
                const regex = /(.xls|.xlsx)$/;
                if (regex.test(fileUpload.files[0].name.toLowerCase())) {
                    if (typeof (FileReader) != "undefined") {
                        const reader = new FileReader();
        
                        //Para navegadores diferentes do IE.
                        if (reader.readAsBinaryString) {
                            reader.onload = function (e) {
                                _this.carregarDetalhes(e.target.result);
                            };
                            reader.readAsBinaryString(fileUpload.files[0]);
                        } else {
                            //Para o navegador IE.
                            reader.onload = function (e) {
                                const bytes = new Uint8Array(e.target.result);
                                let data = "";
                                for (var i = 0; i < bytes.byteLength; i++) {
                                    data += String.fromCharCode(bytes[i]);
                                }
                                _this.carregarDetalhes(data);
                            };
                            reader.readAsArrayBuffer(fileUpload.files[0]);
                        }
                    } else {
                        this.message_error = "Este navegador não suporta HTML5.";
                        this.message_error_visible = true;
                        this.limparUpload();
                    }
                } else {
                    this.message_error = `Carregue um arquivo Excel válido!`;
                    this.message_error_visible = true;
                    this.limparUpload();
                }
            },

            carregarDetalhes(data) {
                const workbook = read(data, { type: 'binary' });
                const Sheet = workbook.SheetNames[0];
                const linhas = utils.sheet_to_json(workbook.Sheets[Sheet]);

                if(linhas.length <= 0) {
                    this.message_error = `A planilha carregada não possui dados!`;
                    this.message_error_visible = true;
                    this.limparUpload();
                    return;
                }
                
                if(!this.isColunasEstaoCorretas(linhas[0])) {
                    this.limparUpload();
                    return;
                }

                this.grupo.detalhes = [];

                //let optinsNumberParse = {style: 'decimal', currency: 'USD', minimumFractionDigits: 1, maximumFractionDigits: 2};
                let optinsNumberParse = {style: 'decimal', currency: 'BRL', minimumFractionDigits: 1, maximumFractionDigits: 2};
                

                for(let linha of linhas) {

                    console.log(linha["Taxa Secagem Valor"]);

                    const detalhe = {
                        teorClassificacaoInicial: linha["Teor Inicial"],
                        teorClassificacaoFinal: this.tipoClassificacaoSelecionado.teorPorFaixa ? linha["Teor Final"] : undefined,
                        phEntrada: this.tipoClassificacaoSelecionado.ph ? linha["PH Entrada"] : undefined,
                        percentualDesconto: this.tipoClassificacaoSelecionado.resultadoDesconto ? linha["% Desconto"] : undefined,
                        phCorrigido: this.tipoClassificacaoSelecionado.phCorrigido ? linha["PH Corrigido"] : undefined,
                        codigoReferencia: this.tipoClassificacaoSelecionado.referencia ? linha["Cód. Referência"] : undefined,
                        taxaSecagemQuilo: this.tipoClassificacaoSelecionado.resultadoTaxaSecagemKg ? linha["Taxa Secagem Kg"] : undefined,
                        taxaSecagemValor: this.tipoClassificacaoSelecionado.resultadoTaxaSecagemValor ? linha["Taxa Secagem Valor"] : undefined
                    };

                    if(detalhe.teorClassificacaoInicial !== undefined && detalhe.teorClassificacaoInicial !== null){
                        optinsNumberParse.minimumFractionDigits = 1;
                        optinsNumberParse.maximumFractionDigits = 1;

                        detalhe.teorClassificacaoInicial = Number.parseFloat(detalhe.teorClassificacaoInicial).toLocaleString('pt-BR', optinsNumberParse);

                    }
                    if(detalhe.teorClassificacaoFinal !== undefined && detalhe.teorClassificacaoFinal !== null){
                        optinsNumberParse.minimumFractionDigits = 1;
                        optinsNumberParse.maximumFractionDigits = 1;

                        detalhe.teorClassificacaoFinal = Number.parseFloat(detalhe.teorClassificacaoFinal).toLocaleString('pt-BR', optinsNumberParse);
                    }
                    // PhEntrada
                    if(detalhe.phEntrada !== undefined && detalhe.phEntrada !== null){
                        optinsNumberParse.minimumFractionDigits = 1;
                        optinsNumberParse.maximumFractionDigits = 1;

                        detalhe.phEntrada = Number.parseFloat(detalhe.phEntrada).toLocaleString('pt-BR', optinsNumberParse);
                    }
                    //phCorrigido
                    if(detalhe.phCorrigido !== undefined && detalhe.phCorrigido !== null){
                        optinsNumberParse.minimumFractionDigits = 1;
                        optinsNumberParse.maximumFractionDigits = 1;

                        detalhe.phCorrigido = Number.parseFloat(detalhe.phCorrigido).toLocaleString('pt-BR', optinsNumberParse);
                    }
                    //percentualDesconto
                    if(detalhe.percentualDesconto !== undefined && detalhe.percentualDesconto !== null){
                        optinsNumberParse.minimumFractionDigits = 1;
                        optinsNumberParse.maximumFractionDigits = 1;

                        detalhe.percentualDesconto = Number.parseFloat(detalhe.percentualDesconto).toLocaleString('pt-BR', optinsNumberParse);
                    }

                    if(detalhe.taxaSecagemQuilo !== undefined && detalhe.taxaSecagemQuilo !== null){
                        optinsNumberParse.minimumFractionDigits = 2;
                        optinsNumberParse.maximumFractionDigits = 9;

                        detalhe.taxaSecagemQuilo = Number.parseFloat(detalhe.taxaSecagemQuilo).toLocaleString('pt-BR', optinsNumberParse);

                    }

                    if(detalhe.taxaSecagemValor !== undefined && detalhe.taxaSecagemValor !== null){
                        console.log("Valor antigo: ", detalhe.taxaSecagemValor);
                        optinsNumberParse.minimumFractionDigits = 2;
                        optinsNumberParse.maximumFractionDigits = 9;

                        detalhe.taxaSecagemValor = Number.parseFloat(detalhe.taxaSecagemValor).toLocaleString('pt-BR', optinsNumberParse);
                        console.log("Valor novo: ", detalhe.taxaSecagemValor);
                    }

                    this.grupo.detalhes.push(detalhe); 
                }

                this.limparUpload();
            },

            limparUpload() {
                this.$refs.uploadXls.clear();
                this.$refs.uploadXls.uploadedFileCount = 0;
            },

            isColunasEstaoCorretas(dados) {
                const colunasObrigatorias = [];
                
                if(dados["Teor Inicial"] == undefined) {
                    colunasObrigatorias.push("Teor Inicial");
                }

                if(this.tipoClassificacaoSelecionado.teorPorFaixa && dados["Teor Final"] == undefined) {
                    colunasObrigatorias.push("Teor Final");
                }

                if(this.tipoClassificacaoSelecionado.ph && dados["PH Entrada"] == undefined) {
                    colunasObrigatorias.push("PH Entrada");
                }

                if(this.tipoClassificacaoSelecionado.resultadoDesconto && dados["% Desconto"] == undefined) {
                    colunasObrigatorias.push("% Desconto");
                }

                if(this.tipoClassificacaoSelecionado.phCorrigido && dados["PH Corrigido"] == undefined) {
                    colunasObrigatorias.push("PH Corrigido");
                }

                if(this.tipoClassificacaoSelecionado.referencia && dados["Cód. Referência"] == undefined) {
                    colunasObrigatorias.push("Cód. Referência");
                }

                if(this.tipoClassificacaoSelecionado.resultadoTaxaSecagemKg && dados["Taxa Secagem Kg"] == undefined) {
                    colunasObrigatorias.push("Taxa Secagem Kg");
                }
                
                if(this.tipoClassificacaoSelecionado.resultadoTaxaSecagemValor && dados["Taxa Secagem Valor"] == undefined) {
                    colunasObrigatorias.push("Taxa Secagem Valor");
                }

                const colunas = colunasObrigatorias.join("\", \"");
                if(colunasObrigatorias.length > 1) {
                    this.message_error = `A planilha não pode ser carregada devido não existirem as colunas "${ colunas }" que são obrigatórias para o tipo de classificação ${ this.tipoClassificacaoSelecionado.tipo }!`;
                    this.message_error_visible = true;

                    return false;
                }
                else if(colunasObrigatorias.length > 0) {
                    this.message_error = `A planilha não pode ser carregada devido não existir a coluna "${ colunas }" que é obrigatória para o tipo de classificação ${ this.tipoClassificacaoSelecionado.tipo }!`;
                    this.message_error_visible = true;

                    return false;
                }

                return true;
            },

            buscarReferencia(event) {
                const nome = !event.value.trim().length ? undefined : event.value;
                ProdutoReferenciaService.getProdutoReferenciaNome(nome)
                    .then(({ data }) => {
                        if(data) {
                            this.referenciasFiltradas = data;
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.referenciasFiltradas = [];
                    });
            },

            iniciarBuscaReferencia() {
                ProdutoReferenciaService.getProdutoReferenciaNome()
                    .then(({ data }) => {
                        if(data) {
                            this.referenciasFiltradas = data;
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.referenciasFiltradas = [];
                    });
            },

            selectReferenciaAction(event, value) {
                value = value.id;
            },
            
            ocultarInformacao(){
                this.informacaoDialog = false;
            },

            visualizarInformacao(paginaArea){
                this.paginaArea = paginaArea;
                this.informacaoDialog = true;
            },

            converterNumero(numero) {

                if (numero === undefined || numero === null) {
                    return NaN;
                }

                /** Dados Possíveis e resultado esperado
                 * 1,1       --> 1.1
                 * 1.1        --> 1.1
                 * 1.234,45   --> 1234.45
                 * 1,234.45   --> 1234.45
                 * 1234,45    --> 1234.45
                 * 1234.45    --> 1234.45
                 * 123.123,12 --> 123123.12
                 * 123,123.12 --> 123123.12
                 * 123.123.123,12 --> 123123.12
                 * 123,123,123.12 --> 123123.12
                 * 1          --> 1
                 * 12         --> 12
                 */

                let numeroString = String(numero);

                let lastIndexPonto = numeroString.lastIndexOf('.');
                let lastIndexVirgula = numeroString.lastIndexOf(',');

                let qtdPontos = 0;
                let qtdVirgulas = 0;

                if (lastIndexPonto !== -1) {
                    qtdPontos = (numeroString.match(/\./g) || []).length;
                }
                if (lastIndexVirgula !== -1) {
                    qtdVirgulas = numeroString.match(new RegExp(/,/g) || []).length;
                }

                if (qtdPontos > 1) {
                    //Se possui mais de 1 ponto
                    if (qtdVirgulas == 1) {
                        //precis possuir apenas 1 virgula
                        if (lastIndexVirgula > lastIndexPonto) {
                        //e a virgula precisa estar em último lugar, ou seja, ter o lastIndex da virgula maior que o lastIndex do ponto

                        //Esta ok
                    
                        } else { return NaN }
                    } else {return NaN }

                }

                if (qtdVirgulas > 1) {
                    //Se possui mais de 1 virgula (Numero americano EX: 2,123,123.00)
                    if (qtdPontos == 1) {
                        //precis possuir apenas 1 virgula
                        if (lastIndexPonto > lastIndexVirgula) {
                        //e o ponto precisa estar em último lugar, ou seja, ter o lastIndex do ponto maior que o lastIndex da virgula

                        //Esta ok
                    
                        } else { return NaN }
                    } else { return NaN }
                }


                if (lastIndexPonto === -1 && lastIndexVirgula === -1) {
                    //Numero Inteiro sem ponto e sem virgula
                    return parseFloat(numeroString);
                } else if (lastIndexPonto === -1 && lastIndexVirgula > 0) {
                    //Número com apenas vírgula
                    return parseFloat(numeroString.replace(',', '.'));
                } else if (lastIndexVirgula === -1 && lastIndexPonto > 0) {
                    //Número com apenas pontos
                    return parseFloat(numeroString);
                } else if (lastIndexVirgula > lastIndexPonto) {
                    //Padrão Brasileiro
                    //console.log('brasileiro');
                    let numeroFormatado = numeroString.replace(/\./g, '').replace(',', '.');
                    return parseFloat(numeroFormatado);
                } else if (lastIndexVirgula < lastIndexPonto) {
                    //console.log('americano');
                    //Padrão Americano
                    let numeroFormatado = numeroString.replace(",", '');
                    return parseFloat(numeroFormatado);
                }
            },

            gerarTitulo(){
                if(this.isApenasVisulizacao) return "Visualizar";

                if(this.isCadastro()){
                    return "Cadastrar";
                }
                else{
                    return "Editar";
                }
                

            }

        },
        mounted() { 
            if(this.isCadastro()) {
                this.carregarTipoClassificacao();
                this.carregarGruposProdutos();
                this.carregarSafras();
                this.carregarEstabelecimento();
            } else{
                this.carregarGrupoClassificacao(); 
            }
        },
        
        
    }
</script>

<style lang="scss" scoped>
::v-deep(.editable-cells-table td.p-cell-editing) {
    padding-top: 0;
    padding-bottom: 0;
}
</style>