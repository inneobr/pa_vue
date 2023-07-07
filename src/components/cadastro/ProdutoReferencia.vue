<template>
    <div class="card">
        <div class="flex align-items-center">
           <i class="pi pi-shopping-bag" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;">Referência de Produtos</h3>
        </div>
        <hr />

        <DataTable 
            showGridlines
            :value="database"
            @sort="sort($event)"
            selectionMode="single"
            responsiveLayout="stack">

            <template #header>
                <div class="col-12 grid justify-content-between">
                    <div class="col-12 xl:col-10">
                        <Button v-if="integration.visible" type="button" label="Cadastrar" class="p-button-info mr-1" icon="pi pi-plus" @click="cadastrar()" /> 
                        <Button type="button" icon="pi pi-filter-slash" label="Limpar filtro" class="p-button-outlined" @click="limparFiltro()"/> 
                        
                        <Button v-if="filter.situacao == 'ATIVO'"
                            type="button"
                            icon="pi pi-ban"
                            label="Listar inativos"
                            class="p-button-outlined p-button-danger ml-1"
                            style="padding: 0.4rem;"
                            @click="filter.situacao = 'INATIVO'; this.pagina = 0; getReferencias()"/>

                        <Button v-if="filter.situacao == 'INATIVO'" 
                            type="button"
                            icon="pi pi-check-circle"
                            label="Listar ativos"
                            class="p-button-outlined ml-1"
                            style="padding: 0.4rem; "
                            @click="filter.situacao = 'ATIVO'; this.pagina = 0; getReferencias()"/>                     
                    </div>

                    <span class="col-12 xl:col-2 p-input-icon-right">
                        <i class="pi pi-search mr-2" />
                        <InputText class="w-full" v-model="filter.referencia" placeholder="Pesquisar referência" @keyup.enter="getReferencias()"/>
                    </span>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>            
            <Column field="codRef" header="Referência" sortable />
            <Column field="dataIntegracao" header="Data Integração" style="width:180px;" sortable >
                <template #body="{ data }">
                    {{ formatDate(data.dataCadastro, 'DD/MM/YYYY HH:mm:SS') }} 
                </template>
            </Column>
            
            <Column v-if="integration.visible" header="Ações" style="width:1rem;">
                <template #body="{ data }">
                    <div class="flex-none">
                        <Button v-if="data.ativo && integration.visible" icon="pi pi-check-circle" class="p-button-rounded  p-button-info flex-none" title="Inativar" @click="inativarReferencia(data)" />
                        <Button v-if="!data.ativo && integration.visible" icon="pi pi-ban" class="p-button-rounded flex-none p-button-danger" title="ativar" @click="ativarReferencia(data)" />
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
    <Toast />
</template>

<script>    
    import ProdutoReferenciaService from '../../service/ProdutoReferenciaService';
    import IntegracaoService from '../../service/IntegracaoService';    
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        name: 'Produtos',
        data() {
            return {
                pagina: 0,   
                qtdRegistro: 10,
                totalRegistro: 0,
                ordenar: 'codRef,asc', 

                filter: {},
                database: [],
                integration: {},
                storange: StorageService.getControlePagina("REFERENCIA_PRODUTO"),
            }
        },

        mounted() {            
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;
            this.filter.situacao = 'ATIVO';
            //Verifica se o storange esta vazio e impede que os filtros sejam deletados
            if(this.storange.default == undefined){
                this.filter = this.storange.filtros;
            }
            
            this.getReferencias();
            this.getIntegrationOptons()
        },


        methods: {
            getIntegrationOptons(){
                const paginaAtual = "REFERENCIA_PRODUTO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        this.$toast.add({
                            severity:'info', 
                            summary: 'PARÂMETROS DE PÁGINA NÂO DEFINIDOS', 
                            detail:'Você deve cadastrar os parâmetros para esta página no menu lateral em: Painel de Integrações.',
                            life: 10000
                        });
                    });
            },

            getReferencias() {                
                ProdutoReferenciaService.getProdutoReferenciaStatus(this.pagina, this.qtdRegistro, this.ordenar, this.filter)
                    .then(({ data }) => {
                        if(data) {
                            this.pagina = 0;
                            this.database = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                        }
                    })
                    .catch(error => {
                        this.database = []
                    });
                    StorageService.setControlePaginaFilter("REFERENCIA_PRODUTO", this.pagina, this.firstRow, this.qtdRegistro, this.filter);                    
            },

            ativarReferencia(referencia){
                ProdutoReferenciaService.ativar(referencia.codRef)
                    .then(({ data }) => {
                        this.$toast.add({
                            severity:'info', 
                            summary: 'ATIVAÇÃO DE REFERÊNCIA', 
                            detail: data,
                            life: 10000
                        });
                        this.pagina = 0;
                        this.database = [];
                        this.getReferencias();
                    });
                    
            },

            inativarReferencia(referencia){
                ProdutoReferenciaService.inativar(referencia.codRef)
                    .then(({ data }) => {
                        if(data) {
                            this.$toast.add({
                                severity:'info', 
                                summary: 'INATIVAÇÃO DE REFERÊNCIA', 
                                detail: 'Referência de Produto Inativada com sucesso!',
                                life: 5000
                            });
                            this.pagina = 0;
                            this.database = [];
                            this.getReferencias();
                        }
                    })
                    .catch(error => {
                        let message = error.response.data.message;
                        console.log(JSON.stringify(message));
                        this.$toast.add({
                            severity:'error',
                            summary: `INATIVAÇÃO DE REFERÊNCIA!`,
                            detail: message, 
                            life: 10000
                        });
                        this.pagina = 0;
                        this.database = [];
                        this.getReferencias();
                    });
                    
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            cadastrar() {
                this.$router.push(`/referencia-produtos/cadastrar`);
            },

            editar(id) {
                this.$router.push(`/referencia-produtos/editar/${id}`);
            },

            limparFiltro() {
                this.pagina = 0;
                this.situacao = "ATIVO";
                StorageService.setControlePaginaFilter(null);
                window.location.reload(); 
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;
                this.getReferencias();
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.getReferencias();   
            },
        }
        
    }
</script>   