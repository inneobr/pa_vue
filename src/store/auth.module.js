import EstabelecimentoService from '../service/EstabelecimentoService';
import AuthService from '../service/security/AuthService';
import StorageService from '../service/StorageService';
import UsuarioService from '../service/UsuarioService';

const storageUser = StorageService.getUser(); 
const initialState = storageUser
? { status: { loggedIn: true }, user: storageUser }
: { status: { loggedIn: false }, user: null };

export const auth = {
namespaced: true,
state: initialState,
actions: {

    login({ commit }, user) {
        return new Promise((resolve, reject) => {
            
            // Resetar todos os caches de login
            AuthService.logout();
            commit('logout');
            
            AuthService.login(user)
                .then(({ data }) => {
                    StorageService.setAuth(data);
                    UsuarioService.getUsuarioPorUsername(user.username)
                        .then(({ data }) => {
                            StorageService.setUser(data);
                            EstabelecimentoService.getEstabelecimentosPorCodigo(data.estabelecimento)
                                .then(({ data }) => {
                                    StorageService.setEstabelecimento(data);
                                    commit('loginSuccess', StorageService.getUser());
                                    return resolve(data);
                                })
                                .catch(error => {
                                    commit('loginFailure');
                                    return reject(error);
                                });
                        })
                        .catch(error => {
                            commit('loginFailure');
                            return reject(error);
                        });
                })
                .catch(error => {
                    commit('loginFailure');
                    return reject(error);
                });
        });
    },

    logout({ commit }) {
        AuthService.logout();
        commit('logout');
    },

    register({ commit }, user) {
        return AuthService.register(user).then(
            response => {
            commit('registerSuccess');
            return Promise.resolve(response.data);
            },
            error => {
            commit('registerFailure');
            return Promise.reject(error);
            }
        );
    }
},
mutations: {
    loginSuccess(state, user) {
        state.status.loggedIn = true;
        state.user = user;
    },
    loginFailure(state) {
        state.status.loggedIn = false;
        state.user = null;
    },
    logout(state) {
        state.status.loggedIn = false;
        state.user = null;
    },
    registerSuccess(state) {
        state.status.loggedIn = false;
    },
    registerFailure(state) {
        state.status.loggedIn = false;
    }
}
};
