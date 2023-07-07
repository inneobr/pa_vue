<template>
    <RomaneioEntregaList v-if="!isDetalhar"/>
    <RomaneioEntregaForm v-if="isDetalhar" :id="id"/>
</template>

<script lang="js">
    import RomaneioEntregaList from '../../components/consulta/RomaneioEntregaList.vue';
    import RomaneioEntregaForm from '../../components/consulta/RomaneioEntregaForm.vue';

    export default {
        data(){
            return { 
                isDetalhar: false,
                id: null
             }
        },
        methods: {
            validarRouter() {
                const routerName = this.$route.name
                if(routerName === 'romaneioEntregaConsulta') {
                    const id = this.$route.params.id;
                    this.id = id ? id : null;
                    this.isDetalhar = !!id;
                }
                else {
                    this.isDetalhar = false;
                    this.id = null;
                }
            }
        },

        created() {
            this.validarRouter();
        },

        updated() {
            this.validarRouter();
        },

        computed: {
			currentUser() {
				return this.$store.state.auth.user;
			}
		},
        components: { RomaneioEntregaList, RomaneioEntregaForm }
    }

</script>