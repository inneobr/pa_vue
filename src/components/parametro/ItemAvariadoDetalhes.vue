<template>
    <Dialog modal @show="getDetalhes" header="DETALHES ITEM AVARIADO" v-model:visible="visible" :style="{width: '60vw'}" closable @hide="$emit('fechar')">
        <span><strong>Descrição: {{ description }}</strong></span><hr />
        <DataTable showGridlines="true" :value="detalhes" responsiveLayout="stack">
            <Column field="percentualInicial" header="Chuv/Ava Inicial"/>
            <Column field="percentualFinal"  header="Chuv/Ava Final"/>
            <Column field="phInicial" header="Ph Inicial"/>
            <Column field="phFinal" header="Ph Final"/>
            <Column field="produto" header="Produto">
                <template #body="{ data }">
                    <span>{{ data.produto.codigo }} - {{ data.produto.descricao }}</span>
                </template>
            </Column>
            <Column field="produtoReferencia.codRef" header="Referência"/>
        </DataTable>
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
                detalhes: [],
            }
        },        

        methods: { 
            getDetalhes() {
                ItensAvariadoService.getItensAvariadoDetalhes(this.id)
                    .then(({ data }) => {
                        this.detalhes = data.detalhes;
                    });

            },
        }
    }
</script>