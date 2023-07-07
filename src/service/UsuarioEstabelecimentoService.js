import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class UsuarioEstabelecimentoService {
    cadastrar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/parametro/estabelecimentos`, data, config);

    }


    copiarParametros(idOrigem, idDestino) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametro/estabelecimentos/copiar-parametros/${idOrigem}/${idDestino}`);      
    }

    getParametros(id, pagina, qtdRegistro) { 
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametro/estabelecimentos/todos/${id}`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    getParametrosFilter(pagina, qtdRegistro, sort, filtros = {}) { 
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametro/estabelecimentos/filtar`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                usuario: filtros.usuario,
                estabelecimento: filtros.estabelecimento,
                situacao: filtros.situacao,
            }
        });
    }

    getHistoricoParametros(id, pagina, qtdRegistro) { 
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametro/estabelecimentos/${id}/historico`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    updateParametros(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/parametro/estabelecimentos`, data, config );

        
    }

    deletarParametro(id) {
        return axios.delete(`${ ApiUrl.portal_url }api/pa/v1/parametro/estabelecimentos/${id}`);
    }

    deletarTodosParametroUsuario(username) {
        return axios.delete(`${ ApiUrl.portal_url }api/pa/v1/parametro/estabelecimentos/delete-all/${username}`);
    }

    getEstabelecimentoDisponiveisPorIdUsuario(idUsuario) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametro/estabelecimentos/${ idUsuario }/estabelecimentos-disponiveis`);
    }

    buscarPorUsuarioAutenticadoECodigoEstabelecimento(codigoEstabelecimento) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametro/estabelecimentos/buscar-por/usuario-autenticado/codigo-estabelecimento/${ codigoEstabelecimento }`);
    }
}

export default new UsuarioEstabelecimentoService();