<template>
    <Toast />

    <div class="card">
        <div class="flex justify-content-between">
            <div class="flex align-items-center">
                <i class="pi pi-cog mr-2" style="font-size: 2rem;"></i>
                <h4 style="margin:0;">{{ id ? 'Editar' : 'Cadastrar'}} Natureza de Operação</h4>
            </div>
        </div>        
        <hr /> 

        <div class="col-12 grid"> 
            <div class="col-12 md:col-4 xl:col-2"> 
                <label class="w-full"><strong>Cód. Grupo<span style="color:red;">&nbsp;*</span></strong></label>               
                <InputNumber class="w-full mt-2"
                    :disabled="id"
                    placeholder="Código do Grupo"
                    v-model="natureza.codGrupo"                    
                    :min="0" :max="99999999" decimalPlaces="0"
                    :class="{'p-invalid': codGrupoIsInvalid}"/> 
            </div>       

            <div class="col-12 md:col-7 xl:col-9"> 
                <label class="w-full"><strong>Grupo De Natureza<span style="color:red;">&nbsp;*</span></strong></label>     
                <InputText class="w-full mt-2"
                    :disabled="disable"
                    v-model="natureza.descricao"
                    placeholder="Nome do Grupo"
                    maxlength="80"
                    :class="{'p-invalid': descricaoIsInvalid}"/>    
            </div>            

            <div class="align-items-center justify-content-center col-1"> 
                <label class="w-full"><span style="color:#fff;">&nbsp;</span></label> 
                <Button class="w-full p-button-rounded p-button-text align-items-center justify-content-center" @click="visualizarInformacao('NATUREZA_OPERACAO_AREA_TITULO')">
                    <i class="pi pi-info-circle" style="font-size: 1.8rem;"></i>
                </Button>
            </div>  
        </div>

        <TabView>
            <TabPanel>
                <template #header>
                    <i class="pi pi-users mr-1" style="font-size: 1.3rem;"></i>
                    <span>Pessoa Física</span>
                </template>
                
                <div class="grid">
                    <div class="col-6">
                        <Fieldset>
                            <template #legend>
                                <strong>Natureza/Série Cooperado</strong>
                            </template>

                            <div class="grid align-items-center">
                                <div class="col-2 label">
                                    <label>Nat. Remessa Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natEntCoop" :disabled="disable"  maxlength="20"/>
                                </div>
                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serEntCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Remessa Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modNatEntCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Nat. Retorno Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natDevEntCoop" :disabled="disable" maxlength="20"/>
                                </div>
                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serDevEntCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Retorno Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modDevEntCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-2 label">
                                    <label>Nat. Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natFixCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serFixCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modNatFixCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-2 label">
                                    <label>Nat. Fixação Semente:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natFixSemCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serFixSemCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Fixação Semente:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modNatFixSemCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-2 label">
                                    <label>Nat. Devolução Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natDevFixCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serDevFixCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Devolução Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modDevFixCoop" :disabled="disable" maxlength="20"/>
                                </div>
                            </div>
                        </Fieldset>
                    </div>

                    <div class="col-6">
                        <Fieldset>
                            <template #legend>
                                <strong>Natureza/Série Terceiro</strong>
                            </template>

                            <div class="grid align-items-center">
                                <div class="col-2 label">
                                    <label>Nat. Remessa Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natEntTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serEntTerc"  :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Remessa Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modNatEntTerc" :disabled="disable" maxlength="20"/>
                                </div>


                                <div class="col-2 label">
                                    <label>Nat. Retorno Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natDevEntTerc"  :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serDevEntTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Retorno Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modDevEntTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-2 label">
                                    <label>Nat. Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natFixTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serFixTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modNatFixTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-2 label">
                                    <label>Nat. Fixação Semente:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natFixSemTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serFixSemTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Fixação Semente:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modNatFixSemTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-2 label">
                                    <label>Nat. Devolução Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natDevFixTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serDevFixTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Devolução Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modNatDevFixTerc" :disabled="disable" maxlength="20"/>
                                </div>
                            </div>
                        </Fieldset>
                    </div>
                </div>
            </TabPanel>

            <TabPanel>
                <template #header>
                    <i class="pi pi-building mr-1" style="font-size: 1.3rem;"></i>
                    <span>Pessoa Jurídica</span>
                </template>
                
                <div class="grid">
                    <div class="col-6">
                        <Fieldset>
                            <template #legend>
                                <strong>Natureza/Série Cooperado - Com Nota Própria</strong>
                            </template>

                            <div class="grid align-items-center">
                                <div class="col-2 label">
                                    <label>Nat. Remessa Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natEntPjCnfCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serEntPjCnfCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Remessa Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modNatEntPjCnfCoop" :disabled="disable" maxlength="20"/>
                                </div>


                                <div class="col-2 label">
                                    <label>Nat. Retorno Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natDevPjCnfCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serDevPjCnfCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Retorno Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modDevPjCnfCoop" :disabled="disable" maxlength="20"/>
                                </div>
                                
                                <div class="col-2 label">
                                    <label>Nat. Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natFixPjCnfCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serFixPjCnfCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Natureza Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modFixPjCnfCoop" :disabled="disable" maxlength="20"/>
                                </div>
                                
                                <div class="col-2 label">
                                    <label>Nat. Fixação Semente:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natFixSemPjCnfCoop" :disabled="disable"  maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serFixSemPjCnfCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Fixação Semente:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modFixSemPjCnfCoop" :disabled="disable" maxlength="20"/>
                                </div>
                                
                                <div class="col-2 label">
                                    <label>Nat. Devolução Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natDevFixPjCnfCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serDevFixPjCnfCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Devolução Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modDevFixPjCnfCoop" :disabled="disable" maxlength="20"/>
                                </div>
                            </div>
                        </Fieldset>
                    </div>

                    <div class="col-6">
                        <Fieldset>
                            <template #legend>
                                <strong>Natureza/Série Terceiro - Com Nota Própria</strong>
                            </template>

                            <div class="grid align-items-center">
                                <div class="col-2 label">
                                    <label>Nat. Remessa Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natEntPjCnfTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serEntPjCnfTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Remessa Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modNatEntPjCnfTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Nat. Retorno Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natDevPjCnfTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serDevPjCnfTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod.  Retorno Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modDevPjCnfTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Nat. Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natFixPjCnfTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serFixPjCnfTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modFixPjCnfTerc" :disabled="disable" maxlength="20"/>
                                </div>
                                
                                <div class="col-2 label">
                                    <label>Nat. Fixação Semente:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natFixSemPjCnfTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serFixSemPjCnfTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Fixação Semente:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modFixSemPjCnfTerc" :disabled="disable" maxlength="20"/>
                                </div>
                                
                                <div class="col-2 label">
                                    <label>Nat. Devolução Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natDevFixPjCnfTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serDevFixPjCnfTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Devolução Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modDevFixPjCnfTerc" :disabled="disable" maxlength="20"/>
                                </div>
                            </div>
                        </Fieldset>
                    </div>

                    <div class="col-6">
                        <Fieldset>
                            <template #legend>
                                <strong>Natureza/Série Cooperado - Sem Nota Própria</strong>
                            </template>

                            <div class="grid align-items-center">
                                <div class="col-2 label">
                                    <label>Nat. Remessa Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natEntPjSnfCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serEntPjSnfCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Remessa Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modNatEntPjSnfCoop" :disabled="disable" maxlength="20"/>
                                </div>


                                <div class="col-2 label">
                                    <label>Nat. Retorno Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natDevPjSnfCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serDevPjSnfCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Retorno Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modDevPjSnfCoop" :disabled="disable" maxlength="20"/>
                                </div>
                                
                                <div class="col-2 label">
                                    <label>Nat. Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natFixPjSnfCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serFixPjSnfCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modFixPjSnfCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-2 label">
                                    <label>Nat. Fixação Semente:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natFixSemPjSnfCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serFixSemPjSnfCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Fixação Semente:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modFixSemPjSnfCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-2 label">
                                    <label>Nat. Devolução Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natDevFixPjSnfCoop" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serDevFixPjSnfCoop" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Devolução Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modDevFixPjSnfCoop" :disabled="disable" maxlength="20"/>
                                </div>
                            </div>
                        </Fieldset>
                    </div>

                    <div class="col-6">
                        <Fieldset>
                            <template #legend>
                                <strong>Natureza/Série Terceiro - Sem Nota Própria</strong>
                            </template>

                            <div class="grid align-items-center">
                                <div class="col-2 label">
                                    <label>Nat. Remessa Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natEntPjSnfTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serEntPjSnfTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Remessa Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modEntPjSnfTerc" :disabled="disable" maxlength="20"/>
                                </div>


                                <div class="col-2 label">
                                    <label>Nat. Retorno Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natDevPjSnfTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serDevPjSnfTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Retorno Armaz.:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modDevPjSnfTerc" :disabled="disable" maxlength="20"/>
                                </div>
                                
                                <div class="col-2 label">
                                    <label>Nat. Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natFixPjSnfTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serFixPjSnfTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modFixPjSnfTerc" :disabled="disable" maxlength="20"/>
                                </div>
                                
                                <div class="col-2 label">
                                    <label>Nat. Fixação Semente:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natFixSemPjSnfTec" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serFixSemPjSnfTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Fixação Semente:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modFixSemPjSnfTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-2 label">
                                    <label>Nat. Devolução Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.natDevFixPjSnfTerc" :disabled="disable" maxlength="20"/>
                                </div>

                                
                                <div class="col-1 label">
                                    <label>Série:</label>
                                </div>
                                <div class="col-1 campo">
                                    <InputText class="w-full" v-model="natureza.serDevFixPjSnfTerc" :disabled="disable" maxlength="3"/>
                                </div>

                                <div class="col-2 label">
                                    <label>Mod. Devolução Fixação:</label>
                                </div>
                                <div class="col-3 campo">
                                    <InputText class="w-full" v-model="natureza.modDevFixPjSnfTerc" :disabled="disable" maxlength="20"/>
                                </div>
                            </div>
                        </Fieldset>
                    </div>
                </div>
            </TabPanel>

            <TabPanel v-if="integration.visible">
                <template #header>
                    <i class="pi pi-home mr-1" style="font-size: 1.3rem;"></i>
                    <span>Estabelecimentos</span>
                </template>
                
                <PickList v-model="estabelecimentos" dataKey="id" listStyle="height:500px;">
                    <template #sourceheader>
                        Disponíveis
                    </template>
                    <template #targetheader>
                        Vinculados
                    </template>
                    <template #item="{ item }">
                        <span>{{ item.codigo }} - {{ item.nomeFantasia }}</span>
                    </template>
                </PickList>
            </TabPanel>
        </TabView>

        <hr />
        <div class="flex">
            <Button v-if="integration.visible"
                icon="pi pi-save"
                label="Salvar"
                :disabled="doubleClick"
                class="p-button-info mr-1"
                @click="salvar()"
            ></Button>

            <Button v-if="integration.visible"
                icon="pi pi-times"
                label="Cancelar"
                class="p-button-danger"
                @click="voltar()"
            ></Button>

            <Button v-if="!integration.visible"
                icon="pi pi-spinner"
                label="Voltar"
                class="p-button-outlined"
                @click="voltar()"/>
        </div>

    </div>

    <Modalinformacao 
        :visivel="informacaoDialog"
        :paginaArea="paginaArea"
        @fechar="ocultarInformacao()"
    />
    <Loading :visible="loading"/>
