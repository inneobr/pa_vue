<template>
    <div class="card">
        <Toast />
        <div class="flex align-items-center">
            <i class="pi pi-check-square" style="font-size: 1.4rem"></i>
            <h4 style="margin:0px 5px;">Safra Composta</h4>
        </div>
        <hr />
    
        <DataTable 
            showGridlines 
            responsiveLayout="stack" 
            breakpoint="800px" 
            :value="content" 
            selectionMode="single"
            v-model:selection="safraComposta">

            <template #header>
                <div class="grid align-items-center">
                    <div class="col-12 lg:col-3">
                        <label><strong>Nome Safra</strong></label>
                        <InputText class="w-full  mt-2" v-model="filtros.nomeSafra" @keyup.enter="filtrar()"/>
                    </div>

                    <div class="col-12 lg:col-3">
                        <label><strong>Estabelecimentos</strong></label>
                        <AutoComplete
                            class="w-full mt-2"
                            v-model="estabelecimentoSelecionado"
                            field="codNome"
                            :dropdown="true"
                            :suggestions="estabelecimentosFiltrados"
                            :forceSelection="true"
                            @complete="buscarEstabelecimentos($event)"
                            @item-select="filtrar()"
                        />
                    </div>

                    <div class="grid col-12 lg:col-6">
                        <label style="color: rgb(255,255,255)">.</label>                        
                        <Button type="button"
                            label="Cadastrar"
                            icon="pi pi-plus"
                            class="p-button-info mt-5 mr-2" 
                            v-if="integration.visible"
                            style="padding-top: 0.4rem; padding-right: 1.5rem"
                            @click="cadastrar()"/>

                        <Button icon="pi pi-filter-slash"
                            label="Limpar Filtros"
                            class="p-button-outlined mt-5"
                            style="padding-top: 0.4rem; padding-left: 1.5rem; padding-right: 1.5rem"
                            @click="limparFiltros()"/>
                    
                        <Button  type="button" v-if="situacao == 'ATIVO'"
                            icon="pi pi-ban"
                            label="Listar inativos"
                            class="p-button-outlined p-button-danger  mt-5 ml-2"
                            @click="situacao = 'INATIVO'; isAtivo = false; carregarLista()"/>
                    
                        <Button  type="button" v-if="situacao == 'INATIVO'"
                            icon="pi pi-check-circle"
                            label="Listar ativos"
                            class="wp-button-outlined  mt-5 ml-2"
                            @click="situacao = 'ATIVO'; isAtivo = true; carregarLista()"/>
                    </div>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="tipoProdutoNome" header="Tipo Produto" style="width: 10rem;" sortable/>
            
            <Column field="nomeSafra" header="Nome Safra" sortable/>

            <Column field="dataInicio" header="Início" style="width: 8rem;">
                <template #body="{ data }">
                    {{ formatDateCustom(data.dataInicio, "DD/MM/YYYY") }}
                </template>
            </Column>

            <Column field="dataFinal" header="Final" style="width: 8rem;">
                <template #body="{ data }">
                    {{ formatDateCustom(data.dataFinal, "DD/MM/YYYY") }}
                </template>
            </Column>

            <Column field="safraComposta" header="Safra Composta" style="width: 10rem;" sortable/> 

            <Column field="descricaoStatusIntegracao" header="Status Integração" style="width:10rem;">
                <template #body="{ data }">
                    {{ data.descricaoStatusIntegracao}}
                </template>
            </Column>

            <Column field="dataIntegracao" header="Data Integração" style="width:11rem;">
                <template #body="{ data }">
                    {{ formatDate(data.dataIntegracao, 'DD/MM/YYYY HH:mm:ss') }}
                </template>
            </Column>



            <Column header="Ações" style="width:20rem;">
                <template #body="{ data }">
                    <div class="flex-none">
                        <Button title="Copiar" v-if="integration.visible && isAtivo" class="p-button-rounded m-2 bg-blue-400" icon="pi pi-copy" @click="copiar(data.id)"/>
                        <Button title="Visualizar estabelecimentos" icon="pi pi-home" class="p-button-rounded p-button-success flex-none mr-2 mb-2" @click="visualizarEstabelecimentos(data.id, data.nomeSafra)"></Button>
                        <Button title="Visualizar histórico" icon="pi pi-list" class="p-button-rounded p-button-warning flex-none mr-2 mb-2" @click="visualizarHistorico(data.id, data.nomeSafra)"></Button>
                        <Button title="Editar" v-if="integration.visible && isAtivo" icon="pi pi-pencil" class="p-button-rounded p-button-info flex-none mr-2 mb-2" @click="editar(data.id)"></Button>
                        <Button title="Ativar" v-if="!data.ativo && integration.visible" class="p-button-rounded p-button-danger flex-none mr-2 mb-2" icon="pi pi-ban" @click="confirmarAtivarOuInativar(data)"></Button>
                        <Button title="Inativar" v-if="data.ativo && integration.visible" class="p-button-rounded p-button-info flex-none mr-2 mb-2" icon="pi pi-check-circle" @click="confirmarAtivarOuInativar(data)"></Button>
                        <Button title="Editar" v-if="!integration.visible" icon="pi pi-eye" class="p-button-rounded p-button-outlined flex-none mr-2 mb-2" @click="editar(data.id)"></Button>
                        <Button title="Sincronizar com ERP" v-if="integration.visible" icon="pi pi-send" class="p-button-rounded p-button-warning flex-none mr-2 mb-2" @click="sincronizar(data.id)"></Button>
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

    <Dialog v-model:visible="ativarDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Deseja <strong>{{ item.ativo ? 'inativar' : 'ativar' }}</strong> a safra composta "{{ item.nomeSafra }}"?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()" />
        </template>
    </Dialog>

    <SafraCompostaModalEstabelecimentos
        :idSafraComposta="id"
        :descricaoSafraComposta="descricao"
        :visivel="estabelecimentosDialog"
        @fechar="ocultarEstabelecimentos()"
    />

    <ModalHistoricoGenerico
        codigoPagina="SAFRA_COMPOSTA"
        :id="id"
        :descricao="descricao"
        :visivel="historicoDialog"
        @fechar="ocultarHistorico()"
    />
