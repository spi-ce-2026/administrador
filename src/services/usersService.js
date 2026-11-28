import { api, esperar, USE_MOCK } from './api';
import { usersMock } from '../mocks/users/users';

// "Banco" em memória para o mock: suspender/reativar muda de verdade a lista.
let banco = usersMock.map((u) => ({ ...u }));

// GET /admin/users?status=ACTIVE|SUSPENDED&search=
export async function listarUsuarios({ status = 'ACTIVE', busca = '' } = {}) {
  if (!USE_MOCK) {
    const { data } = await api.get('/admin/users', { params: { status, search: busca || undefined } });
    return data;
  }

  await esperar();
  const termo = busca.trim().toLowerCase();
  return banco.filter(
    (u) =>
      u.status === status &&
      (!termo || u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo))
  );
}

// POST /admin/users/{id}/suspend   body: { motivo, observacao }
export async function suspenderUsuario(id, { motivo, observacao }) {
  if (!USE_MOCK) {
    const { data } = await api.post(`/admin/users/${id}/suspend`, { motivo, observacao });
    return data;
  }

  await esperar(600);
  banco = banco.map((u) =>
    u.id === id
      ? {
          ...u,
          status: 'SUSPENDED',
          suspensao: { motivo, observacao, data: new Date().toISOString(), por: 'Admin' },
        }
      : u
  );
  return banco.find((u) => u.id === id);
}

// POST /admin/users/{id}/reactivate  (SUGERIDO: ainda não está na documentação)
export async function reativarUsuario(id) {
  if (!USE_MOCK) {
    const { data } = await api.post(`/admin/users/${id}/reactivate`);
    return data;
  }

  await esperar(600);
  banco = banco.map((u) => (u.id === id ? { ...u, status: 'ACTIVE', suspensao: undefined } : u));
  return banco.find((u) => u.id === id);
}
