<template>
    <div class="card">

        <Toast />

        <div class="flex align-items-center">
           <i class="pi pi-shopping-bag" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;"> Produtos</h3>
        </div>

        <hr />
        
        <DataTable 
            showGridlines
            responsiveLayout="stack"
            :value="produtos"
            selectionMode="single"
            v-model:selection="linhaSelecionada"
            @sort="sort($event)"       
        >

            <template #header>
                <div class="flex align-items-end" >
                    
                    <div class="col-3">
                        <label for="grupo"><strong>Grupo de Produtos</strong></label> 
                        <Dropdown id="tipo"
                            class="w-full mt-2"
                            v-model="filtro.GrupoProduto" 
                            :options="grupoProdutoOptions" 
                            optionLabel="codDesc" 
                            placeholder="Selecione"
                            @change="carregarProdutos()"/>
                    </div>

                    <div class="col-3" >
                        <label for="grupoProduto"><strong>Código / Nome</strong></label>
                        <InputText class="w-full mt-2" v-model="filtro.codigoNome" placeholder="Pesquisar" @change="carregarProdutos()"/>
                    </div>
                    
                    <div class="flex mb-2">
                        
                        <Button  type="button" 
                            label="Filtrar" 
                            class="p-button-outlined mr-2"
                            icon="pi pi-search" 
                            @click="carregarProdutos()"/>
                        <Button type="button" icon="pi pi-filter-slash" label="Limpar filtro" class="p-button-outlined mr-2" @click="limparFiltro()"/>
                        <Button v-if="integration.visible" type="button" label="Cadastrar" class="p-button-info mr-2" icon="pi pi-plus" @click="cadastrar()" />
                        <Button
                            v-if="situacao == 'ATIVO'"
                            type="button"
                            icon="pi pi-ban"
                            label="Listar inativos"
                            class="p-button-outlined p-button-danger mr-2"
                            style="padding: 0.4rem;"
                            @click="situacao = 'INATIVO'; limparFiltro(); carregarProdutos()"
                        ></Button>
                        <Button
                            v-if="situacao == 'INATIVO'"
                            type="button"
                            icon="pi pi-check-circle"
                            label="Listar ativos"
                            class="p-button-outlined mr-2"
                            style="padding: 0.4rem;"
                            @click="situacao = 'ATIVO'; limparFiltro(); carregarProdutos()"
                        ></Button>

                    </div>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="codItem" header="Código"  style="width:10rem;" />
            <Column field="descItem" header="Nome"  style="width:25rem;" />

            <Column field="descReferencia" header="Referências" style="width:12rem;" />

            <Column field="grupoProduto.fmCodigo" header="Grupo" style="width:5rem;" />

            <Column field="codItemAfCoop" header="Cooperado" style="width:5rem;" />
            <Column field="codItemAfTerc" header="Terceiro" style="width:5rem;" />
            
            <Column field="codItemFixaCoop" header="Cooperado" style="width:5rem;" />
            <Column field="codItemFicaTerc" header="Terceiro" style="width:5rem;" />

            <Column field="descricaoStatusIntegracao" header="Status Integração" style="width:8rem;">
                <template #body="{ data }">
                    {{ data.descricaoStatusIntegracao}}
                </template>
            </Column>

            <Column field="dataIntegração" header="Data Integração" style="width:9rem;">
                <template #body="{ data }">
                    {{ formatDateCustom(data.dataIntegracao, 'DD/MM/YYYY HH:mm:ss') }}
                </template>
            </Column>

            <ColumnGroup type="header">
            <Row>
                <Column header="Código" sortable="true" field="codItem" :rowspan="3" />
                <Column header="Nome" sortable="true" field="descItem" :rowspan="4" />                
            </Row>
            <Row>
                <Column header="Referências" :rowspan="4" />
                <Column header="Grupo" :rowspan="4" />
                <Column header="Produto à fixar" :colspan="2"/>
                <Column header="Produto fixação" :colspan="2" />                
                <Column header="Status Integração" :rowspan="4" />
                <Column header="Data Integração" :rowspan="4" />
                <Column header="Ações" :rowspan="4" />
            </Row>
            <Row>
                <Column header="Cooperado"/>
                <Column header="Terceiro"/>
                <Column header="Cooperado"/>
                <Column header="Terceiro"/>
                
            </Row>
        </ColumnGroup>

            <Column header="&nbsp;" style="width:12rem;">
                <template #body="{ data }">
                    <div class="flex-none">
                        <Button title="Visualizar" v-if="!integration.visible" icon="pi pi-eye" class="p-button-rounded p-button-outlined flex-none mr-2 mb-2" @click="editar(data.id)" />
                        <Button title="Editar" v-if="integration.visible && data.ativo" icon="pi pi-pencil" class="p-button-rounded p-button-info flex-none mr-2 mb-2" @click="editar(data.id)" />

                        <Button v-if="!data.ativo && integration.visible" icon="pi pi-ban" class="p-button-rounded p-button-danger flex-none mr-2 mb-2" title="Ativar" @click="confirmarAtivarOuInativar(data)" />
                        <Button v-if="data.ativo && integration.visible" icon="pi pi-check-circle" class="p-button-rounded p-button-sucess flex-none mr-2 mb-2" title="Inativar" @click="confirmarAtivarOuInativar(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <Paginator
            v-model:first="firstRow"
            :rows="qtdRegistro"
            :total-records="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage" />
    </div>

    <Dialog v-model:visible="ativarOuInativarDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <span>Deseja <strong>{{ produto.ativo ? 'Inativar' : 'ativar' }}</strong> o produto <strong>{{ produto.codItem }}</strong>?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarOuInativarDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()" />
        </template>
    </Dialog>
