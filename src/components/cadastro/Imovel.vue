<template>
    <div class="card w-full">
        <Toast />
        <div class="flex align-items-center">
           <i class="pi pi-home" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;"> Imóveis</h3>
        </div>
        <hr />
        <div class="w-full">
            <div class="grid col-12">      
                <div class="col-12 xl:col-8">
                    <ImovelFiltro  @filtrar="getFiltroImoveis" :method="retornarFiltro"/>
                </div>
            </div>

            <DataTable 
                showGridlines
                selectionMode="single"
                responsiveLayout="stack"
                :value="options.imoveis"
                v-model:selection="imovelSelecionado" > 

                <template #empty>
                    Nenhum registro encontrado.
                </template>

                <template #loading>
                    Carregando... Por favor, aguarde.
                </template>

                <Column field="matricula" header="Matricula" sortable/> 
                <Column field="nome" header="Imóvel" sortable/>
                <Column field="cidade" header="Cidade"/> 
                <Column field="endereco" header="Endereço"/> 
                <Column field="bloqueado" header="Bloqueado">
                    <template #body="{ data }">
                        {{ data.bloqueado ? 'Sim' : 'Não' }}
                    </template>
                </Column>
                <Column field="dataIntegracao" header="Integrado">
                    <template #body="{ data }">
                        {{ formatDate(data.dataIntegracao, 'DD/MM/YYYY HH:mm:SS') }} 
                    </template>
                </Column>    
                
                <Column header="Ações">
                    <template #body="{ data }">
                        <Button class="p-button-rounded p-button-success flex-none mr-3" icon="pi pi-users" title="Visualizar Produtores" @click="getProdutores(data)"/>
                        <Button class="p-button-rounded p-button-info flex-none mr-3" icon="pi pi-eye" title="Visualizar Imóvel" @click="visualizar(data)"/>
                        <Button v-if="!data.ativo && integration.visible" icon="pi pi-ban" class="p-button-rounded p-button-danger flex-none mr-3" title="Ativar" @click="ativarOuInativar(data)" />
                        <Button v-if="data.ativo && integration.visible" icon="pi pi-check-circle" class="p-button-rounded p-button-info flex-none mr-3" title="Inativar" @click="ativarOuInativar(data)" />
                    </template>
                </Column>                
            </DataTable>

            <Dialog modal  header="PRODUTORES VINCULADOS" v-model:visible="dialogProdutor" :style="{width: '50%'}" closable>
                <span><strong>ESTABELECIMENTO: {{ matriculaNome }}</strong></span><hr />
                <DataTable 
                    showGridlines
                    selectionMode="single"
                    responsiveLayout="stack"
                    :value="options.produtores">                    

                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="codProdutor" header="Cód. Produtor" style="padding-top: 10px; padding-bottom: 10px;"/> 
                    <Column field="nome" header="Nome"/>          
                    <Column field="cpfCnpj" header="Cpf/Cnpj"/>
                    <Column field="cadpro" header="Cad.Pro"/>
                    <Column field="baixado" header="Baixado por Venda">
                        <template #body="{ data }">
                            {{ data.baixado ? 'Sim' : 'Não' }}
                        </template>
                    </Column>
                    <Column field="ativo" header="Ativo">
                        <template #body="{ data }">
                            {{ data.ativo ? 'Sim' : 'Não' }}
                        </template>
                    </Column>
                </DataTable>
            </Dialog>

            <Dialog modal header="IMÓVEL" v-model:visible="dialogImovel" :style="{width: '50%'}"><hr />
                
                <div class="col-12 grid">
                    <div class="col-2">
                        <label for="matricula"><strong>Matrícula:</strong></label>
                        <InputText id="nome" class="w-full mt-2" v-model="imovel.matricula" :disabled="true"/>
                    </div>

                    <div class="col-10">
                        <label for="nome"><strong>Nome:</strong></label>
                        <InputText id="nome" class="w-full mt-2" v-model="imovel.nome" :disabled="true"/>
                    </div>

                    <div class="col-8">
                        <label for="endereco"><strong>Endereço:</strong></label>
                        <InputText id="endereco" class="w-full mt-2" v-model="imovel.endereco" :disabled="true"/>
                    </div>

                    <div class="col-4">
                        <label for="bairro"><strong>Bairro:</strong></label>
                        <InputText id="bairro" class="w-full mt-2" v-model="imovel.bairro" :disabled="true"/>
                    </div>
                    
                    <div class="col-3">
                        <label for="cep"><strong>Cep:</strong></label>
                        <InputText id="cep" class="w-full mt-2" v-model="imovel.cep" :disabled="true"/>
                    </div>

                    <div class="col-5">
                        <label for="cidade"><strong>Cidade:</strong></label>
                        <InputText id="cidade" class="w-full mt-2" v-model="imovel.cidade" :disabled="true"/>
                    </div>

                    <div class="col-4">
                        <label for="estado"><strong>Estado:</strong></label>
                        <InputText id="estado" class="w-full mt-2" v-model="imovel.estado" :disabled="true"/>
                    </div>

                    <div class="col-12">
                        <label for="descricao"><strong>Descrição:</strong></label>
                        <Textarea id="descricao" class="w-full mt-2" v-model="imovel.descricao" rows="5" cols="30" maxlength="1000" :disabled="true"/>
                    </div>
                </div>
            </Dialog>
            </div>
            
            <Paginator
                v-model:first="firstRow"
                :rows="qtdRegistro"
                :total-records="totalRegistro"
                :rowsPerPageOptions="[5, 10, 20, 30]"
                @page="onPage" />
        </div>
