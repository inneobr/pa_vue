import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class SafraCompostaService {

    getSafrasCompostasComPaginacao(pagina, qtdRegistro, sort, situacao, filtro) {
        const anoBase = new Date().getFullYear();
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/safra/composta/com-paginacao/${ situacao }/${ anoBase }`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                nomeSafra: filtro.nomeSafra,
                idEstabelecimento: filtro.idEstabelecimento
            }
        });
    }

    cadastrar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/parametros/safra/composta`, data, config);
    }

    atualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/parametros/safra/composta`, data, config);
    }

    estabelecimentosSemVinculo(tipoSafra, idTipoProduto) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/safra/composta/estabelecimentos-ativos-sem-vinculos/${ tipoSafra }/${ idTipoProduto }`);
    }

    getSafraCompostaPorId(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/safra/composta/${ id }`);
    }

    getEstabelecimentosPorIdSafraComposta(idSafraComposta, pagina, qtdRegistro)  {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/safra/composta/${ idSafraComposta }/estabelecimentos`, {
            params: {
                page: pagina,
                size: qtdRegistro,       
            }
        });
    }

    ativar(item) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/parametros/safra/composta/ativar/${ item }`);
    }

    inativar(item) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/parametros/safra/composta/inativar/${ item }`);
    }

    sincronizarComERP(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/safra/composta/sincronizar/${id}`);
    }

    verificarToleranciaRecebimentoSemente(codigoEstabelecimento, safra, codigoGrupoProduto, numeroOrdemCampo, numeroLaudo) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        const data = {
            codEstabelecimento: codigoEstabelecimento,
            grupoProduto: codigoGrupoProduto,
            safra,
            numeroOrdemCampo,
            numeroLaudo
        }

        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/semente/classe/verificarToleranciaRecebimentoSemente`, data, config);
    }


}

export default new SafraCompostaService();