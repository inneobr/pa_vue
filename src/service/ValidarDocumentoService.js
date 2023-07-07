import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class ValidarDocumentoService {
    
    getDocumentoValido(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/documentos`, data, config);
    }
}
export default new ValidarDocumentoService();