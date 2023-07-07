import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class NfRemessaService {
    getNfRemessa(pagina, qtdRegistro, sort, filtros = {
        'codEstabelecimento':'',
        'dataInicio':'',
        'dataFinal':''
    }) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/nf-remessa`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                codEstabelecimento: filtros.codEstabelecimento,
                dataInicio: filtros.dataInicio,
                dataFinal: filtros.dataFinal,
                pendenciasFiscais: filtros.pendenciasFiscais                
            }
        });
    }

    buscarIndicadores(
        filtros = {
            'codEstabelecimento':'',
            'dataInicio':'',
            'dataFinal':''}
        ) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/nf-remessa/buscar-indicadores`, {
            params: {
                codEstabelecimento: filtros.codEstabelecimento,
                dataInicio: filtros.dataInicio,
                dataFinal: filtros.dataFinal,
                pendenciasFiscais: filtros.pendenciasFiscais     
            }
        });
        
    }

    sincronizarComERP(id) {
        if(id === undefined){
            return axios.get(`${ ApiUrl.portal_url }api/pa/v1/gerar-re/solicitar-nf-erp`);
        }else{
            return axios.get(`${ ApiUrl.portal_url }api/pa/v1/gerar-re/solicitar-nf-erp/${id}`);
        }
    }

    sincronizarComErpPorStatus(status, filtros = {
        'codEstabelecimento':'',
        'dataInicio':'',
        'dataFinal':''
    }) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/gerar-re/solicitar-nf-erp-por-status`, {
            params: {
                codEstabelecimento: filtros.codEstabelecimento,
                dataInicio: filtros.dataInicio,
                dataFinal: filtros.dataFinal,   
                status: status             
            }
        });
    }

    atualizarDadosFiscais(idNfRemessa, dados) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/nf-remessa/atualizar-dados-fiscais/id-nf-remessa/${ idNfRemessa }`, dados, config);
    }

    buscarChaveAcesso(idRecEntrega) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/nf-remessa/buscar-dados-chave-acesso/por-id-rec-entraga/${ idRecEntrega }`);
    }
}
export default new NfRemessaService();