<template>
    <div class="card">
        <div class="flex justify-content-between">
            <div class="flex align-items-center">
                <i class="pi pi-cog mr-2" style="font-size: 2rem;"></i>
                <h4 style="margin:0;">Natureza Operação Tributada</h4>
            </div>
        </div><hr />

        <DataTable :value="database" 
            responsiveLayout="stack" 
            selectionMode="single"
            @sort="onSort($event)">

            <template #header>
                <div class="flex justify-content-between">
                    <div class="flex">
                        <Button v-if="integration.visible" type="button" label="Cadastrar" class="p-button-info mr-1" icon="pi pi-plus" @click="cadastrar()" />
                        <Button type="button" icon="pi pi-filter-slash" label="Limpar filtro" class="p-button-outlined mr-1" @click="limparFiltro()"/>
                        <Button type="button" icon="pi pi-filter" label="filtrar" class="p-button-outlined" @click="filtrar()"/>
                    </div>

                    <span class="p-input-icon-right">
                        <i class="pi pi-search" />
                        <InputText v-model="pesquisar" placeholder="Pesquisar" @keyup.enter="filtrar()" />
                    </span>
                </div>
            </template>
            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="descricao" header="Natureza de Operação Tributada" sortable/>
           
            <Column header="Integração">
                <template #body="{ data }">
                    {{ formatDate(data.dataIntegracao, 'DD/MM/YYYY HH:mm:ss') }}
                </template>
            </Column>    

            <Column header="Ações" style="width:14.5rem;">
                <template #body="{ data }">
                    
                    <Button title="Visualizar Grupos" icon="pi pi-shopping-bag" class="p-button-rounded p-button-secondary flex-none mr-2 mb-2" @click="getGruposProduto(data.id)"></Button>
                    <Button title="Visualizar Estabelecimentos" icon="pi pi-home" class="p-button-rounded p-button-success flex-none mr-2 mb-2" @click="getEstabelecimentos(data.id)"></Button>
                    <Button title="Visualizar Histórico" icon="pi pi-list" class="p-button-rounded p-button-warning flex-none mr-2 mb-2" @click="getHistorico(data.id)"></Button>
                    <Button title="Visualizar Natureza" v-if="!integration.visible" icon="pi pi-eye" class="p-button-rounded p-button-info mr-2 mb-2" @click="editar(data.id)" /> 
                    <Button title="Editar" v-if="integration.visible" icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2 mb-2" @click="editar(data.id)" /> 
                    <Button title="Excluir" v-if="integration.visible" icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2 mb-2" @click="confirmarExcluir(data.id)" />                                   
                </template>
            </Column>
            
            <template #expansion="row">
                <div style="width:97%; float:right;">
                    <DataTable selectionMode="single" :value="row.data.grupoProdutoNaturezaTributariaDto" responsiveLayout="stack" v-if="row.data.grupoProdutoNaturezaTributariaDto.length">
                        <Column field="codigoDescricao" header="Grupo de produtos"/>            
                    </DataTable>
                </div>
            </template>
        </DataTable>
        <Paginator
            v-model:first="firstRow"
            :rows="qtdRegistro"
            :total-records="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage" /> 
    </div>

    <Dialog v-model:visible="excluirDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Deseja excluír a natureza de operação tributada <strong>{{ database.descricao }}</strong>?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="excluirDialog = false" />            
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="deleteNaturezaTriburaria()" />
        </template>
    </Dialog>

    <NaturezaTributariaEstabelecimentos
        :idNatureza="idNatureza"
        :visivel="dialogEstabelecimentos"
        @fechar="closeEstabelecimentos()"/>

    <NaturezaTributariaGrupoProduto
        :idNatureza="idNatureza"
        :visivel="dialogGrupoProduto"
        @fechar="closeGrupoProdutos()"/>    

    <NaturezaTributariaHistoricos
        :idNatureza="idNatureza"
        :visivel="dialogHistorico"
        @fechar="closeHistorico()"/>

    <Toast />
</template>

