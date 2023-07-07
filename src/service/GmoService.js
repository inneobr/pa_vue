import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class GmoService {
    getGmo(pagina, qtdRegistro, sort, filtro, situacao) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipogmo`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                tipoGmo: filtro,
                obsRomaneio: filtro,
                situacao: situacao
            }
        });
    } 
    
    getGmoid(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipogmo/id/${ id }`);
    }

    buscarPorTipoGmo(tipoGmo) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipogmo/tipoGmo/${ tipoGmo }`);
    }
    
    inativar(gmoId) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/tipogmo/inativar/${ gmoId }`);
    }
    
    ativar(gmoId) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/tipogmo/ativar/${ gmoId }`);
    }

    cadastrar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/tipogmo/cadastrar`, data, config);
    }

    atualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/tipogmo`, data, config);
    }

    verificarCobrancaKitTesteGmo(tipoGmoId) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipogmo/cobra-teste/${ tipoGmoId }`);
    }

    buscarPorTipoGmoECodigoGrupoProduto(tipoGmo, codigoGrupoProduto) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipogmo/buscar-por/tipo-gmo/${ tipoGmo }/codigo-grupo-produto/${ codigoGrupoProduto }`);
    }

    pesquisarPorTipoGmo(tipoGmo, qtdRegistro = 15, situacao = undefined) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipogmo/pesquisar-por/tipo-gmo`, {
            params: {
                "tipo-gmo": tipoGmo,
                size: qtdRegistro,
                situacao: situacao
            }
        });
    }

    buscarPorCodigoGrupoProduto(codigoGrupoProduto, filtro, qtdRegistro = 50, situacao = "ATIVO") {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/tipogmo/buscar-por/codigo-grupo-produto/${ codigoGrupoProduto }`, {
            params: {
                filtro,
                size: qtdRegistro,
                situacao: situacao
            }
        });
    }
}
export default new GmoService();