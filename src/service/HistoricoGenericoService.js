import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class HistoricoGenericoService {

    getHistoricoGenericoComPaginacao(id, codigoPagina, pagina, qtdRegistro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/historico/generico/${ codigoPagina }/${ id }`, {
            params: {
                page: pagina,
                size: qtdRegistro,
            }
        });
    }
}

export default new HistoricoGenericoService();