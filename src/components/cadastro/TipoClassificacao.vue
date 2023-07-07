<template>
    <div class="card">
        <Toast />

        <div class="flex align-items-center">
           <i class="pi pi-sliders-v" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;"> Tipos de Classificação</h3>
        </div>

        <hr />
        
       
        <DataTable 
            :value="tipoClassificacaoGrid" 
            :paginator="true" 
            class="p-datatable-gridlines" 
            :rows="10" 
            dataKey="id" 
            :rowHover="true"
            v-model:filters="filtro" 
            filterDisplay="menu" 
            :filters="filtro" 
            responsiveLayout="stack"
            selectionMode="single"
            v-model:selection="linhaSelecionada"
            :globalFilterFields="['tipo']" >

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
                            @click="situacao = 'INATIVO'; carregar()"
                        ></Button>
                        <Button
                            v-if="situacao == 'INATIVO'"
                            type="button"
                            icon="pi pi-check-circle"
                            label="Listar ativos"
                            class="p-button-outlined mr-2"
                            style="padding: 0.4rem;"
                            @click="situacao = 'ATIVO'; carregar()"
                        ></Button>
                    </div>

                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filtro['global'].value" placeholder="Procurar" style="width: 100%"/>
                    </span>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>
            
            <Column field="tipo" header="Tipo" sortable />

            <Column header="Resultado (%) Desconto"  style="text-align: center;">
                <template #body="{ data }">
                    <i v-if="data.resultadoDesconto" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Taxa Secagem Em Quilos" style="text-align: center;">
                <template #body="{ data }">
                    <i v-if="data.resultadoTaxaSecagemKg" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Taxa Secagem Em Valor" style="text-align: center;">
                <template #body="{ data }">
                    <i v-if="data.resultadoTaxaSecagemValor" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="(%) Teor Por Faixa" style="text-align: center;">
                <template #body="{ data }">
                    <i v-if="data.teorPorFaixa" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Contr. Por Safra" style="text-align: center;">
                <template #body="{ data }">
                    <i v-if="data.controlePorSafra" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="PH" style="text-align: center;">
                <template #body="{ data }">
                    <i v-if="data.ph" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="PH Corrigido" style="text-align: center;">
                <template #body="{ data }">
                    <i v-if="data.phCorrigido" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column header="Referência" style="text-align: center;">
                <template #body="{ data }">
                    <i v-if="data.referencia" class="pi pi-check-circle" style="font-size:1.2rem; color:green;"></i>
                </template>
            </Column>

            <Column field="descricaoStatusIntegracao" header="Status Integração" style="width:10rem;">
                <template #body="{ data }">
                    {{ data.descricaoStatusIntegracao}}
                </template>
            </Column>

            <Column field="dataIntegração" header="Integração" style="width:11rem;">
                <template #body="{ data }">
                    {{ formatDateCustom(data.dataIntegracao, 'DD/MM/YYYY HH:mm:ss') }}
                </template>
            </Column> 

            <Column header="Ativo">
                <template #body="{ data }">
                    {{ data.ativo ? 'Ativo' : 'Inativo' }}
                </template>
            </Column>

            <Column v-if="integration.visible" header="Ações" style="width:14rem;">
                <template #body="{ data }">
                    <div class="flex-none">
                        
                        <Button v-if="data.ativo"  icon="pi pi-pencil" class="p-button-rounded p-button-info flex-none mr-2" title="Editar" @click="editar(data.tipoClassificacao)" />
                        <Button icon="pi pi-list"   class="p-button-rounded p-button-warning flex-none mr-2" title="Visualizar Histórico" @click="visualizarHistorico(data.id)"></Button>
                        <Button v-if="integration.visible && data.ativo" class="p-button-rounded p-button-warning flex-none mr-2" icon="pi pi-send" title="Sincronizar com ERP" @click="sincronizar(data.id)"></Button>                    
                        <Button
                            v-if="!data.ativo"
                            class="p-button-rounded flex-none p-button-danger"
                            icon="pi pi-ban"
                            title="Ativar"
                            @click="confirmarAtivarOuInativar(data)" 
                        ></Button>
                        <Button
                            v-if="data.ativo"
                            class="p-button-rounded flex-none"
                            icon="pi pi-check-circle"
                            title="Inativar"
                            @click="confirmarAtivarOuInativar(data)" 
                        ></Button>
                    </div>
                </template>
            </Column>
        </DataTable>
        
    </div>

    <Dialog v-model:visible="ativarOuInativarDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Deseja <strong>{{ tipoClassificacaoData.ativo ? 'inativar' : 'ativar' }}</strong> o tipo classificação <strong>{{ tipoClassificacaoData.tipoClassificacao }}</strong>?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarOuInativarDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()" />
        </template>
    </Dialog>

    <TipoClassificacaoHistoricos
        :idTipoClassificacao = "idTipoClassificacao1"
        :id="idClassificacao"
        :visivel="historicoDialog"
        @fechar="ocultarHistorico()"
    />
  
