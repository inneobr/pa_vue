import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class HistoricoPesagemService {
    getHistoricoPessagensPorSafraETicket(pagina, qtdRegistro, codEstabelecimento, safra, nrDocPesagem) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/historico/${ codEstabelecimento }/${ safra }/${ nrDocPesagem }`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: "dataCadastro,desc"
            }
        });
    }
}

export default new HistoricoPesagemService();