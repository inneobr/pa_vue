<template>
    <div class="card">
        <Toast />
        <div class="flex align-items-center">
            <i class="pi pi-cog mr-1" style="font-size: 1.4rem"></i>
            <h4 style="margin:0px 5px;">Itens x Avariados</h4>
        </div>
        <hr />

        <div class="grid col-12">
            <div class="col-12 xl:col-3">
                <label><strong>Grupo De Produtos</strong></label>
                <AutoComplete 
                    v-model="grupoProduto"
                    @complete="getGrupoProduto($event)"
                    :suggestions="options.grupoProduto" 
                    placeholder="Todos"
                    field="codDesc"  
                    class="w-full mt-2"
                    dropdown="true"
                    @item-select="filtrar()"
                    @keyup.enter="filtrar()"/>
            </div>
        
            <div class="col-12 xl:col-3">
                <label for="estabelecimento"><strong>Estabelecimentos</strong></label> 
                <AutoComplete 
                    v-model="estabelecimento"
                    @complete="getEstabelecimentos($event)"
                    :suggestions="options.estabelecimento"
                    placeholder="Todos"
                    class="w-full mt-2"
                    :dropdown="true"
                    field="codNome"
                    @item-select="filtrar()"
                    @keyup.enter="filtrar()"
                    @sort="onSort($event)"/>                
            </div>

            <div class="col-12: xl:col-4 mt-4">   
                <Button v-if="visible" type="button" 
                    icon="pi pi-plus" 
                    label="Cadastrar"  
                    @click="cadastrar()" 
                    class="p-button-info"/>

                <Button type="button" 
                    label="Filtrar"   
                    icon="pi pi-filter" 
                    @click="filtrar()"
                    class="p-button-outlined ml-2" />
                            
                <Button type="button" 
                    label="Limpar filtro"   
                    icon="pi pi-filter-slash" 
                    @click="limparFiltros()"
                    class="p-button-outlined ml-2" />
            </div>
        </div>
    
    <DataTable :value="content" 
            dataKey="id"
            selectionMode="single"
            class="col-12 lg:col-12"
            responsiveLayout="stack"
            v-model:selection="selecionado">

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>
            
            <Column field="id" header="Id"/>
            <Column field="descricao" header="Descrição" sortable/>
            <Column field="grupoProduto.codDesc" header="Grupo Produto" sortable/>
            <Column field="campoValidacao" header="Tipo validação" sortable/>            
            <Column field="statusIntegracao" header="Status Integração" sortable/>
            <Column field="dataIntegracao" header="Integração">
                <template #body="{ data }">
                    {{ formatDateCustom(data.dataAtualizacao, 'DD/MM/YYYY HH:mm:ss') }}
                </template>
            </Column>
            <Column header="Ações"> 
                <template #body="{ data }">
                    <div class="flex-none">
                        <Button title="Visualizar Grupo de Produtos" class="p-button-rounded p-button-secondary flex-none mr-2 mb-2"  icon="pi pi-shopping-bag" @click="visualizarGrupoProduto(data)"/>
                        <Button title="Estabelecimentos Vinculados" icon="pi pi-home" class="p-button-rounded p-button-success flex-none mr-2 mb-2" @click="openDialog(data)"></Button>
                        <Button title="Visualizar Hitórico" icon="pi pi-list" class="p-button-rounded p-button-warning flex-none mr-2 mb-2" @click="visualizarHistorico(data.id)"></Button>
                        <Button title="Editar" v-if="integration.visible" icon="pi pi-pencil" class="p-button-rounded p-button-info align-items-center flex-none mr-2 mb-2" @click="editar(data.id)"></Button>
                        <Button title="Deletar" v-if="integration.visible" icon="pi pi-trash" class="p-button-rounded p-button-danger align-items-center flex-none mr-2 mb-2" @click="deletar(data.id)"/>
                        <Button v-if="integration.visible" class="p-button-rounded p-button-warning mb-2" icon="pi pi-send" title="Sincronizar com ERP" @click="sincronizar(data.id)"></Button>                    
                    </div>
                </template>
            </Column>        
    </DataTable>

    <ItensAvariadoHistoricos
        :tipoPagina="tipoPagina"
        :idRegistro="idItensAvariado"
        :visivel="historicoDialog"
        @fechar="ocultarHistorico()"/>

    <ItemAvariadoEstabelecimentos 
        :id="idItensAvariado"
        :visible="estabeDialog"
        :description="description"
        @fechar="closeDialog"/>

    <ItemAvariadoDetalhes 
        :id="idItensAvariado"
        :visible="detalhesDialog"
        :description="description"
        @fechar="ocultarGrupoProduto"/>    

    <Paginator
        v-model:first="firstRow"
        :rows="qtdRegistro"
        :total-records="totalRegistro"
        :rowsPerPageOptions="[5, 10, 20, 30]"
        @page="onPage" />
    </div>
