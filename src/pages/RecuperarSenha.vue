<template>
    <Toast />
	<div class="pages-body login-page flex flex-column">

        <div class="align-self-center mt-auto mb-auto">
            <div class="pages-panel card flex flex-column" style="min-width: 420px;">
                <div class="pages-header px-3 py-1">
                    <div class="grid col-12">
                        <div class="col-12">
                            <!-- <img src="layout/images/login/logo_portal_branca_login.png" alt=""> -->
                            <img src="layout/images/logo-genesis-branca.png" alt="" style="height: 4.5rem">
                        </div>
                    </div>
                </div>

                <h4>Recuperar Senha</h4>

                <div class="pages-detail mb-6 px-6">
                    Bem-vindo.
                    <br />Preencha os campos abaixo para recuperar a senha:
                </div>

                <Form @submit="handleSenha" :validation-schema="schema">
                    <div class="input-panel flex flex-column px-3">
                        <div class="dv-login">

                            <div class="p-inputgroup mt-3">
                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-lock"></i>
                                </span>
                                <span class="p-float-label">
                                    <Field name="senha" class="p-inputtext p-component" type="password" placeholder="Nova Senha"/>
                                    <ErrorMessage name="senha" class="error-feedback alert-danger" />
                                </span>
                            </div>

                            <div class="p-inputgroup mt-3">
                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-lock"></i>
                                </span>
                                <span class="p-float-label">
                                    <Field name="confirmarSenha" class="p-inputtext p-component" type="password" placeholder="Confirmar Senha"/>
                                    <ErrorMessage name="confirmarSenha" class="error-feedback alert-danger" />
                                </span>
                            </div>

                            <button class="p-button p-component mt-6" :disabled="loading">
                                <i class="pi pi-sign-in" style="margin-right: 10px;"/>
                                <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                                <span>SALVAR</span>
                            </button>
                            <div class="form-group">
                                <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    </div>

</template>

<script>
    import { Form, Field, ErrorMessage } from "vee-validate";
    import * as yup from "yup";
    import RecuperarSenhaService from "../service/RecuperarSenhaService";

    export default {
        name: "RecuperarSenha",
        components: {
            Form,
            Field,
            ErrorMessage,
        },
        data() {
            const schema = yup.object().shape({
                senha: yup.string().required("Campo obrigatório!"),
                confirmarSenha: yup.string().required("Campo obrigatório!"),
            });

            return {
                loading: false,
                message: "",
                schema,
                token: this.$route.query.token,
                nomeCooperado: null,
                recuperarSenha: {},
                username: null,
            };
        },
        created() {
            this.buscarUsuario();
        },
        methods: {
            buscarUsuario() {
                console.log('Iniciou o método buscarUsuario()');

                console.log('token: ', this.token);

                if (this.token) {
                    RecuperarSenhaService.buscarUsuarioPorToken(this.token)
                        .then(({ data }) => {
                            if (data) {
                                this.nomeCooperado = data.nome;
                                this.username = data.username;
                            }
                        })
                        .catch(error => {
                            this.abrirToast('error', 'Erro', error.response.data, 5000);
                            
                            setTimeout(() => { this.$router.push(`/login`); }, "5000");
                        });
                }
            },

            handleSenha(user) {
                this.loading = true;
                if (!this.compararSenhaEConfirmarSenha(user)){
                    this.loading = false;
                    return;
                } 

                this.recuperarSenha = {
                    username: this.username,
                    token: this.token,
                    senha: user.senha,
                }

                RecuperarSenhaService.alterarSenha(this.recuperarSenha)
                    .then(response => {
                        this.abrirToast('success', 
                                'Sucesso', 
                                'Senha alterada com sucesso', 
                                3000);

                        setTimeout(() => {
                            this.$router.push(`/login`);
                        }, "1000");
                    })
                    .catch(error => {
                        this.abrirToast('error', 
                                'Falha ao alterar senha', 
                                error.response.data, 
                                3000);
                    });
            },

            compararSenhaEConfirmarSenha(user) {
                let isValid = true;
                
                if (user) {
                    if (user.senha && user.confirmarSenha && user.senha != user.confirmarSenha) {
                        this.abrirToast('error',
                                'Falha', 
                                `Senha e Confirmar Senha estão diferente!`, 
                                3000);
                        
                        isValid = false;

                        return isValid;
                    }
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
        },
    };
</script>

<style scoped>
.label a{
    color: rgba(70,130,180) !important;
}
span {  
  font-weight: bold;
}
.login-card{
  background: rgb(76, 146, 83) !important;
   box-shadow: -5px 5px 0 rgb(0, 0, 0, 0.6);
  -webkit-transition : box-shadow ease-out 0.8s;
  transition : box-shadow ease-out 0.8s;
  padding: 15px;
  border-radius: 10px;
  align-items: center; 
}

.dv-login{
  border: solid 1px #cecece;
  background-color: #fbfbfb !important;
  padding: 15px;
  border-radius: 10px;
  align-items: center; 
  margin-bottom: 10px !important;
}

.login-banner{
  border: solid 1px rgb(76,144,190) !important;
  border-radius: 10px 10px 0px 0px;
  background: rgb(76,144,190);
  padding: 10px 5px 0px 0px;
  text-align: center;
  color: #fff;
  font-size: 15px;
 
}
.login-content{
  border-radius: 0px 0px 10px 10px;
  background: #fff;

}
.profile-img-card {
  display: block;
  margin: 35px auto;  
}

.p-button{
  display: block;
  margin: 0 auto;
  width: 100%;
  border: none !important;
  background: rgb(2,136,209) !important;
  color: #FFF !important;
  box-shadow: 1px 3px 6px #666;
}
.p-button:hover {
  background: rgb(81, 170, 248) !important;
  color: #000 !important;
}

.p-button:focus-visible {
  /* remove default focus style */
  outline: none;
  /* custom focus styles */
  box-shadow: 0 0 2px 2px #5f5f5f;
  color: rgb(6, 43, 255);
}

.alert-danger{
  color: rgb(250, 6, 6);
  font-weight: bold;
  margin-top: 15px !important;
  margin-bottom: 10px !important;
}

.pages-body.login-page .pages-panel .pages-header {
    border: none;
    background: rgb(2,136,209) !important;
    box-shadow: 1px 3px 6px #666;
    max-width: 400px !important;
}

.dv-cadastro {
  background: hsl(53deg 100% 61% /77%);  
  text-align: left;
}

.dv-resgate-senha{
  text-align: right;
}

.dv-resgate-senha a {
    cursor: pointer;
}


.dv-site{
  text-align: right;
}
.dv-unidade{
  text-align: right;
}

.dv-cadastro a{
  color: #000;
  font-weight: 800;
}

.pages-body .pages-panel {
    opacity: 0.9 !important;
    max-width: 500px !important;
}

.img-app-download{
  width: 130px !important;
}
.dv-google{
  text-align: right !important;
}

.dv-app-store{
  text-align: left !important;
}
   
</style>
