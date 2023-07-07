<template>
    <Dialog
        v-model:visible="visivel"
        :breakpoints="{'960px': '75vw', '640px': '90vw'}"
        :style="{width: '70vw'}"
        :maximizable="true"
        :modal="true"
        @show="carregarDados()"
        @hide="$emit('fechar')"
    >
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-book mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Menu Itens</h3>
            </div>
        </template>
        <div class="grid">        
            <div class="col-12">
                <DataTable 
                    responsiveLayout="scroll"
                    scrollDirection="both"
                    showGridlines
                    :value="lista"
                >
                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="label" header="Label">
                        <template #body="{ data }">
                            <div class="flex align-items-center">
                                <i class="pi mr-2" :class="data.icon" style="font-size: 1.2rem"></i>
                                {{ data.label }}
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <template #footer>
            <Paginator
                :rows="qtdRegistro"
                :totalRecords="totalRegistro"
                :rowsPerPageOptions="[3, 5, 10, 20, 30]"
                @page="onPage"
            ></Paginator>
        </template>
    </Dialog>
</template>

<script>
    import PerfilService from '../../service/PerfilService';
    

    export default {
        emits: ['fechar'],
        props: {
            idPerfil: {
                type: String,
                required: false
            },
            visivel: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                totalRegistro: 0,
                qtdRegistro: 10,
                pagina: 0,
                lista: [],
                estabelecimento: null
            }
        },
        methods: {
            carregarDados() {
                if(!this.visivel) return;

                PerfilService.getMenuItensPorPerfil(
                    this.pagina,
                    this.qtdRegistro,
                    this.idPerfil
                )
                    .then(({ data }) => {
                        if(data) {
                            this.lista = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.lista = [];
                        this.qtdRegistro = 0;
                        this.totalRegistro = 0;
                    });
            },

            onPage(event) {
                this.pagina = event.page;
                this.qtdRegistro = event.rows;
                this.carregarDados();
            }
        }
    }
</script>