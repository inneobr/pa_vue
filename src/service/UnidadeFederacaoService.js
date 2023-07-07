import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class UnidadeFederacaoService {

    getClasseComPaginacao(pagina, qtdRegistro, ordenar, situacao, filtro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/unidade/federacao`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: ordenar,
                situacao: situacao,
                filtro: filtro
            }
        });
    }

    ativar(codigo) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/unidade/federacao/ativar/${ codigo }`);
    }

    inativar(codigo) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/unidade/federacao/inativar/${ codigo }`);
    }

    salvar(dados) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/unidade/federacao`, dados, config);
    }

    salvarVarios(dados)  {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/unidade/federacao/save-all`, dados, config);
    }
}

export default new UnidadeFederacaoService();