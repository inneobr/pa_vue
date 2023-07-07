import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class CampoProdutorService {        
    getProdutor(filtro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/semente/campo-produtor/filtrar`, {
            params: {
                safra: filtro.safra,
                codEstab: filtro.codEstab,
                fmCodigo: filtro.fmCodigo,
                ordemCampo: filtro.ordemCampo,
                codClasse: filtro.codClasse
            }
        });
    }
}
export default new CampoProdutorService();