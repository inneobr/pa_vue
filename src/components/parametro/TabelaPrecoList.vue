<template>
    <div class="card">       
        <div class="col-12 grid">
            <i class="pi pi-shopping-bag" style="font-size: 1.8rem"></i>
            <h3 style="margin:0px 5px;"> Tabela de Preços</h3>
        </div><hr />

        <DataTable 
            showGridlines     
            :value="tabelaPrecos" 
            selectionMode="single"
            scrollable="true"
            v-model:selection="preco">

            <template #header>
                <div class="grid justify-content-Left align-items-center">
                    <div class="col-12 xl:col-2">
                        <label for="estabelecimento"><strong>Estabelecimento</strong></label>
                        <AutoComplete class="w-full mt-1" id="estabelecimento" placeholder="Selecionar"
                            v-model="filtros.estabelecimento" field="codNome"
                            :suggestions="estabelecimentoOptions" :dropdown="true"
                            @complete="carregarEstabelecimento($event)" 
                            @keyup.enter="filtrar()"/>
                    </div>

                    <div class="col-12 xl:col-3">
                        <label for="familiaId"><strong>Grupo do Produto</strong></label>
                        <AutoComplete class="w-full mt-1" id="familiaId" placeholder="Selecionar"
                            v-model="filtros.grupoProduto" field="codDesc"
                            :suggestions="grupoProdutoOptions" :dropdown="true"
                            @complete="carregarGrupoProdutoOptions($event)" 
                            @keyup.enter="filtrar()"/>
                    </div>

                    <div class="col-12 xl:col-2">
                        <label for="codigoProdutoId"><strong>Código do Produto</strong></label>
                        <InputText class="w-full mt-1" id="codigoProdutoId" v-model="filtros.codigoProduto" @keyup.enter="filtrar()"/>
                    </div>

                    <div class="col-12 xl:col-5">
                        <Button 
                            label="Filtrar" 
                            class="p-button-outlined mt-4"
                            icon="pi pi-search" 
                            style="padding: 0.4rem;"
                            @click="filtrar"/>
                  
                        <Button  
                            label="Limpar Filtro" 
                            class="p-button-info ml-2 mt-4"
                            icon="pi pi-filter-slash" 
                            style="padding-top: 0.5rem; ; padding-right: 1.2rem; padding-left: 1.2rem"
                            @click="limparFiltro"/>
                    </div>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="codigoProduto" header="Item" style="max-width: 5rem;" sortable/>
            <Column field="descricaoProduto" header="Descrição" style="min-width: 30rem;" />
            <Column field="codigoReferencia" header="Referências" />
            <Column field="precoFiscal" header="Preço Fiscal" style="text-align: right; min-width: 10rem;">
                <template #body="{data}">
                    {{ 'R$ ' + formatDecimal(data.precoFiscal, 9, 9) }}
                </template>
            </Column>
            <Column field="precoFechamento" header="Preço Fechamento" style="text-align: right; min-width: 10rem;">
                <template #body="{data}">
                    {{ 'R$ ' + formatDecimal(data.precoFechamento, 9, 9) }}
                </template>
            </Column>
            <Column field="precoFechamentoCoco" header="Preço Fech. Coco" style="text-align: right; min-width: 10rem;">
                <template #body="{data}">
                    {{ 'R$ ' + formatDecimal(data.precoFechamentoCoco, 9, 9) }}
                </template>
            </Column>
            <Column field="dataValidade" header="Validade">
                <template #body="{ data }">
                    {{ formatDateCustom(data.dataValidade, 'DD/MM/YYYY') }}
                </template>
            </Column>
            <Column field="horaValidade" header="Hora da validade" />
        </DataTable>

        <Paginator 
            v-model:first="firstRow" 
            :rows="qtdRegistro" 
            :totalRecords="totalRegistro" 
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage"/>
    </div>
    <Toast />
</template>

<script>
import TabelaPrecosService from '../../service/TabelaPrecosService';
import EstabelecimentoService from '../../service/EstabelecimentoService';
import IntegracaoService from '../../service/IntegracaoService'
import StorageService from '../../service/StorageService';
import Formatacao from '../../utilities/Formatacao';
import GrupoProdutoService from '../../service/GrupoProdutoService';

const EstabelecimentoTodos = {
    id: null,
    codigo: null,
    nomeFantasia: "TODOS",
    idRegistro: null,
    codigoRegional: null,
    codNome: "TODOS",            
}

