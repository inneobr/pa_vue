<template>
	<Toast />
	<div class="layout-topbar shadow-4">
		<div class="layout-topbar-left">
			<router-link class="layout-topbar-logo" to="/">
				<img id="logo" src="layout/images/logo-genesis-branca.png" alt="ultima-layout" style="height: 3.4rem;">
			</router-link>

			<a class="layout-menu-button shadow-6 p-ripple" @click="onMenuButtonClick($event)" v-ripple>
				<i class="pi pi-chevron-right"></i>
			</a>

			<a class="layout-topbar-mobile-button p-ripple" @click="onTopbarMobileButtonClick($event)" v-ripple>
				<i class="pi pi-ellipsis-v fs-large"></i>
			</a>
		</div>

		<div class="layout-topbar-right" :class="{'layout-topbar-mobile-active': mobileTopbarActive}">
			<div class="layout-topbar-actions-left col-12 sm:col-12 md:col-12 lg:col-4">
				<div class="p-inputgroup">
					<span class="p-inputgroup-addon">
						<i class="pi pi-search fs-large"></i>
					</span>
					<AutoComplete 
						placeholder="Pesquisar..." 
						:minLength="minLengthFilter"
						v-model="funcionalidadeSelecionada" 
						field="nome"
						:suggestions="funcionalidadesFiltrada" 
						@complete="buscarFuncionalidades($event)" 
						@item-select="selecionarFuncionalidade"
					/>
				</div>
			</div>

			<div class="layout-topbar-actions-right">
				<ul class="layout-topbar-items">
					<li class="layout-topbar-item notifications">
						<a class="layout-topbar-action rounded-circle p-ripple" @click="onTopbarItemClick($event, 'notifications')" v-ripple>
							<span v-if="notificacoes.length > 0" class="p-overlay-badge" v-badge.warning>
								<i class="pi pi-bell fs-large"></i>
							</span>
							
							<span v-if="notificacoes.length <= 0" class="p-overlay-badge">
								<i class="pi pi-bell fs-large"></i>
							</span>
						</a>

						<transition name="layout-topbar-action-panel">
							<ul class="layout-topbar-action-panel shadow-6" v-show="activeTopbarItem === 'notifications'">
								<li class="mb-3">
									<span class="px-3 fs-small">Você tem <strong>{{ totalNotificacoes }}</strong> notificações</span>
								</li>

								<li class="layout-topbar-action-item" v-for="item in notificacoes" :key="item.id" @click="abrirMensagem(item.id)">
									<div class="flex flex-row align-items-center">
										<img :src="'data:image/jpg;base64,' + item.imagemProfile"/>
										<div class="flex flex-column" :class="{'ml-3': !isRTL, 'mr-3': isRTL}" style="flex-grow: 1;">
											<div class="flex align-items-center justify-content-between mb-1">
												<span class="fs-small font-bold">{{ item.nome }}</span>
												<small>{{ item.dataMensagem }}</small>
											</div>
											<span class="fs-small">{{ item.titulo }}</span>
										</div>
									</div>
								</li>
								
								<li class="mt-3 pl-3 pr-3">
									<Button class="w-full" label="Visualizar todas mensagens" @click="visualizarMensagens"></Button>
								</li>
							</ul>
						</transition>
					</li>

					<!-- <li class="layout-topbar-item app">
						<a class="layout-topbar-action rounded-circle p-ripple" @click="onTopbarItemClick($event, 'apps')" v-ripple>
							<i class="pi pi-table fs-large"></i>
						</a>

						<transition name="layout-topbar-action-panel">
								<div class="grid grid-nogutter layout-topbar-action-panel shadow-6" v-show="activeTopbarItem === 'apps'">	
									<div class="layout-topbar-action-item col-4">
										<a class="flex align-items-center flex-column text-color p-ripple" v-ripple>
											<i class="pi pi-image action indigo-bgcolor white-color"></i>
											<span>Products</span>
										</a>
									</div>
									<div class="layout-topbar-action-item col-4">
										<a class="flex align-items-center flex-column text-color p-ripple" v-ripple>
											<i class="pi pi-file-pdf action orange-bgcolor white-color"></i>
											<span>Reports</span>
										</a>
									</div>
									<div class="layout-topbar-action-item col-4">
										<a class="flex align-items-center flex-column text-color p-ripple" v-ripple>
											<i class="pi pi-dollar action teal-bgcolor white-color"></i>
											<span>Balance</span>
										</a>
									</div>
									<div class="layout-topbar-action-item col-4">
										<a class="flex align-items-center flex-column text-color p-ripple" v-ripple>
											<i class="pi pi-cog action pink-bgcolor white-color"></i>
											<span>Settings</span>
										</a>
									</div>
									<div class="layout-topbar-action-item col-4">
										<a class="flex align-items-center flex-column text-color p-ripple" v-ripple>
											<i class="pi pi-key action bluegrey-bgcolor white-color"></i>
											<span>Credentials</span>
										</a>
									</div>
									<div class="layout-topbar-action-item col-4">
										<a class="flex align-items-center justify-content-center flex-column text-color p-ripple" v-ripple>
											<i class="pi pi-sitemap action cyan-bgcolor white-color"></i>
											<span>Sitemap</span>
										</a>
									</div>
								</div>
						</transition>
					</li> -->

					<li class="layout-topbar-item">
						<a class="layout-topbar-action flex flex-row justify-content-center align-items-center px-2 rounded-circle p-ripple" @click="onTopbarItemClick($event, 'profile')" v-ripple>
							<img src="layout/images/user.png" alt="avatar" style="width: 32px; height: 32px;">
						</a>

						<transition name="layout-topbar-action-panel">
							<ul class="layout-topbar-action-panel shadow-6" v-show="activeTopbarItem === 'profile'">
								<!-- <li class="layout-topbar-action-item">
									<a class="flex flex-row align-items-center p-ripple" v-ripple>
										<i class="pi pi-cog" :class="{'mr-2': !isRTL, 'ml-2': isRTL}"></i>
										<span>Preferências</span>
									</a>
								</li> -->
								<li class="layout-topbar-action-item">
									<a class="flex flex-row align-items-center p-ripple" v-ripple @click="$emit('abrirModalAlterarSenha')">
										<i class="pi pi-lock" :class="{'mr-2': !isRTL, 'ml-2': isRTL}"></i>
										<span>Alterar senha</span>
									</a>
								</li>
								<!-- <li class="layout-topbar-action-item">
									<a class="flex flex-row align-items-center p-ripple" v-ripple>
										<i class="pi pi-comments" :class="{'mr-2': !isRTL, 'ml-2': isRTL}"></i>
										<span>Suporte</span>
									</a>
								</li> -->
								<li class="layout-topbar-action-item">
									<a class="flex flex-row align-items-center p-ripple" v-ripple @click.prevent="logOut">
										<i class="pi pi-power-off" :class="{'mr-2': !isRTL, 'ml-2': isRTL}"></i>
										<span>Sair</span>
									</a>
								</li>
							</ul>
						</transition>
					</li>

					<!-- <li class="layout-topbar-item">
						<a class="layout-topbar-action rounded-circle p-ripple" @click="onRightPanelButtonClick($event)" v-ripple>
							<i class="pi fs-large" :class="{'pi-arrow-left': !isRTL, 'pi-arrow-right': isRTL}"></i>
						</a>
					</li> -->
				</ul>
			</div>
		</div>
	</div>
	<Dialog :visible="trocarSenha" :style="{width: '350px'}" :modal="true" :closable="false">
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-unlock mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Alterar senha</h3>
            </div>
        </template>
        <div class="grid">
            <div class="col-12">
                <label><strong>Senha atual<span class="ml-1" style="color:red;">*</span></strong></label>
                <InputText type="password" v-model="database.senhaAntiga"  class="w-full mt-2" :class="{'p-invalid': options.senhaAntiga}"/>
            </div>
            <div class="col-12 mt-2">
                <label><strong>Nova senha<span class="ml-1" style="color:red;">*</span></strong></label>
                <InputText type="password"  v-model="database.senhaNova" class="w-full mt-2" :class="{'p-invalid': options.novaSenha}"/>
            </div>
            <div class="col-12 mt-2">
                <label><strong>Confirmar nova senha<span class="ml-1" style="color:red;">*</span></strong></label>
                <InputText type="password" v-model="database.confirmarNovaSenha" class="w-full mt-2" :class="{'p-invalid': options.confirmarNovaSenha}"/>
            </div>
        </div>
        <template #footer>
            <Button label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info"  @click="salvar()" />
        </template>
    </Dialog>
