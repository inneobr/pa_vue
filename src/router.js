import {createRouter, createWebHashHistory} from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'dashboard',
        exact: true,
        component: () => import('./components/Dashboard.vue'),
        meta: {
            breadcrumb: [{ label: 'Dashboard' }],
        },
    },
    {
        path: '/favorites/dashboardanalytics',
        name: 'dashboardanalytics',
        exact: true,
        component: () => import('./components/demo/DashboardAnalytics.vue'),
        meta: {
            breadcrumb: [{ label: 'Dashboard Analytics' }],
        },
    },
    {
        path: '/formlayout',
        name: 'formlayout',
        component: () => import('./components/demo/FormLayoutDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'Form Layout' }],
        },
    },
    {
        path: '/invalidstate',
        name: 'invalidstate',
        component: () => import('./components/demo/InvalidStateDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'Invalid State' }],
        },
    },
    {
        path: '/input',
        name: 'input',
        component: () => import('./components/demo/InputDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'Input' }],
        },
    },
    {
        path: '/floatlabel',
        name: 'floatlabel',
        component: () => import('./components/demo/FloatLabelDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'Float Label' }],
        },
    },
    {
        path: '/button',
        name: 'button',
        component: () => import('./components/demo/ButtonDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'Button' }],
        },
    },
    {
        path: '/table',
        name: 'table',
        component: () => import('./components/demo/TableDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'Table' }],
        },
    },
    {
        path: '/list',
        name: 'list',
        component: () => import('./components/demo/ListDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'List' }],
        },
    },
    {
        path: '/timeline',
        name: 'timeline',
        component: () => import('./pages/demo/TimelineDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'Pages', label: 'Timeline' }],
        },
    },
    {
        path: '/tree',
        name: 'tree',
        component: () => import('./components/demo/TreeDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'Tree' }],
        },
    },
    {
        path: '/panel',
        name: 'panel',
        component: () => import('./components/demo/PanelsDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'Panel' }],
        },
    },
    {
        path: '/overlay',
        name: 'overlay',
        component: () => import('./components/demo/OverlaysDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'Overlay' }],
        },
    },
    {
        path: '/media',
        name: 'media',
        component: () => import('./components/demo/MediaDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'Media' }],
        },
    },    
    {
        path: '/messages',
        name: 'messages',
        component: () => import('./components/demo/MessagesDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'Messages' }],
        },
    },
    {
        path: '/file',
        name: 'file',
        component: () => import('./components/demo/FileDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'File' }],
        },
    },
    {
        path: '/chart',
        name: 'chart',
        component: () => import('./components/demo/ChartsDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'Charts' }],
        },
    },
    {
        path: '/misc',
        name: 'misc',
        component: () => import('./components/demo/MiscDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'UI Kit', label: 'Misc' }],
        },
    },
    {
        path: '/icons',
        name: 'icons',
        component: () => import('./utilities/Icons.vue'),
        meta: {
            breadcrumb: [{ parent: 'Utilities', label: 'Icons' }],
        },
    },
    {
        path: '/widgets',
        name: 'widgets',
        component: () => import('./utilities/Widgets.vue'),
        meta: {
            breadcrumb: [{ parent: 'Utilities', label: 'Widgets' }],
        },
    },
    {
        path: '/grid',
        name: 'grid',
        component: () => import('./utilities/GridDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'Utilities', label: 'Grid System' }],
        },
    },
    {
        path: '/spacing',
        name: 'spacing',
        component: () => import('./utilities/SpacingDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'Utilities', label: 'Spacing' }],
        },
    },
    {
        path: '/elevation',
        name: 'elevation',
        component: () => import('./utilities/ElevationDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'Utilities', label: 'Elevation' }],
        },
    },
    {
        path: '/typography',
        name: 'typography',
        component: () => import('./utilities/Typography.vue'),
        meta: {
            breadcrumb: [{ parent: 'Utilities', label: 'Typography' }],
        },
    },
    {
        path: '/display',
        name: 'display',
        component: () => import('./utilities/DisplayDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'Utilities', label: 'Display' }],
        },
    },
    {
        path: '/flexbox',
        name: 'flexbox',
        component: () => import('./utilities/FlexBoxDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'Utilities', label: 'Flexbox' }],
        },
    },
    {
        path: '/text',
        name: 'text',
        component: () => import('./utilities/TextDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'Utilities', label: 'Text' }],
        },
    },
    {
        path: '/crud',
        name: 'crud',
        component: () => import('./pages/demo/CrudDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'Pages', label: 'Crud' }],
        },
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: () => import('./pages/demo/CalendarDemo.vue'),
        meta: {
            breadcrumb: [{ parent: 'Pages', label: 'Calendar' }],
        },
    },
    {
        path: '/invoice',
        name: 'invoice',
        component: () => import('./pages/demo/Invoice.vue'),
        meta: {
            breadcrumb: [{ parent: 'Pages', label: 'Invoice' }],
        },
    },
    {
        path: '/help',
        name: 'help',
        component: () => import('./pages/demo/Help.vue'),
        meta: {
            breadcrumb: [{ parent: 'Pages', label: 'Help' }],
        },
    },
    {
        path: '/empty',
        name: 'empty',
        component: () => import('./components/EmptyPage.vue'),
        meta: {
            breadcrumb: [{ parent: 'Pages', label: 'Empty Page' }],
        },
    },
    {
        path: '/documentation',
        name: 'documentation',
        component: () => import('./components/demo/Documentation.vue'),
        meta: {
            breadcrumb: [{ parent: 'Pages', label: 'Documentation' }],
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./pages/Login.vue')
    },
    {
        path: '/error',
        name: 'error',
        component: () => import('./pages/demo/Error.vue')
    },
    {
        path: '/notfound',
        name: 'notfound',
        component: () => import('./pages/demo/NotFound.vue')
    },
    {
        path: '/access',
        name: 'access',
        component: () => import('./pages/demo/Access.vue')
    },
    {
        path: '/landing',
        name: 'landing',
        component: () => import('./pages/demo/Landing.vue')
    },
    {
        path: '/contactus',
        name: 'contactus',
        component: () => import('./pages/demo/ContactUs.vue')
    },
    {
        path: '/blocks',
        name: 'blocks',
        component: () => import('./components/demo/BlocksDemo.vue')
    },
    {
        path: '/recuperar-senha/:token',
        name: 'recuperar-senha',
        component: () => import('./pages/RecuperarSenha.vue')
    },


    /* FIM COMPONENTES DO TEMPLATE */

	/* MENUS DA INTEGRADA */

    /* ESTABELECIMENTO */
    {
        path: '/estabelecimentos',
        name: 'estabeleicmentos',
        meta: {
            breadcrumb: [{parent:'Painel de Controle', label:'Estabelecimentos'}]
        },
        component: () => import('./pages/cadastro/Estabelecimento.vue')
    },
    {
        path: '/estabelecimento/editar/:estabelecimentoId',
        name: 'editarEstabeleicmento',
        meta: {
            breadcrumb: [{parent:'Painel de Controle', label:'Editar estabelecimento'}]
        },
        component: () => import('./pages/cadastro/Estabelecimento.vue')
    },
    {
        path: '/estabelecimento/cadastrar',
        name: 'cadastrarEstabeleicmento',
        meta: {
            breadcrumb: [{parent:'Painel de Controle', label:'Cadastrar estabelecimento'}]
        },
        component: () => import('./pages/cadastro/Estabelecimento.vue')
    },

    /* USUARIO */
    {
        path: '/usuarios',
        name: 'usuarios',
        meta: {
            breadcrumb: [{parent:'Painel Controle', label:'Usuários'}]
        },
        component: () => import('./pages/admin/Usuario.vue')
    },
    {
        path: '/usuario/editar/:username',
        name: 'editarUsuario',
        meta: {
            breadcrumb: [{parent:'Painel Controle', label:'Editar usuário'}]
        },
        component: () => import('./pages/admin/Usuario.vue')
    },
    {
        path: '/usuario/cadastrar',
        name: 'cadastrarUsuario',
        meta: {
            breadcrumb: [{parent:'Painel Controle', label:'Cadastrar usuário'}]
        },
        component: () => import('./pages/admin/Usuario.vue')
    },

    /* PERFIL */
    {
        path: '/perfis',
        name: 'perfis',
        meta: {
            breadcrumb: [{parent:'Painel Controle', label:'Perfil de Usuário'}]
        },
        component: () => import('./pages/admin/Perfil.vue')
    },
    {
        path: '/perfil/cadastrar',
        name: 'cadastrarPerfil',
        meta: {
            breadcrumb: [{parent:'Painel Controle', label:'Cadastrar Perfil'}]
        },
        component: () => import('./pages/admin/Perfil.vue')
    },
    {
        path: '/perfil/editar/:perfilId',
        name: 'editarPerfil',
        meta: {
            breadcrumb: [{parent:'Painel Controle', label:'Editar Perfil'}]
        },
        component: () => import('./pages/admin/Perfil.vue')
    },

    /* MENU */
    {
        path: '/menus',
        name: 'menus',
        meta: {
            breadcrumb: [{parent:'Consulta', label:'Menus'}]
        },
        component: () => import('./pages/admin/Menu.vue')
    },
    {
        path: '/menu/cadastrar',
        name: 'cadastrarMenu',
        meta: {
            breadcrumb: [{parent:'Consulta', label:'Cadastrar menu'}]
        },
        component: () => import('./pages/admin/Menu.vue')
    },
    {
        path: '/menu/editar/:menuId',
        name: 'editarMenu',
        meta: {
            breadcrumb: [{parent:'Consulta', label:'Editar menu'}]
        },
        component: () => import('./pages/admin/Menu.vue')
    },
    {
        path: '/menu/:menuId/cadastrar-item',
        name: 'cadastrarMenuItem',
        meta: {
            breadcrumb: [{parent:'Consulta', label:'Cadastrar menu item'}]
        },
        component: () => import('./pages/admin/Menu.vue')
    },
    {
        path: '/menu/:menuId/editar-item/:menuItemId',
        name: 'editarMenuItem',
        meta: {
            breadcrumb: [{parent:'Consulta', label:'Editar menu item'}]
        },
        component: () => import('./pages/admin/Menu.vue')
    },

	/* CONSULTAS */
	{
		path: '/ticket-pesagem',
		name: 'ticketPesagem',
		meta: {
			breadcrumb: [{parent:'Consultas', label:'Ticket de pesagem'}]
		},
		component: () => import('./pages/consulta/TicketPesagem.vue')
	},{
		path: '/romaneio-entrega',
		name: 'romaneioEntrega',
		meta: {
			breadcrumb: [{parent:'Consultas', label:'Romaneio de Entrega'}]
		},
		component: () => import('./pages/consulta/RomaneioEntrega.vue')
	},{
		path: '/romaneio-entrega/consultar/:id',
		name: 'romaneioEntregaConsulta',
		meta: {
			breadcrumb: [{parent:'Consultas', label:'Romaneio de Entrega'}]
		},
		component: () => import('./pages/consulta/RomaneioEntrega.vue')
	},
    {
		path: '/monitor-entrada-producao',
		name: 'monitorProducao',
		meta: {
			breadcrumb: [{parent:'Consultas', label:'Monitor de entrada'}]
		},
		component: () => import('./pages/consulta/MonitorEntrada.vue')
	},
    {
        path: '/dashboard-producao',
        name: 'dashboardProducao',
        exact: true,
        component: () => import('./pages/consulta/DashboardProducao.vue'),
        meta: {
            breadcrumb: [{ label: 'Dashboard Produção' }],
        },
    },


    /* ATIVIDADES */
	{
		path: '/entrega-producao',
		name: 'entregaProducao',
		meta: {
			breadcrumb: [{parent:'Atividades', label:'Entrega de produção'}]
		},
		component: () => import('./pages/atividade/EntregaProducao.vue')
	},
    {
		path: '/campo-semente',
		name: 'campoSemente',
		meta: {
			breadcrumb: [{parent:'Atividades', label:'Campo de semente'}]
		},
		component: () => import('./pages/atividade/CampoSemente.vue')
	},
    {
		path: '/laudo-inspecao-campo',
		name: 'laudoInspecaoCampo',
		meta: {
			breadcrumb: [{parent:'Atividades', label:'Laudo de inspeção de campo'}]
		},
		component: () => import('./pages/atividade/LaudoInspecaoCampo.vue')
	},


    /* CADASTROS */
	{
		path: '/referencia-produto',
		name: 'referenciaProduto',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Referência de produtos'}]
		},
		component: () => import('./pages/cadastro/ReferenciaProduto.vue')
	},
    {
		path: '/tabela-preco-fiscal',
		name: 'tabelaPrecoFiscal',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Tabela de preço fiscal'}]
		},
		component: () => import('./pages/cadastro/TabelaPrecoFiscal.vue')
	},
    {
		path: '/tipo-produto',
		name: 'tipoProduto',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Tipos de produto'}]
		},
		component: () => import('./pages/cadastro/TipoProduto.vue')
	},
    {
		path: '/tipo-produto/cadastrar',
		name: 'cadastrarTipoProduto',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Tipos de produto'}]
		},
		component: () => import('./pages/cadastro/TipoProduto.vue')
	},
    {
		path: '/tipo-produto/editar/:id',
		name: 'editarTipoProduto',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Tipos de produto'}]
		},
		component: () => import('./pages/cadastro/TipoProduto.vue')
	},
    {
		path: '/grupo-produto',
		name: 'grupoProduto',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Grupo de produto'}]
		},
		component: () => import('./pages/cadastro/GrupoProduto.vue')
	},
    {
		path: '/grupo-produto/cadastrar',
		name: 'cadastrarGrupoProduto',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Grupo de produto'}]
		},
		component: () => import('./pages/cadastro/GrupoProduto.vue')
	},
    {
		path: '/grupo-produto/editar/:id',
		name: 'editarGrupoProduto',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Grupo de produto'}]
		},
		component: () => import('./pages/cadastro/GrupoProduto.vue')
	},
    {
		path: '/grupo-classificacao',
		name: 'grupoClassificacao',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Grupo de Classificação'}]
		},
		component: () => import('./pages/cadastro/GrupoClassificacao.vue')
	},    
    {
		path: '/grupo-classificacao/cadastrar',
		name: 'cadastrarGrupoClassificacao',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Cadastrar Grupo de Classificação'}]
		},
		component: () => import('./pages/cadastro/GrupoClassificacao.vue')
	},
    {
		path: '/grupo-classificacao/editar/:id',
		name: 'editarGrupoClassificacao',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Editar Grupo de Classificação'}]
		},
		component: () => import('./pages/cadastro/GrupoClassificacao.vue')
	},
    {
		path: '/grupo-classificacao/visualizar/:id',
		name: 'visualizarGrupoClassificacao',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Visualizar Grupo de Classificação'}]
		},
		component: () => import('./pages/cadastro/GrupoClassificacao.vue')
	},
    {
		path: '/grupo-classificacao/copiar/:id',
		name: 'copiarGrupoClassificacao',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Copiar'}]
		},
		component: () => import('./pages/cadastro/GrupoClassificacao.vue')
	},
    {
		path: '/emitente',
		name: 'emitente',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Emitente'}]
		},
		component: () => import('./pages/cadastro/Emitente.vue')
	},    
    {
		path: '/imoveis',
		name: 'imoveis',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Imóveis'}]
		},
		component: () => import('./pages/cadastro/Imovel.vue')
	},	
    {
		path: '/imoveis/cadastrar',
		name: 'cadastrarImovel',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'cadastrarImovel'}]
		},
		component: () => import('./pages/cadastro/Imovel.vue')
	},
    {
		path: '/imoveis/editar/:id',
		name: 'editarImovel',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'editarImovel'}]
		},
		component: () => import('./pages/cadastro/Imovel.vue')
	},


    {
		path: '/gmo',
		name: 'gmo',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Gmo'}]
		},
		component: () => import('./pages/cadastro/Gmo.vue')
	},
    {
		path: '/gmo/cadastrar',
		name: 'cadastrarGmo',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'cadastrarGmo'}]
		},
		component: () => import('./pages/cadastro/Gmo.vue')
	},
    {
		path: '/gmo/editar/:id',
		name: 'editarGmo',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'editarGmo'}]
		},
		component: () => import('./pages/cadastro/Gmo.vue')
	},

    /* CADASTROS Produtos*/
	{
		path: '/produtos',
		name: 'produtos',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Produtos'}]
		},
		component: () => import('./pages/cadastro/Produto.vue')
	},
    {
		path: '/produto/editar/:id',
		name: 'editarProduto',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Editar Produto'}]
		},
		component: () => import('./pages/cadastro/Produto.vue')
	},
    {
		path: '/produto/cadastrar',
		name: 'cadastrarProduto',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Cadastrar Produto'}]
		},
		component: () => import('./pages/cadastro/Produto.vue')
	},
    /* CADASTROS Referêcnia Produtos*/
    {
		path: '/referencia-produtos',
		name: 'referenciaProdutos',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'referenciaProduto'}]
		},
		component: () => import('./pages/cadastro/ReferenciaProduto.vue')
	},
    {
		path: '/referencia-produtos/editar/:id',
		name: 'editar-referencia',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'editar-referencia'}]
		},
		component: () => import('./pages/cadastro/ReferenciaProduto.vue')
	},
    {
		path: '/referencia-produtos/cadastrar',
		name: 'cadastrar-referencia',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'cadastrar-referencia'}]
		},
		component: () => import('./pages/cadastro/ReferenciaProduto.vue')
	},

    /* PARAMETROS */
    {
        path: '/parametros-producao',
        name: 'parametros-producao',
        meta: {
            breadcrumb: [{parent:'Parâmetros', label:'Parâmetros de Produção'}]
        },
        component: () => import('./pages/parametro/ParametrosProducao.vue')
    },
    {
        path: '/natureza-operacao',
        name: 'naturezaOperacaoList',
        meta: {
            breadcrumb: [{parent:'Parâmetros', label:'Natureza Operação'}]
        },
        component: () => import('./pages/parametro/NaturezaOperacao.vue')
    },
    {
        path: '/natureza-operacao/cadastrar',
        name: 'naturezaOperacaoCadastrar',
        meta: {
            breadcrumb: [{parent:'Parâmetros', label:'Natureza Operação'}]
        },
        component: () => import('./pages/parametro/NaturezaOperacao.vue')
    },
    {
        path: '/natureza-operacao/editar/:id',
        name: 'naturezaOperacaoEditar',
        meta: {
            breadcrumb: [{parent:'Parâmetros', label:'Natureza Operação'}]
        },
        component: () => import('./pages/parametro/NaturezaOperacao.vue')
    },

    /* NATUREZA TRIBUTARIA */
    {
        path: '/natureza-tributaria',
        name: 'natureza-tributaria',
        meta: {
            breadcrumb: [{parent:'Parâmetros Fiscais', label:'Natureza Operação Tributada'}]
        },
        component: () => import('./pages/parametro/NaturezaTributaria.vue')
    },
    {
        path: '/natureza-tributaria/cadastrar',
        name: 'natureza-tributaria-cadastrar',
        meta: {
            breadcrumb: [{parent:'Parâmetros Fiscais', label:'Natureza Operação Tributada'}]
        },
        component: () => import('./pages/parametro/NaturezaTributaria.vue')
    },
    {
        path: '/natureza-tributaria/editar/:id',
        name: 'natureza-tributaria-editar',
        meta: {
            breadcrumb: [{parent:'Parâmetros Fiscais', label:'Natureza Operação Tributada'}]
        },
        component: () => import('./pages/parametro/NaturezaTributaria.vue')
    },

    
    /*Painel de Controle - Informção de Recurso de Sistema*/
	{
		path: '/info-recurso-sistema',
		name: 'informacoes-Recurso-Sistema',
		meta: {
			breadcrumb: [{parent:'Painel', label:'Informação de Recursos do Sistema'}]
		},
		component: () => import('./pages/painelControle/InformacoesRecursoSistema.vue')
	},
    {
		path: '/info-recurso-sistema/cadastrar',
		name: 'informacoes-recurso-sistema-cadastrar',
		meta: {
			breadcrumb: [{parent:'Painel', label:'Informação de Recursos do Sistema'}]
		},
		component: () => import('./pages/painelControle/InformacoesRecursoSistema.vue')
	},
    {
		path: '/info-recurso-sistema/editar/:id',
		name: 'informacoes-recurso-sistema-editar',
		meta: {
			breadcrumb: [{parent:'Painel', label:'Informação de Recursos do Sistema'}]
		},
		component: () => import('./pages/painelControle/InformacoesRecursoSistema.vue')
	},
    

    /* PARAMETROS ESTABELECIMENTO ROUTER*/
    {
        path: '/parametros-estabelecimento',
        name: 'parametros-estabelecimento',
        meta: {
            breadcrumb: [{parent:'Parâmetros', label:'Estabelecimento'}]
        },
        component: () => import('./pages/parametro/ParametroEstabelecimento.vue')
    },

    {
        path: '/parametros-estabelecimento/cadastrar',
        name: 'parametros-estabelecimento-cadastrar',
        meta: {
            breadcrumb: [{parent:'Parâmetros', label:'Cadastrar Estabelecimento'}]
        },
        component: () => import('./pages/parametro/ParametroEstabelecimento.vue')
    },

    {
        path: '/parametros-estabelecimento/editar/:id',
        name: 'parametros-estabelecimento-editar',
        meta: {
            breadcrumb: [{parent:'Parâmetros', label:'Editar Estabelecimento'}]
        },
        component: () => import('./pages/parametro/ParametroEstabelecimento.vue')
    },

    /*Cadastro - Tipo de Classificação*/
	{
		path: '/tipo-classificacao',
		name: 'tipo-classificacao',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Tipo de Classificação'}]
		},
		component: () => import('./pages/cadastro/TipoClassificacao.vue')
	},
    {
		path: '/tipo-classificacao/cadastrar',
		name: 'tipo-classificacao-cadastrar',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Tipos de Classificacação'}]
		},
		component: () => import('./pages/cadastro/TipoClassificacao.vue')
	},
    {
		path: '/tipo-classificacao/editar/:tipoClassificacao',
		name: 'tipo-classificacao-editar',
		meta: {
			breadcrumb: [{parent:'Editar', label:'Tipos de Classificacação'}]
		},
		component: () => import('./pages/cadastro/TipoClassificacao.vue')
	},

    /* CONSULTA PRODUTORES */

    {
        path: '/produtor',
        name: 'produtor',
        meta: {
            breadcrumb: [{parent:'Produtor', label:'produtores'}]
        },
        component: () => import('./pages/consulta/Produtor.vue')
    },

     /*Parâmetros - Itens Avariados */
	{
		path: '/itens-avariados',
		name: 'itens-avariados',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Itens x Avariados'}]
		},
		component: () => import('./pages/parametro/ItensAvariado.vue')
	},
    {
		path: '/itens-avariados/cadastrar',
		name: 'itens-avariados-cadastrar',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Itens x Avariados'}]
		},
		component: () => import('./pages/parametro/ItensAvariado.vue')
	},
    {
		path: '/itens-avariados/editar/:id',
		name: 'itens-avariados-editar',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Itens x Avariados'}]
		},
		component: () => import('./pages/parametro/ItensAvariado.vue')
	},
    {
		path: '/itens-avariados/copiar/:id',
		name: 'itens-avariados-copiar',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Copiar'}]
		},
		component: () => import('./pages/parametro/ItensAvariado.vue')
	},
    /*Taxas de Produção*/
    {
		path: '/taxas-producao',
		name: 'taxas-producao',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Taxas de Produção'}]
		},
		component: () => import('./pages/parametro/TaxasProducao.vue')
	},
    {
		path: '/taxas-producao/cadastrar',
		name: 'taxas-producao-cadastrar',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Taxas de Produção'}]
		},
		component: () => import('./pages/parametro/TaxasProducao.vue')
	},
    {
		path: '/taxas-producao/editar/:id',
		name: 'taxas-producao-editar',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Taxas de Produção'}]
		},
		component: () => import('./pages/parametro/TaxasProducao.vue')
	},
    {
		path: '/taxas-producao/copiar/:id',
		name: 'taxas-producao-copiar',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Copiar'}]
		},
		component: () => import('./pages/parametro/TaxasProducao.vue')
	},

    /*## Parametro usuario estabelecimento ##*/
    {
		path: '/parametro/estabelecimentos',
		name: 'parametro-estabelecimento',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Usuário x Estabelecimento'}]
		},
		component: () => import('./pages/parametro/ParametroUsuarioEstabelecimento.vue')
	},
    {
		path: '/parametro/estabelecimentos/:username',
		name: 'parametro-estabelecimento-view',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Usuário x Estabelecimento'}]
		},
		component: () => import('./pages/parametro/ParametroUsuarioEstabelecimento.vue')
	},
    {
		path: '/parametro/estabelecimentos/cadastrar',
		name: 'parametro-estabelecimento-cadastro',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Cadastrar Usuário x Estabelecimento'}]
		},
		component: () => import('./pages/parametro/ParametroUsuarioEstabelecimento.vue')
	},
    {
		path: '/parametro/estabelecimentos/editar/:id',
		name: 'parametro-estabelecimento-editar',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Editar Parametros de Estabelecimento'}]
		},
		component: () => import('./pages/parametro/ParametroUsuarioEstabelecimento.vue')
	},
    
    /* Safra Composta */
    {
		path: '/safra-composta',
		name: 'safra-composta',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Safra Composta'}]
		},
		component: () => import('./pages/parametro/SafraComposta.vue')
	},
    {
		path: '/safra-composta/cadastrar',
		name: 'safra-composta-cadastrar',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Safra Composta'}]
		},
		component: () => import('./pages/parametro/SafraComposta.vue')
	},
    {
		path: '/safra-composta/editar/:id',
		name: 'safra-composta-editar',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Safra Composta'}]
		},
		component: () => import('./pages/parametro/SafraComposta.vue')
	},
    {
		path: '/safra-composta/copiar/:id',
		name: 'safra-composta-copiar',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Safra Composta'}]
		},
		component: () => import('./pages/parametro/SafraComposta.vue')
	},
    
    /* Semente classe */
    {
		path: '/classe-semente',
		name: 'classe-semente',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Classe semente'}]
		},
		component: () => import('./pages/cadastro/SementeClasse.vue')
	},
    
    /* Participante Bayer */
    {
		path: '/participante-bayer',
		name: 'participante-bayer',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Participante Bayer'}]
		},
		component: () => import('./pages/cadastro/ParticipanteBayer.vue')
	},
    
    /* Unidade de Federação */
    {
		path: '/unidade-federacao',
		name: 'unidade-federacao',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Unidade de Federação'}]
		},
		component: () => import('./pages/cadastro/UnidadeFederacao.vue')
	},
    /* Tabela de Preços */
    {
		path: '/tabela-precos',
		name: 'tabela-precos',
		meta: {
			breadcrumb: [{parent:'Parâmetros', label:'Tabela de Preços'}]
		},
		component: () => import('./pages/parametro/TabelaPrecos.vue')
	},

    /* Movimento Diario */
    {
		path: '/movimento-diario',
		name: 'movimento-diario',
		meta: {
			breadcrumb: [{parent:'Consulta', label:'Movimento Diário'}]
		},
		component: () => import('./pages/consulta/MovimentoDiario.vue')
	},

    /* Pedido Nota Fiscal */
    {
		path: '/pedido-nota-fiscal',
		name: 'pedido-nota-fiscal',
		meta: {
			breadcrumb: [{parent:'Consulta', label:'Pedidos de Nota Fiscal'}]
		},
		component: () => import('./pages/consulta/PedidoNotaFiscal.vue')
	},

    /* Re Pendente */
    {
		path: '/entrada-producao',
		name: 'entrada-producao',
		meta: {
			breadcrumb: [{parent:'Atividades', label:'Entrada de Produção'}]
		},
		component: () => import('./pages/consulta/Rependente.vue')
	},
    {
		path: '/entrada-producao/cadastrar/:codigoEstabelecimento',
		name: 'entrada-producao-cadastrar',
		meta: {
			breadcrumb: [{parent:'Atividades', label:'Entrada de Produção'}]
		},
		component: () => import('./pages/consulta/Rependente.vue')
	},

    {
		path: '/entrada-producao/editar/:id',
		name: 'entrada-producao-editar',
		meta: {
			breadcrumb: [{parent:'Atividades', label:'Entrada de Produção'}]
		},
		component: () => import('./pages/consulta/Rependente.vue')
	},    
    {
		path: '/entrada-producao/entrada-por-ticket/:nroDocPesagem/:safra/:codigoEstabelecimento',
		name: 'entrada-producao-entrada-ticket',
		meta: {
			breadcrumb: [{parent:'Atividades', label:'Entrada de Produção'}]
		},
		component: () => import('./pages/consulta/Rependente.vue')
	},

    /* INTEGRACAO PAGE */
    {
		path: '/integracao',
		name: 'integracao',
		meta: {
			breadcrumb: [{parent:'Painel de Integrações', label:'integração'}]
		},
		component: () => import('./pages/Integracao/PageIntegracao.vue')
	},
    {
		path: '/monitor-integracao',
		name: 'monitor-integracao',
		meta: {
			breadcrumb: [{parent:'Painel de Integrações', label:'Monitor de Integração'}]
		},
		component: () => import('./pages/Integracao/PageMonitorIntegracao.vue')
	},
    {
		path: '/integracao/:pagina',
		name: 'integracao-pagina',
		meta: {
			breadcrumb: [{parent:'Painel de Integrações', label:'integração > página'}]
		},
		component: () => import('./pages/Integracao/PageIntegracao.vue')
	},
    {
		path: '/situacao-re',
		name: 'situacaoRe',
		meta: {
			breadcrumb: [{parent:'Cadastros', label:'Situação Re'}]
		},
		component: () => import('./pages/cadastro/SituacaoRe.vue')
	},
    {
		path: '/tratamento-transacoes-re',
		name: 'tratamento-transacoes-re',
		meta: {
			breadcrumb: [{parent:'Consultas', label:'Tratamento Transação RE'}]
		},
		component: () => import('./pages/consulta/TratamentoTransacaoRe.vue')
	},

    /* Relatórios */
    {
		path: '/rel-romaneio-entrega',
		name: 'romaneioEntregaReport',
		meta: {
			breadcrumb: [{parent:'Relatórios', label:'Romaneio de Entrega'}]
		},
		component: () => import('./pages/report/RomaneioEntregaReport.vue')
	},
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior () {
        return { left: 0, top: 0 };
    }
});

export default router;