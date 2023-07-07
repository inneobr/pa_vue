<template>
    <div class="card" >
        <Toast />

        <div class="flex align-items-center">
            <i class="pi pi-window-minimize mr-2" style="font-size: 1.5rem;"></i>
            <h3 style="margin:0;">Situação RE</h3>
        </div>
        <hr />  
            <DataTable 
                showGridlines
                responsiveLayout="stack"
                :value="content"
                :loading="carregando"   
                @sort="sort($event)"       
            >
                <template #header>
                    <div class="flex justify-content-between lg:align-items-end flex-column lg:flex-row">
                        <div class="flex">
                            
                            <Button v-if="integration.visible"
                                type="button"
                                label="Cadastrar"
                                class="p-button-info mr-2" 
                                icon="pi pi-plus"
                                style="padding: 0.4rem;"
                                @click="cadastrar()"
                            ></Button>

                            <Button type="button" 
                                icon="pi pi-filter-slash" 
                                label="Limpar filtro" 
                                class="p-button-outlined mr-2" 
                                @click="filtroDescricao = ''; 
                                carregarDados()"
                            ></Button>

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
                                style="padding: 0.4rem;"
                                @click="situacao = 'ATIVO'; carregarDados()"
                            ></Button>

                        </div>

                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filtroDescricao" placeholder="Pesquisar" @change="carregarDados()"/>
                        </span>
                        
                    </div>
                </template>

                <template #empty>
                    Nenhum registro encontrado.
                </template>

                <template #loading>
                    Carregando... Por favor, aguarde.
                </template>

                <Column field="codigo" header="Código"  style="width:5rem;" sortable />
                <Column field="descricao" header="Descrição" sortable />

                <Column v-if="integration.visible" header="Ações" style="width:8rem;">
                    <template #body="{ data }">
                        <Button class="p-button-rounded p-button-info flex-none mr-2" icon="pi pi-pencil" @click="editar(data)"></Button>
                        <Button class="p-button-rounded p-button-info" icon="pi pi-check-circle" @click="confirmarAtivarOuInativar(data)"  v-if="data.ativo"></Button>
                        <Button class="p-button-rounded p-button-danger" icon="pi pi-ban" @click="confirmarAtivarOuInativar(data)" v-if="!data.ativo"></Button>
                    </template>
                </Column>
            </DataTable>
       
        <Paginator
            v-model:first="firstRow"
            :rows="qtdRegistro"
            :totalRecords="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage">
        </Paginator>       
    </div>

    <Dialog v-model:visible="ativarDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"></i>
            <span>Deseja <strong>{{ item.ativo ? 'inativar' : 'ativar' }}</strong> a classe "{{ item.descricao }}"?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text p-button-danger" @click="ativarDialog = false"></Button>
            <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="ativarOuInativar()"></Button>
        </template>
    </Dialog>

    <Dialog v-model:visible="formDialog" :style="{width: '450px'}" :header="formDialogTitulo" :modal="true" @hide="fecharFormDialog()">
        <div class="grid">
            <div class="col-12">
                <Message v-for="msg of formMessage" :severity="msg.severity" :key="msg.message" :life="5000">{{msg.message}}</Message>
            </div>

            <div class="col-4" style="overflow: hidden;">
                <label for="codigo"><strong>Código</strong></label>
                <InputNumber
                    id="codigo"
                    v-model="item.codigo"
                    class="w-full mt-1 "
                    :class="{'p-invalid': codigoIsInvalid}"
                />
            </div> 

            <div class="col-8">
                <label for="descricao"><strong>Descrição</strong></label>
                <InputText
                    id="descricao"
                    v-model="item.descricao"
                    class="w-full mt-1 "
                    :class="{'p-invalid': descricaoIsInvalid}"
                />
            </div>  
        </div>
        <template #footer>
            <Button label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info" @click="salvar()" :disabled="doubleClick"></Button>
            <Button label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger" @click="fecharFormDialog()"></Button>
        </template>
    </Dialog>
</template>

