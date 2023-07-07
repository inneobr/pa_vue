<template>
    <div class="card" >
        <Toast />

        <div class="flex align-items-center">
            <i class="pi pi-window-minimize mr-2" style="font-size: 1.5rem;"></i>
            <h3 style="margin:0;">Participante Bayer</h3>
        </div>

        <Message v-if="message_error_visible" severity="warn" :closable="true">{{ message_error }}</Message>
        <hr />  
        <DataTable 
            showGridlines
            responsiveLayout="stack"
            :value="content"
            :loading="carregando"  
            selectionMode="single"
            v-model:selection="participanteBayerSelection" 
            @sort="sort($event)"       
        >
            <template #header>
                <div class="flex justify-content-between">
                    <div class="flex">
                        <Button v-if="integration.visible"
                            type="button"
                            label="Cadastrar"
                            class="p-button-info mr-2" 
                            icon="pi pi-plus"
                            @click="cadastrar()"
                        ></Button>

                        <FileUpload v-if="integration.visible"
                            class="p-button-outlined" 
                            mode="basic"
                            chooseLabel="Importar via XLS"
                            ref="uploadXls"
                            :auto="true"
                            :customUpload="true"
                            @uploader="uploadXlsAction"
                        />

                        <Button v-if="integration.visible" icon="pi" class="p-button-outlined mr-2" @click="visualizarInformacao('PART_BAYER_XLSX')">
                            <i class="pi pi-info-circle" style=""></i>
                        </Button>

                        <Button v-if="integration.visible"
                                type="button"
                                icon="pi pi-trash"
                                label="Excluir Todos"
                                class="p-button p-button-danger mr-2"
                                style="padding: 0.4rem;"
                                @click="confirmarExclusaoTodos()"
                            ></Button>

                        <Button v-if="integration.visible"
                                type="button"
                                icon="pi pi-check"
                                label="Conferência"
                                title="Realizara a confrência dos Paticipantes Bayer com o Produtor"
                                class="p-button p-button-warning mr-2"
                                style="padding: 0.4rem;"
                                @click="validarProdutor()"
                            ></Button>
                    </div>

                    <InputText 
                        v-model="filtro"
                        placeholder="Pesquisar"
                        @change="carregarDados()"
                    />
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="cnpj" header="CNPJ" style="width:11rem;" sortable>
                <template #body="{ data }">
                    {{ formataCnpj(data.cnpj) }}
                </template>
            </Column>
            
            <Column field="nome" header="Nome" sortable />

            <Column field="origem" header="Origem" style="width:8rem;" sortable>
                <template #body="{ data }">
                    {{ data.origem == 'MANUAL' ? 'Manual' : 'Importação' }}
                </template>
            </Column>

            <Column field="dataInclusao" header="Data inclusão" style="width:11rem;" sortable />

            <Column v-if="integration.visible" header="Ações" style="width:5rem; text-align: center;">
                <template #body="{ data }">
                    <Button
                        class="p-button-rounded p-button-danger"
                        icon="pi pi-trash"
                        title="Excluir"
                        @click="confirmarExclusao(data)"
                    ></Button>
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

    <Dialog v-model:visible="excluirDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"></i>
            <span>Deseja <strong>excluir</strong> o Participante Bayer "{{ item.nome }}"?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="excluirDialog = false"></Button>
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="excluir()"></Button>
        </template>
    </Dialog>

    <Dialog v-model:visible="excluirTodosDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"></i>
            <span>Deseja <strong>excluir</strong> todos os registros de Participantes Bayer?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="excluirTodosDialog = false"></Button>
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="excluirTodos()"></Button>
        </template>
    </Dialog>

    <Dialog v-model:visible="formDialog" :style="{width: '450px'}" :header="formDialogTitulo" :modal="true" @hide="fecharFormDialog()">
        <div class="grid">
            <div class="col-12">
                <Message v-for="msg of formMessage" :severity="msg.severity" :key="msg.message" :life="5000" :sticky="false">{{msg.message}}</Message>
            </div>

            <div class="col-5" style="overflow: hidden;">
                <label for="cnpj"><strong>CNPJ</strong></label>
                <InputMask
                    id="cnpj"
                    v-model="item.cnpj"
                    mask="99.999.999/9999-99"
                    class="w-full mt-1"
                    :class="{'p-invalid': cnpjIsInvalid}"
                />
            </div> 

            <div class="col-7">
                <label for="nome"><strong>Nome</strong></label>
                <InputText
                    id="nome"
                    v-model="item.nome"
                    class="w-full mt-1 "
                    :class="{'p-invalid': nomeIsInvalid}"
                />
            </div>  
        </div>
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text p-button-danger" @click="fecharFormDialog()"></Button>
            <Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="salvar()"></Button>
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
                <h3 style="margin:0px 5px;">Registro com inconsistência</h3>
            </div>
        </template>
        <div class="grid">     
            <div class="col-12">
                <DataTable responsiveLayout="stack" scrollDirection="both" showGridlines :value="listarParticipanteBayerComErro">
                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="linha" header="Linha" style="width:8rem;"></Column>
                    <Column field="cnpj" header="CNPJ" style="width:11rem;" />
                    <Column field="nome" header="Nome" />
                    <Column field="mensagem" header="Mensagem" />
                </DataTable>
            </div>
        </div>
        <template #footer>
            
        </template>
    </Dialog>

    <Dialog
        v-model:visible="visivelModalValidar"
        :breakpoints="{'960px': '75vw', '640px': '90vw'}"
        :style="{width: '70vw'}"
        :maximizable="true"
        :modal="true"
        @hide="fecharModalValidar()"
    >
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-book mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Conferência Participante Bayer</h3>
            </div>
        </template>
        <div class="grid">     
            <div class="col-12">
                <p v-html="listarParticipanteBayerValidacao"></p>
                
                <!-- <DataTable responsiveLayout="stack" scrollDirection="both" showGridlines :value="listarParticipanteBayerValidacao">
                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="" header="Mensagem"></Column>
                    
                </DataTable> -->
            </div>
        </div>
        <template #footer>
            
        </template>
    </Dialog>

    <Modalinformacao 
        :visivel="informacaoDialog"
        :paginaArea="paginaArea"
        @fechar="ocultarInformacao()"
    />
