import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class LaudoInspacaoService {

    getCodigoItem(safra, ordemCampo, nroLaudo, codigoEstabelecimento, codigoGrupoProduto){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/semente/produtor/buscar-laudo-inspecao-por/codigo-estabelecimento/${ codigoEstabelecimento }/safra/${ safra }/codigo-grupo-produto/${ codigoGrupoProduto }/ordem-campo/${ ordemCampo }/numero-laudo/${ nroLaudo }`);
    }
}

export default new LaudoInspacaoService();