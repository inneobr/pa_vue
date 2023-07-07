<template>
    <div class="card h-full"> 
        <div class="flex align-items-center">
            <i class="pi pi-building mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Usuário x Estabelecimento</h3>
        </div>
        <Toast /><hr />
        <div class="col-12 xl:col-12">
            <DataTable :value="database" 
            
                editMode="row" 
                dataKey="id" 
                selectionMode="single"
                @row-select="getObservacao"
                v-model:selection="detalhes"
                :scrollable="true"
                v-model:editingRows="index" 
                @row-edit-save="onRowEditSave" 
                responsiveLayout="scroll"                
                @sort="sort($event)">

                <template #empty>
                    Nenhum registro encontrado.
                </template>

                <template #header>
                    <div class="grid justify-content-between"> 
                        <div class="grid col-12 lg:col-10">
                            <div class="col-12 lg:col-3">
                                <label for="usuario"><strong>Usuário</strong></label>
                                <AutoComplete 
                                    field="codUsuario"
                                    id="usuario"
                                    :minLength="2" 
                                    :dropdown="true"
                                    v-model="usuario"
                                    class="w-full mt-2"
                                    @item-select="filtrar()"
                                    placeholder="Selecionar"                                    
                                    :suggestions="options.usuarios"
                                    :disable="integration.disable"
                                    @complete="getUsuarios($event)"
                                    @keyup.enter="getUsuarios($event)"/>
                            </div>
                            <div class="col-12 lg:col-9">
                                <Button v-if="integration.visible" type="button" 
                                    label="Cadastrar" 
                                    icon="pi pi-plus" 
                                    @click="cadastrar()" 
                                    class="p-button-info m-2 mt-4"
                                    style="padding-left: 1.0rem; padding-right: 1.0rem"/>
                            
                                <Button v-if="integration.visible" type="button" 
                                    label="Deletar Todos" 
                                    icon="pi pi-trash" 
                                    class="p-button-danger m-2 mt-4" 
                                    @click="confirmaDeletar()"
                                    style="padding-left: 1.8rem; padding-right: 1.8rem"/> 

                                <Button
                                    type="button" 
                                    label="Limpar Filtros" 
                                    class="p-button-outlined m-2 mt-4"
                                    icon="pi pi-filter-slash" 
                                    style="padding: 0.4rem;"
                                    @click="limparFiltros()"/>                              
                            </div>
                        </div>
                    </div>
                </template> 

                <Column field="estabelecimento.codigo" header="Estab." style="width: 8rem; padding-top: 7px; padding-bottom: 7px; z-index: 1;" sortable frozen>
                    <template #body="{ data }">
                        {{data.estabelecimento.codigo}}
                    </template>
                </Column>

                <Column field="fechamento" header="Fechamento">
                    <template #body="{ data }">
                        {{data.fechamento ? "Sim" : "Não"}}
                    </template>

                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="fechamentoOptions" optionLabel="nome" optionValue="value" placeholder="Selecione"/>
                    </template>
                </Column>

                <Column field="agendamento" header="Agendamento">
                    <template #body="{ data }">
                        {{data.agendamento ? "Sim" : "Não"}}
                    </template>

                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="agendamentoOptions" optionLabel="nome" optionValue="value" placeholder="Selecione"/>
                    </template>
                </Column>

                <Column field="alteraContrato" header="Altera Contrato">
                    <template #body="{ data }">
                        {{data.alteraContrato ? "Sim" : "Não"}}
                    </template>

                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="alteraContratoOptions" optionLabel="nome" optionValue="value" placeholder="Selecione"/>
                    </template>
                </Column>

                <Column field="alteraPadrao" header="Altera Padronizado">
                    <template #body="{ data }">
                        {{data.alteraPadrao ? "Sim" : "Não"}}
                    </template>

                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="alteraPadraoOptions" optionLabel="nome" optionValue="value" placeholder="Selecione"/>
                    </template>
                </Column>

                <Column field="cancelaFechamento" header="Cancela Fechamento">
                    <template #body="{ data }">
                        {{data.cancelaFechamento ? "Sim" : "Não"}}
                    </template>

                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="cancelaFechamentoOptions" optionLabel="nome" optionValue="value" placeholder="Selecione"/>
                    </template>
                </Column>

                <Column field="re" header="Re">
                    <template #body="{ data }">
                        {{data.re ? "Sim" : "Não"}}
                    </template>

                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="reOptions" optionLabel="nome" optionValue="value" placeholder="Selecione"/>
                    </template>
                </Column>

                <Column field="cancelaRe" header="Cancela Re">
                    <template #body="{ data }">
                        {{data.cancelaRe ? "Sim" : "Não"}}
                    </template>

                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="cancelaReOptions" optionLabel="nome" optionValue="value" placeholder="Selecione"/>
                    </template>
                </Column>

                <Column field="liberaSenha" header="Libera Senha">
                    <template #body="{ data }">
                        {{data.liberaSenha ? "Sim" : "Não"}}
                    </template>

                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="liberaSenhaOptions" optionLabel="nome" optionValue="value" placeholder="Selecione"/>
                    </template>
                </Column>

                <Column field="transferencia" header="Transferência" >
                    <template #body="{ data }">
                        {{data.transferencia ? "Sim" : "Não"}}
                    </template>

                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="transferenciaOptions" optionLabel="nome" optionValue="value" placeholder="Selecione"/>
                    </template>
                </Column>

                <Column field="transfCooperado" header="Transferência Cooperado">
                    <template #body="{ data }">
                        {{data.transfCooperado ? "Sim" : "Não"}}
                    </template>

                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="transfCooperadoOptions" optionLabel="nome" optionValue="value" placeholder="Selecione"/>
                    </template>
                </Column>

                <Column field="retirada" header="Retirada">
                    <template #body="{ data }">
                        {{data.retirada ? "Sim" : "Não"}}
                    </template>

                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="retiradaOptions" optionLabel="nome" optionValue="value" placeholder="Selecione"/>
                    </template>
                </Column>

                <Column field="encerDiario" header="Encerramento Diário">
                    <template #body="{ data }">
                        {{data.encerDiario ? "Sim" : "Não"}}
                    </template>

                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="encerDiarioOptions" optionLabel="nome" optionValue="value" placeholder="Selecione"/>
                    </template>
                </Column>

                <Column field="baixaMassaContrato" header="Baixa Contrato em Massa" style="width: 50rem;">
                    <template #body="{ data }">
                        {{data.baixaMassaContrato ? "Sim" : "Não"}}
                    </template>

                    <template #editor="{ data, field }">
                        <Dropdown v-model="data[field]" :options="baixaMassaContratoOptions"  style="float: none;" optionLabel="nome" optionValue="value" placeholder="Selecione"/>
                    </template>
                </Column>

                <Column field="dataIntegracao" header="Data Integração" style="width: 50rem;">
                    <template #body="{ data }">
                        {{ formatDate(data.dataCadastro, 'DD/MM/YYYY HH:mm:SS') }} 
                    </template>
                </Column>

                <Column v-if="integration.visible" header="Ações" alignFrozen="right" frozen>
                    <template #body="{ data }">
                        <Button title="Excluir" icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2 mb-2" @click="deletarParametro(data.id)" /> 
                        <Button title="Copiar" icon="pi pi-copy" class="p-button-rounded mr-2 mb-2" @click="copiaOptions(data)" /> 
                    </template>                                  
                </Column>
                <Column v-if="integration.visible" rowEditor="true" alignFrozen="right" frozen/>
                
            </DataTable> 
            
            <Paginator
                :rows="qtdRegistro"
                :totalRecords="totalRegistro"
                :rowsPerPageOptions="[1, 5, 10, 20, 30]"
                @page="onPage"/>
        </div>
        
        <Fieldset v-if="database.length != 0 && observacao" legend="Descrição" :toggleable="false">
                <Textarea class="col-12" v-model="observacao" rows="5"></textarea>
        </Fieldset>
    </div>

    <Dialog v-model:visible="dialogCopiar" :style="{width: '600px'}" :modal="true">
            <template #header>
                <div class="flex">
                    <i class="pi pi-cog m-1" style="font-size: 1.8rem"></i>
                    <h3 style="margin:0px 5px;">Copiar Usuário x Estabelecimento</h3>
                </div>
            </template>

            <div class="col-12">
                <div class="col-12">
                    <label for="usuario"><strong>Usúario Destino</strong></label>
                    <AutoComplete  class="w-full mt-2"
                        id="usuario"
                        :dropdown="true"
                        field="codUsuario"
                        placeholder="Selecionar"
                        v-model="usuarioDestino"
                        :suggestions="options.usuariosDestino"
                        @complete="getUsuariosDestino($event)"
                        :forceSelection="true"
                        @item-select="getUsuarioDestinoValidate()"/>
                </div>

                <div class="col-12 grid m-1 border-panel">
                    <div class="align-items-center">
                        <RadioButton  name="parametro" value=true v-model="selecionarTodos"/>
                        <label class="ml-2" for="parametro">Copiar todos os estabelecimento do usuário </label>
                    </div>

                    <div class="align-items-center mt-1">
                        <RadioButton name="parametro" value=false v-model="selecionarTodos"/>
                        <label class="ml-2" for="parametro">Somente o estabelecimento selecionado</label>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" class="p-button-text" @click="dialogCopiar= false" />
                <Button :disabled="bloquearCopia" label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="copiarParametros()"/>
            </template>
        </Dialog>  

    <Dialog v-model:visible="confirmaDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Deseja realmente apagar todos os parâmetros do usuário: <strong> {{ usuario.codUsuario}}?</strong></span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="confirmaDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="deletarTodosParametros()" />
        </template>
    </Dialog>

       <Loading :visible="loading"/>
