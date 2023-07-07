<template>
    <div class="card">

        <Toast />

        <div class="col-12 grid align-items-center">
           <i class="pi pi-building" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;"> Estabelecimentos</h3>    
        </div>     

        <hr />
        
        <DataTable 
            :value="estabelecimentos"
            responsiveLayout="stack"
            selectionMode="single"
            @sort="sort($event)"
            v-model:selection="estabelecimentoSelecionado" >

            <template #header>
                <div class="col-12 grid justify-content-between">
                    <div class="grid">
                        <Button v-if="integration.visible" type="button" label="Cadastrar" class="p-button-info mr-2" icon="pi pi-plus" @click="cadastrar()" />
                        <Button type="button" icon="pi pi-filter-slash" label="Limpar filtro" class="p-button-outlined mr-2" @click="limparFiltro()"/>
                        <Button
                            v-if="situacao == 'ATIVO'"
                            type="button"
                            icon="pi pi-ban"
                            label="Listar inativos"
                            class="p-button-outlined p-button-danger mr-2"
                            style="padding: 0.4rem;"
                            @click="situacao = 'INATIVO'; inativo = false ;carregarEstabelecimentos()"
                        ></Button>

                        <Button
                            v-if="situacao == 'INATIVO'"
                            type="button"
                            icon="pi pi-check-circle"
                            label="Listar ativos"
                            class="p-button-outlined mr-2"
                            style="padding: 0.4rem;"
                            @click="situacao = 'ATIVO'; inativo = true; carregarEstabelecimentos()"
                        ></Button>
                    </div>

                    <span class="p-input-icon-right">
                        <i class="pi pi-search" />
                        <InputText v-model="filtro" placeholder="Pesquisar" @change="carregarEstabelecimentos()" />
                    </span>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <Column field="codigo" header="Cód." style="width:8rem;" sortable />
            <Column field="codigoRegional" header="Cód. Regional" sortable/>
            <Column field="nomeFantasia" header="Nome Fantasia" sortable/>
            <Column field="cnpj" header="CNPJ" />
            <Column field="cnpj" header="Inscrição"/>
            <Column field="telefone" header="Telefone" />
            <Column field="cidade" header="Cidade"/>
            <Column field="estado" header="Estado"/>
            <Column field="email" header="Email" />
            <Column field="dataIntegracao" header="Integração">
                <template #body="{ data }">
                    {{ formatDate(data.dataIntegracao, 'DD/MM/YYYY HH:mm:SS') }} 
                </template>
            </Column>
            <Column header="Ações" style="width:8rem;">
                <template #body="{ data }">
                    <div class="flex-none">
                        <Button v-if="integration.visible && inativo" icon="pi pi-pencil" class="p-button-rounded p-button-info flex-none mr-2 mb-2" @click="editar(data.id)" />
                        <Button v-if="!integration.visible" icon="pi pi-eye" class="p-button-rounded p-button-outlined flex-none mr-2 mb-2" @click="editar(data.id)" />
                        <Button v-if="!data.ativo && integration.visible" icon="pi pi-ban" class="p-button-rounded p-button-danger flex-none mr-2 mb-2" title="Ativar" @click="confirmarAtivarOuInativar(data)" />
                        <Button v-if="data.ativo && integration.visible" icon="pi pi-check-circle" class="p-button-rounded p-button-info flex-none mr-2 mb-2" title="Inativar" @click="confirmarAtivarOuInativar(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <Paginator
            v-model:first="firstRow"
            :rows="qtdRegistro"
            :total-records="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage" />
    </div>

    <Dialog v-model:visible="ativarOuInativarDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <span>Deseja <strong>{{ estabelecimento.ativo ? 'Inativar' : 'ativar' }}</strong> o estabelecimento <strong>{{ estabelecimento.nomeFantasia }}</strong>?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarOuInativarDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()" />
        </template>
    </Dialog>


</template>

