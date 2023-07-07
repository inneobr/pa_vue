<template>
    <div class="card">
        <Toast />

        <h5>{{ menuId ? 'Editar' : 'Criar' }} Menu</h5>

        <hr />

        <div class="grid">
            <div class="col-3">
                <label for="Label"><strong>Label</strong></label>
                <InputText class="w-full mt-1" id="Label" v-model="label" />
            </div>

            <div class="col-3">
                <label for="icon"><strong>Icon</strong></label>
                <InputText class="w-full mt-1" id="icon" v-model="icon" />
            </div>
            <div class="col-3">
                <label for="sequencia"><strong>Sequência</strong></label>
                <InputText class="w-full mt-1" id="sequencia" v-model="sequencia" />
            </div>
        </div>

        <hr />

        <div class="flex align-items-center">
            <Button label="Salvar" icon="pi pi-save" class="p-button p-component p-button-info" @click="salvar()" :disabled="doubleClick"/>
            <Button label="Cancelar" icon="pi pi-times" class="p-button p-component p-button-danger ml-2" @click="voltar()" />
        </div>
    </div>    
</template>

<script>
    import MenuService from '../../service/MenuService';

    export default {
        name: 'MenuForm',
        props: {
            menuId: {
                type: String,
                required: false
            },
        },
        data() {
            return {
                label: '',
                icon: '',  
                sequencia: null,         
                cancelarDialog: false
            }
        },
        created() {
            this.carregarDados();
        },
        methods: {            
            carregarDados() {
                if(!this.menuId) return;

                MenuService.getMenu(this.menuId)
                    .then(({ data }) => {
                        if(data) {
                            this.label = data.label;
                            this.icon = data.icon;
                            this.sequencia = data.sequencia;
                        }
                        else {
                            this.voltar();
                        }
                    })
                    .catch(error => {
                        this.voltar();
                    });
            },

            voltar() {
                this.$router.push(`/menus`);
            },
           
            getDados(){
                return {
                    label:  this.label,
                    icon:   this.icon,
                    sequencia: this.sequencia
                }
            },
            salvar() {
                const dados = this.getDados()

                if(this.menuId) {
                    dados['id'] = this.menuId;
                    this.atualizar(dados);
                }
                else {
                    this.cadastrar(dados);
                }
            },

            atualizar(dados) {
                MenuService.putMenu(dados)
                    .then(response => {
                        this.$toast.add({
                            severity:'success', 
                            summary: 'Sucesso', 
                            detail:'O menu foi atualizado!', 
                            life: 3000
                        });
                        this.voltar();
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'error', 
                            summary: 'Falha', 
                            detail:'O menu não foi atualizado!', 
                            life: 3000
                        });
                    });
            },

            cadastrar(dados) {
                MenuService.postMenu(dados)
                    .then(response => {
                        this.limparCampos();
                        this.$toast.add({
                            severity:'success', 
                            summary: 'Sucesso',
                            detail:'O menu foi cadastrado!',
                            life: 3000
                        });
                        this.voltar();
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'error',
                            summary: 'Falha',
                            detail:'O menu não foi cadastrado!',
                            life: 3000
                        });
                    });
            },

            limparCampos() {
                this.label = "";
                this.icon = "";
                this.sequencia = null;
            }
        }
    }
</script>