<script>
    import NaturezaTributariaEstabelecimentos from './NaturezaTributariaEstabelecimentos.vue';
    import NaturezaTributariaGrupoProduto from './NaturezaTributariaGrupoProduto.vue';
    import NaturezaTributariaService from '../../service/NaturezaTributariaService';
    import NaturezaTributariaHistoricos from './NaturezaTributariaHistoricos.vue';
    import IntegracaoService from '../../service/IntegracaoService';
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';
    
    export default {
        components: { NaturezaTributariaEstabelecimentos, NaturezaTributariaHistoricos, NaturezaTributariaGrupoProduto },
        data() {
            return {
                pagina: 0,
                firstRow:0,
                qtdRegistro: 10,
                totalRegistro: 0,

                //Parametros de modais
                idNatureza: null,
                excluirDialog: false,
                dialogHistorico: false,
                dialogGrupoProduto: false,
                dialogEstabelecimentos: false,

                filtros: {},
                database: [],
                ordenar: null,
                pesquisar: null,
                integration: {},
                expandedRows: [], 
                storange: StorageService.getControlePagina("NATUREZA_TRIBURARIA"),
            }
        },

        created() {
            if(this.storange.default == undefined){
                this.filtros = this.storange.filtros;
                this.firstRow = this.storange.firstRow;
                this.pesquisar = this.storange.filtros.pesquisar;
            }
            this.integration.visible = true;
            this.getIntegrationOptons();
            this.getNaturezaTributaria();
        },

        methods: {

            getIntegrationOptons(){
                const paginaAtual = "NATUREZA_TRIBURARIA";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            debugger
                            this.integration = data;
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

            getNaturezaTributaria() {
                NaturezaTributariaService.getNaturezatributariaFiltro(this.pagina, this.qtdRegistro, this.ordenar, this.filtros)
                    .then(({ data }) => {
                        if(data) {
                            this.database = data.content; 
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;        
                        }
                    });
                    StorageService.setControlePagina("NATUREZA_TRIBURARIA", this.pagina, this.firstRow, this.qtdRegistro, this.filtros);
            },

            deleteNaturezaTriburaria() {
                if(!this.database) return;
                this.excluirDialog = false;

                NaturezaTributariaService.deleteNaturezaPorid(this.idNatureza)
                    .then(({ data }) => {
                        this.$toast.add({
                            severity:'success',
                            detail:`A natureza de operação tributada foi excluída com sucesso!`, 
                            life: 3000
                        });
                        this.getNaturezaTributaria();
                    })
            },

            confirmarExcluir(data) {
                this.excluirDialog = true;
                this.idNatureza = data;
            },

            getEstabelecimentos(data){
                this.dialogEstabelecimentos = true;
                this.idNatureza = data;
            },

            closeEstabelecimentos() {
                this.dialogEstabelecimentos = false;
                this.idNatureza = null;
            },

            getGruposProduto(data){
                this.dialogGrupoProduto = true;
                this.idNatureza = data;
            },

            closeGrupoProdutos(){
                this.dialogGrupoProduto = false;
                this.idNatureza = null;
            },

            getHistorico(id) {
                this.dialogHistorico = true;
                this.idNatureza = id;
            },

            closeHistorico() {
                this.dialogHistorico = false;
                this.idNatureza = null;
            },

            limparFiltro() {
                this.pesquisar = null;
                this.filtros.pesquisar = null;
                this.getNaturezaTributaria();
            },

            onPage(event) {          
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;                     
                this.filtrar();
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.filtrar();   
            }, 

            filtrar(){
                if(this.pesquisar != null){
                    this.filtros.pesquisar = this.pesquisar;
                }
                this.getNaturezaTributaria();
            },

            cadastrar() {
                this.$router.push(`/natureza-tributaria/cadastrar`);
            },

            editar(id) {
                this.$router.push(`/natureza-tributaria/editar/${id}`);
            },

            formatDate(date, format) {
                return Formatacao.formatDateCustom(date, format); 
            },
        },
        
    }
</script>