export default {

    data() {
        return {
            filtros: {
                estabelecimento:null,
                grupoProduto: null,
                codigoProduto: null,
            },
            preco: null,
            tabelaPrecos: [],
            grupoProdutoOptions: [],
            estabelecimentoOptions: [],
            totalRegistro: 0,
            qtdRegistro: 10,
            pagina: 0,
            firstRow: 0,
            integration: {},
            user: StorageService.getUser(),
            storange: StorageService.getControlePagina("TABELA_PRECO"),
        }
    },

    created() {
        this.pagina = this.storange.numero;
        this.firstRow = this.storange.firstRow;
        this.qtdRegistro = this.storange.qtdRegistro;
        this.filtros = this.storange.filtros ? this.storange.filtros : {};
    },

    mounted() {
        this.getIntegrationOptons();
        if (this.filtros.estabelecimento == null){
            this.carregarEstabelecimentoDoUsuario();
        }
        this.carregarTabelaPrecos();
    },

    methods: {
        getIntegrationOptons(){
            const paginaAtual = "TABELA_PRECO_FISCAL";
            IntegracaoService.getIntegrationOptions(paginaAtual)
                .then(({ data }) => {
                    if(data) {
                        this.integration = data;
                    }
                })
                .catch(error => {
                    this.$toast.add({
                        severity:'info', 
                        summary: 'PARÂMETROS DE PÁGINA NÂO DEFINIDOS', 
                        detail:'Você deve cadastrar os parâmetros para esta página no menu lateral em: Painel de Integrações.',
                        life: 10000
                    });
                });
        }, 

        carregarTabelaPrecos() {
            TabelaPrecosService.getPrecos(this.pagina, this.qtdRegistro, this.filtros)
                .then(({ data }) => {
                    if (data) {
                        this.tabelaPrecos = data.content;
                        this.qtdRegistro = data.pageable.pageSize;
                        this.totalRegistro = data.totalPages * this.qtdRegistro;
                        StorageService.setControlePaginaFilter("TABELA_PRECO", this.pagina, this.firstRow, this.qtdRegistro, this.filtros);
                    }
                })
                .catch(error => {
                    this.tabelaPrecos = [];
                });
        },
 
        sort(event) {
            const sortField = event.sortField;
            const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
            this.ordenar = `${ sortField },${sortOrder}`;
            this.todos = [];
            this.carregarTabelaPrecos();
        },
        
        formatDateCustom(date, format) {
            return Formatacao.formatDateCustom(date, format);
        },

        formatDecimal(value, minimumFractionDigits = 2, maximumFractionDigits = 2) {
            return Formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
        },
        
        carregarEstabelecimentoDoUsuario(){
            EstabelecimentoService.getEstabelecimentosPorCodigoOuDescricaoDoUsuariologado(this.user.estabelecimento)
                .then(({ data }) => {
                    if (data) {
                        this.filtros.estabelecimento = data[0];
                    }
                })
                .catch(error => {
                    this.filtros.estabelecimento = EstabelecimentoTodos;
                });
        },
                
        carregarEstabelecimento(event) { 
            EstabelecimentoService.getEstabelecimentosPorCodigoOuDescricaoDoUsuariologado(event.query)
                .then(({ data }) => {
                    if (data) {
                        console.log(data);
                        this.estabelecimentoOptions = [...data];
                        this.estabelecimentoOptions.unshift(EstabelecimentoTodos);
                    }
                })
                .catch(error => {
                    this.estabelecimentoOptions = [];
                    console.log('carregarEstabelecimento',error);
                });
        },

        getGrupoProdutoResumido(codigoOuDescricao){
            if (codigoOuDescricao)
                return GrupoProdutoService.getGrupoResumidoCodigoOuDescricao(codigoOuDescricao);
            else
                return GrupoProdutoService.getGruposTodosProdutoResumido();            
        },

        carregarGrupoProdutoOptions(event){
            this.getGrupoProdutoResumido(event.query)
                .then(({ data }) => {
                    this.grupoProdutoOptions = [...data];
                    this.grupoProdutoOptions.unshift({
                        id: null,
                        fmCodigo: null,
                        descricao: "TODOS",
                        codDesc: "TODOS",
                    });
                })
                .catch(error => {
                    this.grupoProdutoOptions = [];
                    console.log('carregarGrupoProdutoOptions',error);
                });
        },

        limparFiltro(){
            this.carregarEstabelecimentoDoUsuario();
            this.filtros.codigoProduto = null;
            this.filtros.grupoProduto = null;            
            this.pagina = 1;
            this.firstRow = 0;
            this.qtdRegistro = 10;
            this.totalRegistro = 0,            
            this.carregarTabelaPrecos();
        },

        onPage(event) {
            this.pagina = event.page + 1;
            this.firstRow = event.page * event.rows;
            this.qtdRegistro = event.rows;
            this.carregarTabelaPrecos();
        },

        filtrar() {
            this.pagina = 1;
            this.firstRow = 0;
            this.carregarTabelaPrecos();
        },
                
    },
}
</script>
