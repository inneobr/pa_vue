import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class PesagemService {
    getPessagens(pagina, qtdRegistro, filtros = {}, sort) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/pesagem`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                codEstabelecimento: filtros.codEstabelecimento,
                produto: filtros.produto,
                produtor: filtros.produtor,
                imovel: filtros.imovel,
                motorista: filtros.motorista,
                grupoProdutoid: filtros.grupoProdutoid,
                safra: filtros.safra,
                nroDocPesagemInicial: filtros.nroDocPesagemInicial,
                nroDocPesagemFinal: filtros.nroDocPesagemFinal,
                placa: filtros.placa,
                tipoPesagemBalanca: filtros.tipoPesagemBalanca,
                inicio: filtros.inicio,
                termino: filtros.termino,
                status: filtros.status
            }
        });
    }

    getPessagensPendentes(pagina, qtdRegistro, filtros = {}) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/pesagem/buscar-pendentes`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: "dataCadastro",
                codEstabelecimento: filtros.codEstabelecimento,
                produto: filtros.produto,
                produtor: filtros.produtor,
                imovel: filtros.imovel,
                motorista: filtros.motorista,
                grupoProdutoid: filtros.grupoProdutoid,
                safra: filtros.safra,
                nroDocPesagemInicial: filtros.nroDocPesagemInicial,
                nroDocPesagemFinal: filtros.nroDocPesagemFinal,
                placa: filtros.placa,
                tipoPesagemBalanca: filtros.tipoPesagemBalanca,
                inicio: filtros.inicio,
                termino: filtros.termino
            }
        });
    }

    buscarPorCodigoEstabelecimentoSafraNroDocPesagem(codigoEstabelecimento, safra, nroDocPesagem) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/pesagem/buscar-por/codigo-estabelecimento/${ codigoEstabelecimento }/safra/${ safra }/numero-documento-pesagem/${ nroDocPesagem }`);
    }
}

export default new PesagemService();