<template>
    <Dialog v-model:visible="visivelProp"
            :style="{width: '350px'}"
            :modal="true"
            @hide="$emit('fechar')">

        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-unlock mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Recuperar Senha</h3>
            </div>
        </template>
        <div class="grid">
            <div class="col-12">
                <label><strong>Usuário<span class="ml-1" style="color:red;">*</span></strong></label>
                <InputText type="text" 
                    class="w-full mt-2" 
                    v-model="username" />
            </div>
        </div>
        <template #footer>
            <Button label="Cancelar" 
                    @click="fecharModal()" 
                    icon="pi pi-times" 
                    class="p-button-text"/>

            <Button label="Enviar" 
                    icon="pi pi-check" 
                    class="p-button-text p-button-danger" 
                    :disabled="doubleClick"
                    @click="recuperarSenha()" />
        </template>
    </Dialog>
</template>

<script>
    import RecuperarSenhaService from '../../service/RecuperarSenhaService';

    export default {
        emits: ['fechar'],
        props: {
            visivelProp: {
                type: Boolean,
                required: true
            }
        },

        data() {
            return {
                username: null,
                usernameInvalida: false,
                doubleClick: false,
            }
        },

        methods: {
            recuperarSenha() {
                if (!this.validarCampos() && !this.doubleClick) return;
                this.doubleClick = false;

                RecuperarSenhaService.recuperarSenha(this.username)
                        .then(response => {
                            this.abrirToast('success', 
                                'Sucesso', 
                                `E-mail enviado com sucesso para ${response.data}`, 
                                9000);

                            setTimeout(() => {
                                this.fecharModal();
                            }, "1000");

                            this.username = null;
                        })
                        .catch(erro => {
                            this.doubleClick =false;
                            this.abrirToast('error', 
                                'Falha ao solicitar recuperar senha.', 
                                erro.response.data, 
                                9000);
                        });
            },

            validarCampos() {
                let isValid = true;

                if (!this.username) {
                    this.usernameInvalida = true;
                    isValid = false;
                }

                if (!isValid) {
                    this.abrirToast('error', 
                            'Falha', 
                            'Preencher os campos obrigatórios.', 
                            3000);
                    return;
                }

                return isValid;
            },

            abrirToast(tipo, titulo, descricao, tempo) {
                this.$toast.add({
                    severity: tipo, 
                    summary: titulo, 
                    detail: descricao, 
                    life: tempo
                });
            },

            fecharModal() {
                return this.$emit('fechar');
            },
        }
    }
</script>
