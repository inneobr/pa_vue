<template>
    <div class="card">
        <Toast />
        <div class="flex align-items-center">
            <i class="pi pi-cog mr-1" style="font-size: 1.4rem"></i>
            <h4 style="margin:0px 5px;">Natureza de Operação</h4>
        </div>

        <hr />

        <DataTable 
            showGridlines
            :value="naturezas"
            @sort="sort($event)"  
            selectionMode="single" 
            responsiveLayout="scroll">

            <template #header>
                <div class="col-12 grid justify-content-between">
                    <div class="col-12 xl:col-8">
                        <Button v-if="integration.visible" type="button" label="Cadastrar" class="p-button-info mr-2" icon="pi pi-plus" @click="cadastrar()" />
                        <Button type="button" icon="pi pi-filter-slash" label="Limpar filtro" class="p-button-outlined mr-2" @click="limparFiltro()"/>
                       
                    </div>

                    <span class="col-12 xl:col-2 p-input-icon-right">
                        <i class="pi pi-search mr-2" />
                        <InputText class="w-full" v-model="filtro" placeholder="Pesquisar" @keyup.enter="carregarNaturezas()" />
                    </span>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="codGrupo" header="Código" style="width:8rem;" sortable/>
            <Column field="descricao" header="Descrição" sortable/>

            <Column field="dataCadastro" header="Cadastro" style="width:12rem;" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.dataCadastro, 'DD/MM/YYYY HH:mm:ss') }}
                </template>
            </Column>
           
            <Column field="dataIntegracao" header="Integração" style="width:12rem;" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.dataIntegracao, 'DD/MM/YYYY HH:mm:SS') }} 
                </template>
            </Column>
            <Column header="Ações" style="width:12.1rem;">
                <template #body="{ data }">
                    <div class="flex-none">
                        <Button icon="pi pi-home" class="p-button-rounded p-button-success flex-none mr-2 mb-2" title="Estabelecimentos" @click="visualizarEstabelecimentos(data.id)"></Button>
                        <Button icon="pi pi-list" class="p-button-rounded p-button-warning flex-none mr-2 mb-2" title="Histórico" @click="visualizarHistorico(data)"></Button>
                        <Button v-if="!integration.visible" icon="pi pi-eye" class="p-button-rounded p-button-outlined flex-none mr-2 mb-2" title="Visualizar" @click="editar(data.id)"></Button>
                        <Button v-if="integration.visible" icon="pi pi-pencil" class="p-button-rounded p-button-info flex-none mr-2 mb-2" title="Editar" @click="editar(data.id)"></Button>
                        <Button v-if="integration.visible" icon="pi pi-trash" class="p-button-rounded p-button-danger flex-none mr-2 mb-2" title="Deletar" @click="deletar(data.id)"></Button>
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
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Deseja <strong>{{ natureza.ativo ? 'inativar' : 'ativar' }}</strong> a Natureza de Operação <strong>{{ natureza.descricao }}</strong>?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarOuInativarDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()" />
        </template>
    </Dialog>

    <NaturezaOperacaoHistoricos
        :descricao="descricao"
        :codGrupo="codGrupo"
        :visivel="historicoDialog"
        @fechar="ocultarHistorico()"
    />

    <NaturezaOperacaoEstabelecimentos
        :idNaturezaOperacao="idNaturezaOperacao"
        :visivel="estabelecimentosDialog"
        @fechar="ocultarEstabelecimentos()"
    />
</template>

<script>
    
    import NaturezaOperacaoEstabelecimentos from './NaturezaOperacaoEstabelecimentos.vue';
    import NaturezaOperacaoService from '../../service/NaturezaOperacaoService';
    import NaturezaOperacaoHistoricos from './NaturezaOperacaoHistoricos.vue';
    import IntegracaoService from '../../service/IntegracaoService'
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        components: { NaturezaOperacaoHistoricos, NaturezaOperacaoEstabelecimentos },
        data() {
            return {
                pagina: 0,
                firstRow: 0,
                totalRegistro: 0,
                qtdRegistro: 10, 

                filtro: null,
                situacao: 'ATIVO',

                naturezas: [],
                idNaturezaOperacao: null,
                idEstabelecimento: null,
                estabelecimentosDialog: false,
                historicoDialog: false,
                ordenar: "dataCadastro,desc",
                integration: {},    
                natureza: {},
                descricao: null,
                codGrupo: null,
                ativarOuInativarDialog: false,
                storange: StorageService.getControlePagina("NATUREZA_OPERACAO"), 
            }
        },
        created() {
            this.filtro = this.storange.filtros;
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;   
            this.getIntegrationOptons();
            this.carregarNaturezas();
        },
        methods: {
            
            getIntegrationOptons(){
                const paginaAtual = "NATUREZA_OPERACAO";
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
                            detail:'Você deve cadastrar os parâmetros para esta página no menu lateral em item: Parâmetros de Integração.',
                            life: 10000
                        });
                    });
            },
            carregarNaturezas() {    
                NaturezaOperacaoService.getNaturezasFiltro(this.pagina, this.qtdRegistro, this.ordenar, this.filtro)
                    .then(({ data }) => {
                        this.naturezas = data.content;
                        this.qtdRegistro = data.pageable.pageSize;
                        this.totalRegistro = data.totalPages * this.qtdRegistro;
                    });
                StorageService.setControlePagina("NATUREZA_OPERACAO", this.pagina, this.firstRow, this.qtdRegistro, this.filtro);
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;  
                this.carregarNaturezas();
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.carregarNaturezas();   
            }, 

            limparFiltro() {
                this.filtro = null;
            },

            cadastrar() {
                this.$router.push(`/natureza-operacao/cadastrar`);
            },
            
            editar(id) {
                this.$router.push(`/natureza-operacao/editar/${ id }`);
            },

            deletar(id){
                NaturezaOperacaoService.deletar(id)
                    .then(({ data }) => {
                        this.$toast.add({
                            severity:'info', 
                            summary: 'Deletado', 
                            detail:'Natureza de Operação deletada com sucesso!',
                            life: 10000
                        });  
                        this.carregarNaturezas();                         
                    }) 
                    .catch(error => {
                        this.$toast.add({
                            severity:'ward', 
                            summary: 'Falha ao deletar', 
                            detail:'Não foi possivel deletar a Natureza de Operação!',
                            life: 10000
                        });
                        this.carregarNaturezas();
                    });
            },

            visualizarHistorico(data) {
                this.historicoDialog = true;
                this.codGrupo = data.codGrupo;
                this.descricao = data.descricao;
            },

            ocultarHistorico() {
                this.historicoDialog = false;
                this.idNaturezaOperacao = null;
            },

            visualizarEstabelecimentos(id) {
                this.estabelecimentosDialog = true;
                this.idNaturezaOperacao = id;
            },

            ocultarEstabelecimentos() {
                this.estabelecimentosDialog = false;
                this.idNaturezaOperacao = null;
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },
        }
    }
</script>