</template>

<script>
    import Formatacao from '../../utilities/Formatacao';
    import SafraCompostaService from '../../service/SafraCompostaService';
    import SafraCompostaModalEstabelecimentos from './SafraCompostaModalEstabelecimentos'
    import ModalHistoricoGenerico from '../ModalHistoricoGenerico.vue';
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import IntegracaoService from '../../service/IntegracaoService'
    import StorageService from '../../service/StorageService';
    import Paginator from 'primevue/paginator';

export default {
    components: { SafraCompostaModalEstabelecimentos, ModalHistoricoGenerico, Paginator },
    data() {
        return {
            pagina: 0,
            firstRow: 0,
            totalRegistro: 0,
            qtdRegistro: 10,
            
            situacao: 'ATIVO',
            filtros: {},
            content: [],

            ordenar: null,

            ativarDialog: false,
            item: null,

            historicoDialog: false,
            estabelecimentosDialog: false,
            descricao: null,
            id: null,
            isAtivo: true,

            integration: {},
            safraComposta: {},
            estabelecimentoSelecionado: null,
            estabelecimentosFiltrados: [],
            storange: StorageService.getControlePagina("SAFRA_COMPOSTA"),  
        }
    },

    created() {
        //verifica se o filtro está vazio        
        if(this.storange.default == undefined){
            this.pagina = this.storange.numero;
            this.filtros = this.storange.filtros;  
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;
            this.buscarEstabelecimentoVinculado(this.storange.filtros.idEstabelecimento);            
        }        
        this.carregarLista();
        this.getIntegrationOptons();
    },

    methods: {
        getIntegrationOptons(){
            const paginaAtual = "SAFRA_COMPOSTA";
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

        carregarLista() {
            SafraCompostaService.getSafrasCompostasComPaginacao(this.pagina, this.qtdRegistro, this.ordenar, this.situacao, this.filtros)
                .then(({ data }) => {
                    this.content = data.content;
                    this.qtdRegistro = data.pageable.pageSize;
                    this.totalRegistro = data.totalElements;
                    StorageService.setControlePaginaFilter("SAFRA_COMPOSTA", this.pagina, this.firstRow, this.totalRegistro, this.filtros);
                })
                .catch(error => {
                    this.$toast.add({
                        severity:'info', 
                        summary: 'NÃO ENCONTRADO', 
                        detail:'Não encontramos safras cadastradas.',
                        life: 10000
                    });
                });
                
           
        },

        formatDateCustom(date, format) {
            return Formatacao.formatDateCustom(date, format);

        },

        cadastrar() {
            this.$router.push(`/safra-composta/cadastrar`);
        },

        editar(id) {
            this.$router.push(`/safra-composta/editar/${ id }`);
        },

        copiar(id) {
            this.$router.push(`/safra-composta/copiar/${ id }`);
        },

        visualizarEstabelecimentos(id, descricao) {
            this.estabelecimentosDialog = true;
            this.descricao = descricao;
            this.id = id;
        },

        ocultarEstabelecimentos() {
            this.estabelecimentosDialog = false;
            this.descricao = null;
            this.id = null;
        },

        visualizarHistorico(id, descricao) {
            this.historicoDialog = true;
            this.descricao = descricao;
            this.id = id;
        },

        ocultarHistorico() {
            this.historicoDialog = false;
            this.descricao = null;
            this.id = null;
        },

        confirmarAtivarOuInativar(data) {
            this.item = data;
            this. ativarDialog = true;
        },

        ativarOuInativar() {
            if(this.item.ativo) {
                SafraCompostaService.inativar(this.item.id)
                    .then(response => {
                        this.$toast.add({
                            severity:'success',
                            detail:`A safra composta ${ this.item.descricao } foi inativado com sucesso!`, 
                            life: 3000
                        });

                        this.carregarLista();
                        this.ativarDialog = false;
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'warn',
                            detail:`Falha ao inativar a safra composta ${ this.item.descricao }! Detalhes: ${error.response.data.message}`, 
                            life: 10000
                        });
                        this.ativarDialog = false;
                    });
            }
            else {
                SafraCompostaService.ativar(this.item.id)
                    .then(response => {
                        this.$toast.add({
                            severity:'success',
                            detail:`A safra composta ${ this.item.descricao } foi ativado com sucesso!`, 
                            life: 3000
                        });   
                        this.ativarDialog = false;
                        this.carregarLista();
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'warn',
                            detail:`Falha ao ativar a safra composta ${ this.item.descricao }! Detalhes: ${error.response.data.message}`, 
                            life: 10000
                        });
                        this.ativarDialog = false;
                    });
            }
        },

        buscarEstabelecimentoVinculado(idSelecionado) {
            EstabelecimentoService.getEstabelecimentosPorId(idSelecionado)
                .then(({ data }) => {
                    debugger
                    this.estabelecimentoSelecionado = data;
                })
                .catch(error => {
                    this.estabelecimentoSelecionado =  null;
                });
        },    

        buscarEstabelecimentos(event) {
            EstabelecimentoService.getEstabelecimentosPorCodigoOuDescricao(event.query)
                .then(({ data }) => {
                    if(data) {
                        const estabelecimentos = data;
                        estabelecimentos.unshift({codNome: "Todos"});
                        this.estabelecimentosFiltrados = [...estabelecimentos];
                    }
                })
                .catch(error => {
                    console.error(error);
                    this.estabelecimentosFiltrados = [];
                });
        },

        formatDate(data, format) {
            return Formatacao.formatDateCustom(data, format);
        },

        filtrar() {
            if(this.estabelecimentoSelecionado != null) {
                this.filtros["idEstabelecimento"] = this.estabelecimentoSelecionado.id;
            }

            this.carregarLista();
        },

        limparFiltros(){
            this.estabelecimentoSelecionado  = null;
            this.filtros = {};
            this.filtrar();
        },

        sort(event) {
            const sortField = event.sortField;
            const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
            this.ordenar = `${ sortField },${sortOrder}`;
            this.filtrar();   
        },
        
        onPage(event) {
            this.pagina = event.page + 1;
            this.firstRow = event.rows * event.page;
            this.qtdRegistro = event.rows;   
            this.carregarLista();
        },

        sincronizar(id) {
            if(id === undefined) return;

            SafraCompostaService.sincronizarComERP(id)
                .then(() => {
                    this.$toast.add({
                        severity:"success",
                        detail: "Sincronização solicitada com sucesso.", 
                        life: 5000
                    });
                    this.filtrar();
                })
                .catch(error => {
                    this.$toast.add({
                        severity:"error",
                        detail: "Erro ao tentar sincronizar.", 
                        life: 5000
                    });
                });
        }
    }
}
</script>

