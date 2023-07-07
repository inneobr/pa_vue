import axios from "axios";

const API_BASE_URL = 'http://192.168.1.78:9100/api/cooperado/v1';

class FuncionalidadeService {
    listar() {
        return axios.get(API_BASE_URL + "/funcionalidade/todas");
    }
}

export default new FuncionalidadeService();