</template>

<script>
    import ItemAvariadoEstabelecimentos from '../../components/parametro/ItemAvariadoEstabelecimentos.vue'
    import ItemAvariadoDetalhes from '../../components/parametro/ItemAvariadoDetalhes.vue'
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import ItensAvariadoService from '../../service/ItensAvariadoService';
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import ItensAvariadoHistoricos from './ItensAvariadoHistoricos.vue';
    import IntegracaoService from '../../service/IntegracaoService';
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        components: { ItensAvariadoHistoricos , ItemAvariadoEstabelecimentos, ItemAvariadoDetalhes},
        data() {
            return {
                pagina: 0,
                firstRow: 0,
                totalRegistro: 0,
                qtdRegistro: 10, 
                
                sort: null,

                filtros: {}, 
                options: {},
                filtroEstabe: {},
                filtroFrupo: {},
                grupoProduto: null,
                estabelecimento: null,
                
                item: null,
                content: [],          
                expandedRows: [],
                ativarDialog: false,

                integration: {},
                detalhesDialog: false,
                historicoDialog: false,
                idItensAvariado: null,
                visible: true,
                isAtivo: null,
                selecionado: null,
                
                description: null,
                estabeDialog: false,
                storange: StorageService.getControlePagina("ITEM_AVARIADO"),
            }
        },

        created() {   
            if(this.storange.default == undefined) {
                this.grupoProduto = this.storange.filtros.grupoProduto;
                this.estabelecimento = this.storange.filtros.estabelecimento;
                this.getFiltros(this.grupoProduto, this.estabelecimento);
            } 
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;
            this.carregarItensAvariado();
            this.getIntegrationOptons();
        },

        methods: {  
            getIntegrationOptons(){
                const paginaAtual = "ITEM_AVARIADO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                            this.visible = data.visible;
                        }
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'info', 
                            summary: 'PARÂMETROS DE PÁGINA NÂO DEFINIDOS', 
                            detail:'Você deve cadastrar os parâmetros para esta página no menu lateral em item: Parâmetros de Integração.',
                            life: 10000
                        });
                    });
            },

            openDialog(data){
                this.description = data.descricao;
                this.idItensAvariado = data.id;
                this.estabeDialog = true;
            },

            closeDialog(){
                this.idItensAvariado = null;
                this.estabeDialog = false;
                this.description = null;
            },

            sincronizar(id){
                console.log(id);
                ItensAvariadoService.sincronizar(id)
                    .then(({ data }) => {
                        this.$toast.add({
                            severity:'success',
                            detail:`Sincronizado com sucesso!`, 
                            life: 3000
                        });     
                        this.carregarItensAvariado(); 
                    }).catch(error => {
                        this.$toast.add({
                            severity:'success',
                            detail:`Não foi possivel sincronizar o item avariado!`, 
                            life: 3000
                        });     
                    });     
            },

            carregarItensAvariado(filtros = {}) {                
                StorageService.setControlePaginaFilter("ITEM_AVARIADO", this.pagina, this.firstRow, this.qtdRegistro, this.filtros);               
                ItensAvariadoService.getItensAvariado(this.pagina, this.qtdRegistro, this.sort, filtros)
                    .then(({ data }) => {
                        this.content = data.content;
                        this.qtdRegistro = data.pageable.pageSize;
                        this.totalRegistro = data.totalPages * this.qtdRegistro;
                    });
                   
            },

            getGrupoProduto(event) {
                setTimeout(() => {                      
                    const dados = !event.query.trim().length ? 'soja' : event.query;
                    this.filtroFrupo.pesquisar = dados;
                    GrupoProdutoService.getGrupoProdutoBuscarFilter(this.filtroFrupo)
                        .then(({ data }) => {
                            if(data) {
                                this.options.grupoProduto = [...data];
                            }
                        })
                        .catch(error => {
                            this.options.grupoProduto = [];
                        });                 
                }, 1000);
            },

            getEstabelecimentos(event) {     
                this.filtroEstabe.pesquisar = !event.query.trim().length ? 'a' : event.query;
                EstabelecimentoService.getEstabelecimentosFiltroBuscaSilo(this.filtroEstabe)
                    .then(({ data }) => {
                        if(data) {
                            this.options.estabelecimento = [...data];
                        }
                    })
                    .catch(error => {
                        this.options.estabelecimento = [];
                    });
            }, 

            formatDateCustom(date, format) {
                return Formatacao.formatDateCustom(date, format);

            },

            editar(id) {
                this.$router.push(`/itens-avariados/editar/${ id }`);
            },         

            deletar(id) {                
                ItensAvariadoService.deletar(id)
                    .then(response => {
                        this.$toast.add({
                            severity:'success',
                            detail:`O Item Avariado foi deletado com sucesso!`, 
                            life: 3000
                        });     
                        this.carregarItensAvariado();                  
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'warn',
                            detail:`Não foi possivel deletar o item selecionado!`, 
                            life: 10000
                        });        
                        this.carregarItensAvariado();                
                    });       
            },

            confirmarAtivarOuInativar(data) {
                this.isAtivo = data.ativo;
                this.item = data;
                this. ativarDialog = true;
            },

            collapseAll() {
                this.expandedRows = null;
            },

            visualizarHistorico(id) {
                this.historicoDialog = true;
                this.idItensAvariado = id;
            },

            visualizarGrupoProduto(data){
                this.description = data.descricao;
                this.idItensAvariado = data.id;
                this.detalhesDialog = true;
            },

            ocultarGrupoProduto(){
                this.description = null;
                this.idItensAvariado = null;
                this.detalhesDialog = false;
            },

            ocultarHistorico(){
                this.historicoDialog = false;
                this.idItensAvariado = null;
            },

            cadastrar() {
                this.$router.push(`/itens-avariados/cadastrar`);
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows; 
                this.carregarItensAvariado();                
            }, 

            onSort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.sort = `${ sortField }` + `,id,${sortOrder}`;
                this.carregarItensAvariado();
            },

            limparFiltros(){
                StorageService.setControlePaginaFilter(null);
                window.location.reload();            
            },
            
            filtrar() {
                if(this.grupoProduto != undefined){
                    this.filtros.grupoProduto = this.grupoProduto.id;
                } 

                if(this.estabelecimento != undefined){
                    this.filtros.estabelecimento = this.estabelecimento.id;
                }
                                        
                this.carregarItensAvariado(this.filtros);
            },

            getFiltros(idGrupo, idEstab){
                if(idGrupo != null && idGrupo != undefined){
                    GrupoProdutoService.getGrupoPorid(idGrupo)
                        .then(({ data }) => {
                            this.grupoProduto = data;
                            this.filtros.grupoProduto = data.id;
                        });
                }

                if(idEstab != null && idEstab != undefined){
                    EstabelecimentoService.getEstabelecimentosPorId(idEstab)
                        .then(({ data }) => {
                            this.estabelecimento = data;
                            this.filtros.estabelecimento = data.id;
                        });
                }
                this.carregarItensAvariado(this.filtros);
            }
        }, 
    }
</script>