</template>

<script>
    import UsuarioEstabelecimento from '../../service/UsuarioEstabelecimentoService';
    import IntegracaoService from '../../service/IntegracaoService';
    import TratamentoDeError from '../../utilities/TratamentoDeError';
    import HistoricoGenerico from '../consulta/HistoricoGenerico.vue';
    import UsuarioService from '../../service/UsuarioService';
    import Formatacao from '../../utilities/Formatacao';
    import Loading from '../../components/Loading.vue'

    export default {
        components: { HistoricoGenerico, Loading},
        data() {
            return { 
                pagina: 0,
                qtdRegistro: 10,
                totalRegistro: 0,
                integration: {},                 

                filtros: {},
                options: {}, 
                database: [],
                parametro: {},
                codUsuario: null,
                usuario: null,
                estabelecimento: null,
                situacao: "ATIVO",
                observacao: null,
                index: [],

                dialogCopiar: false,
                bloquearCopia: true,
                selecionarTodos: false,

                loading: false,
                detalhes: {},
                confirmaDialog: false,
                ordenar: 'estabelecimento.codigo,asc',

                //Cell Options
                reOptions: [
                    {nome: 'Sim', value: true},
                    {nome: 'Não', value: false}
                ],

                agendamentoOptions: [
                    {nome: 'Sim', value: true},
                    {nome: 'Não', value: false}
                ],

                fechamentoOptions: [
                    {nome: 'Sim', value: true},
                    {nome: 'Não', value: false}
                ],

                liberaSenhaOptions: [
                    {nome: 'Sim', value: true},
                    {nome: 'Não', value: false}
                ],

                cancelaReOptions: [
                    {nome: 'Sim', value: true},
                    {nome: 'Não', value: false}
                ],

                encerDiarioOptions: [
                    {nome: 'Sim', value: true},
                    {nome: 'Não', value: false}
                ],

                alteraContratoOptions: [
                    {nome: 'Sim', value: true},
                    {nome: 'Não', value: false}
                ],
                
                transfCooperadoOptions: [
                    {nome: 'Sim', value: true},
                    {nome: 'Não', value: false}
                ],

                retiradaOptions: [
                    {nome: 'Sim', value: true},
                    {nome: 'Não', value: false}
                ],

                cancelaFechamentoOptions: [
                    {nome: 'Sim', value: true},
                    {nome: 'Não', value: false}
                ],

                baixaMassaContratoOptions: [
                    {nome: 'Sim', value: true},
                    {nome: 'Não', value: false}
                ],

                transferenciaOptions: [
                    {nome: 'Sim', value: true},
                    {nome: 'Não', value: false}
                ],

                alteraPadraoOptions: [
                    {nome: 'Sim', value: true},
                    {nome: 'Não', value: false}
                ],
            }
        },

        methods: {
            getIntegrationOptons(){
                const paginaAtual = "PARAMETRO_USUARIO_ESTABELECIMENTO";
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

            getParametrosFilter(){              
                UsuarioEstabelecimento.getParametrosFilter(this.pagina, this.qtdRegistro, this.ordenar, this.filtros)
                    .then(({ data }) => {        
                        this.database = [];              
                        this.database = data.content;
                        this.qtdRegistro = data.pageable.pageSize;
                        this.totalRegistro = data.totalPages * this.qtdRegistro;                         
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'error',
                            detail: this.usuario.nome + ' não possui parâmetros de Usuário x Estabelecimento  cadastrados.',
                            life: 2000
                        });                        
                        this.database = [];
                    });                
            },

            confirmaDeletar(){
                if(this.database.length <= 0) return;
                this.confirmaDialog = 'true';
            },

            getUsuarios(event) {
                const dados = !event.query.trim().length ? 'a' : event.query;
                UsuarioService.getCodUsuario(dados)
                    .then(({ data }) => {    
                        this.options.usuarios = [...data];                   
                    })
                    .catch(error => {
                        this.options.usuarios = null;   
                        this.$toast.add(TratamentoDeError(error));
                        console.error(error);
                        this.voltar();
                    });
            },

            getUsuariosDestino(event) {
                const dados = !event.query.trim().length ? 'a' : event.query;
                UsuarioService.getCodUsuario(dados)
                    .then(({ data }) => {      
                        this.options.usuariosDestino  = [...data];                  
                    })
                    .catch(error => {
                        this.$toast.add(TratamentoDeError(error));
                        console.error(error);
                        this.options.usuariosDestino = null;
                    });
            },

            getUsuarioDestinoValidate(){
                if(this.usuarioDestino != undefined){  
                    if(this.usuarioDestino.id === this.usuario.id){
                        this.bloquearCopia = true;  
                    } else {this.bloquearCopia = false; }
                }
            },

            filtrar(){
                if(this.usuario != undefined){
                    this.filtros.usuario = this.usuario.codUsuario;
                }

                if(this.estabelecimento != null){
                    this.filtros.estabelecimento = this.estabelecimento;
                }

                if(this.situacao != null){
                    this.filtros.situacao = this.situacao;
                }
                this.getParametrosFilter();                
            },

            onCellEditComplete(event) {               
            },

            onRowEditSave(event) {
                let { newData, index } = event;
                this.database[index] = newData;
                this.database[index]['observacao'] =  this.observacao;
                UsuarioEstabelecimento.updateParametros(this.database[index])
                    .then(({ data }) => {
                        this.$toast.add({
                                severity:'success',
                                detail:'Parametro atualizado com sucesso!', 
                                life: 3000
                        });
                        this.observacao = null;
                    })
                    
            },

            copiaOptions(data){
                this.parametro = data;    
                this.dialogCopiar='true';            
            },

            copiarParametros(){       
                if(this.selecionarTodos == "false"){   
                                  
                    this.dialogCopiar = false;
                    this.loading = true;
                    this.parametro.usuario = this.usuarioDestino;
                    this.parametro.estabelecimentos = [this.parametro.estabelecimento];                     
                    UsuarioEstabelecimento.cadastrar(this.parametro)    
                        .then(({ data }) => {  
                            this.$toast.add({
                                severity:'success', 
                                detail:'Parâmetros copiados com sucesso!', 
                                life: 3000
                            });
                            this.usuario = this.usuarioDestino;
                            this.usuarioDestino = null;
                            this.loading = false;
                            this.bloquearCopia = true;
                            this.filtrar();
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'error', 
                                summary: 'CÓPIA DE PARÂMETROS INVÁLIDA', 
                                detail: 'Tivemos um problema ao copiar os parâmetros para o estabelecimento: ' + this.parametro.estabelecimento.codNome,
                                life: 15000
                            })
                            this.usuario = this.usuarioDestino;
                            this.usuarioDestino = null;
                            this.loading = false;
                            this.bloquearCopia = true;
                            this.filtrar();
                        });
                }else if(this.selecionarTodos == "true"){                     
                    this.dialogCopiar = false;
                    this.loading = true;
                    UsuarioEstabelecimento.copiarParametros(this.usuario.id, this.usuarioDestino.id) 
                        .then(({ data }) => {  
                            this.$toast.add({
                                severity:'success', 
                                detail:'Parâmetros copiados com sucesso!', 
                                life: 3000
                            });
                            this.usuario = this.usuarioDestino;
                            this.usuarioDestino = null;
                            this.loading = false;
                            this.bloquearCopia = true;
                            this.filtrar();
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'error', 
                                summary: 'Falha ao copiar parâmetros.', 
                                detail: 'Tivemos um problema ao copiar os parâmetros, tente novamente!',
                                life: 15000
                            })
                            this.usuario = this.usuarioDestino;
                            this.usuarioDestino = null;
                            this.loading = false;
                            this.bloquearCopia = true;
                            this.filtrar();
                        });
                                       
                }
            },

            deletarParametro(id){ 
                if(id == undefined) return;
                this.loading = true;
                UsuarioEstabelecimento.deletarParametro(id)
                    .then(({ data }) => {
                        this.$toast.add({
                            severity:'success',
                            detail:'Parâmetro deletado com sucesso!', 
                            life: 3000
                        });
                        this.loading = false;
                        this.filtrar();
                    }) 
                    .catch(error => {
                        this.filtrar();
                        this.$toast.add({
                            severity:'error',
                            detail:'Ocorreu um erro e não foi possivel deletar o parâmetro: ' + dados.estabelecimento.codigo,
                            life: 3000
                        });  
                        this.loading = false;
                    });                          
                       
            },

            deletarTodosParametros(){                
                this.loading = true;
                this.confirmaDialog = false;
                UsuarioEstabelecimento.deletarTodosParametroUsuario(this.usuario.username)
                    .then(({ data }) => {
                        this.$toast.add({
                            severity:'success',
                            detail:'Parâmetro deletados com sucesso!', 
                            life: 5000
                        });
                        this.loading = false;
                        this.filtrar();
                    }) 
                    .catch(error => {                        
                        this.$toast.add({
                            severity:'error',
                            detail:'Ocorreu um erro e não foi possivel deletar os parâmetro do usuário: ' + this.usuario.username,
                            life: 5000
                        });
                        this.loading = false;
                        this.filtrar();
                    });     
                
            },

            limparFiltros(){               
                this.filter = {};
                this.database = [];
                this.usuario = null;
                this.estabelecimento = null;
                this.filtros.estabelecimento = null;
                this.filtros.usuario = null;
                this.filtros.situacao = "ATIVO";
                this.getParametrosFilter();
            },

            getObservacao(){
                this.observacao = this.detalhes.observacao;
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            cadastrar() {
                this.$router.push(`/parametro/estabelecimentos/cadastrar`);
            },  
            
            getEdition(){
                this.habitarEdicao = true;
            },

            onPage(event) {
                this.observacao = null;
                this.pagina = event.page + 1;
                this.qtdRegistro = event.rows;
                this.filtrar();
            },

            sort(event) {
                this.observacao = null;
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.filtrar();   
            },

            getUsuarioById(){
                if(this.$route.params.username != null && this.$route.params.username != undefined){ 
                    UsuarioService.getUsuarioPorUsername(this.$route.params.username)
                        .then(({ data }) => { 
                            this.usuario =  data;
                            this.filtros.usuario = this.usuario.codUsuario;
                            this.getParametrosFilter();
                        });               
                }  
            }
        },
        
        created() { 
            this.getUsuarioById();                    
            this.getIntegrationOptons();
        }, 
    }
</script>