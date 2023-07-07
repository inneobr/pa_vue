<template>
    <Toast />
    <div class="card">
        <div class="flex justify-content-between">
            <div class="flex align-items-center">
                <i class="pi pi-dollar mr-2" style="font-size: 2rem;"></i>
                <h4 style="margin:0;">{{ id ? 'Editar' : 'Criar'}} Taxas de Produção </h4>
            </div>
        </div><hr /> 

        <div class="grid col-12 xl:col-8">            
            <div class="col-12 xl:col-6">
                <label><strong>Descrição<span style="color:red;">&nbsp;*</span></strong></label>
                <InputText class="w-full mt-1" v-model="taxaProducao.descricao" :class="{'p-invalid': descricaoInvalid}" :disabled="disable"/>
            </div>

            <div class="col-12 xl:col-6">
                <label for="safra"><strong>Safra<span style="color:red;">&nbsp;*</span></strong></label> 
                <Dropdown id="dropDownSafra"
                    class="w-full mt-1"
                    v-model="SafraSelecionada" 
                    :options="safraOptions"
                    :disabled="safraDisbled"                
                />
            </div>
        </div>

        <div class="col-12">
            <TabView @tab-click="verificaSeMilho()">
                <TabPanel>
                    <template #header>
                        <i class="pi pi-dollar mr-1" style="font-size: 1.0rem;"></i>
                        <span>Taxas</span>
                    </template>

                    <div class="col-12 grid">
                        <div class="col-12 lg:col-6" >
                            <Fieldset legend="Armazenagem" :toggleable="false" >
                                
                                <div class="grid align-items-center">
                                    <div class="col-5" style="text-align:right;">
                                        <label for="cobrarTaxa" class="text-right">
                                            <strong>Cobrar Taxa?:</strong>
                                        </label>
                                    </div>
                                    <div class="col-7">
                                        <Checkbox :disabled="disable" id="armazenagemCobrarTaxa" v-model="taxaProducao.cobrancaArmazenagem" :binary="true" @change="armazenagemCobrarTaxa()"/>
                                    </div>
                                </div>

                                <div class="grid align-items-center">
                                    <div class="col-5" style="text-align:right;">
                                        <label for="valorTaxaSaca60" class="text-right">
                                            <strong>Valor Taxa SC 60kg:</strong>
                                        </label>
                                    </div>
                                    <div class="col-7">
                                        <InputNumber class="col-12 mt-1" id="valorTaxaSaca60" v-model="taxaProducao.valorTaxaSaca60"  mode="decimal" :minFractionDigits="9" :maxFractionDigits="9" :disabled="!taxaProducao.cobrancaArmazenagem" :class="{'p-invalid': valorTaxaSaca60Invalid}" @blur="calcularTaxaSaca60($event)"/>
                                    </div>
                                </div>

                                <div class="grid align-items-center">
                                    <div class="col-5" style="text-align:right;">
                                        <label for="armazenagemVlrtaxa" class="text-right">
                                            <strong>Valor Taxa:</strong>
                                        </label>
                                    </div>
                                    <div class="col-7">
                                        <InputNumber class="col-12 mt-1" id="armazenagemVlrtaxa" v-model="taxaProducao.valorArmazenagem"  mode="decimal" :minFractionDigits="9" :maxFractionDigits="9" :disabled="true" :class="{'p-invalid': valorArmazenagemInvalid}"/>
                                    </div>
                                </div>

                                <div class="grid align-items-center">
                                    <div class="col-5" style="text-align:right;">
                                        <label for="numeroDiasCarencia" class="text-right">
                                            <strong>Nr. Dias Carência:</strong>
                                        </label>
                                    </div>
                                    <div class="col-7">
                                        <InputNumber class="col-12 mt-1" v-model="taxaProducao.numeroDiasCarencia" :disabled="!taxaProducao.cobrancaArmazenagem"  />
                                    </div>
                                </div>


                                <div class="grid align-items-center">
                                    <div class="col-5" style="text-align:right;">
                                        <label for="dataCorte" class="text-right">
                                            <strong v-if="!isMilho()">Data Corte:</strong>
                                            <strong v-if="isMilho()">Data Início Cobrança – Verão:</strong>
                                        </label>
                                    </div>
                                    <div class="col-7">
                                        <!-- <InputMask class="w-full mt-1" id="armazenagemDataCorte" v-model="dataCobrancaArmazenagemAux1" mask="99/99/9999" :disabled="!taxaProducao.cobrancaArmazenagem" :class="{'p-invalid': dataCobrancaArmazenagemInvalid}"></InputMask>  -->
                                        <div class="overflow-hidden">
                                            <Calendar
                                                class="w-full"
                                                v-model="dataCobrancaArmazenagemAux1"
                                                autocomplete="off"
                                                dateFormat="dd/mm/yy"
                                                :disabled="!taxaProducao.cobrancaArmazenagem" :class="{'p-invalid': dataCobrancaArmazenagemInvalid}"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="grid align-items-center" v-if="isMilho()">
                                    <div class="col-5" style="text-align:right;">
                                        <label for="dataCorte2" class="text-right">
                                            <strong>Data Início Cobrança – Inverno:</strong>
                                        </label>
                                    </div>
                                    <div class="col-7">
                                        <!-- <InputMask class="w-full mt-1" id="armazenagemDataCorte2" v-model="dataCobrancaArmazenagemAux2" mask="99/99/9999" :disabled="!taxaProducao.cobrancaArmazenagem" :class="{'p-invalid': dataCobrancaArmazenagemInvalid}"></InputMask>  -->
                                        <Calendar
                                                class="w-full"
                                                v-model="dataCobrancaArmazenagemAux2"
                                                autocomplete="off"
                                                dateFormat="dd/mm/yy"
                                            />
                                    </div>
                                </div>

                                <Fieldset legend="Períodos de Carência" :toggleable="false">
                                    <DataTable
                                        :value="periodosCarencia"
                                        >
                                        <template #empty>Nenhum registro encontrado.</template>
                                        <template #loading>Carregando... Por favor, aguarde.</template>
                                        <Column field="dataInicial" header="Início">
                                            <template #body="{ data }">
                                                {{  formatDate(data.dataInicial, 'DD/MM/YY') }}
                                            </template>
                                        </Column>
                                        <Column field="dataFinal" header="Fim">
                                            <template #body="{ data }">
                                                {{  formatDate(data.dataFinal, 'DD/MM/YY') }}
                                            </template>
                                        </Column>

                                        <Column field="quantidadeDiasCarencia" header="Dias" class="font-bold text-right"/>
                                        <Column v-if="integrationVisible" header="Ações" style="width:9em;">
                                            <template #body="{ data, index }">
                                                <div class="flex-none">
                                                    <Button icon="pi pi-pencil" title="Editar" class="p-button-rounded p-button-warning flex-none mr-1" @click="editarLinhaCarencia(index, data)" />                                
                                                    <Button icon="pi pi-trash" title="Excluir" class="p-button-rounded p-button-sucess flex-none" @click="excluirLinhaCarencia(index)"/>
                                                </div>
                                            </template>
                                        </Column>
                                    </DataTable>
                                    <div class="col-12" style="text-align:left">
                                        <Button
                                            v-if="integrationVisible"
                                            icon="pi pi-plus"
                                            label="Incluir"
                                            class="p-button-info mr-1"
                                            @click="abrirModalDiasCarencia()"
                                            style="height: 2rem; padding-top: 5px;"
                                            :disabled="!taxaProducao.cobrancaArmazenagem"
                                            />
                                    </div>
                                </Fieldset>    

                            </Fieldset>
                        </div>

                        <div class="col-12 xl:col-6">
                            <div class="col-12" >
                                <Fieldset legend="Recepção" :toggleable="false" >                                    
                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="recepcaoCobrarTaxa" class="text-right">
                                                <strong>Cobrar Taxa?:</strong>
                                            </label>
                                        </div>
                                        <div class="col-8">
                                            <Checkbox id="recepcaoCobrarTaxa" v-model="taxaProducao.cobraRecepcao" :binary="true" />
                                        </div>
                                    </div>

                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="recepcaoTipoCobranca" class="text-right">
                                                <strong>Tipo Cobrança:</strong>
                                            </label>
                                        </div>
                                        <div class="mr-3">
                                            <RadioButton name="tipoCobranca" value="ENTRADA" v-model="taxaProducao.tipoCobraRecepcaoPor" id="recepcaoEntrada" :disabled="!taxaProducao.cobraRecepcao" :class="{'p-invalid': tipoCobraRecepcaoPorInvalid}"/>
                                            <label for="recepcaoEntrada"> Entrada</label>
                                        </div>

                                        <div class="mr-3">
                                            <RadioButton  name="tipoCobranca" value="FIXACAO" v-model="taxaProducao.tipoCobraRecepcaoPor" id="recepcaoFixacao" :disabled="!taxaProducao.cobraRecepcao" :class="{'p-invalid': tipoCobraRecepcaoPorInvalid}"/>
                                            <label for="rececaoFixacao"> Fixação</label>
                                        </div>
                                    </div>

                                    
                                    <div class="grid align-items-center">
                                        <div class="col-5" style="text-align:right;">
                                            <label for="valorTaxaSaca60" class="text-right">
                                                <strong>Valor Taxa SC 60kg:</strong>
                                            </label>
                                        </div>
                                        <div class="col-7">
                                            <InputNumber class="col-12 mt-1" id="valorTaxaSaca60" v-model="taxaProducao.valorTaxaSaca60Recepcao"  mode="decimal" :minFractionDigits="9" :maxFractionDigits="9" :disabled="!taxaProducao.cobraRecepcao" :class="{'p-invalid': valorTaxaSaca60Invalid}" @blur="calcularTaxaSaca60Recepcao($event)"/>
                                        </div>
                                    </div>
                                    

                                    <div class="grid align-items-center">
                                        <div class="col-5" style="text-align:right;">
                                            <label for="recepcaoValorTaxa" class="text-right">
                                                <strong>Valor Taxa por kg:</strong>
                                            </label>
                                        </div>
                                        <div class="col-7">
                                            <InputNumber class="col-12 mt-1" id="recepcaoValorTaxa" v-model="taxaProducao.valorTaxaRecepcao"  mode="decimal" :minFractionDigits="9" :disabled="true" :class="{'p-invalid': valorTaxaRecepcaoInvalid}" />
                                        </div>
                                    </div>
                                </Fieldset>

                                <Fieldset v-if="false" legend="Manutenção" :toggleable="false" >
                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="manutencaoDiasCarencia" class="text-right">
                                                <strong>Dias Carência:</strong>
                                            </label>
                                        </div>
                                        <div class="col-8">
                                            <InputNumber class="col-12 mt-1" id="manutencaoDiasCarencia" v-model="taxaProducao.manutencaoCarencia" />
                                        </div>
                                    </div>

                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="manutencaoValorPorSaca" class="text-right">
                                                <strong>Vl/SC - Quinz:</strong>
                                            </label>
                                        </div>
                                        <div class="col-8">
                                            <InputNumber class="col-12 mt-1" id="manutencaoValorPorSaca" v-model="taxaProducao.manutencaoValorPorSaca"   mode="decimal" :minFractionDigits="9"  />
                                        </div>
                                    </div>
                                </Fieldset>

                                <Fieldset v-if="false" legend="Quebra técnica" :toggleable="false" >
                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="quebraTecnicaTipo" class="text-right">
                                                <strong>Tipo: </strong>
                                            </label>
                                        </div>

                                        <div class="mr-3">
                                            <RadioButton name="quebraTecnicaTipo" value="NENHUM" v-model="taxaProducao.quebraTecnicaCobrancaPor" id="quebraTecnicaTipoValor"/>
                                            <label for="quebraTecnicaTipoValor"> Nenhum</label>
                                        </div>

                                        <div class="mr-3">
                                            <RadioButton name="quebraTecnicaTipo" value="VALOR" v-model="taxaProducao.quebraTecnicaCobrancaPor" id="quebraTecnicaTipoValor"/>
                                            <label for="quebraTecnicaTipoValor"> Valor</label>
                                        </div>

                                        <div class="mr-3">
                                            <RadioButton  name="quebraTecnicaTipo" value="PRODUTO" v-model="taxaProducao.quebraTecnicaCobrancaPor" id="quebraTecnicaTipoProduto"/>
                                            <label for="quebraTecnicaTipoProduto"> Produto</label>
                                        </div>
                                    </div>

                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="quebraTecnicaDiasCarencia" class="text-right">
                                                <strong>Dias Carência:</strong>
                                            </label>
                                        </div>
                                        <div class="col-8">
                                            <InputNumber class="col-12 mt-1" id="quebraTecnicaDiasCarencia" v-model="taxaProducao.quebraTecnicaCarencia" />
                                        </div>
                                    </div>

                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="quebraTecnicaDiasMax" class="text-right">
                                                <strong>Dias Máx.:</strong>
                                            </label>
                                        </div>
                                        <div class="col-8">
                                            <InputNumber class="col-12 mt-1" id="quebraTecnicaDiasMax" v-model="taxaProducao.quebraTecnicaDiasMaximo" />
                                        </div>
                                    </div>

                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="quebraTecnicaPercentualAoDia" class="text-right">
                                                <strong>(%) Ao Dia:</strong>
                                            </label>
                                        </div>
                                        <div class="col-8">
                                            <InputNumber class="col-12 mt-1" id="quebraTecnicaPercentualAoDia" v-model="taxaProducao.quebraTecnicaPercentualAoDia" suffix="%"   mode="decimal" :minFractionDigits="2"/>
                                        </div>
                                    </div>
                                </Fieldset>
                            </div>

                            <div class="col-12" >
                                <Fieldset legend="Secagem/Limpeza" :toggleable="false" >
                                    
                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="secagemCobrarTaxa" class="text-right">
                                                <strong>Cobrar Taxa?:</strong>
                                            </label>
                                        </div>
                                        <div class="col-8">
                                            <Checkbox id="secagemCobrarTaxa" v-model="taxaProducao.cobraSecagem" :binary="true"  />
                                        </div>
                                    </div>

                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="secagemTipoCobranca" class="text-right">
                                                <strong>Tipo Cobrança:</strong>
                                            </label>
                                        </div>
                                        <div class="mr-3">
                                            <RadioButton name="secagemTipoCobranca" value="ENTRADA" v-model="taxaProducao.tipoCobraSecagemNa" id="secagemEntrada" :disabled="!taxaProducao.cobraSecagem" :class="{'p-invalid': tipoCobraSecagemNaInvalid}" @click="disableValor(false)"/>
                                            <label for="secagemEntrada"> Entrada</label>
                                        </div>

                                        <div class="mr-3">
                                            <RadioButton  name="secagemTipoCobranca" value="FIXACAO" v-model="taxaProducao.tipoCobraSecagemNa" id="secagemFixacao" :disabled="!taxaProducao.cobraSecagem" :class="{'p-invalid': tipoCobraSecagemNaInvalid}" @click="disableValor(true)"/>
                                            <label for="secagemFixacao"> Fixação</label>
                                        </div>
                                    </div>

                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="secagemCobrar" class="text-right">
                                                <strong>Cobrar:</strong>
                                            </label>
                                        </div>
                                        <div class="mr-3">
                                            <RadioButton name="secagemCobrar" value="VALOR" v-model="taxaProducao.tipoCobrancaSecagemPor" id="secagemPorValor" :disabled="!taxaProducao.cobraSecagem || cobrancaValor" :class="{'p-invalid': tipoCobrancaSecagemPorInvalid}"/>
                                            <label for="secagemCobrar"> Por Valor</label>
                                        </div>

                                        <div class="mr-3">
                                            <RadioButton  name="secagemCobrar" value="EM_QUILOS" v-model="taxaProducao.tipoCobrancaSecagemPor" id="secagemEmKg" :disabled="!taxaProducao.cobraSecagem || cobrancaValor" :class="{'p-invalid': tipoCobrancaSecagemPorInvalid}"/>
                                            <label for="secagemCobrar"> Em Kg</label>
                                        </div>
                                    </div>
                                </Fieldset>

                                <Fieldset v-if="false" legend="Seguro" :toggleable="false" >   
                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="seguroDiasCarencia" class="text-right">
                                                <strong>Dias Carência:</strong>
                                            </label>
                                        </div>
                                        <div class="col-8">
                                            <InputNumber class="col-12 mt-1" id="seguroDiasCarencia" v-model="taxaProducao.taxaSeguroCarencia" />
                                        </div>
                                    </div>

                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="seguroPercentualPorSaca" class="text-right">
                                                <strong>%/SC - Quinz:</strong>
                                            </label>
                                        </div>
                                        <div class="col-8">
                                            <InputNumber class="col-12 mt-1" id="seguroPercentualPorSaca" v-model="taxaProducao.taxaSeguroPercentualPorSaca" suffix="%" mode="decimal" :minFractionDigits="2"/>
                                        </div>
                                    </div>

                                </Fieldset>

                                <Fieldset v-if="false" legend="Taxas" :toggleable="false" >
                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="taxaValorOperacional" class="text-right">
                                                <strong>Valor Taxa Operacional:</strong>
                                            </label>
                                        </div>
                                        <div class="col-8">
                                            <InputNumber class="col-12 mt-1" id="taxaValorOperacional" v-model="taxaProducao.taxaValorOperacional" mode="decimal" :minFractionDigits="2"/>
                                        </div>
                                    </div>

                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="taxaReceitaRegional" class="text-right">
                                                <strong>Taxa Receita Regional:</strong>
                                            </label>
                                        </div>
                                        <div class="col-8">
                                            <InputNumber class="col-12 mt-1" id="taxaReceitaRegional" v-model="taxaProducao.taxaReceitaRegional" mode="decimal" :minFractionDigits="2"/>
                                        </div>
                                    </div>

                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="taxaRetencaoEspecial" class="text-right">
                                                <strong>Retenção Especial:</strong>
                                            </label>
                                        </div>
                                        <div class="col-8">
                                            <InputNumber class="col-12 mt-1" id="taxaRetencaoEspecial" v-model="taxaProducao.taxaRetencaoEspecial" mode="decimal" :minFractionDigits="2"/>
                                        </div>
                                    </div>

                                    <div class="grid align-items-center">
                                        <div class="col-4" style="text-align:right;">
                                            <label for="taxaOutras" class="text-right">
                                                <strong>Outras Taxas:</strong>
                                            </label>
                                        </div>
                                        <div class="col-8">
                                            <InputNumber class="col-12 mt-1" id="taxaOutras" v-model="taxaProducao.taxaOutras" mode="decimal" :minFractionDigits="2"/>
                                        </div>
                                    </div>

                                </Fieldset>

                                </div>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel v-if="integrationVisible">
                    <template #header> 
                        <div :class="{'warn': grupo_erro }">
                            <i class="pi pi-shopping-bag mr-1" style="font-size: 1.0rem;;"></i>
                            <span>Grupo De Produtos</span>
                        </div>
                    </template>                           

                    <PickList class="col-12 xl:col-8" v-model="grupoProduto" @selection-change="grupoProdutoChange()" dataKey="id" listStyle="height:500px;" >
                        <template #sourceheader>
                            Disponíveis
                        </template>
                        <template #targetheader>
                            Vinculados
                        </template>
                        <template #item="{ item }">
                            <span>{{ item.fmCodigo }} - {{ item.descricao }}</span>
                        </template>
                    </PickList>
                </TabPanel>

                <TabPanel v-if="integrationVisible">
                    <template #header>
                        <div :class="{'warn': stb_erro }">
                            <i class="pi pi-home mr-1" style="font-size: 1.0rem;"></i>
                            <span>Estabelecimentos</span>
                        </div>
                    </template>

                    <PickList class="col-12 lg:col-8" v-model="estabPickList" dataKey="id" listStyle="height:500px;" >
                        <template #sourceheader>
                            Disponíveis
                        </template>                    
                        <template #targetheader>
                            <div :class="{'warn': stb_erro}">
                                Vinculados
                            </div>
                        </template>                    
                        <template #item="{ item }">
                            <span>{{ item.codigo }} - {{ item.nomeFantasia }}</span>
                        </template>
                    </PickList>
                </TabPanel>                
            </TabView> 
        </div>  

        <div class="col-12"><hr/>
                <Button v-if="integrationVisible"
                    icon="pi pi-save"
                    label="Salvar"
                    class="p-button-info mr-1"
                    @click="salvar()"/>

                <Button v-if="integrationVisible"
                    icon="pi pi-times"
                    label="Cancelar"
                    class="p-button-danger"
                    @click="voltar()"/>

                <Button v-if="!integrationVisible"
                    icon="pi pi-spinner"
                    label="Voltar"
                    class="p-button-outlined"
                    @click="voltar()"/>    
            </div>    
    </div>  


    <Dialog v-model:visible="ativarDialogDiasCarencia" :style="{width: '400px'}" :modal="true">
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-calendar mr-1" style="font-size: 1.4rem"></i>
                <h3 style="margin:0px 5px;">Período de Carência</h3>
            </div>
        </template>

        <div class="align-items-center justify-content-center">
        
        <div class="col-12">
            <label><strong>Início<span style="color:red;">&nbsp;*</span></strong></label>
            <!-- <InputMask class="w-full mt-1" v-model="dataInicial" mask="99/99/9999" :disabled="edicaoCarencia"/> -->
            <div class="overflow-hidden">
                <Calendar
                    class="w-full"
                    v-model="dataInicial"
                    autocomplete="off"
                    dateFormat="dd/mm/yy"
                />
            </div>

        </div>

        <div class="col-12">
            <label><strong>Fim<span style="color:red;">&nbsp;*</span></strong></label>
            <!-- <InputMask class="w-full mt-1" v-model="dataFinal" mask="99/99/9999" :disabled="edicaoCarencia"/> -->
            <div class="overflow-hidden">
                <Calendar
                    class="w-full"
                    v-model="dataFinal"
                    autocomplete="off"
                    dateFormat="dd/mm/yy"
                />
            </div>
        </div>

        <div class="col-12">
            <label><strong>Dias<span style="color:red;">&nbsp;*</span></strong></label>
            <InputNumber class="w-full mt-1" v-model="quantidadeDiasCarencia" />
        </div>


        </div>
        <template #footer>
            <Button
                    icon="pi pi-save"
                    label="Salvar"
                    class="p-button-info mr-1"
                    :disabled="doubleClick"
                    @click="salvarDiasCarencia()"/>

                <Button
                    icon="pi pi-times"
                    label="Cancelar"
                    class="p-button-danger"
                    @click="ativarDialogDiasCarencia = false"/>
        </template>
    </Dialog>

    
