import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class ImovelService {    
    getImovelProdutorPage(codProdutor, pagina, qtdRegistro  ) {       
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/imovel/produtor/${ codProdutor }`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });    
    } 

    getProdutorImovel(matricula) {       
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/imovel/pesquisar-produtores-imovel/${ matricula }` );    
    } 

    getImovelAtivosPage( pagina, qtdRegistro  ) {       
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/imovel/ativos`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });    
    } 

    getProdutorImoveisFilter(pagina, qtdRegistro, sort, filtros = {}){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/imovel/pesquisar-imovel-filter`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                codProdutor: filtros.codProdutor,
                matriculaNome: filtros.matriculaNome,
                status: filtros.status
            }
        });          
    }

    pesquisarPorCodigoProdutorEMatriculaOuDescricaoSemSerTransferencia(codigoProdutor, matriculaOuDescricao, qtdRegistro = 15, situacao = undefined) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/imovel/pesquisar-por/produtor/${ codigoProdutor }/matricula-ou-descricao/sem-ser-transferencia`, {
            params: {
                filtro: matriculaOuDescricao,
                size: qtdRegistro,
                situacao: situacao
            }
        });
    }

    buscarPorMatricula(matricula) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/imovel/buscar-por/matricula/${ matricula }`);
    }

    ativarImovel(idImovel) {       
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/imovel/ativar/${ idImovel }`);    
    } 

    inativarImovel(idImovel) {       
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/imovel/inativar/${ idImovel}` );
    }
}
export default new ImovelService();