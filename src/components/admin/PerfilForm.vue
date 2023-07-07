<template>
    <div class="card">
        <Toast />

        <h5>{{ perfilId ? 'Editar' : 'Criar' }} Perfil</h5>

        <hr />

        <div class="grid">
            <div class="col-2">
                <label for="id"><strong>Id</strong></label>
                <InputText class="w-full mt-1" id="id" v-model="perfil.id" :disabled="true" />
            </div>

            <div class="col-4">
                <label for="nome"><strong>Nome<span style="color: red;">&nbsp;*</span></strong></label>
                <InputText :class="['w-full', 'mt-1', {'p-invalid': nomeIsInvalid}]" id="nome" v-model="perfil.nome" />
            </div>

            <div class="col-2">
                <label for="dtCadastro"><strong>Cadastro</strong></label>
                <InputText class="w-full mt-1" id="dtCadastro" v-model="perfil.dataCadastro" :disabled="true" />
            </div>

            <div class="col-2">
                <label for="ultAtualizacao"><strong>Atualização</strong></label>
                <InputText class="w-full mt-1" id="ultAtualizacao" v-model="perfil.dataAtualizacao" :disabled="true" />
            </div>

            <div class="col-12">
                <label for="descricao"><strong>Descrição<span style="color: red;">&nbsp;*</span></strong></label>
                <Textarea :class="['w-full', 'mt-1', {'p-invalid': descricaoIsInvalid}]" id="descricao" v-model="perfil.descricao" rows="5"></textarea>
            </div>
        </div>

        <TabView>
            <TabPanel>
                <template #header>
                    <i class="pi pi-bars mr-1"></i>
                    <span>Menus</span>
                </template>
                
                <PickList v-model="menus" dataKey="id" listStyle="height:500px;">
                    <template #sourceheader>
                        Restritos
                    </template>
                    <template #targetheader>
                        Autorizados
                    </template>
					<template #item="{ item }">
                        <i class="pi mr-3" :class="[item.icon]"></i>
                        
                        <span v-if="item.ativo">{{ item.label }}</span> 
                        <span v-if="!item.ativo" style="color:red;">{{ item.label }} - <strong>Inativo</strong></span> 
                    </template>
                </PickList>
            </TabPanel>

            <TabPanel>
                <template #header>
                    <i class="pi pi-users mr-1"></i>
                    <span>Usuários</span>
                </template>
                
                <PickList v-model="usuarios" dataKey="id" listStyle="height:500px;">
                    <template #sourceheader>
                        Restritos
                    </template>
                    <template #targetheader>
                        Autorizados
                    </template>
					<template #item="{ item }">
						<span>{{ item.nome }}</span>
					</template>
                </PickList>
            </TabPanel>
        </TabView>

        <br />

        <div class="flex align-items-center">
            <Button label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info" @click="salvar()" :disabled="doubleClick"/>
            <Button label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger ml-2" @click="confirmarCancelamento()" />
        </div>
    </div>

    

    <Dialog v-model:visible="dialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="cancelarDialog">Tem certeza de que deseja cancelar?</span>
            <span v-if="salvarDialog">Deseja cadastrar outro estabelecimento?</span>
        </div>
        <template #footer>
            <Button v-if="cancelarDialog" label="Não" icon="pi pi-times" class="p-button-text" @click="dialog = false; cancelarDialog = false;" />
            <Button v-if="cancelarDialog" label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="voltar()" />
            
            <Button v-if="salvarDialog" label="Não" icon="pi pi-times" class="p-button-text p-button-danger" @click="voltar()" />
            <Button v-if="salvarDialog" label="Sim" icon="pi pi-check" class="p-button-text" @click="limparCampos()" />
        </template>
    </Dialog>
</template>

