<template>
    <div class="flex grid">
        <div v-if="options.disabled" class="card col-12 xl:col-3" >
            <div class="card col-12" style="background-color: #ecf0f3;">
                <div class="flex align-items-center m-2">
                    <i class="pi pi-qrcode mr-2" style="font-size: 1.4rem"></i>
                    <h5 style="margin:0px 5px;" class="mr-2">Painel de Integração</h5> 
                    <Button icon="pi" class="p-button-rounded p-button-text" @click="visualizarInformacao('PAGINA_INTEGRACAO_MENU')">
                        <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
                    </Button>
                </div>

                <DataTable :globalFilterFields="['descricao', 'pagina']"        
                    v-model:selection="selected.menuItem"
                    @row-select="getPaginaCadastrada"
                    responsiveLayout="scroll" 
                    v-model:filters="filtro"                
                    selectionMode="single" 
                    scrollDirection="both"
                    sortField="descricao"                
                    :scrollable="true"
                    scrollHeight="600px"
                    :value="data_pages"
                    :sortOrder="1">

                    <template #empty>
                        Nenhum registro encontrado.
                    </template>
                    
                    <template #header>                    
                        <div class="grid col-12 justify-content-between align-items-center">
                            <InputText class="col-6" v-model="filtro['global'].value" placeholder="Pesquisar" />
                            <Button type="button" icon="pi pi-filter-slash" label="Limpar" class="p-button-outlined" @click="clearFilter"/>
                        </div>
                    </template>

                    <Column class="w-full">
                        <template #body="{ data }">
                            <i class="pi pi-chevron-right mr-3 pt-3 pb-3"></i> 
                            <span class="w-full">{{ data.descricao }}</span>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <div class="col-12 xl:col-9">
            <div class="card top-right-custom" style="background-color: #ecf0f3;">
                <div class="flex justify-content-between">
                    <div class="flex align-items-center">
                        <i class="pi pi-sliders-h mr-2" style="font-size: 1.4rem"></i>
                        <h5 v-if="!database.paginaEnum" style="margin:0px 5px;">Parâmetros de Integração</h5>
                        <h5 style="margin:0px 5px;">{{database.paginaEnum}}</h5>
                        <Button v-if="database.paginaEnum" icon="pi" class="p-button-rounded p-button-text mr-2" @click="visualizarInformacao('PAGINA_INTEGRACAO_CABECALHO')">
                            <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
                        </Button>
                    </div> 
                    <Button icon="pi pi-lock" label="Login" class="p-button-primary p-button-text" @click="openLogins"/>
                </div>
            </div> 

            <div class="card margin-top-custom">
                
                <div class="flex grid">
                    
                    <div class="col-12 xl:col-4">
                        <label for="origem"><strong>Origem</strong></label>
                        <div class="grid w-full form mt-1 p-0">
                            <div class="col-12 xl:col-6"> 
                                <RadioButton name="origem" value="GENESIS" v-model="database.origenEnum" :disabled="options.disabled" @click="getGenesis(true)"/>
                                <label class="m-1" for="origem">Gênesis</label>
                            </div>

                            <div class="col-12 xl:col-6"> 
                                <RadioButton name="origem" value="ERP" v-model="database.origenEnum" :disabled="options.disabled" @click="getGenesis()"/> 
                                <label class="m-1" for="origem">ERP</label>  
                            </div>                                  
                        </div> 
                    </div> 

                    <div class="col-12 xl:col-4">
                        <label for="tipoEnum"><strong>Integração</strong></label>
                        <div class="grid w-full form mt-1 p-0">
                            <div class="col-12 xl:col-6"> 
                                <RadioButton name="tipoEnum" value="AUTOMATICA" v-model="database.tipoEnum"  :disabled="options.disabled || options.genesis" @click="isManual(false)"/>
                                <label class="m-1" for="tipoEnum">Automática</label>
                            </div>

                            <div class="col-12 xl:col-6"> 
                                <RadioButton name="tipoEnum" value="MANUAL" v-model="database.tipoEnum" :disabled="options.disabled || options.genesis" @click="isManual(true)"/> 
                                <label class="m-1" for="tipoEnum">Manual</label>
                            </div>                                  
                        </div> 
                    </div> 

                    <div class="col-12 xl:col-4">
                        <label for="sincronizacaoEnum"><strong>Sincronização</strong></label>
                        <div class="grid w-full form mt-1 p-0">
                            <div class="col-12 xl:col-6"> 
                                <RadioButton name="sincronizacaoEnum" value="SINCRONA" v-model="database.sincronizacaoEnum" :disabled="options.disabled || options.genesis" @click="isAsync(false)"/>
                                <label class="m-1" for="sincronizacaoEnum">Sincrona</label>
                            </div>

                            <div class="col-12 xl:col-6"> 
                                <RadioButton name="sincronizacaoEnum" value="ASSINCRONA" v-model="database.sincronizacaoEnum" :disabled="options.disabled || options.genesis" @click="isAsync(true)"/> 
                                <label class="m-1" for="sincronizacaoEnum">Assincrona</label>  
                            </div>                                  
                        </div> 
                    </div>

                    <div v-if="database.origenEnum != 'ERP'" class="col-12 xl:col-8">
                        <label for="urlApiDev"><strong>Url API Desenvolvimento</strong></label>
                        <InputText id="urlApiDev" class="w-full mt-2" v-model="database.urlApiDev" :disabled="options.disabled || options.genesis"/>
                    </div> 

                    <div v-if="database.origenEnum != 'ERP'" class="col-12 xl:col-4">
                        <label for="authDev"><strong>Login Desenvolvimento</strong></label>
                        <AutoComplete 
                                id="authDev"
                                field="descricao"
                                :dropdown="true"  
                                class="w-full mt-2"                             
                                placeholder="Selecione"                             
                                v-model="database.authDev"                           
                                :suggestions="options.loginDev"
                                @complete="searchLoginDev($event)"   
                                :disabled="options.disabled || options.genesis" /> 
                    </div>



                    <div v-if="database.origenEnum != 'ERP'" class="col-12 xl:col-8">
                        <label for="urlApiHomolog"><strong>Url API Homologação</strong></label>
                        <InputText id="urlApiHomolog" class="w-full mt-2" v-model="database.urlApiHomolog" :disabled="options.disabled || options.genesis"/>
                    </div> 

                    <div v-if="database.origenEnum != 'ERP'" class="col-12 xl:col-4">
                        <label for="authHomolog"><strong>Login Homologação</strong></label>
                        <AutoComplete 
                                id="authHomolog"
                                field="descricao"
                                :dropdown="true"  
                                class="w-full mt-2"                             
                                placeholder="Selecione"                             
                                v-model="database.authHomolog"                           
                                :suggestions="options.loginHomolog"
                                @complete="searchLoginHomolog($event)"   
                                :disabled="options.disabled || options.genesis" /> 
                    </div>



                    <div v-if="database.origenEnum != 'ERP'" class="col-12 xl:col-8">
                        <label for="urlApiProd"><strong>Url API Produção</strong></label>
                        <InputText id="urlApiProd" class="w-full mt-2" v-model="database.urlApiProd" :disabled="options.disabled || options.genesis"/>
                    </div> 

                    <div v-if="database.origenEnum != 'ERP'" class="col-12 xl:col-4">
                        <label for="authProd"><strong>Login Produção</strong></label>
                        <AutoComplete 
                                id="authProd"
                                field="descricao"
                                :dropdown="true"  
                                class="w-full mt-2"                             
                                placeholder="Selecione"                             
                                v-model="database.authProd"                           
                                :suggestions="options.loginProd"
                                @complete="searchLoginProd($event)"   
                                :disabled="options.disabled || options.genesis" /> 
                    </div>



                    
                    <div class="col-12">
                        <TabView>
                            <TabPanel>
                                <template #header>
                                    <i class="pi pi-th-large mr-2" style="font-size: 1rem;"></i>
                                    <span>Serviços</span>
                                </template>
                                <div class="card"> 
                                    <div class="grid"> 
                                        <div class="col-12 xl:col-4">
                                            <label for="tipo"><strong>Funcionalidade</strong></label>
                                            <Dropdown class="w-full mt-2" id="tipo" 
                                                :disabled="options.disabled || options.genesis"
                                                v-model="funcionalidadeSelecionada"
                                                :options="options.funcionalidades"
                                                @change="getFuncionalidadeAtiva"  
                                                @before-show="salvarFuncionalidadeSelecionada"                              
                                                optionValue="funcionalidade"
                                                placeholder="Selecione"
                                                optionLabel="descricao"/>
                                        </div>

                                        <div class="col-12 xl:col-2">
                                            <label for="cbSituacao"><strong>Situação</strong></label>
                                            <Dropdown class="w-full mt-2" 
                                                id="cbSituacao" 
                                                :disabled="options.disabled || options.genesis" 
                                                v-model="data_funcionalidades.situacao" 
                                                placeholder="Selecione"
                                                optionLabel="label"
                                                optionValue="value"
                                                :options="situacoes"/>
                                        </div>

                                        <div v-if="!options.disabled || database.origenEnum != 'ERP'" class="col-12 xl:col-6">
                                            <label for="origem"><strong>Ambiente teste sincronização</strong></label>
                                            <div class="grid w-full form mt-1 p-0">
                                                <div class="col-12 xl:col-4"> 
                                                    <RadioButton name="ambSincDev" 
                                                        value="dev" 
                                                        v-model="ambienteSincronizacao" 
                                                        :disabled="options.disabled"/>
                                                    <label class="m-1" for="ambSincDev">Desenvolvimento</label>
                                                </div>

                                                <div class="col-12 xl:col-4"> 
                                                    <RadioButton name="ambSincHomolog" 
                                                        value="homolog" 
                                                        v-model="ambienteSincronizacao" 
                                                        :disabled="options.disabled"/> 
                                                    <label class="m-1" for="ambSincHomolog">Homologação</label>  
                                                </div>

                                                <div class="col-12 xl:col-4"> 
                                                    <RadioButton name="ambSincProd" 
                                                        value="prod" 
                                                        v-model="ambienteSincronizacao" 
                                                        :disabled="options.disabled"/> 
                                                    <label class="m-1" for="ambSincProd">Produção</label>  
                                                </div>                                    
                                            </div> 
                                        </div> 

                                    </div>


                                    <TabView>
                                        <TabPanel>
                                            <template #header>
                                                <i class="pi pi-sign-out mr-2" style="font-size: 1rem;"></i>
                                                <span>Envio</span>
                                            </template>

                                            <div class="grid">                                
                                                <div class="col-12 xl:col-2">
                                                    <label for="tipo"><strong>Método</strong></label>
                                                    <Dropdown class="w-full mt-2" id="tipo" :disabled="options.disabled || options.genesis || !funcionalidadeSelecionada" v-model="data_funcionalidades.methodSend" :options="options.methodSend"/>
                                                </div>

                                                <div class="col-12 xl:col-8">
                                                    <label for="endPointSend"><strong>Uri</strong></label>
                                                    <InputText class="w-full mt-2" :disabled="options.disabled || options.genesis || !funcionalidadeSelecionada" v-model="data_funcionalidades.endPointSend"/>
                                                </div> 

                                                <div class="col-12 xl:col-2">
                                                    <Button icon="pi pi-send" 
                                                            :disabled="options.disabled || options.genesis || !funcionalidadeSelecionada" 
                                                            label="Enviar" 
                                                            class="w-full p-button-info mt-4" 
                                                            @click="validarRequestIntegracao(true)"/>
                                                </div>

                                                <Fieldset v-if="!options.manual" class="col-12 mb-2" legend="Scheduler de Envio" :toggleable="false">
                                                    <div class="grid w-full">

                                                        <div class="col-12 xl:col-2">
                                                            <label for="scheduler"><strong>Segundo</strong></label>
                                                            <InputText class="w-full mt-2" v-model="schedulerSend.second" maxlength="5"
                                                                       :disabled="options.disabled || !funcionalidadeSelecionada"/>
                                                        </div> 

                                                        <div class="col-12 xl:col-2">
                                                            <label for="scheduler"><strong>Minuto</strong></label>
                                                            <InputText class="w-full mt-2" v-model="schedulerSend.minute" maxlength="5"
                                                                       :disabled="options.disabled || !funcionalidadeSelecionada"/>
                                                        </div> 

                                                        <div class="col-12 xl:col-2">
                                                            <label for="scheduler"><strong>Hora</strong></label>
                                                            <InputText class="w-full mt-2" v-model="schedulerSend.hour" maxlength="5"
                                                                       :disabled="options.disabled || !funcionalidadeSelecionada"/>
                                                        </div>

                                                        <div class="col-12 xl:col-2">
                                                            <label for="scheduler"><strong>Dia</strong></label>
                                                            <InputText class="w-full mt-2" v-model="schedulerSend.dayMonth" maxlength="5"
                                                                       :disabled="options.disabled || !funcionalidadeSelecionada"/>
                                                        </div>

                                                        <div class="col-12 xl:col-2">
                                                            <label for="scheduler"><strong>Mês</strong></label>
                                                            <InputText class="w-full mt-2" v-model="schedulerSend.month" maxlength="5"
                                                                       :disabled="options.disabled || !funcionalidadeSelecionada"/>
                                                        </div>

                                                        <div class="col-12 xl:col-2">
                                                            <label for="scheduler"><strong>Semana</strong></label>
                                                            <InputText class="w-full mt-2" v-model="schedulerSend.dayWeek" maxlength="5"
                                                                       :disabled="options.disabled || !funcionalidadeSelecionada"/>
                                                        </div>
                                                    </div>
                                                </Fieldset>                                

                                                <div class="col-12">
                                                    <label for="url"><strong>Payload Integração Individual (<span style="color: blue">Request</span>)</strong></label>
                                                    <Textarea class="w-full mt-2" :disabled="options.disabled  || options.genesis || !funcionalidadeSelecionada" v-model="data_funcionalidades.payLoadRequestSend" rows="5" />
                                                </div>

                                                <div class="col-12">
                                                    <label for="url"><strong>Payload de retorno (<span style="color: blue">Response</span>)</strong></label>
                                                    <div style="border: 1px solid #cecece;">
                                                        <ScrollPanel style="width: 100%; height: 200px">
                                                            <vue-json-pretty :data="data_funcionalidades.payLoadResponseSend != undefined ? 
                                                                JSON.parse(data_funcionalidades.payLoadResponseSend) : ''" 
                                                                show-line-number="true"
                                                                show-line="true" 
                                                                show-icon="true"/>
                                                        </ScrollPanel>
                                                    </div>
                                                </div>
                                            </div>

                                        </TabPanel>

                                        <TabPanel :disabled="!options.async">
                                            <template #header>
                                                <i class="pi pi-sign-in mr-2" style="font-size: 1rem;"></i>
                                                <span>Resposta</span>
                                            </template>
    
                                            <div class="grid">                                
                                                <div class="col-12 xl:col-2">
                                                    <label for="tipo"><strong>Método Retorno</strong></label>
                                                    <Dropdown class="w-full mt-2" id="tipo" :disabled="options.disabled" v-model="data_funcionalidades.methodReturn" :options="options.methodSend"/>
                                                </div>

                                                <div class="col-12 xl:col-8">
                                                    <label for="endPointSend"><strong>Uri Retorno</strong></label>
                                                    <InputText class="w-full mt-2" :disabled="options.disabled" v-model="data_funcionalidades.endPointReturn"/>
                                                </div> 

                                                <div class="col-12 xl:col-2">
                                                    <label for="url"><strong>Testar</strong></label>
                                                    <Button icon="pi pi-send" :disabled="options.disabled" label="Enviar" class="w-full p-button-info mt-2" @click="validarRequestIntegracao(false)"/>
                                                </div>

                                                <Fieldset v-if="!options.manual" class="col-12 mb-2" legend="Scheduler de Resposta" :toggleable="false">
                                                    <div class="grid w-full">

                                                        <div class="col-12 xl:col-2">
                                                            <label for="scheduler"><strong>Segundos</strong></label>
                                                            <InputText class="w-full mt-2" v-model="schedulerReturn.second" maxlength="5"
                                                                       :disabled="options.disabled || !funcionalidadeSelecionada"/>
                                                        </div> 

                                                        <div class="col-12 xl:col-2">
                                                            <label for="scheduler"><strong>Minutos</strong></label>
                                                            <InputText class="w-full mt-2" v-model="schedulerReturn.minute" maxlength="5"
                                                                       :disabled="options.disabled || !funcionalidadeSelecionada"/>
                                                        </div> 

                                                        <div class="col-12 xl:col-2">
                                                            <label for="scheduler"><strong>Hora</strong></label>
                                                            <InputText class="w-full mt-2" v-model="schedulerReturn.hour" maxlength="5"
                                                                       :disabled="options.disabled || !funcionalidadeSelecionada"/>
                                                        </div>

                                                        <div class="col-12 xl:col-2">
                                                            <label for="scheduler"><strong>Dia</strong></label>
                                                            <InputText class="w-full mt-2" v-model="schedulerReturn.dayMonth" maxlength="5"
                                                                       :disabled="options.disabled || !funcionalidadeSelecionada"/>
                                                        </div>

                                                        <div class="col-12 xl:col-2">
                                                            <label for="scheduler"><strong>Mês</strong></label>
                                                            <InputText class="w-full mt-2" v-model="schedulerReturn.month" maxlength="5"
                                                                       :disabled="options.disabled || !funcionalidadeSelecionada"/>
                                                        </div>

                                                        <div class="col-12 xl:col-2">
                                                            <label for="scheduler"><strong>Semana</strong></label>
                                                            <InputText class="w-full mt-2" v-model="schedulerReturn.dayWeek" maxlength="5"
                                                                       :disabled="options.disabled || !funcionalidadeSelecionada"/>
                                                        </div>
                                                    </div>
                                                </Fieldset>                                

                                                <div class="col-12">
                                                    <label for="url"><strong>Payload Integração Individual Retorno(<span style="color: blue">Request</span>)</strong></label>
                                                    <Textarea class="w-full mt-2" :disabled="options.disabled" v-model="data_funcionalidades.payLoadRequestReturn" rows="5" />
                                                </div>

                                                <div class="col-12">
                                                    <label for="url"><strong>Payload de retorno (<span style="color: blue">Response</span>)</strong></label>
                                                    <div style="border: 1px solid #cecece;">
                                                        <ScrollPanel style="width: 100%; height: 200px">
                                                            <vue-json-pretty :data="data_funcionalidades.payLoadResponseReturn != undefined ? 
                                                                JSON.parse(data_funcionalidades.payLoadResponseSend) : ''" 
                                                                show-line-number="true"
                                                                show-line="true" 
                                                                show-icon="true"/>
                                                        </ScrollPanel>
                                                    </div>

                                                </div>
                                            </div>
                                        </TabPanel>
                                    </TabView>
                                </div>
                            </TabPanel>
                        
                            <TabPanel>
                                <template #header>
                                    <i class="pi pi-file-import mr-2" style="font-size: 1rem;"></i>
                                    <span>Header</span>
                                </template>  
                                                              
                                <DataTable :value="database.paginaHeader" class="editable-cells-table col-12" showGridlines>                            
                                    <Column field="chave" header="Chave" class="col-2">
                                        <template #body="{ data }">
                                            <InputText :disabled="options.disabled || options.genesis" class="col-12" v-model="data.chave"/>
                                        </template>
                                    </Column>

                                    <Column field="valor" header="Valor" class="col-3">
                                        <template #body="{ data }">
                                            <InputText :disabled="options.disabled || options.genesis" class="col-12" v-model="data.valor"/>
                                        </template>
                                    </Column>

                                    <Column field="descricao" header="Descrição" class="col-2">
                                        <template #body="{ data }">
                                            <InputText :disabled="options.disabled || options.genesis" class="col-12" v-model="data.descricao"/>
                                        </template>
                                    </Column>

                                    <Column header="Ambiente(s)" class="col-3">
                                        <template #body="{ data }">
                                            <div class="field-checkbox mt-3">
                                                <Checkbox id="ckbDesenv" title="Desenvolvimento" :disabled="options.disabled || options.genesis" v-model="data.desenvolvimento" :binary="true"  />
                                                <label for="ckbDesenv" title="Desenvolvimento" class="mr-4">Desenv.</label>
                                            
                                                <Checkbox id="ckbHomolog" title="Homologação" :disabled="options.disabled || options.genesis" v-model="data.homologacao" :binary="true"  />
                                                <label for="ckbHomolog" title="Homologação" class="mr-4">Homolog.</label>
                                            
                                                <Checkbox id="ckbProd" title="Produção" :disabled="options.disabled || options.genesis" v-model="data.producao" :binary="true"  />
                                                <label for="ckbProd" title="Produção">Prod.</label>
                                            </div>
                                        </template>
                                    </Column>

                                    <Column header="Ações" class="col-2">
                                        <template #body="{ index }">
                                            <Button icon="pi pi-plus"  :disabled="options.disabled || options.genesis" class="p-button-rounded p-button-warning flex-none mr-1" @click="insertHeaderRow(index)"/>                                
                                            <Button icon="pi pi-trash" :disabled="options.disabled || options.genesis" class="p-button-rounded p-button-info flex-none" @click="deleteHeaderRow(index)" />
                                        </template>
                                    </Column>
                                </DataTable>                      
                            </TabPanel>

                            <TabPanel>
                                <template  #header>
                                    <i class="pi pi-sliders-h mr-2" style="font-size: 1rem;"></i>
                                    <span>Parâmetros</span>
                                </template>

                                <DataTable :value="database.paginaParametros" class="editable-cells-table col-12" showGridlines>                            
                                    <Column field="chave" header="Chave" class="col-2 ">
                                        <template #body="{ data }">
                                            <InputText :disabled="options.disabled || options.genesis" class="w-full" v-model="data.chave" />
                                        </template>
                                    </Column>

                                    <Column field="valor" header="Valor" class="col-3">
                                        <template #body="{ data }">
                                            <InputText :disabled="options.disabled || options.genesis" class="w-full" v-model="data.valor" />
                                        </template>
                                    </Column>

                                    <Column field="descricao" header="Descrição" class="col-2">
                                        <template #body="{ data }">
                                            <InputText :disabled="options.disabled || options.genesis" class="w-full" v-model="data.descricao" />
                                        </template>
                                    </Column>

                                    <Column header="Ambiente(s)" class="col-3">
                                        <template #body="{ data }">
                                            <div class="field-checkbox mt-3">
                                                <Checkbox id="ckbParamDesenv" title="Desenvolvimento" :disabled="options.disabled || options.genesis" v-model="data.desenvolvimento" :binary="true"  />
                                                <label for="ckbParamDesenv" title="Desenvolvimento" class="mr-4">Desenv.</label>
                                            
                                                <Checkbox id="ckbParamHomolog" title="Homologação" :disabled="options.disabled || options.genesis" v-model="data.homologacao" :binary="true"  />
                                                <label for="ckbParamHomolog" title="Homologação" class="mr-4">Homolog.</label>
                                            
                                                <Checkbox id="ckbParamProd" title="Produção" :disabled="options.disabled || options.genesis" v-model="data.producao" :binary="true"  />
                                                <label for="ckbParamProd" title="Produção">Prod.</label>
                                            </div>
                                        </template>
                                    </Column>

                                    <Column header="Ações" class="col-2">
                                        <template #body="{ index }">
                                            <Button icon="pi pi-plus"  :disabled="options.disabled || options.genesis" class="p-button-rounded p-button-warning flex-none mr-1" @click="insertParameterRow(index)" />                                
                                            <Button icon="pi pi-trash" :disabled="options.disabled || options.genesis" class="p-button-rounded p-button-info flex-none" @click="deleteParameterRow(index)" />
                                        </template>
                                    </Column>
                                </DataTable>            
                            </TabPanel>
                        </TabView>
                </div>
                    
                </div><Divider />
                <div class="col-12">
                    <Button v-if="options.savePage"   icon="pi pi-save"  label="Salvar"    class="p-button-info m-1" @click="validatePage" />
                    <Button v-if="!options.cadastrarPagina"   icon="pi pi-times"   label="Cancelar"  class="p-button-danger m-1"  @click="cancelar" />
                    <Button v-if="options.pageUpdate" icon="pi pi-pencil" label="Editar"    class="p-button-info m-1"    @click="newPage" />
                    <Button v-if="options.cadastrarPagina && !options.pageUpdate" icon="pi pi-plus" label="Cadastrar" class="p-button-info m-1" @click="newPage" />
                </div>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="displayLogins" @show="getLogins()" :modal="true" @hide="closeLogins" :breakpoints="{'1000px': '75vw', '640px': '100vw'}" :style="{width: '50vw', margin: '25px'}">
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-id-card mr-2" style="font-size: 2rem"></i>
                <h4>Credencias de Integração</h4>
            </div>
            <Button icon="pi" class="p-button-rounded p-button-text" @click="visualizarInformacao('PAGINA_INTEGRACAO_LOGIN')">
                <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
            </Button>
        </template>
        <div class="flex grid">
            <DataTable :value="data_logins" class="col-12" showGridlines>
                <template #empty>
                    Nenhum registro encontrado.                
                </template>

                <Column field="id" class="col-1" header="ID"/>
                <Column field="descricao" class="col-5" header="Descrição"/>
                <Column field="login" class="col-4" header="Login"/>
                <Column class="col-2 text-center" header="Ações" >
                    <template #body="{ index, data }">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-info flex-none mr-3" @click="updateLogin(data.id)"/>   
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger flex-none mr-2" @click="deleteLogin(index, data)"/>   
                    </template>
                </Column>
            </DataTable>
        </div>
        <template #footer>         
            <Button icon="pi pi-plus" label="Cadastrar" class="p-button-info"  @click="openLogin"/>
            <Button icon="pi pi-times" label="Cancelar" class="p-button-danger" @click="closeLogins"/>   
            <Divider />
        </template>

        <Paginator
            :rows="qtdRegistro"
            :totalRecords="totalRegistro"
            :rowsPerPageOptions="[5, 10]"
            @page="onPage">
        </Paginator> 
    </Dialog>  
    
    <Dialog v-model:visible="displayLogin" @show="getTipoLogin" :modal="true" @hide="closeLogin" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw', margin: '25px'}">
        <template #header>
            <div class="flex align-items-center">
                <i class="pi pi-id-card mr-2" style="font-size: 2rem"></i>
                <h4>Login de Integração</h4>
            </div>
            <Button icon="pi" class="p-button-rounded p-button-text" @click="visualizarInformacao('PAGINA_INTEGRACAO_LOGIN_CADASTRO')">
                <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
            </Button>
        </template>

        <div class="flex grid">
            <div class="col-12 xl:col-4">
                <label for="descricao"><strong>Descrição</strong></label>
                <InputText class="w-full mt-2" v-model="data_login.descricao"/>
            </div> 

            <div class="col-12 xl:col-4">
                <label for="login"><strong>Login</strong></label>
                <InputText class="w-full mt-2" v-model="data_login.login"/>
            </div>        

            <div class="col-12 xl:col-4">
                <label for="senha"><strong>Senha</strong></label>
                <InputText class="w-full mt-2" type="password" v-model="data_login.senha"/>
            </div>

            <div class="col-4">
                <label for="tipo"><strong>Tipo</strong></label>
                <Dropdown class="w-full mt-2" id="tipo" v-model="data_login.tipoEnum" :options="options.tipoEnum" @change="isTipo"/>
            </div>

            <div v-if="isBearer" class="col-8">
                <label for="url"><strong>Url</strong></label>
                <InputText class="w-full mt-2" v-model="data_login.urlApi"/>
            </div>

            <div v-if="isBearer" class="col-6">
                <label for="refresh"><strong>Auto refresh em minutos</strong></label>
                <InputText class="w-full mt-2" v-model="data_login.minRefreshToken"/>
            </div>

            <div v-if="isBearer" class="col-6">
                <Button icon="pi pi-send" label="Enviar" class="w-full p-button-info mt-4" @click="getLoginTest()"/>
            </div>

            <div v-if="isBearer" class="col-12">
                <Textarea class="w-full"  v-model="data_login.payloadRetorno" rows="5" />
            </div>

            <div v-if="isBearer" class="col-12">
                <label for="token"><strong>Token</strong></label>
                <InputText class="w-full mt-2" v-model="data_login.token"/>
            </div>

            <div v-if="isBearer" class="col-12">
                <label for="refresh"><strong>refresh</strong></label>
                <InputText class="w-full mt-2" v-model="data_login.refreshToken"/>
            </div>
        </div>

        <template #footer>
            <Button icon="pi pi-save" label="Salvar" class="p-button-info" @click="validateCredential()"/>
            <Button icon="pi pi-times" label="Cancelar" class="p-button-danger" @click="closeLogin"/>
            <Divider />
        </template>
    </Dialog>

    <Modalinformacao  
        :visivel="informacaoDialog"
        :paginaArea="paginaArea"
        @fechar="ocultarInformacao()"
    />
