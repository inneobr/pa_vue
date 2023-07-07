import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class ParticipanteBayerService {

    getListar(pagina, qtdRegistro, ordenar, filtro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/participante/bayer`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: ordenar,
                filtro: filtro
            }
        });
    }

    excluirPorCnpj(cnpj) {
        return axios.delete(`${ ApiUrl.portal_url }api/pa/v1/participante/bayer/${ cnpj }`);
    }

    salvar(dados) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/participante/bayer/salvar/manual`, dados, config);
    }

    salvarVarios(dados) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/participante/bayer/salvar/importacao`, dados, config);
    }

    excluirTodos(){

        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.delete(`${ ApiUrl.portal_url }api/pa/v1/participante/bayer/excluir-todos`, config);
    }

    validarProdutor(){
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/participante/bayer/validar-produtor-bayer`, config);
    }

}

export default new ParticipanteBayerService();