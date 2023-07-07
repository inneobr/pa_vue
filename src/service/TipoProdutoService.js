import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class TipoProdutoService {
    getTipoProdutos(pagina, qtdRegistro, ordenar, situacao, nome) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/tipo/buscar-com-paginacao`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: ordenar,
                situacao: situacao,
                nome: nome
            }
        });
    }

    getAutoComplete(pesquisa){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/tipo/complete/${pesquisa}`);
    }

    getTipoProdutoPorid(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/tipo/${id}`);
    }

    buscarTipoProdutoPorNome(nome = undefined) {
        if(nome == null || nome == "") nome = undefined; 

        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/tipo/nome`, {
            params: {
                nome: nome
            }
        });
    }
    
    salvar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/produto/tipo`, data, config);
    }

    ativar(IdUnico) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/produto/tipo/ativar/${ IdUnico }`);
    }

    inativar(IdUnico) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/produto/tipo/inativar/${ IdUnico }`);
    }

    sincronizarComERP(idUnico) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/tipo/sincronizar/${idUnico}`);
    }
}
export default new TipoProdutoService();