import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class PerfilService {
    getPerfis() {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/perfil`);
    }

    getPerfisPaginado(pagina, qtdRegistro, sort, tipoFiltro, filtro, situacao) {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/perfil/busca-paginada`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                tipoFiltro: tipoFiltro,
                buscar: filtro,
                situacao: situacao
            }
        });
    }

    getUsuariosPorPerfil(pagina, qtdRegistro, idPerfil) {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/perfil/${ idPerfil }/usuarios-vinculados`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    getMenuItensPorPerfil(pagina, qtdRegistro, idPerfil) {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/perfil/${ idPerfil }/menu-itens-vinculados`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    getPerfil(perfilId) {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/perfil/id/${perfilId}`);
    }


    postPerfil(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.autenticacao }agricola/auth/v1/perfil`, data, config);
    }

    putPerfil(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.put(`${ ApiUrl.autenticacao }agricola/auth/v1/perfil`, data, config);
    }

    ativar(perfilId) {
        return axios.put(`${ ApiUrl.autenticacao }agricola/auth/v1/perfil/ativar/${ perfilId }`);
    }

    inativar(perfilId) {
        return axios.put(`${ ApiUrl.autenticacao }agricola/auth/v1/perfil/inativar/${ perfilId }`);
    }
}
export default new PerfilService();