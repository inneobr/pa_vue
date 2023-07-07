<template>
  <div class="card">
    <div class="flex justify-content-between">
      <div class="grid align-items-center">
        <i class="pi pi-file" style="font-size: 1.4rem"></i>
        <h3 style="margin:0px 5px;">Laudo de inspeção</h3>    
      </div>         
    </div><hr />

    <div class="col-12 lg:col-10 grid">
      <div class="col-12 lg:col-2">
        <label for="estabelecimento"><strong>Estabelecimento</strong></label>
        <AutoComplete class="w-full mt-2"
            field="codNome"
            dropdown="true"            
            v-model="dados.estabelecimento"
            :suggestions="options.estabelecimentos"
            @complete="getEstabelecimento($event)"/>
      </div>

      <div class="col-12 lg:col-2">
        <label for="safra"><strong>Safra</strong></label> 
        <Dropdown class="w-full mt-2"
          v-model="dados.safra" 
          :options="options.safra"/>
      </div>

      <div class="col-12 lg:col-3">
        <label for="safra"><strong>Grupo Produto</strong></label> 
        <Dropdown class="w-full mt-2"
          optionLabel="fmCodigoDescription"
          v-model="dados.grupoProduto" 
          :options="options.grupoProdutos"/>
      </div>

      <div class="col-12 lg:col-2">
          <label><strong>Nº Ordem Campo</strong></label>
          <InputNumber class="w-full mt-2" v-model="dados.ordemCampo" />
      </div>

      <div class="col-12 lg:col-2">
          <label><strong>Nº Laudo</strong></label>
          <InputNumber class="w-full mt-2" v-model="dados.laudo" />
      </div>
      <div class="col-12 lg:col-1">
        <label><strong style="color: #fff">.</strong></label>
        <Button icon="pi pi-search" label="Filtrar" class="w-full p-button-outlined mt-2" autofocus @click="getItem()"/>
      </div>
    </div>

    <DataTable :value="database">
        <template #empty>
            Nenhum registro encontrado.
        </template> 

        <Column field="item" header="Cód. Item"/> 
    </DataTable>
    <Toast/>
  </div>
</template>

<script>
    import LaudoInspacaoService from '../../service/LaudoInspecaoCampoService';
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import SafraService from '../../service/SafraService';

    export default {
      data() {
          return {
            database: [],
            options: {},
            dados: {},

          }
      },

      mounted(){
        this.getSafras();
        this.getGrupoProduto();
      },

      methods: {
        getEstabelecimento(event) {
          const dados = !event.query.trim().length ? '001' : event.query;
          EstabelecimentoService.getEstabelecimentosPorCodigoOuDescricao(dados)
            .then(({ data }) => {
                if(data) {
                    this.options.estabelecimentos = data;                    
                }
            })
            .catch(error => {
                return;                
            });
        },

        getSafras(){
          SafraService.getTodasSafras()
            .then(({ data }) => {
                    this.options.safra = data;
            })
            .catch(error => {
              console.error(error);
              return;
            });
            this.safra = new Date().getFullYear();
        },

        getGrupoProduto(){
          GrupoProdutoService.getGruposTodosProdutoResumido()
            .then(({ data }) => {
              this.options.grupoProdutos = data;
            })
            .catch(error => {
              console.error(error);
              return;
            });
        },

        getItem(){
            LaudoInspacaoService.getCodigoItem(this.dados.safra, this.dados.ordemCampo, this.dados.laudo, this.dados.estabelecimento.codigo, this.dados.grupoProduto.fmCodigo)
                .then(({ data }) => {
                  this.database = data;
                })
                .catch(error => {
                    this.$toast.add({
                        severity:'error', 
                        detail: message, 
                        life: 3000
                    });
                    this.database = [];
                    return;
                });
        }
      }
    }
</script>