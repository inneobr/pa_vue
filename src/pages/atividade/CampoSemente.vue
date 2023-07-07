<template>
    <div class="card">
        <Toast />
        <div class="flex align-items-center">
            <i class="pi pi-cog mr-1" style="font-size: 1.4rem"></i>
            <h4 style="margin:0px 5px;">Campo semente</h4>
        </div>
        <hr />
        <div class="col-12 grid">
            <div class="col-12 xl:col-2">
                <label><strong>Estabelecimentos</strong></label>
                <AutoComplete class="w-full mt-2"
                    :suggestions="options.estabelecimentos"
                    @complete="getEstabelecimentos($event)"
                    v-model="estabelecimento"
                    @item-select="filtrar()"
                    :forceSelection="true"
                    placeholder="TODOS"
                    :dropdown="true"
                    field="codNome"/>
            </div>

            <div class="col-12 xl:col-2">
                <label><strong>Safra</strong></label> 
                <AutoComplete class="w-full mt-2"
                    :suggestions="options.safras"
                    @item-select="filtrar()"
                    @complete="getSafras()"
                    placeholder="TODAS"
                    v-model="safra"
                    :dropdown="true"
                    field="safra"/>
            </div>

            <div class="col-12 xl:col-2">
                <label><strong>Tipo Produto</strong></label>
                <AutoComplete class="w-full mt-2"
                    :suggestions="options.tiposProdutos"
                    v-model="tipoProduto"
                    @complete="getTipoProduto($event)"
                    @item-select="filtrar()"
                    placeholder="TODOS"
                    :forceSelection="true"
                    :dropdown="true"
                    field="nome"/>
            </div>

            <div class="col-12 xl:col-2">
                <label><strong>Grupo Produto</strong></label> 
                <AutoComplete class="w-full mt-2"
                    :suggestions="options.grupoProdutos"
                    @complete="getGrupoProduto($event)"
                    v-model="grupoProduto"
                    @item-select="filtrar()"
                    :forceSelection="true"
                    placeholder="TODOS"
                    :dropdown="true"
                    field="codDesc"/>
            </div>
            <div class="col-12 xl:col-2">
                <Button type="button" icon="pi pi-filter-slash" label="Limpar filtro" class="p-button-outlined mt-4" @click="limparFiltros()"/>
            </div>
        </div>  
        
        <div class="col-12 grid">
            <DataTable 
                v-model:selection="campoSemente"
                @row-select="getProdutores()"
                responsiveLayout="stack"
                selectionMode="single"
                showGridlines="true"             
                @sort="sort($event)"
                :value="database"   
                class="col-12 xl:col-5">

                <template #empty>
                    Nenhum registro encontrado.
                </template>

                <template #loading>
                    Carregando... Por favor, aguarde.
                </template>

                <Column field="ordemCampo" header="Nr. Ordem Campo"/>
                <Column field="descricaoClasse" header="Classe Semente"/>
                <Column field="imovel" header="Imóvel"/>
                <Column field="codProduto" header="Produto"/>
            
            </DataTable>

            <DataTable 
                @row-select="null"
                responsiveLayout="stack"
                selectionMode="single"
                showGridlines="true"             
                @sort="sort($event)"
                :value="laudoscampo"   
                class="col-12 xl:col-5">

                <template #empty>
                    Nenhum registro encontrado.
                </template>

                <template #loading>
                    Carregando... Por favor, aguarde.
                </template>

                <Column field="numeroLaudo" header="Nr. do Laudo"/>
                <Column field="producaoEsperada" header="Qtda. Esperada (Kg/Ha)"/>
                <Column field="areaAprovada" header="Área. Aprovada"/>
            
            </DataTable>

            <DataTable 
                responsiveLayout="stack"
                selectionMode="single"
                showGridlines="true"             
                @sort="sort($event)"
                :value="produtores"   
                class="col-12 xl:col-2">

                <template #empty>
                    Nenhum registro encontrado.
                </template>

                <template #loading>
                    Carregando... Por favor, aguarde.
                </template>

                <Column field="produtor.nome" header="Produtores"/>
            
            </DataTable>
        </div>
        <Paginator
                    v-model:first="firstRow"
                    :rows="qtdRegistro"
                    :total-records="totalRegistro"
                    :rowsPerPageOptions="[5, 10, 20, 30]"
                    @page="onPage" />
    </div>
</template>

