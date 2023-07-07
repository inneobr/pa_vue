import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class UsuarioService {
    getUsuarioPorUsername(username) {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/usuario/username/${ username }`);
    }

    getUsuarios() {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/usuario`);
    }

    getCodUsuario(dados) {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/usuario/${ dados }`);
    }

    getUsuarioPaginadoFiltro(pagina, qtdRegistro, sort, filter) {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/usuario/filtro/descricao`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                pesquisar: filter.perquisar,
                situacao: filter.situacao 
            }
        });
    }

    cadastrar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.post(`${ ApiUrl.autenticacao }agricola/auth/v1/usuario`, data, config);
    }

    atualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.autenticacao }agricola/auth/v1/usuario`, data, config);
    }

    ativar(usuarioId) {
        return axios.put(`${ ApiUrl.autenticacao }agricola/auth/v1/usuario/ativar/${ usuarioId }`);
    }

    inativar(usuarioId) {
        return axios.put(`${ ApiUrl.autenticacao }agricola/auth/v1/usuario/inativar/${ usuarioId }`);
    }

    getUsuariosPorPerfilId(perfilId) {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/usuario/perfil/id/${ perfilId }`);
    }

    getPerfisPoridUsuario(pagina, qtdRegistro, idUsuario) {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/usuario/${ idUsuario }/perfis`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    resetarSenha(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.autenticacao }agricola/auth/v1/usuario/resetar-senha`, data, config);
    }

    alterarSenha(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.autenticacao }agricola/auth/v1/usuario/alterar-senha`, data, config);
    }    
}

export default new UsuarioService();