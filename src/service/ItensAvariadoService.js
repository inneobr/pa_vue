import axios from "axios";
import ApiUrl from '../config/ApiUrl';
import { config } from "dotenv";

class ItensAvariadoService {

    sincronizar(id){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/item-avariado/sincronizar/${id}`);
    }

    salvar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/item-avariado`, data, config);
    }

    atualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/item-avariado`, data, config);
    }

    getItensAvariadoDetalhes(id){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/item-avariado/${id}`);
    }

    getItensAvariado(pagina, qtdRegistro, sort, filtros) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/item-avariado`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                grupoProduto: filtros.grupoProduto,
                estabelecimento: filtros.estabelecimento,
                situacao: "ATIVO"
            }
        });
    }

    getStabelecimentosVinculados(id, pagina, qtdRegistro, sort){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/item-avariado/estabelecimentos/${id}`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort
            }
        });
    }

    deletar(id) {
        return axios.delete(`${ ApiUrl.portal_url }api/pa/v1/item-avariado/deletar/${ id }`);
    }

    getHistorico(id, pagina, qtdRegistro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/item-avariado/${id}/historico`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    getGrupoProduto(dados){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/item-avariado/grupo/${dados}`);
    }

    buscarPorGrupoProdutoEstabelecimento(codigoGrupoProduto, codigoEstabelecimento, params = {}) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/item-avariado/buscar-por/grupo-produto/${ codigoGrupoProduto }/estabelecimento/${ codigoEstabelecimento }`, {
            params
        });
    }
}

export default new ItensAvariadoService();