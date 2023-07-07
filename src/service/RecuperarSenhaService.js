import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class RecuperarSenhaService {

    recuperarSenha(username) {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/recuperar-senha/${username}`);
    }

    buscarUsuarioPorToken(token) {
         return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/recuperar-senha/token/${token}`);
    }

    alterarSenha(senha) {
         return axios.put(`${ ApiUrl.autenticacao }agricola/auth/v1/recuperar-senha/`, senha);
    }
}

export default new RecuperarSenhaService();
