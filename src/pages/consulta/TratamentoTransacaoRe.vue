<template>
    <TratamentoTransacaoReList />
</template>

<script lang="js">
    
    import TratamentoTransacaoReList from '../../components/consulta/TratamentoTransacaoReList.vue';
    

    export default {
        data(){
            return { 
                
             }
        },
        components: { TratamentoTransacaoReList },
        methods: {
            // validarRouter() {
            //      const routerName = this.$route.name
            //      if(routerName === 'tratamento-transacoes-re') {
                     
                     
            //          this.isDetalhar = !!id;
            //      }
            //      else {
            //          this.isDetalhar = false;
            //          this.id = null;
            //      }
            // }
        },

        created() {
            //this.validarRouter();
        },

        updated() {
            //this.validarRouter();
        },

        // computed: {
		// 	currentUser() {
		// 		return this.$store.state.auth.user;
		// 	}
		// },
        
    }

</script>