import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class RomaneioEntregaService {
    getRomaneios(pagina, qtdRegistro, filtros = {}, sort) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/recentrega`, {
            params: {
                page: pagina,
                size: qtdRegistro,
                sort: sort,
                codEstabelecimento: filtros.codEstabelecimento,
                produto: filtros.produto,
                produtor: filtros.produtor,
                matriculaImovel: filtros.matriculaImovel,
                motorista: filtros.motorista,
                codigoGrupoProduto: filtros.codigoGrupoProduto,
                safra: filtros.safra,
                nroDocPesagemInicial: filtros.nroDocPesagemInicial,
                nroDocPesagemFinal: filtros.nroDocPesagemFinal,
                placa: filtros.placa,
                tipoPesagemBalanca: filtros.tipoPesagemBalanca,
                inicio: filtros.inicio,
                termino: filtros.termino,
                status: filtros.status,
                nrReInicial : filtros.nrReInicial,
                nrReFinal: filtros.nrReFinal
            }
        });
    }

    getRomaneioId(id) {
        return axios.get(`${ ApiUrl.portal_url }api/pa/v1/recentrega/${id}`);
    }

}

export default new RomaneioEntregaService();