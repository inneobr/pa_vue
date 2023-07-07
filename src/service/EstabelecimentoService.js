import axios from 'axios';
import ApiUrl from '../config/ApiUrl';

const V1_ESTABELECIMENTO = 'api/pa/v1/estabelecimento';

class EstabelecimentoService {

    getCnpjCadastrado(data){
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/cnpj`, data, config);
    }

    getEstabelecimentosUsuario(codigo) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/usuario/${ codigo }`);
    }

    getEstabelecimentosPorEstabelecimentoDoUsuario(codEstabelecimento) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/usuario/estabelecimentoDoUsuario/${ codEstabelecimento }`);
    }

    getEstabelecimentosPorCodigoOuDescricao(codigoOuNome) {
        if(codigoOuNome == null || codigoOuNome == "") codigoOuNome = undefined; 

        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/buscar`, {
            params: {
                codigoOuNome: codigoOuNome
            }
        });
    }

    getEstabelecimentosPorCodigoOuDescricaoDoUsuariologado(codigoOuNome) {
        if(codigoOuNome == null || codigoOuNome == "") codigoOuNome = undefined; 

        return axios.get(`${ ApiUrl.portal_url }${V1_ESTABELECIMENTO}/buscar-por/codigo-ou-nome/logado`, {
            params: {
                codigoOuNome: codigoOuNome
            }
        });
    }

    pesquisarPorCodigoOuNomeFantasiaAtivo(codigoOuNomeFantasia, quantidade = 100) {
        if(codigoOuNomeFantasia == null || codigoOuNomeFantasia == "") codigoOuNomeFantasia = undefined; 

        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/buscar-por/codigo-ou-nome-fantasia/ativo`, {
            params: {
                filtro: codigoOuNomeFantasia,
                size: quantidade
            }
        });
    }

    pesquisarPorParametroUsuarioVsEstabelecimentoComUsuarioAutenticado(filtro, quantidade = 100, situacao = "ATIVO") {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/buscar-por/parametro-usuario-vs-estabelecimento/usuario-autenticado`, {
            params: {
                estabelecimentoCodigoOuNomeFantasia: filtro.codigoOuNomeFantasia,
                re: filtro.re,
                size: quantidade,
                situacao
            }
        });
    }

    buscarPorUsuarioAutenticadoVsEstabelecimentoComPermissaReEstabelecimentoTipoSilo(filtro, quantidade = 100) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/buscar-por/usuario-autenticado-vs-estabelecimento/permissao-re/estabelecimento-tipo-silo`, {
            params: {
                filtro,
                size: quantidade
            }
        });
    }

    buscarPorUsuarioAutenticadoComHierarquiaEstabelecimentoQueSejaSilo(filtro, quantidade = 100) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/buscar-por/usuario-autenticado/com-hierarquia-estabelecimento/que-seja-silo`, {
            params: {
                filtro,
                size: quantidade
            }
        });
    }

    getEstabelecimentos(pagina, qtdRegistro, sort, filtro, situacao) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento`, {
            params: {
                page: pagina,
                size: qtdRegistro, 
                sort:sort,
                codigo: filtro,
                codigoRegional:filtro,
                nomeFantasia:filtro,
                email:filtro,
                telefone:filtro,
                cnpj:filtro,
                cidade:filtro,
                estado:filtro,
                situacao: situacao
            }
        });
    }

    getTodosEstabelecimentos() {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/todos`);
    }

    getTodosEstabelecimentosSilo(){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/estabelecimentos-parametro-estabelecimento-silo`);
    }

    getTodosEstabelecimentosNaturezaOperacaoSilo(){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/estabelecimento-silo-natureza-operacao`);
    }

    getTodosEstabelecimentosSiloFilter(filter){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/buscar-por/filtrar-estabelecimento-silo`, {
            params: {
                filtro: filter,
            }
        });
    }

    getEstabelecimentosNaturezaTributariaSilo(){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/natureza-tributaria/estabelecimento-silo`);
    }

    getTodosEstabelecimentosItemAvariadoSilo(tipoValidacao, idGrupo){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/estabelecimento-silo-item-avariado`, {
            params: {
                tipoValidacao: tipoValidacao,
                idGrupo: idGrupo
            }
        });
    }
    

    getEstabelecimentosPorId(estabelecimentoId) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/${ estabelecimentoId }`);
    }

    getEstabelecimentosPorCodigo(codigo) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/codigo/${ codigo }`);
    }

    getRegionais(dados) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/regional/buscar=${dados}`);
    }

    getRegionalPorCodigo(codigo) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/regional/${ codigo }`);
    }

    cadastrar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/save-all`, [data], config);
    }

    atualizar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento`, data, config);
    }
    
    inativar(estabelecimentoId) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/inativar/${ estabelecimentoId }`);
    }
    
    ativar(estabelecimentoId) {
        return axios.put(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/ativar/${ estabelecimentoId }`);
    }

    validarEntradaProducaoPorCodigoEstabelecimentoEntradaManual(codigoEstabelecimento, entradaManual) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/validar-entrada-producao-por/codigo-estabelecimento/${ codigoEstabelecimento }/entrada-manual/${ entradaManual }`);
    }

    getEstabelecimentosFiltroBuscaSiloUbs(filter){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/filtro-pesquisar`, {
            params: {
                pesquisar: filter.pesquisar,
                logUbs: true
            }
        });
    }

    getEstabelecimentosFiltroBuscaSilo(filter){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/estabelecimento/silo-filtro-pesquisar`, {
            params: {
                pesquisar: filter.pesquisar,
                logSilo: true
            }
        });
    }

    
    
}

export default new EstabelecimentoService();