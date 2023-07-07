import axios from 'axios';
import ApiUrl from '../config/ApiUrl';

class InformacoesRecursoSistemaService { 

    //busca todos os registros
    getInformacoesRecursoSistema(pagina, qtdRegistro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/info-recurso-sistema/todos`, {
            params: {
                page: pagina,
                size: qtdRegistro
            }
        });
    }

    //Preenche as dropdown com a lista de Paginas
    getPaginas() 
    {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/info-recurso-sistema/paginas/true`);
    }
    

    getAreas(paginaSelecionada) //Retorna uma lista de áreas de acordo com a página selecionada
    {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/info-recurso-sistema/areas/${paginaSelecionada}`);
    }

    getInformacoesRecursoSistemaPorId(id) //Retorna a informação de um unido recurso sistema pelo ID
    {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/info-recurso-sistema/${id}`);
    }

    //Retorna um item de acordo com a paginaArea
    getInformacoesRecursoSistemaByPaginaArea(paginaArea){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/info-recurso-sistema/item/${paginaArea}`);
    }

    cadastrar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
         
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/info-recurso-sistema`, data, config);
    }

    atualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/info-recurso-sistema`, data, config);
    }

    inativar(id) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/info-recurso-sistema/inativar/${ id }`);
    }
    
    ativar(id) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/info-recurso-sistema/ativar/${ id }`);
    }
}

export default new InformacoesRecursoSistemaService();