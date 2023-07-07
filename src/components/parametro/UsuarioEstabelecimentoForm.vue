<template>
    <div class="card">
        <Toast />
        <div class="flex sm:col-12 md:col-12 lg:col-12 xl:col-8 justify-content-between">
            <div class="flex align-items-center">
                <i class="pi pi-cog mr-1 hidden-sm" style="font-size: 1.4rem"></i>
                <h3 style="margin:0;">Cadastrar Usuário x Estabelecimento</h3>
            </div>
        </div>    
        <Message v-if="message" severity="warn" :closable="true">{{ conteudo }}</Message>  
        <hr class="sm:col-12 md:col-12 lg:col-12 xl:col-8"/>

        <div class="col-12 xl:col-8 border-panel">
            <div class="grid">
                <div class="col-12 xl:col-8">
                    <label for="usuario"><strong>Usuário</strong></label>
                    <AutoComplete
                            class="w-full mt-1"
                            id="usuario"
                            placeholder="Selecionar"
                            v-model="usuario"
                            field="codUsuario"
                            :suggestions="usuarioOptions"
                            :dropdown="true"
                            :class="{'p-invalid': usuarioNull}"
                            @complete="getUsuarios($event)"                            
                            @item-select="selectionarUsuario"/>
                </div>
                <Message v-if="message_user" severity="info" :closable="true">Selecione um usuário para exibir os estabelecimentos vinculados</Message>
            </div>

            <TabView @tab-change="getUsuarioNullMessage()" class="col-12 mt-4">
                <TabPanel v-if="this.usuario">
                    <template #header>
                        <i class="pi pi-sliders-h mr-1" style="font-size: 1.0rem;"></i>
                        <span>Produção Agricola</span>
                    </template>

                    <Fieldset legend="Paramêtros" :toggleable="false">
                        <div class="grid ">
                            <div class="field-checkbox col-12 sm:col-6 lg:col-4 xl:col-3">
                                <Checkbox id="re" v-model="re" :binary="true"/>
                                <label for="re">Re</label>
                            </div>

                            <div class="field-checkbox col-12 sm:col-6 lg:col-4 xl:col-3">
                                <Checkbox id="agendamento" v-model="agendamento" :binary="true"/>
                                <label for="agendamento">Agendamento</label>
                            </div>

                            <div class="field-checkbox col-12 sm:col-6 lg:col-4 xl:col-3">
                                <Checkbox id="fechamento" v-model="fechamento" :binary="true"/>
                                <label for="fechamento">Fechamento</label>
                            </div>

                            <div class="field-checkbox col-12 sm:col-6 lg:col-4 xl:col-3">
                                <Checkbox id="liberar-senha" v-model="liberaSenha" :binary="true"/>
                                <label for="liberar-senha">Liberar Senha</label>
                            </div>

                            <div class="field-checkbox col-12 sm:col-6 lg:col-4 xl:col-3">
                                <Checkbox id="cancela-re" v-model="cancelaRe" :binary="true"/>
                                <label for="cancela-re">Cancela-Re</label>
                            </div>

                            <div class="field-checkbox col-12 sm:col-6 lg:col-4 xl:col-3">
                                <Checkbox id="enceramento-diario" v-model="encerDiario" :binary="true"/>
                                <label for="enceramento-diario">Enceramento Diário</label>
                            </div>                                            

                            <div class="field-checkbox col-12 sm:col-6 lg:col-4 xl:col-3">
                                <Checkbox id="altera-contrato" v-model="alteraContrato" :binary="true"/>
                                <label for="altera-contrato">Altera Contrato</label>
                            </div>

                            <div class="field-checkbox col-12 sm:col-6 lg:col-4 xl:col-3">
                                <Checkbox id="transfere-re" v-model="transfCooperado" :binary="true"/>
                                <label for="transfere-re">Transfere-Re</label>
                            </div>

                            <div class="field-checkbox col-12 sm:col-6 lg:col-4 xl:col-3">
                                <Checkbox id="retirada-produtor" v-model="retirada" :binary="true"/>
                                <label for="retirada-produtor">Retirada Produtor</label>
                            </div>                            

                            <div class="field-checkbox col-12 sm:col-6 lg:col-4 xl:col-3">
                                <Checkbox id="cancela-fechamento" v-model="cancelaFechamento" :binary="true"/>
                                <label for="cancela-fechamento">Cancela Fechamento</label>
                            </div> 
                            
                            <div class="field-checkbox col-12 sm:col-6 lg:col-4 xl:col-3">
                                <Checkbox id="baixa-massa" v-model="baixaMassaContrato" :binary="true"/>
                                <label for="baixa-massa">Baixa Contrato Massa</label>
                            </div>

                            <div class="field-checkbox col-12 sm:col-6 lg:col-4 xl:col-3">
                                <Checkbox id="transferencia-re-cooperativa" v-model="transferencia" :binary="true"/>
                                <label for="transferencia-re-cooeprativa">Transferência Re Cooperativa</label>
                            </div>

                            <div class="field-checkbox col-12 sm:col-6 lg:col-4 xl:col-3">
                                <Checkbox id="alterar-padronizado" v-model="alteraPadrao" :binary="true"/>
                                <label for="alterar-padronizado">Alterar Padronizado</label>
                            </div>
                        </div>
                    </Fieldset>  
                    
                    <Fieldset legend="Descrição" :toggleable="false">
                        <Textarea class="col-12" v-model="observacao" rows="5"></textarea>
                    </Fieldset>
                </TabPanel>

                <TabPanel v-if="this.usuario">
                    <template #header>
                        <i class="pi pi-building mr-1" style="font-size: 1.0rem;"></i>
                        <span :class="{'warn': estabelecimentoNull}">Estabelecimentos</span>
                    </template>                   
                    
                    <PickList v-model="estabelecimentos" dataKey="id" listStyle="height:500px;">
                        <template #sourceheader>
                            Disponíveis
                        </template>
                        <template #targetheader>
                            Vinculados
                        </template>
                        <template #item="{ item }">
                            <span>{{ item.codNome }}</span>
                        </template>
                    </PickList>
                </TabPanel>
            </TabView>
        </div>

        <hr />
        <div class="flex mt-4">
            <Button
                icon="pi pi-save"
                label="Salvar"
                class="p-button-info mr-1"
                :disable="doubleClick"
                @click="salvar"/>

            <Button
                icon="pi pi-times"
                label="Cancelar"
                class="p-button-danger"
                @click="voltar()"/>
        </div>
    </div>

    <Loading :visible="loading"/>