<script>
    import PerfilService from '../../service/PerfilService';
    import MenuItemService from '../../service/MenuItemService';
    import UsuarioService from '../../service/UsuarioService';
    import Formatacao from '../../utilities/Formatacao';
    import TratamentoDeError from '../../utilities/TratamentoDeError';

    export default {
        name: 'MenuForm',
        props: {
            perfilId: {
                type: String,
                required: false
            },
        },
        data() {
            return {
                perfil: {},
                menus: [[],[]],
                usuarios: [[],[]],

                dialog: false,
                cancelarDialog: false,
                salvarDialog: false,
                doubleClick: false,

                nomeIsInvalid: false,
                descricaoIsInvalid: false
            }
        },
        created() {
            this.carregarPerfil();
        },
        methods: {
            carregarPerfil() {
                if(!this.perfilId) {
                    this.carregarMenus();
                    this.carregarUsuarios();
                    return;
                }

                PerfilService.getPerfil(this.perfilId)
                    .then(({ data }) => {
                        if(data) {
                            const dataCadastro = data['dataCadastro'];
                            data['dataCadastro'] = Formatacao.formatDateCustom(dataCadastro, 'DD/MM/YYYY HH:mm');

                            const dataAtualizacao = data['dataAtualizacao'];
                            data['dataAtualizacao'] = Formatacao.formatDateCustom(dataAtualizacao, 'DD/MM/YYYY HH:mm');

                            this.perfil = data;

                            this.carregarMenus(data.menuItens);

                            UsuarioService.getUsuariosPorPerfilId(data.id)
                                .then(({ data }) => {
                                    this.carregarUsuarios(data);
                                });
                        }
                        else {
                            this.voltar();
                        }
                    })
                    .catch(error => {
                        this.voltar();
                    });
            },

            carregarMenus(autorizados = []) {
                MenuItemService.getMenuItens()
                    .then(({ data }) => {
                        if(data) {
                            const restritos = data.filter(restrito => {
                                const item = autorizados.find(autorizado => {
                                    return autorizado.id === restrito.id;
                                });
                                return item === undefined;
                            });
    
                            this.menus = [restritos, autorizados];
                        }
                        else {
                            this.menus = [[], []];
                        }
                    })
                    .catch(error => {
                        this.menus = [[], []];
                        console.error(error);
                    });
            },

            carregarUsuarios(autorizados = []) {
                UsuarioService.getUsuarios()
                    .then(({ data }) => {
                        if(data) {
                            const restritos = data.filter(restrito => {
                                const item = autorizados.find(autorizado => {
                                    return autorizado.id === restrito.id;
                                });
                                return item === undefined;
                            });
    
                            this.usuarios = [restritos, autorizados];
                        }
                        else {
                            this.usuarios = [[], []];
                        }
                    })
                    .catch(error => {
                        this.usuarios = [[], []];
                        console.error(error);
                    });
            },

            voltar() {
                this.$router.push(`/perfis`);
            },

            confirmarCancelamento() {
                this.dialog = true,
                this.cancelarDialog = true;
                this.salvarDialog = false;
            },

            validarCampos() {
                let isValid = true;

                if(!this.perfil.nome) {
                    this.nomeIsInvalid = true;
                    isValid = false;
                }

                if(!this.perfil.descricao) {
                    this.descricaoIsInvalid = true;
                    isValid = false;
                }

                if(!isValid) {
                    this.$toast.add({
                        severity:'error', 
                        detail:'Preencher os campos obrigatórios.', 
                        life: 3000
                    });
                }

                return isValid;
            },
            getDados(){
                const perfil = this.perfil;
                perfil["menuItens"] = this.menus[1];
                perfil["usuarios"] = this.usuarios[1];

                return perfil;
            },
            salvar() {
                if(!this.validarCampos() &&!this.doubleClick) return;
                this.doubleClick = true;

                const dados = this.getDados();

                if(this.perfilId) {
                    this.atualizar(dados)
                        .then(response => {
                            this.$toast.add({
                                severity:'success', 
                                detail:'O perfil foi atualizado com sucesso!', 
                                life: 3000
                            });

                            this.voltar();
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            this.$toast.add(TratamentoDeError(error, !!this.perfilId));
                        });
                }
                else {
                    this.cadastrar(dados)
                    .then(response => {
                        this.limparCampos();
                        this.$toast.add({
                            severity:'success',
                            detail:'O perfil foi cadastrado com sucesso!',
                            life: 3000
                        });
                        
                        this.dialog = true,
                        this.cancelarDialog = false;
                        this.salvarDialog = true;
                    })
                    .catch(error => {
                        this.doubleClick = false;
                        this.$toast.add(TratamentoDeError(error, !!this.perfilId));
                    });
                }
            },

            atualizar(dados) {
                return new Promise((resolve, reject) => {
                    PerfilService.putPerfil(dados)
                        .then(response => {

                            resolve(response);
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            reject(error);
                        });
                });
            },

            cadastrar(dados) {
                return new Promise((resolve, reject) => {
                    PerfilService.postPerfil(dados)
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            reject(error);
                        });
                });
            },

            limparCampos() {
                this.perfil = {};
                this.ativo = null;

                this.carregarPerfil();
                
                this.dialog = false;
                this.cancelarDialog = false;
                this.salvarDialog = false;
            }
        }
    }
</script>