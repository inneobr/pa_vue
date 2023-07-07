<template>
    <div class="card">
        <h5>Mensagens</h5>

        <div class="grid align-items-end">
            <div class="field col-6 md:col-2">
                <label for="data-inicial">Data inicial</label>
                <Calendar class="w-full" id="data-inicial" v-model="dataInicio" autocomplete="off" :maxDate="dataFim" dateFormat="dd/mm/yy" />
            </div>
            <div class="field col-6 md:col-2">
                <label for="data-final">Data final</label>
                <Calendar class="w-full" id="data-final" v-model="dataFim" autocomplete="off" :minDate="dataInicio" dateFormat="dd/mm/yy" />
            </div>
            <div class="field col-12 md:col-2">
                <Button class="w-full" label="Consultar" icon="pi pi-search" @click="carregarMensagens"></Button>
            </div>
        </div>

        <hr />

        <DataTable :value="mensagens" responsiveLayout="scroll">
            
            <template #empty>
                Nenhum registro encontrado.
            </template>
            
            <template #loading>
                Carregando... Por favor, aguarde.
            </template>

            <Column style="width:10rem;">
                <template #body="{ data }">
                    <Button label="Visualizar" icon="pi pi-eye" @click="visualizar(data.id)"></Button>
                </template>
            </Column>

            <Column header="De" style="width:20rem;">
                <template #body="{ data }">
                    {{ data.cooperadoDe || 'Mensagem automática' }}
                </template>
            </Column>

            <Column field="assunto" header="Assunto"></Column>

            <Column header="Recebido(a)" style="width:10rem;">
                <template #body="{ data }">
                    {{ formatarData(data.dataCadastro, 'DD/MM/YYYY HH:mm') }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
    import Formatacao from '../utilities/Formatacao';

    export default {
        props: {
            matricula: {
                type: Number,
                required: true
            }
        },

        data() {
            return {
                dataInicio: Formatacao.subtrairMeses(new Date(), 12),
                dataFim: new Date(),
                mensagens: []
            }
        },

        created() {
            this.carregarMensagens();
        },
        
        methods: {
            carregarMensagens() {
                const dataInicio = Formatacao.formatDateCustom(this.dataInicio, "DD-MM-YYYY");
                const dataFim = Formatacao.formatDateCustom(this.dataFim, "DD-MM-YYYY");
            },

            formatarData(data, formato) {
                return Formatacao.formatDateCustom(data, formato);
            },

            visualizar(mensagemId) {
                this.$router.push(`/mensagem/${mensagemId}`);
            }
        }
    }
</script>