</template>

<script>
    import EstabelecimentoService from '../../service/EstabelecimentoService';
    import NaturezaOperacaoService from '../../service/NaturezaOperacaoService';   
    import TratamentoDeError from '../../utilities/TratamentoDeError'; 
    import IntegracaoService from '../../service/IntegracaoService';
    import Modalinformacao from '../ModalInformacao.vue';
    import Loading from '../../components/Loading.vue'

    export default {
        components: { Modalinformacao , Loading},
        props: {
            id: {
                type: String,
                required: false
            },
        },
        
        data() {
            return {
                natureza: {},
                estabelecimentos: [[],[]],

                codGrupoIsInvalid: false,
                descricaoIsInvalid: false,

                informacaoDialog: false,
                paginaArea: null,
                integration: {},
                disable: true,
                doubleClick: false,
                loading: false,
            }
        },
        created() {
            this.carregarDados();
            this.getIntegrationOptons();
        },
        methods: {
            getIntegrationOptons(){
                const paginaAtual = "NATUREZA_OPERACAO";
                IntegracaoService.getIntegrationOptions(paginaAtual)
                    .then(({ data }) => {
                        if(data) {
                            this.integration = data;
                            this.disable = data.disable;
                        }
                    })
            },

            carregarDados() {
                if(!this.id) {
                    this.carregarEstabelecimento();
                    return;
                }

                NaturezaOperacaoService.getNaturezaPorid(this.id)
                    .then(({ data }) => {
                        this.natureza = data;
                        if(data.listEstabelecimentoDto) {
                            this.carregarEstabelecimento(data.listEstabelecimentoDto);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        this.voltar();
                    });
            },

            carregarEstabelecimento(vinculados = []) {
                EstabelecimentoService.getTodosEstabelecimentosNaturezaOperacaoSilo()
                    .then(({ data }) => {                        
                        if(data) {
                            const disponiveis = data.filter(disponivel => {
                                const item = vinculados.find(vinculado => {
                                    return vinculado.id === disponivel.id;
                                });
                                return item === undefined;
                            });
    
                            this.estabelecimentos = [disponiveis, vinculados];
                        }
                        else {
                            this.estabelecimentos = [[], []];
                        }
                    })
                    .catch(error => {
                        this.estabelecimentos = [[], []];
                        console.error(error);
                    });
            },

            isCamposPreenchidos() {
                let isValid = true;

                if(!this.natureza.codGrupo) {
                    this.codGrupoIsInvalid = true;
                    this.loading = false;
                    isValid = false;
                }

                if(!this.natureza.descricao) {
                    this.descricaoIsInvalid = true;
                    this.loading = false;
                    isValid = false;
                }

                if(!isValid) {
                    this.$toast.add({
                        severity:'error', 
                        summary: 'Falha', 
                        detail:'Preencher os campos obrigatórios.', 
                        life: 3000
                    });
                    return;
                }

                return isValid;
            },

            salvar() {
                if(!this.isCamposPreenchidos() && !this.doubleClick) return;
                this.loading = true;
                this.doubleClick = true;
                this.natureza['listEstabelecimentoDto'] = this.estabelecimentos[1];    
                
                if(this.id == undefined){
                    NaturezaOperacaoService.salvar(this.natureza)
                        .then(({ data }) => {
                            this.loading = false;
                            this.$toast.add({
                                severity:'success', 
                                detail:`A Natureza de Operação foi cadastrada com sucesso!`, 
                                life: 3000
                            });
                            this.loading = false;
                            this.voltar();
                        })
                        .catch(error => {
                            this.loading = false;
                            this.doubleClick = false;
                            this.$toast.add(TratamentoDeError(error));
                        });
                }else{
                     NaturezaOperacaoService.atualizar(this.natureza)
                        .then(({ data }) => {
                            this.$toast.add({
                                severity:'success', 
                                detail:`A Natureza de Operação foi atualizada com sucesso!`, 
                                life: 3000
                            });
                            this.loading = false;
                            this.voltar();
                        })
                        .catch(error => {
                            this.doubleClick = false;
                            this.loading = false;
                            this.$toast.add(TratamentoDeError(error));
                        });
                }
            },
            
            voltar() {
                this.$router.push(`/natureza-operacao`);
            },

            limparCampos() {
                this.natureza = {};

                this.carregarEstabelecimento();
                
                this.dialog = false;
                this.cancelarDialog = false;
                this.salvarDialog = false;
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
