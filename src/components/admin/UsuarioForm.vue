<template>
    <div class="card">
        <Toast />

        <div class="flex align-items-center">
            <i class="pi pi-users mr-2" style="font-size: 2rem;"></i>
            <h5 style="margin:0;">{{ login ? 'Editar' : 'Cadastrar' }} usuário</h5>
        </div>

        <hr />

        <div class="grid col-10">
            <div class="col-4 lg:col-1">
                <label for="id"><strong>Id</strong></label>
                <InputText class="w-full mt-1" id="id" v-model="usuario.id" :disabled="true" />
            </div>

            <div class="col-8 lg:col-4">
                <label for="username"><strong>Login<span class="ml-1" style="color:red">*</span></strong></label>
                <InputText
                    id="username"
                    v-model="usuario.username"
                    @change="getUsernameValido()"
                    class="w-full mt-1"
                    :disabled="!isCadastro()"
                    :class="{'p-invalid': invalid.username}"
                />
            </div>

            <div class="col-12 lg:col-7">
                <label for="email"><strong>E-Mail</strong></label>
                <InputText class="w-full mt-1" id="email" v-model="usuario.email" :class="{'p-invalid': invalid.email}" @change="getValidation()"/>
            </div>

            <div class="col-12 lg:col-2">
                <label for="cpf"><strong>CPF</strong></label>
                <InputMask class="w-full mt-1" id="cpf" :class="{'p-invalid': invalid.cpf}" v-model="usuario.cpf" mask="999.999.999-99" @blur="getCPFValido()"/>
            </div>

            <div class="col-12 sm:col-12 lg:col-6">
                <label for="nome"><strong>Nome<span class="ml-1" style="color:red">*</span></strong></label>
                <InputText
                    id="nome"
                    v-model="usuario.nome"
                    class="w-full mt-1"
                    :class="{'p-invalid': nomeIsInvalid}"
                />
            </div>

            <div class="col-12 lg:col-4">
                <label for="matricula"><strong>Matrícula</strong></label>
                <InputText class="w-full mt-1" id="matricula" v-model="usuario.matricula" />
            </div>

            <div class="col-12 lg:col-6">
                <label for="estabelecimento"><strong>Estabelecimento<span class="ml-1" style="color:red">*</span></strong></label>
                <AutoComplete
                    class="w-full mt-1" 
                    :class="{'p-invalid': estabelecimentoIsInvalid}"
                    id="estabelecimento"
                    field="codNome"
                    v-model="estabelecimentoSelecionado"
                    :suggestions="estabelecimentoOptions"
                    :forceSelection="true"
                    @complete="getEstabelecimentos($event)"
                    @item-select="selecionarEstabelecimento"
                    @change="validarEstabelecimento"
                    dropdown
                    :virtualScrollerOptions="{ itemSize: 15 }"
                />
            </div>

            <div class="col-12 lg:col-6">
                <label for="regional"><strong>Regional</strong></label>
                <InputText class="w-full mt-1" id="regional" v-model="regional.label" :disabled="true" />
            </div>
        </div>
        
        <h5>Perfil de acesso</h5>

        <div class="grid col-10">
            <div class="col-12 sm:col-5 lg:col-5">
                <label for="dataAtualizacao"><strong>Restritos</strong></label>
                <Listbox 
                    listStyle="height:250px"
                    style="border:1px solid #CCC;"
                    class="mt-1"
                    v-model="restritoSelecionado"
                    optionLabel="nome"
                    :options="perfisRestritos"
                    :filter="true"
                >
                    <template #empty>
                        Nenhum perfil restrito.
                    </template>
                </Listbox>
            </div>
            <div class="col-12 sm:col-2 lg:col-2 flex justify-content-center  align-items-center">
                <div class="flex inline-flex sm:flex-column">
                    <Button icon="pi pi-angle-double-right" @click="moverTodosParaAutorizado" />
                    <Button icon="pi pi-angle-right" class="mt-2" @click="moverParaAutorizado" />
                    <Button icon="pi pi-angle-left" class="mt-2" @click="moverParaRestrito" />
                    <Button icon="pi pi-angle-double-left" class="mt-2" @click="moverTodosParaRestrito" />
                </div>
            </div>
            <div class="col-12 sm:col-5 lg:col-5">
                <label for="dataAtualizacao"><strong>Autorizados</strong></label>
                <Listbox 
                    listStyle="height:250px"
                    style="border:1px solid #CCC;"
                    class="mt-1"
                    v-model="autorizadoSelecionado"
                    optionLabel="nome"
                    :options="perfisAutorizados"
                    :filter="true"
                >
                    <template #empty>
                        Nenhum perfil autorizado.
                    </template>
                </Listbox>
            </div>
        </div>

        <hr />

        <div class="flex align-items-center">
            <Button label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info" @click="salvar()" :disabled="doubleClick"/>
            <Button label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger ml-2" @click="voltar()" />
        </div>
    </div>
