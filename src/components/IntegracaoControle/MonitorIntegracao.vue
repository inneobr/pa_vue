<template>
    <div class="grid crud-demo">
		<div class="col-12">
            <div class="card" >
                <Toast />

                <div class="flex align-items-center">
                    <i class="pi pi-desktop mr-2" style="font-size: 1.5rem;"></i>
                    <h3 style="margin:0;">Monitoramento de Integrações</h3>
                </div>
                <hr />  
                    <DataTable 
                        showGridlines
                        responsiveLayout="stack"
                        :value="content"
                        :loading="carregando"   
                        selectionMode="single"
                        v-model:selection="funcionalidade">


                        <template #header>
                            
                        </template>

                        <template #empty>
                            Nenhum registro encontrado.
                        </template>

                        <template #loading>
                            Carregando... Por favor, aguarde.
                        </template>

                        <Column field="descricaoFuncionalidade" header="Funcionalidade" sortable />

                        <Column field="methodSend" header="Método" style="width:2rem;">
                            <template #body="{ data }">
                                <span :class="'product-badge status-' + corMetodo(data.methodSend)">{{ data.methodSend}}</span>
                            </template>                            
                        </Column>

                        <Column field="schedulerSend.expressions" header="Scheduler Send" style="width:12rem;">
                            <template #body="{ data }">
                                <span>
                                    <i class="pi pi-clock mr-2" style="color:darkolivegreen"></i>{{ data.schedulerSend.expressions}}
                                </span>
                            </template>
                        </Column>
                        <Column field="schedulerReturn.expressions" header="Scheduler Return" style="width:12rem;">
                            <template #body="{ data }">
                                <span>
                                    <i class="pi pi-clock mr-2" style="color:darkolivegreen"></i>{{ data.schedulerReturn.expressions}}
                                </span>
                            </template>
                        </Column>

                        <Column field="dataAtualizacaoLog" header="Última Integração" style="width:13rem;">
                            <template #body="{ data }">
                                <span>
                                    <i v-if="data.dataAtualizacaoLog" class="pi pi-calendar mr-2" style="color:darkolivegreen"></i>
                                    {{ formatDateCustom(data.dataAtualizacaoLog, 'DD/MM/YYYY HH:mm:ss') }}
                                </span>
                            </template>
                        </Column>

                        <Column field="totalRegistrosLog" header="Registros" style="width:5rem;"/>

                        <Column field="situacao" header="Situação" style="width:5rem;">
                            <template #body="{ data }">
                                <span :class="'product-badge status-' + corSituacao(data.situacao)">
                                    {{ data.situacao == 'ATIVO' ? 'Ativo' : 'Inativo' }}
                                </span>
                            </template>
                        </Column>  
                        
                        <Column header="Ações" style="width:12rem;">
                            <template #body="{ data }">
                                <Button label="Refresh" 
                                    :disabled="data.situacao != 'ATIVO'"
                                    class="p-button p-component p-button-info m-2"
                                    icon="pi pi-refresh" title="Refresh Scheduler"
                                    @click="resetSchedule(data.schedulerSend)">                                    
                                </Button>
                            </template>
                        </Column>
                    </DataTable>
                </div>
        </div>
    </div>
    
</template>

<script>
    import IntegracaoService from '../../service/IntegracaoService'
    import Formatacao from '../../utilities/Formatacao';

    export default {
        name: 'Monitor de Integração',
        components: {},
        data() {
            return {
                content: [],
                carregando: false,
                funcionalidade:{}
            }
        },

        mounted() {
            this.carregarDados();
        },

        methods: {
            
            carregarDados() {
                this.carregando = true;

                IntegracaoService.getFuncionalidadesPainelMonitoramento()
                    .then(({ data }) => {
                        if(data) {
                            this.content = data;
                            this.carregando = false;
                        }
                    })
                    .catch(error => {
                        this.content = [];
                        this.carregando = false;
                    })
            },
            resetSchedule(timerScheduler){
                IntegracaoService.resetSchedule(timerScheduler)
                .then(response => {
                    this.$toast.add({
                        severity:'success', 
                        detail:'Integração reiniciada com sucesso.', 
                        life: 5000
                    });
                })
                .catch(error => {
                    this.$toast.add(TratamentoDeError(error))
                });
            },

            formatDateCustom(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },
            corMetodo(value){
                if(value == 'PUT'){
                    return 'instock';
                }else
                if(value == 'POST'){
                    return 'instock';
                }else
                if(value == 'DELETE'){
                    return 'outofstock';
                }else
                if(value == 'GET'){
                    return 'lowstock';
                }
            },
            corSituacao(value){
                if(value == 'ATIVO'){
                    return 'instock';
                }else
                if(value == 'INATIVO'){
                    return 'outofstock';
                }
            }
        }
    }

</script>

<style scoped lang="scss">
    @import '../../assets/demo/styles/badges.scss';
    .fontUpper{
        text-transform: uppercase;
    }
</style>
