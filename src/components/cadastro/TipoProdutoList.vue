<template>
    <div class="card" >
        <Toast />

        <div class="flex align-items-center">
            <i class="pi pi-window-minimize mr-2" style="font-size: 1.5rem;"></i>
            <h3 style="margin:0;">Tipos de Produto</h3>
        </div>
        <hr />  
            <DataTable 
                showGridlines
                responsiveLayout="stack"
                :value="content"
                :loading="carregando"   
                selectionMode="single"
                v-model:selection="tipoProduto"
                @sort="sort($event)" >


                <template #header>
                    <div class="flex justify-content-between">
                        <div class="flex">
                            <Button v-if="integration.visible" type="button" label="Cadastrar" class="p-button-info mr-2" icon="pi pi-plus" @click="cadastrar()" />
                            <Button type="button" icon="pi pi-filter-slash" label="Limpar filtro" class="p-button-outlined mr-2" 
                                @click="filtroNome = ''; carregarDados()"/>

                            <Button
                                v-if="situacao == 'ATIVO'"
                                type="button"
                                icon="pi pi-ban"
                                label="Listar inativos"
                                class="p-button-outlined p-button-danger mr-2"
                                style="padding: 0.4rem;"
                                @click="situacao = 'INATIVO'; carregarDados()"
                            ></Button>

                            <Button
                                v-if="situacao == 'INATIVO'" 
                                type="button"
                                icon="pi pi-check-circle"
                                label="Listar ativos"
                                class="p-button-outlined mr-2"
                                style="padding: 0.4rem; "
                                @click="situacao = 'ATIVO'; carregarDados()"
                            ></Button>
                        </div>

                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filtroNome" placeholder="Pesquisar" @change="carregarDados()"/>
                        </span>
                    </div>
                </template>


                <template #empty>
                    Nenhum registro encontrado.
                </template>

                <template #loading>
                    Carregando... Por favor, aguarde.
                </template>

                <Column field="nome" header="Nome" sortable />

                <Column field="descricaoStatusIntegracao" header="Status Integração" style="width:10rem;">
                    <template #body="{ data }">
                        {{ data.descricaoStatusIntegracao}}
                    </template>
                </Column>

                <Column field="dataIntegracao" header="Data Integração" style="width:13rem;">
                    <template #body="{ data }">
                        {{ formatDateCustom(data.dataIntegracao, 'DD/MM/YYYY HH:mm:ss') }}
                    </template>
                </Column>

                <Column field="ativo" header="Situação" style="width:5rem;">
                    <template #body="{ data }">
                        {{ data.ativo ? 'Ativo' : 'Inativo' }}
                    </template>
                </Column>                

                <Column v-if="integration.visible" header="Ações" style="width:12rem;">
                    <template #body="{ data }">
                        <Button class="p-button-rounded p-button-info flex-none mr-3" icon="pi pi-pencil" title="Editar" @click="editar(data)"></Button>
                        <Button class="p-button-rounded p-button-warning flex-none mr-3" icon="pi pi-send" title="Sincronizar com ERP" @click="sincronizar(data.idUnico)"></Button>
                        <Button class="p-button-rounded p-button-info" icon="pi pi-check-circle" @click="confirmarAtivarOuInativar(data)" title="Inativar" v-if="data.ativo"></Button>
                        <Button class="p-button-rounded p-button-danger" icon="pi pi-ban" @click="confirmarAtivarOuInativar(data)" title="Ativar" v-if="!data.ativo"></Button>
                    </template>
                </Column>
            </DataTable>
       
        <Paginator
            :rows="qtdRegistro"
            :totalRecords="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage">
        </Paginator>       
    </div>

    <Dialog v-model:visible="ativarDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"></i>
            <span>Tem certeza que deseja <strong>{{ item.ativo ? 'inativar' : 'ativar' }}</strong> o tipo produto: "{{ item.nome }}"?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarDialog = false"></Button>
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()"></Button>
        </template>
    </Dialog>

    <Dialog v-model:visible="formDialog" :style="{width: '350px'}" :header="formDialogTitulo" :modal="true" @hide="fecharFormDialog()">
        <div class="grid">
            <div class="col-12">
                <Message v-for="msg of formMessage" :severity="msg.severity" :key="msg.message" :life="5000">{{msg.message}}</Message>
            </div>

            <div class="col-12">
                <label for="nome"><strong>Nome</strong></label>
                <InputText
                    id="nome"                    
                    v-model="item.nome"
                    class="w-full mt-1 fontUpper"
                    @keyup="item.nome = item.nome.toUpperCase()" 
                    :class="{'p-invalid': nomeIsInvalid}"
                    autofocus
                />
            </div>  
        </div>
        <template #footer>
            <Button label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info" @click="salvar()"></Button>
            <Button label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger" @click="fecharFormDialog()"></Button>
        </template>
    </Dialog>
</template>

