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