<script>
    import EstabelecimentoService from '../../service/EstabelecimentoService';  
    import SementeClasseService from '../../service/SementeClasseService';
    import CampoProdutorService from '../../service/CampoProdutorService';
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import TipoProdutoService from '../../service/TipoProdutoService';
    import CampoLaudoService from '../../service/CampoLaudoService';   
    import StorageService from '../../service/StorageService';
    import SafraService from '../../service/SafraService';

    export default {
        data(){
            return { 
                pagina: 0,
                firstRow: 0,
                ordenar: null, 
                qtdRegistro: 10, 
                totalRegistro: 0,
                
                filter: {},
                options: {},
                database: [],
                produtores: [],
                laudoscampo: [],

                //filtros buscar campoSemente. 
                grupoProduto: null,
                tipoProduto: null,
                safra: null,
                estabelecimento: null,

                filterProdutor: {},
                campoSemente: null,
                storange: StorageService.getControlePagina("CAMPO_SEMENTE"),
            }
        },

        created() {
            if(this.storange.default == undefined){
                this.filtros = this.storange.filtros;
            }
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;

           this.getCampoFilter();
        },

        methods: {
            getEstabelecimentos(event) {     
                const dados = !event.query.trim().length ? 'a' : event.query;                
                EstabelecimentoService.getEstabelecimentosFiltroBuscaSiloUbs(dados)
                    .then(({ data }) => {                          
                        this.options.estabelecimentos = [...data];
                        this.options.estabelecimentos.unshift({
                            id: undefined,
                            codNome: "TODOS"
                        });
                    });
            },

            getGrupoProduto(event) {       
                const pesquisar = !event.query.trim().length ? 'a' : event.query;
                let filter = {
                    pesquisar: pesquisar,
                    tipoProduto: this.filter.tipoProduto
                } 
                
                if(filter.tipoProduto != null){
                    filter.tipoProduto = filter.tipoProduto.id;
                }
                GrupoProdutoService.getGrupoProdutoByTipoProduto(filter)
                    .then(({ data }) => {
                        if(data) {
                            this.options.grupoProdutos = [...data];
                            this.options.grupoProdutos.unshift({
                                id: undefined,
                                codDesc: "TODOS"
                            });
                        }
                    })
                    .catch(error => {
                        this.options.grupoProdutos = [];
                    });
            },            

            getTipoProduto(event){
                const dados = !event.query.trim().length ? 'a' : event.query;
                TipoProdutoService.getAutoComplete(dados)
                    .then(({ data }) => {
                        let predefinidos = [];
                        data.find(item => {
                            if(item.nome === "SOJA" || item.nome === "TRIGO" || item.nome === "AVEIA") {
                                predefinidos.push(item);
                            }
                        });                        
                        this.options.tiposProdutos = predefinidos;
                        this.filter.grupoProduto = [];
                    })
                    .catch(error => {
                        this.options.tiposProdutos = [];
                    });
            },

            getSafras(){
                SafraService.getTodasSafras()
                    .then(({ data }) => {
                        let safra = {
                            safra: "2023"
                        }
                        this.options.safras = [safra];
                        this.options.safras.unshift({safra: "TODAS"});
                    })
            },

            getCampoFilter(filtro){
                SementeClasseService.getCampoFilter(this.pagina, this.qtdRegistro, this.ordenar, filtro)
                    .then(({ data }) => {
                        this.database = data.content;
                        this.produtores = [];
                        this.laudoscampo = [];
                        this.qtdRegistro = data.pageable.pageSize;
                        this.totalRegistro = data.totalElements;
                    });
                    StorageService.setControlePaginaFilter("CAMPO_SEMENTE", this.pagina, this.firstRow, this.qtdRegistro, this.filtros);
            },

            getCampoProdutor(){               
                CampoProdutorService.getProdutor(this.filterProdutor)
                    .then(({ data }) => {
                        this.produtores = data;
                    });
            },

            getCampoLaudo(){               
                CampoLaudoService.getLaudo(this.filterProdutor)
                    .then(({ data }) => {
                        this.laudoscampo = data;
                    });
            },

            filtrar(){
                if(this.estabelecimento != null){
                    this.filter.codEstab = this.estabelecimento.codigo;
                }

                if(this.safra != null){
                    this.filter.safra = this.safra.safra;
                }

                if(this.tipoProduto != null){
                    this.filter.tipoProduto = this.tipoProduto;
                }

                if(this.grupoProduto != null){
                    this.filter.grupoProduto = this.grupoProduto.fmCodigo
                }
                
                this.getCampoFilter(this.filter);
            },

            limparFiltros(){
                this.safra = undefined;
                this.filter.safra = undefined;

                this.tipoProduto = undefined;
                this.filter.tipoProduto = undefined;

                this.grupoProduto = undefined;
                this.filter.grupoProduto = undefined;

                
                this.estabelecimento = undefined;
                this.filter.codEstab = undefined;
                this.filter.grupoProduto
                this.filtrar();
            },
            
            getProdutores(){    
                this.filterProdutor.safra = this.campoSemente.safra;
                this.filterProdutor.codEstab  = this.campoSemente.codEstab;
                this.filterProdutor.fmCodigo  = this.campoSemente.fmCodigo;
                this.filterProdutor.ordemCampo  = this.campoSemente.ordemCampo;
                this.filterProdutor.codClasse  = this.campoSemente.codClasse;
                this.getCampoProdutor();
                this.getCampoLaudo();
            },

            onPage(event) {          
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;                     
                this.getCampoFilter(this.filtros);
            },
        },
    }

</script>