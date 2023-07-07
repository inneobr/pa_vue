import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class SementeClasseService {

    getClasseComPaginacao(pagina, qtdRegistro, ordenar, situacao, filtro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/semente/classe/buscar-com-paginacao`, {
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
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/semente/classe/ativar/${ codigo }`);
    }

    inativar(codigo) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/semente/classe/inativar/${ codigo }`);
    }

    salvar(dados) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/semente/classe`, dados, config);
    }

    pesquisarPorCodigoOuDescricao(codigoOuDescricao, qtdRegistro = 30, situacao = 'ATIVO', ordenar = "codigo") {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/semente/classe/buscar-por/codigo-ou-descricao`, {
            params: {
                filtro: codigoOuDescricao,
                situacao: situacao,
                size: qtdRegistro,
                sort: ordenar
            }
        });
    }

    getCampoFilter(pagina, qtdRegistro, ordenar, filter = {}){
        if(filter.safra != undefined && typeof filter.safra == "string" && filter.safra.toUpperCase() == "TODAS"){
            filter.safra = undefined;
        }
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/semente/campo/pageable/filtrar`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: ordenar,                
                codEstab: filter.codEstab,
                safra: filter.safra,
                fmCodigo: filter.grupoProduto
            }
        });
    }
}

export default new SementeClasseService();