<script>
    
    import SituacaoRe from '../../service/SituacaoRe';
    import IntegracaoService from '../../service/IntegracaoService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        name: 'Situação Re',
        components: {},
        data() {
            return {
                content: [],
                firstRow: 0,
                carregando: false,
                totalRegistro: 0,
                qtdRegistro: 10,
                pagina: 0,
                ordenar: "codigo,asc",

                filtroDescricao: "",
                situacao: 'ATIVO',
                
                grupo: [],
                idGrupo: null,
                historicoDialog: false,
                tipoClassificacaoFiltrados: [],
                ipoClassificacaoSelecionado: null,

                item: {},
                formMessage: [],
                formDialogTitulo: 'Cadastrar',
                formDialog: false,
                ativarDialog: false,
                integration: {},
                codigoIsValid: false,
                descricaoIsInvalid: false,
                doubleClick:false,
            }
        },

        mounted() {
            this.carregarDados();
            //this.getIntegrationOptons();
        },

        methods: {            

            getIntegrationOptons(){
                const paginaAtual = "SITUACAO_RE";
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

            carregarDados() {
                this.carregando = true;

                SituacaoRe.getSituacaoRePaginacao(this.pagina, this.qtdRegistro, this.ordenar, this.situacao, this.filtroDescricao)
                    .then(({ data }) => {
                        if(data) {
                            this.content = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalElements;
                            //StorageService.setControlePaginaFilter("SITUACAO_RE", this.pagina, this.firstRow, this.qtdRegistro, this.filtros);
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
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;      
                this.carregarDados();
            },

            formatDateCustom(date, format) {
                return Formatacao.formatDateCustom(date, format);

            },           

            // visualizarHistorico(id) {
            //     this.historicoDialog = true;
            //     this.idGrupo = id;
            // },

            // ocultarHistorico() {
            //     this.historicoDialog = false;
            //     this.idGrupo = null;
            // },

            // confirmarAtivarOuInativar(data) {
            //     this.item = data;
            //     this. ativarDialog = true;
            // },

            // ativarOuInativar(){
            //     if(!this.item) return;

            //     if(this.item.ativo) {
            //         SementeClasseService.inativar(this.item.id)
            //         .then(response => {                            
            //             this.$toast.add({
            //                 severity:'success',
            //                 detail:'A classe foi inativada com sucesso!', 
            //                 life: 3000
            //             });

            //             this.ativarDialog = false;
            //             this.carregarDados();
            //         })
            //         .catch(error => {
            //             this.$toast.add({
            //                 severity:'warn',
            //                 detail:'Não foi possível inativar a classe',
            //                 life: 3000
            //             });
            //         }); 
            //     }
            //     else {
            //         SementeClasseService.ativar(this.item.id)
            //             .then(response => {                            
            //                 this.$toast.add({
            //                     severity:'success',
            //                     detail:'A classe foi ativada com sucesso!', 
            //                     life: 3000
            //                 });

            //                 this.ativarDialog = false;
            //                 this.carregarDados();
            //             })
            //             .catch(({ response }) => {
            //                 this.$toast.add({
            //                     severity:'warn', 
            //                     summary:'Não foi possível ativar a classe!', 
            //                     detail: response.data.exception, 
            //                     life: 5000
            //                 });
            //             });
            //     }
            // },

            // cadastrar() {
            //     this.formDialogTitulo = "Cadastrar classe semente";
            //     this.formDialog = true;
            //     this.item = {};
            // },

            // editar(dados) {
            //     this.formDialogTitulo = "Editar classe semente";
            //     this.formDialog = true;
            //     this.item = Object.assign({}, dados);;
            // },

            // validarCampos() {
            //     let isInvalid = false;

            //     if(this.item.codigo === undefined || this.item.codigo === "") {
            //         this.codigoIsInvalid = true;
            //         isInvalid = true;
            //     }

            //     if(this.item.descricao ===  undefined || this.item.descricao === "") {
            //         this.descricaoIsInvalid = true;
            //         isInvalid = true;
            //     }

            //     if(isInvalid) {
            //         this.$toast.add({
            //             severity:'warn',
            //             detail:'Preencher os campos obrigatórios.', 
            //             life: 3000
            //         });
            //     }

            //     return isInvalid;
            // },

            // salvar() {
            //     if(!this.item || this.validarCampos() && !this.doubleClick) return;
            //     this.doubleClick = false;

            //     SementeClasseService.salvar(this.item)
            //         .then(({ data }) => {
            //             this.$toast.add({
            //                 severity: data.integrated ? "success" : "error",
            //                 detail: data.message, 
            //                 life: 3000
            //             });
            //             this.fecharFormDialog();
            //             this.carregarDados();
            //         })
            //         .catch(({ response }) => {
            //             this.doubleClick = false;
            //             this.formMessage.push({severity: 'warn', message: response.data.message})

            //             for(let message of response.data.exception.split('\n')) {
            //                 this.formMessage.push({severity: 'info', message: message});
            //             }
            //         });
            // },

            // fecharFormDialog() {
            //     this.formDialogTitulo = "";
            //     this.formDialog = false;
            //     this.item = {};
            //     this.codigoIsInvalid = false;
            //     this.descricaoIsInvalid = false;
            //     this.formMessage = [];
            // }
        }
    }

</script>
