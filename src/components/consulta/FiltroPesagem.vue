<template>
<Dialog v-model:visible="visivel" @show="filtrar()" :style="{width: '90%'}" header="Últimas Pesagens" :modal="true" maximizable="true" @hide="$emit('fechar')"><hr/>
        <div class="col-12">
            <DataTable showGridlines
                responsiveLayout="scroll"
                scrollDirection="both"
                selectionMode="single"
                v-model:selection="pesagemSelecionada"
                :loading="loading"
                :value="databaseModal"
                class="m-2">              

                <template #empty>
                    Nenhum registro encontrado.
                </template>

                <template #loading>
                    Carregando... Por favor, aguarde.
                </template>

                <Column field="codEstabelecimento" header="Estab." frozen>
                    <template #body="{data}">
                        {{ data.codEstabelecimento }}
                    </template>
                </Column>

                <Column field="nroDocPesagem" header="Nr. Doc." frozen/>
                <Column field="placa" header="Placa" frozen/>
                <Column field="dataEntrada" header="Data Entrada">
                    <template #body="{data}">
                        {{ data.dataEntrada }}  {{ data.horaEntrada }} 
                    </template>                        
                </Column>

                <Column field="nomeProdutor" header="Nome Produtor">
                    <template #body="{data}">
                        {{ data.codProdutor }} - {{ data.nomeProdutor }} 
                    </template> 
                </Column> 
                <Column field="nomeProduto" header="Nome Produto">
                    <template #body="{data}">
                        {{ data.codProduto }} - {{ data.nomeProduto }} 
                    </template> 
                </Column>

                <Column field="pesoEntrada" header="Peso Entrada (Kg)">
                    <template #body="{data}">
                        {{ getDecimal(data.pesoEntrada) }}
                    </template>
                </Column>

                <Column header="Ações">
                    <template #body="{data}">
                        <Button type="button" class="p-button-info mr-1" label="Gerar RE" @click="setRePendente(data)" /> 
                    </template>            
                </Column>
            </DataTable>
        </div>

        <Paginator
            :rows="pageableModal"
            :totalRecords="totalRegistroModal"
            :rowsPerPageOptions="[5, 10, 15]"
            @page="onPage">
        </Paginator>
    </Dialog>    
</template>

<script>
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import RependenteService from'../../service/RependenteService';
    import Formatacao from '../../utilities/Formatacao';
    import Safras from '../../service/SafraService'
    export default {
        props: {
            visivel: {
                type: Boolean,
                required: true
            }, 
            
            codigo: {
                type: String,
                required: true
            }, 
        },

        data() {
            return {
                paginaModal: 0,
                pageableModal: 5,
                totalRegistroModal: 0,

                databaseModal: {}, 
                filtros: {},

                pesagemSelecionada: null
            }
        },

        methods: {
            getPesagem(){
                RependenteService.getPesagemDisponivel(this.filtros, this.paginaModal, this.pageableModal)
                    .then(({ data }) => {
                        if(data) {
                            this.databaseModal = data.content;
                            this.pageableModal = data.pageable.pageSize;
                            this.totalRegistroModal = data.totalPages * this.pageableModal;
                        }
                    })
                    .catch(error => {
                        this.databaseModal = {};
                    });
            },

            filtrar(){
                this.filtros.estabelecimento = this.codigo;
                this.getPesagem();
            },

            setRePendente(data){
                this.$router.push(`/entrada-producao/entrada-por-ticket/${ data.nroDocPesagem }/${ data.safra }/${ data.codEstabelecimento }`);
            },

            getDecimal(value, minimumFractionDigits = 3, maximumFractionDigits = 11) {
                return Formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
            },

            onPage(event) {
                this.paginaModal = event.page + 1;
                this.pageableModal = event.rows;
                this.getPesagem();
            },
        }

    }
</script>