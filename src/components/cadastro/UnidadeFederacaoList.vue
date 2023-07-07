<template>
    <div class="card" >
        <Toast />

        <div class="flex align-items-center">
            <i class="pi pi-window-minimize mr-2" style="font-size: 1.5rem;"></i>
            <h3 style="margin:0;">Unidade de Federação</h3>
        </div>

        <Message v-if="message_error_visible" severity="warn" :closable="true">{{ message_error }}</Message>
        <hr />  

        <DataTable 
            showGridlines
            responsiveLayout="stack"
            :value="content"
            :loading="carregando"   
            @sort="sort($event)"  
            selectionMode="single"
            v-model:selection="unidadeSelecionada"      
        >
            <template #header>
                <div class="flex justify-content-between align-items-center ">
                    <div class="flex align-items-center lg:align-items-end flex-column lg:flex-row">
                        <Button v-if="integration.visible"
                            type="button"
                            label="Cadastrar"
                            class="p-button-info mr-2" 
                            icon="pi pi-plus"
                            style="padding: 0.4rem;"
                            @click="cadastrar()"
                        ></Button>

                        <FileUpload v-if="integration.visible"
                            style="padding: 0.4rem;"
                            class="p-button-outlined mr-2" 
                            mode="basic"
                            chooseLabel="Importar via XLS"
                            ref="uploadXls" :auto="true"
                            :customUpload="true"
                            @uploader="uploadXlsAction"
                        />

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

                    <span class="p-input-icon-left mr-2">
                        <i class="pi pi-search" />
                        <InputText 
                            v-model="filtroDescricao"
                            placeholder="Pesquisar"
                            @change="carregarDados()"
                        />
                    </span>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="codigoIbge" header="Código IBGE" class="pb-3 pt-3" style="width:10rem;" sortable />
            <Column field="estado" header="Sigla" style="width:5rem;" sortable />
            <Column field="estadoNome" header="Estado" sortable />

            <Column field="dataAtualizacao" header="Atualização" style="width:11rem;" sortable>
                <template #body="{ data }">
                    {{ formatDateCustom(data.dataAtualizacao, 'DD/MM/YYYY HH:mm:ss') }}
                </template>
            </Column>

            <Column field="ativo" header="Situação" style="width:5rem;">
                <template #body="{ data }">
                    {{ data.ativo ? 'Ativo' : 'Inativo' }}
                </template>
            </Column>

            <Column v-if="integration.visible" header="Ações" style="width:8rem;">
                <template #body="{ data }">
                    <Button class="p-button-rounded p-button-info flex-none mr-2" icon="pi pi-pencil" @click="editar(data)"></Button>
                    <Button class="p-button-rounded p-button-info" icon="pi pi-check-circle" @click="confirmarAtivarOuInativar(data)"  v-if="data.ativo" ></Button>
                    <Button class="p-button-rounded p-button-danger" icon="pi pi-ban" @click="confirmarAtivarOuInativar(data)" v-if="!data.ativo"></Button>
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
            <span>Deseja <strong>{{ item.ativo ? 'inativar' : 'ativar' }}</strong> a Unidade de Federação: "{{ item.estadoNome }}"?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarDialog = false"></Button>
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()"></Button>
        </template>
    </Dialog>

    <Dialog v-model:visible="formDialog" :style="{width: '400px'}" :header="formDialogTitulo" :modal="true" @hide="fecharFormDialog()">
        <div class="grid">
            <div class="col-12">
                <Message v-for="msg of formMessage" :severity="msg.severity" :key="msg.message" :life="5000">{{msg.message}}</Message>
            </div>

            <div class="col-4" style="overflow: hidden;">
                <label for="sigla"><strong>Sigla</strong></label>
                <InputText
                    id="sigla"
                    v-model="item.estado"
                    class="w-full mt-1 "
                    :class="{'p-invalid': siglaIsInvalid}"
                />
            </div> 

            <div class="col-8">
                <label for="codigoIbge"><strong>Código IBGE</strong></label>
                <InputText
                    id="codigoIbge"
                    v-model="item.codigoIbge"
                    class="w-full mt-1 "
                    :class="{'p-invalid': codigoIbgeIsInvalid}"
                />
            </div> 

            <div class="col-12">
                <label for="estado"><strong>Estado</strong></label>
                <InputText
                    id="estado"
                    v-model="item.estadoNome"
                    class="w-full mt-1 "
                    :class="{'p-invalid': estadoIsInvalid}"
                />
            </div>  
        </div>
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text p-button-danger" @click="fecharFormDialog()"></Button>
            <Button label="Salvar" icon="pi pi-check" class="p-button-text " @click="salvar()"></Button>
        </template>
    </Dialog>

    <Dialog
        v-model:visible="visivelModalImportar"
        :breakpoints="{'960px': '75vw', '640px': '90vw'}"
        :style="{width: '70vw'}"
        :maximizable="true"
        :modal="true"
        @hide="fecharModalImportar()"
    >
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-book mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Status dos registros importados</h3>
            </div>
        </template>
        <div class="grid">     
            <div class="col-12">
                <DataTable responsiveLayout="stack" scrollDirection="both" showGridlines :value="listaParaImportar">
                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="estado" header="Sigla" style="width:5rem;" />
                    <Column field="estadoNome" header="Estado" style="width:15rem;" />
                    <Column field="codigoIbge" header="Código IBGE" style="width:10rem;" />
                    <Column field="integrated" header="Integrado?" style="width:5rem;">
                        <template #body="{ data }">
                            {{ data.integrated === true ? "Sim" : "Não" }}
                        </template>
                    </Column>
                    <Column field="message" header="Mensagem" />
                    <Column field="exception" header="Detalhes" />
                </DataTable>
            </div>
        </div>
        <template #footer>
            
        </template>
    </Dialog>
