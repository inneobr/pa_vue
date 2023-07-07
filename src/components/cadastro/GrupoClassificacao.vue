<template>
    <div class="card" >
        <Toast />

        <div class="flex align-items-center">
            <i class="pi pi-window-minimize mr-2" style="font-size: 1.5rem;"></i>
            <h3 style="margin:0;">Grupo de Classificação</h3>
        </div>
        <hr />  
            <DataTable 
                v-model:expandedRows="grupoProdutos" 
                @rowExpand="onRowExpand" 
                @rowCollapse="onRowCollapse" 
                showGridlines
                responsiveLayout="stack"
                v-model:filters="filtro"
                selectionMode="single"
                v-model:selection="grupoClassificacao"
                :value="grupo"
                dataKey="id"> 

                <template #header>
                    <GrupoClassificacaoFiltro
                        :visible="visible"
                        :totalRegistro="totalRegistro"
                        @filtrar="getGrupoClassificacao"
                    />    
                </template>

                <template #empty>
                    Nenhum registro encontrado.
                </template>

                <template #loading>
                    Carregando... Por favor, aguarde.
                </template>

                <Column :expander="true" headerStyle="width: 3rem;  font-weight: bold;" />
                <Column field="id" header="ID"  style="width:5rem;">
                    <template #body="{ data }">
                        {{ data.id }}
                    </template>
                </Column>

                <Column field="descricao" header="Descrição do Grupo">
                    <template #body="{ data }">
                        {{ data.descricao }}
                    </template>
                </Column>

                <Column field="safras" header="Safra" style="width:4rem;">
                    <template #body="{ data }">
                        {{ data.safras }}
                    </template>
                </Column>

                <Column field="tipoClassificacao" header="Tipo" style="width:10rem;">
                    <template #body="{ data }">
                        {{ data.tipoClassificacao }}
                    </template>
                </Column>

                <Column field="dataAtualizacao" header="Atualização" style="width:11rem;">
                    <template #body="{ data }">
                        {{ formatDateCustom(data.dataAtualizacao, 'DD/MM/YYYY HH:mm:ss') }}
                    </template>
                </Column>

                <Column field="descricaoStatusIntegracao" header="Status Integração" style="width:10rem;">
                    <template #body="{ data }">
                        {{ data.descricaoStatusIntegracao}}
                    </template>
                </Column>

                <Column field="dataIntegração" header="Data Integração" style="width:11rem;">
                    <template #body="{ data }">
                        {{ formatDateCustom(data.dataIntegracao, 'DD/MM/YYYY HH:mm:ss') }}
                    </template>
                </Column>

                <Column header="Ações" style="width:27rem;">
                    <template #body="{ data }">
                        <Button v-if="!integration.visible" class="p-button-rounded m-2 p-button-outlined" title="Visualizar" icon="pi pi-eye" @click="editar(data.id)"/>
                        <Button v-if="integration.visible"  class="p-button-rounded m-2 p-button-outlined" title="Visualizar" icon="pi pi-eye" @click="editarVisualizar(data.id)"/>
                        <GrupoClassificacaoXls class="m-2" :idGrupoClassificacao="data.id" :nomeArquivo="data.descricao" title="Baixar XLS"/>                         
                        <Button v-if="integration.visible" class="p-button-rounded m-2 bg-blue-400" title="Copiar" icon="pi pi-copy" @click="copiar(data.id)"/>
                        <Button class="p-button-rounded p-button-warning flex-none mr-2 mb-2" title="Visualizar Histórico"  icon="pi pi-list" @click="visualizarHistorico(data.id)"/>
                        <Button v-if="integration.visible" class="p-button-rounded m-2 bg-cyan-500" title="Editar" icon="pi pi-pencil" @click="editar(data.id)"/>
                        <Button v-if="integration.visible" class="p-button-rounded p-button-warning flex-none m-2" icon="pi pi-send" title="Sincronizar com ERP" @click="sincronizar(data.id)"></Button>                    
                        <Button class="p-button-rounded p-button-success flex-none m-2 align-items-center" title="Visualizar Estabelecimentos" icon="pi pi-home" @click="visualizarEstabelecimentos(data.id)"></Button>
                        <!-- <Button class="p-button-rounded p-button-danger m-2 align-items-center" title="Ativar" icon="pi pi-ban" @click="ativar(data.id)"  v-if="!data.ativo && integration.visible"/>
                        <Button class="p-button-rounded p-button-info m-2 align-items-center" title="Inativar" icon="pi pi-check-circle" @click="inativar(data.id)" v-if="data.ativo && integration.visible"/> -->
                        <Button class="p-button-rounded p-button-danger m-2 align-items-center" title="Excluir" icon="pi pi-trash" @click="confirmarExcluir(data)" v-if="integration.visible"/> 
                        
                    </template>
                </Column>

                <template #expansion="row">                
                    <div class="col-11" style="float: right;">
                        <div class="orders-subtable">
                            <h5>Grupo de Produtos</h5>
                            <DataTable 
                                :value="row.data.grupoProdutos"
                                responsiveLayout="stack">

                                <template #empty>
                                    Nenhum registro encontrado.
                                </template>

                                <template #loading>
                                    Carregando... Por favor, aguarde.
                                </template>
                                
                                <Column field="fmCodigo" header="Código" ></Column>
                                <Column field="descricao" header="Descrição" ></Column>

                            </DataTable>
                        </div>
                    </div>
                </template>


            </DataTable>
        
        <Paginator
            v-model:first="firstRow"
            :rows="qtdRegistro"
            :totalRecords="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage">
        </Paginator>


    </div>

    <GrupoClassificacaoHistoricos
        :idGrupo="this.idGrupo"
        :visivel="historicoDialog"
        @fechar="ocultarHistorico()" />

    <GrupoClassificacaoEstabelecimentos
        :idGrupoClassificacao="idGrupoClassificacao"
        :visivel="estabelecimentosDialog"
        @fechar="ocultarEstabelecimentos()"
    />

    <Dialog v-model:visible="excluirDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <span>Deseja <strong>excluir</strong> o Grupo de Classificação <strong>{{ grupoClassificacaoExcluir.descricao }}</strong>?</span>
            
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="excluirDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="excluir(grupoClassificacaoExcluir.id)" />
        </template>
    </Dialog>

