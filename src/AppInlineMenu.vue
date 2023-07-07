<template>
    <div class="layout-inline-menu" :class="{'layout-inline-menu-active': active}">
    <a class="layout-inline-menu-action flex flex-row align-items-center" :class="menuMode === 'horizontal' ? 'p-3 lg:p-1 py-3' : 'p-3'" :style="{'min-width': menuMode === 'horizontal' ? '165px' : 0} " @click="onClick($event)">
        <img src="layout/images/user.png" alt="avatar" style="width: 32px; height: 32px;">
        <span class="flex flex-column" :class="{'ml-2': !isRTL, 'mr-2': isRTL}">
            <span class="font-bold">{{ nome }}</span>
            <small>{{ matricula }}</small>
        </span>
        <i class="layout-inline-menu-icon pi pi-angle-down" :class="{'ml-auto': !isRTL, 'mr-auto': isRTL}"></i>
    </a>
    <span class="layout-inline-menu-tooltip p-tooltip">
		<span class="layout-inline-menu-tooltip-arrow p-tooltip-arrow"></span>
		<span class="layout-inline-menu-tooltip-text p-tooltip-text">Amy Elsner</span>
	</span>
    
    <transition :name="menuMode === 'horizontal' && !isMobile() ? 'layout-inline-menu-action-panel-horizontal' : 'layout-inline-menu-action-panel'">
        <ul v-show="active" :class="['layout-inline-menu-action-panel', { 'layout-inline-menu-action-panel-horizontal' : menuMode === 'horizontal' && !isMobile()}]">
            <!-- <li class="layout-inline-menu-action-item">
                <a class="flex flex-row align-items-center">
                    <i class="pi pi-cog pi-fw"></i>
                    <span>Preferências</span>
                </a>
                <span class="layout-inline-menu-tooltip p-tooltip">
					<span class="layout-inline-menu-tooltip-arrow p-tooltip-arrow"></span>
					<span class="layout-inline-menu-tooltip-text p-tooltip-text">Settings</span>
				</span>
            </li> -->
            <li class="layout-inline-menu-action-item">
                <a class="flex flex-row align-items-center" @click="$emit('abrirModalAlterarSenha')">
                    <i class="pi pi-lock pi-fw"></i>
                    <span>Alterar senha</span>
                </a>
                <span class="layout-inline-menu-tooltip p-tooltip">
					<span class="layout-inline-menu-tooltip-arrow p-tooltip-arrow"></span>
					<span class="layout-inline-menu-tooltip-text p-tooltip-text">Terms of Usage</span>
				</span>
            </li>
            <!-- <li class="layout-inline-menu-action-item">
                <a class="flex flex-row align-items-center">
                    <i class="pi pi-comments pi-fw"></i>
                    <span>Suporte</span>
                </a>
                <span class="layout-inline-menu-tooltip p-tooltip">
					<span class="layout-inline-menu-tooltip-arrow p-tooltip-arrow"></span>
					<span class="layout-inline-menu-tooltip-text p-tooltip-text">Support</span>
				</span>
            </li> -->
            <li class="layout-inline-menu-action-item">
                <a class="flex flex-row align-items-center" @click.prevent="logOut">
                    <i class="pi pi-power-off pi-fw"></i>
                    <span>Sair</span>
                </a>
                <span class="layout-inline-menu-tooltip p-tooltip">
					<span class="layout-inline-menu-tooltip-arrow p-tooltip-arrow"></span>
					<span class="layout-inline-menu-tooltip-text p-tooltip-text">Logout</span>
				</span>
            </li>
    </ul>
    </transition>
</div>

</template>

<script>
    import StorageService from './service/StorageService';

	export default {
        name: "AppInlineMenu",
        data() {
			return {
				matricula: null,
				nome: null,
            }
        },
        props: {
            active: {
                type: Boolean,
                default: false
            },
            menuMode: String,
            inlineMenuKey: String
        },
		methods: {
			onClick(event) {
                this.$emit('change-inlinemenu', !this.active, this.inlineMenuKey);
				event.preventDefault();
			},
            isMobile() {
                return window.innerWidth <= 991;
            },logOut() {
				this.$store.dispatch('auth/logout');
				this.$router.push('/login');
			}
		},
        computed: {
            isRTL() {
				return this.$appState.RTL;
			},
			currentUser() {
				return StorageService.getUser();
			},
            currentEstabelecimento() {
                return StorageService.getEstabelecimento();
            }
        },
		mounted() {
            this.nome = this.currentUser?.nome || '';
            this.matricula = this.currentEstabelecimento?.nomeFantasia || '';
		}
	}
</script>

<style scoped>

</style>