</template>

<script>
    import UnidadeFederacaoService from '../../service/UnidadeFederacaoService';
    import IntegracaoService from '../../service/IntegracaoService'
    import Formatacao from '../../utilities/Formatacao';
    import { read, utils } from 'xlsx';

    export default {
        name: 'Semente classe',
        components: {},
        data() {
            return {
                content: [],
                carregando: false,
                totalRegistro: 0,
                qtdRegistro: 10,
                pagina: 0,
                ordenar: "dataAtualizacao,desc",

                filtroDescricao: "",
                situacao: 'ATIVO',

                item: {},
                formMessage: [],
                formDialogTitulo: 'Cadastrar',
                formDialog: false,
                ativarDialog: false,

                siglaIsInvalid: false,
                codigoIbgeIsInvalid: false,
                estadoIsInvalid: false,

                visivelModalImportar: false,
                listaParaImportar: [],
                
                message_error: null,
                message_error_visible: false,
                integration: {},
                unidadeSelecionada: {}
            }
        },

        mounted() {
            this.carregarDados();
            this.getIntegrationOptons();
        },

        methods: {
            getIntegrationOptons(){
                const paginaAtual = "UNIDADE_FEDERACAO";
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

                UnidadeFederacaoService.getClasseComPaginacao(this.pagina, this.qtdRegistro, this.ordenar, this.situacao, this.filtroDescricao)
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
                this.pagina = event.page + 1;
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
                    UnidadeFederacaoService.inativar(this.item.id)
                    .then(response => {                            
                        this.$toast.add({
                            severity:'success',
                            detail:'A unidade de federação foi inativada com sucesso!', 
                            life: 3000
                        });

                        this.ativarDialog = false;
                        this.carregarDados();
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'warn',
                            detail:'Não foi possível inativar a unidade de federação',
                            life: 3000
                        });
                    }); 
                }
                else {
                    UnidadeFederacaoService.ativar(this.item.id)
                        .then(response => {                            
                            this.$toast.add({
                                severity:'success',
                                detail:'A unidade de federação foi ativada com sucesso!', 
                                life: 3000
                            });

                            this.ativarDialog = false;
                            this.carregarDados();
                        })
                        .catch(({ response }) => {
                            this.$toast.add({
                                severity:'warn', 
                                summary:'Não foi possível ativar a unidade de federação!', 
                                detail: response.data.exception, 
                                life: 5000
                            });
                        });
                }
            },

            cadastrar() {
                this.formDialogTitulo = "Cadastrar unidade de federação";
                this.formDialog = true;
                this.item = {};
            },

            editar(dados) {
                this.formDialogTitulo = "Editar unidade de federação";
                this.formDialog = true;
                this.item = Object.assign({}, dados);;
            },

            validarCampos() {
                let isInvalid = false;

                if(this.item.estado === undefined || this.item.estado === "") {
                    this.siglaIsInvalid = true;
                    isInvalid = true;
                }

                if(this.item.codigoIbge ===  undefined || this.item.codigoIbge === "") {
                    this.codigoIbgeIsInvalid = true;
                    isInvalid = true;
                }

                if(this.item.estadoNome ===  undefined || this.item.estadoNome === "") {
                    this.estadoIsInvalid = true;
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

                UnidadeFederacaoService.salvar(this.item)
                    .then(({ data }) => {
                        this.$toast.add({
                            severity: data.integrated ? "success" : "error",
                            detail: data.message, 
                            life: 3000
                        });
                        this.fecharFormDialog();
                        this.carregarDados();
                    })
                    .catch(({ response }) => {
                        this.formMessage.push({severity: 'warn', message: response.data.message})

                        for(let message of response.data.exception.split('\n')) {
                            this.formMessage.push({severity: 'info', message: message});
                        }
                    });
            },

            fecharFormDialog() {
                this.formDialogTitulo = "";
                this.formDialog = false;
                this.item = {};
                this.siglaIsInvalid = false;
                this.codigoIbgeIsInvalid = false;
                this.estadoIsInvalid = false;
                this.formMessage = [];
            },

            uploadXlsAction(event) {
                const _this = this;
                const fileUpload = event;
                
                const regex = /(.xls|.xlsx)$/;
                if (regex.test(fileUpload.files[0].name.toLowerCase())) {
                    if (typeof (FileReader) != "undefined") {
                        const reader = new FileReader();
        
                        //Para navegadores diferentes do IE.
                        if (reader.readAsBinaryString) {
                            reader.onload = function (e) {
                                _this.carregarCodigoIbge(e.target.result);
                            };
                            reader.readAsBinaryString(fileUpload.files[0]);
                        } else {
                            //Para o navegador IE.
                            reader.onload = function (e) {
                                const bytes = new Uint8Array(e.target.result);
                                let data = "";
                                for (var i = 0; i < bytes.byteLength; i++) {
                                    data += String.fromCharCode(bytes[i]);
                                }
                                _this.carregarCodigoIbge(data);
                            };
                            reader.readAsArrayBuffer(fileUpload.files[0]);
                        }
                    } else {
                        this.message_error = "Este navegador não suporta HTML5.";
                        this.message_error_visible = true;
                        this.limparUpload();
                    }
                } else {
                    this.message_error = `Carregue um arquivo Excel válido!`;
                    this.message_error_visible = true;
                    this.limparUpload();
                }
            },

            carregarCodigoIbge(data) {
                const workbook = read(data, { type: 'binary' });
                const Sheet = workbook.SheetNames[0];
                const linhas = utils.sheet_to_json(workbook.Sheets[Sheet]);

                if(linhas.length <= 0) {
                    this.message_error = `A planilha carregada não possui dados!`;
                    this.message_error_visible = true;
                    this.limparUpload();
                    return;
                }
                
                if(!this.isColunasEstaoCorretas(linhas[0])) {
                    this.limparUpload();
                    return;
                }

                const listaCodigoIbge = [];

                for(let linha of linhas) {
                    const codigoIbge = {
                        estado: linha["SIGLA"],
                        estadoNome: linha["ESTADO"],
                        codigoIbge: linha["CODIGO IBGE"]
                    };
                    listaCodigoIbge.push(codigoIbge); 
                }
                 
                this.$toast.add({
                    severity:'success',
                    summary: "O upload está sendo executado...",
                    detail:'Por favor, aguarde a operação ser concluída!', 
                    life: 5000
                });

                UnidadeFederacaoService.salvarVarios(listaCodigoIbge)
                    .then(({ data }) => {
                        this.visivelModalImportar = true;
                        this.listaParaImportar = data;
                    })
                    .catch(({ response }) => {
                        this.message_error = response.data.message;
                        this.message_error_visible = true;
                    });

                this.limparUpload();
            },

            fecharModalImportar() {
                this.visivelModalImportar = false;
                this.listaParaImportar = [];
            },

            limparUpload() {
                this.$refs.uploadXls.clear();
                this.$refs.uploadXls.uploadedFileCount = 0;
            },

            isColunasEstaoCorretas(dados) {
                const colunasObrigatorias = [];
                
                if(dados["SIGLA"] == undefined) {
                    colunasObrigatorias.push("Sigla");
                }

                if(dados["ESTADO"] == undefined) {
                    colunasObrigatorias.push("Estado");
                }

                if(dados["CODIGO IBGE"] == undefined) {
                    colunasObrigatorias.push("Código IBGE");
                }

                const colunas = colunasObrigatorias.join("\", \"");
                if(colunasObrigatorias.length > 1) {
                    this.message_error = `A planilha não pode ser carregada devido não existirem as colunas "${ colunas }"!`;
                    this.message_error_visible = true;

                    return false;
                }
                else if(colunasObrigatorias.length > 0) {
                    this.message_error = `A planilha não pode ser carregada devido não existir a coluna "${ colunas }"!`;
                    this.message_error_visible = true;

                    return false;
                }

                return true;
            }
        }
    }

</script>