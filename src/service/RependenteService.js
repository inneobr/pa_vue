import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class RependenteService {

    salvar(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/rependente`, data, config);
    }

    getRependente(codigoEstabelecimento, pagina, qtdRegistro) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/rependente/buscar-por/codigo-estabelecimento/${ codigoEstabelecimento }`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: "dataCadastro"
            }
        });
    }

    getRependenteId(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/rependente/${id}`);
    }

    getEstabelecimentos(dados){
        if(dados == null || dados == "") dados = undefined; 
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/rependente/estabelecimentos/${dados}`);
    }

    getGrupoProduto(dados){
        if(dados == null || dados == "") dados = undefined; 
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/rependente/grupo-produto/${dados}`);
    }

    getProdutor(dados){
        if(dados == null || dados == "") dados = undefined; 
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/rependente/produtor/${dados}`);
    }

    getImovel(dados){
        if(dados == null || dados == "") dados = undefined; 
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/rependente/imovel/${dados}`);
    }

    getUnidadeFederacao(dados){
        if(dados == null || dados == "") dados = undefined; 
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/unidade/federacao/buscar-por-sigla-estado/${dados}`);       
    }

    getNaturezaOperacao(codEstabelecimento, tipoNatureza, codProdutor, codGrupoProduto  ){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/natureza-operacao/buscar-por/${codEstabelecimento}/${tipoNatureza}/${codProdutor}?codigoGrupoProduto=${codGrupoProduto}`);
    }

    getParametrosEstabelecimento(id){
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/rependente/parametros-estabelecimento/${id}`);       
    }
        
    getPesagemDisponivel(filtrosparam, pagina, pageable){
        const filtros = Object.assign({}, filtrosparam);
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/rependente/ticket-pesagem/filtro`, {
            params: {
                page: pagina,
                size: pageable,
                sort: "dataCadastro",
                estabelecimento: filtros.estabelecimento
            }
        });
    }

    buscarProdutoPesagemPorCodigoEstabelecimentoSafraNroDocPesagem(codigoEstabelecimento, safra, nroDocPesagem) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/rependente/buscar-produto-pesagem-por/codigo-estabelecimento/${ codigoEstabelecimento }/safra/${ safra }/numero-documento-pesagem/${ nroDocPesagem }`);
    }

    buscarTiposDesmembramento() {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/rependente/listar-tipo-desmembramento`);
    }

    excluir(idRePendente) {
        return axios.delete(`${ ApiUrl.portal_url }api/pa/v1/rependente/${ idRePendente }`);
    }

    calcularRendaLiquida(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.portal_url }api/pa/v1/rependente/calcular-renda-liquida`, data, config);
    }
    
    atualizarRe(idRePendente, permitirDataMovimentoAbertoMenorQueDataAtual = false) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/rependente/atualizar-re/id-re-pendente/${ idRePendente }`, {
            params: {
                permitirDataMovimentoAbertoMenorQueDataAtual
            }
        });
    }
}
export default new RependenteService();