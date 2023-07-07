<template>
    <div class="flex grid">
        <div class="col-3 mt-2">
            <label><strong>Estabelecimento</strong></label>

            <AutoComplete
                :dropdown="true" 
                class="w-full reset mr-1"
                field="codigoNomeFantasia"
                placeholder="Selecionar"
                v-model="estabelecimento"     
                @complete="carregarEstabelecimentos($event)"
                :suggestions="estabelecimentosFiltrados" 
            />
        </div> 

        <div class="col-9">
            <label><strong class="ml-2">Período</strong></label>
            <div class="flex align-items-center">
                <div class="col-2 overflow-hidden">
                    <Calendar
                        class="w-full"
                        v-model="dataInicio"
                        autocomplete="off"
                        dateFormat="dd/mm/yy"
                        :showButtonBar="true"
                        :showIcon="true"/>
                </div>                
                <strong class="ml-2 mr-2">à</strong>
                <div class="col-2 overflow-hidden">
                    <Calendar
                        class="w-full"
                        v-model="dataFinal"
                        autocomplete="off"
                        dateFormat="dd/mm/yy"                        
                        :minDate="dataInicio"
                        :showButtonBar="true"
                        :showIcon="true"/>
                </div>
                    
                <Button
                    icon="pi pi-search"
                    label="Filtrar"
                    class="p-button-outlined ml-2"
                    autofocus
                    @click="filtrar()"/> 
            </div>
        </div>
    </div>    
</template>

<script>
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        data() {
            return {
                estabelecimento: null,
                dataInicio: null,
                dataFinal: null,
                estabelecimentosFiltrados: [],
                filtros: {},
                iconePageUm: true,
                estabelecimentoUsuario: null,
                storange: StorageService.getControlePagina("MOVIMENTO_DIARIO"),
            }
        },

        mounted(){

            if(this.storange.filtros){
                this.filtros = this.storange.filtros ;
                this.dataInicio = Formatacao.convertStringToDate(this.filtros.dataInicio, 'DD/MM/YYYY');
                this.dataFinal = Formatacao.convertStringToDate(this.filtros.dataFinal, 'DD/MM/YYYY');
                this.estabelecimento = this.filtros.estabelecimento;
            }else{
                this.filtros = {};
                this.dataInicio = Formatacao.subtrairDias(new Date(), 3);
                this.dataFinal = new Date();
                
                if(StorageService.getEstabelecimento() != undefined){
                    const item = StorageService.getEstabelecimento();
                    item["codigoNomeFantasia"] = item.codigo + " - " + item.nomeFantasia;
                    this.estabelecimentoUsuario = item; 
                    this.estabelecimento = item;
                    this.filtros.estabelecimento = item;
                }
            }
            this.filtrar();
        },

        methods:{

            carregarEstabelecimentos(event) {
                const codigoOuNomeFantasia = !event.query.trim().length ? undefined : event.query;
                EstabelecimentoService.buscarPorUsuarioAutenticadoComHierarquiaEstabelecimentoQueSejaSilo(codigoOuNomeFantasia)
                    .then(({ data }) => {
                        if(data) {

                            const estabelecimentos = data.map(item => {
                            item["codigoNomeFantasia"] = item.codigo + " - " + item.nomeFantasia;
                                return item;
                            });

                            estabelecimentos.unshift({codigoNomeFantasia: "Todos"});
                            this.estabelecimentosFiltrados = [...estabelecimentos];
                        }
                    })
                    .catch(error => {
                        this.estabelecimentosFiltrados = [];
                    });
            },

            filtrar() { 
                if(this.estabelecimento != null){
                    this.filtros.codEstabelecimento = this.estabelecimento.codigo;
                    this.filtros.estabelecimento = this.estabelecimento;
                }else{
                    this.filtros.estabelecimento = null;
                    this.filtros.codEstabelecimento = null;
                }    
                
                 if(this.dataInicio != null){
                    this.filtros.dataInicio = Formatacao.formatDateCustom(this.dataInicio, 'DD/MM/YYYY');
                    console.log(this.dataInicio)
                } 

                 if(this.dataFinal != null){
                    this.filtros.dataFinal = Formatacao.formatDateCustom(this.dataFinal, 'DD/MM/YYYY');
                } 
                this.$emit('filtrar', this.filtros, this.iconePageUm);
            },
        }
    }
</script>