<template>
    <Toast />

    <div class="card mb-3">
        <div class="flex justify-content-between">
            <div class="flex align-items-center">
                <i class="pi pi-tablet mr-1" style="font-size: 1.4rem"></i>
                <h4 style="margin:0px 5px;">Parâmetros de Produção</h4>
            </div>

            <!-- <div class="flex">
                <Button
                    v-if="isDesabilitado && integration.visible"
                    icon="pi pi-pencil"
                    label="Editar"
                    class="p-button-outlined"
                    @click="isDesabilitado = false"
                ></Button>
                <Button
                    v-if="!isDesabilitado"
                    icon="pi pi-save"
                    label="Salvar"
                    class="p-button-info mr-1"
                    @click="salvar()"
                ></Button>
                <Button
                    v-if="!isDesabilitado"
                    icon="pi pi-times"
                    label="Cancelar"
                    class="p-button-danger"
                    @click="voltar()"
                ></Button>
            </div> -->
        </div>
    </div>

    <div class="card mb-3" style="width: 49.5%; float: left;">
        <div class="flex justify-content-between align-items-center mb-2">
            <strong style="font-size:12pt;">Informações</strong>
            <Button icon="pi" class="p-button-rounded p-button-text" @click="visualizarInformacao('PARAM_PRODUCAO_INFORMACOES')">
                <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
            </Button>
        </div>

        <div class="grid align-items-center">
            <div class="col-3 label">
                <label>Tabela Preços:</label>
            </div>
            <div class="col-3 campo">
                <InputText class="w-full" tabindex="1" v-model="parametros.tabelaFixar" :maxlength="5" :disabled="isDesabilitado" />
            </div>
            <div class="col-3 label">
                <label>Conta Transitória:</label>
            </div>
            <div class="col-3 campo">
                <InputText class="w-full" tabindex="2" v-model="parametros.contaTransitoria" :maxlength="20" :disabled="isDesabilitado" />
            </div>

            <div class="col-3 label">
                <label>Dia Venc. SENAR:</label>
            </div>
            <div class="col-3 campo">
                <InputNumber
                    class="w-full"
                    tabindex="3"
                    v-model="parametros.diaVencimentoSenar"
                    mode="decimal"
                    :disabled="isDesabilitado"
                />
            </div>
            <div class="col-3 label">
                <label>Conta AVA APB:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="4" class="w-full" v-model="parametros.contaDevFechar" :maxlength="8" :disabled="isDesabilitado" />
            </div>

            <div class="col-3 label">
                <label>Dia Venc. INSS:</label>
            </div>
            <div class="col-3 campo">
                <InputNumber
                    class="w-full"
                    tabindex="5"
                    v-model="parametros.diaVencimentoInss"
                    mode="decimal"
                    :disabled="isDesabilitado"
                />
            </div>
            <div class="col-3 label">
                <label>C. Custo AVA APB:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="6" class="w-full" v-model="parametros.centroCustoAva" :maxlength="8" :disabled="isDesabilitado" />
            </div>

            <div class="col-3 label">
                <label>Usuário Bayer:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="7" class="w-full" v-model="parametros.bayerUsuario" :maxlength="30" :disabled="isDesabilitado" />
            </div>
            <div class="col-3 label">
                <label>Qtde Anos:</label>
            </div>
            <div class="col-3 campo">
                <InputNumber
                    class="w-full"
                    tabindex="8"
                    v-model="parametros.qtdAnosFixacao"
                    :min="0"
                    :max="999"
                    mode="decimal"
                    :disabled="isDesabilitado"
                />
            </div>

            <div class="col-3 label">
                <label>Senha Bayer:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="9" class="w-full" v-model="parametros.bayerSenha" :maxlength="30" :disabled="isDesabilitado" />
            </div>
            <div class="col-3 label">
                <label>Qtde Max Bxa Contrato:</label>
            </div>
            <div class="col-3 campo">
                <InputNumber
                    class="w-full"
                    tabindex="10"
                    v-model="parametros.qtdMaxBxaMassa"
                    mode="decimal"
                    :disabled="isDesabilitado"
                />
            </div>
        </div>
    </div>
    
    <div class="card mb-3" style="width: 49.5%; float:right;">
        <div class="flex justify-content-between align-items-center">
            <strong style="font-size:12pt;">Parâmetros Para Geração de EPC</strong>
            <Button icon="pi" class="p-button-rounded p-button-text" @click="visualizarInformacao('PARAM_PRODUCAO_EPC')">
                <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
            </Button>
        </div>
        <Fieldset>
            <template #legend>
                Rateio grupo Cooperado
            </template>
            <div class="grid align-items-center">
                <div class="col-3 label">
                    <label>Tipo:</label>
                </div>
                <div class="col-3 campo">
                    <InputText tabindex="20" class="w-full" v-model="parametros.tipoFluxoCooperado" :maxlength="12" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="21" class="w-full" v-model="parametros.tipoFluxoCooperadoDescricao" :disabled="isDesabilitado" />
                </div>

                <div class="col-3 label">
                    <label>Plano De Conta:</label>
                </div>
                <div class="col-3 campo">
                    <InputText tabindex="22" class="w-full" v-model="parametros.planoContaContabilCooperado" :maxlength="20" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="23" class="w-full" v-model="parametros.planoContaContabilCooperadoDescricao" :disabled="isDesabilitado" />
                </div>

                <div class="col-3 label">
                    <label>Conta Contábil:</label>
                </div>
                <div class="col-3 campo">
                    <InputText tabindex="24" class="w-full" v-model="parametros.contaContabilCooperado" :maxlength="20" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="25" class="w-full" v-model="parametros.contaContabilCooperadoDescricao" :disabled="isDesabilitado" />
                </div>
            </div>
        </Fieldset>

        <Fieldset class="mt-4">
            <template #legend>
                Rateio grupo Terceiro
            </template>
            <div class="grid align-items-center">
                <div class="col-3 label">
                    <label>Tipo Fluxo:</label>
                </div>
                <div class="col-3 campo">
                    <InputText tabindex="26" class="w-full" v-model="parametros.tipoFluxoTerceiro" :maxlength="12" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="27" class="w-full" v-model="parametros.tipoFluxoTerceiroDescricao" :disabled="isDesabilitado" />
                </div>

                <div class="col-3 label">
                    <label>Plano De Conta:</label>
                </div>
                <div class="col-3 campo">
                    <InputText tabindex="28" class="w-full" v-model="parametros.planoContaContabilTerceiro" :maxlength="20" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="29" class="w-full" v-model="parametros.planoContaContabilTerceiroDescricao" :disabled="isDesabilitado" />
                </div>

                <div class="col-3 label">
                    <label>Conta Contábil:</label>
                </div>
                <div class="col-3 campo">
                    <InputText tabindex="30" class="w-full" v-model="parametros.contaContabilTerceiro" :maxlength="20" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="31" class="w-full" v-model="parametros.contaContabilTerceiroDescricao" :disabled="isDesabilitado" />
                </div>
            </div>
        </Fieldset>

        <Fieldset class="mt-4">
            <template #legend>
                Ficha Contábil
            </template>
            <div class="grid align-items-center">
                <div class="col-3 label">
                    <label>Tipo Fluxo:</label>
                </div>
                <div class="col-3 campo">
                    <InputText tabindex="32" class="w-full" v-model="parametros.contaContabilTransitoria" :maxlength="20" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="33" class="w-full" v-model="parametros.contaContabilTransitoriaDescricao" :disabled="isDesabilitado" />
                </div>
            </div>
        </Fieldset>
    </div>
    
    <div class="card mb-3" style="width: 49.5%; float:left;">
        <div class="flex justify-content-between align-items-center mb-2">
            <strong style="font-size:12pt;">Taxas</strong>
            <Button icon="pi" class="p-button-rounded p-button-text" @click="visualizarInformacao('PARAM_PRODUCAO_TAXAS')" >
                <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
            </Button>
        </div>

        <div class="grid align-items-center">
            <div class="col-3 label">
                <label>Retenção Adm.:</label>
            </div>
            <div class="col-3 campo">
                <InputNumber
                    tabindex="11"
                    class="w-full"
                    v-model="parametros.taxaAdministracao"
                    mode="decimal"
                    :minFractionDigits="2"
                    :disabled="isDesabilitado"
                />
            </div>

            <div class="col-3 label">
                <label>INSS PF:</label>
            </div>
            <div class="col-3 campo">
                <InputNumber
                    tabindex="12"
                    class="w-full"
                    v-model="parametros.taxaInssPf"
                    mode="decimal"
                    :minFractionDigits="2"
                    :disabled="isDesabilitado"
                />
            </div>

            <div class="col-3 label">
                <label>Retenção Cap.:</label>
            </div>
            <div class="col-3 campo">
                <InputNumber
                    tabindex="13"
                    class="w-full"
                    v-model="parametros.taxaRetencao"
                    mode="decimal"
                    :minFractionDigits="2"
                    :disabled="isDesabilitado"
                />
            </div>
            
            <div class="col-3 label">
                <label>INSS PJ:</label>
            </div>
            <div class="col-3 campo">
                <InputNumber
                    tabindex="14"
                    class="w-full"
                    v-model="parametros.taxaInssPj"
                    mode="decimal"
                    :minFractionDigits="2"
                    :disabled="isDesabilitado"
                />
            </div>

            <div class="col-3 label">
                <label>SENAR PF:</label>
            </div>
            <div class="col-3 campo">
                <InputNumber
                    tabindex="15"
                    class="w-full"
                    v-model="parametros.taxaSenarPf"
                    mode="decimal"
                    :minFractionDigits="2"
                    :disabled="isDesabilitado"
                />
            </div>

            <div class="col-3 label">
                <label>GILRAT PF:</label>
            </div>
            <div class="col-3 campo">
                <InputNumber
                    tabindex="16"
                    class="w-full"
                    v-model="parametros.taxaGilratPf"
                    mode="decimal"
                    :minFractionDigits="2"
                    :disabled="isDesabilitado"
                />
            </div>
            
            <div class="col-3 label">
                <label>SENAR PJ:</label>
            </div>
            <div class="col-3 campo">
                <InputNumber
                    tabindex="17"
                    class="w-full"
                    v-model="parametros.taxaSenarPj"
                    mode="decimal"
                    :minFractionDigits="2"
                    :disabled="isDesabilitado"
                />
            </div>

            <div class="col-3 label">
                <label>GILRAT PJ:</label>
            </div>
            <div class="col-3 campo">
                <InputNumber
                    tabindex="18"
                    class="w-full"
                    v-model="parametros.taxaGilratPj"
                    mode="decimal"
                    :minFractionDigits="2"
                    :disabled="isDesabilitado"
                />
            </div>

            <div class="col-3 label">
                <label>Extra:</label>
            </div>
            <div class="col-3 campo">
                <InputNumber
                    tabindex="19"
                    class="w-full"
                    v-model="parametros.taxaExtra"
                    mode="decimal"
                    :minFractionDigits="2"
                    :disabled="isDesabilitado"
                />
            </div>
        </div>
    </div>
    
    <div class="card mb-3" style="clear: both;">
        <div class="flex justify-content-between align-items-center mb-3">
            <strong style="font-size:12pt;">Espécie</strong>
            <Button icon="pi" class="p-button-rounded p-button-text" @click="visualizarInformacao('PARAM_PRODUCAO_ESPECIE')">
                <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
            </Button>
        </div>

        <div class="grid align-items-start">
            <div class="grid align-items-center col-3">
                <div class="col-6 label">
                    <label>Fechamento:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="34" class="w-full" v-model="parametros.codEspecieFechamento" :maxlength="2" :disabled="isDesabilitado" />
                </div>

                <div class="col-6 label">
                    <label>Permuta:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="35" class="w-full" v-model="parametros.codEspeciePermuta" :maxlength="3" :disabled="isDesabilitado" />
                </div>

                <div class="col-6 label">
                    <label>INSS:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="36" class="w-full" v-model="parametros.codEspecieInss" :disabled="isDesabilitado" />
                </div>

                <div class="col-6 label">
                    <label>SENAR:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="37" class="w-full" v-model="parametros.codEspecieSenar" :disabled="isDesabilitado" />
                </div>

                <div class="col-6 label">
                    <label>GILRAT:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="38" class="w-full" v-model="parametros.codEspecieGilrat" :disabled="isDesabilitado" />
                </div>

                <div class="col-6 label">
                    <label>Retenção Cap.:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="39" class="w-full" v-model="parametros.codEspecieCapital" :disabled="isDesabilitado" />
                </div>
            </div>

            <div class="grid align-items-center col-3">
                <div class="col-6 label">
                    <label>Retenção Adm.:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="40" class="w-full" v-model="parametros.codEspecieAdmin" :maxlength="2" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 label">
                    <label>FAM:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="41" class="w-full" v-model="parametros.codEspecieFam" :maxlength="2" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 label">
                    <label>Armazenagem:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="42" class="w-full" v-model="parametros.codEspecieArmazen" :maxlength="2" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 label">
                    <label>Seguro:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="43" class="w-full" v-model="parametros.codEspecieSeguro" :maxlength="2" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 label">
                    <label>Manutenção:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="44" class="w-full" v-model="parametros.codEspecieManutencao" :maxlength="2" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 label">
                    <label>Recepção:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="45" class="w-full" v-model="parametros.codEspecieRecepcao" :disabled="isDesabilitado" />
                </div>
            </div>

            <div class="grid align-items-center col-3">
                <div class="col-6 label">
                    <label>Secagem/Limpeza:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="46" class="w-full" v-model="parametros.codEspecieSecagem" :maxlength="2" :disabled="isDesabilitado" />
                </div>

                <div class="col-6 label">
                    <label>Retenção Cap. Esp.:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="47" class="w-full" v-model="parametros.codEspecieCapitalEspecial" :maxlength="2" :disabled="isDesabilitado" />
                </div>

                <div class="col-6 label">
                    <label>INSS Semente:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="48" class="w-full" v-model="parametros.codEspecieInssSemente" :maxlength="2" :disabled="isDesabilitado" />
                </div>
                
                <div class="col-6 label">
                    <label>SENAR Semente:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="49" class="w-full" v-model="parametros.codEspecieSenarSemente" :maxlength="2" :disabled="isDesabilitado" />
                </div>

                <div class="col-6 label">
                    <label>Washout:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="50" class="w-full" v-model="parametros.codEspecieEpc" :maxlength="3" :disabled="isDesabilitado" />
                </div>

                <div class="col-6 label">
                    <label>Outras Taxas:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="51" class="w-full" v-model="parametros.codEspecieOutrasTaxas" :maxlength="2" :disabled="isDesabilitado" />
                </div>
            </div>

            <div class="grid align-items-center col-3">
                <div class="col-6 label">
                    <label>Taxas Extra:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="52" class="w-full" v-model="parametros.codEspecieTaxasExtra" :maxlength="2" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 label">
                    <label>Quebra Técnica:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="53" class="w-full" v-model="parametros.codEspecieQuebra" :maxlength="2" :disabled="isDesabilitado" />
                </div>
                <div class="col-6 label">
                    <label>Kit Teste:</label>
                </div>
                <div class="col-6 campo">
                    <InputText tabindex="54" class="w-full" v-model="parametros.codEspecieKit" :maxlength="3" :disabled="isDesabilitado" />
                </div>
            </div>
        </div>
    </div>

    <div class="clearfix">

    <div class="card mb-3" style="width: 49.5%; float:left;">
        <div class="flex justify-content-between align-items-center mb-3">
            <strong style="font-size:12pt;">INSS</strong>
            <Button icon="pi" class="p-button-rounded p-button-text" @click="visualizarInformacao('PARAM_PRODUCAO_INSS')">
                <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
            </Button>
        </div>

        <div class="grid align-items-center">
            <div class="col-3 label">
                <label>País:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="55" class="w-full" v-model="parametros.codPaisInss" :maxlength="3" :disabled="isDesabilitado" />
            </div>

            <div class="col-3 label">
                <label>Imposto:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="56" class="w-full" v-model="parametros.codImpostoInss" :maxlength="5" :disabled="isDesabilitado" />
            </div>

            <div class="col-3 label">
                <label>UF:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="57" class="w-full" v-model="parametros.codUfInss" :maxlength="3" :disabled="isDesabilitado" />
            </div>

            <div class="col-3 label">
                <label>Classif:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="58" class="w-full" v-model="parametros.codClassificacaoInss" :maxlength="5" :disabled="isDesabilitado" />
            </div>
        </div>
    </div>

    <div class="mb-3" style="width: 49.5%; float:right;">
    <div class="card mb-3">
        <div class="flex justify-content-between align-items-center">
            <strong style="font-size:12pt;">Geração TD Semente Tratada</strong>
            <Button icon="pi" class="p-button-rounded p-button-text" @click="visualizarInformacao('PARAM_PRODUCAO_SEMENTE_TRADATA')">
                <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
            </Button>
        </div>

        <Fieldset>
            <template #legend>
                Entrada
            </template>
            <div class="grid align-items-center">
                <div class="col-2 label">
                    <label>Série TD:</label>
                </div>
                <div class="col-4 campo">
                    <InputText tabindex="68" class="w-full" v-model="parametros.sementeSerieTratadaEntrada" :maxlength="8" :disabled="isDesabilitado" />
                </div>

                <div class="col-2 label">
                    <label>Conta:</label>
                </div>
                <div class="col-4 campo">
                    <InputText tabindex="69" class="w-full" v-model="parametros.sementeContaTratadaEntrada" :maxlength="10" :disabled="isDesabilitado" />
                </div>

                <div class="col-2 label">
                    <label>Depósito:</label>
                </div>
                <div class="col-4 campo">
                    <InputText tabindex="70" class="w-full" v-model="parametros.sementeDepositoTratadaEntrada" :maxlength="8" :disabled="isDesabilitado" />
                </div>

                <div class="col-2 label">
                    <label>C. Custo:</label>
                </div>
                <div class="col-4 campo">
                    <InputText tabindex="71" class="w-full" v-model="parametros.sementeCentroCustoTratadaEntrada" :maxlength="8" :disabled="isDesabilitado" />
                </div>
            </div>

            
        </Fieldset>

        <Fieldset class="mt-4">
            <template #legend>
                Saída
            </template>
            <div class="grid align-items-center">
                <div class="col-2 label">
                    <label>Série TD:</label>
                </div>
                <div class="col-4 campo">
                    <InputText tabindex="72" class="w-full" v-model="parametros.sementeSerieTratadaSaida" :maxlength="8" :disabled="isDesabilitado" />
                </div>

                <div class="col-2 label">
                    <label>Conta:</label>
                </div>
                <div class="col-4 campo">
                    <InputText tabindex="73" class="w-full" v-model="parametros.sementeContaTratadaSaida" :maxlength="10" :disabled="isDesabilitado" />
                </div>

                <div class="col-2 label">
                    <label>Depósito:</label>
                </div>
                <div class="col-4 campo">
                    <InputText tabindex="74" class="w-full" v-model="parametros.sementeDepositoTratadaSainda" :maxlength="8" :disabled="isDesabilitado" />
                </div>

                <div class="col-2 label">
                    <label>C. Custo:</label>
                </div>
                <div class="col-4 campo">
                    <InputText tabindex="75" class="w-full" v-model="parametros.sementeCentroCustoTratadaSaida" :maxlength="8" :disabled="isDesabilitado" />
                </div>
            </div>
        </Fieldset>
    </div>
    <div class="card mb-3">
        <div class="flex justify-content-between align-items-center mb-2 mt-2">
            <strong style="font-size:12pt;">Informações</strong>
            <!-- <Button icon="pi" class="p-button-rounded p-button-text" @click="visualizarInformacao('PARAM_PRODUCAO_SENAR1')">
                <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
            </Button> -->
        </div>

        <div class="grid align-items-center mt-3">
            <div class="col-12 grid align-items-center" id="DataAtualizacao" v-if="integration.visible">
                <div class="col-4 label">
                    <label>Data / Hora Atualização:</label>
                </div>
                <div class="col-3 campo">
                    <InputText class="w-full" v-model="parametros.dataAtualizacao" :disabled="true" />
                </div>
            </div>

            <div class="col-12 grid align-items-center" id="DataIntegracao" v-if="!integration.visible">
                <div class="col-4 label">
                    <label>Data / Hora Integração:</label>
                </div>
                <div class="col-3 campo">
                    <InputText class="w-full" v-model="parametros.dataIntegracao" :disabled="true" />
                </div>
            </div>
        </div>
    </div>
    </div>

    <div class="card mb-3" style="width: 49.5%; float:left;">
        <div class="flex justify-content-between align-items-center mb-2">
            <strong style="font-size:12pt;">GILRAT</strong>
            <Button icon="pi" class="p-button-rounded p-button-text" @click="visualizarInformacao('PARAM_PRODUCAO_GILRAT')">
                <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
            </Button>
        </div>

        <div class="grid align-items-center">
            <div class="col-3 label">
                <label>País:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="59" class="w-full" v-model="parametros.codPaisGilrat" :maxlength="3" :disabled="isDesabilitado" />
            </div>
            <div class="col-3 label">
                <label>Imposto:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="60" class="w-full" v-model="parametros.codImpostoGilrat" :maxlength="5" :disabled="isDesabilitado" />
            </div>

            <div class="col-3 label">
                <label>UF:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="61" class="w-full" v-model="parametros.codUfGilrat" :maxlength="3" :disabled="isDesabilitado" />
            </div>

            <div class="col-3 label">
                <label>Classif:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="62" class="w-full" v-model="parametros.codClassificacaoGilrat" :maxlength="5" :disabled="isDesabilitado" />
            </div>
        </div>
    </div>

    <div class="card mb-3" style="width: 49.5%; float:left;">
        <div class="flex justify-content-between align-items-center mb-2">
            <strong style="font-size:12pt;">SENAR</strong>
            <Button icon="pi" class="p-button-rounded p-button-text" @click="visualizarInformacao('PARAM_PRODUCAO_SENAR1')">
                <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
            </Button>
        </div>

        <div class="grid align-items-center">
            <div class="col-3 label">
                <label>País:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="63" class="w-full" v-model="parametros.codPaisSenar" :maxlength="3" :disabled="isDesabilitado" />
            </div>

            <div class="col-3 label">
                <label>Classif 01:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="64" class="w-full" v-model="parametros.codClassificacaoSenar" :maxlength="5" :disabled="isDesabilitado" />
            </div>

            <div class="col-3 label">
                <label>UF:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="65" class="w-full" v-model="parametros.codUfSenar" :maxlength="3" :disabled="isDesabilitado" />
            </div>

            <div class="col-3 label">
                <label>Classif 02:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="66" class="w-full" v-model="parametros.codClassificacaoSoSenar" :maxlength="5" :disabled="isDesabilitado" />
            </div>
            
            <div class="col-3 label">
                <label>Imposto:</label>
            </div>
            <div class="col-3 campo">
                <InputText tabindex="67" class="w-full" v-model="parametros.codImpostoSenar" :maxlength="5" :disabled="isDesabilitado" />
            </div>
        </div>
    </div>

    <!-- <div class="card mb-3" style="width: 49.5%; float:left;">
            <div class="flex justify-content-between align-items-center mb-2">
                <strong style="font-size:12pt;">Data Atualização</strong>
                
            </div>

            <div class="grid align-items-center mt-5
            ">
                <div class="col-3 label">
                    <label>Data Atualização:</label>
                </div>
                <div class="col-3 campo">
                    <InputText class="w-full" v-model="parametros.dataAtualizacao" :disabled="true" />
                </div>
            </div>
    </div> -->

    </div>

    <div class="col-12" style="display: block;">
        <div class="card mb-3 w-full">
            <div class="flex justify-content-between">

                <div class="flex">
                    
                    <Button
                        v-if="isDesabilitado && integration.visible"
                        icon="pi pi-pencil"
                        label="Editar"
                        class="p-button-outlined"
                        @click="isDesabilitado = false"
                    ></Button>
                    <Button
                        v-if="!isDesabilitado"
                        icon="pi pi-save"
                        label="Salvar"
                        class="p-button-info mr-1"
                        @click="salvar()"
                    ></Button>
                    <Button
                        v-if="!isDesabilitado"
                        icon="pi pi-times"
                        label="Cancelar"
                        class="p-button-danger"
                        @click="voltar()"
                    ></Button>

                    <!-- <Button
                        v-if="isDesabilitado"
                        icon="pi pi-spinner"
                        label="Voltar"
                        class="p-button p-component p-button-outlined mr-1"
                        @click="voltar()"
                    ></Button> -->
                </div>
            </div>
        </div>
    </div>

    <Modalinformacao 
        :visivel="informacaoDialog"
        :paginaArea="paginaArea"
        @fechar="ocultarInformacao()"
    />
