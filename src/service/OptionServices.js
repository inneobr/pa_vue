import axios from "axios";
import StorageKeys from "../config/StorageKeys";
import ApiUrl from '../config/ApiUrl';

const API_BASE_URL = 'http://192.168.1.78:8000';

class OptionService {

    
    setLayoutMode(value) {
        let user = JSON.parse(localStorage.getItem('user'));
        user.tema = value;
        this.saveOption(user);
    }

    setTopbarTheme(value) {
        let user = JSON.parse(localStorage.getItem('user'));
        user.corCabecalho = value;
        this.saveOption(user);
    }

	setComponentTheme(value){
		let user = JSON.parse(localStorage.getItem('user'));
		user.corComponentes = value;
		this.saveOption(user);
	}

	setMenuMode(value){
		let user = JSON.parse(localStorage.getItem('user'));
		user.menu = value;
		this.saveOption(user);
	}

	setMenuTheme(value){
		let user = JSON.parse(localStorage.getItem('user'));
		user.corMenu = value;
		this.saveOption(user);
	}

	saveOption(user) {
		localStorage.setItem(StorageKeys.User, JSON.stringify(user));
		const headers = {'content-type': 'application/json'}

		return new Promise((resolve, reject) => {
			axios.post(API_BASE_URL + '/options', user, { headers })
				.then(response => {
					return resolve(response);
				})
				.catch(error => {
					return reject(error);
				});
		});
	}

	getMenusPorUsuarioId(usuarioId) {
		return axios.get(`${ ApiUrl.autenticacao }agricola/auth/v1/template/listar-menus/${ usuarioId }`);
	}
}

export default new OptionService();