import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class RecebimentoDeEntregaReportService {
    putImprimirRelatorio(reportFilter) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/gerar-relatorio-re`, reportFilter, {responseType:'arraybuffer'});
    }
}

export default new RecebimentoDeEntregaReportService();