import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class NaturezaTributariaService {
    
    saveNaturezaTributaria(naturezaTributaria) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/natureza-tributaria`, naturezaTributaria, config);
    }

    getNaturezatributariaFiltro(pagina, qtdRegistro, sort, filter = {}) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/natureza-tributaria`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                pesquisar: filter.pesquisar
            }
        });
    }

    getNaturezatributariaId(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/natureza-tributaria/${id}`);
    }

    deleteNaturezaPorid(idNatureza) {
        return axios.delete(`${ ApiUrl.portal_url }api/pa/v1/natureza-tributaria/delete/${ idNatureza }`);
    }

    getHistorico(pagina, qtdRegistro, id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/natureza-tributaria/historico/${ id }`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    getEstabelecimentosByNatureza(pagina, qtdRegistro, id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/natureza-tributaria/estabelecimentos/${ id }`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    getGrupoProdutosByNatureza(pagina, qtdRegistro, id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/natureza-tributaria/gruposProduto/${ id }`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }
    
}

export default new NaturezaTributariaService();