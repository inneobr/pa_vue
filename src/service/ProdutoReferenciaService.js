import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class ProdutoReferenciaService { 
    
    getProdutoReferenciaAtivos() {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/referencia/ativos`);
    }

    getProdutoReferenciaPorProduto(idProduto) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/referencia/buscar/produto/${idProduto}`);
    }
    
    getProdutoReferenciaNome(codigo = undefined) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/referencia/busca`, {
            params: {
                codigo
            }
        });
    } 

    getProdutoReferencia(pagina, qtdRegistro, filtro) {

        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/referencia`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: "codRef",
                filtro: filtro
            }
        });
    }

    getidReferencia(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/referencia/${id}`);
    }

    cadastrar(data) {        
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        console.log('JS - dados:', [data]);

        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/produto/referencia`, [data], config);
        
    }

    atualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/produto/referencia`, data, config);
    }

    getProdutoReferenciaStatus(pagina, qtdRegistro, sort, filtro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produto/referencia/filter`, {           
            params: {
                page: pagina,
                sort: sort,
                size: qtdRegistro,

                referencia: filtro.referencia,
                situacao: filtro.situacao
            }
            
        });
    }

    inativar(referencia) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/produto/referencia/inativar/${ referencia }`);
    }
    
    ativar(referencia) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/produto/referencia/ativar/${ referencia }`);
    }
}
export default new ProdutoReferenciaService();