</template>

<script>
    import ParticipanteBayerService from '../../service/ParticipanteBayerService';
    import IntegracaoService from '../../service/IntegracaoService';
    import Formatacao from '../../utilities/Formatacao';
    import { read, utils } from 'xlsx';
    import Modalinformacao from '../ModalInformacao.vue';

    export default {
        name: 'ParticipanteBayerList',
        components: {
            Modalinformacao
        },
        data() {
            return {
                content: [],
                carregando: false,
                totalRegistro: 0,
                qtdRegistro: 10,
                pagina: 0,
                ordenar: "dataAtualizacao,desc",

                filtro: "",

                item: {},
                formMessage: [],
                formDialogTitulo: 'Cadastrar',
                formDialog: false,
                excluirDialog: false,
                excluirTodosDialog:false,

                cnpjIsValid: false,
                nomeIsInvalid: false,

                visivelModalImportar: false,
                visivelModalValidar:false,
                listarParticipanteBayerComErro: [],
                listarParticipanteBayerValidacao:null,
                
                integration: {},
                message_error: null,
                message_error_visible: false,

                informacaoDialog: false,
                participanteBayerSelection:{},

            }
        },

        mounted() {
            this.carregarDados();
            this.getIntegrationOptons();
        },

        methods: {
            getIntegrationOptons(){
                const paginaAtual = "PARTICIPANTE_BAYER";
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
                            detail:'Você deve cadastrar os parâmetros para esta página no menu lateral em item: Parâmetros de Integração.',
                            life: 10000
                        });
                    });
            },

            carregarDados() {
                this.carregando = true;

                ParticipanteBayerService.getListar(this.pagina, this.qtdRegistro, this.ordenar, this.filtro)
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

            formataCnpj(cnpj) {
                if(cnpj.length == 11)
                    return Formatacao.formataCpf(cnpj);
                else
                    return Formatacao.formataCnpj(cnpj);
            },

            confirmarExclusao(data) {
                this.item = data;
                this.excluirDialog = true;
            },

            excluir() {
                if(!this.item) return;
                let cnpj = this.item.cnpj.replace(/[^0-9]/g, "");
                ParticipanteBayerService.excluirPorCnpj(cnpj)
                    .then(response => {                            
                        this.$toast.add({
                            severity:'success',
                            detail:'Excluído com sucesso!', 
                            life: 3000
                        });

                        this.excluirDialog = false;
                        this.carregarDados();
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'warn',
                            detail:'Não foi possível excluír!',
                            life: 3000
                        });
                    });
            },

            cadastrar() {
                this.formDialogTitulo = "Cadastrar participante bayer";
                this.formDialog = true;
                this.item = {};
            },

            validarCampos() {
                let isInvalid = false;

                if(this.item.cnpj === undefined || this.item.cnpj === "") {
                    this.cnpjIsInvalid = true;
                    isInvalid = true;
                }

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

                ParticipanteBayerService.salvar(this.item)
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
                        this.formMessage.push({severity: 'info', message: response.data.message})
                        this.formMessage.push({severity: 'warn', message: response.data.exception})
                    });
            },

            fecharFormDialog() {
                this.formDialogTitulo = "";
                this.formDialog = false;
                this.item = {};
                this.codigoIsInvalid = false;
                this.descricaoIsInvalid = false;
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
                                _this.carregarParticipanteBayer(e.target.result);
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
                                _this.carregarParticipanteBayer(data);
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

            carregarParticipanteBayer(data) {
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

                const listaParticipanteBayer = [];
                this.listarParticipanteBayerComErro = [];
                let countLInha = 1;
                for(let linha of linhas) {
                    countLInha = countLInha + 1;
                    const participanteBayer = {
                        cnpj: linha["CNPJ"],
                        nome: linha["NOME"]
                    };

                    if(!this.isEmpty(linha["CNPJ"]) && !this.isEmpty(linha["NOME"])) {
                        listaParticipanteBayer.push(participanteBayer); 
                    }
                    else {
                        if(this.isEmpty(linha["CNPJ"]) && this.isEmpty(linha["NOME"])) {
                            participanteBayer["mensagem"] = "O CNPJ e Nome está em branco.";
                        }
                        else if(this.isEmpty(linha["CNPJ"])) {
                            participanteBayer["mensagem"] = "O CNPJ está em branco.";
                        }
                        else if(this.isEmpty(linha["NOME"])) {
                            participanteBayer["mensagem"] = "O Nome está em branco.";
                        }

                        participanteBayer["linha"] = countLInha;
                        this.listarParticipanteBayerComErro.push(participanteBayer); 
                    }
                }
                 
                if(this.listarParticipanteBayerComErro.length > 0) {
                    this.visivelModalImportar = true;
                }
                else {
                    ParticipanteBayerService.salvarVarios(listaParticipanteBayer)
                        .then(({ data }) => {                       
                            this.$toast.add({
                                severity:'success',
                                detail:'Os participantes bayer foram cadastrados...', 
                                life: 3000
                            });
                            this.carregarDados();
                        })
                        .catch(({ response }) => {
                            this.message_error = response.data.message;
                            this.message_error_visible = true;
                        });
                    
                    
                    this.$toast.add({
                        severity:'success',
                        summary: "Upload concluído!",
                        detail:'O arquivo será processado no servidor, essa operação pode demorar de acordo com a quantidade de registros no arquivo!', 
                        life: 5000
                    });
                }

                this.limparUpload();
            },

            fecharModalImportar() {
                this.visivelModalImportar = false;
                this.listarParticipanteBayerComErro = [];
            },

            fecharModalValidar(){
                this.visivelModalValidar = false;
                this.listarParticipanteBayerValidacao = [];
            },

            limparUpload() {
                this.$refs.uploadXls.clear();
                this.$refs.uploadXls.uploadedFileCount = 0;
            },

            isColunasEstaoCorretas(dados) {
                const colunasObrigatorias = [];
                
                if(dados["CNPJ"] == undefined) {
                    colunasObrigatorias.push("CNPJ");
                }

                if(dados["NOME"] == undefined) {
                    colunasObrigatorias.push("Nome");
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
            },

            isEmpty(valor) {
                return valor === undefined || valor === null || valor.length === 0;
            },

            visualizarInformacao(paginaArea)
            {
                //let paginaArea = 'PAGINA_TESTE_AREA_2';
                //console.log(paginaArea);
                this.paginaArea = paginaArea;

                //console.log(this.paginaArea);
                this.informacaoDialog = true;
            },

            ocultarInformacao(){
                this.informacaoDialog = false;
            },
            
            confirmarExclusaoTodos() {
                this.excluirTodosDialog = true;
            },

            excluirTodos() {
                
                ParticipanteBayerService.excluirTodos()
                    .then(response => {                            
                        this.$toast.add({
                            severity:'success',
                            detail:'Todos os registros foram excluídos com sucesso!', 
                            life: 3000
                        });

                        this.excluirTodosDialog = false;
                        this.carregarDados();
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'warn',
                            detail:'Não foi possível excluír!',
                            life: 3000
                        });
                    });
            },

            validarProdutor(){
                this.visivelModalValidar = true;

                ParticipanteBayerService.validarProdutor()
                    .then(({ data }) => {
                        if(data) {
                            this.listarParticipanteBayerValidacao = data.replace(/\n/g, "<br />");
                        }
                    })
                    .catch(error => {
                        this.listarParticipanteBayerComErro = [];
                        this.visivelModalValidar  = false;

                        this.$toast.add({
                            severity:'warn',
                            detail:'Não foi realizar a conferência!',
                            life: 3000
                        });

                    })
            }
        }
    }

</script>