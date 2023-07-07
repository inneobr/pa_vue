<template>
    <Dialog
        v-model:visible="visivel"
        :breakpoints="{'960px': '75vw', '640px': '90vw'}"
        :style="{width: '70vw'}"
        :maximizable="true"
        :modal="true"
        @show="carregar()"
        @hide="$emit('fechar')"
    >
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-info-circle" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Help Informações</h3>
            </div>
        </template>
        <ul class="informacao">
            <li>
                <h5>{{tituloModal}}</h5>
                <div class="informacao-conteudo">
                    <span v-html="conteudo"></span>
                </div>
            </li>
        </ul>
        <template #footer style="border: 1px solid #0000;">
            <Button label="Fechar" @click="$emit('fechar')"></Button>
        </template>
    </Dialog>
</template>

<script>
    import InformacoesRecursoSistema from '../../src/service/InformacoesRecursoSistemaService';
    export default {
        emits: ['fechar'],
        props: {
            visivel: {
                type: Boolean,
                required: true
            },
            paginaArea: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                tituloModal: null,
                conteudo: null
            }
        },
        methods: {
            carregar() {
                InformacoesRecursoSistema.getInformacoesRecursoSistemaByPaginaArea(this.paginaArea)
                    .then(({ data }) => {
                        if(data) {                            
                            this.tituloModal = data.tituloModal;
                            this.conteudo = data.conteudo;
                        }
                    })
                    .catch(error => {
                        this.tituloModal=null;
                        this.conteudo=null;
                    });
            }
        }
    }
</script>

<style>
    .informacao {
        list-style: none;
        padding: 5px 0;
        margin: 0;
    }

    .informacao li {
        border-bottom: 1px solid #CCC;
        padding: 5px 0;
    }

    .informacao h5 {
        color: rgb(38 66 93);
        margin: 0 0 5px 0;
        padding: 0;
    }

    .informacao-conteudo {
        text-align: justify;
    }
</style>
