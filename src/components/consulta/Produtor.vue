<template>
    <div class="card w-full">
        <Toast />
        <div class="flex align-items-center">
            <i class="pi pi-user" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;"> Produtor</h3>
        </div>
        <hr />
        <div class="w-full">
            <DataTable 
                showGridlines 
                responsiveLayout="scroll" 
                scrollDirection="both" 
                selectionMode="single" 
                v-model:selection="produtorSelecionado"
                :value="produtores" 
                :scrollable="true" 
                @sort="sort($event)" 

            >
                <template #header>
                    <div class="grid justify-content-Left align-items-center">
                        <div class="col-12 xl:col-1">
                            <label for="codigo"><strong>Código:</strong></label>
                            <InputText id="codigo" class="w-full mt-2" v-model="filtros.codProdutor"
                                @keyup.enter="filtrar()" />
                        </div>

                        <div class="col-12 xl:col-2">
                            <label for="cpf"><strong>CPF/CNPJ:</strong></label>
                            <InputText id="cpf" class="w-full mt-2" v-model="filtros.cpfProdutor"
                                @keyup.enter="filtrar()" />
                        </div>

                        <div class="col-12 xl:col-4">
                            <label for="nome"><strong>Nome:</strong></label>
                            <InputText id="nome" class="w-full mt-2" v-model="filtros.nomeProdutor"
                                @keyup.enter="filtrar()" />
                        </div>
                        
                        <div class="mt-4">
                            <Button 
                            type="button" 
                            label="Filtrar" 
                            class="p-button-outlined ml-1" 
                            icon="pi pi-filter"
                            style="padding: 0.4rem;" 
                            @click="filtrar()" />
                        
                            <Button type="button" 
                            label="Limpar Filtro" 
                            class="p-button-info ml-1"
                            icon="pi pi-filter"
                            style="padding: 0.4rem;" 
                            @click="limparfiltro()" />
                        
                            <Button v-if="filtros.status == 'ATIVO'"
                            type="button"
                            icon="pi pi-ban"
                            label="Listar inativos"
                            class="p-button-outlined p-button-danger ml-1"
                            style="padding: 0.4rem;"
                            @click="filtros.status = 'INATIVO'; 
                            filtrar()"/>
                        
                            <Button v-if="filtros.status == 'INATIVO'" 
                            type="button"
                            icon="pi pi-check-circle"
                            label="Listar ativos"
                            class="p-button-outlined ml-1"
                            style="padding: 0.4rem; "
                            @click="filtros.status = 'ATIVO'; 
                            filtrar()"/>
                        </div>

                    </div>
                </template>

                <template #empty>
                    Nenhum registro encontrado.
                </template>

                <template #loading>
                    Carregando... Por favor, aguarde.
                </template>

                <Column field="codProdutor" header="Código" style="width:6rem;" frozen sortable/>
                <Column field="nome" header="Nome" style="width:20rem;" frozen sortable />
                <Column field="cpfCnpj" header="CPF/CNPJ" style="width:10rem" />
                <Column field="natureza" header="Natureza" style="width:10rem;" />
                <Column field="tipoProdutor" header="Tipo Prod." style="width:10rem;" />
                <Column field="emiteNota" header="Emite Nota" style="width:5rem;">
                    <template #body="{ data }">
                        {{ data.emiteNota ? 'Sim' : 'Não' }}
                    </template>
                </Column>
                <Column field="codRegional" header="Regional" style="width:5rem;" />
                <Column field="codRepres" header="Cod Repres." style="width:5rem;" />
                <Column field="bloqueado" header="Bloqueado" style="width:6rem;">
                    <template #body="{ data }">
                        {{ data.bloqueado ? 'Sim' : 'Não' }}
                    </template>
                </Column>
                <Column field="codTransp" header="Cod. Transp." style="width:7rem;" />
                <Column field="nomeTransp" header="Nome Transp." style="width:7rem;" />
                <Column field="participanteBayer" header="Part. Bayer" style="width:7rem;">
                    <template #body="{ data }">
                        {{ data.participanteBayer ? 'Sim' : 'Não' }}
                    </template>
                </Column>
                <Column field="produtorDap" header="Part. Dap" style="width:7rem;">
                    <template #body="{ data }">
                        {{ data.produtorDap ? 'Sim' : 'Não' }}
                    </template>
                </Column>
                <Column field="endereco" header="Endereço" style="width:30rem;" />
                <Column field="bairro" header="Bairro" style="width:10rem;" />
                <Column field="cidade" header="Cidade" style="width:10rem;" />
                <Column field="estado" header="UF" style="width:10rem;" />
                <Column field="estadoCivil" header="Est. Civil" style="width:10rem;" />
                <Column field="nacionalidade" header="Nacionalidade" style="width:10rem;" />
                <Column field="rgIe" header="Rg/Ie" style="width:10rem;" />
                <Column field="nomeAbreviado" header="Nome Abreviado" style="width:10rem;" />
                <Column field="telefone" header="Telefone" style="width:10rem;" />
                <Column field="email" header="Email" style="width:22rem;" />
                <Column field="tipoRetencao" header="Tipo Ret." style="width:5rem;" />
                <Column field="classificacaoFinanceira" header="Class. Finan." style="width:5rem;" />
                <Column field="dataNascimento" header="Data Nascimento" style="width:7rem;">
                    <template #body="{ data }">
                        {{ formatDate(data.dataNascimento, 'DD/MM/YYYY') }}
                    </template>
                </Column>
                <Column field="numPessoaFisica" header="N. Pessoa Fisica" style="width:10rem;" />
                <Column field="sexo" header="Sexo" style="width:5rem;" />
                <Column field="dataDemissao" header="Data Demissao" style="width:7rem;">
                    <template #body="{ data }">
                        {{ formatDate(data.dataDemissao, 'DD/MM/YYYY') }}
                    </template>
                </Column>
                <Column field="ativo" header="Ativo" style="width:5rem;">
                    <template #body="{ data }">
                        {{ data.ativo ? 'Sim' : 'Não' }}
                    </template>
                </Column>                
                <Column field="cooperativa" header="Cooperativa" style="width:10rem;">
                    <template #body="{ data }">
                        {{ data.cooperativa ? 'Sim' : 'Não' }}
                    </template>
                </Column>                
                <Column header="Data Integração" style="width:11rem;">
                    <template #body="{ data }">
                        {{ data.dataIntegracao != null && data.dataIntegracao != 'undefined' ?
                            formatDate(data.dataIntegracao, 'DD/MM/YYYY HH:mm') : '' }}
                    </template>
                </Column>
                <Column header="Ações" style="width:5.5rem;" alignFrozen="right" frozen>
                    <template #body="{ data }">
                        <div class="flex-none">
                            <Button v-if="data.ativo" icon="pi pi-home" class="p-button-rounded p-button-success mr-2 mb-2" title="Visualizar Imóveis" @click="getImoveis(data)" />
                            <Button v-if="data.ativo" icon="pi pi-ban" class="p-button-rounded p-button-danger flex-none mr-2 mb-2" title="Inativar" @click="confirmarAtivarOuInativar(data)" />
                            <Button v-if="!data.ativo" icon="pi pi-check-circle" class="p-button-rounded p-success flex-none mr-2 mb-2" title="Ativar" @click="confirmarAtivarOuInativar(data)" />                            
                        </div>
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="ativarOuInativarDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
                <div class="flex align-items-center justify-content-center">
                    <span>Deseja <strong>{{ produtor.ativo ? 'Inativar' : 'ativar' }}</strong> o produtor <strong>{{ produtor.nome }}</strong>?</span>
                </div>
                <template #footer>
                    <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarOuInativarDialog = false" />
                    <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()" />
                </template>
            </Dialog>

            <Dialog maximizable modal header="IMÓVEIS VINCULADOS" v-model:visible="dialogImoveis" :style="{ width: '60%' }" closable>
                <span><strong>PRODUTOR: {{ descricaoProdutor }}</strong></span>
                <hr />
                <DataTable showGridlines 
                        selectionMode="single" 
                        responsiveLayout="stack" :value="imoveis" 
                        v-model:selection="imovelSelecionado">
                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column field="imovel.matricula" header="Matricula" sortable />
                    <Column field="imovel.nome" header="Imóvel" sortable />
                    <Column field="imovel.endereco" header="Endereço" sortable />
                    <Column field="imovel.cidade" header="Cidade" sortable />
                    <Column field="imovel.estado" header="Estado" sortable />
                    <Column field="cadpro" header="CadPro" sortable />
                    <Column field="cpfCnpj" header="CPF/CNPJ" sortable />
                </DataTable>
            </Dialog>

            <Paginator v-model:first="firstRow" :rows="qtdRegistro" :totalRecords="totalRegistro"
                :rowsPerPageOptions="[5, 10, 20, 30]" @page="onPage">
            </Paginator>
        </div>
    </div>