<script>
    
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import IntegracaoService from '../../service/IntegracaoService'
    import StorageService from '../../service/StorageService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        name: 'Estabelecimentos',

        props: {
			codigo: {
				type: String,
				required: true
			}
		},

        data() {
            return {
                pagina: 0,
                qtdRegistro: 10,
                totalRegistro: 0,
                firstRow:0,

                estabelecimentos: [],
                estabelecimento:{},
                situacao: 'ATIVO',
                ordenar: 'codigo',
                carregando:false,
                inativo: true,
                next : 0,
                filtro: null,
                integration: {},
                estabelecimentoSelecionado:{},
                ativarOuInativarDialog: false,
                filterOrdenar: [
                    'codigoRegional', 'nomeFantasia','email','telefone','cnpj', 'cidade', 'estado', 'codigo'
                ],
                storange: StorageService.getControlePagina("ESTABELECIMENTO"),

            }
        },
        created() {
            this.pagina = this.storange.numero;
            this.firstRow = this.storange.firstRow;
            this.qtdRegistro = this.storange.qtdRegistro;
        },
        mounted() {
            //verifica se o filtro está vazio
            if(this.storange.default == undefined){
                this.filtro = this.storange.filtros;
            }
            this.carregarEstabelecimentos();
            this.getIntegrationOptons();
        },
        methods: {  
            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.estabelecimentos = [];
                this.carregarEstabelecimentos();   
            },

            getIntegrationOptons(){
                const paginaAtual = "ESTABELECIMENTO";
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
            carregarEstabelecimentos() {
                StorageService.setControlePagina("ESTABELECIMENTO", this.pagina, this.firstRow, this.qtdRegistro, this.filtro);
                this.carregando = true;
                EstabelecimentoService.getEstabelecimentos(
                    this.pagina,
                    this.qtdRegistro,
                    this.ordenar, 
                    this.filtro,
                    this.situacao,
                )
                    .then(({ data }) => {
                        if(data) {
                            this.estabelecimentos = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalElements;
                            this.carregando = false;
                        }
                    })
                    .catch(error => {
                        this.estabelecimentos = [];
                        this.carregando = false;
                    });
            },

            onPage(event) {
                this.pagina = event.page + 1;
                this.firstRow = event.rows * event.page;
                this.qtdRegistro = event.rows;                     
                StorageService.setControlePagina("ESTABELECIMENTO", this.pagina, this.firstRow, event.rows);
                this.carregarEstabelecimentos();
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.ordenar = `${ sortField },${sortOrder}`;
                this.estabelecimentos = [];
                this.carregarEstabelecimentos();
            },

            cadastrar() {
                this.$router.push(`/estabelecimento/cadastrar`);
            },

            editar(estabelecimentoId) {                
                this.$router.push(`/estabelecimento/editar/${estabelecimentoId}`);
            },

            limparFiltro() {
                this.filtro = null;
                this.carregarEstabelecimentos();
            },

            confirmarAtivarOuInativar(estabelecimento) {
                
                console.log('!Estabelecimento: ', estabelecimento);

                this.estabelecimento = estabelecimento;
                this.ativarOuInativarDialog = true;
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            ativarOuInativar() {
                if(this.estabelecimento.ativo) {
                    EstabelecimentoService.inativar(this.estabelecimento.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O estabelecimento ${ this.estabelecimento.nomeFantasia } foi inativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregarEstabelecimentos();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao inativar o estabelecimento ${ this.estabelecimento.nomeFantasia }!`, 
                                life: 3000
                            });
                        });
                }
                else {
                    EstabelecimentoService.ativar(this.estabelecimento.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`O estabelecimento ${ this.estabelecimento.nomeFantasia } foi ativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregarEstabelecimentos();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao ativar o estabelecimento ${ this.estabelecimento.nomeFantasia }!`, 
                                life: 3000
                            });
                        });
                }
            },
        }
    }
</script>