</template>

<script>
    import ParametrosProdicaoService from '../../service/ParametrosProducaoService';    
    import TratamentoDeError from '../../utilities/TratamentoDeError';
    import IntegracaoService from '../../service/IntegracaoService'
    import Modalinformacao from '../ModalInformacao.vue';
    import Formatacao from '../../utilities/Formatacao';

    export default {
        components: { Modalinformacao },
        data() {
            return {
                isDesabilitado: true,
                parametros: {},
                integration: {},  
                informacaoDialog: false,
                paginaArea: null,
                doubleClick: false,

            }
        },

        created() {
            this.carregarParametros();
            this.getIntegrationOptons();
        },

        methods: {
            getIntegrationOptons(){
                const paginaAtual = "PARAMETRO_PRODUCAO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                        }
                    })
            },

            carregarParametros() {
                ParametrosProdicaoService.getParametros()
                    .then(({ data }) => {
                        if(data) {

                            this.parametros = data;
                            if( this.parametros.dataAtualizacao !== undefined && this.parametros.dataAtualizacao !== null)
                                this.parametros.dataAtualizacao = Formatacao.formatDateCustom(this.parametros.dataAtualizacao, 'DD/MM/YY HH:mm:SS');

                            if( this.parametros.dataIntegracao !== undefined && this.parametros.dataIntegracao !== null)
                                this.parametros.dataIntegracao = Formatacao.formatDateCustom(this.parametros.dataIntegracao, 'DD/MM/YY HH:mm:SS');
                                


                        }
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'error', 
                            detail:'Falha ao carregar os parâmetros!', 
                            life: 3000
                        });
                    });
            },

            salvar() {
                if(this.doubleClick) return;
                this.doubleClick = true;
                ParametrosProdicaoService.atualizar(this.parametros)
                    .then(({ data }) => {
                        this.isDesabilitado = true;
                        this.doubleClick = false;
                        this.$toast.add({
                            severity:'success', 
                            detail:'Os parâmetros foram atualizados com sucesso!', 
                            life: 3000
                        });
                    })
                    .catch(error => {
                        this.doubleClick = false;
                        this.$toast.add(TratamentoDeError(error, !!false))
                    });
            },
            
            voltar(){
                this.isDesabilitado = true;
                this.doubleClick = false;
                window.location.reload();
            },

            visualizarInformacao(paginaArea)
            {
                //let paginaArea = 'PAGINA_TESTE_AREA_2';
                console.log(paginaArea);
                this.paginaArea = paginaArea;

                console.log(this.paginaArea);
                this.informacaoDialog = true;
            },

            ocultarInformacao(){
                this.informacaoDialog = false;
            }, 

            // formatDateCustom(data, format) {
            //     return data ? moment(data).format(format) : '';
            // }

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

    .clearfix::after{
        content: "";
        display: table;
        clear: both;
    }
</style>