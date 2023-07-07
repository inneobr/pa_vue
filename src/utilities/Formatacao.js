import moment from 'moment';
class Formatacao {
    
    formataCep(cep) {
        return cep.replace(/^(\d{2})(\d{3})(\d{3})$/, "$1.$2-$3");
    }

    formataCpf(cpf) {
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    }

    formataCnpj(cnpj) {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }
    
    formatCurrency(value) {
        if(value == null){
            value = 0;
        }
        return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    }
    
    formatDecimal(value, minimumFractionDigits = 2, maximumFractionDigits = 2) {
        if(value == null){
            value = 0;
        }
        return value.toLocaleString('pt-BR', {style: 'decimal', currency: 'BRL', 
            minimumFractionDigits: minimumFractionDigits, maximumFractionDigits: maximumFractionDigits});
    }

    formatDate(data) {                
        var options = { year: 'numeric', month: 'numeric', day: 'numeric' }; options.timeZone = 'UTC';             
        return data ? new Date(data).toLocaleDateString("pt-BR", options) : '';
    }

    formatDateCustom(data, format) {
        return data ? moment(data).format(format) : '';
    }

    convertStringToDate(dateString, format) {
        return !!dateString ? moment(dateString, format).toDate() : new Date();
    }

    subtrairDias(data, dias) {
        return data ? moment(data).subtract(dias, 'days').toDate() : '';
    }

    subtrairMeses(data, meses) {
        return data ? moment(data).subtract(meses, 'month').toDate() : '';
    }

    duracaoEntreDatas(dataInicial, dataFinal) {	
        const inicio = moment(dataInicial);
        const fim = moment(dataFinal);
        const duracao = moment.duration(inicio.diff(fim));
        const minutos = parseInt(duracao.asMinutes());
      
        if(minutos < 1) {
            const segundos = parseInt(duracao.asSeconds());
            return `há ${ segundos } segundo${ segundos > 1 ? 's' : '' }`;
        }
        if(minutos >= 1 && minutos < 60) {
            return `há ${ minutos } minuto${ minutos > 1 ? 's' : '' }`;
        }
        else if(minutos >= 60 && minutos < 1440) {
            const horas = parseInt(duracao.asHours());
            return `há ${ horas } hora${ horas > 1 ? 's' : '' }`;
        }
        else if(minutos >= 1440 && minutos < 10080) {
            const dias = parseInt(duracao.asDays());
            return `há ${ dias } dia${ dias > 1 ? 's' : '' }`;
        }
        else if(minutos >= 10080 && minutos < 43800) {
            const semanas = parseInt(duracao.asWeeks());
            return `há ${ semanas } semana${ semanas > 1 ? 's' : '' }`;
        }
        else if(minutos >= 43800 && minutos < 525600) {
            const meses = parseInt(duracao.asMonths());
            return `há ${ meses } ${ meses > 1 ? 'meses' : 'mês' }`;
        }
        else {
            const anos = parseInt(duracao.asYears());
            return `há ${ anos } ano${ anos > 1 ? 's' : '' }`;
        }
    }

    convertStringToNumber(numero) {

        /** Dados Possíveis e resultado esperado
         * 1,1       --> 1.1
         * 1.1        --> 1.1
         * 1.234,45   --> 1234.45
         * 1,234.45   --> 1234.45
         * 1234,45    --> 1234.45
         * 1234.45    --> 1234.45
         * 123.123,12 --> 123123.12
         * 123,123.12 --> 123123.12
         * 123.123.123,12 --> 123123.12
         * 123,123,123.12 --> 123123.12
         * 1          --> 1
         * 12         --> 12
         * 1.123,123,00 --> NaN
         * 1,111.111.00 --> Nan
         * 1.2.3        --> Nan
         * 1,1,2        --> NaN
         */

        if (numero === undefined || numero === null) {
            return NaN;
        }

        let numeroString = String(numero);

        let lastIndexPonto = numeroString.lastIndexOf('.');
        let lastIndexVirgula = numeroString.lastIndexOf(',');

        let qtdPontos = 0;
        let qtdVirgulas = 0;

        if (lastIndexPonto !== -1) {
            qtdPontos = (numeroString.match(/\./g) || []).length;
        }
        if (lastIndexVirgula !== -1) {
            qtdVirgulas = numeroString.match(new RegExp(/,/g) || []).length;
        }

        if (qtdPontos > 1) {
            //Se possui mais de 1 ponto (2 ou mais)
            if (qtdVirgulas == 1) {
                //precisa possuir 1 virgula e apenas 1 virgula
                if (lastIndexVirgula > lastIndexPonto) {
                //e a virgula precisa estar em último lugar, ou seja, ter o lastIndex da virgula maior que o lastIndex do ponto

                //Esta ok
            
                } else { return NaN }
            } else {return NaN }

        }

        if (qtdVirgulas > 1) {
            //Se possui mais de 1 virgula (Numero americano EX: 2,123,123.00)
            if (qtdPontos == 1) {
                //precisa possuir 1 ponto e apenas 1 ponto
                if (lastIndexPonto > lastIndexVirgula) {
                //e o ponto precisa estar em último lugar, ou seja, ter o lastIndex do ponto maior que o lastIndex da virgula indicando que é a parte decimal

                //Esta ok
            
                } else { return NaN }
            } else { return NaN }
        }


        if (lastIndexPonto === -1 && lastIndexVirgula === -1) {
            //Numero Inteiro sem ponto e sem virgula
            return parseFloat(numeroString);
        } else if (lastIndexPonto === -1 && lastIndexVirgula > 0) {
            //Número com apenas vírgula
            return parseFloat(numeroString.replace(',', '.'));
        } else if (lastIndexVirgula === -1 && lastIndexPonto > 0) {
            //Número com apenas pontos
            return parseFloat(numeroString);
        } else if (lastIndexVirgula > lastIndexPonto) {
            //Padrão Brasileiro
            //console.log('brasileiro');
            let numeroFormatado = numeroString.replace(/\./g, '').replace(',', '.');
            return parseFloat(numeroFormatado);
        } else if (lastIndexVirgula < lastIndexPonto) {
            //console.log('americano');
            //Padrão Americano
            let numeroFormatado = numeroString.replace(",", '');
            return parseFloat(numeroFormatado);
        }
    }


}

export default new Formatacao();