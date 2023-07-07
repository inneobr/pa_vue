<template>

    <div class="card mb-3">
        <div class="flex justify-content-between">
            <div class="flex align-items-center">
                <i class="pi pi-chart-line mr-1" style="font-size: 1.4rem"></i>
                <h4 style="margin:0px 5px;">Dashboard - Entrada de Produção</h4>
            </div>
        </div>

        <div class="grid p-fluid formgrid mt-5">

            <div class="col-12 sm:col-6 md:col-6 lg:col-4 xl:col-3">
                <div class="field mt-1">
                    <label for="regional">Regional</label>
                    <MultiSelect v-model="regionaisSelecionadas" :options="regionais" optionLabel="codigo" placeholder="Selecione as regionais" :filter="true" class="multiselect-custom">
                        <template #value="slotProps">
                            <div class="multi-select-item multi-select-item-value" v-for="option of slotProps.value" :key="option.codigo">
                                <div><i class="pi pi-home"></i> {{option.codigo}}</div>
                            </div>
                            <template v-if="!slotProps.value || slotProps.value.length === 0">
                                <div class="multi-select-placeholder">
                                    Selecione as regionais
                                </div>
                            </template>
                        </template>
                        <template #option="slotProps">
                            <div class="multi-select-item">
                                <div>{{slotProps.option.codNome}}</div>
                            </div>
                        </template>
                    </MultiSelect>
                </div>
            </div>

            <div class="col-12 sm:col-6 md:col-6 lg:col-4 xl:col-3">
                <div class="field mt-1">
                    <label for="estabelecimento">Estabelecimento</label>
                    <MultiSelect v-model="estabelecimentosSelecionados" :options="estabelecimentos" optionLabel="codigo" placeholder="Selecione os estabelecimentos" :filter="true" class="multiselect-custom">
                        <template #value="slotProps">
                            <div class="multi-select-item multi-select-item-value" v-for="option of slotProps.value" :key="option.codigo">
                                <div><i class="pi pi-home"></i> {{option.codigo}}</div>
                            </div>
                            <template v-if="!slotProps.value || slotProps.value.length === 0">
                                <div class="multi-select-placeholder">
                                    Selecione os estabelecimentos
                                </div>
                            </template>
                        </template>
                        <template #option="slotProps">
                            <div class="multi-select-item">
                                <div>{{slotProps.option.codNome}}</div>
                            </div>
                        </template>
                    </MultiSelect>
                </div>
            </div>


            <div class="col-12 sm:col-6 md:col-6 lg:col-4 xl:col-2">
                <div class="field">
                    <label for="cultura">Cultura</label>
                    <AutoComplete
                        class="w-full mt-2"
                        id="cultura"
                        placeholder="MILHO"
                        field="label"
                        :dropdown="true"
                    ></AutoComplete>
                </div>
            </div>


            <div class="col-12 sm:col-6 md:col-6 lg:col-4 xl:col-2">
                <div class="field">
                    <label for="safra">Safra</label>
                    <AutoComplete
                        class="w-full mt-2"
                        id="safra"
                        placeholder="2022/2023"
                        field="label"
                        :dropdown="true"
                    ></AutoComplete>
                </div>
            </div>

            
            <div class="col-12 sm:col-6 md:col-6 lg:col-4 xl:col-1">
                <div class="field">
                    <Button
                        icon="pi pi-search"
                        label="Filtrar"
                        class="p-button mt-5"
                    ></Button>
                </div>
            </div>    
            <div class="col-12 sm:col-6 md:col-6 lg:col-4 xl:col-1">
                <div class="field">
                    <Button 
                        type="button" 
                        title="Limpar filtro" 
                        class="p-button-outlined mt-5"
                        icon="pi pi-filter-slash" >
                    </Button>
                </div>

            </div>
        </div>



    </div>

    <div class="grid dashboard">

        <div class="col-12 md:col-4">
            <div class="card widget-social">
                <div class="flex justify-content-between align-items-center p-3">
                    <div class="social-icon">
                        <i class="pi pi-desktop fs-xxlarge" style="color: #0288D1;"></i>
                    </div>
                    <div class="info flex flex-column">
                        <span class="value">100</span>
                        <span class="subtext mt-2">Romaneios</span>
                    </div>
                </div>
    
                <div class="stats flex justify-content-between mt-3">
                    <div class="left flex flex-column ">
                        <span class="title">Entrada com ticket</span>
                        <span class="value mb-2">95</span>
                        <ProgressBar :value="95" :showValue="false"></ProgressBar>
                    </div>
                    <div class="right flex flex-column">
                        <span class="title">Entrada sem ticket</span>
                        <span class="value mb-2">05</span>
                        <ProgressBar :value="5" :showValue="false"></ProgressBar>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 md:col-4">
            <div class="card widget-social">
                <div class="flex justify-content-between align-items-center p-3">
                    <div class="social-icon">
                        <i class="pi pi-check-square fs-xxlarge" style="color: #0288D1;"></i>
                    </div>
                    <div class="info flex flex-column">
                        <span class="value">350.990 kg</span>
                        <span class="subtext mt-2">Peso Líquido</span>
                    </div>
                </div>
    
                <div class="stats flex justify-content-between mt-3">
                    <div class="left flex flex-column ">
                        <span class="title">Total em toneladas</span>
                        <span class="value mb-2">350,99</span>
                        <ProgressBar :value="100" :showValue="false"></ProgressBar>
                    </div>
                    <div class="right flex flex-column">
                        <span class="title">Total em Sacas</span>
                        <span class="value mb-2">5.849,83</span>
                        <ProgressBar :value="100" :showValue="false"></ProgressBar>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="col-12 md:col-4">
            <div class="card widget-social">
                <div class="flex justify-content-between align-items-center p-3">
                    <div class="social-icon">
                        <i class="pi pi-check-circle fs-xxlarge" style="color: #0288D1;"></i>
                    </div>
                    <div class="info flex flex-column">
                        <span class="value">250.995 kg</span>
                        <span class="subtext mt-2">Renda Líquida</span>
                    </div>
                </div>
    
                <div class="stats flex justify-content-between mt-3">
                    <div class="left flex flex-column ">
                        <span class="title">Total em Toneladas</span>
                        <span class="value mb-2">255,99</span>
                        <ProgressBar :value="100" :showValue="false"></ProgressBar>
                    </div>
                    <div class="right flex flex-column">
                        <span class="title">Total em Sacas</span>
                        <span class="value mb-2">4.183,25</span>
                        <ProgressBar :value="100" :showValue="false"></ProgressBar>
                    </div>
                </div>
            </div>
        </div>


        <div class="col-12">
            <div class="card widget-insights height-100">
                <div class="card-header mb-2">
                    <h5>Renda Líquida por Estabelecimento</h5>
                    <div>
                        <Button label="Pizza / Doughnut" class="p-button-text" @click="togglePieDoughnut()"></Button>
                        <Button label="Semi/Full Data" class="p-button-text mx-2" @click="changePieDoughnutDataView()"></Button>
                    </div>
                </div>
                <div class="card-subheader mb-2 flex align-items-center">
                    <span><strong>Safra:</strong> 2022/2023 - MILHO</span>
                </div>

                <div class="flex grid">
                    <div class="col-12 md:col-6 left flex flex-column justify-content-evenly">
                        <DataTable 
                            v-model:selection="estabRendaliquida"
                            selectionMode="single"
                            scrollDirection="both"
                            responsiveLayout="stack"
                            showGridlines
                            scrollable
                            scrollHeight="300px"
                            style="width: 100%; min-height: 400px;"
                            :value="rendaLiquidaPorEstabelecimentoData">

                            <template #header>
                                Total Renda Líquida
                            </template>

                            <template #empty>
                                Nenhum registro encontrado.
                            </template>

                            <template #loading>
                                Carregando... Por favor, aguarde.
                            </template>

                            <Column field="codigo" header="Código" class="pt-3 pb-3" style="width:15%; font-weight: 800;" sortable/>
                            <Column field="nomeFantasia" header="Nome" style="width: 40%;"/>
                            <Column field="totalKg" header="Quilos" style="width:15%;" sortable>
                                <template #body="{ data }">
                                    {{ formatDecimal(data.totalKg, 0, 0) }} kg
                                </template>
                            </Column>
                            <Column field="totalTon" header="Toneladas" style="width:15%;" sortable>
                                <template #body="{ data }">
                                    {{ formatDecimal(data.totalTon, 2, 2) }} ton
                                </template>
                            </Column>
                            <Column field="totalSc" header="Sacas" style="width:15%;" sortable>
                                <template #body="{ data }">
                                    {{ formatDecimal(data.totalSc, 2, 2) }} sc
                                </template>
                            </Column>
                        </DataTable>
                    </div>

                    <div class="col-12 md:col-6 right flex justify-content-center">
                        <Chart ref="pie" type="pie" :data="pieData" :options="chartOptions" class="w-full md:w-30rem"></Chart>
                    </div>

                </div>
                
            </div>
        </div>

        
        <div class="col-12">
            <div class="card height-100">
                <div class="card-header">
                    <h5>Renda Líquida</h5>
                    <!--<Button label="Vertical/Stacked Data" class="p-button-text" :class="{'ml-auto': !isRTL, 'mr-auto': isRTL}" @click="changeMonthlyDataView()"></Button>-->
                </div>
    
                <Chart ref="monthly" type="bar" :data="chartRendaLiquidaPorSafraData" :options="chartRendaLiquidaPorSafraOptions" responsive="true" :height="400"></Chart>
            </div>
        </div>
    
            
        
    </div>
    
    </template>
    
    <script>

    import Formatacao from '../../utilities/Formatacao';
    
    export default {
        data() {
            return {
                regionaisSelecionadas: [
                    {codigo: "002", codNome:"002-RG ARAPONGAS"}
                ],
                regionais:[
                    {codigo: "002", codNome:"002-RG ARAPONGAS"},
                    {codigo: "004", codNome:"004-ASSAÍ"},
                    {codigo: "007", codNome:"007-ASTORGA"},
                    {codigo: "009", codNome:"009-BANDEIRANTES"},
                    {codigo: "016", codNome:"016-GOIOERÊ"},
                    {codigo: "018", codNome:"018-GUAÍRA"},
                    {codigo: "028", codNome:"028-RG UBIRATÃ"}
                ],
                estabelecimentosSelecionados: null,
                estabelecimentos:[
                    {codigo: "002", codNome:"002-RG ARAPONGAS", codRegional: "002"},
                    {codigo: "004", codNome:"004-ASSAÍ", codRegional: "004"},
                    {codigo: "007", codNome:"007-ASTORGA", codRegional: "007"},
                    {codigo: "009", codNome:"009-BANDEIRANTES", codRegional: "009"},
                    {codigo: "016", codNome:"016-GOIOERÊ", codRegional: "016"},
                    {codigo: "028", codNome:"028-RG UBIRATÃ", codRegional: "028"}
                ],
                pieData: null,
                estabRendaliquida: {},
                rendaLiquidaPorEstabelecimentoData: null,
                chartRendaLiquidaPorSafraData: null,
                chartRendaLiquidaPorSafraOptions: null,
                chartOptions: null
            }
        },
        created() {

        },
        mounted() {
            this.rendaLiquidaPorEstabelecimentoData = this.getRendaLiquidaPorEstabelecimento().data;
            this.refreshChart();
        },
        watch: {
            '$appState.isNewThemeLoaded'(isLoaded) {
                if (isLoaded) {
                    this.refreshChart();
                    this.$appState.isNewThemeLoaded = false;
                }
            }
        },
        methods: {
                      
            changeMonthlyDataView() {
                if (this.$refs.monthly.chart.config.options.scales.x.stacked) {
                    this.$refs.monthly.chart.config.options.scales.x.stacked = false;
                    this.$refs.monthly.chart.config.options.scales.y.stacked = false;
                }
                else {
                    this.$refs.monthly.chart.config.options.scales.x.stacked = true;
                    this.$refs.monthly.chart.config.options.scales.y.stacked = true;
                }
    
                this.$refs.monthly.chart.update();
            },
            refreshChart() {
                this.pieData = this.getPieData();
                this.chartOptions = this.getChartOptions();
                this.chartRendaLiquidaPorSafraData = this.getRendaLiquidaPorSafra();
                this.chartRendaLiquidaPorSafraOptions = this.getRendaLiquidaPorSafraChartOptions();
            },
            getRendaLiquidaPorEstabelecimento(){
                return {
                    data: [
                        {codigo:'028', nomeFantasia: 'RG UBIRATÃ',      totalKg: 26000, totalTon: 26,   totalSc: 433.33},
                        {codigo:'029', nomeFantasia: 'UR VILA YOLANDA', totalKg: 27000, totalTon: 27,   totalSc: 450},
                        {codigo:'069', nomeFantasia: 'UR UBIRATÃ II',   totalKg: 27500, totalTon: 27.5, totalSc: 458.33},
                        {codigo:'081', nomeFantasia: 'UR RIO VERDE',    totalKg: 49500, totalTon: 49.5, totalSc: 825}
                    ]
                }
            },
            getRendaLiquidaPorSafra() {
                const { limeColor, amberColor, orangeColor, blueColor, lightblueColor,
                    cyanColor, tealColor, greenColor, lightgreenColor } = this.getColors();
    
                return {
                    labels: ['UR UBITATÃ', 'UR VILA YOLANDA', 'UR UBITARÃ II', 'UR RIO VERDE'],
                    datasets: [
                        {
                            label: '2023',
                            data: [26000, 27000, 27500, 49500],
                            borderColor: greenColor,
                            backgroundColor: greenColor,
                            borderWidth: 2,
                            fill: true
                        }
                    ]
                };
            },
            getChartOptions(){
                return { 
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: false
                            }
                        }
                    }
                }
            },
            getRendaLiquidaPorSafraChartOptions() {
                const textColor = getComputedStyle(document.body).getPropertyValue('--text-color') || 'rgba(0, 0, 0, 0.87)';
                const gridLinesColor = getComputedStyle(document.body).getPropertyValue('--divider-color') || 'rgba(160, 167, 181, .3)';
                const fontFamily = getComputedStyle(document.body).getPropertyValue('--font-family');
                return {
                    plugins: {
                        legend: {
                            display: false,
                            labels: {
                                font: {
                                    family: fontFamily
                                },
                                color: textColor
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'x'
                    },
                    scales: {
                        y: {
                            ticks: {
                                font: {
                                    family: fontFamily
                                },
                                color: textColor
                            },
                            grid: {
                                color: gridLinesColor
                            }
                        },
                        x: {
                            categoryPercentage: .9,
                            barPercentage: .8,
                            ticks: {
                                font: {
                                    family: fontFamily
                                },
                                color: textColor
                            },
                            grid: {
                                color: gridLinesColor
                            }
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            },
            togglePieDoughnut() {
                this.$refs.pie.chart.config.options.cutout = this.$refs.pie.chart.config.options.cutout ? 0 : 50;
                this.$refs.pie.chart.update();
            },
            changePieDoughnutDataView() {
                if (this.$refs.pie.chart.config.options.circumference === 180) {
                    this.$refs.pie.chart.config.options.circumference = 360;
                    this.$refs.pie.chart.config.options.rotation = 0;
                } else {
                    this.$refs.pie.chart.config.options.circumference = 180;
                    this.$refs.pie.chart.config.options.rotation = -1 * 90;
                }

                this.$refs.pie.chart.update();
            },
            getPieData() {
                const { limeColor, blueColor } = this.getColors();
                const borderColor = getComputedStyle(document.body).getPropertyValue('--divider-color') || 'rgba(160, 167, 181, .3)';
                return {
                    labels: ['UR UBITATÃ', 'UR VILA YOLANDA', 'UR UBITARÃ II', 'UR RIO VERDE'],
                    datasets: [
                        {
                            data: [26000, 27000, 27500, 49500],
                            backgroundColor: [
                                blueColor,
                                limeColor
                            ],
                            borderColor
                        }
                    ]
                }
            },
            getColors() {
                const isLight = this.$appState.layoutMode === 'light';
                return {
                    pinkColor: isLight ? '#EC407A' : '#F48FB1',
                    purpleColor: isLight ? '#AB47BC' : '#CE93D8',
                    deeppurpleColor: isLight ? '#7E57C2' : '#B39DDB',
                    indigoColor: isLight ? '#5C6BC0' : '#9FA8DA',
                    blueColor: isLight ? '#42A5F5' : '#90CAF9',
                    lightblueColor: isLight ? '#29B6F6' : '#81D4FA',
                    cyanColor: isLight ? '#00ACC1' : '#4DD0E1',
                    tealColor: isLight ? '#26A69A' : '#80CBC4',
                    greenColor: isLight ? '#66BB6A' : '#A5D6A7',
                    lightgreenColor: isLight ? '#9CCC65' : '#C5E1A5',
                    limeColor: isLight ? '#D4E157' : '#E6EE9C',
                    yellowColor: isLight ? 'FFEE58' : '#FFF59D',
                    amberColor: isLight ? '#FFCA28' : '#FFE082',
                    orangeColor: isLight ? '#FFA726' : '#FFCC80',
                    deeporangeColor: isLight ? '#FF7043' : '#FFAB91',
                    brownColor: isLight ? '#8D6E63' : '#BCAAA4'
                }
            },

            formatDate(data, format) {
                return Formatacao.formatDateCustom(data, format);
            },

            formatDecimal(value, minimumFractionDigits = 2, maximumFractionDigits = 2) {
                return Formatacao.formatDecimal(value, minimumFractionDigits, maximumFractionDigits);
            }
        },
        computed: {
            isRTL() {
                return this.$appState.RTL;
            }
        }
    }
    </script>
    
    <style scoped lang="scss">
        ::v-deep(.p-multiselect) {
            min-width: 15rem;
        }
        ::v-deep(.multiselect-custom-virtual-scroll .p-multiselect) {
            min-width: 20rem;
        }
        ::v-deep(.multiselect-custom .p-multiselect-label) {
            padding-top: .25rem;
            padding-bottom: .25rem;
        }
        ::v-deep(.multiselect-custom .multi-select-item.multi-select-item-value) {
            padding: .25rem .5rem;
            border-radius: 3px;
            display: inline-flex;
            margin-right: .5rem;
            background-color: var(--primary-color);
            color: var(--primary-color-text);
        }
        ::v-deep(.multiselect-custom .multi-select-item.multi-select-item-value img.flag) {
            width: 17px;
        }
        .multi-select-item {
            display: flex;
            align-items: center;
        }
        .multi-select-item img.flag {
            width: 18px;
            margin-right: .5rem;
        }
        ::v-deep(.multiselect-custom .multi-select-placeholder) {
            padding: 0.25rem;
        }
        ::v-deep(.p-chips .p-chips-token) {
            background-color: var(--primary-color);
            color: var(--primary-color-text);
        }
        ::v-deep(.p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-token) {
            margin: 0.1rem 0.5rem 0.1rem 0;
        }
    </style>
    