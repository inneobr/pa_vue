<template>
    <div class="card">
        <Toast />
        <div class="flex justify-content-between">
            <div class="flex align-items-center">
                <i class="pi pi-qrcode mr-2" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Entrada de Produção</h3>
            </div>  
        </div>

        <hr />
        <Message v-if="service.msg_active" :severity="service.msg_type" :closable="true">{{ service.msg_content }}</Message> 
        
        <div class="grid p-fluid formgrid">
            <div class="col-12 sm:col-6 md:col-6 lg:col-4 xl:col-3">
                <div class="field">
                    <label><strong>Estabelecimento<span style="color:red;">&nbsp;*</span></strong></label>                
                    <AutoComplete 
                        :dropdown="true"
                        class="w-full"
                        field="codigoNomeFantasia"
                        placeholder="Informe o código ou o nome fantasia."
                        v-model="estabelecimentoSelecionado"
                        :disabled="true"
                        :forceSelection="true"
                        :suggestions="estabelecimentosFiltro"
                        @complete="carregarEstabelecimentos($event)"
                        @item-select="selecionarEstabelecimento()"/>
                </div>
            </div>                    

            <div class="col-12 sm:col-6 md:col-6 lg:col-4 xl:col-3">
                <div class="field">
                    <label for="grupo"><strong>Grupo Produto<span style="color:red;">&nbsp;*</span></strong></label> 
                        <AutoComplete
                            :dropdown="true"
                            class="w-full"
                            placeholder="Informe o código ou a descrição."
                            field="codigoDescricao"
                            :disabled="service.disable || id" 
                            v-model="grupoProdutoSelecionado"  
                            :forceSelection="true"
                            :suggestions="grupoProdutosFiltro"
                            @complete="carregarGrupoProduto($event)"
                            @item-select="selecionarGrupoProduto"/>
                    </div>
            </div> 

            <div class="col-6 sm:col-2 md:col-2 lg:col-2 xl:col-1">
                <div class="field">
                    <label for="placa"><strong>Placa<span style="color:red;">&nbsp;*</span></strong></label>
                    <InputText class="w-full uppercase" v-model="database.placa" @keyup="removerCaracteresEspeciais" :maxlength="10" :disabled="service.disable || id || camposDesabilitados.placa"/>
                </div>
            </div>    

            <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-2">
                <div class="field">
                    <label for="nrDocPes"><strong>Doc. Pesagem<span style="color:red;">&nbsp;*</span></strong></label>
                    <InputNumber class="w-full" v-model="database.nrDocPes" mode="decimal" :min="0" :max="2147483647" locale="pt-BR" :disabled="service.disable || ticket || id" />
                </div>
            </div>

            <div class="col-12 sm:col-7 md:col-6 lg:col-4 xl:col-3">
                <ProdutorFiltro
                    :disabled="service.disable || id"
                    :campoObrigatorio="true"
                    :selecionado="produtorSelecionado"
                    :paginacao="produtorConsulta"
                    @pesquisar="pesquisarProdutor"
                    @selecionado="selecionarProdutor"
                />
            </div>

            <div v-if="cooperative" class="col-12 sm:col-12 md:col-4 lg:col-4 xl:col-3">
                <div class="field">
                    <label for="nomeProdutor"><strong>Nome Produtor<span style="color:red;">&nbsp;*</span></strong></label>
                    <InputText class="w-full uppercase"  v-model="database.nomeProd" maxlength="40" :disabled="service.disable || id" />
                </div>
            </div> 
        </div>
    </div>

    <div class="card">
        <TabView>
            <TabPanel>
                <template #header>
                    <i class="pi pi-box mr-2" style="font-size: 1rem;"></i>
                    <span>Dados de recebimento</span>
                </template>
                <div class="grid p-fluid formgrid align-items-center">
                    <div class="col-6 sm:col-2 md:col-2 lg:col-2 xl:col-2">
                        <div class="field">
                            <label for="dtEntrada"><strong>Data Entrada<span style="color:red;">&nbsp;*</span></strong></label>
                            <Calendar class="w-full" v-model="database.dtEntrada" dateFormat="dd/mm/yy" :disabled="service.disable || ticket || id" inputId="icon" :showIcon="true"  :maxDate="new Date()" />
                        </div>
                    </div> 

                    <div class="col-6 sm:col-2 md:col-2 lg:col-2 xl:col-2">
                        <div class="field">
                            <label for="hrEntrada"><strong>Hora Entrada<span style="color:red;">&nbsp;*</span></strong></label>
                            <InputMask 
                                class="w-full"
                                v-model="database.hrEntrada"
                                mask="99:99:99"
                                :disabled="service.disable || ticket || id"
                                @change="validarHora"
                            />
                        </div>
                    </div> 

                    <div class="col-12 sm:col-4 md:col-2 lg:col-2 xl:col-2">
                        <div class="field">
                            <label for="tulha"><strong>Tulha / Moega</strong></label>
                            <InputText class="w-full"  v-model="database.tulha" maxlength="15" :disabled="service.disable"/>
                        </div>
                    </div>

                    <div class="col-12 sm:col-6 md:col-4 lg:col-3 xl:col-3">
                        <div class="field">
                            <label for="imovel"><strong>Nome Imóvel<span style="color:red;">&nbsp;*</span></strong></label>
                            <AutoComplete                                
                                field="matriculaNomeCadpro"                                
                                :dropdown="true" 
                                class="w-full"
                                @complete="carregarImovel($event)"
                                placeholder="Informe a matrícula ou a descrição."
                                v-model="imovelSelecionado"
                                @item-select="setImovel()"
                                :suggestions="imoveisFiltro"
                                :forceSelection="true"
                                :disabled="!produtorSelecionado.codProdutor || service.disable"/> 
                        </div>
                    </div>

                    <div class="col-12 sm:col-6 md:col-2 lg:col-3 xl:col-3">
                        <div class="field">
                            <label for="motorista"><strong>Motorista</strong></label>
                            <InputText class="w-full" v-model="database.motorista" :disabled="service.disable || camposDesabilitados.motorista" maxlength="40"/>
                        </div>
                    </div>
                    
                    <div class="col-12 sm:col-6 md:col-6 lg:col-4 xl:col-3" v-if="grupoProduto && grupoProduto.logTransgenico">
                        <div class="field">
                            <label for="gmo"><strong>Tipo GMO<span style="color:red;">&nbsp;*</span></strong></label>
                            <AutoComplete
                                class="w-full"
                                field="tipoGmo"
                                :dropdown="true"
                                placeholder="Informe o Tipo GMO."
                                @complete="carregarTipoGmo($event)"
                                @item-select="selecionarTipoGmo"
                                v-model="tipoGmoSelecionado"
                                :disabled="service.disable"
                                :forceSelection="true"
                                :suggestions="tiposGmoFiltro"/>
                        </div>
                    </div>

                    <div class="col-12 sm:col-6 md:col-6 lg:col-4 xl:col-2" v-if="grupoProduto && grupoProduto.logTransgenico">
                        <div class="field">
                            <label><strong>Soja GMO<span style="color:red;">&nbsp;*</span></strong></label> 
                            <div class="flex">
                                <div class="mr-2"> 
                                    <RadioButton name="tipoGmo" value="Testada" v-model="database.tipoRr" :disabled="!tipoGmoSelecionado || service.disable"/>
                                    <label class="m-2" for="tipoGmo">Testada</label>
                                </div>
                                <div> 
                                    <RadioButton name="tipoGmo" value="Declarada" v-model="database.tipoRr" :disabled="!tipoGmoSelecionado || service.disable"/>
                                    <label class="m-2" for="tipoGmo">Declarada</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 sm:col-6 md:col-6 lg:col-4 xl:col-2" v-if="grupoProduto && grupoProduto.cafeCoco">  
                        <div class="field">
                            <label><strong>Tipo Renda Café<span style="color:red;">&nbsp;*</span></strong></label>
                            <div class="flex">
                                <div class="mr-2"> 
                                    <RadioButton name="renda-cafe" value="Renda Real" v-model="database.tipoRendaCfe" :disabled="service.disable" />
                                    <label class="m-2" for="renda-cafe">Renda real</label>
                                </div>

                                <div> 
                                    <RadioButton name="renda-cafe" value="Renda Manual" v-model="database.tipoRendaCfe" :disabled="service.disable" /> 
                                    <label class="m-2" for="renda-cafe">Renda manual</label>  
                                </div>                                  
                            </div> 
                        </div>
                    </div>

                    <div class="col-6 sm:col-6 md:col-4 lg:col-2 xl:col-2">
                        <div class="field-checkbox mt-3">
                            <Checkbox v-model="database.prodPadr" :binary="true" :disabled="service.disable" @change="selecionarProdutoPadronizado" />
                            <label for="entSafraAnt">Produto Padronizado</label>
                        </div>
                    </div>

                    <div class="col-6 sm:col-6 md:col-4 lg:col-2 xl:col-2">
                        <div class="field-checkbox mt-3">
                            <Checkbox v-model="database.descarUnid" :binary="true" :disabled="service.disable" />
                            <label for="descarUnid">Não Descar. Unidade</label>
                        </div>
                    </div>
                    
                    <Fieldset class="col-12" legend="Semente" :toggleable="false" v-if="grupoProduto && grupoProduto.semente">
                        <div class="grid">
                            <div class="col-6 xl:col-3">
                                <label for="nrOrdCampo">
                                    <strong>Nr. Odem Campo<span style="color:red;">&nbsp;*</span></strong>
                                </label>
                                <InputNumber class="w-full mt-2" id="nrOrdCampo" v-model="database.nrOrdCampo" locale="pt-BR" :min="0" :max="999999999999" :disabled="service.disable" />
                            </div>

                            <div class="col-6 xl:col-3">
                                <div class="field">
                                    <label for="classe"><strong>Classe<span style="color:red;">&nbsp;*</span></strong></label>
                                    <AutoComplete 
                                        :dropdown="true"
                                        class="w-full"
                                        field="codigoDescricao"
                                        placeholder="Informe o código ou a descrição."
                                        v-model="classeSelecionado"                           
                                        :suggestions="classesFiltro"
                                        :disabled="service.disable"
                                        :forceSelection="true"
                                        @complete="carregarClasses($event)"
                                        @item-select="selecionarClasse()"
                                    />
                                </div>
                            </div>

                            <div class="col-6 xl:col-2">
                                <label for="nrLaudo">
                                    <strong>Nr.Laudo Insp. Campo<span style="color:red;">&nbsp;*</span></strong>
                                </label>
                                <InputNumber class="w-full mt-2" id="nrLaudo" v-model="database.nrLaudo" locale="pt-BR" :min="0" :max="999999999999" :disabled="service.disable" />
                            </div>

                            <div class="col-6 xl:col-2">
                                <label>
                                    <strong>Controle UBS</strong>
                                </label>
                                <InputText class="w-full mt-2" v-model="item.classificacaoItem.controleSemente.valor" :disabled="service.disable || item.classificacaoItem.controleSemente.desabilitado"/>
                            </div>

                            <div class="col-6 xl:col-2">
                                <label for="nrContSem"><strong>Nr. Controle Semente<span style="color:red;">&nbsp;*</span></strong></label>
                                <InputText class="w-full mt-2" id="nrContSem" v-model="database.nrContSem" maxlength="12" :disabled="service.disable" />
                            </div>
                        </div>
                    </Fieldset>

                    <Fieldset class="col-12" legend="observações" :toggleable="false"> 
                        <Textarea class="col-12" v-model="database.observacoes" rows="2" :disabled="service.disable"></textarea>
                    </Fieldset>
                </div>
            </TabPanel>

            <TabPanel>
                <template #header>
                    <i class="pi pi-bars mr-2" style="font-size: 1rem;"></i>
                    <span>Dados do Produto</span>
                </template>
                <div class="p-fluid grid formgrid">

                    <div class="col-12 sm:col-6 md:col-6 lg:col-6 xl:col-4">
                        <div class="field">
                            <label><strong>Produto<span style="color:red;">&nbsp;*</span></strong></label>
                            <AutoComplete
                                class="w-full"
                                placeholder="Informe o código ou a descrição."
                                field="codigoDescricao"
                                v-model="item.produto"
                                :suggestions="produtos"
                                :forceSelection="true"
                                :dropdown="true"
                                :disabled="service.disable"
                                @complete="carregarProdutos($event)"
                            />
                        </div>
                    </div>

                    <div class="col-12 sm:col-6 md:col-6 lg:col-3 xl:col-2">
                        <div class="field">
                            <label><strong>Lote</strong></label>
                            <InputText class="w-full" v-model="item.lote.value" :disabled="service.disable || item.lote.desabilitado || !item.produto" />
                        </div>
                    </div>

                    <div class="col-12 sm:col-6 md:col-6 lg:col-3 xl:col-2">
                        <div class="field">
                            <label><strong>Referência</strong></label>
                            <InputText class="w-full" v-model="item.referencia.valor" :disabled="true"/>
                        </div>
                    </div>
                </div>

                <div class="grid">
                    <div class="col-12 sm:col-12 md:col-6 lg:col-5 xl:col-4">
                        <Fieldset :toggleable="false">
                            <template #legend>
                                <strong>Qualidade Produto<span style="color:red;" v-if="!item.qualidade.desabilitado">&nbsp;*</span></strong>
                            </template>

                            <div class="grid">
                                <div class="col-6">
                                    <div class="field-checkbox">
                                        <Checkbox :binary="true" v-model="item.qualidade.normal" :disabled="service.disable || item.qualidade.desabilitado || !item.produto" />
                                        <label>
                                            <strong>Normal</strong>
                                        </label>
                                    </div>
                                </div>

                                <div class="col-6">
                                    <div class="field-checkbox">
                                        <Checkbox :binary="true" v-model="item.qualidade.terra" :disabled="service.disable || item.qualidade.desabilitado || !item.produto" />
                                        <label>
                                            <strong>Terra</strong>
                                        </label>
                                    </div>
                                </div>

                                <div class="col-6">
                                    <div class="field-checkbox">
                                        <Checkbox binary="true" v-model="item.qualidade.sementeira" :disabled="service.disable || item.qualidade.desabilitado || !item.produto" />
                                        <label>
                                            <strong>Sementeira</strong>
                                        </label>
                                    </div>
                                </div>

                                <div class="col-6">
                                    <div class="field-checkbox">
                                        <Checkbox binary="true" v-model="item.qualidade.vagem" :disabled="service.disable || item.qualidade.desabilitado || !item.produto" />
                                        <label>
                                            <strong>Vagem</strong>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </Fieldset>
                    </div>

                    <div class="col-12 sm:col-12 md:col-6 lg:col-7 xl:col-8">
                        <Fieldset :toggleable="false">
                            <template #legend>
                                <strong>Desmembramento</strong>
                            </template>

                            <div class="grid">
                                <div class="col-3">
                                    <div class="field-checkbox">
                                        <Checkbox binary="true" v-model="item.desmembramento.desmembrar" :disabled="service.disable || desabilitarDesmembramento || database.prodPadr || !item.produto" @change="selecionarDesmembramento" />
                                        <label>
                                            <strong>Desmembrar</strong>
                                        </label>
                                    </div>
                                </div>

                                <div class="col-3">
                                    <div class="field-radiobutton">
                                        <RadioButton name="desmembramento" value="PERCENTUAL" v-model="item.desmembramento.desmembrarPor" :disabled="service.disable || !item.desmembramento.desmembrar || !item.produto" @change="atualizarTotalizadoresDesmembramento()" />
                                        <label>
                                            <strong>Percentual</strong>
                                        </label>
                                    </div>
                                </div>

                                <div class="col-3">
                                    <div class="field-radiobutton">
                                        <RadioButton name="desmembramento" value="QUILOS" v-model="item.desmembramento.desmembrarPor" :disabled="service.disable || !item.desmembramento.desmembrar || !item.produto" @change="atualizarTotalizadoresDesmembramento()" />
                                        <label>
                                            <strong>Quilos</strong>
                                        </label>
                                    </div>
                                </div>

                                <div class="col-3">
                                    <div class="field-radiobutton">
                                        <RadioButton name="desmembramento" value="SACAS" v-model="item.desmembramento.desmembrarPor" :disabled="service.disable || !item.desmembramento.desmembrar || !item.produto" @change="atualizarTotalizadoresDesmembramento()" />
                                        <label>
                                            <strong>Sacas</strong>
                                        </label>
                                    </div>
                                </div>

                                <div class="flex align-items-center">
                                    <div class="mr-2">
                                        <label for="pesoBruto"><strong>Desmembrar pelo(a):</strong></label>
                                    </div>
                                    <div class="flex-grow-1">
                                        <AutoComplete 
                                            :dropdown="true"
                                            style="width: 250px;"
                                            field="descricao"
                                            v-model="item.desmembramento.desmembrarPelo"
                                            :disabled="service.disable || !item.desmembramento.desmembrar || desabilitarDesmembramentoPelo || !item.produto"
                                            :suggestions="tipoDesmembramento"
                                            :forceSelection="true"
                                            @complete="carregarTiposDesmembramento($event)"
                                            @item-select="atualizarTotalizadoresDesmembramento()"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Fieldset>
                    </div>
                </div>

                <Fieldset :toggleable="false">
                    <template #legend>
                        <strong>Classificação Item</strong>
                    </template>

                    <div class="grid align-items-center">
                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 label">
                            <label>
                                <strong>% Impureza:</strong>
                            </label>
                        </div>
                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 field campo">
                            <InputNumber class="w-full" v-model="item.classificacaoItem.impureza.valor" mode="decimal" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="999" :disabled="service.disable || item.classificacaoItem.impureza.desabilitado || !item.produto" />
                        </div>


                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 label">
                            <label>
                                <strong>% Teor de Umidade:</strong>
                            </label>
                        </div>
                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 field campo">
                            <InputNumber class="w-full" v-model="item.classificacaoItem.teorUmidade.valor" mode="decimal" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="999" :disabled="service.disable || item.classificacaoItem.teorUmidade.desabilitado || !item.produto" />
                        </div>


                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 label">
                            <label>
                                <strong>% Chuvado/Avariado:</strong>
                            </label>
                        </div>
                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 field campo">
                            <InputNumber class="w-full" v-model="item.classificacaoItem.chuvadoAvariado.valor" mode="decimal" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="999" :disabled="service.disable || item.classificacaoItem.chuvadoAvariado.desabilitado || !item.produto" />
                        </div>


                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 label">
                            <label>
                                <strong>Trig/Band/Milho:</strong>
                            </label>
                        </div>
                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 field campo">
                            <InputNumber class="w-full" v-model="item.classificacaoItem.tbm.valor" mode="decimal" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="999" :disabled="service.disable || item.classificacaoItem.tbm.desabilitado || !item.produto" />
                        </div>

                        
                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 label">
                            <label>
                                <strong>PH Entrada:</strong>
                            </label>
                        </div>
                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 field campo">
                            <InputNumber class="w-full" v-model="item.classificacaoItem.phEntrada.valor" locale="pt-BR" :min="0" :max="9999999" :disabled="service.disable || item.classificacaoItem.phEntrada.desabilitado || !item.produto" />
                        </div>


                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 label">
                            <label>
                                <strong>% Bandinha:</strong>
                            </label>
                        </div>
                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 field campo">
                            <InputNumber class="w-full" v-model="item.classificacaoItem.bandinha.valor" mode="decimal" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="999" :disabled="service.disable || item.classificacaoItem.bandinha.desabilitado || !item.produto" />
                        </div>

                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 label">
                            <label>
                                <strong>FNT:</strong>
                            </label>
                        </div>
                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 field campo">
                            <InputNumber class="w-full" v-model="item.classificacaoItem.fnt.valor" mode="decimal" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="9999999" :disabled="service.disable || item.classificacaoItem.fnt.desabilitado || !item.produto"/>
                        </div>

                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 label">
                            <label>
                                <strong>Densidade:</strong>
                            </label>
                        </div>
                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 field campo">
                            <InputNumber class="w-full" v-model="item.classificacaoItem.densidade.valor" locale="pt-BR" :min="0" :max="9999999" :disabled="service.disable || item.classificacaoItem.densidade.desabilitado || !item.produto"/>
                        </div>

                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 label">
                            <label>
                                <strong>Qt. Taxa Recepção:</strong>
                            </label>
                        </div>
                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 field campo">
                            <InputNumber class="w-full" v-model="item.classificacaoItem.qtTaxaRecepcao.valor" mode="decimal" locale="pt-BR" :minFractionDigits="4" :maxFractionDigits="4" :min="0" :max="9999999" :disabled="true"/>
                        </div>


                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 label">
                            <label>
                                <strong>Qt. Taxa Secagem:</strong>
                            </label>
                        </div>
                        <div class="col-6 sm:col-3 md:col-2 lg:col-2 xl:col-1 field campo">
                            <InputNumber class="w-full" v-model="item.classificacaoItem.qtTaxaSecagem.valor" mode="decimal" locale="pt-BR" :minFractionDigits="4" :maxFractionDigits="4" :min="0" :max="9999999" :disabled="true"/>
                        </div>
                    </div>
                </Fieldset>
            </TabPanel>

            <TabPanel>
                <template #header>
                    <i class="pi pi-file mr-2" style="font-size: 1rem;"></i>
                    <span>Nota do Produtor</span>
                </template>

                <div class="grid p-fluid formgrid">
                    <div class="col-12 sm:col-3 md:col-3 lg:col-2 xl:col-2">
                        <div class="field">
                            <label for="nrNfProd"><strong>Nota do Produtor</strong></label>
                            <InputNumber
                                class="w-full"
                                v-model="database.nrNfProd"
                                mode="decimal"
                                locale="pt-BR"
                                :min="0"
                                :max="99999999999999"
                                :disabled="service.disable || isEmiteNotaPropria"/>
                        </div>
                    </div>

                    <div class="col-4 sm:col-2 md:col-2 lg:col-1 xl:col-1">
                        <div class="field">
                            <label><strong>Série</strong></label>
                            <InputText class="w-full uppercase" v-model="database.serNfProd" :maxlength="3" @keyup="removerCaracteresEspeciais" :disabled="service.disable || isEmiteNotaPropria" />
                        </div>
                    </div>

                    <div class="col-8 sm:col-2 md:col-3 lg:col-2 xl:col-2">
                        <div class="field">
                            <label><strong>Data Emissão</strong></label>
                            <Calendar class="w-full" v-model="database.dtNfProd" dateFormat="dd/mm/yy" :maxDate="new Date()" :disabled="service.disable || isEmiteNotaPropria"/>
                        </div>
                    </div>
                </div>

                <Fieldset legend="PJ Nota Própria" :toggleable="false">
                    <div class="grid p-fluid formgrid">
                        
                        <div class="col-12">
                            <div class="field">
                                <div class="field-checkbox">
                                    <Checkbox inputId="emite-nota-propria" :binary="true" v-model="isEmiteNotaPropria" :disabled="true" />
                                    <label for="emite-nota-propria">
                                        <strong>Emite Nota Própria</strong>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 sm:col-3 md:col-3 lg:col-2 xl:col-2">
                            <div class="field">
                                <label for="pjNroNota"><strong>Nr. Nota Fiscal</strong></label>
                                <InputText class="w-full" v-model="database.pjNroNota" :maxlength="7" @keyup="aceitarApenasNumeros" @change="setFields()" :disabled="service.disable || !isEmiteNotaPropria" />
                            </div>
                        </div>

                        <div class="col-4 sm:col-2 md:col-1 lg:col-1 xl:col-1">
                            <div class="field">
                                <label for="pjSerie"><strong>Série</strong></label>
                                <InputText class="w-full uppercase" v-model="database.pjSerie" :maxlength="3" @keyup="removerCaracteresEspeciais" @change="setFields()" :disabled="service.disable || !isEmiteNotaPropria" />
                            </div>
                        </div>

                        <div class="col-8 sm:col-3 md:col-3 lg:col-2 xl:col-2">
                            <div class="field">
                                <label for="pjDtEmissao"><strong>Data Emissão</strong></label>
                                <Calendar class="w-full" v-model="database.pjDtEmissao" dateFormat="dd/mm/yy" @hide="setFields()" :maxDate="new Date()" :disabled="service.disable || !isEmiteNotaPropria" />
                            </div>
                        </div> 

                        <div class="col-4 sm:col-3 md:col-3 lg:col-2 xl:col-2">
                            <div class="field">
                                <label for="pjNatOperacao"><strong>Nat. Operação</strong></label>
                                <InputText class="w-full" v-model="database.pjNatOper" :disabled="true" />
                            </div>
                        </div>

                        <div class="col-4 sm:col-2 md:col-3 lg:col-2 xl:col-1">
                            <div class="field">
                                <label for="pjVlTotNota"><strong>Valor Total</strong></label>
                                <InputNumber class="w-full" v-model="database.pjVlTotNota" mode="decimal" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="999999999" :disabled="service.disable || !isEmiteNotaPropria" />
                            </div>
                        </div>

                        <div class="col-4 sm:col-2 md:col-3 lg:col-2 xl:col-1">
                            <div class="field">
                                <label for="pjQtTotNota"><strong>Qtd. Total</strong></label>
                                <InputNumber class="w-full" v-model="database.pjQtTotNota" mode="decimal" locale="pt-BR" :minFractionDigits="0" :maxFractionDigits="2" :min="0" :max="999999999" :disabled="service.disable || !isEmiteNotaPropria" />
                            </div>
                        </div>
                    </div>

                    <Fieldset legend="Chave de acesso" :toggleable="false" v-if="isEmiteNotaPropria">
                        <div class="grid p-fluid formgrid">
                            <div class="col-6 sm:col-2 md:col-2 lg:col-1 xl:col-1">
                                <div class="field">
                                    <label><strong>UF</strong></label>
                                    <InputMask class="w-full" v-model="chave.uf" mask="99" :disabled="true" />
                                </div>
                            </div>  
                                
                            <div class="col-6 sm:col-2 md:col-2 lg:col-1 xl:col-1">
                                <div class="field">
                                    <label><strong>AAMM</strong></label>
                                    <InputMask class="w-full" v-model="chave.aamm" mask="9999" :disabled="true" />
                                </div>
                            </div> 

                            <div class="col-6 sm:col-3 md:col-3 lg:col-2 xl:col-2">
                                <div class="field">
                                    <label><strong>CNPJ</strong></label>
                                    <InputText class="w-full" v-model="chave.cnpj" :disabled="true" />
                                </div>
                            </div> 

                            <div class="col-6 sm:col-2 md:col-2 lg:col-1 xl:col-1">
                                <div class="field">
                                    <label><strong>MÓD</strong></label>
                                    <InputText class="w-full" v-model="chave.mod" :disabled="true" />
                                </div>
                            </div> 

                            <div class="col-2 sm:col-2 md:col-1 lg:col-1 xl:col-1">
                                <div class="field">
                                    <label><strong>SÉRIE</strong></label>
                                    <InputText class="w-full" v-model="chave.serie" :disabled="true" />
                                </div>
                            </div> 

                            <div class="col-6 sm:col-3 md:col-3 lg:col-2 xl:col-2">
                                <div class="field">
                                    <label><strong>NF-e</strong></label>
                                    <InputText class="w-full" v-model="chave.nfe" :disabled="true" />
                                </div>
                            </div> 

                            <div class="col-2 sm:col-2 md:col-1 lg:col-1 xl:col-1">
                                <div class="field">
                                    <label><strong>F.NF-e</strong></label>
                                    <InputMask class="w-full" v-model="chave.fnfe" mask="9" :disabled="service.disable || !isEmiteNotaPropria" />
                                </div>
                            </div> 

                            <div class="col-6 sm:col-3 md:col-3 lg:col-2 xl:col-2">
                                <div class="field">
                                    <label><strong>CÓD</strong></label>
                                    <InputMask class="w-full" v-model="chave.cod" mask="99999999" :disabled="service.disable || !isEmiteNotaPropria" />
                                </div>
                            </div> 

                            <div class="col-2 sm:col-2 md:col-1 lg:col-1 xl:col-1">
                                <div class="field">
                                    <label><strong>DV</strong></label>
                                    <InputMask class="w-full" v-model="chave.dv" mask="9" :disabled="service.disable || !isEmiteNotaPropria" />
                                </div>
                            </div>
                        </div>
                    </Fieldset>
                </Fieldset>
            </TabPanel>

            <TabPanel v-if="item.desmembramento.desmembrar && !!item.desmembramento.desmembrarPor && !!item.desmembramento.desmembrarPelo">
                <template #header>
                    <i class="pi pi-file mr-2" style="font-size: 1rem;"></i>
                    <span>Desmembramento</span>
                </template>

                <Message severity="info" :closable="false">Para realizar o desmembramento deve preencher todos os campos obrigatórios da RE Pendente, pois, os campos serão bloqueados.</Message>
                <Message severity="warn" v-if="alertaDesmembramentoCamposObrigatorios" @close="alertaDesmembramentoCamposObrigatorios = false">{{ alertaDesmembramentoMensagem }}</Message>

                <DataTable showGridlines
                    responsiveLayout="scroll"
                    scrollDirection="both"
                    :loading="loading"
                    :value="desmembramentos">

                    <template #empty>
                        Nenhum registro encontrado.
                    </template>

                    <template #loading>
                        Carregando... Por favor, aguarde.
                    </template>

                    <Column style="width:8rem;" field="produtorFavorecido.codProdutor" header="Produtor" />
                    <Column field="produtorFavorecido.nome" header="Nome Abreviado" />
                    <Column field="produtorFavorecidoNome" header="Nome Produtor Favorecido" />
                    <Column field="imovel.matriculaNome" header="Imóvel" />
                    <Column field="nfProdutor" header="NF. Produtor" />

                    <Column style="width:10rem; text-align: right;" header="Percentual" v-if="item.desmembramento.desmembrarPor === 'PERCENTUAL'">
                        <template #body="{ data }">
                            {{ formatDecimal(data.percentual, 4, 4) }} %
                        </template> 
                    </Column>

                    <Column style="width:10rem; text-align: right;" header="Qtd Quilos" v-if="item.desmembramento.desmembrarPor === 'QUILOS'">
                        <template #body="{ data }">
                            {{ formatDecimal(data.quantidadeQuilos, 0, 0) }} Kg
                        </template> 
                    </Column>

                    <Column style="width:10rem; text-align: right;" field="" header="Qtd. Sacas" v-if="item.desmembramento.desmembrarPor === 'SACAS'">
                        <template #body="{ data }">
                            {{ formatDecimal(data.quantidadeSacas, 4, 4) }} Sc
                        </template> 
                    </Column>

                    <Column style="width:7rem; text-align: center;" header="Ações">
                        <template #body="{ data, index }">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-info flex-none p-2 mr-2" title="Editar" @click="editarDesmembramento(data, index)"></Button>
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger flex-none p-2" title="Excluir" @click="excluirDesmembramento(index)"></Button>
                        </template>            
                    </Column>

                    <ColumnGroup type="footer">
                        <Row>
                            <Column footerStyle="text-align: center;">
                                <template #footer>
                                    <Button icon="pi pi-plus" class="p-button-info w-full" title="Incluir" label="Incluir" @click="incluirDesmembramento()"></Button>
                                </template>
                            </Column>
                            <Column footer="Total Desmembramento:" :colspan="4" footerStyle="text-align: right; font-weight: bold;" />
                            <Column footerStyle="text-align: right; font-weight: bold;" v-if="item.desmembramento.desmembrarPor === 'PERCENTUAL'">
                                <template #footer>
                                    {{ formatDecimal(desmembramentoTotalLancadoPercentual, 4, 4) }} %
                                </template>
                            </Column>
                            <Column footerStyle="text-align: right; font-weight: bold;" v-if="item.desmembramento.desmembrarPor === 'QUILOS'">
                                <template #footer>
                                    {{ formatDecimal(desmembramentoTotalLancadoQuilos, 0, 0) }} Kg
                                </template>
                            </Column>
                            <Column footerStyle="text-align: right; font-weight: bold;" v-if="item.desmembramento.desmembrarPor === 'SACAS'">
                                <template #footer>
                                    {{ formatDecimal(desmembramentoTotalLancadoSacas, 4, 4) }} Sc
                                </template>
                            </Column>
                            <Column/>
                        </Row>
                    </ColumnGroup>

                </DataTable>
            </TabPanel>            
        </TabView>  

        <hr />

        <Fieldset class="col-12 p-fluid formgrid pt-0 pb-0" legend="Balança" :toggleable="false">
            <div class="grid">
                <div class="col-6 xl:col-3">
                    <div class="field">
                        <label for="pesoBruto"><strong>Peso Bruto (Kg)<span style="color:red;">&nbsp;*</span></strong></label>
                        <InputNumber class="w-full" id="pesoBruto" v-model="database.pesoBruto" @blur="setTotal($event)" :min="0" :max="9999999" :disabled="service.disable || camposDesabilitados.pesoBruto" locale="pt-BR"/>
                    </div>
                </div>

                <div class="col-6 xl:col-3">
                    <div class="field">
                        <label for="taraVeiculo"><strong>Tara Veículo (Kg)<span style="color:red;">&nbsp;*</span></strong></label>
                        <InputNumber class="w-full" id="taraVeiculo" v-model="database.taraVeiculo" @blur="setTotal($event)" :min="0" :max="9999999" :disabled="service.disable || camposDesabilitados.taraVeiculo" locale="pt-BR"/>
                    </div>
                </div>

                <div class="col-6 xl:col-3">
                    <div class="field">
                        <label for="taraSacaria"><strong>Tara Sacaria (Kg)</strong></label>
                        <InputNumber class="w-full" id="taraSacaria" @blur="setTotal($event)" v-model="database.taraSacaria" :min="0" :max="9999999" :disabled="service.disable || camposDesabilitados.taraSacaria" locale="pt-BR"/>
                    </div>
                </div>

                <div class="col-6 xl:col-3">
                    <div class="field">
                        <label for="pesoLiquido"><strong>Peso Liquido (Kg)</strong></label>
                        <InputNumber class="w-full" id="pesoLiquido" locale="pt-BR" :min="0" :max="9999999" v-model="database.pesoLiquido" :disabled="true"/>
                    </div>
                </div>
            </div>
        </Fieldset>

        <hr />

        <div class="flex">
            <Button
                icon="pi pi-save"
                label="Salvar"
                class="p-button-info"
                :disabled="doubleClick"
                @click="salvar"/>

            <Button
                icon="pi pi-times"
                label="Cancelar"
                class="p-button-danger ml-2"
                @click="voltar"/>

            
        </div>
    </div>

    <Dialog v-model:visible="desmembramentoDialog" :style="{width: '600px', margin: '10%'}" :modal="true" @hide="fecharDesmembramentoDialog()">
        <template #header>
            <div class="flex align-items-center mt-2">
                <i class="pi pi-check-square mr-2" style="font-size: 1.5rem;"></i>
                <h4 style="margin:0;">Desmembramento</h4>                
            </div> 
        </template>

        <hr/>

        <div class="grid p-fluid formgrid">
            <div class="col-12">  
                <ProdutorFiltro
                    :campoObrigatorio="true"
                    :selecionado="desmembramento.produtorFavorecido"
                    :paginacao="produtorConsulta"
                    :invalid="isValidProdutorFavorecido"
                    @pesquisar="pesquisarProdutorFavorecido"
                    @selecionado="selecionarProdutorFavorecido"
                    :disabled="desmembramentoCampoDesabilitado.produtorFavorecido"
                />
            </div>

            <div class="col-12" v-if="preencherNomeProdutorFavorecido">
                <div class="field">
                    <label for="nomeProdutorFavorecido">
                        <strong>Nome Produtor Favorecido<span style="color:red;">&nbsp;*</span></strong>
                    </label>
                    <InputText class="w-full" id="nomeProdutorFavorecido" v-model="desmembramento.produtorFavorecidoNome" :class="{ 'p-invalid': isValidProdutorFavorecidoNome }" maxlength="200" :disabled="desmembramentoCampoDesabilitado.produtorFavorecidoNome" />
                </div>
            </div>

            <div class="col-12">
                <div class="field">
                    <label for="desmembramentoImovel">
                        <strong>Imóvel<span style="color:red;">&nbsp;*</span></strong>
                    </label>
                    <AutoComplete
                        class="w-full"
                        field="label"
                        v-model="desmembramento.imovel"
                        inputId="desmembramentoImovel"
                        placeholder="Informe a matrícula ou a descrição."
                        @complete="carregarImovelDesmembramento($event)"
                        :class="{ 'p-invalid': isValidDesmembramentoImovel }"
                        :suggestions="imoveisFiltro"
                        :disabled="(desmembramento.produtorFavorecido && !desmembramento.produtorFavorecido.codProdutor) || desmembramentoCampoDesabilitado.imovel"
                        :forceSelection="true"
                        :dropdown="true"/>
                </div>
            </div>

            <div class="col-3">
                <div class="field">
                    <label for="desmembramentoNfProdutor">
                        <strong>NF Produtor</strong>
                    </label>
                    <InputNumber
                        class="w-full"
                        id="desmembramentoNfProdutor"
                        v-model="desmembramento.nfProdutor"
                        mode="decimal"
                        locale="pt-BR"
                        :min="0"
                        :max="99999999999999"
                        :disabled="desmembramentoCampoDesabilitado.nfProdutor"/>
                </div>
            </div>

            <div class="col-3">
                <div class="field">
                    <label for="desmembramentoSerieNfProdutor">
                        <strong>Série NF Produtor</strong>
                    </label>
                    <InputText class="w-full uppercase" id="desmembramentoSerieNfProdutor" v-model="desmembramento.serieNfProdutor" :maxlength="3" @keyup="removerCaracteresEspeciais" :disabled="desmembramentoCampoDesabilitado.serieNfProdutor" />
                </div>
            </div>

            <div class="col-3">
                <div class="field">
                    <label for="desmembramentoDataNfProdutor">
                        <strong>Data NF Produtor</strong>
                    </label>
                    <Calendar class="w-full" id="desmembramentoDataNfProdutor" v-model="desmembramento.dataNfProdutor" dateFormat="dd/mm/yy" inputId="icon" :showIcon="true" :maxDate="new Date()" :disabled="desmembramentoCampoDesabilitado.dataNfProdutor" />
                </div>
            </div>

            <div class="col-3" v-if="item.desmembramento.desmembrarPor === 'PERCENTUAL'">
                <div class="field">
                    <label for="desmembramentoPercentual">
                        <strong>Percentual<span style="color:red;">&nbsp;*</span></strong>
                    </label>
                    <InputNumber
                        :class="{ 'p-invalid': isValidDesmembramentoQuantidade }"
                        class="w-full"
                        id="desmembramentoPercentual"
                        v-model="desmembramento.percentual"
                        mode="decimal"
                        locale="pt-BR"
                        :minFractionDigits="4"
                        :maxFractionDigits="4"
                        :min="0"
                        :max="100"
                    />
                </div>
            </div>

            <div class="col-3" v-if="item.desmembramento.desmembrarPor === 'QUILOS'">
                <div class="field">
                    <label for="desmembramentoQuantidadeQuilos">
                        <strong>Qtd. Quilos<span style="color:red;">&nbsp;*</span></strong>
                    </label>
                    <InputNumber 
                        :class="{ 'p-invalid': isValidDesmembramentoQuantidade }"
                        class="w-full" 
                        id="desmembramentoQuantidadeQuilos"
                        v-model="desmembramento.quantidadeQuilos"
                        mode="decimal"
                        locale="pt-BR"
                        :minFractionDigits="0"
                        :maxFractionDigits="0"
                        :min="0"
                        :max="9999999999"
                    />
                </div>
            </div>

            <div class="col-3" v-if="item.desmembramento.desmembrarPor === 'SACAS'">
                <div class="field">
                    <label for="desmembramentoQuantidadeSacas">
                        <strong>Qtd. Sacas<span style="color:red;">&nbsp;*</span></strong>
                    </label>
                    <InputNumber 
                        :class="{ 'p-invalid': isValidDesmembramentoQuantidade }"
                        class="w-full"
                        id="desmembramentoQuantidadeSacas"
                        v-model="desmembramento.quantidadeSacas"
                        mode="decimal"
                        locale="pt-BR"
                        :minFractionDigits="4"
                        :maxFractionDigits="4"
                        :min="0"
                        :max="9999999999"
                    />
                </div>
            </div>

            <!-- TOTALIZADORES QUILOS -->
            <div class="col-4" v-if="item.desmembramento.desmembrarPor === 'QUILOS' || item.desmembramento.desmembrarPor === 'PERCENTUAL'">
                <div class="field">
                    <label for="pesoLiquidoTotal">
                        <strong>{{ item.desmembramento.desmembrarPelo.codigo == 'PESO_LIQUIDO' ? 'Peso Líquido' : 'Renda Líquida' }} Total</strong>
                    </label>
                    <InputNumber class="w-full" id="pesoLiquidoTotal" v-model="desmembramentoTotalQuilos" mode="decimal" locale="pt-BR" :minFractionDigits="0" :maxFractionDigits="0" :min="0" :max="9999999999" :disabled="true" />
                </div>
            </div>

            <div class="col-4" v-if="item.desmembramento.desmembrarPor === 'QUILOS'">
                <div class="field">
                    <label for="pesoLiquidoRestante">
                        <strong>{{ item.desmembramento.desmembrarPelo.codigo == 'PESO_LIQUIDO' ? 'Peso Líquido' : 'Renda Líquida' }} Restante</strong>
                    </label>
                    <InputNumber class="w-full" id="pesoLiquidoRestante" v-model="desmembramentoRestanteQuilos" mode="decimal" locale="pt-BR" :minFractionDigits="0" :maxFractionDigits="0" :min="0" :max="9999999999" :disabled="true" />
                </div>
            </div>

            <!-- TOTALIZADORES SACAS -->
            <div class="col-3" v-if="item.desmembramento.desmembrarPor === 'SACAS'">
                <div class="field">
                    <label for="qtdSacasTotal">
                        <strong>Qtd. Sacas Total</strong>
                    </label>
                    <InputNumber class="w-full" id="qtdSacasTotal" v-model="desmembramentoTotalSacas" mode="decimal" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="5" :min="0" :max="9999999999" :disabled="true" />
                </div>
            </div>

            <div class="col-3" v-if="item.desmembramento.desmembrarPor === 'SACAS'">
                <div class="field">
                    <label for="qtdSacasRestante">
                        <strong>Qtd. Sacas Restante</strong>
                    </label>
                    <InputNumber class="w-full" id="qtdSacasRestante" v-model="desmembramentoRestanteSacas" mode="decimal" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="5" :min="0" :max="9999999999" :disabled="true" />
                </div>
            </div>

            <!-- TOTALIZADORES PERCENTUAL -->
            <div class="col-3" v-if="item.desmembramento.desmembrarPor === 'PERCENTUAL'">
                <div class="field">
                    <label for="percentualRestante">
                        <strong>Percentual Restante</strong>
                    </label>
                    <InputNumber class="w-full" id="percentualRestante" v-model="desmembramentoRestantePercentual" mode="decimal" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="5" :min="0" :max="100" :disabled="true" />
                </div>
            </div>
            
            <div class="col-12">
                <div class="field-checkbox">
                    <Checkbox v-model="desmembramento.cobraKit" :binary="true" :disabled="!pagaKit" />
                    <label for="entSafraAnt">Resp. em pagar o Kit Teste</label>
                </div>
            </div>
        </div>

        <Message v-if="item.desmembramento.desmembrarPelo.codigo == 'RENDA_LIQUIDA'" severity="info" :closable="false" style="margin: 0;">A renda líquida foi calculada sem o desconto de Secagem/Recepção. <strong>O desconto será aplicado durante a geração da RE</strong>.</Message>

        <template #footer>
            <div class="mb-5 center">
                <Button
                    icon="pi pi-save"
                    label="Salvar"
                    :disabled="doubleClick"
                    class="p-button-info ml-1"
                    @click="salvarDesmembramento()"/>

                <Button
                    icon="pi pi-times"
                    label="Cancelar"
                    class="p-button-danger"
                    @click="fecharDesmembramentoDialog()"/>
            </div>
        </template>
    </Dialog>
