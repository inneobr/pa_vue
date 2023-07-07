import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class ParametroEstabelecimentoService {
    getParametroPages(pagina, qtdRegistro, filtros, situacao, sort = "estabelecimento.codigo,asc") {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros-estabelecimento`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                filter: filtros,
                situacao: situacao
            }
        });
    }

    getParametrosPorid(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros-estabelecimento/${ id }`);
    }

    buscarPorCodigoEstabelecimento(codigoEstabelecimento) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros-estabelecimento/buscar-por/codigo-estabelecimento/${ codigoEstabelecimento }`);
    }

    updateParametros(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/parametros-estabelecimento`, data, config);
    }

    salvarParametros(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/parametros-estabelecimento`, data, config);
    }

    getHitorico(codigo, pagina, qtdRegistro){
        
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/historico/parametros-estabelecimento/${ codigo }`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: "dataCadastro,desc"
            }
        });
    }

    inativar(parametroId) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/parametros-estabelecimento/inativar/${ parametroId }`);
    }
    
    ativar(parametroId) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/parametros-estabelecimento/ativar/${ parametroId }`);
    }

    getDataMovimentoAberto(codigoEstabelecimento) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros-estabelecimento/data-movimento-aberto/buscar-por/codigo-estabelecimento/${ codigoEstabelecimento }`);
    }
}

export default new ParametroEstabelecimentoService();