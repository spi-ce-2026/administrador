import { api, esperar, USE_MOCK } from './api';
import { dashboardAnalyticsMock } from '../mocks/dashboard/dashboard';

// GET /admin/dashboard?period=month|quarter|year
// Traz os números do painel + o bloco "analytics".
export async function buscarDashboard({ periodo = 'month' } = {}) {
  if (!USE_MOCK) {
    const { data } = await api.get('/admin/dashboard', { params: { period: periodo } });
    return data;
  }

  await esperar(500);
  return dashboardAnalyticsMock(periodo);
}