</template>

<script>
    import Loading from '../../components/Loading.vue';
    import UsuarioService from '../../service/UsuarioService';
    import ParametrosEstabelecimento from '../../service/UsuarioEstabelecimentoService';
    import UsuarioEstabelecimentoService from '../../service/UsuarioEstabelecimentoService';
    export default {
        components: { Loading},
        data() {
            return {
                loading: false,
                parametros: {},
                usuarioSelecionado:null,
                usuarioOptions: null,
                estabelecimentos: [[],[]],
                message_user: false,
                usuario: null,
                re: false,
                agendamento: false,
                fechamento: false,
                liberaSenha: false,
                cancelaRe: false,
                encerDiario: false,
                alteraContrato: false,
                transfCooperado: false, 
                retirada: false,
                cancelaFechamento: false,
                baixaMassaContrato: false,
                transferencia: false, 
                alteraPadrao: false,
                observacao: null,
                DialogAlert: false,
                message: false,
                conteudo: null,
                doubleClick: false,
                usuarioNull: false,
                estabelecimentoNull: false,
            }
        },

        methods: {
            salvar(){   
                this.loading = true;
                if(!this.validarDados() && !this.doubleClick) return;
                this.doubleClick = true;
                const dados = this.getDados();
                console.log(JSON.stringify(dados));
                ParametrosEstabelecimento.cadastrar(dados)
                    .then(({ data }) => {  
                        this.$toast.add({
                            severity:'info', 
                            summary: 'Parâmetros de Usuario vs Estabelecimento', 
                            detail:'Parâmetros cadastrados com sucesso!',
                            life: 2000
                        });
                        this.loading = false;
                        this.visualizar();
                    })
                    .catch(error => {
                        this.loading = false;
                        this.message = true;
                        this.doubleClick = false;
                        this.conteudo = error.response.data.message;
                        this.voltar();
                    });
            },

            getDados(){
                this.parametros = {};    
                this.parametros['re'] = this.re;    
                this.parametros['agendamento'] = this.agendamento;
                this.parametros['fechamento'] = this.fechamento;
                this.parametros['liberaSenha'] = this.liberaSenha;
                this.parametros['cancelaRe'] = this.cancelaRe;
                this.parametros['encerDiario'] = this.encerDiario;
                this.parametros['alteraContrato'] = this.alteraContrato; 
                this.parametros['transfCooperado'] = this.transfCooperado; 
                this.parametros['retirada'] = this.retirada; 
                this.parametros['cancelaFechamento'] = this.cancelaFechamento;
                this.parametros['baixaMassaContrato'] = this.baixaMassaContrato;
                this.parametros['transferencia'] = this.transferencia; 
                this.parametros['alteraPadrao'] = this.alteraPadrao;
                this.parametros['observacao'] = this.observacao;
                this.parametros['usuario'] = this.usuario;                 
                this.parametros['estabelecimentos'] = this.estabelecimentos[1];
                return this.parametros;
            },

            getUsuarios(event) {
                const dados = !event.query.trim().length ? 'p' : event.query;
                UsuarioService.getCodUsuario(dados)
                    .then(({ data }) => {                      
                        this.usuarioOptions = data;
                    })
                    .catch(error => {
                        console.error(error);
                        this.voltar();
                    });
            },

            selectionarUsuario() {               
                if(!this.usuario) return;
                this.getEstabelecimentos(this.usuario.id);
            },

            getEstabelecimentos(id) {
                UsuarioEstabelecimentoService.getEstabelecimentoDisponiveisPorIdUsuario(id)
                    .then(({ data }) => {
                       console.log(data)
                        if(data) {
                            this.estabelecimentos = [data, []];
                        }
                        else {
                            this.estabelecimentos = [[], []];
                        }
                    })
                    .catch(error => {                       
                        this.estabelecimentos = [[], []];
                    });
            },

            voltar() {
                this.$router.push(`/parametro/estabelecimentos`);
            },

            visualizar(){
                this.$router.push(`/parametro/estabelecimentos/${ this.usuario.username }`);
            },

            validarDados(){
                let isValido = true;
                if(this.usuario == null) {
                    this.loading = false;
                    this.conteudo = "Selecione um usúario!";
                    this.message = true;
                    this.usuarioNull= true;
                    return isValido = false;
                }

                if(this.estabelecimentos[1].length == 0){
                    this.loading = false;
                    this.conteudo = "Selecione ao menos um estabelecimento!";
                    this.message = true;
                    this.estabelecimentoNull = true;
                    return isValido = false;
                } 

                return true;
            }
        },
        updated(){
            if(this.usuario){
                this.conteudo = null;
                this.message = false;
                this.usuarioNull= false;
            }
            
        }
    }
</script>