<template>
    <Dialog
        v-model:visible="visivel"
        :style="{width: '350px'}"
        :modal="true"
        @hide="$emit('fechar')"
    >
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-unlock mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Alterar senha</h3>
            </div>
        </template>
        <div class="grid">
            <div class="col-12">
                <label><strong>Senha atual<span class="ml-1" style="color:red;">*</span></strong></label>
                <InputText type="password"
                    v-model="alterarSenha.senhaAntiga"
                    class="w-full mt-2"
                    :class="{'p-invalid': senhaAtualIsInvalid}"
                    @change="senhaAtualIsInvalid = false"
                ></InputText>
            </div>
            <div class="col-12 mt-2">
                <label><strong>Nova senha<span class="ml-1" style="color:red;">*</span></strong></label>
                <InputText type="password"
                    v-model="alterarSenha.senhaNova"
                    class="w-full mt-2"
                    :class="{'p-invalid': novaSenhaIsInvalid}"
                    @change="novaSenhaIsInvalid = false"
                ></InputText>
            </div>
            <div class="col-12 mt-2">
                <label><strong>Confirmar nova senha<span class="ml-1" style="color:red;">*</span></strong></label>
                <InputText type="password"
                    v-model="confirmarNovaSenha"
                    class="w-full mt-2"
                    :class="{'p-invalid': confirmarNovaSenhaIsInvalid}"
                    @click ="confirmarNovaSenhaIsInvalid = false"
                ></InputText>
            </div>
        </div>
        <template #footer>
            <Button label="Alterar" icon="pi pi-save" @click="salvar()" class="p-button p-component p-button-info" autofocus />
            <Button label="Cancelar" icon="pi pi-times" @click="$emit('fechar')" class="p-button p-component p-button-danger"/>
        </template>
    </Dialog>
</template>

<script>
    import UsuarioService from '../../service/UsuarioService';
    import TratamentoDeError from '../../utilities/TratamentoDeError';

    export default {
        emits: ['fechar'],
        props: {
            visivel: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                alterarSenha: {},
                confirmarNovaSenha: null,

                senhaAtualIsInvalid: false,
                novaSenhaIsInvalid: false,
                confirmarNovaSenhaIsInvalid: false
            }
        },
        methods: {
            validarCampos() {
                let isValid = true;
                const toast = {
                    severity:'warn', 
                    summary: 'Alerta', 
                    detail:'Alguns campos obrigatórios não estão preenchidos!', 
                    life: 3000
                }

                if(!this.alterarSenha.senhaAntiga) {
                    this.senhaAtualIsInvalid = true;
                    isValid = false;
                }

                if(!this.alterarSenha.senhaNova) {
                    this.novaSenhaIsInvalid = true;
                    isValid = false;
                }

                if(!this.confirmarNovaSenha) {
                    this.confirmarNovaSenhaIsInvalid = true;
                    isValid = false;
                }
                else if(this.alterarSenha.senhaNova !== this.confirmarNovaSenha) {
                    toast.detail = `A senha informada no campo "Confirmar nova senha" está diferente do campo "Nova senha".`
                    this.confirmarNovaSenhaIsInvalid = true;
                    isValid = false;
                }

                if(!isValid) {
                    this.$toast.add(toast);
                }

                return isValid;
            },

            salvar() {
                console.log(JSON.stringify(this.alterarSenha))
                if(!this.validarCampos()) return;

                UsuarioService.alterarSenha(this.alterarSenha)
                    .then(({ data }) => {
                        this.$toast.add({
                            severity:'success', 
                            summary: 'Senha alterada com sucesso!',
                            life: 3000
                        });
                        
                        this.alterarSenha = {};
                        this.confirmarNovaSenha = null;
                        this.$emit('fechar');
                    })
                    .catch(error => {
                        const msgToast = TratamentoDeError(error);
                        msgToast.severity = "warn"
                        this.$toast.add(msgToast);
                    });
            }
        }
    }
</script>