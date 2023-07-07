<template>
    <div class="card">
        <div class="flex justify-content-between">
            <div class="flex align-items-center">
                <i class="pi pi-cog mr-2" style="font-size: 2rem;"></i>
                <h4 style="margin:0;">{{ id ? 'Editar' : 'Cadastrar'}} Natureza Tributada</h4>
            </div>
        </div><hr />

        <div class="grid">
            <div class="col-12 lg:col-10">
                <label>
                    <strong>Grupo De Natureza</strong>
                </label>
                <div class="grid mt-2">
                    <div class="col-12 lg:col-2">
                        <InputNumber :class="['w-full',{'p-invalid': isValid.codigo}]" v-model="database.codigo" :max="999999999" :disabled="id"/>
                    </div>

                    <div class="col-12 lg:col-6">
                        <InputText :class="['w-full',{'p-invalid': isValid.descricao}]" v-model="database.descricao" maxlength="80" :disabled="disable"/>
                    </div>
                </div>
            </div>
            <div class="col-12 lg:col-1 mt-4" style="text-align: right;">
                <Button icon="pi" class="p-button-rounded p-button-text" @click="visualizarInformacao('NATUREZA_TRIBUTARIA_AREA_TITULO')">
                    <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
                </Button>
            </div>
        </div>

        <TabView>
            <TabPanel>                    
                <template #header>
                    <i class="pi pi-chart-bar mr-1" style="font-size: 1.3rem;"></i>
                    <span>Naturezas</span>
                </template>
                
                
                <Panel header="Header">
                    <template #header>
                        <strong>Pessoa Física</strong>
                    </template>
                    
                    <div class="grid">
                        <div class="col-12 xl:col-6">
                            <Fieldset>
                                <template #legend>
                                    <strong>Cooperado</strong>
                                </template>

                                <div class="grid align-items-center">
                                    <div class="col-12 xl:col-2 label">
                                        <label>Natureza Fixação:</label>
                                    </div>
                                    <div class="col-12 xl:col-3 campo">
                                        <InputText class="w-full" v-model="database.natFixCoop" :disabled="disable"/>
                                    </div>

                                    <div class="col-12 xl:col-1 label">
                                        <label>Série:</label>
                                    </div>
                                    <div class="col-12 xl:col-1 campo">
                                        <InputText class="w-full" v-model="database.serFixCoop" :disabled="disable"/>
                                    </div>

                                    <div class="col-12 xl:col-2 label">
                                        <label>Mod. Natureza Fixação:</label>
                                    </div>
                                    <div class="col-12 xl:col-3 campo">
                                        <InputText class="w-full" v-model="database.modNatFixCoop" :disabled="disable"/>
                                    </div>                                   
                                </div>
                            </Fieldset>
                        </div>

                        <div class="col-12 xl:col-6">
                            <Fieldset>
                                <template #legend>
                                    <strong>Terceiro</strong>
                                </template>

                                <div class="grid align-items-center">
                                    <div class="col-12 xl:col-2 label">
                                        <label>Natureza Fixação:</label>
                                    </div>
                                    <div class="col-12 xl:col-3 campo">
                                        <InputText class="w-full" v-model="database.natFixTerc" :disabled="disable"/>
                                    </div>

                                    <div class="col-12 xl:col-1 label">
                                        <label>Série:</label>
                                    </div>
                                    <div class="col-12 xl:col-1 campo">
                                        <InputText class="w-full" v-model="database.serFixTerc" :disabled="disable"/>
                                    </div>

                                    <div class="col-12 xl:col-2 label">
                                        <label>Mod. Natureza Fixação:</label>
                                    </div>
                                    <div class="col-12 xl:col-3 campo">
                                        <InputText class="w-full" v-model="database.modNatFixTerc" :disabled="disable"/>
                                    </div>
                                </div>
                            </Fieldset>
                        </div>
                    </div>
                </Panel>

                <Panel header="Header" class="mt-4">
                    <template #header>
                        <strong>Pessoa Jurídica</strong>
                    </template>

                    <div class="grid">
                        <div class="col-12 xl:col-6">
                            <Fieldset>
                                <template #legend>
                                    <strong>Cooperado</strong>
                                </template>

                                <div class="grid align-items-center">
                                    
                                    <div class="col-12 xl:col-12 surface-200 mb-2">
                                        <strong>Com Nota Própria</strong>                            
                                    </div>

                                    <div class="col-12 xl:col-2 label">
                                        <label>Natureza Fixação:</label>
                                    </div>
                                    <div class="col-12 xl:col-3 campo">
                                        <InputText class="w-full" v-model="database.natFixPjCnfCoop" :disabled="disable"/>
                                    </div>

                                    <div class="col-12 xl:col-1 label">
                                        <label>Série:</label>
                                    </div>
                                    <div class="col-12 xl:col-1 campo">
                                        <InputText class="w-full" v-model="database.serFixPjCnfCoop" :disabled="disable"/>
                                    </div>

                                    <div class="col-12 xl:col-2 label">
                                        <label>Mod. Natureza Fixação:</label>
                                    </div>
                                    <div class="col-12 xl:col-3 campo">
                                        <InputText class="w-full" v-model="database.modFixPjCnfCoop" :disabled="disable"/>
                                    </div>
                                </div>

                                <div class="grid align-items-center">
                                    <div class="col-12 surface-200 mt-4 mb-2">
                                        <strong>Sem Nota Própria</strong>                            
                                    </div>

                                    <div class="col-12 xl:col-2 label">
                                        <label>Natureza Fixação:</label>
                                    </div>
                                    <div class="col-12 xl:col-3 campo">
                                        <InputText class="w-full" v-model="database.natFixPjSnfCoop" :disabled="disable"/>
                                    </div>

                                    <div class="col-12 xl:col-1 label">
                                        <label>Série:</label>
                                    </div>
                                    <div class="col-12 xl:col-1 campo">
                                        <InputText class="w-full" v-model="database.serFixPjSnfCoop" :disabled="disable"/>
                                    </div>

                                    <div class="col-12 xl:col-2 label">
                                        <label>Mod. Natureza Fixação:</label>
                                    </div>
                                    <div class="col-12 xl:col-3 campo">
                                        <InputText class="w-full" v-model="database.modFixPjSnfCoop" :disabled="disable"/>
                                    </div>
                                </div>
                            </Fieldset>
                        </div>

                        <div class="col-12 sm:col-12 lg:col-6">
                            <Fieldset>
                                <template #legend>
                                    <strong>Terceiro</strong>
                                </template>

                                <div class="grid align-items-center">
                                    <div class="col-12 surface-200 mb-2">
                                        <strong>Com Nota Própria</strong>                            
                                    </div>

                                    <div class="col-12 xl:col-2 label">
                                        <label>Natureza Fixação:</label>
                                    </div>
                                    <div class="col-12 xl:col-3 campo">
                                        <InputText class="w-full" v-model="database.natFixPjCnfTerc" :disabled="disable"/>
                                    </div>

                                    <div class="col-12 xl:col-1 label">
                                        <label>Série:</label>
                                    </div>
                                    <div class="col-12 xl:col-1 campo">
                                        <InputText class="w-full" v-model="database.serFixPjCnfTerc" :disabled="disable"/>
                                    </div>

                                    <div class="col-12 xl:col-2 label">
                                        <label>Mod. Natureza Fixação:</label>
                                    </div>
                                    <div class="col-12 xl:col-3 campo">
                                        <InputText class="w-full" v-model="database.modFixPjCnfTerc" :disabled="disable"/>
                                    </div>
                                </div>

                                <div class="grid align-items-center">
                                    <div class="col-12 surface-200 mt-4 mb-2">
                                        <strong>Sem Nota Própria</strong>                            
                                    </div>

                                    <div class="col-12 xl:col-2 label">
                                        <label>Natureza Fixação:</label>
                                    </div>
                                    <div class="col-12 xl:col-3 campo">
                                        <InputText class="w-full" v-model="database.natFixPjSnfTerc" :disabled="disable"/>
                                    </div>

                                    <div class="col-12 xl:col-1 label">
                                        <label>Série:</label>
                                    </div>
                                    <div class="col-12 xl:col-1 campo">
                                        <InputText class="w-full" v-model="database.serFixPjSnfTerc" :disabled="disable"/>
                                    </div>

                                    <div class="col-12 xl:col-2 label">
                                        <label>Mod. Natureza Fixação:</label>
                                    </div>
                                    <div class="col-12 xl:col-3 campo">
                                        <InputText class="w-full" v-model="database.modFixPjSnfTerc" :disabled="disable"/>
                                    </div>
                                </div>
                            </Fieldset>
                        </div>
                    </div>
                </Panel>
            </TabPanel>

            <TabPanel v-if="integration.visible">
                <template #header>
                    <i :class="{'warn': isValid.grupoProduto }" class="pi pi-shopping-bag mr-1" style="font-size: 1.3rem;"></i>
                    <span :class="{'warn': isValid.grupoProduto }">Grupo De Produtos</span>
                </template>
                
                <PickList v-model="grupoProdutos" dataKey="id" listStyle="height:500px;">
                    <template #sourceheader>
                        Disponíveis
                    </template>

                    <template #targetheader>
                        Vinculados
                    </template>

                    <template #item="{ item }">
                        <span>{{ item.codDesc }}</span>
                    </template>
                </PickList>
            </TabPanel>

            <TabPanel v-if="integration.visible">
                <template #header>
                    <i :class="{'warn': isValid.estabelecimentos }" class="pi pi-home mr-1" style="font-size: 1.3rem;"></i>
                    <span :class="{'warn': isValid.estabelecimentos }">Estabelecimentos</span>
                </template>
                
                <PickList v-model="estabelecimentos" dataKey="id" listStyle="height:500px;" >
                    <template #sourceheader>
                        Disponíveis
                    </template>

                    <template #targetheader>
                        Vinculados
                    </template>

                    <template #item="{ item }">
                        <span>{{ item.codNome }}</span>
                    </template>
                </PickList>
            </TabPanel>
        </TabView>
        <div class="flex m-4">
            <Button 
                v-show="integration.visible"
                icon="pi pi-save"
                label="Salvar"
                class="p-button-info mr-1"
                :disabled="doubleClick"
                @click="saveNaturezaTributaria()">
            </Button>

            <Button 
                v-show="integration.visible"
                icon="pi pi-times"
                label="Cancelar"
                class="p-button-danger"
                @click="voltar()">
            </Button>

            <Button 
                v-show="!integration.visible"
                icon="pi pi-spinner"
                label="Voltar"
                class="p-button p-component p-button-outlined"
                @click="voltar()">
            </Button>
        </div>
    </div>  

    <Modalinformacao 
        :visivel="informacaoDialog"
        :paginaArea="paginaArea"
        @fechar="ocultarInformacao()"/>  
        
    <Toast />
