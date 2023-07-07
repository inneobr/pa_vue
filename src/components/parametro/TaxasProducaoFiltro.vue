<template #header>
    <div class="flex flex-column lg:flex-row">
        <div class="col-12 lg:col-2">
            <label for="safra"><strong>Safra</strong></label>
            <Dropdown id="safra"
                class="w-full mt-2"
                v-model="safraSelecionado"
                :options="safraOptions"
                placeholder="Selecione"/>
        </div>
        
        <div class="col-12 lg:col-2">
            <label for="grupoProduto"><strong>Grupo De Produtos</strong></label>
            <Dropdown id="grupoProduto"
                    class="w-full mt-2"
                    v-model="grupoProdutoSelecionado"
                    :options="grupoProdutoOptions"
                    optionLabel="descricao"
                    placeholder="Selecione"/>
        </div>

        <div class="col-12 lg:col-2">
            <label for="estabelecimento"><strong>Estabelecimento</strong></label>
            <Dropdown class="w-full mt-2"
                        id="estabelecimento"
                        placeholder="Selecione"
                        v-model="estabelecimentoSelecionado"
                        :options="estabelecimentoOptions"
                        optionLabel="label"/>

        </div>

        <div class="col-12 lg:col-4 mr-2">
            <Button type="button"
                label="Filtrar"
                class="p-button-outlined mt-4"
                icon="pi pi-search"
                style="padding-top: 0.5rem; padding-right: 1.2rem; padding-left: 1.2rem"
                @click="filtrar()"/>
                
            <Button 
                type="button" 
                label="Limpar filtro" 
                class="p-button-outlined  mt-4 ml-2"
                icon="pi pi-filter-slash" 
                style="padding-top: 0.5rem; ; padding-right: 1.2rem; padding-left: 1.2rem"
                @click="limparFiltro()"/>
                

            <Button v-if="visible" type="button"
                label="Cadastrar"
                class="p-button-info mt-4 ml-2"
                style="padding: 0.5rem;"
                icon="pi pi-plus"
                @click="cadastrar()"/>
            
        </div>
    </div>
</template>

<script>
    import SafraService from '../../service/SafraService';
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import StorageService from '../../service/StorageService';

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

                grupoProdutoOptions: [],
                grupoProdutoSelecionado: null,

                estabelecimentoOptions:[],
                estabelecimentoSelecionado: null,

                safraOptions:[],
                safraSelecionado:null,

                storange: StorageService.getControlePagina("TAXA_PRODUCAO"),
            }
        },

        created() {
            
            if(this.storange.filtros){
                this.filtros = this.storange.filtros;
            }
            else{
                this.filtros = {};
            }

            this.carregarGrupoProduto();
            this.carregarSafras();
            this.carregarEstabelecimento();
            
        },

        methods: {
            filtrar() {

                if(this.grupoProdutoSelecionado != undefined){
                    this.filtros.idGrupoProduto = this.grupoProdutoSelecionado.id;
                }

                
                if(this.safraSelecionado != undefined ){
                    this.filtros.safra = this.safraSelecionado;
                }


                if(this.estabelecimentoSelecionado != undefined){
                    this.filtros.idEstabelecimento = this.estabelecimentoSelecionado.id;
                }

                this.$emit('filtrar', this.filtros);
            },

            
            carregarGrupoProduto(){
                GrupoProdutoService.getGruposTodosProdutoResumido()
                    .then(({ data }) => {
                        this.grupoProdutoOptions = data;
                        this.grupoProdutoOptions.unshift({
                                id: undefined,
                                descricao: "Todos",
                            });

                        if(this.filtros.idGrupoProduto != undefined){
                            this.grupoProdutoSelecionado = this.grupoProdutoOptions.find(x=>x.id === this.filtros.idGrupoProduto) ;
                        }

                        if(this.grupoProdutoSelecionado == null ){
                            this.grupoProdutoSelecionado = this.grupoProdutoOptions[0] ;
                        }


                    })
                    .catch(error => {
                        this.grupoProdutoOptions = [];
                        console.error(error);
                    });
            },

            

            carregarEstabelecimento() {
                EstabelecimentoService.getTodosEstabelecimentosSilo()
                    .then(({ data }) => {
                        if(data) {
                            
                            const estabelecimentos = data.map(item => {
                                item["label"] = item.codigo + " - " + item.nomeFantasia;
                                return item;
                            });

                            estabelecimentos.unshift({label: "Todos"});

                            this.estabelecimentoOptions = [...estabelecimentos];

                            if(this.filtros.idEstabelecimento != undefined){   
                               this.estabelecimentoSelecionado = this.estabelecimentoOptions.find(x=>x.id === this.filtros.idEstabelecimento);
                            }
                            if(this.estabelecimentoSelecionado == null){
                                this.estabelecimentoSelecionado = this.estabelecimentoOptions[0];
                            }

                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.estabelecimentoOptions = [];
                    });
            },

            carregarSafras(){
                
                SafraService.getTodasSafras1996()
                    .then(({ data }) => {
                        this.safraOptions = data;
                        this.safraOptions.unshift("Todas");


                        if(this.filtros.safra != undefined){
                            this.safraSelecionado = this.safraOptions.find(x=>x === this.filtros.safra) ;
                        }

                        if(this.safraSelecionado == null){
                            this.safraSelecionado = this.safraOptions[0];
                        }

                    })
                    .catch(error => {
                        this.safraOptions = [];
                        console.log(error);
                    });
            },

            cadastrar() {
                 this.$router.push(`/taxas-producao/cadastrar`);
            },

            limparFiltro(){
                this.filtros = {};
                this.grupoProdutoSelecionado = this.grupoProdutoOptions[0];
                this.estabelecimentoSelecionado = this.estabelecimentoOptions[0];;
                this.safraSelecionado = this.safraOptions[0];

                this.$emit('filtrar', this.filtros);
            },
        },
    }
</script>