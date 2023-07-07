<template>
    <EntregaProducaoList />
</template>

<script>
    import EntregaProducaoList from '../../components/atividade/EntregaProducaoList.vue';

    export default {
        components: { EntregaProducaoList },
        data(){
            return {      }
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
		}
    }

</script>

<style>
    .icon-title {
        font-size: 1.3rem; 
        font-weight: bold;
    }
</style>