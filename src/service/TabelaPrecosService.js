import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class TabelaPrecosService {

    getPrecos(pagina, qtdRegistro, filtros) {
         return axios.get(`${ApiUrl.portal_url}api/pa/v1/preco/estabelecimento-grupo-produto`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: 'dataValidade,desc',
                codigoProduto: filtros.codigoProduto,
                idGrupoProduto: filtros.grupoProduto ? filtros.grupoProduto.id : null,
                codigoEstabelecimento: filtros.estabelecimento? filtros.estabelecimento.codigo: null,
            }
        });
    }
}

export default new TabelaPrecosService();