</template>

<script>  
    import GrupoClassificacaoHistoricos from '../../components/cadastro/GrupoClassificacaoHistoricos.vue';
    import GrupoClassificacaoFiltro from '../../components/cadastro/GrupoClassificacaoFiltro.vue';
    import GrupoClassificacaoXls from '../../components/cadastro/GrupoClassificacaoXls.vue'; 
    import GrupoClassificacaoService from '../../service/GrupoClassificacaoService';
    import TipoClassificacaoService from '../../service/TipoClassificacaoService';
    import IntegracaoService from '../../service/IntegracaoService';
    import Formatacao from '../../utilities/Formatacao';
    import jsPDF from 'jspdf';
    import GrupoClassificacaoEstabelecimentos from './GrupoClassificacaoEstabelecimentos.vue';
    import StorageService from '../../service/StorageService';
    import Paginator from 'primevue/paginator';

    export default {
        name: 'Tabela Classificação',
        components: { GrupoClassificacaoFiltro, GrupoClassificacaoHistoricos, GrupoClassificacaoXls, GrupoClassificacaoEstabelecimentos, Paginator },
        data() {
            return {
                totalRegistro: 0,
                qtdRegistro: 10,
                pagina: 0,
                firstRow: 0,
                visible: false,
                grupo: [],
                grupoProdutos:[],
                idGrupo: null,
                historicoDialog: false,
                tipoClassificacaoFiltrados: [],
                ipoClassificacaoSelecionado: null,
                integration: {},
                dados: {}, 
                grupoClassificacao:{},
                estabelecimentosDialog: false, 
                idGrupoClassificacao: null,
                excluirDialog: false, 
                grupoClassificacaoExcluir:{},
                filtros:{},   
                
                storange: StorageService.getControlePagina("GRUPO_CLASSIFICACAO"),
            }
        },

        created(){
            //verifica se o filtro está vazio
            if(this.storange.default == undefined){
                this.filtros = this.storange.filtros;
            }
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;

            this.getGrupoClassificacao(this.filtros);
            this.getIntegrationOptons();
        },

        methods: {
            
            sincronizar(id) {
                GrupoClassificacaoService.sincronizarComERP(id)
                    .then(() => {
                        this.$toast.add({
                            severity:"success",
                            detail: "Sincronização solicitada com sucesso.", 
                            life: 5000
                        });
                        this.getGrupoClassificacao(this.filtros);
                        
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:"error",
                            detail: "Erro ao tentar sincronizar.", 
                            life: 5000
                        });
                    })
                    .finally(() => {
                        //Aguarda 3 segundos para aguardar o retorno da integração.
                        setTimeout(() => { 
                            this.getGrupoClassificacao(this.filtros);
                        }, 3000);

                    });
            },

        
            getIntegrationOptons(){
                const paginaAtual = "GRUPO_CLASSIFICACAO";
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
            
            carregarGrupoClassificacao(id){ 
                GrupoClassificacaoService.getDetalhes(id)
                    .then(({ data }) => {
                        if(data) {  
                            this.dados = data;
                            
                            this.gerarPdf(); 
                        }
                    }); 
            },

            getGrupoClassificacao(filtros = {}) {
                
                this.filtros = filtros;

                GrupoClassificacaoService.getGruposClassificacaoPage(this.pagina, this.qtdRegistro, this.filtros)
                    .then(({ data }) => {
                        if(data) {
                            this.grupo = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                            StorageService.setControlePaginaFilter("GRUPO_CLASSIFICACAO", this.pagina, this.firstRow, this.qtdRegistro, this.filtros);
                        }
                    }); 
            },  
            
            getTipoClassificacao(event) {              
                const chave = !event.query.trim().length ? 's' : event.query;
                TipoClassificacaoService.getTipos()
                    .then(({ data }) => {
                        if(data) {
                            this.tipoClassificacaoFiltrados = [...data];
                        }
                    }); 
            },  
            onPage(event) {          
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;                     
                this.getGrupoClassificacao(this.filtros);
            },

            onSort(event) {
                
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.sort = `${ sortField }` + `,id,${sortOrder}`;
                this.getGrupoClassificacao();
            },

            cadastrar() {
                this.$router.push(`/grupo-classificacao/cadastrar`);
            },

            editar(id) {
                this.$router.push(`/grupo-classificacao/editar/${id}`);
            },

            editarVisualizar(id) {
                this.$router.push(`/grupo-classificacao/visualizar/${id}`);
            },

            copiar(id) {
                this.$router.push(`/grupo-classificacao/copiar/${id}`);
            },

            formatDateCustom(date, format) {
                return Formatacao.formatDateCustom(date, format);
            },           

            visualizarHistorico(id) {
                this.historicoDialog = true;
                this.idGrupo = id;
            },

            ocultarHistorico() {
                this.historicoDialog = false;
                this.idGrupo = null;
            },

            confirmarExcluir(grupoClassificacao) {
                this.grupoClassificacaoExcluir = grupoClassificacao;
                this.excluirDialog = true;
            },

            excluir(id){
                GrupoClassificacaoService.excluirGrupo(id)
                    .then(response => {                            
                            this.$toast.add({
                                severity:'success',
                                detail:'Grupo de classificação excluído com sucesso!', 
                                life: 3000
                            });
                            
                            this.getGrupoClassificacao();
                    })
                    .catch(error => {
                        if(this.id) {
                            this.$toast.add({
                                severity:'error', 
                                detail:'Falha ao excluir o Grupo de classificação!', 
                                life: 3000
                            });
                        }
                        else {
                            this.$toast.add({
                                severity:'error',
                                detail:'Falha ao excluir o Grupo de classificação!',
                                life: 3000
                            });
                        }
                    });
                    
                    this.excluirDialog = false
            },

            inativar(id){
                GrupoClassificacaoService.inativarGrupo(id)
                    .then(response => {                            
                            this.$toast.add({
                                severity:'success',
                                detail:'Grupo inativado com sucesso!', 
                                life: 3000
                            });

                            this.getGrupoClassificacao();
                    })
                    .catch(error => {
                        if(this.id) {
                            this.$toast.add({
                                severity:'error', 
                                detail:'Falha ao inativar Grupo!', 
                                life: 3000
                            });
                        }
                        else {
                            this.$toast.add({
                                severity:'error',
                                detail:'Falha ao inativar Grupo!',
                                life: 3000
                            });
                        }
                    }); 
            },

            ativar(id){
                GrupoClassificacaoService.ativarGrupo(id)
                    .then(response => {                            
                            this.$toast.add({
                                severity:'success',
                                detail:'Grupo ativado com sucesso!', 
                                life: 3000
                            });

                            this.getGrupoClassificacao();
                    })
                    .catch(error => {
                        if(this.id) {
                            this.$toast.add({
                                severity:'error', 
                                detail:'Falha ao ativar Grupo!', 
                                life: 3000
                            });
                        }
                        else {
                            this.$toast.add({
                                severity:'error',
                                detail:'Falha ao ativar Grupo!',
                                life: 3000
                            });
                        }
                    }); 
            },

            gerarPdf() {
                const LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABDCAYAAAAmqDhOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE2QTc0MkIxOTJGQTExRTc5QjY1OTg1QTNGRkJCRjRGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE2QTc0MkIyOTJGQTExRTc5QjY1OTg1QTNGRkJCRjRGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTZBNzQyQUY5MkZBMTFFNzlCNjU5ODVBM0ZGQkJGNEYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTZBNzQyQjA5MkZBMTFFNzlCNjU5ODVBM0ZGQkJGNEYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4VgSXYAAAlcklEQVR42uxd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";
                
                let doc = new jsPDF({
                    orientation: 'p',
                    format: 'a4',
                    hotfixes: ['px_scaling'],
                });


                doc.setLineWidth(0.1);
                doc.setDrawColor(204, 204, 204);
                
                doc.line(5, 5, 5, 292);
                doc.line(205, 5, 5, 5);
                doc.line(205, 5, 205, 292);
                doc.line(205, 292, 5, 292);

                // Logo
                doc.addImage(
                    LOGO, 
                    "JPEG", 
                    10, // x
                    10, // y 
                    65, // Largura
                    15  // Altura
                );

                // Titulo
                doc.setFontSize(15);
                doc.setFont("arial", "bold");
                doc.text("teste", 139, 19, null, null, 'center');

                // Demonstrativo
                let numLinha = 34;
                doc.setFontSize(12);
                doc.setFont("arial", "bold");
                doc.text(" - - - - - ", 105, numLinha, null, null, 'center');
                
                const TB_LINHA_ALTURA = 8;
                const TB_LARGURA = 190;
                const TB_MARGEM = 210 - TB_LARGURA;
                const TB_LINHA_INICIAL = numLinha + TB_LINHA_ALTURA;
                let TB_LINHA = TB_LINHA_INICIAL;
                
                doc.setLineWidth(0.2);
                doc.setDrawColor(0, 0, 0);
                doc.line(TB_LARGURA, TB_LINHA, TB_MARGEM , TB_LINHA);
                
                TB_LINHA += 1;
                doc.line(TB_LARGURA - 1, TB_LINHA, TB_MARGEM + 1, TB_LINHA);
                doc.line(TB_MARGEM  + 1, TB_LINHA, TB_MARGEM + 1, TB_LINHA + TB_LINHA_ALTURA);
                
                doc.setFontSize(11);
                doc.text("TABELA PARA DESCONTO DE UMIDADE - SOJA", 105, TB_LINHA + (TB_LINHA_ALTURA/2) + 1.5, null, null, 'center');
                
                doc.line(TB_LARGURA - 1, TB_LINHA                  , TB_LARGURA - 1, TB_LINHA + TB_LINHA_ALTURA);
                doc.line(TB_LARGURA - 1, TB_LINHA + TB_LINHA_ALTURA, TB_MARGEM  + 1, TB_LINHA + TB_LINHA_ALTURA);
                
                
                TB_LINHA += TB_LINHA_ALTURA + 1;
                const TB_MARGEM_COLUNA_1  = TB_MARGEM + 1;
                const TB_LARGURA_COLUNA_1 = (TB_MARGEM / 2) + ((TB_LARGURA - 2) / 2);
                const TB_MARGEM_COLUNA_2  = TB_LARGURA_COLUNA_1 + 1;
                const TB_LARGURA_COLUNA_2 = TB_LARGURA - 1;
                
                // SUBTITULO COLUNA 1
                doc.setFontSize(9);
                doc.text("% DE UMIDADE", (TB_MARGEM_COLUNA_1 + TB_LARGURA_COLUNA_1) / 2, TB_LINHA + TB_LINHA_ALTURA + 1, null, null, 'center');
                
                doc.line(TB_LARGURA_COLUNA_1, TB_LINHA                        , TB_MARGEM_COLUNA_1 , TB_LINHA);
                doc.line(TB_MARGEM_COLUNA_1 , TB_LINHA                        , TB_MARGEM_COLUNA_1 , TB_LINHA + (TB_LINHA_ALTURA * 2));
                doc.line(TB_LARGURA_COLUNA_1, TB_LINHA                        , TB_LARGURA_COLUNA_1, TB_LINHA + (TB_LINHA_ALTURA * 2));
                doc.line(TB_LARGURA_COLUNA_1, TB_LINHA + (TB_LINHA_ALTURA * 2), TB_MARGEM_COLUNA_1 , TB_LINHA + (TB_LINHA_ALTURA * 2));
                // FIM SUBTITULO COLUNA 1
                
                // SUBTITULO COLUNA 2
                doc.setFontSize(9);
                doc.text("% DESCONTOS"              , (TB_MARGEM_COLUNA_2 + TB_LARGURA_COLUNA_2) / 2, TB_LINHA + (TB_LINHA_ALTURA/2) + 1.5, null, null, 'center');
                doc.text("(DEDUZIR DO PESO LÍQUIDO)", (TB_MARGEM_COLUNA_2 + TB_LARGURA_COLUNA_2) / 2, TB_LINHA + TB_LINHA_ALTURA + 3.5    , null, null, 'center');
                
                doc.line(TB_LARGURA_COLUNA_2, TB_LINHA                        , TB_MARGEM_COLUNA_2 , TB_LINHA);
                doc.line(TB_MARGEM_COLUNA_2 , TB_LINHA                        , TB_MARGEM_COLUNA_2 , TB_LINHA + (TB_LINHA_ALTURA * 2));
                doc.line(TB_LARGURA_COLUNA_2, TB_LINHA                        , TB_LARGURA_COLUNA_2, TB_LINHA + (TB_LINHA_ALTURA * 2));
                doc.line(TB_LARGURA_COLUNA_2, TB_LINHA + (TB_LINHA_ALTURA * 2), TB_MARGEM_COLUNA_2 , TB_LINHA + (TB_LINHA_ALTURA * 2));
                // FIM SUBTITULO COLUNA 2
                
                TB_LINHA += (TB_LINHA_ALTURA * 2) + 1;
                doc.line(TB_LARGURA_COLUNA_1, TB_LINHA, TB_MARGEM_COLUNA_1, TB_LINHA);
                doc.line(TB_LARGURA_COLUNA_2, TB_LINHA, TB_MARGEM_COLUNA_2, TB_LINHA);
                
                const LINHA_INICIO_REGISTRO = TB_LINHA;
                
                for(let detalhe of this.dados.detalhes) {
                    doc.setFontSize(9);
                    doc.text(detalhe.teorClassificacaoInicial.toString() , (TB_MARGEM_COLUNA_1 + TB_LARGURA_COLUNA_1) / 2, TB_LINHA + (TB_LINHA_ALTURA/2) + 1.5, null, null, 'center');
                    doc.text(detalhe.teorClassificacaoInicial.toString(), (TB_MARGEM_COLUNA_2 + TB_LARGURA_COLUNA_2) / 2, TB_LINHA + (TB_LINHA_ALTURA/2) + 1.5, null, null, 'center');
                    
                    TB_LINHA += TB_LINHA_ALTURA;
                }
                
                doc.line(TB_MARGEM_COLUNA_1 , LINHA_INICIO_REGISTRO, TB_MARGEM_COLUNA_1 , TB_LINHA);
                doc.line(TB_LARGURA_COLUNA_1, LINHA_INICIO_REGISTRO, TB_LARGURA_COLUNA_1, TB_LINHA);
                doc.line(TB_LARGURA_COLUNA_1, TB_LINHA             , TB_MARGEM_COLUNA_1 , TB_LINHA);
                
                doc.line(TB_MARGEM_COLUNA_2 , LINHA_INICIO_REGISTRO, TB_MARGEM_COLUNA_2 , TB_LINHA);
                doc.line(TB_LARGURA_COLUNA_2, LINHA_INICIO_REGISTRO, TB_LARGURA_COLUNA_2, TB_LINHA);
                doc.line(TB_LARGURA_COLUNA_2, TB_LINHA             , TB_MARGEM_COLUNA_2 , TB_LINHA);
                
                doc.line(TB_MARGEM , TB_LINHA_INICIAL, TB_MARGEM , TB_LINHA + 1);
                doc.line(TB_LARGURA, TB_LINHA_INICIAL, TB_LARGURA, TB_LINHA + 1);
                doc.line(TB_LARGURA, TB_LINHA + 1    , TB_MARGEM , TB_LINHA + 1);
                
                // Info de impresão
                const data = new Date().toLocaleDateString("pt-br", {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                });
                doc.setFontSize(8);
                doc.setTextColor(30, 30, 30);
                doc.text("usaurio", 7  , 290, null, null, 'left');
                doc.text(data              , 203, 290, null, null, 'right');
                
                doc.save("detalhes_da_classificação.pdf");
            },

            onRowExpand(event) {
                    GrupoClassificacaoService.getGrupoProdutos(event.data.id)
                    .then(({data}) => {
                        event.data['grupoProdutos'] = data;

                        //event.data.grupoProdutos.forEach(element => {
                        //    element['idGrupoClassificacaoT'] = event.data.id;
                        //});

                        //event.data.grupoProdutos['idGrupoClassificacaoT'] = event.data.id;

                        //console.log('Evente##', event);
                    });
            },

            onRowCollapse(event) {

            },
            
            visualizarEstabelecimentos(id){
                this.estabelecimentosDialog = true;
                this.idGrupoClassificacao = id;
            },

            ocultarEstabelecimentos(){
                this.estabelecimentosDialog = false;
                this.idGrupoClassificacao = null;
            },

        }
            
    }

</script>