</template>

<script>
	import FuncionalidadeService from './service/FuncionalidadeService';
	import UsuarioService from './service/UsuarioService';
	import Formatacao from './utilities/Formatacao';
	import StorageService from './service/StorageService';

	export default {
		emits: ['menubutton-click', 'topbar-menubutton-click', 'topbaritem-click', 'rightpanel-button-click', 'topbar-mobileactive', 'abrirModalAlterarSenha'],
		data() {
			return {
				funcionalidades: [],
				funcionalidadesFiltrada: [],
				funcionalidadeSelecionada: null,
				minLengthFilter: 3,
				matricula: null,
				cooperado: null,

				totalNotificacoes: 0,
				notificacoes: [],

				trocarSenha: false,
                database: {},
                options: {}
			}
		},
		props: {
			horizontal: {
				type: Boolean,
				default: false
			},
			topbarMenuActive: {
				type: Boolean,
				default: false
			},
			activeTopbarItem: String,
			mobileTopbarActive: Boolean
		},

		created(){
            if(this.$store.state.auth.user != null && this.$store.state.auth.user != undefined){
				this.getUsuario(this.$store.state.auth.user);
			}
        },

        updated(){
			if(this.$store.state.auth.user != null && this.$store.state.auth.user != undefined){
				this.getUsuario(this.$store.state.auth.user);
			}
            
        },

		methods: {
			getUsuario(currenteUser){
                UsuarioService.getUsuarioPorUsername(currenteUser.username)
                    .then(({ data }) => {
                        if(data) {
                            this.trocarSenha = data.trocarSenha;
                        }
                    });
            },
                            
            salvar(){
                if(this.validarCampos()) return;
                UsuarioService.alterarSenha(this.database)
                    .then(({ data }) => {
                        if(data){
                            this.$toast.add({
                                severity:'success', 
                                summary: 'Senha alterada com sucesso!',
                                life: 3000
                            });
                            this.trocarSenha = false;
                        }
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'error', 
                            detail:'Não foi possivel salvar a nova senha!', 
                            life: 3000
                        })                           
                     });
            },
            
            validarCampos(){               
                let invalid = false
                if(!this.database.senhaAntiga){
                    this.options.senhaAntiga = true;                    
                    this.$toast.add({
                        severity:'warn', 
                        summary: 'Senha atual é obrigatória!',
                        life: 3000
                    });
                    return invalid = true;
                }

                if(!this.database.senhaNova){
                    this.options.novaSenha = true;
                    this.$toast.add({
                        severity:'warn', 
                        summary: 'Nova senha é obrigatória!',
                        life: 3000
                    });
                    return invalid = true;
                }

                if(!this.database.confirmarNovaSenha){
                    this.options.confirmarNovaSenha = true;
                    this.$toast.add({
                        severity:'warn', 
                        summary: 'Comfirmar nova senha é obrigatória!',
                        life: 3000
                    });
                    return invalid = true;
                }

                if(this.database.senhaNova !== this.database.confirmarNovaSenha){
                    this.options.confirmarNovaSenha = true;
                    this.options.novaSenha = true;
                    this.$toast.add({
                        severity:'warn', 
                        summary: 'As senhas não são iguais!',
                        life: 3000
                    });
                    return invalid = true;
                }
                return invalid;
            },
			onMenuButtonClick(event) {
				this.$emit('menubutton-click', event);
			},
			onTopbarMenuButtonClick(event) {
				this.$emit('topbar-menubutton-click', event);
			},
			onTopbarItemClick(event, item) {
				this.$emit('topbaritem-click', {originalEvent: event, item: item});
			},
			onTopbarMobileButtonClick(event) {
				this.$emit('topbar-mobileactive', event);
			},
			onRightPanelButtonClick(event) {
				this.$emit('rightpanel-button-click', event);
			},
			
			logOut() {
				this.$store.dispatch('auth/logout');
				this.$router.push('/login');
			},

			async getFuncionalidades() {
				const { data } = await FuncionalidadeService.listar();
				
				let funcionalidades = [];

				if(data) {
					funcionalidades = data.filter((item) => {
						return item.ativo && !(item.codigo == 'login' || item.codigo == 'capital_social' ||
								 item.codigo == 'mensagens' || item.codigo == 'previsao_tempo')
					});
				}

				return funcionalidades;
			},

			async buscarFuncionalidades(event) {
				if(this.funcionalidades.length <= 0) {
					this.funcionalidades = await this.getFuncionalidades();
				}

				if (!event.query.trim().length) {
					this.funcionalidadesFiltrada = [...this.funcionalidades];
				}
				else {
					this.funcionalidadesFiltrada = this.funcionalidades.filter((item) => {
						return item.nome.toLowerCase().startsWith(event.query.toLowerCase());
					});
				}
			},

            selecionarFuncionalidade() {
                if(this.funcionalidadeSelecionada) {
                    const url = this.funcionalidadeSelecionada.urlVue;
                    this.$router.push(`/${url}`);

					this.funcionalidadeSelecionada = null;
                }
            },

			carregarNotificacoes() {
				
			},

			abrirMensagem(mensagemId) {
				this.$router.push(`/mensagem/${mensagemId}`);
				this.carregarNotificacoes();
			},

			visualizarMensagens() {
				this.$router.push(`/mensagens`);
			},

			sucessoCooperadoSelecionado(data) {
				this.$router.go();
			},
						
			erroColaborador(error) {
				this.$toast.add({
					severity:'error', 
					summary: 'Falha', 
					detail: error, 
					life: 3000
				});
			}
		},
		computed: {
			topbarItemsClass() {
				return ['topbar-items animated fadeInDown', {
					'topbar-items-visible': this.topbarMenuActive
				}];
			},
			isRTL() {
				return this.$appState.RTL;
			},
			currentUser() {
				return this.$store.state.auth.user;
			}
		},
		mounted() {
			let path = window.location.href;
			if (!this.currentUser) {
				if (!path.includes('recuperar-senha')) {
					console.log('Redirect login..')
					this.$router.push('/login');
				}
			}else{
				this.matricula = this.currentUser.matricula;
				this.carregarNotificacoes();
			}
		}

	}
</script>