</template>

<script>
    import NaturezaTributariaService from '../../service/NaturezaTributariaService';
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import GrupoProdutoService from '../../service/GrupoProdutoService'; 
    import IntegracaoService from '../../service/IntegracaoService';
    import Modalinformacao from '../ModalInformacao.vue';
    

    export default {
        components: { Modalinformacao },
        props: {
             id: {
                 type: String,
                 required: false
             },            
         },

        data() {
            return {
                database: {},
                isValid: {},
                grupoProdutos: [[],[]],
                estabelecimentos: [[],[]],

                paginaArea: null,
                doubleClick: false,
                informacaoDialog: false,
                
                disable: false,
                integration: {},
            }
        },

        created() {
            this.getGruposProdutos();
            this.getEstabelecimentos();
            this.getNaturezaTributaria();
            this.getIntegrationOptons();
        },

        methods: {
            getIntegrationOptons(){
                const paginaAtual = "NATUREZA_TRIBURARIA";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            debugger
                            this.integration = data;
                            this.disable = data.disable;
                        }
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'info', 
                            summary: 'PARÂMETROS DE PÁGINA NÂO DEFINIDOS', 
                            detail:'Você deve cadastrar os parâmetros para esta página no menu lateral em item: Parâmetros de Integração.',
                            life: 10000
                        });
                    });
            },

            getNaturezaTributaria(){
                if(!this.id) return;
                NaturezaTributariaService.getNaturezatributariaId(this.id)
                    .then(({ data }) => {
                        if(data) {
                            this.database = data;                            
                            this.getGruposProdutos(data.grupoProdutos);
                            this.getEstabelecimentos(data.estabelecimentos);
                        }
                    })
            },

            saveNaturezaTributaria() {
                if(this.validarDados() && !this.doubleClick) return;         
                this.doubleClick = true; 
                NaturezaTributariaService.saveNaturezaTributaria(this.database)
                    .then(({ data }) => {
                        this.$toast.add({
                            severity:'success', 
                            detail:`A Natureza de Operação Tributada foi salva com sucesso!` + data, 
                            life: 3000
                        });                        
                        this.voltar();
                    })                    
                    .catch(error => {
                        this.doubleClick = false;
                        this.$toast.add({
                            severity:'error', 
                            detail:`Não foi possivel salvar Natureza de Operação Tributada!`, 
                            life: 3000
                        });
                    });
            },

            validarDados(){
                let invalid = false;                
                if(this.database.codigo == undefined){
                    this.isValid.codigo = true;
                    this.$toast.add({
                        severity:'warn',
                        detail:'Campo ( código ) é obrigatório.',
                        life: 3000
                    });
                    invalid = true;
                }

                if(this.database.descricao == undefined){
                    this.isValid.descricao = true;
                    this.$toast.add({
                        severity:'warn',
                        detail:'Campo ( descrição ) é obrigatório.',
                        life: 3000
                    });
                    invalid = true;
                }
/*
                if(this.grupoProdutos[1].length <= 0){
                    this.isValid.grupoProduto = true;
                    this.$toast.add({
                        severity:'warn',
                        detail:'Selecione um grupo de produto.',
                        life: 3000
                    });
                    invalid = true;
                }

                if(this.estabelecimentos[1].length <= 0){
                    this.isValid.estabelecimentos = true;
                    this.$toast.add({
                        severity:'warn',
                        detail:'Selecione um estabelecimento.',
                        life: 3000
                    });
                    invalid = true;
                }*/

                this.database.grupoProdutos = this.grupoProdutos[1];
                this.database.estabelecimentos = this.estabelecimentos[1];
                return invalid;
            },

            getGruposProdutos(vinculados = []){
                GrupoProdutoService.listarGruposProdutos()
                    .then(({ data }) => {
                        if(data) {
                            const disponiveis = data.filter(disponivel => {
                                const item = vinculados.find(vinculado => {
                                    return vinculado.id === disponivel.id;
                                });
                                return item === undefined;
                            });    
                            this.grupoProdutos = [disponiveis, vinculados];
                        }
                        else {
                            this.grupoProdutos = [[], []];
                        }
                    })
                    .catch(error => {
                        this.grupoProdutos = [[], []];
                    });
            },

            getEstabelecimentos(vinculados = []) {       
                EstabelecimentoService.getEstabelecimentosNaturezaTributariaSilo()
                    .then(({ data }) => {                     
                        if(data) {
                            const disponiveis = data.filter(disponivel => {
                                const item = vinculados.find(vinculado => {
                                    return vinculado.id === disponivel.id;
                                });
                                return item === undefined;
                            });    
                            this.estabelecimentos = [disponiveis, vinculados];
                        }
                        else {
                            this.estabelecimentos = [[], []];
                        }                        
                    })
                    .catch(error => {
                        this.estabelecimentos = [[], []];
                    });
            },

            visualizarInformacao(paginaArea){
                this.paginaArea = paginaArea;

                console.log(this.paginaArea);
                this.informacaoDialog = true;
            },

            ocultarInformacao(){
                this.informacaoDialog = false;
            },

            voltar() {
                this.$router.push(`/natureza-tributaria`);
            },

        }
    }
</script>