</template>
    
<script>
    
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import TaxasProducaoService from  '../../service/TaxasProducaoService';
    import TratamentoDeError from '../../utilities/TratamentoDeError';
    import GrupoProdutoService from '../../service/GrupoProdutoService';
    import IntegracaoService from '../../service/IntegracaoService';
    import SafraService from '../../service/SafraService';
    import Formatacao from '../../utilities/Formatacao';
    

    export default {
        props: {
            id: {
                type: String,
                required: false
            },
            
            isEditar:{
                type:Boolean,
                required:false
            },

            isCopiar: {
                type: Boolean,
                required: false
            }
        },
        data() {
            return {
                taxaProducao:{
                    id: null,
                    descricao: null,
                    safra: null,
                    
                    cobrancaArmazenagem: false,
                    valorArmazenagem: null,
                    valorTaxaSaca60:null,
                    dataCobrancaArmazenagem: null,
                    dataCobrancaArmazenagem2: null,

                    cobraRecepcao: false,
                    tipoCobraRecepcaoPor: null,
                    valorTaxaRecepcao: null,


                    manutencaoCarencia: null,
                    manutencaoValorPorSaca: null,

                    quebraTecnicaCobrancaPor: 'NENHUM',
                    quebraTecnicaCarencia: null,
                    quebraTecnicaDiasMaximo: null,
                    quebraTecnicaPercentualAoDia: null,

                    cobraSecagem: false,
                    tipoCobraSecagemNa: null,
                    tipoCobrancaSecagemPor: null,

                    taxaSeguroCarencia: null,
                    taxaSeguroPercentualPorSaca: null,

                    taxaValorOperacional: null,
                    taxaReceitaRegional: null,
                    taxaRetencaoEspecial: null,
                    taxaOutras: null,
                    
                    grupoProdutos: [],
                    carenciaArmazenagens: [],

                },                
                integrationVisible: true,
                integrationDisable: false,

                //Auxiliares para trabalhar com a Data
                dataCobrancaArmazenagemAux1:null,
                dataCobrancaArmazenagemAux2:null,

                //GrupoProdutos
                grupoProduto: [[],[]], 
                grupoProdutoOptions: [], 
                grupoProdutoSelecionado: null,
                
                //Estabelecimentos
                estabelecimentos: [], 
                estabPickList: [[], []],

                //Safra
                SafraSelecionada:null,
                safraOptions:[],
                safraDisbled:false,
                
                //exibeDataCorte2:false,

                //Validação
                validacaoMilho:false,
                validacaoNaoMilho:false,

                //Dialog periodos Carência
                visibleDialogCarencia: false,
                ativarDialogDiasCarencia: false,                
                
                dataInicial:null,
                dataFinal:null,
                quantidadeDiasCarencia:null,
                indexCarencia:null,
                idCarencia:null,
                edicaoCarencia:false,

                periodosCarencia:[],

                //Validação
                descricaoInvalid:false,
                valorArmazenagemInvalid:false,
                dataCobrancaArmazenagemInvalid:false,
                dataCobrancaArmazenagem2Invalid:false,
                
                tipoCobraRecepcaoPorInvalid: false,
                valorTaxaRecepcaoInvalid: false,
                
                tipoCobraSecagemNaInvalid: false,
                tipoCobrancaSecagemPorInvalid: false,

                cobrancaValor: false,
                doubleClick: false,

            }
        },

        methods: { 
            getIntegrationOptons(){
                const paginaAtual = "TAXA_PRODUCAO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integrationVisible = data.visible;
                            this.integrationDisable = data.disable;
                        }
                    })
            }, 
            
            calcularTaxaSaca60(val){
                
                if(!val.target.value) return;
                

                const auxTaxa60kg = parseFloat(val.target.value.replace('.', '').replace(',', '.'));//this.taxaProducao.valorTaxaSaca60;

                if(auxTaxa60kg < 0){
                    val.target.value = null;
                    this.taxaProducao.valorArmazenagem = null;
                    this.$toast.add({
                        severity:'error', 
                        detail:'O valor informado não pode ser negativo.', 
                        life: 3000
                    });
                    
                    return;
                }

                this.taxaProducao.valorArmazenagem = (auxTaxa60kg /  60).toFixed(9);
            },

            calcularTaxaSaca60Recepcao(val){
                
                if(!val.target.value) return;

                const auxTaxa60kg = parseFloat(val.target.value.replace('.', '').replace(',', '.'));//this.taxaProducao.valorTaxaSaca60;

                if(auxTaxa60kg < 0){
                    val.target.value = null;
                    this.taxaProducao.valorTaxaRecepcao = null;
                    this.$toast.add({
                        severity:'error', 
                        detail:'O valor informado não pode ser negativo.', 
                        life: 3000
                    });
                    
                    return;
                }


                this.taxaProducao.valorTaxaRecepcao = (auxTaxa60kg /  60).toFixed(9);
            },

            verificaSeMilho(){

                this.grupoProduto[1].map((grupoProduto => {
                    if(grupoProduto.tipoProdutoNome === 'MILHO')
                        this.validacaoMilho = true;
                    else
                        this.validacaoNaoMilho = true;
                    }))
                
                if(this.validacaoMilho && !this.validacaoNaoMilho)
                {
                    //é Milho
                    return true;
                }
                return false
            },

            isMilho(){
                return this.validacaoMilho;
            },

            disableValor(dados){
                this.cobrancaValor = dados;
                this.taxaProducao.tipoCobrancaSecagemPor = "VALOR";
                if(this.cobrancaValor == false) {
                    this.taxaProducao.tipoCobrancaSecagemPor = undefined;
                }
            },

            //Utilizado para carregar os dados quando for edição.
            carregarDados() {
                
                if(!this.id) return;
                
                TaxasProducaoService.getTaxasProducaoDetalhes(this.id)
                    .then(({ data }) => {
                        if(data) {

                            this.taxaProducao = data;
                            
                            this.SafraSelecionada = data.safra;
                            this.periodosCarencia = data.carenciaArmazenagens;
                            this.carregarGruposProdutos(data.grupoProdutos);
                            this.carregarEstabelecimentos(data.estabelecimentos);

                            if(data.dataCobrancaArmazenagem !== null){
                                this.dataCobrancaArmazenagemAux1 = new Date( data.dataCobrancaArmazenagem ); //Formatacao.formatDateCustom(data.dataCobrancaArmazenagem, 'DD/MM/yyyy');
                            }

                            if(data.dataCobrancaArmazenagem2 !== null ){
                                this.dataCobrancaArmazenagemAux2 = new Date(data.dataCobrancaArmazenagem2);//Formatacao.formatDateCustom(data.dataCobrancaArmazenagem2, 'DD/MM/yyyy');
                            }

                            if(this.isCopiar){
                                this.taxaProducao.id = null;
                                this.taxaProducao.descricao =  this.taxaProducao.descricao + " - ( cópia )";
                            }
                        }
                        else{
                            this.voltar();
                        }
                    })
                    .catch(error => {
                        this.voltar();
                    });

            },

            //Volta a List
            voltar() {
                this.$router.push(`/taxas-producao`);
            },            

            //Quando á alguma alteração no picklist grupoProduto
            //Objetivo, quando selecionado MILHO não pode selecionar mais outro grupoProduto diferente de milho.
            //Quando selecionado outros tipos que naõ são milho, não permite a seleção de milho.
            grupoProdutoChange(){

                this.validacaoMilho = false;
                this.validacaoNaoMilho = false;

                if(this.grupoProduto[1].length > 1)
                {
                    this.grupoProduto[1].map((grupoProduto => {

                        if(grupoProduto.tipoProdutoNome === 'MILHO')
                            this.validacaoMilho = true;
                        else
                            this.validacaoNaoMilho = true;
                    }))
                }

                if(this.validacaoMilho && this.validacaoNaoMilho)
                {
                    this.$toast.add({
                        severity:'error', 
                        detail:'Quando Inserido um Grupo de Produto contendo Milho, não é permitido inserir outro Grupo de tipo difernete de Milho', 
                        life: 3000
                    });
                }

            },

            //Realiza as validações de obrigatoriedade dos campos
            isCamposPreenchidos(){
                
                this.descricaoInvalid=false;
                this.valorArmazenagemInvalid=false;
                this.dataCobrancaArmazenagemInvalid=false;
                this.dataCobrancaArmazenagem2Invalid=false;
                this.tipoCobraRecepcaoPorInvalid=false;
                this.valorTaxaRecepcaoInvalid=false;
                this.tipoCobraSecagemNaInvalid=false;
                this.tipoCobrancaSecagemPorInvalid=false;

                let isValid = true;

                //Validação se Descrição Preenchida
                if(!this.taxaProducao.descricao) {
                    this.$toast.add({
                        severity:'warn', 
                        summary: 'Alerta', 
                        detail:'Campo { DESCRIÇÃO } é obrigatório.', 
                        life: 3000
                    });

                    this.descricaoInvalid = true;
                    isValid = false;
                }

                //Validação Armazenagem
                if(this.taxaProducao.cobrancaArmazenagem){
                    
                    if(!this.taxaProducao.valorArmazenagem) {
                        this.$toast.add({
                            severity:'warn', 
                            summary: 'Alerta', 
                            detail:'Campo { VALOR ARMAZENAGEM } é obrigatório.', 
                            life: 3000
                        });
                        this.valorArmazenagemInvalid = true;
                        isValid = false;
                    }

                    if(!this.dataCobrancaArmazenagemAux1) {
                        this.$toast.add({
                            severity:'warn', 
                            summary: 'Alerta', 
                            detail:'Campo { DATA COBRAÇA ARMAZENAGEM } é obrigatório.', 
                            life: 3000
                        });
                        this.dataCobrancaArmazenagemInvalid = true;
                        isValid = false;
                    }

                    if(this.isMilho()){
                        
                        if(!this.dataCobrancaArmazenagemAux2) {
                            this.$toast.add({
                                severity:'warn', 
                                summary: 'Alerta', 
                                detail:'Campo { DATA COBRAÇA ARMAZENAGEM } é obrigatório.', 
                                life: 3000
                            });
                            this.dataCobrancaArmazenagem2Invalid = true;
                            isValid = false;
                        }   
                    }

                }

                //Validação Recepção
                if(this.taxaProducao.cobraRecepcao){   
                    if(!this.taxaProducao.tipoCobraRecepcaoPor) {
                        this.$toast.add({
                            severity:'warn', 
                            summary: 'Alerta', 
                            detail:'Campo { TIPO COBRANÇA RECEPÇÃO POR } é obrigatório.', 
                            life: 3000
                        });
                        this.tipoCobraRecepcaoPorInvalid = true;
                        isValid = false;
                    }

                    if(!this.taxaProducao.valorTaxaRecepcao) {
                        this.$toast.add({
                            severity:'warn', 
                            summary: 'Alerta', 
                            detail:'Campo { VALOR TAXA RECEPÇÃO } é obrigatório.', 
                            life: 3000
                        });                        
                        this.valorTaxaRecepcaoInvalid = true;
                        isValid = false;
                    }

                    
                }

                //Validação Secagem
                if(this.taxaProducao.cobraSecagem){   
                    if(!this.taxaProducao.tipoCobraSecagemNa) {
                        this.$toast.add({
                            severity:'warn', 
                            summary: 'Alerta', 
                            detail:'Campo { TIPO COBRANÇA SECAGEM } é obrigatório.', 
                            life: 3000
                        });
                        this.tipoCobraSecagemNaInvalid = true;
                        isValid = false;
                    }

                    if(!this.taxaProducao.tipoCobrancaSecagemPor) {
                        this.$toast.add({
                            severity:'warn', 
                            summary: 'Alerta', 
                            detail:'Campo { TIPO COBRANÇA SECAGEM POR } é obrigatório.', 
                            life: 3000
                        });
                        this.tipoCobrancaSecagemPorInvalid = true;
                        isValid = false;
                    }
                }

                //Validação se adicionado 1 ou mais "Grupo de Produto"
                if(this.grupoProduto[1].length < 1){
                    this.$toast.add({
                        severity:'warn', 
                        summary: 'Alerta', 
                        detail:'É necessário Adicionar ao menos um { Grupo de Produto }.', 
                        life: 3000
                    });
                    isValid = false;
                }
                if(this.estabPickList[1].lenght < 1){
                    this.$toast.add({
                        severity:'warn', 
                        summary: 'Alerta', 
                        detail:'É necessário Adicionar ao menos um { Estabelecimento }.', 
                        life: 3000
                    });
                    isValid = false;
                }                
                return isValid;
                
            },

            getDados(){
                const taxaProducao = this.taxaProducao;
                taxaProducao.safra = this.SafraSelecionada;

                if(this.dataCobrancaArmazenagemAux1 !== null && this.dataCobrancaArmazenagemAux1 !== ''){
                    const dataAux1 = this.dataCobrancaArmazenagemAux1; 
                    this.taxaProducao.dataCobrancaArmazenagem = dataAux1.toISOString();
                }
                
                if(this.isMilho()){
                    if(this.dataCobrancaArmazenagemAux2 !== null && this.dataCobrancaArmazenagemAux1 !== ''){
                        const dataAux2 = this.dataCobrancaArmazenagemAux2;
                        this.taxaProducao.dataCobrancaArmazenagem2 = dataAux2.toISOString();
                    }
                }
                
                taxaProducao['carenciaArmazenagens'] = this.periodosCarencia;
                taxaProducao['grupoProdutos'] = this.grupoProduto[1];
                taxaProducao['estabelecimentos'] = this.estabPickList[1];

                if(!this.taxaProducao.cobraRecepcao){
                    this.taxaProducao.tipoCobraRecepcaoPor = "NENHUM";                    
                }

                if(!this.taxaProducao.cobraSecagem){
                    this.taxaProducao.tipoCobraSecagemNa = "NENHUM";
                    this.taxaProducao.tipoCobrancaSecagemPor = "NENHUM";
                }

                // if(this.taxaProducao.quebraTecnicaCobrancaPor === null)
                // {
                //     this.taxaProducao.quebraTecnicaCobrancaPor = "NENHUM";
                // }

                if(this.id !== null){
                    taxaProducao.id = this.id;
                }
                

                return taxaProducao;
            },

           

            salvar(){
                
                if(!this.isCamposPreenchidos() && !this.doubleClick) return;
                this.doubleClick = true;
                const taxaProducao = this.getDados();

                if(this.isEditar){
                    TaxasProducaoService.atualizar(taxaProducao)
                        .then(response => {
                                this.$toast.add({
                                    severity:'success',
                                    detail:'A Taxa de Produção foi atualizada com sucesso!',
                                    life: 3000
                                });
                                this.voltar();
                        })
                        .catch(error => {
                            console.log(error.response.data);
                            this.doubleClick = false;                            
                            this.$toast.add(TratamentoDeError(error, this.isCadastro()));
                            
                        });
                }
                else{
                    TaxasProducaoService.cadastrar(taxaProducao)
                        .then(response => {
                                this.$toast.add({
                                    severity:'success',
                                    detail:'A Taxa de Produção foi cadastrado com sucesso!',
                                    life: 3000
                                });
                                this.voltar();
                        })
                        .catch(error => {
                            this.doubleClick =  false;
                            this.$toast.add(TratamentoDeError(error, this.isCadastro()));
                            
                        });
                }
            },

            carregarGruposProdutos(vinculados = []){
                GrupoProdutoService.listarGruposProdutos()
                    .then(({ data }) => { 
                        if(data) {
                            let disponiveis = data;
                               
                            disponiveis = disponiveis.filter(disponivel => {
                                const item = vinculados.find(vinculado => {
                                    return vinculado.descricao === disponivel.descricao;
                                });

                                return item === undefined;
                            });

                            let classificacaoDisponivel = [];
                            if(disponiveis != null){
                                classificacaoDisponivel = disponiveis.map(grupoProduto => {
                                    return {
                                        id: null,
                                        idGrupoProduto: grupoProduto.id,
                                        fmCodigo: grupoProduto.fmCodigo,
                                        codDesc: grupoProduto.codDesc,
                                        descricao: grupoProduto.descricao,
                                        estabelecimentos: [], //this.estabelecimentos,
                                        tipoProdutoNome: grupoProduto.tipoProduto.nome,
                                    }
                                });
                                //console.log(disponiveis)
                                
                            }
                            
                            this.grupoProduto = [classificacaoDisponivel, vinculados];                                                        
                        }
                        else {
                            this.grupoProduto = [[], []];
                        }
                    })
                    .catch(error => {
                        this.grupoProduto = [[], []];
                    });
            },

            carregarEstabelecimento() {
                EstabelecimentoService.getTodosEstabelecimentos()
                    .then(({ data }) => {
                        if(data) {
                            this.estabelecimentos = data;
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            },

            //Acionado ao modificar a dropDown "Grupo Produto" fazendo que preencha o picklist estabelecimento com os disponíveis e os vinculados
            grupoProdutoSelect() {

                if(this.grupoProdutoSelecionado == null) {
                    this.estabPickList = [[], []];
                    return;
                }

                const vinculados = this.grupoProdutoSelecionado.estabelecimentos ? this.grupoProdutoSelecionado.estabelecimentos : [];

                const disponiveis = this.estabelecimentos.filter(disponivel => {
                    const item = vinculados.find(vinculado => {
                        return vinculado.id === disponivel.id;
                    });
                    return item === undefined;
                });

                this.estabPickList = [disponiveis, vinculados];
            },

            //##############################
            // Tabela Períodos de Carencia:
            //##############################

            //Tabela Carencia - Validação
            validaTabelaCarencia()
            {
                let isValid = true;

                if(this.dataInicial == undefined){
                    
                    this.$toast.add({
                        severity:'error',
                        detail:'Favor informar a data de início.', 
                        life: 5000
                    });
                    isValid = false;
                }

                if(this.dataFinal == undefined){
                    
                    this.$toast.add({
                        severity:'error',
                        detail:'Favor informar a data fim.', 
                        life: 5000
                    });
                    isValid = false;
                }

                if(this.quantidadeDiasCarencia == undefined){
                    
                    this.$toast.add({
                        severity:'error',
                        detail:'Favor informar o número de dias de carência.', 
                        life: 5000
                    });
                    isValid = false;
                }

                const dataInicialAux = this.dataInicial;
                const dataFinalAux = this.dataFinal;

                if(!this.checarData(dataInicialAux)){
                    this.$toast.add({
                        severity:'error',
                        detail:'A data de início está incorreta.', 
                        life: 5000
                    });
                    isValid = false;
                }

                if(!this.checarData(dataFinalAux)){
                    this.$toast.add({
                        severity:'error',
                        detail:'A data fim está incorreta.', 
                        life: 5000
                    });
                    isValid = false;
                }


                if(dataInicialAux > dataFinalAux){
                    this.$toast.add({
                        severity:'error',
                        detail:'A data do período inicial não pode ser maior que a data do período final', 
                        life: 5000
                    });
                    isValid = false;
                }

                
                
                if(!this.VerificaRangeData(dataInicialAux, dataFinalAux) && this.indexCarencia === null){
                    //console.log('Entrou no data invalida');
                    this.$toast.add({
                        severity:'error',
                        detail:'Não é possível inserir esta data pois causa conflito com outra data já inserida na tabela de carências.', 
                        life: 8000
                    });
                    isValid = false;
                }

                return isValid;
            },

            //Salva a Modal
            salvarDiasCarencia(){
                //Método responsável por adicionar na Grid Período de Carência seus Valores
                if(!this.validaTabelaCarencia())
                    return;
                

                if(this.indexCarencia !== null){
                    
                    this.periodosCarencia[this.indexCarencia] = this.getDadosCarencia();
                    this.indexCarencia = null;

                }else{
                    this.periodosCarencia.push(this.getDadosCarencia());
                }

                

                this.dataInicial=null;
                this.dataFinal=null;
                this.quantidadeDiasCarencia=null;
                this.ativarDialogDiasCarencia = false;
                
            },

            //Tabela Carencia - Abre a Modal
            abrirModalDiasCarencia(){
                //Método responsável por habilitar a modal Período de Carencia
                this.dataInicial=null;
                this.dataFinal=null;
                this.quantidadeDiasCarencia=null;
                this.indexCarencia=null;
                this.idCarencia=null;
                this.edicaoCarencia = false;

                this.ativarDialogDiasCarencia = true;
            },

            //Tabela Carencia - Recupera os dados Carencia
            getDadosCarencia() {

                const dataInicialAux = this.dataInicial;
                const dataFinalAux = this.dataFinal;

                return {
                    id: this.idCarencia,
                    dataInicial: dataInicialAux.toISOString(),
                    dataFinal: dataFinalAux.toISOString(),
                    quantidadeDiasCarencia: this.quantidadeDiasCarencia
                }
            },

            //Tabela Carencia - Excluir
            excluirLinhaCarencia(index){
                this.periodosCarencia.splice(index,1);
            },

            // Tabela Carencia - Editar
            editarLinhaCarencia(index, data){
                
                this.dataInicial = new Date(data.dataInicial); //Formatacao.formatDateCustom(data.dataInicial, 'DD/MM/YYYY');
                this.dataFinal = new Date(data.dataFinal);//Formatacao.formatDateCustom(data.dataFinal, 'DD/MM/YYYY');
                this.quantidadeDiasCarencia = data.quantidadeDiasCarencia;
                this.indexCarencia = index;
                this.idCarencia = data.id;

                this.edicaoCarencia = true;

                this.ativarDialogDiasCarencia = true;
            },

            

            //Evento para carregar a Safra
            carregarSafra(){
                SafraService.getTodasSafras1996()
                    .then(({ data }) => {
                        this.safraOptions = data;
                    })
                    .catch(error => {
                        this.voltar();
                    });


                this.SafraSelecionada = new Date().getFullYear();
            },

            //Evento - Armazenagem - Cobrar Taxa
            armazenagemCobrarTaxa(){
                //Usuário desmarca o checkbox Armazenagem Cobrar Taxa.
                if(!this.taxaProducao.cobrancaArmazenagem){
                    this.dataCobrancaArmazenagemAux1 = null;
                    this.dataCobrancaArmazenagemAux2 = null;
                    this.taxaProducao.valorArmazenagem = null;
                    this.taxaProducao.valorTaxaSaca60 = null;
                    this.taxaProducao.numeroDiasCarencia = null;
                    this.periodosCarencia = [];
                }
            },

            //Evento - Recepção - Cobrar Taxa
            recepcaoCobrarTaxa(){

                if(this.taxaProducao.cobraRecepcao){
                    document.getElementById('recepcaoEntrada').classList.remove('p-radiobutton-disabled'); 
                    document.getElementById('recepcaoFixacao').classList.remove('p-radiobutton-disabled'); 
                    document.getElementById('recepcaoValorTaxa').removeAttribute("disabled");

                }else{
                    document.getElementById('recepcaoEntrada').classList.add('p-radiobutton-disabled'); 
                    document.getElementById('recepcaoFixacao').classList.add('p-radiobutton-disabled'); 
                    document.getElementById('recepcaoValorTaxa').setAttribute("disabled","disabled"); 
                }
            },

            //Evento - Secagem - Cobrar Taxa
            secagemCobrarTaxa(){

                if(this.taxaProducao.cobraSecagem){
                    document.getElementById('secagemEntrada').classList.remove('p-radiobutton-disabled'); 
                   
                }else{
                    document.getElementById("secagemEntrada").className+='p-radiobutton-disabled';
                }
            },


            isCadastro(){
                if(this.id === null)
                    return true;
            },


            //Recupera a Data no formato dd/MM/yyyy e converte ela em Date
            convertToDate(dateString) {
                //  Convert a "dd/MM/yyyy" string into a Date object
                let d = dateString.split("/");
                let dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
                return dat;     
            },

            //Formatar a Grid
            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            //Verifica se é uma data válida
            checarData(data) {
                return data instanceof Date && !isNaN(data);
            },
            
            
            VerificaRangeData(dataInicial, dataFinal) {

                let DInicial = new Date(dataInicial);
                let DFinal =  new Date(dataFinal);
                let isValid = true;

                this.periodosCarencia.forEach( function(periodo, i) {
                    //console.log('[forEach]', periodo, i);

                    let D1 = new Date(periodo.dataInicial);
                    let D2 = new Date(periodo.dataFinal);

                    //console.log('DataInicial: ', DInicial);
                    //console.log('DataFinal: ', DFinal);
                    //console.log('D1: ', D1);
                    //console.log('D2: ', D2);
                
                    if (DInicial.getTime() <= D2.getTime() && DInicial.getTime() >= D1.getTime()) {
                             //console.log("Date Inicial is in between the Date 1 and Date 2"); 
                             isValid = false;
                    }
                    if (DFinal.getTime() <= D2.getTime() && DFinal.getTime() >= D1.getTime()) {
                            //console.log("Date Final is in between the Date 1 and Date 2"); 
                             isValid = false;
                    }
                });
                
                return isValid;
            },

            carregarEstabelecimentos(vinculados = []){

                //console.log('vinculados: ', vinculados);

                EstabelecimentoService.getTodosEstabelecimentosSilo()
                    .then(({ data }) => { 
                        if(data) {
                            let disponiveis = data;
                                
                            disponiveis = disponiveis.filter(disponivel => {
                                const item = vinculados.find(vinculado => {
                                    return vinculado.codigo === disponivel.codigo;
                                });

                                return item === undefined;
                            });

                            let estabelecimentoDisponivel = [];
                            if(disponiveis != null){
                                estabelecimentoDisponivel = disponiveis.map(estabelecimento => {
                                    return {
                                            id: null,
                                            idEstabelecimento: estabelecimento.id,
                                            codigo: estabelecimento.codigo,
                                            nomeFantasia: estabelecimento.nomeFantasia,
                                    }
                                });
                                //console.log(disponiveis)
                            }
                            

                            //console.log('Disponivel', estabelecimentoDisponivel);
                            //console.log('Vinculados', vinculados);

                            this.estabPickList = [estabelecimentoDisponivel, vinculados];                                                        
                        }
                        else {
                            this.estabPickList = [[], []];
                        }
                    })
                    .catch(error => {
                        this.estabPickList = [[], []];
                    });
            },

        },

        created() {            
            this.carregarDados();   
            this.getIntegrationOptons();       
        },
       
        
        mounted() {    
            if(this.isCadastro()) {
                this.carregarGruposProdutos();
                this.carregarEstabelecimentos();
            }
            if(this.isEditar){
                this.safraDisbled = true;
            }

            this.carregarSafra();   
            //this.carregarEstabelecimento();
            
        },
    }
</script>
