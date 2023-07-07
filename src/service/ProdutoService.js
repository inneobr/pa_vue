import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class ProdutoService {
    cadastrar(data) {        
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/produto/salvar`, data, config);
    }

    atualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/produto/atualizar`, data, config);
    }

    getProdutosAtivos(pagina, qtdRegistro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/ativos`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: "dataCadastro"
            }
        });
    }

    getProdutos(pagina, qtdRegistro, sort, filtro, situacao) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                filtro: filtro,
                situacao: situacao
            }
        });
    }

    getProdutosPesquisa(pagina, qtdRegistro, sort, filtro, situacao) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/pesquisa`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                codigoNome: filtro.codigoNome,
                idGrupoProduto: filtro.GrupoProduto===undefined? null: filtro.GrupoProduto.fmCodigo,
                situacao: situacao
            }
        });
    }

    

    getidProduto(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/${id}`);
    }

    getProdutoPorGrupo(idGrupo) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo/${idGrupo}`);
    }

    getProdutoCodigoDescricao(data) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/buscar/${data}`);
    }

    pesquisarPorCodigoOuDescricaoVinculadoAoGrupoProduto(codigoOuDescricao, codigoGrupoProduto) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/buscar-por/codigo-grupo-produto/${ codigoGrupoProduto }`, {
            params: {
                filtro: codigoOuDescricao,
                size: 15
            }
        });
    }

    inativar(produtoId) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/produto/inativar/${ produtoId }`);
    }
    
    ativar(produtoId) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/produto/ativar/${ produtoId }`);
    }

    getProdutoPorGrupoFilter(filter) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo/filter`, {
            params: {
                codigoNome: filter.codigoNome,
                idGrupo: filter.idGrupo,
                situacao: filter.situacao,
            }
        });
    }
}
export default new ProdutoService();