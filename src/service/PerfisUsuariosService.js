import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class PerfisUsuariosService {
    vincularPerfisPorUsuario(usuarioId, data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.post(`${ ApiUrl.autenticacao }agricola/auth/v1/autorizacao/autorizar/${ usuarioId }`, data, config);
    }
}

export default new PerfisUsuariosService();