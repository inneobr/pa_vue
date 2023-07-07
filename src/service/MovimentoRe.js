import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class MovimentoReService {
    
    getMovimentoRe(nrRe, pagina, qtdRegistro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/movimento-re/${ nrRe }`, {
            params: {
                page: pagina,
                size: qtdRegistro,
            }
        });
    }
    
}

export default new MovimentoReService();