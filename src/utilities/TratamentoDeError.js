const TratamentoDeError = ({ response }, isCadastro = true) => {
    const { fieldErrors, message, exception } = response.data;
    const msgPadrao = `Falha ao ${ isCadastro ? 'atualizar: ' : 'cadastrar: ' }`;
    const toast = {
        severity:'error',
        detail: msgPadrao + response.data,
        life: 10000
    }

    if(fieldErrors && fieldErrors.length > 0) {
        toast.summary = msgPadrao;
        toast.detail = 'Preencher os campos obrigatórios: ';
        
        for(let indice = 0; indice < fieldErrors.length; indice++) {
            const fieldError = fieldErrors[indice];
            
            if(indice < fieldErrors.length) {
                toast.detail += `${ fieldError.field } - ${ fieldError.message } `;
            }
            else {
                toast.detail += `${ fieldError.field } - ${ fieldError.message },`;
            }
        }
    }
    else if(!!exception && exception.indexOf("ConstraintViolationException") < 0) {
        toast.summary = msgPadrao;
        toast.detail = exception;
    }
    else if(!!message) {
        toast.summary = msgPadrao;
        toast.detail = message;
    }

    return toast;
}


export default TratamentoDeError;