</template>

<script>
    import ProdutoService from '../../service/ProdutoService';
    import IntegracaoService from '../../service/IntegracaoService'
    import Formatacao from '../../utilities/Formatacao';
    import Paginator from 'primevue/paginator';
    import StorageService from '../../service/StorageService';
    import GrupoProdutoService from '../../service/GrupoProdutoService';

    export default {
        name: 'Produtos',
        components: { Paginator },
        data() {
            return {
                totalRegistro: 0,
                qtdRegistro: 10,
                pagina: 0,
                firstRow: 0,                
                produtos: [],
                filtro: {
                    codigoNome:null,
                    GrupoProduto:{
                        fmCodigo:null
                    }
                },
                codigoNome: null,
                integration: {},
                situacao: 'ATIVO',
                ordenar: 'codItem',
                produto: null,
                ativarOuInativarDialog: false,
                linhaSelecionada:{},

                grupoProdutoOptions: [],
                grupoProdutoSelecionado: null,

                storange: StorageService.getControlePagina("PRODUTOS"),
            }
        },
        created() {
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;
            
            //verifica se o filtro está vazio
            if(this.storange.default == undefined){
                this.filtro = this.storange.filtros;
            }

            this.getIntegrationOptons();
            this.carregarGrupoProduto();
            this.carregarProdutos();
            
        },
        methods: {
            getIntegrationOptons(){
                const paginaAtual = "PRODUTO";
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

            carregarProdutos() {
                ProdutoService.getProdutosPesquisa(this.pagina, this.qtdRegistro, this.ordenar, this.filtro, this.situacao)
                    .then(({ data }) => {
                        if(data) {
                            this.produtos = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalElements;

                            StorageService.setControlePaginaFilter("PRODUTOS", this.pagina, this.firstRow, this.qtdRegistro, this.filtro);
                        }
                    });
            },

            cadastrar() {
                this.$router.push(`/produto/cadastrar`);
            },

            editar(id) {
                this.$router.push(`/produto/editar/${id}`);
            },

            limparFiltro() {
                this.filtro = {
                    codigoNome:null,
                    GrupoProduto:{
                        fmCodigo:null
                    }
                };

                this.carregarGrupoProduto();

                this.carregarProdutos();
            },
                       
            
            confirmarAtivarOuInativar(produto) {
                this.produto = produto;
                this.ativarOuInativarDialog = true;
            },

            ativarOuInativar() {
                if(this.produto.ativo) {
                    ProdutoService.inativar(this.produto.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O produto ${ this.produto.codItem } foi inativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregarProdutos();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao inativar o produto ${ this.produto.codItem }!`, 
                                life: 3000
                            });
                        });
                }
                else {
                    ProdutoService.ativar(this.produto.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O produto ${ this.produto.codItem } foi ativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregarProdutos();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao ativar o produto ${ this.produto.codItem }!`, 
                                life: 3000
                            });
                        });
                }
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.produtos = [];
                this.carregarProdutos();
            },

            onPage(event) {      
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;                     
                this.carregarProdutos();
            },
           

            formatDateCustom(date, format) {
                return Formatacao.formatDateCustom(date, format);
            },

            carregarGrupoProduto(){
                GrupoProdutoService.listarGruposProdutos()
                    .then(({ data }) => {
                        if(data){
                            this.grupoProdutoOptions = data;
                            
                            this.grupoProdutoOptions.unshift({
                                    id: undefined,
                                    codDesc: "Todos",
                                });

                            if(this.filtro.GrupoProduto.fmCodigo === undefined || this.filtro.GrupoProduto.fmCodigo === null){
                                 this.filtro.GrupoProduto = this.grupoProdutoOptions[0];
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            },

        }
    }
</script>