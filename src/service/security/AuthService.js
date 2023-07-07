import axios from 'axios';
import StorageService from '../StorageService';
import ApiUrl from '../../config/ApiUrl';

class AuthService {
	
	login(user) {
		return new Promise((resolve, reject) => {
			const body = {
				username: user.username,
				password: user.password
			}

			const headers = {
				'content-type': 'application/json'
			}

			axios.post(`${ ApiUrl.autenticacao }authentication/login`, body, { headers })
				.then(response => {
					return resolve(response);
				})
				.catch(error => {
					return reject(error);
				});
		});
	}

	logout() {
		StorageService.setAuth(null);
		StorageService.setUser(null);
		StorageService.setControlePagina(null);
		StorageService.setEstabelecimento(null);
		StorageService.setEntradaProducao(null);
		StorageService.setControlePaginaFilter(null);
	}

	getOptions(username, matriculaCooperado = null) {
		return new Promise((resolve, reject) => {
			axios.get(API_URL + 'options/' + username, {
				params: {
					matriculaCooperado: matriculaCooperado
				}
			})
				.then(response => {
					return resolve(response);
				})
				.catch(error => {
					return reject(error);
				});
		});
	}

	getCooperados(nomeOuMatricula) {
		return axios.get(API_URL + 'options/todos-cooperados/' + nomeOuMatricula);
	}


	refresh(refreshToken) {
		return new Promise((resolve, reject) => {	
			const body = {
				currentToken: 'Bearer ' + refreshToken
			}

			const headers = {
				'content-type': 'application/json'
			}
			
			axios.post(`${ ApiUrl.autenticacao }authentication/refresh`, body, { headers })
				.then(response => {
					resolve(response);
				})
				.catch(error => {
					reject(error);
				});
		});
	}
}

export default new AuthService();