</template>

<script>
    import Formatacao from '../../utilities/Formatacao';
    import PerfilService from '../../service/PerfilService';
    import UsuarioService from '../../service/UsuarioService';
    import PerfisUsuariosService from '../../service/PerfisUsuariosService';
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import StorageService from '../../service/StorageService';
    import TratamentoDeError from '../../utilities/TratamentoDeError';
    import ValidarDocumentoService from '../../service/ValidarDocumentoService'

    export default {
        name: 'UsuarioForm',
        props: {
            login: {
                type: String,
                required: false
            },
        },
        data() {
            return {
                codEstablecimento: null,

                usuario: {},
                regional: {},
                estabelecimentos: [],
                estabelecimentoSelecionado: null,
                estabelecimentoOptions: [],
                invalid: {},

                restritoSelecionado: null,
                autorizadoSelecionado: null,
                
                perfisAutorizados: [],
                perfisRestritos: [],

                nomeIsInvalid: false,
                usernameIsInvalid: false,
                estabelecimentoIsInvalid: false,
                UserNameUtilizado:false,
                doubleClick: false,
            }
        },
        created() {
            const estabelecimento =  StorageService.getEstabelecimento();
            if(!!estabelecimento) {
                this.codEstablecimento = estabelecimento.codigo;
            }

            this.carregarDados();
            this.carregarEstabelecimento();
        },
        methods: {   
            getCPFValido(){
                if(this.usuario.cpf == ""){return this.invalid.cpf = false;}
                let documento = { cpf: this.usuario.cpf }
                this.invalid.cpf = false;

                ValidarDocumentoService.getDocumentoValido(documento)
                    .then(({ data }) => {
                        if(data.bloqueado){
                            if(this.usuario.nome != data.nomeCadastro){
                                this.$toast.add({
                                    severity:'error', 
                                    summary: 'CPF JÁ CADASTRADO', 
                                    detail: data.message,
                                    life: 15000
                                });
                            }
                        }
                    }) 
                    .catch(error => {                       
                        this.$toast.add({
                            severity:'error', 
                            summary: 'CPF INVÁLIDO', 
                            detail: 'Verifique os números do CPF digitado, caso não possua deixe o campo em branco antes de prosseguir.',
                            life: 15000
                        })
                        this.invalid.cpf = true;
                    });
            },

            getUsernameValido(){
                let documento = {
                    username: this.usuario.username
                }
                ValidarDocumentoService.getDocumentoValido(documento)
                    .then(({ data }) => {
                        if(data.bloqueado){
                            if(this.usuario.nome != data.nomeCadastro){
                                this.invalid.username = true;
                                this.$toast.add({
                                    severity:'error', 
                                    summary: 'LOGIN INVÁLIDO OU JÁ CADASTRADO', 
                                    detail: data.message,
                                    life: 15000
                                });
                            }
                        }
                        else{
                            this.invalid.username = false;
                        }
                    })
                    .catch(error => {
                        this.invalid.username = true;
                        this.$toast.add({
                            severity:'error', 
                            summary: 'LOGIN INVÁLIDO', 
                            detail: 'Verifique o login cadastrado.',
                            life: 15000
                        })
                    });
            },

            isCadastro() {
                return this.login === undefined || this.login === null || this.login === '';
            },
            
            carregarDados() {
                if(!this.login) {
                    this.carregarRestritos();
                    return;
                }

                UsuarioService.getUsuarioPorUsername(this.login)
                    .then(({ data }) => {
                        if(data) {
                            const dataCadastro = data['dataCadastro'];
                            data['dataCadastro'] = Formatacao.formatDateCustom(dataCadastro, 'DD/MM/YYYY HH:mm');

                            const dataAtualizacao = data['dataAtualizacao'];
                            data['dataAtualizacao'] = Formatacao.formatDateCustom(dataAtualizacao, 'DD/MM/YYYY HH:mm');

                            this.usuario = data;
                            this.usuario.email = data.email;
                            this.perfisAutorizados = data.listPerfil;
                            
                            EstabelecimentoService.getEstabelecimentosPorCodigo(data.estabelecimento)
                                .then(({ data }) => {
                                    data['label'] = `${ data.codigo } - ${ data.nomeFantasia }`;
                                    this.estabelecimentoSelecionado = data;
                                });

                            EstabelecimentoService.getEstabelecimentosPorCodigo(data.regional)
                                .then(({ data }) => {
                                    data['label'] = `${ data.codigo } - ${ data.nomeFantasia }`;
                                    this.regional = data;
                                });
                                
                            this.carregarRestritos();
                        }
                        else {
                            this.voltar();
                        }
                    })
                    .catch(error => {
                        this.voltar();
                    });
            },

            carregarRestritos() {
                PerfilService.getPerfis()
                    .then(({ data }) => {
                        this.perfisRestritos = data.filter(restrito => {
                            const item = this.perfisAutorizados.find(autorizado => {
                                return autorizado.id === restrito.id;
                            });
                            return item === undefined;
                        });
                    })
                    .catch(error => {
                        console.error("Falha ao carregar lista de perfis");
                    });
            },

            carregarEstabelecimento() {
                EstabelecimentoService.getEstabelecimentosPorEstabelecimentoDoUsuario(this.codEstablecimento)
                    .then(({ data }) => {
                        this.estabelecimentos = data.map(item => {
                            item["label"] = `${ item.codigo } - ${ item.nomeFantasia}`;
                            return item;
                        });
                    })
                    .catch(error => {
                        console.error('Falha ao carregar os estabelecimentos.');
                    });
            },

            voltar() {
                this.$router.push(`/usuarios`);
            },

            validarCampos() {
                let isValid = true;

                if(this.invalid.cpf){
                    this.$toast.add({
                        severity:'error', 
                        summary: 'CPF inválido', 
                        detail:'Favor corrigir o campo CPF.', 
                        life: 3000
                    });
                    isValid = false;
                    this.usernameIsInvalid = true;
                }

                if(this.invalid.username){ 
                    this.$toast.add({
                        severity:'error', 
                        summary: 'LOGIN inválido', 
                        detail:'Login já cadastrado, insira outro login para continuar.', 
                        life: 3000
                    });
                    isValid = false;
                }

                if(!this.usuario.nome) {
                    this.$toast.add({
                        severity:'error', 
                        summary: 'NOME inválido', 
                        detail:'Nome é obrigatório.', 
                        life: 3000
                    });
                    this.nomeIsInvalid = true;
                    isValid = false;
                }

                if(!this.estabelecimentoSelecionado) {
                    this.$toast.add({
                        severity:'error', 
                        summary: 'ESTABELECIMENTO inválido', 
                        detail:'Selecione um Estabelecimento.', 
                        life: 3000
                    });
                    this.estabelecimentoIsInvalid = true;
                    isValid = false;
                }
/*
                if(this.perfisAutorizados.length <= 0){
                     this.$toast.add({
                        severity:'error', 
                        summary: 'PERFIL inválida', 
                        detail:'Selecione ao menos um PERFIL.', 
                        life: 3000
                    });
                    isValid = false;
                }*/
                return isValid;
            },

            getDados() {
                return {
                    id: this.usuario.id,
                    matricula: this.usuario?.matricula || '',
                    nome: this.usuario?.nome || '',
                    cpf: this.usuario.cpf || undefined,
                    email: this.usuario.email || undefined,
                    username: this.usuario.username,
                    estabelecimento: this.estabelecimentoSelecionado?.codigo || '',
                    regional: this.regional?.codigo || ''
                }
            },

            salvar() {
                if(!this.validarCampos() && !this.doubleClick) return;
                this.doubleClick = true;
                const dados = this.getDados();
                if(this.login) {
                    this.atualizar(dados)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:'O usuário foi atualizado com sucesso!', 
                                life: 3000
                            });

                            this.voltar();
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            this.$toast.add(error, !!this.login);
                        });
                }
                else {
                    this.cadastrar(dados)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:'O usuário foi cadastrado com sucesso!',
                                life: 3000
                            });
                            this.voltar();
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            this.$toast.add(TratamentoDeError(error, !!this.login));
                        });
                }
            },

            atualizar(dados) {
                return new Promise((resolve, reject) => {
                    UsuarioService.atualizar(dados)
                        .then(response => {
                            this.vincularPerfisPorUsuario()
                                .then(response => {
                                    resolve(response);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            reject(error);
                        });
                });
            },

            cadastrar(dados) {
                return new Promise((resolve, reject) => {
                    UsuarioService.cadastrar(dados)
                        .then(response => {
                            this.vincularPerfisPorUsuario()
                                .then(response => {
                                    resolve(response);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            reject(error);
                        });    
                });
            },

            vincularPerfisPorUsuario() {
                return new Promise((resolve, reject) => {
                    if(!this.perfisAutorizados) resolve("Não possui perfis autorizados.");
                    UsuarioService.getUsuarioPorUsername(this.usuario.username)
                        .then(({ data }) => {
                            const usuarioId = data.id;
                            PerfisUsuariosService.vincularPerfisPorUsuario(usuarioId, this.perfisAutorizados)
                                .then(response => {
                                    resolve(response);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            },

            limparCampos() {
                this.usuario = {};
                this.regional = {};
                this.estabelecimentoSelecionado = null;
                this.estabelecimentoOptions = [];
                this.restritoSelecionado = null;
                this.autorizadoSelecionado = null;
                this.perfisAutorizados = [];
                
                this.carregarEstabelecimento();
                this.carregarRestritos();
            },

            moverParaAutorizado() {
                if(!this.restritoSelecionado) {
                    this.$toast.add({
                        severity:'warn', 
                        detail:'Necessário selecionar um perfil restrito.', 
                        life: 3000
                    });
                    return;
                }

                this.perfisAutorizados.push(this.restritoSelecionado);
                const indiceRestrito = this.perfisRestritos.findIndex(item => {
                    return item.id == this.restritoSelecionado.id;
                })

                this.perfisRestritos.splice(indiceRestrito, 1);
                this.restritoSelecionado = null;
            },

            moverParaRestrito() {
                if(!this.autorizadoSelecionado) {
                    this.$toast.add({
                        severity:'warn',
                        detail:'Necessário selecionar um perfil autorizado.', 
                        life: 3000
                    });
                    return;
                }

                this.perfisRestritos.push(this.autorizadoSelecionado);
                const indiceRestrito = this.perfisAutorizados.findIndex(item => {
                    return item.id == this.autorizadoSelecionado.id;
                })

                this.perfisAutorizados.splice(indiceRestrito, 1);
                this.autorizadoSelecionado = null;
            },

            moverTodosParaAutorizado() {
                this.perfisAutorizados = this.perfisAutorizados.concat(this.perfisRestritos);
                this.perfisRestritos = [];
                this.autorizadoSelecionado = null;
                this.restritoSelecionado = null;
            },

            moverTodosParaRestrito() {
                this.perfisRestritos = this.perfisRestritos.concat(this.perfisAutorizados);
                this.perfisAutorizados = [];
                this.autorizadoSelecionado = null;
                this.restritoSelecionado = null;
            },
            
            getEstabelecimentos(event) {              
                const dados = !event.query.trim().length ? '' : event.query;
                EstabelecimentoService.getEstabelecimentosPorCodigoOuDescricao(dados)
                    .then(({ data }) => {
                        if(data) {
                            this.estabelecimentoOptions = [...data];
                        }
                    });
            },

            selecionarEstabelecimento() {
                if(!this.estabelecimentoSelecionado) return;

                const codigoRegional = this.estabelecimentoSelecionado.codigoRegional;
                EstabelecimentoService.getEstabelecimentosPorCodigo(codigoRegional)
                    .then(({ data }) => {
                        data['label'] = `${ data.codigo } - ${ data.nomeFantasia }`;
                        this.regional = data;
                    });
            },

            validarEstabelecimento() {
                if(!this.estabelecimentoSelecionado 
                    && typeof this.estabelecimentoSelecionado !== 'string' ) return;

                this.regional = {};
            },

            getValidation(){                
                var email =  /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
                if(email.test(this.usuario.email)){ this.invalid.email = false;}else{this.invalid.email = true;}
                return;
            },
        
        }
    }
</script>