</template>

<script>
    import rePendenteService from'../../service/RependenteService';
    import grupoProdutoService from '../../service/GrupoProdutoService';
    import produtoSerevice from '../../service/ProdutoService';
    import estabelecimentoService from '../../service/EstabelecimentoService';
    import parametroEstabelecimentoService from '../../service/ParametroEstabelecimentoService';
    import taxasProducaoService from '../../service/TaxasProducaoService';
    import produtorService from '../../service/ProdutorService';
    import imoveisService from '../../service/ImoveisService';
    import sementeClasseService from '../../service/SementeClasseService';
    import gmoService from '../../service/GmoService'
    import formatacao from '../../utilities/Formatacao';
    import ProdutorFiltro from '../cadastro/ProdutorFiltro.vue';
    import moment from 'moment';
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import ItensAvariadoService from '../../service/ItensAvariadoService';

    export default {
        components: { ProdutorFiltro },
        props: {
            id: {
                type: String,
                required: false
            },

            ticket: {
                type: Boolean,
                required: false
            },
        },

        data() {
            return {
                cadastro: true,

                service: {},
                database: {},
                selectOptions: {},
                chave: {},
                doubleClick: false,

                cooperative: false,
                isEmiteNotaPropria: false,
                
                desabilitarDesmembramento: true,

                parametroEstabelecimento: null,

                // CABEÇALHO
                estabelecimentoSelecionado: null,
                estabelecimentosFiltro: [],

                grupoProduto: null,
                grupoProdutoSelecionado: null,
                grupoProdutosFiltro: [],

                produtorSelecionado: {},
                produtoresFiltro: [],
                produtorConsulta: {},

                imovelSelecionado: null,
                imoveisFiltro: [],

                tipoGmoSelecionado: null,
                tiposGmoFiltro: [],

                classeSelecionado: null,
                classesFiltro: [],

                // INFORMAÇÕES DO ITEM
                tipoDesmembramento: [],
                produtos: [],
                item: null,

                desmembramento: {},
                desmembramentos: [],
                desabilitarDesmembramentoPelo: false,
                desmembramentoCampoDesabilitado: {},

                quilosPorSaca: 0,
                calculoRendaLiquida: null,

                preencherNomeProdutorFavorecido: false,
                desmembramentoDialog: false,
                desmembramentoEditarIndice: null,
                desmembramentoEditarValor: 0,

                desmembramentoTotalQuilos: 0,
                desmembramentoTotalLancadoPercentual: 0,
                desmembramentoRestantePercentual: 100,

                desmembramentoTotalLancadoQuilos: 0,
                desmembramentoRestanteQuilos: 0,

                desmembramentoTotalSacas: 0,
                desmembramentoTotalLancadoSacas: 0,
                desmembramentoRestanteSacas: 0,

                isValidProdutorFavorecido: false,
                isValidDesmembramentoImovel: false,
                isValidProdutorFavorecidoNome: false,
                isValidDesmembramentoQuantidade: false,

                pagaKit: false,
                valorKit: null,

                alertaDesmembramentoCamposObrigatorios: false,
                alertaDesmembramentoMensagem: "",

                taxa: null,

                isEmiteNotaPropria: false,

                camposDesabilitados: {
                    pesoBruto  : false,
                    taraVeiculo: false,
                    taraSacaria: false,
                    tulha: false,
                    placa: false,
                    tipoGmo: false,
                    motorista: false
                }
            }
        },

        created() {            
            this.setup();
            this.limparItem();
        },

        methods: {
            setup(){                
                this.service.msg_active   =  false;
                this.service.msg_type     = "info"
                this.service.msg_content  =  null;
                this.service.disable      = false;                   
            },

            limparItem() {
                this.item = {
                    produto: null, 
                    lote: {
                        valor: null,
                        desabilitado: true
                    },
                    referencia: {
                        valor: null,
                        desabilitado: true
                    },
                    qualidade: {
                        desabilitado: true,
                        normal: false,
                        terra: false,
                        sementeira: false,
                        vagem: false
                    },
                    desmembramento: {
                        desabilitado: false,
                        desmembrar: false,
                        desmembrarPor: null,
                        desmembrarPelo: null
                    },
                    classificacaoItem: {
                        phEntrada: {
                            valor: null,
                            desabilitado: true
                        },
                        bandinha:  {
                            valor: null,
                            desabilitado: true
                        },
                        chuvadoAvariado:  {
                            valor: null,
                            desabilitado: true
                        },
                        teorUmidade:  {
                            valor: null,
                            desabilitado: true
                        },
                        impureza:  {
                            valor: null,
                            desabilitado: true
                        },
                        tbm:  {
                            valor: null,
                            desabilitado: true
                        },
                        qtTaxaRecepcao:  {
                            valor: null
                        },
                        qtTaxaSecagem:  {
                            valor: null
                        },
                        controleSemente:  {
                            valor: null,
                            desabilitado: true
                        },
                        fnt:  {
                            valor: null,
                            desabilitado: true
                        },
                        densidade: {
                            valor: null,
                            desabilitado: true
                        }
                    }
                }
            },

            carregarFormulario(data) {
                this.database = Object.assign({}, data);

                if(!this.database.entradaManual) {
                    this.camposDesabilitados = {
                        pesoBruto  : true,
                        taraVeiculo: true,
                        taraSacaria: true,
                        tulha: true,
                        placa: true,
                        tipoGmo: true,
                        motorista: true
                    }
                }

                if(data.pjChaveAcesso){
                    const chave      = data.pjChaveAcesso;
                    this.chave.uf    = chave.substring(0, 2);
                    this.chave.aamm  = chave.substring(2, 6);
                    this.chave.cnpj  = chave.substring(6, 20)
                    this.chave.mod   = chave.substring(20, 22);
                    this.chave.serie = chave.substring(22, 25);
                    this.chave.nfe   = chave.substring(25, 34);
                    this.chave.fnfe  = chave.substring(34, 35);
                    this.chave.cod   = chave.substring(35, 43);
                    this.chave.dv    = chave.substring(43, 44);
                }

                this.database["dtEntrada"] = formatacao.convertStringToDate(this.database["dtEntrada"], 'YYYY-MM-DD');

                if(this.database.pjDtEmissao) {
                    this.database["pjDtEmissao"] = new Date(this.database.pjDtEmissao);
                }

                if(this.database.dtNfProd) {
                    this.database["dtNfProd"] = new Date(this.database.dtNfProd);
                }
                
                // CABEÇALHO
                const estabelecimento = data.estabelecimento;
                if(!!estabelecimento) {
                    estabelecimento["codigoNomeFantasia"] = estabelecimento.codigo + " - " + estabelecimento.nomeFantasia;
                    this.estabelecimentoSelecionado = estabelecimento;
                    this.database["estabelecimento"] = undefined;
                }

                const grupoProduto = data.grupoProduto;
                if(!!grupoProduto) {
                    grupoProduto["codigoDescricao"] = grupoProduto.fmCodigo + " - " + grupoProduto.descricao;
                    this.grupoProdutoSelecionado = grupoProduto;
                    this.database["grupoProduto"] = undefined;
                }

                const produtor = data.produtor;
                if(!!produtor) {
                    this.produtorSelecionado = produtor;
                    this.cooperative = produtor.cooperativa;
                    this.database["produtor"] = undefined;
                    
                    this.cooperative = produtor.cooperativa;
                    this.isEmiteNotaPropria = produtor == null ? false : produtor.emiteNota;
                    this.chave.cnpj = produtor.cpfCnpj;
                }

                const imovel = data.imovel;
                if(!!imovel) {
                    this.imovelSelecionado  = imovel;
                    this.database["imovel"] = undefined;
                }

                const tipoGmo = data.tipoGmo;
                if(!!tipoGmo) {
                    this.tipoGmoSelecionado  = tipoGmo;
                    this.database["tipoGmo"] = undefined;
                }

                const classe = data.classe;
                if(!!classe) {
                    classe["codigoDescricao"] = classe.codigo + " - " + classe.descricao;
                    this.classeSelecionado = classe;
                    this.database["classe"] = undefined;
                }

                // INFORMAÇÕES DO ITEM
                if(this.isNotEmpty(data.itens) && data.itens.length > 0) {
                    const item = data.itens[0];
                    this.carregarDadosItem({ grupoProduto, item });
                }
                else {
                    this.carregarDadosItem({ grupoProduto });
                }

                this.verificarDesmembramento();
                
                if(!!imovel) {
                    this.getUnidadeFederacao(data.imovel.estado);
                }

                if(!!data.desmembramentos && data.desmembramentos.length > 0) {
                    this.desmembramentos = [...data.desmembramentos];
                    this.verificarSeExisteDesmembramento();
                    this.database["desmembramentos"] = undefined;
                }

                this.atualizarTotalizadoresDesmembramento();
                
                if(this.ticket) this.database['idTicket'] = this.id;
            },

            buscarDadosFormulario(){
                rePendenteService.getRependenteId(this.id)
                    .then(({ data }) => {
                        if(data) {
                            this.carregarFormulario(data);
                        }
                    })
                    .catch(error => {
                        this.database = {};
                        
                        const toast = {
                            severity:'error',
                            summary: 'Falha ao carregar os dados do formulário.',
                            detail: error, 
                            life: 5000
                        }

                        if(!!error && !!error.message) {
                            toast["detail"] = error.message;
                        }

                        this.$toast.add(toast);
                    });
            },

            getDados() {
                if(!!this.estabelecimentoSelecionado) {
                    this.database["codigoEstabelecimento"] = this.estabelecimentoSelecionado.codigo;
                }

                if(!!this.grupoProdutoSelecionado) {
                    this.database["codigoGrupoProduto"] = this.grupoProdutoSelecionado.fmCodigo;
                }

                if(!!this.produtorSelecionado && !!this.produtorSelecionado.codProdutor) {
                    this.database["codigoProdutor"] = this.produtorSelecionado.codProdutor;
                }

                if(!!this.imovelSelecionado) {
                    this.database["matriculaImovel"] = this.imovelSelecionado.matricula;
                }

                if(!!this.grupoProduto && this.grupoProduto.logTransgenico && !!this.tipoGmoSelecionado) {
                    this.database["tipoGmo"] = this.tipoGmoSelecionado.tipoGmo;
                }
                else {
                    this.database["tipoGmo"] = undefined;
                    this.database["tipoRr"] = undefined;
                }

                if(!!this.grupoProduto && !this.grupoProduto.cafeCoco) {
                    this.database["tipoRendaCfe"] = undefined;
                }

                if(!!this.grupoProduto && this.grupoProduto.semente && !!this.classeSelecionado) {
                    this.database["classe"] = this.classeSelecionado.codigo;
                }
                else {
                    this.database["nrOrdCampo"] = undefined;
                    this.database["classe"] = undefined;
                    this.database["nrLaudo"] = undefined;
                    this.database["nrContSem"] = undefined;
                }

                if(!!this.database && !!this.database.pjNroNota) {
                    const pjNroNota = this.database.pjNroNota + "";
                    this.database.pjNroNota = pjNroNota.replace(/[^0-9]/g, "");
                }

                if(!!this.item.produto) {
                    const produtoItem = {};

                    if(!!this.item.produto.codItem) {
                        produtoItem["produtoCodigo"] = this.item.produto.codItem;
                    }

                    if(!!this.item.referencia.valor) {
                        produtoItem["referencia"] = this.item.referencia.valor;
                    }

                    if(!!this.item.lote.valor) {
                        produtoItem["lote"] = this.item.lote.valor;
                    }

                    // CLASSIFICAÇÃO
                    if(this.isNotEmpty(this.item.classificacaoItem.phEntrada.valor)) {
                        produtoItem["phEntrada"] = this.item.classificacaoItem.phEntrada.valor;
                    }
                    
                    if(this.isNotEmpty(this.item.classificacaoItem.impureza.valor)) {
                        produtoItem["impureza"] = this.item.classificacaoItem.impureza.valor;
                    }

                    if(this.isNotEmpty(this.item.classificacaoItem.teorUmidade.valor)) {
                        produtoItem["umidade"] = this.item.classificacaoItem.teorUmidade.valor;
                    }
                    
                    if(this.isNotEmpty(this.item.classificacaoItem.chuvadoAvariado.valor)) {
                        produtoItem["chuvadoAvariado"] = this.item.classificacaoItem.chuvadoAvariado.valor;
                    }
                    
                    if(this.isNotEmpty(this.item.classificacaoItem.tbm.valor)) {
                        produtoItem["tbm"] = this.item.classificacaoItem.tbm.valor;
                    }
                    
                    if(this.isNotEmpty(this.item.classificacaoItem.bandinha.valor)) {
                        produtoItem["percentualBandinha"] = this.item.classificacaoItem.bandinha.valor;
                    }
                    
                    if(this.isNotEmpty(this.item.classificacaoItem.controleSemente.valor)) {
                        produtoItem["controleSemente"] = this.item.classificacaoItem.controleSemente.valor;
                    }

                    if(this.isNotEmpty(this.item.classificacaoItem.qtTaxaRecepcao.valor)) {
                        produtoItem["qtdRecepcao"] = this.item.classificacaoItem.qtTaxaRecepcao.valor;
                    }

                    if(this.isNotEmpty(this.item.classificacaoItem.qtTaxaSecagem.valor)) {
                        produtoItem["qtdSecagem"] = this.item.classificacaoItem.qtTaxaSecagem.valor;
                    }

                    if(this.isNotEmpty(this.item.classificacaoItem.fnt.valor)) {
                        produtoItem["fnt"] = this.item.classificacaoItem.fnt.valor;
                    }

                    if(this.isNotEmpty(this.item.classificacaoItem.densidade.valor)) {
                        produtoItem["densidade"] = this.item.classificacaoItem.densidade.valor;
                    }

                    // DESMEMBRARMENTO
                    if(!!this.item.desmembramento.desmembrar) {
                        produtoItem["desmembramento"] = this.item.desmembramento.desmembrar;
                        produtoItem["unidadeDesmembramento"] = this.item.desmembramento.desmembrarPor;
                        produtoItem["tipoDesmembramento"] = this.item.desmembramento.desmembrarPelo.codigo;
                    }

                    // QUALIDADE PRODUTO
                    produtoItem["qualidadeProdutoNormal"]     = this.item.qualidade.normal;
                    produtoItem["qualidadeProdutoTerra"]      = this.item.qualidade.terra;
                    produtoItem["qualidadeProdutoSementeira"] = this.item.qualidade.sementeira;
                    produtoItem["qualidadeProdutoVagem"]      = this.item.qualidade.vagem;

                    this.database["itens"] = [];
                    this.database["itens"].push(produtoItem);
                }

                if(!!this.desmembramentos && this.desmembramentos.length > 0) {
                    const desmembramentos = this.desmembramentos.map(item => {
                        const desmembramento = {};
                        desmembramento["produtorFavorecidoCodigo"] = item.produtorFavorecido.codProdutor;
                        desmembramento["produtorFavorecidoNome"]   = item.produtorFavorecidoNome;
                        desmembramento["imovelMatricula"]          = item.imovel.matricula;
                        desmembramento["percentual"]               = item.percentual;
                        desmembramento["quantidadeQuilos"]         = item.quantidadeQuilos;
                        desmembramento["quantidadeSacas"]          = item.quantidadeSacas;
                        desmembramento["cobraKit"]                 = item.cobraKit;
                        //desmembramento["transferirPela"]         = ;//TipoDesmembramentoEnum
                        desmembramento["nfProdutor"]               = item.nfProdutor;
                        desmembramento["serieNfProdutor"]          = item.serieNfProdutor;
                        desmembramento["dataNfProdutor"]           = item.dataNfProdutor;
                        return desmembramento;
                    });

                    this.database["desmembramentos"] = [...desmembramentos];
                }
                else {
                    this.database["desmembramentos"] = undefined;
                }

                // INFORMAR SE É CADASTRO OU ATUALIZAÇÃO
                this.database['cadastro'] = this.cadastro;
                
                return this.database;
            },

            async verificarItemAvariado(dados) {
                if(!dados.codigoEstabelecimento || !dados.codigoGrupoProduto || !dados.itens || dados.itens.length == 0) return;

                const codigoProduto = dados.itens[0].produtoCodigo;
                const chuvadoAvaraido = dados.itens[0].chuvadoAvariado;
                const ph = dados.itens[0].phEntrada;
                const fnt = dados.itens[0].fnt;

                const { data } = await ItensAvariadoService.buscarPorGrupoProdutoEstabelecimento(dados.codigoGrupoProduto, dados.codigoEstabelecimento, { percentual: chuvadoAvaraido, ph, fnt });
                if(!!data && data.codigoProduto !== codigoProduto) {
                    this.$toast.add({
                        severity:'warn', 
                        summary: 'O produto será alterado automaticamente',
                        detail: `De ${ codigoProduto } para ${ data.codigoProduto } conforme a parametrização do item avariado.`,
                        life: 15000
                    });

                    return true;
                }

                return false;
            },

            async salvar(voltar = true){
                const dados = this.getDados();
                if(!this.validField() && !this.doubleClick) return;  
                this.doubleClick = true;
                const isAlteracaoItemAvariado = await this.verificarItemAvariado(dados);

                rePendenteService.salvar(dados)
                    .then(response => {
                        this.$toast.add({
                            severity:'success',
                            detail: "Salvo com sucesso!", 
                            life: 5000
                        });

                        if(voltar) {
                            const tempo = isAlteracaoItemAvariado ? 2500 : 0;
                            setTimeout(() => { this.voltar(); }, tempo);
                        }
                        else {
                            this.carregarFormulario(response.data);
                        }
                    })
                    .catch(error => {
                        this.doubleClick = false;

                        if(!!error && !!error.response && !!error.response.data) {
                            const { message, exception } = error.response.data;
                            const mensagem = message == undefined || message == null || message == "" ? exception + ""  : message + "";
                            const mensagens = mensagem.split("\n");

                            for(let mensagemAux of mensagens) {
                                this.$toast.add({
                                    severity:'error', 
                                    summary: 'Falha ao salvar',
                                    detail: mensagemAux, 
                                    life: 15000
                                });
                            }
                        }
                        else {
                            this.$toast.add({
                                severity:'error', 
                                summary: 'Falha não mapeada ao salvar',
                                detail: error, 
                                life: 15000
                            });
                        }
                    });
            },

            carregarEstabelecimentos(event) {
                const codigoOuNomeFantasia = !event.query.trim().length ? undefined : event.query;
                estabelecimentoService.pesquisarPorParametroUsuarioVsEstabelecimentoComUsuarioAutenticado({codigoOuNomeFantasia, re: true})
                    .then(({ data }) => {
                        if(data) {
                            this.estabelecimentosFiltro = data.map(item => {
                                item["codigoNomeFantasia"] = item.codigo + " - " + item.nomeFantasia;
                                return item;
                            });
                        }
                    })
                    .catch(error => {
                        this.estabelecimentosFiltro = [];
                    });
            },

            carregarClasses(event) {
                const codigoOuDescricao = !event.query.trim().length ? undefined : event.query;
                sementeClasseService.pesquisarPorCodigoOuDescricao(codigoOuDescricao)
                    .then(({ data }) => {
                        if(data) {
                            this.classesFiltro = data.map(item => {
                                item["codigoDescricao"] = item.codigo + " - " + item.descricao;
                                return item;
                            });
                        }
                    })
                    .catch(error => {
                        this.classesFiltro = [];
                    });
            },

            selecionarClasse() {
                if(this.classeSelecionado == undefined) { return; }
            },

            carregarGrupoProduto(event){
                const dados = !event.query.trim().length ? undefined : event.query;
                GrupoProdutoService.buscarPorCodigoOuDescricaoComParametroEntradaReDiferenteNaoPermite(dados)
                    .then(({ data }) => { 
                        if(data) {
                            this.grupoProdutosFiltro = [...data];
                        }
                    })
                    .catch(error => {
                        this.grupoProdutosFiltro = [];
                    });
            },

            selecionarGrupoProduto() {
                this.produtos = [];
                this.item.produto = null;
                this.limparItem();

                if(!!this.grupoProdutoSelecionado) {
                    grupoProdutoService.buscarPorCodigo(this.grupoProdutoSelecionado.fmCodigo)
                    .then(({ data }) => {
                        this.carregarDadosItem({ grupoProduto: data });
                    });
                }

                this.verificarDesmembramento();
            },

            verificarDesmembramento() {
                let desmembramento = this.item["desmembramento"].desabilitado;
                this.desabilitarDesmembramento = !(desmembramento == false && this.isEmiteNotaPropria == false);
            },


            /* INICIO METODOS PARA SELECIONAR O PRODUTOR */
            pesquisarProdutor(filtros) {
                produtorService.pesquisarProdutor(filtros)
                    .then(({ data }) => {
                        if(data) {
                            this.produtorConsulta = data;
                        }
                    })
                    .catch(error => {
                        this.produtorConsulta = {}
                    });
            },

            limparCamposNf() {
                this.database.nrNfProd = undefined;
                this.database.serNfProd = undefined;
                this.database.dtNfProd = undefined;
                this.database.pjNroNota = undefined;
                this.database.pjSerie = undefined;
                this.database.pjDtEmissao = undefined;
                this.database.pjNatOper = undefined;
                this.database.pjVlTotNota = undefined;
                this.database.pjQtTotNota = undefined;
                this.chave.uf = undefined;
                this.chave.aamm = undefined;
                this.chave.cnpj = undefined;
                this.chave.mod = undefined;
                this.chave.serie = undefined;
                this.chave.nfe = undefined;
                this.chave.fnfe = undefined;
                this.chave.cod = undefined;
                this.chave.dv = undefined;
            },

            selecionarProdutor(codProdutor) {
                this.limparCamposNf();

                if(codProdutor == undefined || codProdutor == null || codProdutor.trim() == "") {
                    this.produtorSelecionado = {};
                    return;
                }

                produtorService.buscarPorCodigoProdutor(codProdutor)
                    .then(({ data }) => {
                        if(data) {
                            this.produtorSelecionado = data;
                            this.preencherCamposConformeProdutor();
                            this.verificarDesmembramento();
                        }
                    })
                    .catch(error => {
                        this.produtorSelecionado = {};

                        if(!!error && !!error.response) {
                            const { data } = error.response;

                            this.$toast.add({
                                severity:'error', 
                                summary: 'Falha ao buscar produtor',
                                detail: data.message,
                                life: 5000
                            });
                        }
                    });
            },

            preencherCamposConformeProdutor() {
                if(this.produtorSelecionado != undefined){
                    this.cooperative = this.produtorSelecionado.cooperativa;
                    this.isEmiteNotaPropria = this.produtorSelecionado == null ? false : this.produtorSelecionado.emiteNota;
                    this.chave.cnpj = this.produtorSelecionado.cpfCnpj;
                } 

                this.verificarDesmembramento();
            },
            /* FIM METODOS PARA SELECIONAR O PRODUTOR */

            /* INICIO METODOS PARA SELECIONAR O PRODUTOR FAVORECIDO */
            pesquisarProdutorFavorecido(filtros) {
                produtorService.pesquisarProdutor(filtros)
                    .then(({ data }) => {
                        if(data) {
                            this.produtorConsulta = data;
                        }
                    })
                    .catch(error => {
                        this.produtorConsulta = {}
                    });
            },

            selecionarProdutorFavorecido(codProdutor, produtor) {
                if(codProdutor == undefined || codProdutor == null || codProdutor.trim() == "") {
                    this.desmembramento.produtorFavorecido = {};
                    return;
                }

                if(!!produtor && produtor.emiteNota) {
                    this.$toast.add({
                        severity:'warn', 
                        summary: 'Produtor favorecido',
                        detail: 'Não é permitido informar um produtor que emite nota fiscal no desmembramento.',
                        life: 5000
                    });

                    this.desmembramento.produtorFavorecido = {};
                    return;
                }

                if(!!produtor) {
                    this.desmembramento.produtorFavorecido = {
                        id: produtor.id,
                        codProdutor: produtor.codProdutor,
                        nome: produtor.nome,
                        cpfCnpj: produtor.cpfCnpj,
                        emiteNota: produtor.emiteNota,
                        cooperativa: produtor.cooperativa,
                        matriculaNome: produtor.matriculaNome
                    }
                    this.verificarProdutorFavorecido();
                }
                else {
                    produtorService.buscarPorCodigoQueNaoEmiteNf(codProdutor)
                        .then(({ data }) => {
                            if(data) {
                                this.desmembramento.produtorFavorecido = data;
                                this.verificarProdutorFavorecido();
                            }
                        })
                        .catch(error => {
                            this.desmembramento.produtorFavorecido = {};

                            if(!!error && !!error.response) {
                                const { data } = error.response;

                                this.$toast.add({
                                    severity:'warn', 
                                    summary: 'Falha ao buscar produtor favorecido',
                                    detail: data.message,
                                    life: 5000
                                });
                            }
                        });
                }
            },

            verificarProdutorFavorecido() {
                const produtor = this.desmembramento.produtorFavorecido;
                if(produtor == undefined) return;

                this.preencherNomeProdutorFavorecido = produtor.cooperativa == null ? false : produtor.cooperativa;
            },

            /* FIM METODOS PARA SELECIONAR O PRODUTOR FAVORECIDO */

            carregarImovel(event) {
                const produtor = this.produtorSelecionado;
                if(produtor == undefined && produtor == null) return;
                const matriculaOuDescricao = !event.query.trim().length ? undefined : event.query;
                imoveisService.pesquisarPorCodigoProdutorEMatriculaOuDescricaoSemSerTransferencia(produtor.codProdutor, matriculaOuDescricao)
                    .then(({ data }) => {
                        if(!!data && data.length > 0) {
                            this.imoveisFiltro = data;
                        }
                        else {
                            this.imoveisFiltro = [];

                            if(!matriculaOuDescricao) {
                                this.$toast.add({
                                    severity:'warn', 
                                    summary: 'Atenção',
                                    detail:`O produtor "${ this.produtorSelecionado.matriculaNome }" não possui imóveis vinculados.`,
                                    life: 5000
                                });
                            }
                        }
                    })
                    .catch(error => {
                        this.imoveisFiltro = [];
                    });
            },

            carregarImovelDesmembramento(event) {
                const produtor = this.desmembramento.produtorFavorecido;
                if(produtor == undefined && produtor == null) return;
                const matriculaOuDescricao = !event.query.trim().length ? undefined : event.query;
                imoveisService.pesquisarPorCodigoProdutorEMatriculaOuDescricaoSemSerTransferencia(produtor.codProdutor, matriculaOuDescricao)
                    .then(({ data }) => {
                        if(!!data && data.length > 0) {
                            this.imoveisFiltro = data.map(imovel => {
                                imovel["label"] = `${ imovel.matricula } - ${ imovel.nome } - ${ imovel.estado } - ${ imovel.cadpro }`;
                                return imovel;
                            });
                        }
                        else {
                            this.imoveisFiltro = [];
                            if(!matriculaOuDescricao) {
                                this.$toast.add({
                                    severity:'warn', 
                                    summary: 'Atenção',
                                    detail:`O produtor "${ produtor.matriculaNome }" não possui imóveis vinculados.`,
                                    life: 5000
                                });
                            }
                        }
                    })
                    .catch(error => {
                        this.imoveisFiltro = [];
                    });
            },

            carregarTipoGmo(event){
                const grupoProduto = this.grupoProdutoSelecionado;
                if(!grupoProduto) return;

                const filtro = !event.query.trim().length ? undefined : event.query;
                gmoService.buscarPorCodigoGrupoProduto(grupoProduto.fmCodigo, filtro)
                    .then(({ data }) => {
                        if(!!data && data.length > 0) {
                            this.tiposGmoFiltro = [...data];
                        }
                        else {
                            this.tiposGmoFiltro = [];
                            this.$toast.add({
                                severity:'warn', 
                                summary: 'Atenção',
                                detail:`Não foi encontrado Tipo GMO cadastrado.`,
                                life: 5000
                            });
                        }
                    })
                    .catch(error => {
                        this.tiposGmoFiltro = [];
                    });

            },

            selecionarTipoGmo(event) {
                if(!this.tipoGmoSelecionado) return;
                const tipoGmo = this.tipoGmoSelecionado.tipoGmo + "";
                if(!!tipoGmo && tipoGmo.toUpperCase().indexOf("RR1") >= 0) {
                    this.database.tipoRr = "Testada";
                }
            },

            getUnidadeFederacao(dados){
                rePendenteService.getUnidadeFederacao(dados) 
                    .then(({ data }) => {
                        if(!!data) {                            
                            this.chave.uf = data.codigoIbge;
                        }
                        else {
                            this.chave.uf = undefiend;
                            this.$toast.add({
                                severity:'warn', 
                                summary: 'Atenção',
                                detail:`Não foi encontrado o cadastro de unidade de federação para o estado "${ dados }"".`,
                                life: 5000
                            });
                        }
                    }) 
                    .catch(error => {
                        this.chave.uf = null;

                        if(!!error && !!error.response) {
                            const { data } = error.response;
                            this.$toast.add({
                                severity:'error', 
                                summary: 'Falha ao consultar unidade de federação.',
                                detail: data.message,
                                life: 5000
                            });
                        }
                    });

            },

            getNaturezaOperacao(){                
                rePendenteService.getNaturezaOperacao(this.estabelecimentoSelecionado.codigo, "ENTRADA", this.produtorSelecionado.codProdutor, this.grupoProdutoSelecionado.fmCodigo)
                    .then(({ data }) => {
                        if(data && data.integrated) {
                            this.chave.mod = data.modeloEletronico;
                            this.database.pjNatOper = data.naturezaOperacao;
                        }
                        else {
                            this.chave.mod = null;
                            this.database.pjNatOper = null;
                        }
                    }).catch(error => {
                        this.chave.mod = null;
                        this.database.pjNatOper = null;
                    });
            },

            setTotal(event){ 
                let pesoBruto   = !!this.database.pesoBruto   ? this.database.pesoBruto   : 0;
                let taraVeiculo = !!this.database.taraVeiculo ? this.database.taraVeiculo : 0;
                let taraSacaria = !!this.database.taraSacaria ? this.database.taraSacaria : 0;

                if(!!event) {
                    const { value, id } = event.target;

                    if(!!value) {
                        let valor = value.replace(/\./g, "");
                        valor = valor.replace(/\,/, ".");
                        valor = parseFloat(valor);

                        if(id == "taraSacaria") {
                            taraSacaria = valor;
                        }
                        else if(id == "taraVeiculo") {
                            taraVeiculo = valor;
                        }
                        else if(id == "pesoBruto") {
                            pesoBruto = valor;
                        }
                    }
                }

                this.setMessage(false, null, null);
                if(pesoBruto <= taraVeiculo || pesoBruto <= taraSacaria){
                    this.setMessage(true, "warn", "Confira os valores de pesagem, valores incorretos identificados!");
                    this.database.pesoLiquido = 0;
                    return;
                }                  
                this.database.pesoLiquido = pesoBruto - taraSacaria - taraVeiculo;
                this.atualizarTotalizadoresDesmembramento();
            },

            setMessage(status, nivel, mgs){
                this.service.msg_active   =  status;
                this.service.msg_type     =  nivel
                this.service.msg_content  =  mgs;
            },

            setImovel(){
                if(this.imovelSelecionado != undefined){
                    this.getUnidadeFederacao(this.imovelSelecionado.estado);
                }
            },

            selecionarEstabelecimento(){
                if(this.estabelecimentoSelecionado == undefined) { return; }

                const codigoEstabelecimento = this.estabelecimentoSelecionado.codigo;
                parametroEstabelecimentoService.buscarPorCodigoEstabelecimento(codigoEstabelecimento)
                    .then(({ data }) => {
                        if(data) {
                            this.parametroEstabelecimento = data;
                        }
                    })
                    .catch(error => {
                        this.parametroEstabelecimento = null;
                    });
            },

            setFields(){
                if(this.estabelecimentoSelecionado != undefined && this.produtorSelecionado != undefined && this.grupoProdutoSelecionado != undefined){
                    this.getNaturezaOperacao();
                }

                if(this.database.pjDtEmissao != undefined) {
                    const emissao = this.database.pjDtEmissao;
                    let ano = emissao.getFullYear() + "";
                    let mes = emissao.getMonth() + 1;
                    
                    if(mes < 10) {
                        mes = "0" + mes;
                    }

                    this.chave.aamm = ano.substring(2, 4) + mes;
                }

                if(this.database.pjNroNota != undefined){
                    this.chave.nfe = this.adicionarZeros(this.database.pjNroNota, 9);
                }

                if(this.database.pjSerie){
                    this.chave.serie = this.adicionarZeros(this.database.pjSerie, 3);
                }
            },

            setChave() {
                let chaveAcesso = "";
                chaveAcesso += !!this.chave.uf    ? this.chave.uf    : "  ";
                chaveAcesso += !!this.chave.aamm  ? this.chave.aamm  : "    ";
                chaveAcesso += !!this.chave.cnpj  ? this.chave.cnpj  : "              ";
                chaveAcesso += !!this.chave.mod   ? this.chave.mod   : "  ";
                chaveAcesso += !!this.chave.serie ? this.chave.serie : "   ";
                chaveAcesso += !!this.chave.nfe   ? this.chave.nfe   : "         ";
                chaveAcesso += !!this.chave.fnfe  ? this.chave.fnfe  : " ";
                chaveAcesso += !!this.chave.cod   ? this.chave.cod   : "        ";
                chaveAcesso += !!this.chave.dv    ? this.chave.dv    : " ";

                this.database.pjChaveAcesso = chaveAcesso;
            },

            adicionarZeros(valor, quantidadeTotal) {
                let valorComZeros = String(valor);
                let quantidade = valorComZeros.length;
                    
                while(quantidade < quantidadeTotal) {
                    valorComZeros = "0" + valorComZeros;
                    quantidade++;
                }
                
                return valorComZeros;
            },

            validField(){
                let msg = [];
                let status = true; 
                this.setMessage(false, null, null);

                this.setChave();

                if(!this.database.codigoEstabelecimento){
                    msg.push('"Estabelecimento"');
                    status = false;                   
                }

                if(!this.database.codigoGrupoProduto){
                    msg.push('"Grupo de Produto"');
                    status = false;                   
                }

                if(!this.database.placa){
                    msg.push('"Placa"');
                    status = false;                   
                }

                if(!this.database.nrDocPes){
                    msg.push('"Doc. Pesagem"');
                    status = false;
                }

                if(!this.database.codigoProdutor){
                    msg.push('"Produtor"');
                    status = false;                   
                }

                if(this.cooperative && !this.database.nomeProd) {
                    msg.push('"Nome Produtor"');
                    status = false;
                }

                if(!this.database.dtEntrada){
                    msg.push('"Data Entrada"');
                    status = false;
                }

                if(!this.database.hrEntrada){
                    msg.push('"Hora Entrada"');
                    status = false;
                }

                if(!!this.tipoGmoSelecionado && (!this.database || !this.database.tipoRr)) {
                    msg.push('"Soja GMO"');
                    status = false;
                }

                if(this.database.entradaManual == undefined || this.database.entradaManual == null) {
                    this.database.entradaManual = (this.id == null && !this.ticket);
                }

                const pesoBruto   = !!this.database.pesoBruto   ? this.database.pesoBruto   : 0;
                const taraVeiculo = !!this.database.taraVeiculo ? this.database.taraVeiculo : 0;
                const taraSacaria = !!this.database.taraSacaria ? this.database.taraSacaria : 0;
                if(pesoBruto < taraVeiculo || pesoBruto < taraSacaria){
                    msg.push('Os valores da "Balança" estão incorretos');
                    status = false;
                } 

                if(!status && msg.length > 1){
                    this.setMessage(true, "warn", "Campos obrigatorios: " + msg.join(", "));
                }
                else if(!status) {
                    this.setMessage(true, "warn", "Campo obrigatorio: " + msg.join(", "));
                }

                return status;
            },

            voltar() {
                this.$router.push(`/entrada-producao`);
            }, 

            carregarProdutos(event) {
                if(!this.database || !this.grupoProdutoSelecionado || !this.grupoProdutoSelecionado.fmCodigo) {
                    this.$toast.add({
                        severity:'warn', 
                        summary: 'Atenção',
                        detail:'Para selecionar o produto é necessário preencher o campo Grupo de Produto!',
                        life: 5000
                    });
                    return;
                }

                const codigoOuDescricao = !event.query.trim().length ? undefined : event.query;
                const codigoGrupoProduto = this.grupoProdutoSelecionado.fmCodigo;
                produtoSerevice.pesquisarPorCodigoOuDescricaoVinculadoAoGrupoProduto(codigoOuDescricao, codigoGrupoProduto)
                    .then(({ data }) => {
                        if(!!data && data.length > 0) {
                            this.produtos = data.map(item => {
                                item["codigoDescricao"] = item.codItem + " - " + item.descItem;
                                return item;
                            })
                        }
                        else {
                            this.produtos = [];
                            this.$toast.add({
                                severity:'warn', 
                                summary: 'Atenção',
                                detail:`Não foi encontrado produtos vinculados ao grupo de produto "${ codigoGrupoProduto }".`,
                                life: 5000
                            });
                        }
                    })
                    .catch(error => {
                        this.produtos = [];

                        if(!!error && !!error.response) {
                            const { data } = error.response;
                            this.$toast.add({
                                severity:'error', 
                                summary: `Falha ao consultar produtos vinculados ao grupo de produto "${ codigoGrupoProduto }".`,
                                detail: data.message,
                                life: 5000
                            });
                        }
                    });
            },

            carregarTaxa() {
                if(!this.estabelecimentoSelecionado && !this.grupoProdutoSelecionado 
                    && !this.database.dtEntrada) return;

                const idEstabelecimento = this.estabelecimentoSelecionado.id;
                const idGrupoProduto = this.grupoProdutoSelecionado.id;
                const safra = this.database.dtEntrada.getFullYear();
                taxasProducaoService.buscarPorSafraCodigoEstabelecimentoGrupoProduto(safra, idEstabelecimento, idGrupoProduto)
                    .then(({ data }) => {
                        if(!!data) {
                            this.taxa = data;
                            this.validarTipoDesmembramentoPelaTaxa();                            
                        }
                    })
                    .catch(error => {
                        console.log("Falha ao consultar taxa produção", error);
                    });
            },

            validarTipoDesmembramentoPelaTaxa() {
                if(this.taxa.tipoCobraRecepcaoPor === "ENTRADA" || this.taxa.tipoCobraSecagemNa === "ENTRADA") {
                    this.desabilitarDesmembramentoPelo = true;
                    this.item.desmembramento.desmembrarPelo = {
                        codigo: "PESO_LIQUIDO",
                        descricao: "Peso Líquido (Peso bruto - Tara)"
                    };
                }
            },

            selecionarDesmembramento() {
                if(!!this.item.desmembramento.desmembrar) {
                    this.carregarTaxa();
                }
                else {
                    this.item.desmembramento = {
                        desabilitado: false,
                        desmembrar: false,
                        desmembrarPor: null,
                        desmembrarPelo: null
                    }
                }
            },

            carregarTiposDesmembramento() {
                if(this.tipoDesmembramento.length > 0) {
                    this.tipoDesmembramento = [...this.tipoDesmembramento];
                    return;
                }

                rePendenteService.buscarTiposDesmembramento()
                    .then(({ data }) => {
                        if(!!data) {
                            this.tipoDesmembramento = [...data];
                        }
                    })
                    .catch(error => {
                        this.tipoDesmembramento = [];
                    });
            },

            buscarInformacaoProdutoPesagem(codigoEstabelecimento, safra, nroDocPesagem) {
                if(!codigoEstabelecimento|| !safra || !nroDocPesagem) return;
                
                rePendenteService.buscarProdutoPesagemPorCodigoEstabelecimentoSafraNroDocPesagem(codigoEstabelecimento, safra, nroDocPesagem)
                    .then(({ data }) => {
                        if(!!data.pesagem) {
                            const grupoProduto = data.grupoProduto;
                            const pesagem = data.pesagem;
                            const produto = data.produto;

                            this.carregarCabecalhoPorPesagem(pesagem, grupoProduto);
                            this.limparItem();

                            // CARREGAR OS DADOS DO ITEM APENAS QUANDO EXISTIR O GRUPO DE PRODUTO
                            if(!!grupoProduto) {
                                this.carregarDadosItem({ grupoProduto, pesagem, produto });
                            }
                        }

                        this.verificarDesmembramento();
                    })
                    .catch(error => {
                        this.service.disable     = true;
                        this.doubleClick         = true;
                        this.service.msg_active  = true;
                        this.service.msg_type    = "warn";
                        this.service.msg_content = "Falha ao consultar os dados do ticket de pesagem.";
                        this.service.disable     = false;

                        if(!!error && !!error.response) {
                            const { data } = error.response;
                            this.service.msg_content = data.message;
                        }
                    });
            },

            isNotEmpty(valor) {
                return valor != undefined && valor != null;
            },

            carregarCabecalhoPorPesagem(pesagem, grupoProduto = null) {
                this.database = {};
                this.database.entradaManual = false;
                this.database.dtEntrada = formatacao.convertStringToDate(pesagem.dataEntrada, 'YYYY-MM-DD');
                this.database.hrEntrada = pesagem.horaEntrada;
                this.database.nrDocPes = pesagem.nroDocPesagem;
                this.database.nrOrdCampo = pesagem.ordemCampo;
                this.database.nrContSem = pesagem.controleSemente;
                this.database.nrNfProd = pesagem.nfProdutor;
                this.database.observacoes = pesagem.observacao;
                this.database.prodPadr = pesagem.prodPadr;
                this.database.descarUnid = pesagem.descarUnid;
                this.database.tulha = pesagem.codigoMoega;

                if(!!pesagem.motorista) {
                    this.database.motorista = pesagem.motorista;
                    this.camposDesabilitados.motorista = true;
                }

                if(!!pesagem.placa) {
                    this.database.placa = pesagem.placa;
                    this.camposDesabilitados.placa = true;
                }

                if(!!pesagem.pesoEntrada) {
                    this.database.pesoBruto = pesagem.pesoEntrada;
                    this.camposDesabilitados.pesoBruto = true;
                }
                
                if(!!pesagem.pesoSaida) {
                    this.database.taraVeiculo = pesagem.pesoSaida;
                    this.camposDesabilitados.taraVeiculo = true;
                }

                this.database.taraSacaria = 0;
                this.database.pesoLiquido = pesagem.pesoLiquido;

                estabelecimentoService.getEstabelecimentosPorCodigo(pesagem.codEstabelecimento)
                    .then(({ data }) => {
                        if(!!data) {
                            data["codigoNomeFantasia"] = data.codigo + " - " + data.nomeFantasia;
                            this.estabelecimentoSelecionado = data;
                        }
                    })
                    .catch(error => {
                        if(!!error && !!error.response) {
                            const { data } = error.response;
                            this.$toast.add({
                                severity:'error', 
                                summary: 'Falha ao buscar estabelecimento.',
                                detail: data.message,
                                life: 5000
                            });
                        }
                    });

                if(!!pesagem.codProdutor) {
                    produtorService.buscarPorCodigoProdutor(pesagem.codProdutor)
                        .then(({ data }) => {
                            if(!!data) {
                                this.produtorSelecionado = data;
                                this.preencherCamposConformeProdutor();
                                if(this.cooperative) {
                                    this.database.nomeProd = pesagem.nomeProdutor;
                                }
                            }
                        })
                        .catch(error => {
                            if(!!error && !!error.response) {
                                const { data } = error.response;
                                this.$toast.add({
                                    severity:'error', 
                                    summary: 'Falha ao buscar produtor.',
                                    detail: data.message,
                                    life: 5000
                                });
                            }
                        });
                }
                
                if(!!pesagem.matricula) {
                    imoveisService.buscarPorMatricula(pesagem.matricula)
                        .then(({ data }) => {
                            if(!!data) {
                                data["matriculaNomeCadpro"] = data.matriculaNome;
                                this.imovelSelecionado = data;
                                this.setImovel();
                            }
                        })
                        .catch(error => {
                            if(!!error && !!error.response) {
                                const { data } = error.response;
                                this.$toast.add({
                                    severity:'error', 
                                    summary: 'Falha ao buscar imóvel.',
                                    detail: data.message,
                                    life: 5000
                                });
                            }
                        });
                }

                if(!!pesagem.tipoGmo && !!grupoProduto && !!grupoProduto.fmCodigo) {
                    gmoService.buscarPorTipoGmoECodigoGrupoProduto(pesagem.tipoGmo, grupoProduto.fmCodigo)
                        .then(({ data }) => {
                            if(!!data) {
                                this.tipoGmoSelecionado = data;
                            }
                        })
                        .catch(error => {
                            if(!!error && !!error.response) {
                                const { data } = error.response;
                                this.$toast.add({
                                    severity:'error', 
                                    summary: 'Falha ao buscar Tipo GMO.',
                                    detail: data.message,
                                    life: 5000
                                });
                            }
                        });
                }
            },

            carregarDadosItem(param) {
                const item = param.item;
                const produto = this.isNotEmpty(item) && this.isNotEmpty(item.produto) ? item.produto : param.produto;
                const pesagem = param.pesagem;
                const grupoProduto = param.grupoProduto;

                const _item = this.item;

                // PREENCHER O CAMPO GRUPO DE PRODUTO
                if(!!grupoProduto) {
                    grupoProduto["codigoDescricao"] = grupoProduto.fmCodigo + " - " + grupoProduto.descricao;
                    this.grupoProdutoSelecionado = grupoProduto;
                    this.quilosPorSaca = grupoProduto.kgSc || 0;
                    this.grupoProduto = grupoProduto;
                }

                /* ------------------ */
                /*  DADOS DO PRODUTO  */
                /* ------------------ */

                // PREENCHER O CAMPO DE PRODUTO
                if(!!produto) {
                    produto["codigoDescricao"] = produto.codItem + " - " + produto.descItem;
                    _item.produto = produto;
                }

                _item["lote"].desabilitado = !grupoProduto.lote;
                _item["referencia"].desabilitado = grupoProduto.referencia != 'TIPO';

                if(grupoProduto.lote && !!item) {
                    _item["lote"].valor = item.lote;
                }

                if(!!item && !!item.referencia) {
                    _item["referencia"].valor = item.referencia;
                }

                /* ------------------- */
                /*  QUALIDADE PRODUTO  */
                /* ------------------- */

                _item["qualidade"].desabilitado = !grupoProduto.qualiProduto;

                if(grupoProduto.qualiProduto && !!item) {
                    _item.qualidade["normal"]     = item.qualidadeProdutoNormal     == null ? false : item.qualidadeProdutoNormal;
                    _item.qualidade["terra"]      = item.qualidadeProdutoTerra      == null ? false : item.qualidadeProdutoTerra;
                    _item.qualidade["sementeira"] = item.qualidadeProdutoSementeira == null ? false : item.qualidadeProdutoSementeira;
                    _item.qualidade["vagem"]      = item.qualidadeProdutoVagem      == null ? false : item.qualidadeProdutoVagem;
                }
                else {
                    _item["qualidade"].normal = (_item["qualidade"].desabilitado == false);
                }

                /* ---------------- */
                /*  DESMEMBRAMENTO  */
                /* ---------------- */

                _item["desmembramento"].desabilitado = !grupoProduto.desmembramento;

                if(grupoProduto.desmembramento && !!item) {
                    this.carregarTiposDesmembramento();
                    _item.desmembramento["desmembrar"]     = item.desmembramento == null ? false : item.desmembramento;
                    _item.desmembramento["desmembrarPor"]  = item.unidadeDesmembramento;
                    _item.desmembramento["desmembrarPelo"] = item.tipoDesmembramento;

                    if(_item.desmembramento["desmembrar"]) this.carregarTaxa();
                }

                /* -------------------------- */
                /*  CLASSIFICAÇÃO DE PRODUTO  */
                /* -------------------------- */

                // PH ENTRADA
                _item.classificacaoItem["phEntrada"].desabilitado = !grupoProduto.phEntrada;
                if(grupoProduto.phEntrada && !!pesagem && this.isNotEmpty(pesagem.clPh)) {
                    _item.classificacaoItem["phEntrada"].valor = pesagem.clPh;
                }
                else if(grupoProduto.phEntrada && !!item && this.isNotEmpty(item.phEntrada)) {
                    _item.classificacaoItem["phEntrada"].valor = item.phEntrada;
                }

                // BANDINHA
                _item.classificacaoItem["bandinha"].desabilitado = !grupoProduto.logBandinha;
                if(grupoProduto.logBandinha && !!pesagem && this.isNotEmpty(pesagem.clBandinha)) {
                    _item.classificacaoItem["bandinha"].valor = pesagem.clBandinha;
                }
                else if(grupoProduto.logBandinha && !!item && this.isNotEmpty(item.percentualBandinha)) {
                    _item.classificacaoItem["bandinha"].valor = item.percentualBandinha;
                }

                // CHUVADO AVARIADO
                _item.classificacaoItem["chuvadoAvariado"].desabilitado = !grupoProduto.chuvAvar;
                if(grupoProduto.chuvAvar && !!pesagem && this.isNotEmpty(pesagem.clChuAvar)) {
                    _item.classificacaoItem["chuvadoAvariado"].valor = pesagem.clChuAvar;
                }
                else if(grupoProduto.chuvAvar && !!item && this.isNotEmpty(item.chuvadoAvariado)) {
                    _item.classificacaoItem["chuvadoAvariado"].valor = item.chuvadoAvariado;
                }

                // IMPUREZA
                _item.classificacaoItem["impureza"].desabilitado = !grupoProduto.impureza;
                if(grupoProduto.impureza && !!pesagem && this.isNotEmpty(pesagem.clImpureza)) {
                    _item.classificacaoItem["impureza"].valor = pesagem.clImpureza;
                }
                else if(grupoProduto.impureza && !!item && this.isNotEmpty(item.impureza)) {
                    _item.classificacaoItem["impureza"].valor = item.impureza;
                }

                // UMIDADE
                _item.classificacaoItem["teorUmidade"].desabilitado = !grupoProduto.umidade;
                if(grupoProduto.umidade && !!pesagem && this.isNotEmpty(pesagem.clUmidade)) {
                    _item.classificacaoItem["teorUmidade"].valor = pesagem.clUmidade;
                }
                else if(grupoProduto.umidade && !!item && this.isNotEmpty(item.umidade)) {
                    _item.classificacaoItem["teorUmidade"].valor = item.umidade;
                }

                // TBM
                _item.classificacaoItem["tbm"].desabilitado = !grupoProduto.tbm;
                if(grupoProduto.tbm && !!pesagem && this.isNotEmpty(pesagem.clTbm)) {
                    _item.classificacaoItem["tbm"].valor = pesagem.clTbm;
                }
                else if(grupoProduto.tbm && !!item && this.isNotEmpty(item.tbm)) {
                    _item.classificacaoItem["tbm"].valor = item.tbm;
                }

                // QTD TAXA RECEPCAO
                if(!!item && this.isNotEmpty(item.qtdRecepcao)) {
                    _item.classificacaoItem["qtTaxaRecepcao"].valor = item.qtdRecepcao;
                }

                // QTD TAXA SECAGEM
                if(!!item && this.isNotEmpty(item.qtdSecagem)) {
                    _item.classificacaoItem["qtTaxaSecagem"].valor = item.qtdSecagem;
                }

                // FNT
                _item.classificacaoItem["fnt"].desabilitado = !grupoProduto.fnt;
                if(grupoProduto.fnt && !!pesagem && this.isNotEmpty(pesagem.fnt)) {
                    _item.classificacaoItem["fnt"].valor = pesagem.fnt;
                }
                else if(grupoProduto.fnt && !!item && this.isNotEmpty(item.fnt)) {
                    _item.classificacaoItem["fnt"].valor = item.fnt;
                }

                // DENSIDADE
                _item.classificacaoItem["densidade"].desabilitado = !grupoProduto.densidade;
                if(grupoProduto.densidade && !!pesagem && this.isNotEmpty(pesagem.densidade)) {
                    _item.classificacaoItem["densidade"].valor = pesagem.densidade;
                }
                else if(grupoProduto.densidade && !!item && this.isNotEmpty(item.densidade)) {
                    _item.classificacaoItem["densidade"].valor = item.densidade;
                }
                
                // CONTROLE SEMENTE
                _item.classificacaoItem["controleSemente"].desabilitado = !grupoProduto.semente;
                if(grupoProduto.semente && !!pesagem && !!pesagem.controleSemente) {
                    _item.classificacaoItem["controleSemente"].valor = pesagem.controleSemente;
                }
                else if(grupoProduto.semente && !!item && !!item.controleSemente) {
                    _item.classificacaoItem["controleSemente"].valor = item.controleSemente;
                }

                if(!this.database.entradaManual) {
                    _item.classificacaoItem["phEntrada"].desabilitado = true;
                    _item.classificacaoItem["bandinha"].desabilitado = true;
                    _item.classificacaoItem["chuvadoAvariado"].desabilitado = true;
                    _item.classificacaoItem["teorUmidade"].desabilitado = true;
                    _item.classificacaoItem["impureza"].desabilitado = true;
                    _item.classificacaoItem["tbm"].desabilitado = true;
                    _item.classificacaoItem["controleSemente"].desabilitado = true;
                    _item.classificacaoItem["fnt"].desabilitado = true;
                    _item.classificacaoItem["densidade"].desabilitado = true;
                }
            },

            async incluirDesmembramento() {
                if(this.verificarCamposParaIncluirDesmembramento()) return;

                if(!this.valorKit && this.tipoGmoSelecionado) {
                    const tipoGmoId = this.tipoGmoSelecionado.id;
                    const { data } = await gmoService.verificarCobrancaKitTesteGmo(tipoGmoId);

                    if(!!data) {
                        this.pagaKit = data.pagaKit == undefined || data.pagaKit == null ? false : data.pagaKit;
                        this.valorKit = data.valorKit;
                    }
                }

                if(this.desmembramentos.length === 0 && !!this.item.desmembramento.desmembrarPelo 
                    && this.item.desmembramento.desmembrarPelo.codigo == "RENDA_LIQUIDA") {

                    const dados = this.getDados();
                    if(!this.validField()) return;
                    try {
                        const response = await rePendenteService.salvar(dados);
                        this.cadastro = false;
                        this.carregarFormulario(response.data);
                        this.atualizarTotalizadoresDesmembramento();
                    }
                    catch({ response }) {
                        const { data } = response;
                        this.alertaDesmembramentoMensagem = data.message;
                        this.alertaDesmembramentoCamposObrigatorios = true;
                        return;
                    }
                }

                this.desmembramento = {
                    produtorPrincipal: false,
                    produtorFavorecido: {},
                    produtorFavorecidoNome: "",
                    imovel: null,
                    nfProdutor: null,
                    serieNfProdutor: null,
                    dataNfProdutor: null,
                    percentual: null,
                    quantidadeQuilos: null,
                    quantidadeSacas: null
                };

                this.desmembramentoCampoDesabilitado = {};
                if(this.desmembramentos.length === 0) {
                    const produtor = Object.assign({}, this.produtorSelecionado);
                    this.desmembramento["produtorPrincipal"] = true;
                    this.desmembramento["produtorFavorecido"] = produtor;
                    this.desmembramentoCampoDesabilitado.produtorFavorecido = true;

                    if(produtor.cooperativa) {
                        this.preencherNomeProdutorFavorecido = true;
                        this.desmembramento["produtorFavorecidoNome"] = this.database.nomeProd;
                        this.desmembramentoCampoDesabilitado.produtorFavorecidoNome = true;
                    }

                    const imovel = Object.assign({}, this.imovelSelecionado);
                    imovel["label"] = `${ imovel.matricula } - ${ imovel.nome } - ${ imovel.estado }`;
                    this.desmembramento["imovel"] = imovel;
                    this.desmembramentoCampoDesabilitado.imovel = true;
                    
                    this.desmembramento["nfProdutor"] = this.database.nrNfProd;
                    this.desmembramentoCampoDesabilitado.nfProdutor = true;

                    this.desmembramento["serieNfProdutor"] = this.database.serNfProd;
                    this.desmembramentoCampoDesabilitado.serieNfProdutor = true;

                    this.desmembramento["dataNfProdutor"] = this.database.dtNfProd;
                    this.desmembramentoCampoDesabilitado.dataNfProdutor = true;
                }

                this.desmembramentoDialog       = true;
                this.desmembramentoEditarIndice = null;
                this.desmembramentoEditarValor  = 0;
            },

            salvarDesmembramento() {
                const desmembramento = Object.assign({}, this.desmembramento);
                const desmembrarPor = this.item.desmembramento.desmembrarPor;

                let isCampoPreenchido = true;

                if(!desmembramento.produtorFavorecido || !desmembramento.produtorFavorecido.codProdutor) {
                    this.isValidProdutorFavorecido = true;
                    isCampoPreenchido = false;
                }
                else if(desmembramento.produtorFavorecido.cooperativa && !desmembramento.produtorFavorecidoNome) {
                    this.isValidProdutorFavorecidoNome = true;
                    isCampoPreenchido = false;
                }
                
                if(!desmembramento.imovel) {
                    this.isValidDesmembramentoImovel = true;
                    isCampoPreenchido = false;
                }

                if(desmembrarPor === "PERCENTUAL" && !desmembramento.percentual) {
                    this.isValidDesmembramentoQuantidade = true;
                    isCampoPreenchido = false;
                }
                else if(desmembrarPor === "QUILOS" && !desmembramento.quantidadeQuilos) {
                    this.isValidDesmembramentoQuantidade = true;
                    isCampoPreenchido = false;
                }
                else if(desmembrarPor === "SACAS" && !desmembramento.quantidadeSacas) {
                    this.isValidDesmembramentoQuantidade = true;
                    isCampoPreenchido = false;
                }

                if(!isCampoPreenchido) {
                    this.$toast.add({
                        severity:'error', 
                        detail: "Por favor, preencher os campos obrigatórios!", 
                        life: 5000
                    });
                    return;
                }

                if(this.desmembramentos == null || this.desmembramentos.length == 0) {
                    if(desmembramento.produtorFavorecido.codProdutor != this.produtorSelecionado.codProdutor 
                        || desmembramento.imovel.matricula != this.imovelSelecionado.matricula) {
                            this.$toast.add({
                                severity:'warn', 
                                detail: "O primeiro desmembramento deve ocorrer com o produtor e o imóvel principal.",
                                life: 5000
                            });
                            return;
                        }
                }
                
                if(desmembrarPor === "PERCENTUAL" && desmembramento.percentual > (this.desmembramentoRestantePercentual + this.desmembramentoEditarValor)) {
                    this.$toast.add({
                        severity:'error', 
                        detail: "O percentual informado é maior que o percentual restante.", 
                        life: 5000
                    });
                    return;
                }
                else if(desmembrarPor === "QUILOS" && desmembramento.quantidadeQuilos > (this.desmembramentoRestanteQuilos + this.desmembramentoEditarValor)) {
                    this.$toast.add({
                        severity:'error', 
                        detail: "A quantidade de quilos informado é maior que a quantidade de quilos restante.", 
                        life: 5000
                    });
                    return;
                }
                else if(desmembrarPor === "SACAS" && desmembramento.quantidadeSacas > (this.desmembramentoRestanteSacas + this.desmembramentoEditarValor)) {
                    this.$toast.add({
                        severity:'error', 
                        detail: "A quantidade de sacas informada é maior que a quantidade de sacas restante.", 
                        life: 5000
                    });
                    return;
                }

                if(this.isDesmembramentoDuplicado(desmembramento.produtorFavorecido.codProdutor, desmembramento.imovel.matricula)) {
                    this.$toast.add({
                        severity:'error', 
                        detail: "O produtor e o imóvel informado já foi lançado.", 
                        life: 5000
                    });
                    return;
                }

                if(this.desmembramentoEditarIndice == null) {
                    this.desmembramentos.push(desmembramento);
                }
                else {
                    this.desmembramentos[this.desmembramentoEditarIndice] = desmembramento;
                }

                if((desmembrarPor === "PERCENTUAL" && (this.desmembramentoRestantePercentual - desmembramento.percentual) > 0) 
                    || (desmembrarPor === "QUILOS" && (this.desmembramentoRestanteQuilos - desmembramento.quantidadeQuilos) > 0) 
                    || (desmembrarPor === "SACAS" && (this.desmembramentoRestanteSacas - desmembramento.quantidadeSacas) > 0)) {
                        this.limparDadosModalDesmembramento();    
                        this.verificarSeExisteDesmembramento();
                        this.atualizarTotalizadoresDesmembramento();
                        this.desmembramentoCampoDesabilitado = {};
                        this.desmembramento = {
                            produtorPrincipal: false,
                            produtorFavorecido: {},
                            produtorFavorecidoNome: "",
                            imovel: null,
                            nfProdutor: null,
                            serieNfProdutor: null,
                            dataNfProdutor: null,
                            percentual: null,
                            quantidadeQuilos: null,
                            quantidadeSacas: null
                        };
                }
                else {
                    this.fecharDesmembramentoDialog();
                }
            },

            atualizarTotalizadoresDesmembramento() {
                let desmembramentoTotalLancadoPercentual = 0;
                let desmembramentoTotalLancadoSacas = 0;
                let desmembramentoTotalLancadoQuilos = 0;
                let desmembrarPor = !!this.item.desmembramento.desmembrarPor ? this.item.desmembramento.desmembrarPor : "";

                if(desmembrarPor === 'SACAS' && !this.quilosPorSaca) {
                    this.$toast.add({
                        severity:'warn', 
                        summary: 'O campo "kg/Saca" não está parametrizado.',
                        detail: "Por favor, verificar o cadastro do grupo de produto",
                        life: 5000
                    });
                }

                for(let item of this.desmembramentos) {
                    if(desmembrarPor === 'PERCENTUAL' && (item.percentual !== undefined || item.percentual !== null)) {
                        desmembramentoTotalLancadoPercentual += item.percentual;
                    }

                    if(desmembrarPor === 'SACAS' && (item.quantidadeSacas !== undefined || item.quantidadeSacas !== null)) {
                        desmembramentoTotalLancadoSacas += item.quantidadeSacas;
                    }

                    if(desmembrarPor === 'QUILOS' && (item.quantidadeQuilos !== undefined || item.quantidadeQuilos !== null)) {
                        desmembramentoTotalLancadoQuilos += item.quantidadeQuilos;
                    }
                }

                this.desmembramentoTotalLancadoPercentual = desmembramentoTotalLancadoPercentual;
                this.desmembramentoRestantePercentual     = 100;
                this.desmembramentoRestantePercentual     = parseFloat((this.desmembramentoRestantePercentual - desmembramentoTotalLancadoPercentual).toFixed(4));

                const desmembrarPelo = this.item.desmembramento.desmembrarPelo;
                this.desmembramentoTotalLancadoQuilos = desmembramentoTotalLancadoQuilos;
                this.desmembramentoTotalQuilos        = desmembrarPelo == null || desmembrarPelo.codigo == 'PESO_LIQUIDO' ? this.database.pesoLiquido : this.database.itens[0].rendaLiquida;
                this.desmembramentoRestanteQuilos     = this.desmembramentoTotalQuilos - desmembramentoTotalLancadoQuilos;

                this.desmembramentoTotalLancadoSacas = desmembramentoTotalLancadoSacas;
                this.desmembramentoTotalSacas        = parseFloat((this.desmembramentoTotalQuilos / this.quilosPorSaca).toFixed(4));
                this.desmembramentoRestanteSacas     = parseFloat((this.desmembramentoTotalSacas - desmembramentoTotalLancadoSacas).toFixed(4));
            },

            excluirDesmembramento(indice) {
                if(indice < 0) return;
                this.desmembramentos.splice(indice, 1);
                this.verificarSeExisteDesmembramento();
                this.atualizarTotalizadoresDesmembramento();
            },

            editarDesmembramento(dados, indice) {
                const desmembramento = Object.assign({}, dados);
                desmembramento["produtorFavorecido"] = Object.assign({}, dados.produtorFavorecido);

                const imovel = Object.assign({}, dados.imovel);
                imovel["label"] = `${ imovel.matricula } - ${ imovel.nome } - ${ imovel.estado }`;
                desmembramento["imovel"] = imovel;

                if(desmembramento["produtorPrincipal"]) {
                    this.desmembramentoCampoDesabilitado.produtorFavorecido = true;
                    this.desmembramentoCampoDesabilitado.produtorFavorecidoNome = true;
                    this.desmembramentoCampoDesabilitado.imovel = true;
                    this.desmembramentoCampoDesabilitado.nfProdutor = true;
                    this.desmembramentoCampoDesabilitado.serieNfProdutor = true;
                    this.desmembramentoCampoDesabilitado.dataNfProdutor = true;
                }

                this.desmembramentoEditarIndice = indice;
                this.desmembramento = desmembramento;
                this.desmembramentoDialog = true;

                const desmembrarPor = this.item.desmembramento.desmembrarPor;
                if(desmembrarPor === "PERCENTUAL") {
                    this.desmembramentoEditarValor = desmembramento.percentual;
                }
                else if(desmembrarPor === "QUILOS") {
                    this.desmembramentoEditarValor = desmembramento.quantidadeQuilos;
                }
                else if(desmembrarPor === "SACAS") {
                    this.desmembramentoEditarValor = desmembramento.quantidadeSacas;
                }
                else {
                    this.desmembramentoEditarValor = 0;
                }
            },

            fecharDesmembramentoDialog() {
                this.desmembramentoDialog = false;
                this.limparDadosModalDesmembramento();    
                this.verificarSeExisteDesmembramento();
                this.atualizarTotalizadoresDesmembramento();
            },

            limparDadosModalDesmembramento() {
                this.desmembramento = {};
                this.desmembramentoEditarIndice = null;
                this.desmembramentoCampoDesabilitado = {};
                this.preencherNomeProdutorFavorecido = false;
                this.desmembramentoEditarIndice = null;
                this.desmembramentoEditarValor = 0;

                this.isValidProdutorFavorecido = false;
                this.isValidProdutorFavorecidoNome = false;
                this.isValidDesmembramentoImovel = false;
                this.isValidDesmembramentoQuantidade = false;
            },

            verificarSeExisteDesmembramento() {
                this.service.disable = this.desmembramentos.length > 0;
            },

            isDesmembramentoDuplicado(codigoProdutor, matriculaImovel) {
                if(!this.desmembramentos) return;

                for(let indice = 0; indice < this.desmembramentos.length; indice++) {
                    const item = this.desmembramentos[indice];

                    if(this.desmembramentoEditarIndice != indice && item.produtorFavorecido.codProdutor == codigoProdutor 
                        && item.imovel.matricula == matriculaImovel) {
                        return true;
                    }
                }

                return false;
            },

            verificarCamposParaIncluirDesmembramento() {
                const campos = [];

                if(!this.estabelecimentoSelecionado) {
                    campos.push("Estabelecimento");
                }

                if(!this.grupoProdutoSelecionado) {
                    campos.push("Grupo Produto");
                }

                if(!this.database || !this.database.placa) {
                    campos.push("Placa");
                }

                if(!this.database || !this.database.nrDocPes) {
                    campos.push("Documento de pesagem");
                }

                if(!this.produtorSelecionado) {
                    campos.push("Produtor");
                }

                if(!!this.produtorSelecionado && this.produtorSelecionado.cooperativa && (!this.database || !this.database.nomeProd)) {
                    campos.push("Nome produtor");
                }

                if(!this.database || !this.database.dtEntrada) {
                    campos.push("Data Entrada");
                }

                if(!this.database || !this.database.hrEntrada) {
                    campos.push("Hora Entrada");
                }

                if(!this.imovelSelecionado) {
                    campos.push("Imóvel");
                }

                if(!!this.grupoProduto && this.grupoProduto.logTransgenico && !this.tipoGmoSelecionado) {
                    campos.push("Tipo GMO");
                }

                if(!!this.tipoGmoSelecionado && (!this.database || !this.database.tipoRr)) {
                    campos.push("Soja GMO");
                }

                if(!!this.grupoProduto && this.grupoProduto.cafeCoco && (!this.database || !this.database.tipoRendaCfe)) {
                    campos.push("Tipo Renda Café");
                }

                if(!!this.grupoProduto && this.grupoProduto.semente && (!this.database || !this.database.nrOrdCampo)) {
                    campos.push("Nr. Ordem Campo");
                }

                if(!!this.grupoProduto && this.grupoProduto.semente && !this.classeSelecionado) {
                    campos.push("Classe");
                }

                if(!!this.grupoProduto && this.grupoProduto.semente && (!this.database || !this.database.nrLaudo)) {
                    campos.push("Nr. Laudo Insp. Campo");
                }

                if(!!this.grupoProduto && this.grupoProduto.semente && (!this.database || !this.database.nrContSem)) {
                    campos.push("Nr. Controle Semente");
                }

                if(!this.database || !this.database.pesoBruto) {
                    campos.push("Peso Bruto (Kg)");
                }

                if(!this.item || !this.item.produto) {
                    campos.push("Produto");
                }

                if(!this.item && !this.item.qualidade.desabilitado 
                    && (!this.item.qualidade.normal || !this.item.qualidade.terra 
                    || !this.item.qualidade.sementeira || !this.item.qualidade.vagem)) {
                    campos.push("Qualidade Produto");
                }

                if(campos.length > 0) {
                    this.alertaDesmembramentoMensagem = 'Os campos obrigatórios não foram preenchidos: "' + campos.join("\", \"") + '"';
                    this.alertaDesmembramentoCamposObrigatorios = true;
                    return true;
                }

                return false;
            },

            formatDecimal(value, minimumFractionDigits, maximumFractionDigits) {
                return formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
            },

            selecionarProdutoPadronizado() {
                this.item.desmembramento.desmembrar = false;
                this.selecionarDesmembramento();
            },

            removerCaracteresEspeciais(event) {
                if(!event || !event.target || !event.target.value) return;
                event.target.value = event.target.value.replace(/[^a-zA-Z0-9]/g, "");
            },

            aceitarApenasNumeros(event) {
                if(!event || !event.target || !event.target.value) return;
                event.target.value = event.target.value.replace(/[^0-9]/g, "");
            },

            validarHora() {
                if(!this.database.hrEntrada) return;
                const validarHora = new RegExp(/([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/);
                if(!validarHora.test(this.database.hrEntrada)) {
                    this.database.hrEntrada = undefined;
                    this.$toast.add({
                        severity:'warn', 
                        summary: 'O horário informado não é válido.',
                        detail: "Por favor, forneça um horário de entrada válido.",
                        life: 5000
                    });
                }
            }
        },

        async mounted(){
            if(!this.id && !this.ticket) {
                const codigoEstabelecimento = this.$route.params.codigoEstabelecimento;
                const dateOption = {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                }

                const dataCorrente = new Date().toLocaleDateString("pt-br", dateOption);
                const aux = dataCorrente.split(", ");
                
                this.cadastro = true;
                this.database.dtEntrada = moment(aux[0], "DD/MM/YYYY").toDate(); 
                this.database.hrEntrada = aux[1];
                this.database.entradaManual = true;

                try {
                    const { data } = await estabelecimentoService.validarEntradaProducaoPorCodigoEstabelecimentoEntradaManual(codigoEstabelecimento, true);
                    if(!!data) {
                        const estabelecimento = data;
                        estabelecimento["codigoNomeFantasia"] = estabelecimento.codigo + " - " + estabelecimento.nomeFantasia;
                        this.estabelecimentoSelecionado = estabelecimento;
                    }
                }
                catch(exception) {
                    const { data } = exception.response;

                    this.service.disable     = true;
                    this.doubleClick         = true;
                    this.service.msg_active  = true;
                    this.service.msg_type    = "error";
                    this.service.msg_content = data.message;
                }
            }
            else if(!this.ticket && this.id) {
                this.cadastro = false;
                this.buscarDadosFormulario();
            }
            else if(!!this.ticket) {
                const codigoEstabelecimento = this.$route.params.codigoEstabelecimento;
                const nroDocPesagem = this.$route.params.nroDocPesagem;
                const safra = this.$route.params.safra;

                this.cadastro = true;

                try {
                    const { data } = await estabelecimentoService.validarEntradaProducaoPorCodigoEstabelecimentoEntradaManual(codigoEstabelecimento, false);
                }
                catch(exception) {
                    const { data } = exception.response;

                    this.service.disable     = true;
                    this.doubleClick         = true;
                    this.service.msg_active  = true;
                    this.service.msg_type    = "error";
                    this.service.msg_content = data.message;
                    return;
                }

                this.buscarInformacaoProdutoPesagem(codigoEstabelecimento, safra, nroDocPesagem);
            }
        }
    }

</script>

<style scoped>
    .label {
        text-align: right;
        padding: 0;
    }

    .campo {
        margin: 0.5rem 0;
        padding: 0 0 0 0.5rem;
        overflow: hidden;
    }
</style>