<template>
    <Login v-if="$route.path === '/login'" />
    <Error v-else-if="$route.path === '/error'" />
    <Access v-else-if="$route.path === '/access'" />
    <NotFound v-else-if="$route.path === '/notfound'" />
    <Landing v-else-if="$route.path === '/landing'" />
    <ContactUs v-else-if="$route.path === '/contactus'" />
    <RecuperarSenha v-else-if="$route.path === '/recuperar-senha'" />
    <App :topbarTheme="topbarTheme" :layoutMode="layoutMode" :menuTheme="menuTheme" @menu-theme="onMenuTheme" @topbar-theme="onTopbarThemeChange" @layout-mode-change="onLayoutChange" v-else />
</template>

<script>
    import App from './App.vue';
    import Error from './pages/demo/Error';
    import Access from './pages/demo/Access';
    import Login from './pages/Login';
    import NotFound from './pages/demo/NotFound';
    import Landing from './pages/demo/Landing';
    import ContactUs from './pages/demo/ContactUs';
    import RecuperarSenha from './pages/RecuperarSenha.vue';

	export default {
        data() {
            return {
                theme: this.$store.state.auth.user != null ? this.$store.state.auth.user.tema : 'blue',
                layoutMode: this.$store.state.auth.user != null ? this.$store.state.auth.user.tema : 'blue',
                topbarTheme: this.$store.state.auth.user != null ? this.$store.state.auth.user.corCabecalho : 'lightblue',
                menuTheme: this.$store.state.auth.user != null ? this.$store.state.auth.user.corMenu : 'light',
            }
        },
        methods: {
            onLayoutChange(layout) {
                this.layoutMode = layout;
                this.$appState.layoutMode = layout;
                this.menuTheme = layout;

                const logo = document.getElementById('logo');

                if(logo) {
                    logo.src = 'layout/images/logo-genesis-branca.png';
                }
                
                if (layout === 'dark') {
                    this.topbarTheme = 'dark';
                }
                else {
                    this.topbarTheme = 'lightblue';
                }
            },
            onTopbarThemeChange(theme) {
                this.topbarTheme = theme.name;

                const themeName = theme.name;
                const logo = document.getElementById('logo');

                if (themeName == 'white' || themeName == 'yellow' || themeName == 'amber'  || themeName == 'orange' || themeName == 'lime') {
                    logo.src = 'layout/images/logo-genesis-branca.png';
                }
                else {
                    logo.src = 'layout/images/logo-genesis-branca.png';
                }
            },
            onMenuTheme(menuTheme) {
                this.menuTheme = menuTheme.name;
            }
        },
        components: {
            "App": App,
            "Error": Error,
            "Access": Access,
            "Login": Login,
            "NotFound": NotFound,
            "Landing": Landing,
            "ContactUs": ContactUs,
                RecuperarSenha
        }
	}
</script>

<style scoped>
</style>
