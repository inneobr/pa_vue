<template>
    <div class="grid w-full">
        <div class="col-12 xl:col-4">
            <label for="descricao"><strong>Imóvel</strong></label>
            <InputText class="w-full mt-2" id="descricao" v-model="filtros.matriculaNome" placeholder="Matricula / Nome" @keyup.enter="filtrar()"/>
        </div>
        <div class="col-12 xl:col-8 mt-2">
            <label for="descricao"><strong style="color: #fff">.</strong></label>
            <div class="grid w-full">
                <Button type="button" 
                    label="Filtrar" 
                    class="p-button-outlined mt-2 ml-1"
                    icon="pi pi-filter" 
                    style="padding: 0.4rem;"
                    @click="filtrar()"/>
        
                <Button
                    type="button" 
                    label="Limpar Filtros" 
                    class="p-button-outlined mt-2 ml-1"
                    icon="pi pi-filter-slash" 
                    style="padding: 0.4rem;"
                    @click="limparfiltros()"/>
                    
                <Button v-if="filtros.status == 'ATIVO'"
                    type="button"
                    icon="pi pi-ban"
                    label="Listar inativos"
                    class="p-button-outlined p-button-danger mt-2 ml-1"
                    style="padding: 0.4rem;"
                    @click="filtros.status = 'INATIVO'; 
                    filtrar()"/>

                <Button v-if="filtros.status == 'INATIVO'" 
                    type="button"
                    icon="pi pi-check-circle"
                    label="Listar ativos"
                    class="p-button-outlined mt-2 ml-1"
                    style="padding: 0.4rem; "
                    @click="filtros.status = 'ATIVO'; 
                    filtrar()"/>
            </div>        
        </div>
        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                filtros: {},
                options: {},
                iconePageUm: true,
            }
        },
        
        props:{
            method:{
                type: Function
            },
        },

        created(){
            this.filtros.status = "ATIVO";
        },

        mounted(){
            let result = this.method();
            if (result) {
                this.filtros.matriculaNome = result.matriculaNome;
                this.filtros.status = result.status;
            }
        },

        methods: { 
            filtrar() {                   
                this.$emit('filtrar', this.filtros, this.iconePageUm);
            }, 

            limparfiltros(){
                this.filtros = {};
                this.filtros.status = "ATIVO";
                this.$emit('filtrar', this.filtros, this.iconePageUm);
            }
        }
    }
</script>