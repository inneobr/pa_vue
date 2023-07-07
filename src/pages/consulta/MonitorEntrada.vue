<template>
    <div class="card">
        <h5>
            <i class="icon-title pi pi-desktop mr-3" />
            Monitor de entrada de produção
        </h5>
    </div>
</template>

<script lang="js">

    export default {
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
		},
        components: {  }
    }

</script>

<style>
    .icon-title {
        font-size: 1.3rem; 
        font-weight: bold;
    }
</style>