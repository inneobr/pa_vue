import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class GrupoClassificacaoService {
    getGruposClassificacaoPage(pagina, qtdRegistro, filtrosparam) {
        const filtros = Object.assign({}, filtrosparam);
        if(filtros.safra != undefined && typeof filtros.safra == "string" && filtros.safra.toUpperCase() == "TODAS"){
            filtros.safra = undefined;
        }
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/classificacao`, {
            params: {
                page: pagina,
                size: qtdRegistro,               
                safra: filtros.safra,
                descricao: filtros.descricao,
                idGrupoProduto: filtros.idGrupoProduto,
                idTipoClassificacao: filtros.idTipoClassificacao,
            }
           
        });
    }

    getGruposClassificacaoUnico( idGrupo ) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/classificacao/${ idGrupo }`);
    }

    cadastrar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/classificacao`, data, config);
    }

    atualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/classificacao`, data, config);
    }

    excluirGrupo(id) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.delete(`${ ApiUrl.portal_url }api/pa/v1/classificacao/excluir/${ id }`);
    }

    inativarGrupo(id) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/classificacao/inativar/${ id }`);
    }

    ativarGrupo(id) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/classificacao/ativar/${ id }`);
    }   

    getHistorico(idGrupo, pagina, qtdRegistro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/classificacao/${idGrupo}/historico`,{
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }


    getDetalhes(idGrupo) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/classificacao/${idGrupo}/tipo-classificacao-detalhes` );
    }

    getGrupoProdutos(idClassificacao){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/classificacao/${idClassificacao}/buscar-grupo-produtos` );
    }

    //getEstabelecimentosDoGrupoProduto(idClassificacao, idGrupoProduto){
    //    return axios.get(`${ ApiUrl.portal_url }api/pa/v1/classificacao/${idClassificacao}/${idGrupoProduto}/buscar-estabelecimentos` );
    //}

    getEstabelecimentosPorGrupoClassificacao(idGrupoClassificacao, pagina, qtdRegistro){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/classificacao/${idGrupoClassificacao}/estabelecimentos` ,{
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    sincronizarComERP(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/classificacao/sincronizar/${id}`);
    }
   
}
export default new GrupoClassificacaoService();