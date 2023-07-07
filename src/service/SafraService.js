import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class SafraService {
    getTodasSafras() {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/classificacao/safras`);
    }

    getTodasSafras1996() {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/classificacao/safras-1996`);
    }

}
export default new SafraService();