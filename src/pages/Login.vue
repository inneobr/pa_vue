<template>
  <Toast />
	<div class="pages-body login-page flex flex-column">

    <div class="align-self-center mt-auto mb-auto">
        <div class="pages-panel card flex flex-column">
            <div class="pages-header px-4 py-1">
              <div class="grid col-12">
                <div class="col-12">
                  <img src="layout/images/logo-genesis-branca.png" alt="" style="height: 4.5rem">
                </div>
              </div>
            </div>


            <h4>Bem vindo.</h4>

            <div class="pages-detail mb-3 px-6">Informe seus dados de usuário para acessar o portal.</div>

            <Form @submit="handleLogin" :validation-schema="schema">

                <div class="input-panel flex flex-column px-3">

                    <div class="dv-login">

                      <div class="p-inputgroup">
                          <span class="p-inputgroup-addon">
                              <i class="pi pi-user"></i>
                          </span>
                          <span class="p-float-label">
                              <Field name="username" class="p-inputtext p-component" placeholder="Usuário"/>
                              <ErrorMessage name="username" class="error-feedback alert-danger" />
                          </span>
                      </div>

                      <div class="p-inputgroup mt-3">
                          <span class="p-inputgroup-addon">
                              <i class="pi pi-lock"></i>
                          </span>
                          <span class="p-float-label">
                              <Field name="password" class="p-inputtext p-component" type="password" placeholder="Senha"/>
                              <ErrorMessage name="password" class="error-feedback alert-danger" />
                          </span>
                      </div>

                      <div class="p-inputgroup mt-1">
                        <div class="col-3">
                          <span v-if="nodeEnv == 'development'" style="color: #e91e63;">{{ambiente}}</span>
                          <span v-if="nodeEnv == 'staging'" style="color: #2196f3;">{{ambiente}}</span>
                        </div>
                        <div class="col-9 dv-resgate-senha">
                            <a @click="abrirRecuperarSenhaModal">Esqueceu a senha?</a>
                        </div>
                      </div>

                      <button class="p-button p-component mt-4" :disabled="loading">
                          <i class="pi pi-sign-in" style="margin-right: 10px;"/>
                          <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                          <span>ENTRAR</span>
                      </button>
                      <div class="form-group">
                      <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>
                      </div> 

                    </div>

                    <div class="grid">
                      <div class="col-6">
                        <div class="col-12 dv-google">
                          <!--<a href="#">
                            <img src="layout/images/login/google_play_download.png" alt="" class="img-app-download"/>
                          </a>-->
                        </div>
                      </div>

                      <div class="col-6">
                        <div class="col-12 dv-app-store">
                          <!--<a href="#">
                            <img src="layout/images/login/app_store_download.png" alt="" class="img-app-download"/>
                          </a>-->  
                        </div>
                      </div>
                    </div>
                </div>
            </Form>
        </div>
    </div>
</div>
<RecuperarSenhaModal :visivelProp="mostrarRecuperarSenhaModal" @fechar="fecharModalRecuperarSenha" />

</template>

<script>

import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import RecuperarSenhaModal from '../components/admin/RecuperarSenhaModal.vue';

export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
    RecuperarSenhaModal
},
  data() {
    
    const schema = yup.object().shape({
      username: yup.string().required("Campo obrigatório!"),
      password: yup.string().required("Campo obrigatório!"),
    });

    return {
      loading: false,
      message: "",
      schema,
      nodeEnv: process.env.NODE_ENV,
      ambiente: process.env.VUE_APP_AMBIENTE,
      mostrarRecuperarSenhaModal: false,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/login");
    }
  },
  methods: {
    handleLogin(user) {
      this.loading = true;

      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/");
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

            if(this.message == 'Request failed with status code 401'){
              this.message = "Usuário ou senha inválida."
            }
        }
      );
    },
    erroEstabelecimento(error) {
      this.message = error;
    },
    
    abrirRecuperarSenhaModal() {
      this.mostrarRecuperarSenhaModal = true;
    },

    fecharModalRecuperarSenha() {
        this.mostrarRecuperarSenhaModal = false;
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

<style>
.estabelecimento .p-button {
  background: rgb(2,136,209) !important;
  color: #FFF !important;
}

.estabelecimento .p-button:hover {
  background: rgb(81, 170, 248) !important;
  color: #000 !important;
}
</style>
