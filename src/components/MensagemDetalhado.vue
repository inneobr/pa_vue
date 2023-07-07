<template>
    <div class="card">
        <div class="flex align-items-center">           
            <Button label="Voltar" icon="pi pi-backward" @click="voltar()"></Button>
        </div>

        <h5 style="text-align: center;">{{ mensagem.assunto }}</h5>

        <hr />

        <div class="flex align-items-center">
            <i class="pi pi-envelope mr-2 flex-none" style="font-size: 2rem"></i>
            <div class="flex-grow-1">
                <p>
                    De: {{ mensagem.cooperadoDe?.nome || 'Mensagem automática' }}
                    <br />
                    Para: Você
                </p>
            </div>
            <div class="flex-none">
                <p>
                    {{ formatarData(mensagem.dataCadastro, 'DD/MM/YYYY HH:mm') }}
                </p>
            </div>
        </div>

        <hr />

        <div style="margin:20px 10px; text-align: justify">
            {{ mensagem.mensagem || '' }}
        </div>
    </div>
</template>

<script>
    import Formatacao from '../utilities/Formatacao';

    export default {
        props: {
            mensagemId: {
                type: Number,
                required: true
            }
        },

        data() {
            return {
                atualMensagemId: null,
                mensagem: {}
            }
        },

        created() {
            this.carregarMensagem();
        },

        updated() {
            this.carregarMensagem();
        },
        
        methods: {
            carregarMensagem() {
                if(this.atualMensagemId !== this.mensagemId) {
                    this.atualMensagemId = this.mensagemId;
                }
            },

            formatarData(data, formato) {
                return Formatacao.formatDateCustom(data, formato);
            },

            voltar() {
                this.$router.push(`/mensagens`);
            }
        }
    }
</script>
