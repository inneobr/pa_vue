<template>

    <div id="items" class="dashboard">
        <div class="header">
            <div class="row">
                <img src="layout/images/logo-dashboard.png" style="width: 50%; height: 50%; opacity: 1;">
            </div>
        </div>        
    </div>    
</template>

<script>
    
	export default {
		name: "Dashboard", 
        computed: {
            isRTL() {
				return this.$appState.RTL;
			}
        },
	}
</script>

<style scoped>
    .header {
        margin-top: 50px;
        text-align: center;
        color: #fff;
    }

    .box {
        display: flex;
        justify-content: center;
    }

    .body .column,.columns {
        margin-left: 0;
        padding: 10px;
        margin: 0 auto;
    }

    .body {
        margin-top: 10%;
        text-align: center;

    }

    html {
        height: 100vh;
        background-color: #bd4f6c;
        background-image: linear-gradient(326deg, #bd4f6c 0%, #d7816a 74%);
    }
</style>
