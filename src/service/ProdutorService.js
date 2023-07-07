import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class ProdutorService {
    getTodosProdutores(pagina, qtdRegistro, nome){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produtor`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                nome: nome
            }
        });
    }   

    pesquisarProdutor(params = {}){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produtor/filter`, { params });
    }
    
    pesquisarProdutorComPaginacao(pagina, qtdRegistro, sort, 
        filtros = {
            codProdutor:null,
            cpfProdutor:null,
            nomeProdutor:null,
            status:'ATIVO',
        }){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produtor/filter`, { 
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                codProdutor: filtros.codProdutor,
                cpfCnpj: filtros.cpfProdutor,
                nome: filtros.nomeProdutor,
                situacao: filtros.status,
            }
         });
    }

    buscarProdutor(data) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produtor/buscar/${ data }`);
    }

    buscarPorCodigoProdutor(codigoProdutor) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produtor/buscar-por/codigo-produtor/${ codigoProdutor }`);
    }

    pesquisarPorCodigoOuNome(codigoOuNome, qtdRegistro = 15, situacao = undefined) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produtor/pesquisar-por/codigo-ou-nome`, {
            params: {
                filtro: codigoOuNome,
                size: qtdRegistro,
                situacao: situacao
            }
        });
    }

    buscarPorCodigoQueNaoEmiteNf(codProdutor) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/produtor/buscar-por/codigo-produtor/${ codProdutor }/ativo/nao-emite-nota-fiscal`);
    }

    inativar(produtorId) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/produtor/inativar/${ produtorId }`);
    }
    
    ativar(produtorId) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/produtor/ativar/${ produtorId }`);
    }
}
export default new ProdutorService();