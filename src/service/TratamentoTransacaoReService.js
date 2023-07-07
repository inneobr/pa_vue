import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class TratamentoTransacaoReService {

    getTransacoes(pagina, qtdRegistro, ordenar, filter) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tratamento-transacao-re/`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: ordenar,
                filter: filter.estabelecimento,
            }
        });
    }

    getMovimentos(idRe, pagina, qtdRegistro, ordenar){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tratamento-transacao-re/movimentos/${ idRe }`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                //sort: ordenar,
            }
        });
    }

    reenviar(idTransacaReMov){
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/tratamento-transacao-re/reenviar/?id=${ idTransacaReMov }`);
    }

}export default new TratamentoTransacaoReService();