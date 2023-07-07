<template>
  <Dialog modal @show="getEstabelecimentosVinculados" header="ESTABELECIMENTOS VINCULADOS" v-model:visible="visible" :style="{width: '50vw'}" closable @hide="$emit('fechar')">
        <span><strong>Grupo: {{ description }}</strong></span><hr />
        <DataTable 
            showGridlines
            selectionMode="single"
            responsiveLayout="stack"
            :value="estabelecimentos">  

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="codigo" header="Código" style="padding-top: 10px; padding-bottom: 10px;"/> 
            <Column field="nomeFantasia" header="Nome Fantasia"/> 
        </DataTable>
        
        <Paginator
            v-model:first="firstRow"
            :rows="qtdRegistro"
            :total-records="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage" />
        
    </Dialog>
</template>

<script>
    import ItensAvariadoService from '../../service/ItensAvariadoService';
    export default {
        props: {
            id: {
                type: String,
                required: true
            },   
            
            visible: {
                type: Boolean,
                required: true
            },

            description: {
                type: String,
                required: false
            }
        },

        data() {
            return {
                pagina: 0,
                firstRow: 0,
                totalRegistro: 0,
                qtdRegistro: 10, 
                estabelecimentos: [],
            }
        },

        methods: {  
            getEstabelecimentosVinculados() { 
                ItensAvariadoService.getStabelecimentosVinculados(this.id, this.pagina, this.qtdRegistro)
                    .then(({ data }) => {
                        this.estabelecimentos = data.content;
                        this.qtdRegistro = data.pageable.pageSize;
                        this.totalRegistro = data.totalElements;
                    });
                    
            }, 
            
            onPage(event) {
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows; 
                this.getEstabelecimentosVinculados();            
            }, 
        },
    }
</script>