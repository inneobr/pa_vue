<template>
    <div class="card">
        <div id="toolbar-title" class="flex justify-content-between">
            <div class="flex align-items-center">
                <i class="pi pi-check-square mr-2" style="font-size: 1.5rem;"></i>
                <h4 style="margin:0;">{{ id ? 'Editar' : 'Cadastrar'}}  Itens x Avariados</h4>
            </div>
        </div>
        <Toast />
        <Message v-if="message" severity="warn" :closable="false">{{ conteudo }}</Message><hr/>

        <div class="grid border-panel col-12">            
            <div class="col-12 xl:col-3">
                <label><strong>Descrição do Grupo<span style="color:red;">&nbsp;*</span></strong></label>
                <InputText class="w-full mt-2" :class="{'p-invalid': valid.descricao }" v-model="database.descricao"  :disabled="id"/>
            </div>

            <div class="col-12 xl:col-3">
                <label for="campoValidacao"><strong>Tipo de Validação<span style="color:red;">&nbsp;*</span></strong></label> 
                <Dropdown id="campoValidacao"
                    class="w-full mt-2"
                    :options="options.campoValidacao" 
                    optionValue="codigo"
                    optionLabel="descricao"               
                    placeholder="Selecione"
                    v-model="database.campoValidacao" 
                    :class="{'p-invalid': valid.campoValidacao }"
                    :disabled="id || disableCampoValidacao"
                    @change="carregarCampos()"/>
            </div> 

            <div class="col-12 xl:col-3">
                <label for="grupoProduto"><strong>Grupo De Produtos<span style="color:red;">&nbsp;*</span></strong></label>
                <AutoComplete                    
                    id="grupoProduto"
                    class="w-full mt-2"
                    :class="{'p-invalid': valid.grupo }"
                    field="codDesc"
                    v-model="grupoProdutoSelecionado"
                    :suggestions="options.grupoProduto"
                    @keyup.enter="filtrarGrupo($event)"
                    @complete="filtrarGrupo($event)"
                    @item-select="selecionarGrupoProduto()"   
                    :disabled="disableGrupo"                
                    dropdown="true"/>
            </div>
        </div>

        <TabView class="col-12">            
            <TabPanel >                
                <template #header>
                    <i class="pi pi-list mr-1" :class="{'warn': valid.parametros }" style="font-size: 1.3rem;"></i>
                    <span :class="{'warn': valid.parametros }">Parâmetros</span>
                </template>
                
                <div class="grid">
                    <div class="col-12 lg:col-2" v-show="disableInicial">
                        <label><strong>Chuv/Ava Inicial<span style="color:red;">&nbsp;*</span></strong></label>
                        <InputNumber mode="decimal" locale="de-DE" :minFractionDigits="2" :min="0" :max="1000" class="w-full mt-2" v-model="percentualInicial" :class="{ 'p-invalid': valid.percentualInicial }"/>
                    </div>

                    <div class="col-12 lg:col-2" v-show="disableFinal">
                        <label><strong>Chuv/Ava Final<span style="color:red;">&nbsp;*</span></strong></label>
                        <InputNumber mode="decimal" locale="de-DE" :minFractionDigits="2" :min="0" :max="1000" class="w-full mt-2" v-model="percentualFinal" :class="{ 'p-invalid': valid.percentualFinal }" />
                    </div> 

                    <div class="col-12 lg:col-2" v-show="disablePhInicial">
                        <label><strong>Ph Inicial<span style="color:red;">&nbsp;*</span></strong></label>
                        <InputNumber mode="decimal" locale="de-DE" :minFractionDigits="2" :min="0" :max="1000" class="w-full mt-2" v-model="phInicial"/>
                    </div>

                    <div class="col-12 lg:col-2" v-show="disablePhFinal">
                        <label><strong>Ph Final<span style="color:red;">&nbsp;*</span></strong></label>
                        <InputNumber mode="decimal" locale="de-DE" :minFractionDigits="2" :min="0" :max="1000" class="w-full mt-2" v-model="phFinal"/>
                    </div>  

                    <div class="col-12 lg:col-2" v-show="disableFntInicial && grupoProdutoSelecionado && grupoProdutoSelecionado.fnt">
                        <label><strong>FNT Inicial<span style="color:red;">&nbsp;*</span></strong></label>
                        <InputNumber mode="decimal" locale="de-DE" :minFractionDigits="2" :min="0" :max="1000" class="w-full mt-2" v-model="fntInicial"/>
                    </div>

                    <div class="col-12 lg:col-2" v-show="disableFntFinal && grupoProdutoSelecionado && grupoProdutoSelecionado.fnt">
                        <label><strong>FNT Final<span style="color:red;">&nbsp;*</span></strong></label>
                        <InputNumber mode="decimal" locale="de-DE" :minFractionDigits="2" :min="0" :max="1000" class="w-full mt-2" v-model="fntFinal"/>
                    </div> 
                </div>    
                <div class="grid">
                    <div class="col-12 lg:col-5">
                        <label for="produto"><strong>Produto<span style="color:red;">&nbsp;*</span></strong></label> 
                        <AutoComplete id="produto"
                            :class="{'p-invalid': valid.produto}"
                            @item-select="getReferencia()" 
                            :suggestions="options.produto"
                            @keyup.enter="filtrarProduto($event)"
                            v-model="produtoSelecionado"
                            :disabled="disableProduto"
                            @complete="filtrarProduto($event)"
                            field="codDescricao"
                            class="w-full mt-2"
                            dropdown="true"/>
                    </div>
 
                     <div class="col-12 lg:col-2">
                         <label for="referencia"><strong>Referência</strong></label> 
                         <AutoComplete id="referencia"
                            :class="{'p-invalid': valid.referencia}"
                            v-model="referenciaSelecionada"
                            :suggestions="options.referencia"
                            :disabled="disableReferencia"
                            @complete="getReferencia()"
                            class="w-full mt-2"
                            dropdown="true"
                            field="codRef"/>
                     </div>
 
                     <div class="col-12 lg:col-1">
                         <Button 
                            label="Incluir"
                            icon="pi pi-plus"
                            @click="incluir()"
                            :disabled="disableIncluir"
                            class="p-button-info mt-4 w-full"/>
                     </div>
                     
                    <DataTable :value="this.database.detalhes" 
                        selectionMode="single"
                        responsiveLayout="stack"
                        class="w-full"
                        dataKey="id">
                     
                         <div class="flex justify-content-between" style="width: 100%">
                             <div class="flex align-items-center mt-2">
                                 <h5>Parâmetros de Produtos</h5>
                             </div>
                         </div>
 
                         <template #empty>
                             Nenhum registro encontrado.
                         </template>
 
                        <Column field="percentualInicial" header="Chuv/Ava Inicial" style="padding-top: 8px; padding-bottom: 8px;"/>
                        <Column field="percentualFinal" header="Chuv/Ava Final"/>
                        <Column field="phInicial" header="Ph Inicial" v-if="disablePhInicial"/>
                        <Column field="phFinal" header="Ph Final" v-if="disablePhFinal"/>
                        <Column field="fntInicial" header="FNT Inicial" v-if="disableFntInicial && grupoProdutoSelecionado && grupoProdutoSelecionado.fnt"/>
                        <Column field="fntFinal" header="FNT Final" v-if="disableFntFinal && grupoProdutoSelecionado && grupoProdutoSelecionado.fnt"/>
                        <Column field="produto.descricao" header="Produto">
                            <template #body="{ data }">
                                {{ data.produto.codigo }} - {{ data.produto.descricao }}
                            </template>
                        </Column>
                        <Column field="produtoReferencia.codRef" header="Referência"></Column>
                        <Column header="Ações" alignFrozen="right" frozen>
                            <template #body="{ data, index }">
                                <div class="flex-none">                                                                                      
                                    <Button v-if = "isUltimo(index)" icon="pi pi-trash" class="p-button-rounded p-button-danger flex-none" @click="excluir(data)"/>
                                </div>
                            </template>
                        </Column>
                     </DataTable>
                 </div>                 
             </TabPanel>

             <TabPanel>
                <template #header>
                    <i class="pi pi-building mr-1" :class="{'warn': valid.estabelecimento}" style="font-size: 1.5rem;"></i>
                    <span :class="{'warn': valid.estabelecimento}">Estabelecimentos</span>
                </template>
                
                <PickList v-model="estabelecimentos" dataKey="id" listStyle="height:500px;">
                    <template #sourceheader>
                        Disponíveis
                    </template>
                    <template #targetheader>
                        Vinculados
                    </template>
                    <template #item="{ item }">
                        <span>{{ item.codigo }} - {{ item.nomeFantasia }}</span>
                    </template>
                </PickList>
            </TabPanel>
         </TabView>

         <div class="col-12 m-4">
            <Button :disabled="disableSalvar"
                class="p-button-info mr-1"
                icon="pi pi-save"
                @click="salvar()"
                label="Salvar"/>

            <Button class="p-button-danger"
                icon="pi pi-times"               
                @click="voltar()"
                label="Cancelar" />
        </div>
    </div>
 </template>
 
 <script>
    import ProdutoService from '../../service/ProdutoService';
    import TratamentoDeError from '../../utilities/TratamentoDeError';
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import ItensAvariadoService from '../../service/ItensAvariadoService';
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import ProdutoReferenciaService from '../../service/ProdutoReferenciaService';
 
     export default {  
        props: {
            id: {
                type: String,
                required: false
            },            
        },
 
        data() {
            return {
            contentGrupoProduto: [],
            expandedRows: [],
            database: {detalhes:[]},
            message: false,
            conteudo: null,
            options: {},
            valid: {},
            filter: {},
            filterGrupo: {},

            grupoProdutoSelecionado: null,
            referenciaSelecionada: null,
            produtoSelecionado: null,

            percentualInicial: null,
            percentualFinal: null,
            phInicial: null,
            phFinal: null,
            fntInicial: null,
            fntFinal: null,
            estabelecimentos: [[],[]],

            //Disable elementos
            disableInicial: false,
            disableFinal: false, 
            disablePhInicial: false,
            disablePhFinal: false,
            disableFntInicial: false,
            disableFntFinal: false,
            disableIncluir: true,
            disableSalvar: false,
            disableGrupo: false,
            disableProduto: true,
            disableReferencia: true,
            disableCampoValidacao: false,
            }
        },
 
            methods: {
            getItemAvariado(){
                if(!this.id) return;
                ItensAvariadoService.getItensAvariadoDetalhes(this.id)
                    .then(({ data }) => {
                        this.database = data;
                        this.carregarGrupo(data);
                        this.agrotinarGrupoProduto();
                        if(data.estabelecimentos) {
                            this.getEstabelecimentos(data.estabelecimentos);
                        }
                    });
            },

            carregarCampos(){                  
                if(this.database.campoValidacao===undefined){
                    this.$toast.add({
                        severity:'error',
                        detail:'Selecione o Tipo de Validação.',
                        life: 3000
                    });
                    return;
                }

                if(this.database.campoValidacao === 'PRODUTO'){
                    this.percentualInicial = 0;
                    this.percentualFinal = 100;   
                    this.disableInicial = false;
                    this.disableFinal = false; 
                    this.disablePhInicial = false;
                    this.disablePhFinal = false;    
                    this.disableFntInicial = false;
                    this.disableFntFinal = false;    
                }else if(this.database.campoValidacao === 'PH'){
                    this.percentualInicial = 0;
                    this.percentualFinal = 0;        
                    this.phInicial = 0;
                    this.phFinal = 0;
                    this.fntInicial = 0;
                    this.fntFinal = 0;

                    this.disableInicial = true;
                    this.disableFinal = true;       
                    this.disablePhInicial = true;
                    this.disablePhFinal = true; 
                    this.disableFntInicial = true;
                    this.disableFntFinal = true;
                }else{
                    this.percentualInicial = 0;
                    this.percentualFinal = 0;
                    this.disableInicial = true;
                    this.disableFinal = true;  
                    this.disablePhInicial = false;
                    this.disablePhFinal = false; 
                    this.disableFntInicial = false;
                    this.disableFntFinal = false;
                }

                
            },            

            getGrupoProduto(){
                GrupoProdutoService.getGrupoProdutoFilter(this.filterGrupo)
                        .then(({ data }) => {   
                            this.options.grupoProduto = [...data];                        
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'error',
                                detail: "Grupo de produto não encontrado",
                                life: 3000
                            });
                            this.options.grupoProduto = [];
                        });   
                },

            getProduto(){                             
                ProdutoService.getProdutoPorGrupoFilter(this.filter)
                    .then(({ data }) => { 
                        if(data){  
                            this.disableProduto = false;       
                            this.options.produto = [...data];  
                            this.disableIncluir = false;   
                        }                   
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'error',
                            detail: "Grupo não possui produtos cadastrados.",
                            life: 3000
                        });
                        this.produtoSelecionado = null;
                        this.options.produto = [];
                        this.disableProduto = false; 
                    });
            },

            filtrarGrupo(event){  
                if(event != null && event != undefined) {
                    const dados = !event.query.trim().length ? undefined : event.query;
                    this.filterGrupo.fmCodigoOudescricao = dados;
                }  
                
                if(this.database != undefined && this.database.campoValidacao != null && this.database.campoValidacao != undefined ){                   
                    this.filterGrupo.tipoAvariado = this.database.campoValidacao;
                }
                
                this.getGrupoProduto();                
            },

            selecionarGrupoProduto(event){   
                
                if(this.grupoProdutoSelecionado != null && this.grupoProdutoSelecionado != undefined){
                    this.getEstabelecimentos(this.database.estabelecimentos);
                    this.disableProduto = false;
                }else{
                    this.disableProduto = true;
                }
            },

            filtrarProduto(event){
                if(event != null && event != undefined){
                    const dados = !event.query.trim().length ? 'a' : event.query; 
                    this.filter.codigoNome = dados;
                }

                if(this.grupoProdutoSelecionado != null && this.grupoProdutoSelecionado != undefined){
                    this.filter.idGrupo = this.grupoProdutoSelecionado.id
                }

                if(this.filter.situacao == undefined){                    
                    this.filter.situacao = "ATIVO";
                }    

                this.getProduto();
            },

            getReferencia(){                
                ProdutoReferenciaService.getProdutoReferenciaPorProduto(this.produtoSelecionado.id)
                    .then(({ data }) => { 
                        if(data){   
                            this.disableReferencia = false;
                            this.options.referencia = [...data];     
                        }                   
                    })
                    .catch(error => {                       
                        this.$toast.add({
                            severity:'error',
                            detail: "Produto não possui referências cadastradas.",
                            life: 3000
                        });                       
                        this.options.referencia = [];
                        this.disableReferencia = true;
                    });
            },

            getEstabelecimentos(vinculados = []) {                
                if(this.database.campoValidacao == undefined || this.grupoProdutoSelecionado == undefined) return;              
                EstabelecimentoService.getTodosEstabelecimentosItemAvariadoSilo(this.database.campoValidacao, this.grupoProdutoSelecionado.id)
                    .then(({ data }) => {
                        if(data) {
                            const disponiveis = data.filter(disponivel => {
                                const item = vinculados.find(vinculado => {
                                    return vinculado.id === disponivel.id;
                                });
                                return item === undefined;
                            });    
                            this.estabelecimentos = [disponiveis, vinculados];
                        }
                        else {
                            this.estabelecimentos = [[], vinculados];
                        }
                    })
                    .catch(error => {
                        this.estabelecimentos = [[], vinculados];
                    });
            },

            incluir(){ 
                if(this.validarCampos()) return;
                this.disableGrupo = true;  
                this.disableCampoValidacao = true; 

                const produto = {
                    id: this.produtoSelecionado.id,
                    codigo: this.produtoSelecionado.codItem,
                    descricao: this.produtoSelecionado.descItem,
                }

                this.percentualInicial = this.percentualInicial;
                this.percentualFinal = this.percentualFinal;

                this.phInicial = this.phInicial;
                this.phFinal = this.phFinal;
                    
                const item = {                    
                    produto: produto,
                    percentualFinal: this.percentualFinal,
                    percentualInicial: this.percentualInicial,
                    phInicial: this.phInicial,
                    phFinal: this.phFinal,
                    phInicial: this.phInicial,
                    phFinal: this.phFinal,
                    fntInicial: this.fntInicial,
                    fntFinal: this.fntFinal,
                    grupoProduto: Object.assign({}, this.grupoProdutoSelecionado),                   
                    produtoReferencia: Object.assign({}, this.referenciaSelecionada),                   
                }  
                if(this.validarSequencia(item, this.database.campoValidacao)) return;

                this.database.detalhes.push(item);
                this.limparCampos();
                this.agrotinarGrupoProduto();
            },

            carregarGrupo(data){
                let grupo = {
                    id: data.detalhes[0].grupoProduto.id,
                    descricao: data.detalhes[0].grupoProduto.descricao,
                    fmCodigo: data.detalhes[0].grupoProduto.fmCodigo,
                    codDesc: data.detalhes[0].grupoProduto.fmCodigo + " - " + data.detalhes[0].grupoProduto.descricao,
                    fnt: data.detalhes[0].grupoProduto.fnt
                }
                this.grupoProdutoSelecionado = grupo;
                
                if(data.campoValidacao == "CHUVADO_AVARIADO"){
                    this.disableInicial = true;
                    this.disableFinal = true;
                    this.disablePhInicial = false;
                    this.disablePhFinal = false;
                    this.disableFntInicial = false;
                    this.disableFntFinal = false;
                }
                else if(data.campoValidacao == "PH"){
                    this.disableInicial = true;
                    this.disableFinal = true;
                    this.disablePhInicial = true;
                    this.disablePhFinal = true; 
                    this.disableFntInicial = true;
                    this.disableFntFinal = true;     
                }
                else if(data.campoValidacao == 'PRODUTO'){
                    this.disableInicial = false;
                    this.disableFinal = false; 
                    this.disablePhInicial = false;
                    this.disablePhFinal = false;    
                    this.disableFntInicial = false;
                    this.disableFntFinal = false;    
                }

                this.disableGrupo = true;
                this.disableProduto = false;
            },

            agrotinarGrupoProduto(){ 
                this.contentGrupoProduto = [];                               
                for(let item of this.database.detalhes){
                    let grupoProduto = this.contentGrupoProduto.find(itemGrupoProduto =>{
                        return itemGrupoProduto.id == item.grupoProduto.id;
                    });

                    if(grupoProduto == undefined){
                        grupoProduto = Object.assign({}, item.grupoProduto)
                        grupoProduto['produtos'] = this.database.detalhes.filter(ItemDetalhe => {
                            return item.grupoProduto.id == ItemDetalhe.grupoProduto.id;                                      
                        });
                        this.contentGrupoProduto.push(grupoProduto);
                    }                   
                } 
            },

            validarSequencia(item, campoValidacao){
                let isVinculado = false;
                this.database.detalhes.find(data => {
                    if(campoValidacao === "CHUVADO_AVARIADO" && data.percentualFinal >= item.percentualInicial){
                        this.$toast.add({
                            severity:'error',
                            summary: 'CHUVADO/AVARIADO INVÁLIDO', 
                            detail:'"Chuv/Ava Inicial" não pode ser menor ou igual "Chuv/Ava Final do produto anterior!"',
                            life: 9000
                        });
                        this.valid.percentualInicial = true;
                        this.valid.percentualFinal = true;
                        isVinculado = true;
                    }
                });
                return isVinculado;
            },

            isUltimo(index){                
                if(index  == (this.database.detalhes.length - 1)){
                    return true;
                }
                return false;
            },

            excluir(dados){
                let indice = this.database.detalhes.findIndex(detalhe => {
                    return detalhe.produto.id == dados.produto.id 
                        && detalhe.grupoProduto.id == dados.grupoProduto.id
                        && (!this.isEmpty(detalhe.produtoReferencia) && !this.isEmpty(dados.produtoReferencia)
                        && detalhe.produtoReferencia.id == dados.produtoReferencia.id)
                        && detalhe.percentualInicial == dados.percentualInicial
                        && detalhe.percentualFinal == dados.percentualFinal
                    });
                const prod = this.database.detalhes.splice(indice, 1);
                
                if(this.database.detalhes.length == 0){
                    this.limparCampos();
                    this.disableProduto = false;
                    this.disableGrupo = false;  
                    this.disableIncluir = true; 
                    this.disableReferencia = true;    

                }
                this.agrotinarGrupoProduto();
            },

            isEmpty(valor){
                return valor == undefined || valor == null;
            },

            validarCampos(){
                let invalid = false;
                this.valid.grupo = false;
                this.valid.produto = false;
                this.valid.campoValidacao = false;
                this.valid.percentualFinal = false;
                this.valid.percentualInicial = false;
                
                if(!this.grupoProdutoSelecionado){
                    this.$toast.add({
                        severity:'error',
                        detail:'Selecione um "Grupo de Produto".',
                        life: 3000
                    });
                    this.valid.grupo = true;
                    invalid = true;
                }

                if(!this.produtoSelecionado.codItem){
                    this.$toast.add({
                        severity:'error',
                        detail:'Selecione um "Produto".',
                        life: 3000
                    });
                    this.valid.produto = true;
                    invalid = true;
                }

                if(this.percentualInicial > this.percentualFinal){
                    this.$toast.add({
                        severity:'error',
                        detail:'"Chuv/Ava Inicial" não pode ser maior que "Chuv/Ava Final"',
                        life: 3000
                    });
                    this.valid.percentualInicial = true;
                    this.valid.percentualFinal = true;
                    invalid = true;
                }

                if(this.database.campoValidacao == undefined){
                    this.$toast.add({
                        severity:'error',
                        detail:'Selecione um tipo de validação para continuar".',
                        life: 3000
                    });
                    this.valid.campoValidacao = true;
                    invalid = true;
                }

                if(this.database.campoValidacao === "CHUVADO_AVARIADO") {                    
                    if(this.percentualInicial < 0) {
                        this.$toast.add({
                            severity:'error',
                            detail:'Necessário informar "Chuv/Ava Inicial".',
                            life: 3000
                        });
                        this.valid.percentualInicial = true;
                        invalid = true;
                    }

                    if(!this.percentualFinal) {
                        this.$toast.add({
                            severity:'error',
                            detail:'Necessário informar "Chuv/Ava Final".',
                            life: 3000
                        });
                        this.valid.percentualFinal = true;
                        invalid = true;
                    }
                }

                if(this.database.campoValidacao === "PH") {
                    if(this.percentualInicial < 0) {
                        this.$toast.add({
                            severity:'error',
                            detail:'Necessário informar "Chuv/Ava Inicial".',
                            life: 3000
                        });
                        this.valid.percentualInicial = true;
                        invalid = true;
                    }

                    if(!this.percentualFinal) {
                        this.$toast.add({
                            severity:'error',
                            detail:'Necessário informar "Chuv/Ava Final".',
                            life: 3000
                        });
                        this.valid.percentualFinal = true;
                        invalid = true;
                    }
                }
                return invalid;
            },

            getDados(){
                let invalid = false;
                
                this.message = false;
                this.valid.estabelecimento = false;
                this.conteudo = '';
                this.valid.parametros = false;
                
                if(!this.database.descricao) {
                    this.conteudo = "Preencha o campo Descrição!";
                    this.message = true;
                    invalid = true;
                } 
                
                if(!this.database.campoValidacao){
                    this.conteudo = "Selecione um Tipo de Validação!";
                    this.message = true;
                    invalid = true;
                } 

                if(this.estabelecimentos[1].length == 0){
                    this.conteudo = "Selecione ao menos um estabelecimento!";
                    this.message = true;
                    this.estabelecimento = true;
                    invalid = true;
                } 
                
                if(this.contentGrupoProduto.length == 0){
                    this.conteudo = "Defina os parâmetros do item!";
                    this.message = true;
                    this.valid.parametros = true;
                    invalid = true;
                }   
                return invalid;
            },

            salvar(){          
                if(this.getDados()) return; this.disableSalvar = true;  
                this.database.estabelecimentos = this.estabelecimentos[1];

                console.log(JSON.stringify(this.database));
                if(!this.id){      
                    ItensAvariadoService.salvar(this.database)
                    .then(({ data }) => {  
                        this.$toast.add({
                            severity:'error',
                            detail:'"Item avariado cadastrado com sucesso!"',
                            life: 3000
                        });                      
                        this.voltar();
                    })
                    .catch(error => {
                        this.$toast.add(TratamentoDeError(error, false));
                        this.disableSalvar = false;
                    });

                }else{
                    ItensAvariadoService.atualizar(this.database)
                    .then(({ data }) => {
                        this.$toast.add({
                            severity:'error',
                            detail:'"Item avariado atualizado com sucesso!"',
                            life: 3000
                        }); 
                        this.voltar();
                    })
                    .catch(error => {                        
                        this.$toast.add(TratamentoDeError(error, true));
                        this.disableSalvar = false;
                    });
                }
            },

            limparCampos(){ 
                if(this.database.campoValidacao === "CHUVADO_AVARIADO"){
                    this.percentualInicial = null;
                    this.percentualFinal = null;
                    this.phInicial = null;
                    this.phFinal = null;
                }
                this.produtoSelecionado = null;
                this.referenciaSelecionada = null;
            },

            voltar() {
                this.$router.push(`/itens-avariados`);
            },

            setup(){
                this.valid.descricao  = false;
                this.valid.parametros = false;
                this.valid.grupo = false;
                this.valid.produto =false;
                this.valid.referencia =false;
            },
        },

        created() { 
            this.getItemAvariado(); 
            if(!this.id){
                this.getEstabelecimentos();
            };
        },
 
         mounted() {
             this.options.campoValidacao = [
                 {codigo: "CHUVADO_AVARIADO", descricao: "Chuvado Avariado" },
                 {codigo: "PRODUTO", descricao: "Produto" },
                 {codigo: "PH", descricao: "Ph" }
             ],
             this.setup();
         },
     }
 </script>