</template>

<script>

    import TipoClassificacaoService from '../../service/TipoClassificacaoService';
    import TipoClassificacaoHistoricos from './TipoClassificacaoHistoricos.vue'
    import IntegracaoService from '../../service/IntegracaoService'
    import {FilterMatchMode,FilterOperator} from 'primevue/api';
    import Formatacao from '../../utilities/Formatacao';
    

    export default {
        components: { TipoClassificacaoHistoricos },
        name: 'tipoClassificacao',
        data() {
            return {
                tipoClassificacaoGrid: [],
                tipoClassificacaoData:null,
                filtro: null,
                filtro2:null,
                
                carregando: false,
                pagina: 0,
                qtdRegistro: 10,
                totalRegistro: 0,
                ordenar: 'tipo',
                                
                
                ativarOuInativarDialog: false,
                perfilDialog: false,
                tipoClassificacao:null,
                
                historicoDialog:false,
                idTipoClassificacao1:null,
                idClassificacao:null,
                integration: {},
                linhaSelecionada:null,
                situacao: 'ATIVO',

            }
        },
        created() {
            this.carregar();
            this.initFilters();
            this.getIntegrationOptons();
        },
        methods: {
            getIntegrationOptons(){
                const paginaAtual = "TIPO_CLASSIFICACAO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                        }
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'info', 
                            summary: 'PARÂMETROS DE PÁGINA NÃO DEFINIDOS', 
                            detail:'Você deve cadastrar os parâmetros para esta página no menu lateral em: Painel de Integrações.',
                            life: 10000
                        });
                    });
            },

            carregar() {
                this.carregando = true;

                TipoClassificacaoService.getTipoClassificacaoPaginado(
                     this.pagina,
                     this.qtdRegistro,
                     this.sort,
                     this.filtro2,
                     this.situacao
                 )
                     .then(({ data }) => {
                         if(data) {
                             this.tipoClassificacaoGrid = data.content;
                             this.qtdRegistro = data.pageable.pageSize;
                             this.totalRegistro = data.totalPages * this.qtdRegistro;
                         }
                         this.carregando = false;
                });
            },

            visualizarHistorico(idClassificacao) {

                this.historicoDialog = true;
                this.idTipoClassificacao1 = 'TIPO_CLASSIFICACAO';
                this.idClassificacao = idClassificacao;
                
            },

            ocultarHistorico() {
                this.historicoDialog = false;
                this.idTipoClassificacao = null;
            },

            cadastrar() {
                this.$router.push(`/tipo-classificacao/cadastrar`);
            },

            editar(tipoClassificacao) {

                this.$router.push(`/tipo-classificacao/editar/${tipoClassificacao}`);
            },

            // limparFiltro() {
            //     this.filtro = null;
            //     this.carregar();
            // },

            limparFiltro() {
                this.initFilters();
            },

            confirmarAtivarOuInativar(tipoClassificacao) {
                this.tipoClassificacaoData = tipoClassificacao;
                this.ativarOuInativarDialog = true;
            },

            ativarOuInativar() {
                if(this.tipoClassificacaoData.ativo) {

                    TipoClassificacaoService.inativar(this.tipoClassificacaoData.tipoClassificacao)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O tipo de classificação foi inativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregar();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao inativar o tipo de classificação!`, 
                                life: 3000
                            });
                        });
                }
                else {

                    TipoClassificacaoService.ativar(this.tipoClassificacaoData.tipoClassificacao)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O tipo de classificação foi ativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregar();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao ativar o tipo de classificação!`, 
                                life: 3000
                            });
                        });
                }
            },

            onPage(event) {
                this.pagina = event.page;
                this.qtdRegistro = event.rows;
                this.carregar();
            },
           

            initFilters() {
                this.filtro = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                'tipo': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}
                }
            },

            formatDateCustom(date, format) {
                return Formatacao.formatDateCustom(date, format);

            },
            
            sincronizar(id){
                TipoClassificacaoService.sincronizarComERP(id)
                    .then(() => {
                        this.$toast.add({
                            severity:"success",
                            detail: "Sincronização solicitada com sucesso.", 
                            life: 5000
                        });
                        
                        
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
                            this.carregar();
                        }, 3000);

                    });
            }
            
        }
    }
</script>
