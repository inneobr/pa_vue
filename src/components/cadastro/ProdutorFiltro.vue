<template>
    <div class="field">
        <label for="produtor">
            <strong>
                Produtor<span v-if="campoObrigatorio" style="color:red;">&nbsp;*</span>
            </strong>
        </label>
        
        <div class="flex">
            <span class="p-input-icon-right mr-1" style="width: 30%;">
                <i class="pi pi-search" @click="abrirFiltroAvancado()" v-if="!disabled" />
                <InputText 
                    :disabled="disabled" 
                    :class="{ 'p-invalid': invalid }"
                    class="w-full"
                    placeholder="Código"
                    v-model="selecionado.codProdutor"
                    @keyup.enter="selecionar"
                    @change="selecionar"
                />
            </span>

            <InputText 
                :disabled="true"
                :class="{ 'p-invalid': invalid }"
                style="width: 70%;"
                v-model="selecionado.nome"
                placeholder="Nome"
            />
        </div>
    </div>

    <Dialog modal header="Buscar produtor" v-model:visible="filtroAvancado"  :style="{width: '50%'}"><hr />

        <DataTable 
            @sort="sort($event)"
            showGridlines
            selectionMode="single"
            responsiveLayout="stack"
            :value="paginacao.content"
            v-model:selection="produtor"
            @row-select="selecionar">

            <template #header>
                <div class="grid">
                    <div class="col-12 lg:col-2">
                        <div class="field">
                            <label for="codigo"><strong>Código</strong></label>
                            <InputText id="codigo" class="w-full" v-model="filtros.codProdutor" @keyup.enter="pesquisar" />
                        </div>
                    </div>

                    <div class="col-12 lg:col-2">
                        <div class="field">
                            <label for="cpf"><strong>CPF</strong></label>
                            <InputText id="cpf" class="w-full" v-model="filtros.cpfCnpj" @keyup.enter="pesquisar" />
                        </div>
                    </div>

                    <div class="col-12 lg:col-4">
                        <div class="field">
                            <label for="nome"><strong>Nome</strong></label>
                            <InputText id="nome" class="w-full" v-model="filtros.nome" @keyup.enter="pesquisar" />
                        </div>
                    </div>

                    <div class="col-12 lg:col-2 mt-4">
                        <Button  type="button" 
                            label="Filtrar" 
                            class="p-button-outlined w-full"
                            icon="pi pi-filter" 
                            style="padding: 0.4rem;"
                            @click="pesquisar"/>
                    </div>

                    <div class="col-12 lg:col-2 mt-4">
                        <Button  type="button" 
                            label="Limpar Filtro" 
                            class="p-button-info w-full"
                            icon="pi pi-filter" 
                            style="padding: 0.4rem;"
                            @click="limparFiltro"/>
                    </div>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="codProdutor" header="Cód. Produtor" style="padding-top: 10px; padding-bottom: 10px;" sortable/>   
            <Column field="cpfCnpj" header="CPF/CNPJ" sortable/> 
            <Column field="nome" header="Nome" sortable/> 
            <Column field="natureza" header="Natureza" sortable/> 
        </DataTable>

        <Paginator
            :rows="filtros.size"
            :totalRecords="totalRegistro"
            :rowsPerPageOptions="[1, 5, 10]"
            @page="onPage"/>
    </Dialog>
</template>

<script>
    export default {
        emits: ["pesquisar", "selecionado"],
        props: {
            campoObrigatorio: {
                type: Boolean,
                required: false
            },
            selecionado: {
                type: Object,
                required: true
            },
            paginacao: {
                type: Object,
                required: true
            },
            disabled: {
                type: Boolean,
                required: false
            },
            invalid: {
                type: Boolean,
                required: false
            }
        },

        data() {
            return {
                filtros: {},
                totalRegistro: 0,
                filtroAvancado: false,
                produtor: null
            }
        },

        updated() {
            if(!!this.paginacao.pageable && !!this.paginacao.totalPages) {
                const qtdRegistros = this.paginacao.pageable.pageSize;
                this.totalRegistro = this.paginacao.totalPages * qtdRegistros;
            }
        },

        methods: {
            pesquisar() {
                this.$emit("pesquisar", this.filtros);
            },

            selecionar() {
                const codProdutor = !!this.produtor ? this.produtor.codProdutor : this.selecionado.codProdutor;
                let produtor = null;

                if(!!this.produtor) {
                    produtor = Object.assign({}, this.produtor);
                }
                
                this.$emit('selecionado', codProdutor, produtor);
                this.fecharFiltroAvancado();
            },

            abrirFiltroAvancado() {
                this.filtros = {};
                this.filtros["size"] = 10;
                this.filtros["page"] = 1;
                this.filtros["sort"] = 'codProdutor,asc';
                
                this.pesquisar();

                this.filtroAvancado = true;
            },

            fecharFiltroAvancado() {
                this.produtor = null;
                this.filtroAvancado = false;
            },

            limparFiltro() {
                this.filtros["codProdutor"] = undefined;
                this.filtros["cpfCnpj"] = undefined;
                this.filtros["nome"] = undefined;
            },

            onPage(event) {
                this.filtros["page"] = event.page + 1;
                this.filtros["size"] = event.rows;
                this.pesquisar();
            },

            sort(event) {
                const sortField = event.sortField;
                const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
                this.filtros["sort"] = `${ sortField },${sortOrder}`;
                this.pesquisar();
            }
        }
    }
</script>