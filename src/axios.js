import axios from "axios"
import authService from "./service/security/AuthService";
import router from './router';
import store from './store'
import StorageService from './service/StorageService';
import moment from 'moment';

window.axios = axios
axios.defaults.withCredentials = false

// Interceptador de requests
axios.interceptors.request.use(
    (config) => {
        if(config.url && ((config.url.indexOf('/authentication/login') >= 0) || (config.url.indexOf('/recuperar-senha') >= 0))) {
            return config;
        }

        const auth = StorageService.getAuth();

        if(auth){
            config.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
        else {
            subscribers = [];
            router.push('/login');
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptador de response
let isRefreshing = false;
let subscribers = [];

axios.interceptors.response.use(
    (config) => {
        return config;
    },
    (error) => {
        const {
            config, 
            response: { status, data} 
        } = error;
        
        if(config.url && config.url.indexOf('/authentication/refresh') >= 0) {
            console.log("Reflesh token expirado.");
            logout();
            return Promise.reject(false);
        }

        if(status === 401 || status === 403 && data.message_error 
            && data.message_error.indexOf("The Token has expired") >= 0) {                 
                const auth = StorageService.getAuth();
                if(!auth) {
                    logout();
                    return Promise.reject(false);
                }
                
                if(!isRefreshing) {
                    isRefreshing = true;
                    
                    authService.refresh(auth.refreshToken)
                        .then(({status, data}) => {                        
                            if(status === 200 || status == 204) {
                                isRefreshing = false;
                                StorageService.setAuth(data);
                                onRefreshed();
                            }
                            console.log("Token atualizado.");   
                            subscribers = [];
                        })
                        .catch((err) => {
                            console.log("Não foi possivel atuaizar token, realizando logout.");
                            logout();
                        });
                }
                
                const requestSubscribers = new Promise(resolve => {
                    subscribeTokenRefresh(() => {
                        resolve(axios(config));
                    });
                });

                return requestSubscribers;
        }

        return Promise.reject(error);
    }
);

function logout() {
    isRefreshing = false;
    subscribers = [];
    store.dispatch('auth/logout');
    router.go();
}

function subscribeTokenRefresh(cb) {
    subscribers.push(cb);
}

function onRefreshed() {
    subscribers.map(cb => cb());
}