</template>

<script>
    import IntegracaoService from '../../service/IntegracaoService'
    import {FilterMatchMode, FilterOperator} from 'primevue/api';
    import Modalinformacao from '../ModalInformacao.vue';
    import ScrollPanel from 'primevue/scrollpanel';
    import VueJsonPretty from 'vue-json-pretty';
    import 'vue-json-pretty/lib/styles.css';

    export default {
        components: { Modalinformacao, VueJsonPretty},
        data() {
            return {
            // #Menu lateral de páginas 
                data_pages: [],
                selected: {},
                filtro: null,
            
            // #Listagem de logins                
                data_logins: [],
                
                pagina: 0,
                qtdRegistro: 5,
                totalRegistro: 0,
                displayLogins: false,

            // #Cadastro de login
                displayLogin: false,
                data_login: {},
                isBearer: false,

            //Funcionalidades de pagina  
                funcionalidadeSelecionada: null,
                data_funcionalidades: {},
                schedulerSend: {},
                schedulerReturn: {},

            //Global da pagina
                options: {},
                database: {},  
                link: "",
                tipoSend: false,
                menuAtivo: null,
                paginaArea: null,
                informacaoDialog: false,
                mensagem: false,
                id: null,
                doubleClik: false,
                ambienteSincronizacao: "dev",
                situacoes:[
                    {label: "Ativo", value: "ATIVO"},
                    {label: "Inativo", value: "INATIVO"}
                ]
            }
        },

        methods: {
        // #Menu lateral páginas    
            getPaginas(){
                IntegracaoService.getPaginas() 
                    .then(({ data }) => {
                        if(data) {
                            this.data_pages = data;
                        }
                    })
            },

            clearFilter() {
                this.startFilters();
            },

            startFilters() {
                this.filtro = {
                    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                    'descricao': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
                }
            },

        // #Listar todos os logins cadastrados
            openLogins(){
                this.displayLogins= true;
                this.displayLogin = false; 
            }, 

            closeLogins(){
                this.displayLogins= false;
            },            
            
            getLogins(){
                IntegracaoService.getLogins(this.pagina, this.qtdRegistro)
                    .then(({ data }) => {
                        if(data) {
                            this.data_logins = data.content;
                            this.qtdRegistro = data.pageable.pageSize;
                            this.totalRegistro = data.totalPages * this.qtdRegistro;
                        }
                    })
            },

            updateLogin(dados){  
                let idLogin = dados;          
                this.displayLogin = true;
                this.displayLogins = false; 
                this.getLogin(idLogin);
            },
        
        // #Cadastrar ou editar login;
            openLogin(){                
                this.data_login = {};
                this.displayLogins= false;
                this.displayLogin = true; 
            },

            closeLogin(){
                this.displayLogin = false; 
            },

            getLogin(id){
                this.data_login = {};
                if(id == undefined) return;
                IntegracaoService.getLogin(id)
                    .then(({ data }) => {
                        if(data) {
                            this.data_login = data;
                            this.isTipo();
                        }
                    });
            },

            getMetodos(){
                IntegracaoService.getMetodos()
                    .then(({ data }) => {
                        if(data) {
                            this.options.methodSend = data;
                        }
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'info', 
                            summary: 'Falha', 
                            detail:'Preencher os campos obrigatórios.', 
                            life: 3000
                        });
                    });
            },

            getTipoLogin(){
                IntegracaoService.getTipoLogin()
                    .then(({ data }) => {
                        if(data) {
                            this.options.tipoEnum = data;
                            this.isTipo();
                        }
                    })          
            },

            isTipo(){
                if(this.data_login.tipoEnum === 'BEARER'){
                    this.isBearer = true;
                }else{
                    this.isBearer = false;
                }
            },

            getLoginTest(){
                let credentials = {};
                const url = this.data_login.urlApi;
                if(this.data_login.tipoEnum === 'BEARER'){
                    credentials = {
                        username: this.data_login.login,
                        password: this.data_login.senha
                    }
                }else {
                    credentials = {
                        login: this.data_login.login,
                        senha: this.data_login.senha
                    }
                }
                IntegracaoService.getLoginTest(url, credentials)
                    .then(({ data }) => {
                        if(data) {
                            this.$toast.add({
                                severity:'success',
                                detail: "Conectado com sucesso.", 
                                life: 5000
                            });
                            this.data_login['payloadRetorno'] = JSON.stringify(data);
                            this.data_login['refleshToken'] = data.refreshToken;
                            this.data_login['token'] = data.accessToken;
                            
                        }
                    })
                    .catch(error => {
                        this.$toast.add({
                            severity:'warn',
                            detail: "Credenciais inválidas!", 
                            life: 5000
                        });
                    });
            },

            validateCredential(){
                let isNull = false;

                if(this.data_login.descricao == undefined){
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Campo descrição Inválido.", 
                        life: 5000
                    });
                    isNull = true;
                }

                if(this.data_login.login == undefined){
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Campo de login Inválido.", 
                        life: 5000
                    });
                    isNull = true;
                }

                if(this.data_login.senha == undefined){
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Campo senha inválido.", 
                        life: 5000
                    });
                    isNull = true;
                }

                if(this.data_login.tipoEnum == undefined){
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Campo tipo inválido.", 
                        life: 5000
                    });
                    isNull = true;
                }

                if(this.data_login.urlApi == undefined && this.data_login.tipoEnum != 'BASIC'){
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Campo URL inválido.", 
                        life: 5000
                    });
                    isNull = true;
                }

                if(this.data_login.minRefleshToken == undefined){                    
                    this.data_login.minRefleshToken = 5;
                }

                if(this.data_login.tipoEnum === 'BASIC'){
                    this.data_login.minRefleshToken = undefined;
                    this.data_login.urlApi = undefined;
                    this.data_login.token = undefined;
                    this.data_login.refleshToken = undefined;
                    this.data_login.payloadRetorno = undefined;
                }

                if(isNull == true) return;
                if(isNull == false) this.saveLogin();
            },

            saveLogin(){
                IntegracaoService.saveLogin(this.data_login)
                    .then(({ data }) => {
                       this.$emit('fechar')
                        if(data) {
                            this.$toast.add({
                                severity:'success',
                                detail: "Login cadastrado com sucesso!", 
                                life: 5000
                            });
                            this.data_login = {};
                            this.closeLogin();
                        }
                    })
                    .catch(error => {
                        const mensagem = error.response.data.message;
                        this.$toast.add({
                            severity:'warn',
                            detail: mensagem, 
                            life: 5000
                        });
                    });
            },

        // #Pagina de integração

            getPaginaCadastrada(){
                if(!this.options.menuItemActive) return;
                IntegracaoService.getPaginaCadastrada(this.selected.menuItem.pagina)
                    .then(({ data }) => {     
                        this.id = data.id;             
                        this.database = data;  
                        this.schedulerSend = {};
                        this.schedulerReturn = {};                       
                        this.options.pageUpdate = true; 
                        this.funcionalidadeSelecionada = null; 
                        this.options.manual = data.tipoEnum == "AUTOMATICA" ? false : true;
                        this.options.async = data.sincronizacaoEnum == "ASSINCRONA" ? true : false;
                        this.getGenesis();
                        this.link = "Edição";
                        if(this.database.paginaHeader == "") this.insertHeaderRow(); 
                        if(this.database.paginaParametros == "") this.insertParameterRow();
                    }).catch(error => {  
                        this.id = null;
                        this.database = {};  
                        this.options.async = false;
                        this.options.manual = false;
                        this.funcionalidadeSelecionada = null;
                        this.options.pageUpdate = false;
                        this.data_funcionalidades = {};
                        this.schedulerSend = {};
                        this.schedulerReturn = {};
                    });
            },

            salvarFuncionalidadeSelecionada() {
                
                if(this.database.funcionalidades === undefined || this.funcionalidadeSelecionada == null) return;
                const index = this.database.funcionalidades.findIndex(item => { 
                    return item.funcionalidade === this.funcionalidadeSelecionada;
                });

                const objFuncionalidade = Object.assign({}, this.data_funcionalidades);
                objFuncionalidade["funcionalidade"] = this.funcionalidadeSelecionada;

                if(index >= 0) {
                    this.database['funcionalidades'][index] = objFuncionalidade; 
                }
                else { 
                    this.database['funcionalidades'].push(objFuncionalidade);
                }
            },

            getFuncionalidadeAtiva(){
                if(this.database.funcionalidades === undefined ) this.database.funcionalidades = [];
                const index = this.database.funcionalidades.findIndex(item => { 
                    return item.funcionalidade === this.funcionalidadeSelecionada;
                });

                if(index >= 0) {
                    this.data_funcionalidades = Object.assign({}, this.database.funcionalidades[index]);
                }
                else {
                    this.data_funcionalidades = {};
                }
            },

            newPage(){                
                if(this.database.paginaEnum == undefined){                    
                    this.$toast.add({
                            severity:'warn',
                            detail: "Página não selecionada!", 
                            life: 5000
                        });
                        return;    
                }

                this.link = "Cadastro";
                this.options.disabled = false;
                this.options.cadastrarPagina = false;
                this.options.savePage = true;
                this.options.menuItemActive = false;
                this.options.pageUpdate = false;
            },

            isManual(manual){            
                this.options.manual = manual;
                if(manual == true) this.schedulerSend = {};
                if(manual == true && this.data_funcionalidades['schedulerSend'] != undefined) this.data_funcionalidades['schedulerSend'] = undefined;
            },

            searchLoginDev(event) {                
                const login = !event.query.trim().length ? 'search' : event.query;                
                setTimeout(() => {                               
                    IntegracaoService.getLoginPorDescricaoList(login)
                        .then(({ data }) => {                        
                            if(data) {
                                this.options.loginDev = data;
                            }
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail: "Não existem logins cadastrados.",  
                                life: 5000
                            });
                            this.options.loginDev = {};
                        });
                
                }, "2000");
            },

            searchLoginHomolog(event) {                
                const login = !event.query.trim().length ? 'search' : event.query;                
                setTimeout(() => {                               
                    IntegracaoService.getLoginPorDescricaoList(login)
                        .then(({ data }) => {                        
                            if(data) {
                                this.options.loginHomolog = data;
                            }
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail: "Não existem logins cadastrados.",  
                                life: 5000
                            });
                            this.options.loginHomolog = {};
                        });
                
                }, "2000");
            },

            searchLoginProd(event) {                
                const login = !event.query.trim().length ? 'search' : event.query;                
                setTimeout(() => {                               
                    IntegracaoService.getLoginPorDescricaoList(login)
                        .then(({ data }) => {                        
                            if(data) {
                                this.options.loginProd = data;
                            }
                        })
                        .catch(error => {
                            this.$toast.add({
                                severity:'warn',
                                detail: "Não existem logins cadastrados.",  
                                life: 5000
                            });
                            this.options.loginProd = {};
                        });
                
                }, "2000");
            },

            savePage(){
                if(this.doubleClik == true) return;                
                //console.log(JSON.stringify(this.database));
                IntegracaoService.savePagina(this.database)                
                    .then(({ data }) => {                          
                        this.$toast.add({
                            severity:'success',
                            detail: "Página salva com sucesso!", 
                            life: 5000
                        }); 
                        this.id = null;           
                        this.cancelar();             
                        this.doubleClik = false;
                        this.getPaginaCadastrada();
                                           
                    })
                    .catch(error => {             
                        this.doubleClik = false;
                        this.$toast.add({
                            severity:'warn',
                            detail: error, 
                            life: 5000
                        });
                    });
            },

            validarRequestIntegracao(tipo){   
                this.tipoSend = tipo; 
                let paginaAuth = this.getAuthTesteEnvio();
                let dados = {
                    tipoSend: this.tipoSend,
                    paginaHeader: this.database.paginaHeader,
                    paginaParametros: this.database.paginaParametros,

                    idIntegrationAuth: paginaAuth != null ? paginaAuth.id : null,

                    ambiente: this.ambienteSincronizacao,

                    urlApiProd: this.database.urlApiProd,
                    urlApiDev: this.database.urlApiDev,
                    urlApiHomolog: this.database.urlApiHomolog,

                    methodSend: this.data_funcionalidades.methodSend,
                    endPointSend: this.data_funcionalidades.endPointSend,
                    payLoadRequestSend: this.data_funcionalidades.payLoadRequestSend,

                    methodReturn: this.data_funcionalidades.methodReturn,
                    endPointReturn: this.data_funcionalidades.endPointReturn,
                    payLoadRequestReturn: this.data_funcionalidades.payLoadRequestReturn
                    
                }
                
                IntegracaoService.getRequestTesteApi(dados)
                    .then(({ data }) => {
                        if(this.tipoSend == true)  this.data_funcionalidades.payLoadResponseSend = JSON.stringify(data);
                        if(this.tipoSend == false) this.data_funcionalidades.payLoadResponseReturn = JSON.parse(data);

                        this.$toast.add({
                            severity:'success',
                            detail: "Sincronização realizada com sucesso!", 
                            life: 5000
                        });
                        
                    })
                    .catch(error => {
                        if(this.tipoSend == true)  this.data_funcionalidades.payLoadResponseSend = JSON.stringify(error.message);
                        if(this.tipoSend == false) this.data_funcionalidades.payLoadResponseReturn = JSON.stringify(error.message);     
                        
                        this.$toast.add({
                            severity:'warn',
                            detail: "Erro: "+ error.message, 
                            life: timeToast
                        });
                    });
            },

            getAuthTesteEnvio(){
                if(this.ambienteSincronizacao == "dev"){
                    return this.database.authDev;
                }else if(this.ambienteSincronizacao == "homolog"){
                    return this.database.authHomolog;
                }else if(this.ambienteSincronizacao == "prod"){
                    return this.database.authProd;
                }else{
                    return null;
                }
            },

            validatePage(){
                let isNull = false;
                let timeToast = 0;
                let timeToastAcrescimo = 3000;
                
                if(this.database.origenEnum == undefined){

                    timeToast += timeToast == 0 ? 5000 : timeToastAcrescimo;
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Favor informar qual a origem de input dos dados.", 
                        life: timeToast
                    });
                    isNull = true;
                }

                if(this.database.origenEnum != 'ERP' && this.database.tipoEnum == undefined){

                    timeToast += timeToast == 0 ? 5000 : timeToastAcrescimo;
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Favor informar o tipo de Integração.", 
                        life: timeToast
                    });
                    isNull = true;
                }

                if(this.database.origenEnum != 'ERP' && this.database.sincronizacaoEnum == undefined){

                    timeToast += timeToast == 0 ? 5000 : timeToastAcrescimo;
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Favor informar o tipo de sincronização.", 
                        life: timeToast
                    });
                    isNull = true;
                }

                if(this.database.origenEnum != 'ERP' &&  this.database.urlApiDev == undefined){

                    timeToast += timeToast == 0 ? 5000 : timeToastAcrescimo;
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Favor informar a Url API Desenvolvimento.", 
                        life: timeToast
                    });
                    isNull = true;
                } 

                if(this.database.origenEnum != 'ERP' &&  this.database.urlApiHomolog == undefined){

                    timeToast += timeToast == 0 ? 5000 : timeToastAcrescimo;
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Favor informar a Url API Homologação.", 
                        life: timeToast
                    });
                    isNull = true;
                }

                if(this.database.origenEnum != 'ERP' &&  this.database.urlApiProd == undefined){

                    timeToast += timeToast == 0 ? 5000 : timeToastAcrescimo;
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Favor informar a Url API Produção.", 
                        life: timeToast
                    });
                    isNull = true;
                }

                if(this.database.origenEnum != 'ERP' &&  this.data_funcionalidades.methodSend == undefined){

                    timeToast += timeToast == 0 ? 5000 : timeToastAcrescimo;
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Favor informar qual o método de envio.", 
                        life: timeToast
                    });
                    isNull = true;
                } 

                if(this.database.origenEnum != 'ERP' &&  this.data_funcionalidades.endPointSend == undefined){

                    timeToast += timeToast == 0 ? 5000 : timeToastAcrescimo;
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Favor informar o valor do campo URI de envio.", 
                        life: timeToast
                    });
                    isNull = true;
                }
               
                if(!this.options.manual && 
                    (this.campoNulo(this.schedulerSend.second)   ||
                    this.campoNulo(this.schedulerSend.minute)   ||
                    this.campoNulo(this.schedulerSend.hour)     ||
                    this.campoNulo(this.schedulerSend.dayMonth) ||
                    this.campoNulo(this.schedulerSend.month)    ||
                    this.campoNulo(this.schedulerSend.dayWeek) ) ){   

                    timeToast += timeToast == 0 ? 5000 : timeToastAcrescimo;
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Favor informar o campo Scheduler de Envio.",
                        life: timeToast
                    });
                    isNull = true;
                }
                        
                if(!this.options.manual && this.options.async &&
                    (this.campoNulo(this.schedulerReturn.second)   ||
                    this.campoNulo(this.schedulerReturn.minute)   ||
                    this.campoNulo(this.schedulerReturn.hour)     ||
                    this.campoNulo(this.schedulerReturn.dayMonth) ||
                    this.campoNulo(this.schedulerReturn.month)    ||
                    this.campoNulo(this.schedulerReturn.dayWeek) ) ){           

                    timeToast += timeToast == 0 ? 5000 : timeToastAcrescimo;
                    this.$toast.add({
                        severity:'warn',
                        detail: "* Favor informar o campo Scheduler de Resposta.", 
                        life: timeToast
                    });
                    isNull = true;
                }
                
                this.database['id'] = this.id;
                this.database.paginaEnum = this.menuAtivo;
                if(!isNull){    
                    this.salvarFuncionalidadeSelecionada();                
                    this.savePage();
                }
            },

            campoNulo(value){
                return value == undefined || value == null;
            },

        // #Pagina de integração Funcionalidades
            getFuncionalidades(){
                if(this.selected.menuItem == undefined) return;
                IntegracaoService.getFuncionalidades(this.selected.menuItem.pagina)
                    .then(({ data }) => {
                        this.options.funcionalidades = data;
                    })
            },

            isAsync(async){
                if(async == true)  this.options.async = true;
                if(async == false) this.options.async = false;
                //if(async == true) this.schedulerReturn = {};
                //if(async == false && this.data_funcionalidades['schedulerReturn'] != undefined) this.data_funcionalidades['schedulerReturn'] = undefined;
            },

        // #Pagina de integração parametros    
            insertHeaderRow(index){
                const header = {
                    chave: null,
                    valor: null,
                    descricao: null,
                };

                if(index == undefined) {
                    this.database.paginaHeader.push(header); 
                }
                else {
                    this.database.paginaHeader.splice(index + 1, 0, header); 
                }
            },

            deleteHeaderRow(index){
                this.database.paginaHeader.splice(index, 1);
                if(this.database.paginaHeader.length < 1) this.insertHeaderRow();
            },

        // #Pagina de integração parametros
            insertParameterRow(index){
                const parametro = {
                    chave: null,
                    valor: null,
                    descricao: null,
                };

                if(index == undefined) {
                    this.database.paginaParametros.push(parametro); 
                }
                else {
                    this.database.paginaParametros.splice(index + 1, 0, parametro); 
                }

            },

            deleteParameterRow(index){   
                this.database.paginaParametros.splice(index, 1);             
                if(this.database.paginaParametros.length < 1) this.insertParameterRow();
            }, 
            
            cancelar(){
                //window.location.reload();
                this.options.disabled   = true;
                this.options.savePage   = false;
                this.options.pageUpdate = false;
                this.options.menuItemActive  = true;
                this.options.cadastrarPagina = true;
                this.options.pageUpdate = true;
                this.doubleClik = true;
            },

            clear(){   
                this.data_funcionalidades = {};
                this.schedulerReturn = {};
                this.schedulerSend = {};
                this.options = {};

                this.database = {};
                this.database.paginaHeader = [];
                this.database.paginaParametros = [];
            },  
            
            visualizarInformacao(paginaArea){
                this.paginaArea = paginaArea;
                this.informacaoDialog = true;
            },

            ocultarInformacao(){
                this.informacaoDialog = false;
            },

            getGenesis(click){
                if(click){
                    if(!this.mensagem){
                        this.$toast.add({
                            severity:'info', 
                            summary: 'PÁGINA GÊNESIS', 
                            detail:'Ao definir a origem como GÊNESIS, a página (' + this.selected.menuItem.descricao + ') ativará os botões de CADASTRO, EDIÇÃO, ATUALIZAÇÃO E DELETE, os campos de integração serão desativados e não será possível preenchê-los! Para confirmar clique em salvar.',
                            life: 5000
                        });
                        this.mensagem = true;
                    }
                    let origemEnum = this.database.origenEnum;
                    this.database = {};
                    this.data_funcionalidades = {};
                    this.funcionalidadeSelecionada =  null;
                    this.database['origenEnum'] = origemEnum;
                    this.database['paginaEnum'] = this.selected.menuItem.descricao;
                }
                if(this.database.origenEnum == 'ERP') {
                    this.options.genesis = true;  
                    this.isManual(true);
                    this.isAsync(false);
                }else{
                    this.options.genesis = false; 
                }           
            },

            onPage(event) {
                this.pagina = event.page;
                this.qtdRegistro = event.rows;
                this.getLogins();
            },
        },

        created(){
            this.getPaginas();
            this.startFilters(); 
            this.options.genesis    = false;
            this.options.disabled   = true;
            this.options.savePage   = false;
            this.options.pageUpdate = false;
            this.options.menuItemActive  = true;
            this.options.cadastrarPagina = true;
            
        },

        mounted(){   
               
        }, 
        
        updated(){             
            if(this.selected.menuItem != undefined && this.options.menuItemActive) {
                this.database.paginaEnum = this.selected.menuItem.descricao;
                this.menuAtivo = this.selected.menuItem.pagina;
                this.getFuncionalidades();
                this.getMetodos();
            }
            
            if(this.data_funcionalidades != undefined && this.data_funcionalidades.funcionalidade != undefined && !this.options.disabled){
                if(this.database['funcionalidades'] == undefined || this.database['funcionalidades'] == null)  this.database['funcionalidades'] = [];
            }
            else if(this.database!= undefined && this.database.funcionalidades != undefined && this.database.funcionalidades.length > 0) {
                this.data_funcionalidades = this.database.funcionalidades[0];
                this.funcionalidadeSelecionada = this.data_funcionalidades.funcionalidade;
                this.schedulerSend = this.data_funcionalidades.schedulerSend;
                this.schedulerReturn = this.data_funcionalidades.schedulerReturn;
            }

            if(this.schedulerSend != undefined || this.schedulerSend != {}){
                this.data_funcionalidades['schedulerSend'] = this.schedulerSend;
            }

            if(this.schedulerReturn != undefined || this.schedulerReturn != {}){
                this.data_funcionalidades['schedulerReturn'] = this.schedulerReturn;
            }

            if(this.database.paginaHeader == undefined) {
                this.database['paginaHeader'] = []; 
                this.insertHeaderRow();
            } 

            if(this.database.paginaParametros == undefined) {
                this.database['paginaParametros'] = []; 
                this.insertParameterRow();
            }           

            this.getGenesis();
        }        
    }
</script>