import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class TaxasProducaoService {

    getTaxasProducaoDetalhes(id){
        //console.log('Entrou no método getTaxasProducaoDetalhes do service');
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/taxa/${ id }`);
    }

    getTaxasProducao(pagina, qtdRegistro, filtros, sort, situacao) {
        if(filtros.safra != undefined && typeof filtros.safra == "string" && filtros.safra.toUpperCase() == "TODAS"){
            filtros.safra = undefined;
        }

        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/taxa`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                descricao: filtros.descricao,
                idGrupoProduto: filtros.idGrupoProduto,
                idEstabelecimento: filtros.idEstabelecimento,
                safra:filtros.safra,
                situacao: situacao,
            }
        });
    }

    ativar(item) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/parametros/taxa/ativar/${ item }`);
    }

    inativar(item) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/parametros/taxa/inativar/${ item }`);
    }

    getHistorico(id, pagina, qtdRegistro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/taxa/${id}/historico`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    cadastrar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/parametros/taxa`, data, config);
    }

    atualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/parametros/taxa`, data, config);
    }

    buscarPorSafraCodigoEstabelecimentoGrupoProduto(safra, idEstabelecimento, idGrupoProduto) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/taxa/buscar-taxa-producao-estabelecimento`, {
            params: {
                safra: safra,
                codEstabelecimento: idEstabelecimento,
                familia: idGrupoProduto
            }
        });
    }

    getGrupoProdutosPorTaxa(id,pagina, qtdRegistro){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/taxa/${id}/grupo-produto` ,{
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    getEstabelecimentosPorTaxa(id,pagina, qtdRegistro){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/taxa/${id}/estabelecimentos` ,{
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    getPeriodosCarencia(idTaxa,pagina, qtdRegistro){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/taxa/${idTaxa}/periodo-carencia` ,{
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    deletarTaxa(idTaxa){
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.delete(`${ ApiUrl.portal_url }api/pa/v1/parametros/taxa/excluir/${ idTaxa }`);
    }

    sincronizarComERP(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/taxa/sincronizar/${id}`);
    }
}

export default new TaxasProducaoService();