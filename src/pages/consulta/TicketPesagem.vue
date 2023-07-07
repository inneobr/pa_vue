<template>
    <TicketPesagemList />
</template>

<script lang="js">
    import TicketPesagemList from '../../components/consulta/TicketPesagemList.vue';

    export default {
        data(){
            return {  }
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
        components: { TicketPesagemList }
    }

</script>