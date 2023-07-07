import axios from "axios";
import ApiUrl from '../config/ApiUrl';

class MenuItemService {
    getMenuItens() {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/menuItem`);
    }

    getMenuItem(menuItemId) {
        return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/menuItem/id/${menuItemId}`);
    }


    postMenuItem(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.post(`${ ApiUrl.autenticacao }agricola/auth/v1/menuItem`, data, config);
    }

    putMenuItem(data) {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        return axios.put(`${ ApiUrl.autenticacao }agricola/auth/v1/menuItem`, data, config);
    }

    inativarMenuItem(menuItemId) {
        return axios.put(`${ ApiUrl.autenticacao }agricola/auth/v1/menuItem/inativar/${menuItemId}`);
    }

    ativarMenuItem(menuItemId) {
        return axios.put(`${ ApiUrl.autenticacao }agricola/auth/v1/menuItem/ativar/${menuItemId}`);
    }
}
export default new MenuItemService();