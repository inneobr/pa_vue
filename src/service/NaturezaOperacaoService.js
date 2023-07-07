import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class NaturezaOperacaoService {
    getNaturezasFiltro(pagina, qtdRegistro, sort, filtro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/natureza-operacao/filtrar`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                filter: filtro
            }
        });
    }

    getNaturezaPorid(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/natureza-operacao/${ id }`);
    }

    getHistoricoPorNatureza(codGrupo, pagina, qtdRegistro, sort) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/natureza-operacao/historico-natureza/${ codGrupo }`, {
            params: {
                sort: sort,
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    getEstabelecimentosPorNatureza(natureza, page, size, sort) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/natureza-operacao/${ natureza }/estabelecimentos`, {
            params: {
                page: page,
                size: size,
                sort: sort
            }
        });
    }

    salvar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/natureza-operacao/genesis/cadastrar`, data, config);
    }

    atualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/natureza-operacao/genesis/atualizar`, data, config);
    }

    deletar(id) {                               
        return axios.delete(`${ ApiUrl.portal_url }api/pa/v1/natureza-operacao/deletar/${ id }`);
    }
}

export default new NaturezaOperacaoService();