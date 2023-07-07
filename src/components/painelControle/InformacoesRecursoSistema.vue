<template>
    <div class="card">

        <Toast />

        <div class="flex align-items-center">
           <i class="pi-info-circle pi" style="font-size: 1.4rem"></i>
            <h3 style="margin:0px 5px;"> Informação de Recursos do Sistema</h3>            
        </div>      

        <hr />
        
        <DataTable 
            responsiveLayout="scroll"
            v-model:filters="filtro"
            :value="informacoesRecursoSistema"
            :globalFilterFields="['global', 'pagina','area','tituloModal','dataAtualizacao','ativo']" >

            <template #header>
                <div class="flex justify-content-between">
                    <div class="flex">
                        <Button type="button" label="Cadastrar" class="p-button-info mr-1" icon="pi pi-plus" @click="cadastrar()" />
                        <Button type="button" icon="pi pi-filter-slash" label="Limpar filtro" class="p-button-outlined" @click="limparFiltro()"/>
                    </div>

                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filtro['global'].value" placeholder="Pesquisar" />
                    </span>
                </div>
            </template>

            <template #empty>
                Nenhum registro encontrado.
            </template>

            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column field="pagina" header="Página" style="width:15rem;" />
            <Column field="area" header="Área" style="width:10rem;" />
            <Column field="tituloModal" header="Título Modal" />
            <Column field="dataAtualizacao" header="Atualização" style="width:7rem;">
                <template #body="{ data }">
                    {{ formatDate(data.dataAtualizacao, 'DD/MM/YYYY') }}
                </template>
            </Column>
            <Column field="ativo" header="Situação" style="width:8rem;" alignFrozen="right" frozen>
                <template #body="{ data }">
                    {{ data.ativo ? 'Ativo' : 'Inativo' }}
                </template>
            </Column>
            <Column header="&nbsp;" style="width:8rem;">
                <template #body="{ data }">
                    <div class="flex-none">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning flex-none mr-2" title="Editar" @click="editar(data.id)" />

                        <Button v-if="data.ativo" icon="pi pi-check-circle" class="p-button-rounded p-button-info flex-none" title="Inativar" @click="confirmarAtivarOuInativar(data)" />
                        <Button v-if="!data.ativo" icon="pi pi-ban" class="p-button-rounded p-button-danger flex-none" title="Ativar" @click="confirmarAtivarOuInativar(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <Paginator
            :rows="qtdRegistro"
            :totalRecords="totalRegistro"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="onPage">
        </Paginator>
    </div>

    <Dialog v-model:visible="ativarOuInativarDialog" :style="{width: '300px'}" header="Alerta" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <span>Deseja <strong>{{ infoRecursoSistema.ativo ? 'inativar' : 'ativar' }}</strong> a informação de recurso do sistema?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="ativarOuInativarDialog = false" />
            <Button label="Sim" icon="pi pi-check" class="p-button-text p-button-danger" @click="ativarOuInativar()" />
        </template>
    </Dialog>

</template>

<script>
    import { FilterMatchMode } from 'primevue/api';
    import InformacoesRecursoSistemaService from '../../service/InformacoesRecursoSistemaService';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        name: 'InformacoesRecursoSistema',

        props: {
			id: {
				type: String,
				required: true
			}
		},

        data() {
            return {
                informacoesRecursoSistema: [],
                pagina: 0,
                qtdRegistro: 10,
                totalRegistro: 0,

                filtro: null,

                infoRecursoSistema: {},
                ativarOuInativarDialog: false
            }
        },

        created() {
            this.limparFiltro();
        },

        mounted() {
            this.carregarInformacoesRecursoSistema();
        },

        methods: {            
        
            carregarInformacoesRecursoSistema() {
                InformacoesRecursoSistemaService.getInformacoesRecursoSistema(
                    this.pagina,
                    this.qtdRegistro
                )
                    .then(({ data }) => {
                        if(data) {
                            this.informacoesRecursoSistema = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                        }
                    });
            },

            onPage(event) {
                this.pagina = event.page;
                this.qtdRegistro = event.rows;
                this.carregarInformacoesRecursoSistema();
            },

            cadastrar() {
                this.$router.push(`/info-recurso-sistema/cadastrar`);
            },

            editar(id) {
                this.$router.push(`/info-recurso-sistema/editar/${id}`);
            },

            limparFiltro() {
                this.filtro = {
                    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                    'pagina': {value: null, matchMode: FilterMatchMode.CONTAINS},
                    'area': {value: null, matchMode: FilterMatchMode.CONTAINS},
                    'tituloModal': {value: null, matchMode: FilterMatchMode.CONTAINS},
                    'dataAtualizacao': {value: null, matchMode: FilterMatchMode.CONTAINS},
                    'ativo': {value: null, matchMode: FilterMatchMode.CONTAINS}
                }
            },

            confirmarAtivarOuInativar(infoRecursoSistema) {
                this.infoRecursoSistema = infoRecursoSistema;
                this.ativarOuInativarDialog = true;
            },

            ativarOuInativar() {
                if(this.infoRecursoSistema.ativo) {
                    InformacoesRecursoSistemaService.inativar(this.infoRecursoSistema.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`A informação recurso sistema foi inativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregarInformacoesRecursoSistema();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao inativar a informação de recurso de sistema!`, 
                                life: 3000
                            });
                        });
                }
                else {
                    InformacoesRecursoSistemaService.ativar(this.infoRecursoSistema.id)
                        .then(response => {
                            this.$toast.add({
                                severity:'success',
                                detail:`A informação de recurso do sistema foi ativado com sucesso!`, 
                                life: 3000
                            });

                            this.carregarInformacoesRecursoSistema();
                            this.ativarOuInativarDialog = false;
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail:`Falha ao inativar a informação de recurso de sistema!`, 
                                life: 3000
                            });
                        });
                }
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },


        }
    }
</script>