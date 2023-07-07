import StorageKeys from "../config/StorageKeys";

class StorageService {
    getAuth() {
        let auth = localStorage.getItem(StorageKeys.Auth);

        if(auth == null) {
            return null;
        }
        else {
            return JSON.parse(auth);
        }
    }

    setAuth(auth) {
        if(auth == undefined || auth == null) {
            localStorage.removeItem(StorageKeys.Auth);
        }
        else {
            localStorage.setItem(StorageKeys.Auth, JSON.stringify(auth));
        }
    }

    getUser() {
        let user = localStorage.getItem(StorageKeys.User);

        if(user == null) {
            return null;
        }
        else {
            return JSON.parse(user);
        }
    }

    setUser(user) {
        if(user == undefined || user == null) {
            localStorage.removeItem(StorageKeys.User);
        }
        else {
            localStorage.setItem(StorageKeys.User, JSON.stringify(user));
        }
    }

    getEntradaProducao() {
        const entradaProducao = localStorage.getItem(StorageKeys.EntradaProducao);

        if(entradaProducao == null) {
            return null;
        }
        else {
            return JSON.parse(entradaProducao);
        }
    }

    setEntradaProducao(entradaProducao) {
        if(entradaProducao == undefined || entradaProducao == null) {
            localStorage.removeItem(StorageKeys.EntradaProducao);
        }
        else {
            localStorage.setItem(StorageKeys.EntradaProducao, JSON.stringify(entradaProducao));
        }
    }

    getEstabelecimento() {
        const estabelecimento = localStorage.getItem(StorageKeys.Estabelecimento);

        if(estabelecimento == null) {
            return null;
        }
        else {
            return JSON.parse(estabelecimento);
        }
    }

    setEstabelecimento(estabelecimento) {
        if(estabelecimento == undefined || estabelecimento == null) {
            localStorage.removeItem(StorageKeys.Estabelecimento);
        }
        else {
            localStorage.setItem(StorageKeys.Estabelecimento, JSON.stringify(estabelecimento));
        }
    }

    validateSystemOptions(user) {
       
        if(this.isNullOrEmpty(user.corCabecalho)){
            user.corCabecalho = "blue";
        }

        if(this.isNullOrEmpty(user.corComponentes)){
            user.corComponentes = "blue"; 
        }

        if(this.isNullOrEmpty(user.corMenu)){
            user.corMenu = "light";
        }

        if(this.isNullOrEmpty(user.estiloCampos)){
            user.estiloCampos = "";
        }

        if(this.isNullOrEmpty(user.fonte)){
            user.fonte = "14";
        }

        if(this.isNullOrEmpty(user.menu)){
            user.menu = "static";
        }

        if(this.isNullOrEmpty(user.menuPosition)){
            user.menuPosition = "top";
        }

        if(this.isNullOrEmpty(user.rippleEffect)){
            user.rippleEffect = "";
        }

        if(this.isNullOrEmpty(user.rtl)){
            user.rtl = false;
        }

        if(this.isNullOrEmpty(user.tema)){
            user.tema = "light";
        }

        return user;
    }

    setControlePagina(pagina, numero = null, firstRow = null,  qtdRegistro = null, filtros = null){        
        if(pagina == undefined || pagina == null) {
            localStorage.removeItem(StorageKeys.ControlePagina);
        }
        else {
            let controlePagina = localStorage.getItem(StorageKeys.ControlePagina);
            if(controlePagina == null) {
                controlePagina = {};   
            }
            else {
                controlePagina = JSON.parse(controlePagina);
            }
            controlePagina[pagina] = {numero, firstRow, qtdRegistro, filtros};
            localStorage.setItem(StorageKeys.ControlePagina, JSON.stringify(controlePagina));
        }
    }

    setControlePaginaFilter(pagina, numero = null, firstRow = null,  qtdRegistro = null, filtros = {}){        
        if(pagina == undefined || pagina == null) {
            localStorage.removeItem(StorageKeys.ControlePagina);
        }
        else {
            let controlePagina = localStorage.getItem(StorageKeys.ControlePagina);
            if(controlePagina == null) {
                controlePagina = {};   
            }
            else {
                controlePagina = JSON.parse(controlePagina);
            }
            controlePagina[pagina] = {numero, firstRow, qtdRegistro, filtros};
            localStorage.setItem(StorageKeys.ControlePagina, JSON.stringify(controlePagina));
        }
    }


    getControlePagina(pagina) {        
        let controlePagina = localStorage.getItem(StorageKeys.ControlePagina);
        let pagination = { numero: 0, firstRow: 0, qtdRegistro: 10, filtros: null, default: true};

        if(controlePagina == null) {
            return pagination;
        } else {
            controlePagina = JSON.parse(controlePagina);
            if(!!controlePagina[pagina]){
                return controlePagina[pagina];
            }            
            return pagination;
        }
    }        

    isNullOrEmpty(value) {
        return value == null || value == "";
    }

}

export default new StorageService();