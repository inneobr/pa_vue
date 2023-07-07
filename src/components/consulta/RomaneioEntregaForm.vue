<template>
	<div class="grid panel-demo">
		<div class="col-12">
			<div class="card toolbar-demo">
				<div class="flex align-items-center">
					<i class="pi pi-file mr-1" style="font-size: 1.4rem"></i>
					<h3 style="margin:0px 5px;">Romaneio de Entrega</h3>
				</div>
				
				<div class="mb-0 p-fluid mt-3">
					<div class="grid align-items-start">

					<!-- Esquerda -->
					<div class="grid md:col-6 sm:col-12 align-items-center">
						
						<div class="col-3 label" style="text-align: right;">
							<label>Estabelecimento:</label>
						</div>
						<div class="col-2 campo">
							<InputText class="uppercase col-2" v-model="romaneio.codEstabel" :disabled="true"/>
						</div>
						<div class="col-7 campo">
							<InputText class="uppercase col-10" v-model="nomeEstabelecimento" :disabled="true"/>
						</div>


						<div class="col-3 label" style="text-align: right;">
							<label>Grupo de Produto:</label>
						</div>
						<div class="col-2 campo">
							<InputText class="w-full uppercase" v-model="romaneio.fmCodigo" :disabled="true"/>
						</div>
						<div class="col-7 campo">
							<InputText class="w-full uppercase" v-model="nomeGrupoProduto" :disabled="true"/>
						</div>
						
						<div class="col-3 label" style="text-align: right;">
							<label>Produtor:</label>
						</div>
						<div class="col-2 campo">
							<InputText class="w-full uppercase" v-model="romaneio.codEmitente" :disabled="true"/>
						</div>
						<div class="col-7 campo">
							<InputText class="w-full uppercase" v-model="nomeProdutor" :disabled="true"/>
						</div>

						<div v-if="romaneio.nomeProd" class="col-3 label" style="text-align: right;">
							<label>Nome Produtor:</label>
						</div>
						<div v-if="romaneio.nomeProd" class="col-9 campo">
							<InputText class="w-full uppercase" v-model="romaneio.nomeProd" :disabled="true"/>
						</div>

						<div class="col-3 label" style="text-align: right;">
							<label>Origem RE:</label>
						</div>
						<div class="col-2 campo">
							<InputText class="w-full uppercase" v-model="romaneio.origemRe" :disabled="true"/>
						</div>

						<div class="col-2 label" style="text-align: right;">
							<label>RE de:</label>
						</div>
						<div class="col-2 campo">
							<InputText class="w-full uppercase" v-model="romaneio.natureza" :disabled="true"/>
						</div>

						<div class="col-1 label" style="text-align: right;">
							<label>Id RE:</label>
						</div>
						<div class="col-2 campo">
							<InputText class="w-full uppercase" v-model="romaneio.idRe" :disabled="true"/>	
						</div>
						
					</div>

					<!-- Direita -->
					<div class="grid md:col-6 sm:col-12 align-items-center">
						
						<div class="col-2 label" style="text-align: right;">
							<label><strong>Número RE:</strong></label>
						</div>
						<div class="col-2 campo">
							<InputNumber class="w-full uppercase" v-model="romaneio.nrRe" :disabled="true" style="font-weight: bold"/>	
						</div>

						<div class="col-2 label" style="text-align: right;">
							<label>Regional:</label>
						</div>
						<div class="col-2 campo">
							<InputText class="w-full uppercase" v-model="romaneio.codRegional" :disabled="true"/>	
						</div>

						<!-- A pedido da Mirian vamos deixar estes campos para outra fase. -->
						<div class="col-1 label" style="text-align: right;">
							<label>Saldo:</label>
						</div>
						<div class="col-3 campo">
							<InputText class="w-full uppercase"  :disabled="true"/>	
						</div>

						<div class="col-2 label" style="text-align: right;">
							<label>Safra:</label>
						</div>
						<div class="col-2 campo">
							<InputText class="w-full uppercase" v-model="romaneio.safra" :disabled="true"/>	
						</div>
						<div class="col-3 campo">
							<InputText class="w-full uppercase" v-model="romaneio.safraCompos" :disabled="true"/>	
						</div>
						<div class="col-5 campo">
							<InputText class="w-full uppercase" v-model="romaneio.nomeSafraCompos" :disabled="true" />
						</div>
		
						<div class="col-2 label" style="text-align: right;">
							<label>Situação:</label>
						</div>
						<div class="col-5 campo">
							<InputText class="w-full uppercase" v-model="descricaoSituacao"  :disabled="true"/>	
						</div>
						
						<div class="col-2 label" style="text-align: right;">
							<label>Integração:</label>
						</div>
						<div class="col-3 campo">
							<InputText class="w-full uppercase" v-model="romaneio.dataIntegracao" :disabled="true"/>	
						</div>
						
						<div class="col-3 label" style="text-align: right;">
							<label>Integrado</label>
						</div>
						<div class="col-1 campo">
							<Checkbox v-model="romaneio.logIntegrado" :binary="true" :disabled="true"/>
						</div>

						<div class="col-3 label" style="text-align: right;">
							<label>Possui Saldo</label>
						</div>
						<div class="col-1 campo">
							<Checkbox v-model="romaneio.logTemSaldo" :binary="true" :disabled="true"/>
						</div>

						<div class="col-3 label" style="text-align: right;">
							<label>RE Bloqueada</label>
						</div>
						<div class="col-1 campo">
							<Checkbox v-model="romaneio.reBloqueado" :binary="true" :disabled="true"/>
						</div>

						<div class="col-3 label" style="text-align: right;">
							<label>RE DPI Bloqueada</label>
						</div>
						<div class="col-1 campo">
							<Checkbox v-model="romaneio.logBloqDpi" :binary="true" :disabled="true"/>
						</div>

						<div class="col-3 label" style="text-align: right;">
							<label>RE de DPI</label>
						</div>
						<div class="col-1 campo">
							<Checkbox v-model="romaneio.logReDpi" :binary="true" :disabled="true"/>
						</div>

						<div class="col-3 label" style="text-align: right;">
							<label>Devolvido</label>
						</div>
						<div class="col-1 campo">
							<Checkbox v-model="romaneio.reDevolvido" :binary="true" :disabled="true"/>
						</div>

						<div class="col-3 label" style="text-align: right;">
							<label>Produto Padronizado</label>
						</div>
						<div class="col-1 campo">
							<Checkbox v-model="romaneio.prodPadr" :binary="true" :disabled="true"/>
						</div>

						<div class="col-3 label" style="text-align: right;">
							<label>Não Descarregado Unidade</label>
						</div>
						<div class="col-1 campo">
							<Checkbox v-model="romaneio.descarUnid" :binary="true" :disabled="true" />
						</div>

					</div>
				</div>
			</div>	
			</div>
					
			<TabView>
			<TabPanel>
                <template #header>
                    <i class="pi pi-bars mr-2" style="font-size: 1rem;"></i>
                    <span>Detalhes</span>
                </template>

				<div class="card mb-3 p-fluid">
					<div class="grid align-items-start">

						<div id="coluna1" class="grid col-4 align-items-center">
							<div class="col-6 label" style="text-align: right;">
								<label>Peso Bruto (Kg):</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.pesoBruto" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Tara Veículo (Kg):</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.taraVeiculo" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Tara Sacaria (Kg):</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.taraSacaria" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Peso Liquido (Kg):</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.pesoLiquido" class="w-full" :disabled="true" />
							</div>
						</div>

						<div id="coluna2" class="grid col-4 align-items-center">
							
							<div class="col-6 label" style="text-align: right;">
								<label>Placa do Veículo:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.placa" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Entrada RE:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="campoEntradaRe" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Nr. RE Prim. Entrada:</label>
							</div>
							<div class="col-6 campo">
								<InputNumber v-model="romaneio.nrPriEnt" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Nr. RE Produto:</label>
							</div>
							<div class="col-6 campo">
								<InputNumber v-model="romaneio.nrRePai" class="w-full" :disabled="true" />
							</div>


						</div>

						<div id="coluna3" class="grid col-4 align-items-center">

							<div class="col-6 label" style="text-align: right;">
								<label>Nr. RE Fix. Entrada:</label>
							</div>
							<div class="col-6 campo">
								<InputNumber v-model="romaneio.nrReOrigDfx"  class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Nr. RE Transferência:</label>
							</div>
							<div class="col-6 campo">
								<InputNumber v-model="romaneio.nrAutTransf" class="w-full" :disabled="true" />
							</div>

						</div>

						<!-- <div class="col-2 label" style="text-align: right;">
							<label>Produto Padronizado:</label>
						</div>
						<div class="col-2 campo">
							<Checkbox v-model="romaneio.prodPadr" :binary="true" class="w-full" :disabled="true" />
						</div> -->

						<!-- <div class="col-2 label" style="text-align: right;">
							<label>Não Descarregado Unidade:</label>
						</div>
						<div class="col-2 campo">
							<Checkbox v-model="romaneio.descarUnid" :binary="true" class="w-full" :disabled="true" />
						</div> -->
					</div>
				</div>

				<div class="grid">
					
					<div class="col-6">
						<Fieldset legend="Transgênico">
							<!-- <div class="flex flex-column md:flex-row md:justify-content-between row-gap-2"> -->
							<div class="grid align-items-center">

								<div class="col-3 label" style="text-align: right;">
									<label>GMO:</label>
								</div>
								<div class="col-4 campo">
									<InputText class="w-full uppercase" v-model="romaneio.tipoGmo" :disabled="true"/>
								</div>
								<div class="col-5 campo" style="text-align: center;">
									<label>{{romaneio.tipoRr}}</label>
								</div>

								<div class="flex align-items-center col-3"></div>
								<div class="flex align-items-center col-5">
									<Checkbox v-model="romaneio.comCobranca" :disabled="true" :binary="true" style="margin-top: 6px; margin-bottom: 6px;"/>
									<label for="ingredient1" class="ml-2 label"> RE com cobrança de Kit </label>
								</div>

								<div class="flex align-items-center col-4">
									<Checkbox v-model="romaneio.kitCobrado" :binary="true" :disabled="true" />
									<label for="ingredient1" class="ml-2 label"> Kit Pago </label>
								</div>

								<!-- Base de cálculo DPI -->
								<div class="col-3 label" style="text-align: right;">
									<label>{{labelPesoLiqSemDescDpi}}:</label>
								</div>
								<div class="col-3 campo">
									<InputText v-model="romaneio.pesoLiqSemDescDpi" class="w-full" :disabled="true" />
								</div>

								<!-- Qt. P/Baixa Credito -->
								<div class="col-3 label" style="text-align: right;">
									<label>{{ labelQtBaixaCredito }}</label>
								</div>
								<div class="col-3 campo">
									<InputText v-model="rendaSemDescDpi" class="w-full" :disabled="true" />
								</div>

								<!-- Nr.RE DPI: -->
								<div class="col-3 label" style="text-align: right;">
									<label>Nr. RE DPI:</label>
								</div>
								<div class="col-3 campo">
									<InputText v-model="romaneio.nrReDpi" class="w-full" :disabled="true" />
								</div>

								<!-- Nr. RE Parcial DPI -->
								<div class="col-3 label" style="text-align: right;">
									<label>Nr. da RE Parcial DPI:</label>
								</div>
								<div class="col-3 campo">
									<InputText v-model="romaneio.nrReParcialDpi" class="w-full" :disabled="true" />
								</div>
								
							</div>
							
						</fieldset>
					</div>
					
					<div class="col-6">
						<Fieldset legend="Taxa SP / Consumo Próprio">
							
							<div class="flex flex-column md:flex-row md:justify-content-between row-gap-3">
								
								<div class="flex align-items-center">
									<Checkbox v-model="romaneio.logTxSpRetida" :binary="true" :disabled="true" />
									<label class="ml-2 label"> Retida </label>
								</div>
								
								<div class="flex align-items-center">
									
									<div class="label" style="text-align: right;">
										<label>Nr. RE onde taxa foi retida: </label>
									</div>
									<div class="campo">
										<InputNumber v-model="romaneio.nrReTxSpRetida" :binary="true" class="w-full" :disabled="true" />
									</div>
								</div>
							</div>
						</fieldset>
					</div>
				</div>
					
				

				<Fieldset legend="Observações">
					<div class="col-12">
						<Textarea v-model="romaneio.observacoes" class="w-full" :disabled="true" rows="5"/>
					</div>
				</Fieldset>

			</TabPanel>


			<TabPanel>
                <template #header>
                    <i class="pi pi-bars mr-2" style="font-size: 1rem;"></i>
                    <span>Detalhes 2</span>
                </template>

				<div class="card mb-3 p-fluid">
			
					<div class="grid align-items-start">

						<div id="colunad2-1" class="col-4 grid align-items-center">
							
							<div class="col-6 label" style="text-align: right;">
								<label>Data Recebimento:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.dtEntrada"  class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Data Emissão:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.dtEmissao" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Doc. Pesagem:</label>
							</div>
							<div class="col-6 campo">
								<InputNumber v-model="romaneio.nrDocPes" class="w-full" :disabled="true" />
							</div>
							
							<div class="col-6 label" style="text-align: right;">
								<label>Tulha/Moega:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.tulha" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Nome Motorista:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.motorista" class="w-full" :disabled="true" />
							</div>

						</div>
						<div id="colunad2-2" class="col-4 grid align-items-center">
							<div class="col-6 label" style="text-align: right;">
								<label>Imóvel:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.matricula" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>CAD/PRO:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.nrCadPro" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Representante:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.cdnRepres" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Nr. NF Final Dia:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.nrNotaFis" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Série NF Final Dia:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.serie" class="w-full" :disabled="true" />
							</div>

						</div>
						<div id="colunad2-3" class="col-4 grid align-items-center">
							<div class="col-6 label" style="text-align: right;">
								<label>Nr. NF Remessa:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.nroDocum" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Série NF Remessa:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.serieDocum" class="w-full" :disabled="true" />
							</div>

							<div class="col-6 label" style="text-align: right;">
								<label>Nat. Operação:</label>
							</div>
							<div class="col-6 campo">
								<InputText v-model="romaneio.natDocum" class="w-full" :disabled="true" />
							</div>

						</div>
					</div>

					<div class="grid">
						<div class="col-12 campo">
							<Fieldset class="col-12" legend="Semente" :toggleable="false">
								<div class="flex align-items-center">
									
									<div class="col-2 label" style="text-align: right;">
										<label>Contr. Semente:</label>
									</div>
									<div class="col-2 campo">
										<InputText v-model="romaneio.nrContSem" class="w-full" :disabled="true" />
									</div>

									<div class="col-2 label" style="text-align: right;">
										<label>Ordem Campo:</label>
									</div>
									<div class="col-2 campo">
										<InputText v-model="romaneio.nrOrdCampo" class="w-full" :disabled="true" />
									</div>

									<div class="col-2 label" style="text-align: right;">
										<label>Nr Laudo:</label>
									</div>
									<div class="col-2 campo">
										<InputText v-model="romaneio.nrLaudo" class="w-full" :disabled="true" />
									</div>
								</div>
								<div class="flex align-items-center">
									<div class="col-2 label" style="text-align: right;">
										<label>Nr. BCQS:</label>
									</div>
									<div class="col-2 campo">
										<InputText v-model="romaneio.nrBcqs" class="w-full" :disabled="true" />
									</div>
								</div>

							</Fieldset>
						</div>
					</div>

					<div class="grid">
							<div class="col-12 campo">
								<Fieldset class="col-12" legend="Nota Fiscal do Produtor" :toggleable="false"> 

									<div class="flex align-items-center">
										<div class="col-2 label" style="text-align: right;">
											<label>Série:</label>
										</div>
										<div class="col-2 campo">
											<InputText v-model="romaneio.serNfProd" class="w-full" :disabled="true" />
										</div>

										<div class="col-2 label" style="text-align: right;">
											<label>Número:</label>
										</div>
										<div class="col-2 campo">
											<InputText v-model="romaneio.nrNfProd" class="w-full" :disabled="true" />
										</div>

										<div class="col-2 label" style="text-align: right;">
											<label>Emissão:</label>
										</div>
										<div class="col-2 campo">
											<InputText v-model="romaneio.dtNfProd" class="w-full" :disabled="true" />
										</div>

									</div>
								</Fieldset>
							</div>
						</div>

						<div class="grid">
							<div class="col-12 campo">
								<Fieldset class="col-12" legend="Nota Fiscal PJ - Nota Própria" :toggleable="false"> 

									<div class="grid align-items-center">
										
										<div class="col-2 label" style="text-align: right;">
											<label>Nr. Nota PJ:</label>
										</div>
										<div class="col-2 campo">
											<InputText v-model="romaneio.pjNroNota" class="w-full" :disabled="true" />
										</div>

										<div class="col-2 label" style="text-align: right;">
											<label>Série PJ:</label>
										</div>
										<div class="col-2 campo">
											<InputText v-model="romaneio.pjSerie" class="w-full" :disabled="true" />
										</div>

										<div class="col-2 label" style="text-align: right;">
											<label>Dt. Emissão Nota PJ:</label>
										</div>
										<div class="col-2 campo">
											<InputText v-model="romaneio.pjDtEmissao" class="w-full" :disabled="true" />
										</div>

										<div class="col-2 label" style="text-align: right;">
											<label>Vl. Total Nota PJ:</label>
										</div>
										<div class="col-2 campo">
											<InputText v-model="romaneio.pjVlTotNota" class="w-full" :disabled="true" />
										</div>

										<div class="col-2 label" style="text-align: right;">
											<label>Nat. Opereração:</label>
										</div>
										<div class="col-2 campo">
											<InputText v-model="romaneio.pjNatOper" class="w-full" :disabled="true" />
										</div>

										<div class="col-2 label" style="text-align: right;">
											<label>Qt. Entrada:</label>
										</div>
										<div class="col-2 campo">
											<InputText v-model="romaneio.pjQtEntrada" class="w-full" :disabled="true" />
										</div>

										<div class="col-2 label" style="text-align: right;">
											<label>Qt. Total Nota:</label>
										</div>
										<div class="col-2 campo">
											<InputText v-model="romaneio.pjQtTotNota" class="w-full" :disabled="true" />
										</div>

										<div class="col-2 label" style="text-align: right;">
											<label>Chave de Acesso:</label>
										</div>
										<div class="col-3 campo">
											<InputText v-model="romaneio.pjChaveAcesso" class="w-full" :disabled="true" />
										</div>

									</div>
								</Fieldset>
							</div>
						</div>
				</div>
			</TabPanel>

			<TabPanel>
                <template #header>
                    <i class="pi pi-bars mr-2" style="font-size: 1rem;"></i>
                    <span>Classificação</span>
                </template>
			
				<!-- <div class="card" style="width: 1200px;"> -->
				<div class="card col-12">
					
					<DataTable 
						showGridlines
						:value="romaneio.itemRecEntrega"
						responsiveLayout="scroll" 
						selectionMode="single"
						v-model:selection="selectionrecEntregaItem"
						:scrollable="true" 
						scrollDirection="both"
						> 

						<template #empty>
							Nenhum registro encontrado.
						</template>

						<template #loading>
							Carregando... Por favor, aguarde.
						</template>
						
						<column field="codProduto" header="Item Gênesis" style="min-width: 150px" />	
						<column field="itCodigo" header="Item Data Sul" style="min-width: 150px" />	
						<column field="codRefer" header="Refer Tipo" style="min-width: 150px" />
						<column field="lote" header="Lote" style="min-width: 150px" />	
													
						<column field="phEntrada" header="Ph Entrada" style="min-width: 150px" />	
						<column field="phCorrigido" header="Ph Corrigido" style="min-width: 150px" />
						
						
						<column field="pesoLiquido" header="Peso Liquido (Kg)" style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.pesoLiquido, 0, 0) }} Kg
							</template>
						</column>
						<column field="pesoLiquidoAtu" header="Peso Líq. Atu(Kg)" style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.pesoLiquidoAtu, 0, 0) }} Kg
							</template>
						</column>

						<column field="impureza" header="% Impureza" style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.impureza, 2, 2) }} 
							</template>
						</column>
						<column field="perDescImpur" header="% Desc. Impureza" style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.perDescImpur, 2, 2) }}
							</template>
						</column>
						<column field="qtDescImpur" header="Qt. Desc. Impureza" style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.qtDescImpur, 0, 0) }}
							</template>
						</column>

						<column field="umidade" header="Umidade" style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.umidade, 2, 2) }} 
							</template>
						</column>

						<column field="perDescUmid" header="% Desc. Umidade" style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.perDescUmid, 2, 2) }} 
							</template>
						</column>

						<column field="qtDescUmid" header="Qt. Desc. Umidade" style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.qtDescUmid, 0, 0) }}
							</template>
						</column>	


						<column field="chuvAvar" header="Chuv./Avar." style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.chuvAvar, 2, 2) }} 
							</template>
						</column>

						<column field="perDescChuv" header="% Desc. Chuv./Avar." style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.perDescChuv, 2, 2) }} 
							</template>
						</column>

						<column field="qtDescChuv" header="Qt. Desc. Chuv./Avar." style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.qtDescChuv, 0, 0) }}
							</template>
						</column>	

						<column field="percBandinha" header="% Bandinha" style="min-width: 150px" >
							<template #body="{ data }">
								{{  formatDecimal(data.percBandinha, 2, 2) }} 
							</template>
						</column>
						
						<column field="tbm" header="TBM" style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.tbm, 2, 2) }} 
							</template>
						</column>

						<column field="qtTbm" header="Qt. Desconto TBM" style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.qtTbm, 0, 0) }} 
							</template>
						</column>

						<column field="fnt" header="FNT" style="min-width: 150px" >
							<template #body="{ data }">
								{{  formatDecimal(data.fnt, 2, 2) }} 
							</template>
						</column>

						<column field="densidade" header="Densidade" style="min-width: 150px" >
							<template #body="{ data }">
								{{  formatDecimal(data.densidade, 0, 0) }} 
							</template>
						</column>

						<column field="vlRecepcao" header="Valor Recepção" style="min-width: 150px" >
							<template #body="{ data }">
								R$ {{  formatDecimal(data.vlRecepcao, 9, 9) }}
							</template>
						</column>
						
						<column field="qtRecepcao" header="Qt.Recep." style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.qtRecepcao, 0, 0) }} 
							</template>
						</column>
						
						<column field="vlSecagem" header="Valor Tx. Secagem" style="min-width: 170px">
							<template #body="{ data }">
								R$ {{  formatDecimal(data.vlSecagem, 9, 9) }}
							</template>
						</column>
						
						<column field="qtSecagem" header="Qt. Secagem" style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.qtSecagem, 0, 0) }} 
							</template>
						</column>	

						<column field="rendaLiquida" header="Renda Líquida (Kg)" style="min-width: 150px">
							<template #body="{ data }">
								{{  formatDecimal(data.rendaLiquida, 0, 0) }} 
							</template>
						</column>

						<column field="rendaLiquidaAtu" header="Renda Líquida Atual(Kg)" style="min-width: 150px" >
							<template #body="{ data }">
								{{  formatDecimal(data.rendaLiquidaAtu, 0, 0) }} Kg
							</template>
						</column>

						<column field="vlFiscal" header="Preço Fiscal" style="min-width: 150px" >
							<template #body="{ data }">
								R$ {{  formatDecimal(data.vlFiscal, 2, 9) }}
							</template>
						</column>

						<column field="vlPonto" header="Preço Ponto" style="min-width: 150px">
							<template #body="{ data }">
								R$ {{  formatDecimal(data.vlPonto, 2, 9) }}
							</template>
						</column>

						<column field="tabVlRecepcao" header="Tab. Valor Recepção" style="min-width: 160px" >
							<template #body="{ data }">
								R$ {{  formatDecimal(data.tabVlRecepcao, 9, 9) }}
							</template>
						</column>	

						<column field="tabTxSecVl" header="Tab. Valor Sc Secagem/Limpeza" style="min-width: 210px">
							<template #body="{ data }">
								R$ {{  formatDecimal(data.tabTxSecVl, 2, 5) }}
							</template>
						</column>

						<column field="tabTxSecKg" header="Tab. % por kg Secagem/Limpeza" style="min-width: 210px" >
							<template #body="{ data }">
								{{  formatDecimal(data.tabTxSecKg, 2, 2) }} %
							</template>
						</column>

						<column field="defeitos" header="Defeitos" style="min-width: 150px" />
						<column field="tipo" header="Tipo" style="min-width: 150px" />	
						<Column field="bebida" header="Bebida" style="min-width: 150px;"></Column>

						<column field="perPen14Acima" header="% Pen. 14 Acima" style="min-width: 150px" >
							<template #body="{ data }">
								{{  formatDecimal(data.perPen14Acima, 2, 2) }} 
							</template>
						</column>

						<column field="cafeEscolha" header="Café Escolha" style="min-width: 150px" >
							<template #body="{ data }">
								{{  formatDecimal(data.cafeEscolha, 2, 2) }} 
							</template>
						</column>	

						<Column field="normal" header="Normal" style="min-width: 150px;">
							<template #body="{ data }">
								{{ data.normal ? 'Sim' : 'Não' }}
							</template>
						</Column>

						<Column field="sementeira" header="Sementeira" style="min-width: 150px;">
							<template #body="{ data }">
								{{ data.sementeira ? 'Sim' : 'Não' }}
							</template>
						</Column>
						
						<Column field="terra" header="Terra" style="min-width: 150px;">
							<template #body="{ data }">
								{{ data.terra ? 'Sim' : 'Não' }}
							</template>
						</Column>

						<Column field="vagem" header="Vagem" style="min-width: 150px;">
							<template #body="{ data }">
								{{ data.vagem ? 'Sim' : 'Não' }}
							</template>
						</Column>

						<column field="seqItemDocum" header="Seq. Item NF" style="min-width: 150px" class="pt-3 pb-3">
							<template #body="{ data }">
								{{  formatDecimal(data.seqItemDocum, 2, 2) }} 
							</template>
						</column>

						<column field="qtAlocada" header="Qt. Alocada" style="min-width: 150px" >
							<template #body="{ data }">
								{{  formatDecimal(data.qtAlocada, 2, 2) }} 
							</template>
						</column>	

						<column field="logIntegrado" header="logIntegrado" style="min-width: 150px">
							<template #body="{ data }">
								{{ data.logIntegrado ? 'Sim' : 'Não' }}
							</template>
						</column>

						<column field="dtUltInt" header="Dt. Ult. Int. Genesis" style="min-width: 150px" >
							<template #body="{ data }">
                    			{{ formatDate(data.dtUltInt, 'DD/MM/YYYY') }}	
                			</template>
						</column>
						<column field="hrUltInt" header="Hr. Ult. Int Gênesis" style="min-width: 150px" >
						</column>	
						<column field="idItRe" header="ID Item RE Gênesis" style="min-width: 150px" />	
				   
					</DataTable>
				</div>
				
			</TabPanel>

			<TabPanel :disabled="true">
                <template #header>
                    <i class="pi pi-bars mr-2" style="font-size: 1rem;"></i>
                    <span>Café</span>
                </template>
				
				
			</TabPanel>

			<TabPanel :disabled="true">
                <template #header>
                    <i class="pi pi-bars mr-2" style="font-size: 1rem;"></i>
                    <span>Beneficiamento Café</span>
                </template>

				<div class="w-full">
					<div class="grid align-items-center">
					
						<Fieldset legend="Resultado do Beneficiamento" class="col-5">
						
							<div class="grid align-items-center">

								<div class="col-3 label" style="text-align: right;">
									<label>Tipo:</label>
								</div>
								<div class="col-3 campo">
									<InputText  class="w-full" :disabled="true" />
								</div>

								<div class="col-3 label" style="text-align: right;">
									<label>Bebida:</label>
								</div>
								<div class="col-3 campo">
									<InputText class="w-full" :disabled="true" />
								</div>

								<div class="col-3 label" style="text-align: right;">
									<label>Refência:</label>
								</div>
								<div class="col-3 campo">
									<InputText class="w-full" :disabled="true" />
								</div>

								<div class="col-3 label" style="text-align: right;">
									<label>Renda Líquida (kg):</label>
								</div>
								<div class="col-3 campo">
									<InputText class="w-full" :disabled="true" />
								</div>

								<div class="col-3 label" style="text-align: right;">
									<label>Escolha:</label>
								</div>
								<div class="col-3 campo">
									<InputText class="w-full" :disabled="true" />
								</div>
							</div>

						</Fieldset>

						<Fieldset legend="Renda Manual" class="col-5">
							<div class="grid align-items-center">
								<div class="col-3 label" style="text-align: right;">
									<label>Tipo:</label>
								</div>
								<div class="col-3 campo">
									<InputText class="w-full" :disabled="true" />
								</div>

								<div class="col-3 label" style="text-align: right;">
									<label>Bebida:</label>
								</div>
								<div class="col-3 campo">
									<InputText class="w-full" :disabled="true" />
								</div>

								<div class="col-3 label" style="text-align: right;">
									<label>Referência:</label>
								</div>
								<div class="col-3 campo">
									<InputText class="w-full" :disabled="true" />
								</div>

								<div class="col-3 label" style="text-align: right;">
									<label>Renda Líquida (Kg):</label>
								</div>
								<div class="col-3 campo">
									<InputText class="w-full" :disabled="true" />
								</div>

								<div class="col-3 label" style="text-align: right;">
									<label>Escolha:</label>
								</div>
								<div class="col-3 campo">
									<InputText class="w-full" :disabled="true" />
								</div>
							</div>

						</Fieldset>
					</div>
				</div>
				
			</TabPanel> <!-- Fim do beneficiamento Café -->

			<TabPanel :disabled="ocultarUBS">
                <template #header>
                    <i class="pi pi-bars mr-2" style="font-size: 1rem;"></i>
                    <span>UBS</span>
                </template>
				
				<div class="card col-12">
					
					<div class="col-12 flex align-items-center">
							<div class="flex align-items-center" style="margin-left: 2%; margin-top: 2%;">
								<Checkbox v-model="romaneio.ubsLogLiberado"  :binary="true" :disabled="true" />
								<label class="ml-2"> RE Liberada para Beneficiamento </label>
							</div>
					</div>

					<div>
						<Fieldset legend="Requisição Ordem de Produção de Beneficiamento" style="margin: 2%">
							<div class="grid align-items-center">

								<div class="col-2 label" style="text-align: right;">
									<Checkbox v-model="romaneio.ubsLogRequisitado"  :binary="true" :disabled="true" />
								</div>
								<div class="col-2 campo" style="text-align: left;">
									<label class="">RE Requisitada </label>
								</div>

								<div class="col-2 label" style="text-align: right;">
									<label>Data:</label>
								</div>
								<div class="col-2 campo">
									<InputText v-model="romaneio.ubsDataRequisicao" class="w-full" :disabled="true" />
								</div>

								<div class="col-2 label" style="text-align: right;">
									<label>Hora:</label>
								</div>
								<div class="col-2 campo">
									<InputText v-model="romaneio.ubsHoraRequisicao" mask="99:99:99" class="w-full" :disabled="true" />
								</div>

								<div class="col-2 label" style="text-align: right;">
									<label>Requisitada na O.P.:</label>
								</div>
								<div class="col-2 campo">
									<InputText v-model="romaneio.nrOrdProd" class="w-full" :disabled="true" /> <!-- ??? -->
								</div>
							</div>
						</Fieldset>
					</div>
				</div>
			</TabPanel>
			</TabView>
		</div>	
	</div>

	<div class="card">
		<Button 
			icon="pi pi-spinner"
			label="Voltar"
			class="p-button-outlined"
			@click="voltar()"/>
	</div>