<script>
    import IntegracaoService from '../../service/IntegracaoService'
    import TipoProdutoService from '../../service/TipoProdutoService';
    import TratamentoDeError from '../../utilities/TratamentoDeError';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        name: 'Tipos de Produto',
        components: {},
        data() {
            return {
                content: [],
                carregando: false,
                totalRegistro: 0,
                qtdRegistro: 10,
                pagina: 0,
                ordenar: "dataAtualizacao,desc",

                filtroNome: "",
                situacao: 'ATIVO',

                item: {},
                formMessage: [],
                formDialogTitulo: 'Cadastrar',
                formDialog: false,
                ativarDialog: false,
                tipoProduto:{},

                nomeIsInvalid: false,
                integration: {},
                tipoProduto:{},
            }
        },

        mounted() {
            this.carregarDados();
            this.getIntegrationOptons();
        },

        methods: {
            getIntegrationOptons(){
                const paginaAtual = "TIPO_PRODUTO";
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

            carregarDados() {
                this.carregando = true;

                TipoProdutoService.getTipoProdutos(this.pagina, this.qtdRegistro, this.ordenar, this.situacao, this.filtroNome)
                    .then(({ data }) => {
                        if(data) {
                            this.content = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                            this.carregando = false;
                        }
                    })
                    .catch(error => {
                        this.content = [];
                        this.carregando = false;
                    })
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.content = [];
                this.carregarDados();
            },
            
            onPage(event) {
                this.pagina = event.page;
                this.qtdRegistro = event.rows;
                this.carregarDados();
            },

            formatDateCustom(date, format) {
                return Formatacao.formatDateCustom(date, format);

            },  

            confirmarAtivarOuInativar(data) {
                this.item = data;
                this. ativarDialog = true;
            },

            ativarOuInativar(){
                if(!this.item) return;

                if(this.item.ativo) {
                    TipoProdutoService.inativar(this.item.idUnico)
                    .then(response => {                            
                        this.$toast.add({
                            severity:'success',
                            detail:'O tipo porduto foi inativado com sucesso!', 
                            life: 3000
                        });

                        this.ativarDialog = false;
                        this.carregarDados();
                    })
                    .catch(error => {
                        /*this.$toast.add({
                            severity:'warn',
                            detail:'Não foi possível inativar o tipo produto.',
                            life: 3000
                        });*/

                        this.$toast.add(TratamentoDeError(error, 'inativar'));

                        this.ativarDialog = false;
                    }); 
                }
                else {
                    TipoProdutoService.ativar(this.item.idUnico)
                        .then(response => {                            
                            this.$toast.add({
                                severity:'success',
                                detail:'O tipo produto foi ativado com sucesso!', 
                                life: 3000
                            });

                            this.ativarDialog = false;
                            this.carregarDados();
                        })
                        .catch(({ response }) => {
                            this.$toast.add({
                                severity:'warn', 
                                summary:'Não foi possível ativar o tipo produto!', 
                                detail: response.data.exception, 
                                life: 5000
                            });
                        });
                }
            },

            cadastrar() {
                this.formDialogTitulo = "Cadastrar tipo de produto";
                this.formDialog = true;
                this.item = {};
                
            },

            editar(dados) {
                this.formDialogTitulo = "Editar tipo de produto";
                this.formDialog = true;
                this.item = Object.assign({}, dados);;
            },

            validarCampos() {
                let isInvalid = false;

                if(this.item.nome ===  undefined || this.item.nome === "") {
                    this.nomeIsInvalid = true;
                    isInvalid = true;
                }

                if(isInvalid) {
                    this.$toast.add({
                        severity:'warn',
                        detail:'Preencher os campos obrigatórios.', 
                        life: 3000
                    });
                }

                return isInvalid;
            },

            salvar() {
                if(!this.item || this.validarCampos()) return;

                TipoProdutoService.salvar(this.item)
                    .then(({ data }) => {
                        this.$toast.add({
                            severity: data.integrated ? "success" : "error",
                            detail: data.message, 
                            life: 3000
                        });
                        this.fecharFormDialog();
                        this.carregarDados();
                    })
                    .catch(error => {
                            this.$toast.add(TratamentoDeError(error, true));
                    });
            },

            sincronizar(idUnico) {
                if(idUnico === undefined) return;

                TipoProdutoService.sincronizarComERP(idUnico)
                    .then(() => {
                        this.$toast.add({
                            severity:"success",
                            detail: "Sincronização solicitada com sucesso.", 
                            life: 3000
                        });
                        this.carregarDados();
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:"error",
                            detail: "Erro ao tentar sincronizar.", 
                            life: 3000
                        });
                    });
            },

            fecharFormDialog() {
                this.formDialogTitulo = "";
                this.formDialog = false;
                this.item = {};
                this.nomeIsInvalid = false;
                this.formMessage = [];
            },

            handleInputOnChange() {
                this.item.nome = this.item.nome.toUpperCase()
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            }
        }
    }

</script>

<style>
    .fontUpper{
        text-transform: uppercase;
    }
</style>