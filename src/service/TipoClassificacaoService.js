import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class TipoClassificacaoService {

    // getTipoClassificacaoPaginado(pagina, qtdRegistro, sort, filtro, situacao) {
    //     return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipo-classificacao/listar`, {
    //         params: {
    //             page: pagina,
    //             size: qtdRegistro,
    //             sort: sort,
    //             buscar: filtro,
    //             situacao: situacao
    //         }
    //     });
    // }

    getTipoClassificacaoPaginado(pagina, qtdRegistro, sort, filtro, situacao) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipo-classificacao/listar`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                filtro: filtro,
                situacao: situacao
            }
        });
    }

    getTipos()
    {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipo-classificacao/tipos`);
    }

    getTiposClassificacao(){
        console.log('Chamou lista de tipos');
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipo-classificacao`);
    }
    
    cadastrar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
         
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/tipo-classificacao`, data, config);
    }

    atualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
         
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/tipo-classificacao`, data, config);
    }

    getTipoCadastroPorTipo(tipoClassificacao){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipo-classificacao/${tipoClassificacao}`);
    }

    inativar(tipoClassificacao) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/tipo-classificacao/inativar/${ tipoClassificacao }`);
    }
    
    ativar(tipoClassificacao) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/tipo-classificacao/ativar/${ tipoClassificacao }`);
    }
    
    getHistorico(tipoClassificacao, id, pagina, qtdRegistro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipo-classificacao/historico/${ tipoClassificacao }/${id}`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    sincronizarComERP(id){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipo-classificacao/sincronizar/${id}`);
    }

}

export default new TipoClassificacaoService();