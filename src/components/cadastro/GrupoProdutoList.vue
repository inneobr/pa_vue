<template>
    <div class="card">

        <Toast />

        <div class="flex align-items-center">
           <i class="pi pi-building" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;"> Grupo de produto</h3>
        </div>

        <hr />
        
        <DataTable 
            v-model:selection="selected"
            responsiveLayout="stack"
            scrollDirection="both"
            filterDisplay="menu"
            showGridlines
            selectionMode="single"
            @sort="sort($event)"
            :value="gruposProdutos"
            :scrollable="true">

            <template #header>
                <div class="flex justify-content-between">
                    <div class="flex">
                        <Button v-if="integration.visible" type="button" label="Cadastrar" class="p-button-info mr-1" icon="pi pi-plus" @click="cadastrar()" />
                        <Button type="button" icon="pi pi-filter-slash" label="Limpar filtro" class="p-button-outlined mr-1" @click="limparFiltro()"/>

                        <Button
                            v-if="situacao == 'ATIVO'"
                            type="button"
                            icon="pi pi-ban"
                            label="Listar inativos"
                            class="p-button-outlined p-button-danger mr-2"
                            style="padding: 0.4rem;"
                            @click="situacao = 'INATIVO'; isAtivo = false; carregarGruposProdutos()"/>

                        <Button
                            v-if="situacao == 'INATIVO'"
                            type="button"
                            icon="pi pi-check-circle"
                            label="Listar ativos"
                            class="p-button-outlined mr-2"
                            style="padding: 0.4rem;"
                            @click="situacao = 'ATIVO'; isAtivo = true; carregarGruposProdutos()"/>

                    </div>

                    <span class="p-input-icon-right">
                        <i class="pi pi-search" />
                        <InputText v-model="filtro" placeholder="Pesquisar" @change="carregarGruposProdutos()" />
                    </span>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="fmCodigo" header="Código" style="width:8rem;" sortable frozen>
                <template #body="{ data }">
                    {{ data.fmCodigo }}
                </template>
                <!-- <template #filter="{ filterModel }">
                    <InputText
                        type="text"
                        v-model="filterModel.value"
                        class="p-column-filter"
                        placeholder="Código"
                    />
                </template> -->
            </Column>
            <Column field="descricao" header="Descrição" style="width:15rem;" sortable frozen>
                <template #body="{ data }">
                    {{ data.descricao }}
                </template>
                <!-- <template #filter="{ filterModel }">
                    <InputText
                        type="text"
                        v-model="filterModel.value"
                        class="p-column-filter"
                        placeholder="Descrição"
                    />
                </template> -->
            </Column>
            
            <Column header="Imp." style="width:5rem;">
                <template #body="{ data }">
                    <i v-if="data.impureza" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>
            <Column header="Umid." style="width:5rem;">
                <template #body="{ data }">
                    <i v-if="data.umidade" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Chuv/Avar" style="width:6rem;">
                <template #body="{ data }">
                    <i v-if="data.chuvAvar" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="PH Ent." style="width:5rem;">
                <template #body="{ data }">
                    <i v-if="data.phEntrada" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Bandinha" style="width:5rem;">
                <template #body="{ data }">
                    <i v-if="data.logBandinha" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="TBM." style="width:5rem;">
                <template #body="{ data }">
                    <i v-if="data.tbm" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Cata" style="width:5rem;">
                <template #body="{ data }">
                    <i v-if="data.cata" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Bebida" style="width:5rem;">
                <template #body="{ data }">
                    <i v-if="data.bebida" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Café Escolha" style="width:8rem;">
                <template #body="{ data }">
                    <i v-if="data.cafeEscolha" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Tipo" style="width:5rem;">
                <template #body="{ data }">
                    <i v-if="data.tipo" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Lote" style="width:5rem;">
                <template #body="{ data }">
                    <i v-if="data.lote" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Semente" dataType="boolean" style="width:5rem;">
                <template #body="{ data }">
                    <i v-if="data.semente" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Nr. Laudo" style="width:6rem;">
                <template #body="{ data }">
                    <i v-if="data.nrLaudo" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Nr. Ordem Campo" style="width:9rem;">
                <template #body="{ data }">
                    <i v-if="data.nrOrdCampo" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>
            
            <Column header="Qualidade Produto" style="width:10rem;">
                <template #body="{ data }">
                    <i v-if="data.qualiProduto" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>
            
            <Column header="FNT" style="width:10rem;">
                <template #body="{ data }">
                    <i v-if="data.fnt" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Densidade" style="width:10rem;">
                <template #body="{ data }">
                    <i v-if="data.densidade" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>            
           
            <Column header="PH Mínimo" style="width:7rem;">
                <template #body="{ data }">
                    {{ data.phMinimo }}
                </template>
            </Column>
            <Column header="% Acréscimo Impureza" style="width:11rem;">
                <template #body="{ data }">
                    {{ data.percImpureza }}
                </template>
            </Column>

            <Column field="ativo" header="Situação" style="width:8rem;">
                <template #body="{ data }">
                    {{ data.ativo ? 'Ativo' : 'Inativo' }}
                </template>
            </Column>

            <Column header="Integração" style="width:12rem;">
                <template #body="{ data }">
                    {{ formatDateCustom(data.dataIntegracao, 'DD/MM/YYYY HH:mm:ss') }}
                </template>
            </Column>

            <Column header="Ações" style="width:7.5rem;" alignFrozen="right" frozen>
                <template #body="{ data }">
                    <div class="flex-none">
                        <Button v-if="integration.visible && isAtivo" icon="pi pi-pencil" class="p-button-rounded p-button-info flex-none mr-1" @click="editar(data.id)" />
                        <Button v-if="!integration.visible" icon="pi pi-eye" class="p-button-rounded p-button-outlined flex-none mr-1" @click="editar(data.id)" />
                        <Button v-if="!data.ativo && integration.visible" icon="pi pi-ban" class="p-button-rounded p-button-danger flex-none" title="Ativar" @click="confirmarAtivarOuInativar(data)" />
                        <Button v-if="data.ativo && integration.visible" icon="pi pi-check-circle" class="p-button-rounded p-button-info flex-none" title="Inativar" @click="confirmarAtivarOuInativar(data)" />
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
            <span>Deseja <strong>{{ grupo.ativo ? 'inativar' : 'ativar' }}</strong> o Grupo de Produto <strong>{{ grupo.descricao }}</strong>?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarOuInativarDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()" />
        </template>
    </Dialog>
