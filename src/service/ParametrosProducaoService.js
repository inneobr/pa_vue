import axios from 'axios';
import ApiUrl from '../config/ApiUrl';

class ParametrosProducaoService {
    getParametros() {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/parametros/producao`);
    }

    atualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/parametros/producao`, data, config);
    }
}

export default new ParametrosProducaoService();