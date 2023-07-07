<template #header>
    <div class="flex align-items-center lg:align-items-end flex-column lg:flex-row">
        <div class="mt-2 mr-2 w-full lg:w-2">
            <label for="descricao"><strong>Descrição Grupo</strong></label>
            <InputText class="w-full mt-1" id="descricao" v-model="filtros.descricao" />
        </div>

        <div class="mt-2 mr-2 w-full lg:w-2">
            <label for="safra"><strong>Safra</strong></label>
            <Dropdown id="safra"
                    class="w-full mt-1"
                    v-model="safraSelecionado" 
                    :options="safrasFiltradas" 
                    optionLabel="safra" 
                    placeholder="Selecione"/>
        </div>
            
        <div class="mt-2 mr-2 w-full lg:w-2">
            <label for="tipo"><strong>Tipo</strong></label> 
            <Dropdown id="tipo"
                class="w-full mt-1"
                v-model="tipoSelecionado" 
                :options="tiposFiltrados" 
                optionLabel="tipo" 
                placeholder="Selecione"
            />
        </div>

        <div class="mt-2 mr-2 w-full lg:w-2">
            <label for="grupo"><strong>Grupo</strong></label> 
            <Dropdown id="tipo"
                class="w-full mt-1"
                v-model="grupoSelecionado" 
                :options="grupoFiltrado" 
                optionLabel="codDesc" 
                placeholder="Selecione"/>
        </div>

        <div class="mt-2 mr-2 w-full lg:w-auto">
            <Button
                type="button" 
                label="Filtrar" 
                class="p-button-outlined w-full"
                icon="pi pi-search" 
                style="padding: 0.4rem;"
                @click="filtrar()"
            ></Button>

        </div>

        <div class="mt-2 mr-2 w-full lg:w-auto">
            <Button 
                type="button" 
                icon="pi pi-filter-slash" 
                label="Limpar filtro" 
                class="p-button-outlined  w-full"
                style="padding: 0.4rem;"
                @click="limparFiltro()"/>
        </div>

        <div class="mt-2 mr-2 w-full lg:w-auto">
            <Button v-if="visible"
                type="button" 
                label="Cadastrar" 
                class="p-button-info w-full" 
                style="padding: 0.4rem;"
                icon="pi pi-plus" 
                @click="cadastrar()"
            ></Button>
        </div>
    </div>
</template>

<script>
    import TipoClassificacaoService from '../../service/TipoClassificacaoService';
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import StorageService from '../../service/StorageService';

    import SafraService from '../../service/SafraService';

    export default {
            emits: ['filtrar'],
            props: {
                totalRegistro: {
                    type: Number,
                    required: true
                },
                visible: {
                    type: Boolean,
                    required: true
                }            
            },

            data() {
                return {
                    filtros: {},  
                    grupoFiltrado: [], 
                    tiposFiltrados: [],             
                    safrasFiltradas: [],                    
                    
                    tipoSelecionado: {},
                    grupoSelecionado: {},
                    safraSelecionado: {},

                    storange: StorageService.getControlePagina("GRUPO_CLASSIFICACAO"),
                }
            },

            created(){
                if(this.storange.default == undefined){
                    this.filtros = this.storange.filtros;
                }
                this.carregarSafras();
                this.carregarGruposProdutos();
                this.carregarTipoClassificacao();
            },

            methods: { 
                filtrar() { 
                    if(this.tipoSelecionado !== undefined && this.tipoSelecionado !== null){
                        this.filtros.idTipoClassificacao = this.tipoSelecionado.id;
                    }
                    if(this.grupoSelecionado !== undefined && this.grupoSelecionado !== null){
                        this.filtros.idGrupoProduto = this.grupoSelecionado.id;
                    }
                    if(this.safraSelecionado !== undefined && this.grupoSelecionado !== null){
                        this.filtros.safra = this.safraSelecionado.safra;
                    }                           
                    this.$emit('filtrar', this.filtros);
                },  

                cadastrar() {
                    this.$router.push(`/grupo-classificacao/cadastrar`);
                },
                    
                carregarSafras(){
                    SafraService.getTodasSafras()
                        .then(({ data }) => {
                            if(data) {
                                let safras = data.map(item => {
                                            return {
                                                safra: item,
                                            }
                                        })
                                safras.unshift({safra: "Todas"});   
                                this.safrasFiltradas = safras;
                            }

                            if(this.filtros.safra != undefined){
                                this.safraSelecionado = this.safrasFiltradas.find(x=>x.safra === this.filtros.safra) ;
                            }

                        })
                },

                carregarTipoClassificacao(){
                    TipoClassificacaoService.getTiposClassificacao()
                        .then(({ data }) => {
                            this.tiposFiltrados = data; 
                            this.tiposFiltrados.unshift({
                                tipoClassificacao: undefined,
                                tipo: "Todos"
                            });
                            
                            if(this.filtros.idTipoClassificacao != undefined){
                                this.tipoSelecionado = this.tiposFiltrados.find(x=>x.id === this.filtros.idTipoClassificacao) ;
                            }
                    })
                },

                carregarGruposProdutos(){
                    GrupoProdutoService.listarGruposProdutos()
                        .then(({ data }) => { 
                            if(data) {
                                this.grupoFiltrado = data;

                                //console.log('####Data', data);

                                // this.grupoFiltrado.items.sort((a, b) => {
                                //     const nameA = a.codDesc.toUpperCase(); // ignore upper and lowercase
                                //     const nameB = b.codDesc.toUpperCase(); // ignore upper and lowercase
                                //     if (nameA < nameB) {
                                //         return -1;
                                //     }
                                //     if (nameA > nameB) {
                                //         return 1;
                                //     }

                                //     // names must be equal
                                //     return 0;
                                //     });

                                this.grupoFiltrado.unshift({
                                    id: undefined,
                                    codDesc: "Todos",
                                });

                                if(this.filtros.idGrupoProduto != undefined){
                                    this.grupoSelecionado = this.grupoFiltrado.find(x=>x.id === this.filtros.idGrupoProduto) ;
                                }
                            }
                        }
                    )
                },

                limparFiltro(){
                    this.filtros = {};
                    this.tipoSelecionado = null;
                    this.grupoSelecionado = null;
                    this.safraSelecionado = null;

                    this.$emit('filtrar', this.filtros);
                },

                

                
            }
        }
</script>