</template>

<script>
import ProdutorService from '../../service/ProdutorService';
import Formatacao from '../../utilities/Formatacao';
import ProdutorFiltro from "../../components/cadastro/ProdutorFiltro.vue";
import Paginator from 'primevue/paginator';
import StorageService from '../../service/StorageService';
import ImovelService from "../../service/ImoveisService";

export default {
    name: 'Produtor',
    components: { ProdutorFiltro, Paginator },
    data() {
        return {
            totalRegistro: 0,
            qtdRegistro: 10,
            pagina: 0,
            firstRow: 0,
            sortField: 'codProdutor',
            produtores: [],
            filtros: {codProdutor:null, cpfProdutor:null, nomeProdutor:null, status:'ATIVO'},
            storange: StorageService.getControlePagina("PRODUTOR"),
            imoveis: {},
            dialogImoveis: false,
            descricaoProdutor: null,
            produtorSelecionado:{},
            imovelSelecionado:{},
            ativarOuInativarDialog: false,
            produtor: null,
        }
    },

    created() {
        this.pagina = this.storange.numero;
        this.firstRow = this.storange.firstRow;
        this.qtdRegistro = this.storange.qtdRegistro;
        this.filtros = this.storange.default ? this.getFiltrosPadrao() : this.storange.filtros;
        this.carregarProdutores();
    },

    methods: {
        getFiltrosPadrao(){ 
            return {codProdutor:null, cpfProdutor:null, nomeProdutor:null, status:'ATIVO'};
        },

        carregarProdutores() {
            ProdutorService.pesquisarProdutorComPaginacao(this.pagina, this.qtdRegistro, this.sortField, this.filtros)
                .then(({ data }) => {
                    if (data) {
                        this.produtores = data.content;
                        this.qtdRegistro = data.pageable.pageSize;
                        this.totalRegistro = data.totalPages * this.qtdRegistro;
                        StorageService.setControlePagina("PRODUTOR", this.pagina, this.firstRow, this.qtdRegistro, this.filtros);
                    }
                })
                .catch(error => {
                    this.produtores = {};
                    console.log(error);
                }
                );
        },

        onPage(event) {
            this.pagina = event.page + 1;
            this.firstRow = event.page * event.rows;
            this.qtdRegistro = event.rows;
            this.carregarProdutores();
        },

        formatDate(data, format) {
            return Formatacao.formatDateCustom(data, format);
        },

        filtrar() {
            this.pagina = 1;
            this.firstRow = 0;
            this.carregarProdutores();
        },

        limparfiltro() {
            this.pagina = 1;
            this.firstRow = 0;
            this.qtdRegistro = 10;
            this.totalRegistro= 0,
            this.filtros = this.getFiltrosPadrao();
            this.carregarProdutores();
        },

        getImoveis(produtorData) {
            let pagina = 1;
            let qtdRegistro = 100;
            this.descricaoProdutor = produtorData.codProdutor +' - '+ produtorData.nome;
            ImovelService.getImovelProdutorPage(produtorData.codProdutor, pagina, qtdRegistro)
                .then(({ data }) => {
                    if (data) {
                        this.dialogImoveis = true;
                        this.imoveis = data.content;
                    }
                })
                .catch(error => {
                    this.$toast.add({
                        severity: 'warn',
                        summary: 'Imóvel não encontrado',
                        detail: 'Produtor não possui imoveis vinculados',
                        life: 10000
                    });
                });
        },

        sort(event){
            this.sortField = event.sortField;
            if (event.sortOrder < 0) this.sortField = this.sortField + ',desc';
            this.filtrar();
        },

        confirmarAtivarOuInativar(produtor) {
            this.produtor = produtor;
            this.ativarOuInativarDialog = true;
        },

        ativarOuInativar() {
            if(this.produtor.ativo) {
                ProdutorService.inativar(this.produtor.id)
                    .then(response => {
                        this.$toast.add({
                            severity:'success',
                            detail:`O produtor ${ this.produtor.nome } foi inativado com sucesso!`, 
                            life: 3000
                        });

                        this.carregarProdutores();
                        this.ativarOuInativarDialog = false;
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'warn',
                            detail:`Falha ao inativar o produtor ${ this.produtor.nome }!`, 
                            life: 3000
                        });
                    });
            }
            else {
                ProdutorService.ativar(this.produtor.id)
                    .then(response => {
                        this.$toast.add({
                            severity:'success',
                            detail:`O produtor ${ this.produtor.nome } foi ativado com sucesso!`, 
                            life: 3000
                        });

                        this.carregarProdutores();
                        this.ativarOuInativarDialog = false;
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'warn',
                            detail:`Falha ao ativar o produtor ${ this.produtor.nome }!`, 
                            life: 3000
                        });
                    });
            }
        },
    }
}
</script>