import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class CampoLaudoService {        
    getLaudo(filtro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/semente/campo-laudo/filtrar`, {
            params: {
                safra: filtro.safra,
                codEstab: filtro.codEstab,
                fmCodigo: filtro.fmCodigo,
                ordemCampo: filtro.ordemCampo,
            }
        });
    }
}
export default new CampoLaudoService();

