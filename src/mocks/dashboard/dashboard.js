export const dashboardMock = {
  mentoriasNoMes: 128,
  variacaoMentorias: 18,
  novosCadastros: 42,
  mentoriasPendentes: 9,
  mentoresPendentes: 5,
  vouchersAtivos: 31,
};

export function buscarDashboard() {
  return new Promise((resolve) => setTimeout(() => resolve(dashboardMock), 800));
}

const base = {
  mentoriasNoMes: 128,
  crescimentoMes: 0.18,
  novosCadastros: 42,
  mentoriasPendentes: 9,
  mentoresPendentes: 5,
  vouchersAtivos: 31,
};

const analyticsPorPeriodo = {
  month: {
    rotulo: 'nov',
    rotuloHistorico: 'Barras: últimos 6 meses',
    metricas: {
      taxaConclusao: { valor: 0.87, meta: 0.85, variacao: 0.03, historico: [0.78, 0.8, 0.77, 0.82, 0.84, 0.87] },
      npsMentores: { valor: 72, meta: 70, variacao: 5, historico: [61, 65, 64, 68, 67, 72] },
      tempoMedioMatch: { valor: 2.4, meta: 3, variacao: -0.6, historico: [3.9, 3.6, 3.4, 3.1, 3.0, 2.4] },
      taxaNoShow: { valor: 0.08, meta: 0.05, variacao: 0.02, historico: [0.04, 0.035, 0.045, 0.05, 0.06, 0.08] },
    },
  },
  quarter: {
    rotulo: '4º tri',
    rotuloHistorico: 'Barras: últimos 4 trimestres',
    metricas: {
      taxaConclusao: { valor: 0.84, meta: 0.85, variacao: 0.02, historico: [0.76, 0.79, 0.82, 0.84] },
      npsMentores: { valor: 69, meta: 70, variacao: 3, historico: [58, 63, 66, 69] },
      tempoMedioMatch: { valor: 2.8, meta: 3, variacao: -0.5, historico: [4.1, 3.6, 3.3, 2.8] },
      taxaNoShow: { valor: 0.06, meta: 0.05, variacao: 0.01, historico: [0.05, 0.04, 0.05, 0.06] },
    },
  },
  year: {
    rotulo: '2026',
    rotuloHistorico: 'Barras: últimos 3 anos',
    metricas: {
      taxaConclusao: { valor: 0.81, meta: 0.85, variacao: 0.06, historico: [0.7, 0.75, 0.81] },
      npsMentores: { valor: 66, meta: 70, variacao: 8, historico: [52, 58, 66] },
      tempoMedioMatch: { valor: 3.3, meta: 3, variacao: -1.2, historico: [5.2, 4.5, 3.3] },
      taxaNoShow: { valor: 0.05, meta: 0.05, variacao: -0.01, historico: [0.07, 0.06, 0.05] },
    },
  },
};

// Versão com analytics por período (month | quarter | year).
// Nome diferente de `dashboardMock` para não conflitar com o objeto acima,
// que o AppTabs (badge) e o DashboardScreen já usam.
export function dashboardAnalyticsMock(period = 'month') {
  return { ...base, analytics: { periodo: period, ...analyticsPorPeriodo[period] } };
}