</template>

<script>
    import ImovelFiltro from "../../components/cadastro/ImovelFiltro.vue";
    import StorageService from '../../service/StorageService';
    import ImovelService from "../../service/ImoveisService";
    import Formatacao from '../../utilities/Formatacao';
    import Paginator from 'primevue/paginator';

    const FiltrosPadrao = {codProdutor:null, status:'ATIVO', matriculaNome:null};

    export default {
        name: 'Imoveis',
        components: { ImovelFiltro, Paginator },
        data() {
            return { 
                pagina: 0,
                firstRow: 0,
                totalRegistro: 0,
                qtdRegistro: 10,  

                filtros: FiltrosPadrao,
                options: {},
                imovel: {},
                matriculaNome: null,
                dialogProdutor: false,
                dialogImovel: false,
                integration: {},
                ordenar: null,    
                imovelSelecionado: {},
                storange: StorageService.getControlePagina("IMOVEL"),
            }
        },

        created(){
            //verifica se o filtro está vazio
            if(this.storange.default == undefined){
                this.filtros = this.storange.filtros;
            }
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;            
            
            this.getFiltroImoveis(this.filtros);
        },
        
        methods: {
            getIntegrationOptons(){
                const paginaAtual = "IMOVEL";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                        }
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'info', 
                            summary: 'PARÂMETROS DE PÁGINA NÂO DEFINIDOS', 
                            detail:'Você deve cadastrar os parâmetros para esta página no menu lateral em: Painel de Integrações.',
                            life: 10000
                        });
                    });
            }, 

            getFiltroImoveis(filtros = FiltrosPadrao, iconePageUm = false){ 
                this.filtros = filtros;
                if (iconePageUm) {this.pagina = 1; this.firstRow = 0;}
                ImovelService.getProdutorImoveisFilter(this.pagina, this.qtdRegistro, this.ordenar, this.filtros)
                    .then(({ data }) => {
                        if(data) {
                            this.options.imoveis = data.content;                            
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalElements;
                            StorageService.setControlePaginaFilter("IMOVEL", this.pagina, this.firstRow, this.qtdRegistro, this.filtros);
                        }
                    })
            },

            getProdutores(data){
                this.matriculaNome = data.matriculaNome;
                ImovelService.getProdutorImovel(data.matricula)
                    .then(({ data }) => {
                        if(data) {
                            this.dialogProdutor = true;
                            this.options.produtores = data;
                        }
                    }) 
                    .catch(error => {
                        this.$toast.add({
                                severity:'warn', 
                                summary: 'Produtor não encontrado', 
                                detail:'Imóvel não possui produtores vinculados',
                                life: 10000
                            });
                    });              
            },

            ativarOuInativar(data){
                if(data.ativo) {
                    ImovelService.inativarImovel(data.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O imóvel foi inativado com sucesso!`, 
                                life: 3000
                            });
                            this.getFiltroImoveis(this.filtros);
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao inativar o imovel :` + data.nome, 
                                life: 3000
                            });
                        });
                }
                else {
                    ImovelService.ativarImovel(data.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O estabelecimento foi ativado com sucesso!`, 
                                life: 3000
                            });
                            this.getFiltroImoveis(this.filtros);
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao ativar o estabelecimento: ` + data.nome, 
                                life: 3000
                            });
                        });
                }
            },

            visualizar(data){
                this.dialogImovel = true;
                this.imovel =  data;
            },
           
            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.filtrar();   
            }, 
            
            onPage(event) {          
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;                     
                this.getFiltroImoveis(this.filtros);
            },

            retornarFiltro(){
                return this.storange.filtros;
            },
        }
}
</script>