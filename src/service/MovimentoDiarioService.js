import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class MovimentoDiarioService {
    getMovimentoDiario(pagina, qtdRegistro, sort, filtros = {
        'codEstabelecimento':'',
        'dataInicio':'',
        'dataFinal':''
    }) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/movimento-diario`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                codEstabelecimento: filtros.codEstabelecimento,
                dataInicio: filtros.dataInicio,
                dataFinal: filtros.dataFinal,                
            }
        });
    }

    validarMovimentoDiario(codigoEstabelecimento, dataMovimento) {
        const data = {
            codEstab: codigoEstabelecimento,
            dataMov: dataMovimento
        }

        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/movimento-diario/validar-movimento`, data, config);
    }
}
export default new MovimentoDiarioService();