import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class SituacaoRe {

    

    getSituacaoRePaginacao(pagina, qtdRegistro, ordenar, situacao, descricao) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/situacao-re/buscar-com-paginacao`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: ordenar,
                situacao: situacao,
                descricao: descricao
            }
        });
    }

    getSituacaoPorCodigo(codigo){
        //http://localhost:8100/api/pa/v1/situacao-re/codigo/10
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/situacao-re/codigo/${ codigo }`);
    }

}

export default new SituacaoRe();