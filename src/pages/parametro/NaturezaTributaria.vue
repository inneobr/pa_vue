 <template>
    <NaturezaTributaria v-if="!isCadastro"/>
    <NaturezaTributariaForm v-if="isCadastro" :id="id"/>
 </template>
 
 <script>
    import NaturezaTributariaForm from '../../components/parametro/NaturezaTributariaForm.vue' ;
    import NaturezaTributaria from '../../components/parametro/NaturezaTributaria.vue' ;
    export default {
        components: { NaturezaTributaria, NaturezaTributariaForm },
        data() {
            return {
                id: null,
                isCadastro: false,
            }
        },
        methods: {
            validarRouter() {
                const routerName = this.$route.name
                if(routerName === 'natureza-tributaria-cadastrar') {
                    this.isCadastro = true;
                }
                else if(routerName === 'natureza-tributaria-editar') {
                    this.id = this.$route.params.id;
                    this.isCadastro = true;
                }
                else {
                    this.isCadastro = false;
                    this.id = null;
                }
            }
        },

        created() {
            this.validarRouter();
        },

        updated() {
            this.validarRouter();
        },
    }
 </script>