</template>

<script>
    import IntegracaoService from '../../service/IntegracaoService'
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        name: 'ListaGrupoProduto',
        data() {
            return {
                totalRegistro: 0,
                qtdRegistro: 10,
                pagina: 0,
                filtro: null,
                selected: null,
                gruposProdutos: [],
                
                grupo: {},
                isAtivo: true,
                situacao: 'ATIVO',
                integration: {},
                ativarOuInativarDialog: false,
                ordenar: 'fmCodigo',
                storange: StorageService.getControlePagina("GRUPO_PRODUTO"),  
            }
        },
        created() {
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;

            this.limparFiltro();
            this.carregarGruposProdutos();
            this.getIntegrationOptons();
        },
        
        methods: {
            getIntegrationOptons(){
                const paginaAtual = "GRUPO_PRODUTO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                            console.log(this.integration);
                            console.log(this.integration.visible);
                        }
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'info', 
                            summary: 'PARÂMETROS DE PÁGINA NÂO DEFINIDOS', 
                            detail:'Você deve cadastrar os parâmetros para esta página no menu lateral em: Painel de Integrações..',
                            life: 10000
                        });
                    });
            },

            carregarGruposProdutos() {
                GrupoProdutoService.getGruposProdutos(this.pagina, this.qtdRegistro, this.ordenar, this.filtro, this.situacao)
                    .then(({ data }) => {
                        if(data) {
                            this.gruposProdutos = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                        }
                    });
            },

            cadastrar() {
                this.$router.push(`/grupo-produto/cadastrar`);
            },

            editar(id) {
                this.$router.push(`/grupo-produto/editar/${id}`);
            },

            limparFiltro() {
                this.filtro = null;
                this.carregarGruposProdutos();
            },

           

            confirmarAtivarOuInativar(grupo) {
                this.grupo = grupo;
                this.ativarOuInativarDialog = true;
            },

            ativarOuInativar() {
                if(this.grupo.ativo) {
                    GrupoProdutoService.inativar(this.grupo.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O Grupo de Produto "${ this.grupo.descricao }" foi inativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregarGruposProdutos();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao inativar o Grupo de Produto "${ this.grupo.descricao }"!`, 
                                life: 3000
                            });
                        });
                }
                else {
                    GrupoProdutoService.ativar(this.grupo.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O Grupo de Produto "${ this.grupo.descricao }" foi ativado com sucesso!`, 
                                life: 3000
                            });
                            
                            this.carregarGruposProdutos();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao ativar o Grupo de Produto "${ this.grupo.descricao }"!`, 
                                life: 3000
                            });
                        });
                }
            },

            formatDateCustom(date, format) {
                return Formatacao.formatDateCustom(date, format); 
            },
            
            onPage(event) {
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;                     
                StorageService.setControlePagina("GRUPO_PRODUTO", this.pagina, this.firstRow, event.rows);
                this.carregarGruposProdutos();
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.gruposProdutos = [];
                this.carregarGruposProdutos();
            },
        },
        
       
    }
</script>
