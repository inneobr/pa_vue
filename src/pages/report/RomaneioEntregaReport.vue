<template>
    <RomaneioEntregaReportFilter/>
    
</template>

<script lang="js">
    import RomaneioEntregaReportFilter from '../../components/report/RomaneioEntregaReportFilter.vue';
    
    export default {
        data(){
            return { 
                isDetalhar: false,
                id: null
             }
        },
        methods: {
            
        },

        created() {
            
        },

        updated() {
            
        },

        computed: {
			currentUser() {
				return this.$store.state.auth.user;
			}
		},
        components: { RomaneioEntregaReportFilter }
    }

</script>