<template>
    <div class="card">
        <Toast />

        <div class="flex align-items-center">
           <i class="pi pi-sliders-v" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;"> Movimento Diário</h3>
        </div>
        <hr />

        <DataTable
            showGridlines
            selectionMode="single"
            responsiveLayout="stack"
            :value="database" 
            v-model:selection="movimento"
            bodyClass="align-items-center">

            <template #header>
                <MovimentoDiarioFiltro @filtrar="getMovimentoDiario"/>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="codEstabel" header="Estabelecimento"/>
            
            <Column field="dataIntegracao" header="Data Emissão NF">
                <template #body="{ data }">
                   {{ formatDate(data.paramEstabDtMovto, 'DD/MM/YYYY')}}
                </template>
            </Column> 

            <Column field="dtMovto"  header="Data do Movimento" >
                <template #body="{ data }">
                    <div class="grid mt-2">
                        <span class="mt-1">{{ formatDate(data.dtMovto, 'DD/MM/YYYY')}}</span>
                    </div>
                </template>
            </Column>
            
            <Column field="movtoFech" header="Movimento Fechado?">
                <template #body="{ data }">
                    {{ data.movtoFech ? 'Sim' : 'Não' }}
                </template>
            </Column>            
            <Column field="dataIntegracao" header="Data Integração">
                <template #body="{ data }">
                   {{ formatDate(data.dataIntegracao, 'DD/MM/YYYY')}}
                </template>
            </Column>
            <Column field="dataIntegracao" header="Hora Integração">
                <template #body="{ data }">
                   {{ formatDate(data.dataIntegracao, 'HH:mm:ss')}}
                </template>
            </Column> 
        </DataTable>
    </div>
    <Paginator v-model:first="firstRow" :rows="qtdRegistro" :totalRecords="totalRegistro"
        :rowsPerPageOptions="[5, 10, 20, 30]" @page="onPage">
    </Paginator>
</template>

<script>
    import MovimentoDiarioService from '../../service/MovimentoDiarioService'
    import MovimentoDiarioFiltro from './MovimentoDiarioFiltro.vue';
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';
    import Paginator from 'primevue/paginator';

    export default {
        components: { MovimentoDiarioFiltro, Paginator },
        data() {
            return {
                database: [], 
                movimento: null,  
                filtros: {},
                totalRegistro: 0,
                qtdRegistro: 10,
                pagina: 0,
                firstRow: 0,
                storange: StorageService.getControlePagina("MOVIMENTO_DIARIO"),
            }
        },

        created() {
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;
            this.filtros = this.storange.filtros ? this.storange.filtros : {};
        },

        mounted(){
           
        },

        methods:{
            getMovimentoDiario(filtros = {}, iconePageUm = false) {
                this.filtros = filtros;
                let ordenar = 'dtMovto,codEstabel,desc';
                if (iconePageUm) {this.pagina = 1; this.firstRow = 0;}
                MovimentoDiarioService.getMovimentoDiario(this.pagina, this.qtdRegistro, ordenar, filtros)
                    .then(({ data }) => {
                        if(data) {                            
                            this.database = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                            StorageService.setControlePagina("MOVIMENTO_DIARIO", this.pagina, this.firstRow, this.qtdRegistro, this.filtros);
                        }
                    })
                    .catch(error => {
                        this.database = [];
                        this.qtdRegistro = 0;
                        this.totalRegistro = 0;
                    });
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.qtdRegistro = event.rows;
                this.firstRow = event.rows * event.page;
                this.getMovimentoDiario(this.filtros);
            },
        }
    }
</script>