</template>



<script>
	import RomaneioEntregaService from '../../service/RomaneioEntregaService';
	import GrupoProdutoService from '../../service/GrupoProdutoService';
	import Formatacao from '../../utilities/Formatacao';
	import EstabelecimentoService from '../../service/EstabelecimentoService';
	import ProdutorService from '../../service/ProdutorService';
	import SituacaoReService from '../../service/SituacaoRe';
	

	export default {
		name: 'RomaneioEntregaForm',
		props: {
            id: {
                type: String,
                required: false
            }
        },
		data() {
			return {
				ocultarUBS: true,
				nomeEstabelecimento:null,
				nomeGrupoProduto: null,
				nomeProdutor: null,
				rendaSemDescDpi: null,
				romaneio: {},
				grupoProduto:{},
				recEntregaItem:{},
				selectionrecEntregaItem: null,
				campoEntradaRe: null,
				qtBaixaCredito: null,
				labelQtBaixaCredito:'Qt.p/Baixa Crédito',
				labelPesoLiqSemDescDpi:'Base Cálculo DPI',
				toolbarItems: [
					{
						label: 'Save',
						icon: 'pi pi-check'
					},
					{
						label: 'Update',
						icon: 'pi pi-upload'
					},
					{
						label: 'Delete',
						icon: 'pi pi-trash'
					},
					{
						label: 'Home Page',
						icon: 'pi pi-home'
					},
				],
				cardMenu:  [
					{ label: 'Save', icon: 'pi pi-fw pi-check' },
					{ label: 'Update', icon: 'pi pi-fw pi-refresh' },
					{ label: 'Delete', icon: 'pi pi-fw pi-trash' },
				],
				descricaoSituacao:null,
			}
		},
		methods: {

			buscarDadosFormulario(){
				RomaneioEntregaService.getRomaneioId(this.id)
					.then(({ data }) => {
						if(data) {
							this.carregarFormulario(data);
							this.verificaAbaUBS();
							this.carregarEstabelecimento(data.codEstabel);
							this.carregarGrupoProduto(data.fmCodigo);
							this.carregarNomeProdutor(data.codEmitente);
							this.carregarSituacao(data.codSit);
						}
					})
					.catch(error => {
						this.romaneio = {};
					});
			},

			carregarSituacao(codigo){
				SituacaoReService.getSituacaoPorCodigo(codigo)
					.then(({data})=>{
						if(data){
							this.descricaoSituacao = data.descricao;
						}
						else{
							this.descricaoSituacao = codigo;	
						}
					})
					.catch(error => {
						this.descricaoSituacao = codigo;
					})
			},

			voltar(){
				this.$router.push(`/romaneio-entrega`);
			},

			//Controle a exibição da aba UBS
			verificaAbaUBS(){
							
				this.ocultarUBS = true;

				if(this.romaneio == undefined || this.romaneio == null || this.romaneio.fmCodigo == null){
					return;
				}

				GrupoProdutoService.buscarPorCodigo(this.romaneio.fmCodigo)
					.then(({data})=>{
						if(data){
							
							this.grupoProduto = data;
							
							//Somente irá habilitar a aba UBS quando o grupo do produto tiver selecionado Semente
							if(this.grupoProduto.semente){
								this.ocultarUBS= false;
							}
						}
					})
					.catch(error => {
						this.ocultarUBS = true;
					})
			},

			carregarFormulario(data) {
                this.romaneio = Object.assign({}, data);
				
				if(this.romaneio.dtEntrada !== undefined && this.romaneio.dtEntrada !== null)
					this.romaneio.dtEntrada = Formatacao.formatDateCustom(this.romaneio.dtEntrada, 'DD/MM/YYYY');
				
				if(this.romaneio.dtEmissao !== undefined && this.romaneio.dtEmissao !== null)
					this.romaneio.dtEmissao = Formatacao.formatDateCustom(this.romaneio.dtEmissao, 'DD/MM/YYYY');

				if(this.romaneio.ubsDataRequisicao !== undefined && this.romaneio.ubsDataRequisicao !== null)
					this.romaneio.ubsDataRequisicao = Formatacao.formatDateCustom(this.romaneio.ubsDataRequisicao, 'DD/MM/YYYY');

				if(this.romaneio.pjDtEmissao !== undefined && this.romaneio.pjDtEmissao !== null)
					this.romaneio.pjDtEmissao = Formatacao.formatDateCustom(this.romaneio.pjDtEmissao, 'DD/MM/YYYY');

				if(this.romaneio.dtNfProd !== undefined && this.romaneio.dtNfProd !== null)
					this.romaneio.dtNfProd = Formatacao.formatDateCustom(this.romaneio.dtNfProd, 'DD/MM/YYYY');

				if(this.romaneio.dataIntegracao !== undefined && this.romaneio.dataIntegracao !== null)
				 	this.romaneio.dataIntegracao = Formatacao.formatDateCustom(this.romaneio.dataIntegracao, 'DD/MM/YY HH:mm:SS');
				
				if(this.romaneio.pesoBruto !== undefined && this.romaneio.pesoBruto !== null)
					this.romaneio.pesoBruto = Formatacao.formatDecimal(this.romaneio.pesoBruto, 0, 0);

				if(this.romaneio.taraVeiculo !== undefined && this.romaneio.taraVeiculo !== null)
					this.romaneio.taraVeiculo = Formatacao.formatDecimal(this.romaneio.taraVeiculo, 0, 0);

				if(this.romaneio.taraSacaria !== undefined && this.romaneio.taraSacaria !== null)
					this.romaneio.taraSacaria = Formatacao.formatDecimal(this.romaneio.taraSacaria, 0, 0);

				if(this.romaneio.pesoLiquido !== undefined && this.romaneio.pesoLiquido !== null)
					this.romaneio.pesoLiquido = Formatacao.formatDecimal(this.romaneio.pesoLiquido, 0, 0);
				
				if(this.romaneio.pesoLiqSemDescDpi !== undefined && this.romaneio.pesoLiqSemDescDpi !== null)
					this.romaneio.pesoLiqSemDescDpi = Formatacao.formatDecimal(this.romaneio.pesoLiqSemDescDpi, 0, 0);

				if(this.romaneio.pjVlTotNota !== undefined && this.romaneio.pjVlTotNota !== null)
					this.romaneio.pjVlTotNota = Formatacao.formatDecimal(this.romaneio.pjVlTotNota, 2, 9);
				
				if(this.romaneio.itemRecEntrega !== undefined && this.romaneio.itemRecEntrega !== null){
					let primeiroElemento = this.romaneio.itemRecEntrega[0];

					if(primeiroElemento !== undefined && primeiroElemento !== null){
						this.rendaSemDescDpi = primeiroElemento.rendaSemDescDpi;
					}
				}

				switch(this.romaneio.entradaRr){
					case 'DES':
    					this.campoEntradaRe = "Desmembramento";
    					break;

					case 'TRA':
    					this.campoEntradaRe = "Transferência";
    					break;

					case 'DFX':
    					this.campoEntradaRe = "Devolução Fixação";
    					break;

					case 'ORI':
    					this.campoEntradaRe = "Normal";
    					break;
				};


				if(this.romaneio.tipoGmo === "Intacta" || this.romaneio.tipoGmo === "Patenteada"){

					if(this.romaneio.logReDpi){
						this.labelQtBaixaCredito = "Qt.p/Baixa Crédito";
						this.labelPesoLiqSemDescDpi = "Base Cálculo DPI";

					}else{
						this.labelQtBaixaCredito = "Renda SEM Desc.DPI";
						this.labelPesoLiqSemDescDpi = "Peso Líq.SEM DESC.DPI";
					}

				}
			},

			toggle(event) {
				this.$refs.menu.toggle(event);
			},

			carregarEstabelecimento(codEstabel){
				
				EstabelecimentoService.getEstabelecimentosPorCodigo(codEstabel)
					.then(({data})=>{
						if(data){
							this.nomeEstabelecimento = data.nomeFantasia;
						}
					})
					.catch(error => {
						this.nomeEstabelecimento = null;
					})
			},

			carregarGrupoProduto(fmCodigo){
				GrupoProdutoService.buscarPorCodigo(fmCodigo)
					.then(({data})=>{
						if(data){
							this.nomeGrupoProduto = data.descricao;
						}
					})
					.catch(error => {
						this.nomeGrupoProduto = null;
					})
			},

			carregarNomeProdutor(codigoProdutor){
				ProdutorService.buscarPorCodigoProdutor(codigoProdutor)
					.then(({data})=>{
						if(data){
							this.nomeProdutor = data.nome;
						}
					})
					.catch(error => {
						this.nomeProdutor = null;
					})
			},

			formatDecimal(value, minimumFractionDigits = 2, maximumFractionDigits = 2) {
                return Formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
            },

			formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },
		},

		created() {

			this.buscarDadosFormulario();
		}
	}
</script>

<style scoped lang="scss">
	p {
		line-height: 1.25;
		margin: 0;
	}

	::v-deep(.p-card .p-card-title) {
		display: -ms-flexbox;
		display: flex;
		-ms-flex-align: center;
		align-items: center;
		-ms-flex-pack: justify;
		justify-content: space-between;
		margin-bottom: 0;
	}

	::v-deep(button) {
		margin-right: .25em;
		margin-left: .25em;
	}
	::v-deep(.p-splitbutton button) {
		margin-right: 0;
		margin-left: 0;
	}
    @media screen and (max-width: 960px) {
        .panel-demo {
			.toolbar-demo.card {
				overflow: auto;
			}
        }
    }
</style>

