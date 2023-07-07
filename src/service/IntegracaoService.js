import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class IntegracaoService {
    //Paginas get e get 
    getPaginas() {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/integracao/pagina/listar-paginas`);
    }

    savePagina(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/integracao/pagina`, data, config);
    }

    getPaginaCadastrada(pagina){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/integracao/pagina/simplificado/${pagina}`);
    }

    //Login
    getLogins(pagina, qtdRegistro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/integracao/auth/find-all`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: "login,asc"
            }
        });
    }

    getLogin(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/integracao/auth/${id}`);
    }

    getLoginList(login){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/integracao/auth/buscar/${login}`);
    }

    getLoginPorDescricaoList(descricao){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/integracao/auth/buscar-por-descricao/${descricao}`);
    }

    getMetodos() {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/integracao/pagina/request-metodo`);
    } 

    getTipoLogin() {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/integracao/pagina/listar-tipo`);
    } 
    
    getLoginTest(url, data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ url }`, data, config);
    }

    saveLogin(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/integracao/auth`, data, config);
    }

    //Funcionalidades services
    getFuncionalidades(pagina) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/integracao/pagina/funcionalidade/${pagina}`);
    } 

    getRequestTesteApi(dados){
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/integracao/pagina/request-teste`, dados, config);
    }

    getIntegrationOptions(pagina){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/integracao/origem/${pagina}`);
    }


    //API's APP Integração
    getFuncionalidadesPainelMonitoramento() {
        return axios.get(`${ ApiUrl.integracao }genesis/integration/v1/monitoramento/funcionalidades`);
    } 

    resetSchedule(timerScheduler) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.integracao }genesis/integration/v1/reset`, timerScheduler, config);
    }

    
}

export default new IntegracaoService();