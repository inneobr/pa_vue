import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class MenuService {
    getMenus() {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/menu`);
    }

    getMenu(menuId) {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/menu/id/${menuId}`);
    }


    postMenu(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.autenticacao }agricola/auth/v1/menu`, data, config);
    }

    putMenu(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.put(`${ ApiUrl.autenticacao }agricola/auth/v1/menu`, data, config);
    }
}
export default new MenuService();