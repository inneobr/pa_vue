import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class GrupoProdutoService {
    getGrupoProdutoReferencia() {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/grupo-produto-referencia`);
    }
        
    getGruposProdutos(pagina, qtdRegistro, sort, filtro, situacao) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                filtro: filtro,
                situacao: situacao
            }
        });
    }

    listarGruposProdutos() {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/listar`);
    }

    getGruposTodosProdutoResumido() {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/listar/resumido`);
    }

    getGrupoPorid(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/id/${ id }`);
    }
 
    getPorDescricao(codigoOuDescricao) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/grupo/buscar/${ codigoOuDescricao }`);
    }

    cadastrarOuAtualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto`, data, config);
    }

    inativar(id) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/inativar/${ id }`);
    }

    ativar(id) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/ativar/${ id }`);
    }

    getGrupoPorCodigoOuDescricao(codigoOuDescricao){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/grupo/buscar/${ codigoOuDescricao }`);
    }

    getGrupoProdutoByTipoProduto(filter){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/semente/filtrar`, {
            params: {
                pesquisar: filter.pesquisar,
                tipoProduto: filter.tipoProduto
            }
        });
    }

    buscarPorCodigo(codigoGrupoProduto) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/codigo-grupo-produto/${ codigoGrupoProduto }`);
    }

    getGrupoResumidoCodigoOuDescricao(codigoOuDescricao){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/buscar/${ codigoOuDescricao }`);
    }

    //Recupera os valores para a dropdown EntradaRe
    getEntradaRe(){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/buscar-entrada-re`);
    }

    buscarPorCodigoOuDescricao(codigoOuDescricao, situacao = 'ATIVO', qtdRegistro = 100,) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/buscar-por/codigo-ou-descricao`, {
            params: {
                filtro: codigoOuDescricao,
                size: qtdRegistro,
                situacao: situacao
            }
        });
    }

    buscarPorCodigoOuDescricaoComParametroEntradaReDiferenteNaoPermite(codigoOuDescricao, situacao = 'ATIVO', qtdRegistro = 100,) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/buscar-por/codigo-ou-descricao/parametro-entrada-re-diferente-nao-permite`, {
            params: {
                filtro: codigoOuDescricao,
                size: qtdRegistro,
                situacao: situacao
            }
        });

    }

    getGrupoProdutoFilter(filter = {}) { 
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/grupo-produto/filter`, {
            params: {
                fmCodigoOudescricao: filter.fmCodigoOudescricao,
                tipoAvariado: filter.tipoAvariado
            }
        });
    }

    getGrupoProdutoBuscarFilter(filter = {}) {  
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/grupo-produto/buscar/filtrar`, {
            params: {
                pesquisar: filter.pesquisar
            }
        });
    }
   
}
export default new GrupoProdutoService();