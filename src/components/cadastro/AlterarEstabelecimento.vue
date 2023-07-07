<template>
    <AutoComplete
        inputStyle="border-radius: 0;"
        field="label"
        v-model="selecionado"
        :placeholder="placeholder"
        :suggestions="filtrados"
        @complete="buscar"
        @item-select="selecionar"
        :dropdown="dropdown ? true : false"
    />    
</template>

<script>
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import StorageService from '../../service/StorageService';

    export default {
        emits: ['mensagemErro', 'sucesso'],

        props: {
			placeholder: {
				type: String,
				required: false
			},

            dropdown: {
                type: Boolean,
                required: false
            }
		},

        data() {
            return {
                codEstablecimento: null,

                estabelecimentos: [],
                selecionado: null,
                filtrados: []
            }
        },

        created() {
            const estabelecimento =  StorageService.getEstabelecimento();
            if(!!estabelecimento) {
                this.codEstablecimento = estabelecimento.codigo;
            }

            this.carregarEstabelecimentos();
        },

        methods: {
            carregarEstabelecimentos() {
                EstabelecimentoService.getEstabelecimentosPorEstabelecimentoDoUsuario(this.codEstablecimento)
                    .then(({ data }) => {
                        this.estabelecimentos = data.map(item => {
                            item["label"] = `${ item.codigo } - ${ item.razaoSocial}`;
                            return item;
                        });
                    });
            },

            buscar(event) {
                setTimeout(() => {
                    if(!event.query.trim().length) {
                        this.filtrados = this.estabelecimentos;
                    }
                    else {
						this.filtrados = this.estabelecimentos.filter((item) => {
							return item.label.toLowerCase().startsWith(event.query.toLowerCase());
						});
                    }
                }, 250);
            },

            selecionar() {
                if(this.selecionado) {
                    this.$store.dispatch("auth/confirmarLogin")
                        .then((data) => {
                            StorageService.setEstabelecimento(this.selecionado);
                            this.$router.push("/");
                            this.$emit('sucesso', data);
                        })
                        .catch(error => {
                            this.$emit('mensagemErro', 'Falha ao buscar informações do cooperado selecionado.');
                        });
                }
            }
        }
    }
</script>