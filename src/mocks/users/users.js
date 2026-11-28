// Dados ilustrativos para GET /admin/users
const hoje = new Date();
const diasAtras = (n) => new Date(hoje.getTime() - n * 86400000).toISOString();

const historicoPadrao = [
  { id: 'h1', mentor: 'Ana Souza', tema: 'UX Research', data: diasAtras(9), status: 'NO_SHOW' },
  { id: 'h2', mentor: 'Rafael Lima', tema: 'Back-end', data: diasAtras(23), status: 'NO_SHOW' },
  { id: 'h3', mentor: 'Julia Melo', tema: 'Marketing', data: diasAtras(37), status: 'DONE' },
  { id: 'h4', mentor: 'Bruno Teixeira', tema: 'Carreira', data: diasAtras(49), status: 'NO_SHOW' },
];

export const usersMock = [
  { id: 'u1', nome: 'Diego Alves', email: 'diego.alves@email.com', papel: 'MENTORADO', mentorias: 6, noShows: 3, criadoEm: '2026-03-10', status: 'ACTIVE', historico: historicoPadrao },
  { id: 'u2', nome: 'Ana Lima', email: 'ana.lima@email.com', papel: 'MENTORADO', mentorias: 3, noShows: 0, criadoEm: '2026-05-02', status: 'ACTIVE', historico: [] },
  { id: 'u3', nome: 'Beatriz Rocha', email: 'bia.rocha@email.com', papel: 'MENTORADO', mentorias: 8, noShows: 0, criadoEm: '2026-01-21', status: 'ACTIVE', historico: [] },
  { id: 'u4', nome: 'Carlos Nunes', email: 'carlos.nunes@email.com', papel: 'MENTORADO', mentorias: 1, noShows: 1, criadoEm: '2026-09-14', status: 'ACTIVE', historico: [] },
  { id: 'u5', nome: 'Fernanda Costa', email: 'fe.costa@email.com', papel: 'MENTOR', mentorias: 4, noShows: 0, criadoEm: '2026-02-08', status: 'ACTIVE', historico: [] },
  { id: 'u6', nome: 'Gustavo Reis', email: 'gustavo.reis@email.com', papel: 'MENTORADO', mentorias: 2, noShows: 2, criadoEm: '2026-07-30', status: 'ACTIVE', historico: [] },
  { id: 'u7', nome: 'Helena Prado', email: 'helena.prado@email.com', papel: 'MENTOR', mentorias: 11, noShows: 0, criadoEm: '2025-11-18', status: 'ACTIVE', historico: [] },
  { id: 'u8', nome: 'Igor Martins', email: 'igor.martins@email.com', papel: 'MENTORADO', mentorias: 5, noShows: 1, criadoEm: '2026-04-05', status: 'ACTIVE', historico: [] },
  { id: 'u9', nome: 'Marina Santos', email: 'marina.santos@email.com', papel: 'MENTORADO', mentorias: 2, noShows: 0, criadoEm: '2026-06-11', status: 'SUSPENDED', suspensao: { motivo: 'RULES', observacao: '', data: diasAtras(8), por: 'Admin' }, historico: [] },
  { id: 'u10', nome: 'Paulo Freitas', email: 'paulo.freitas@email.com', papel: 'MENTORADO', mentorias: 4, noShows: 3, criadoEm: '2026-02-27', status: 'SUSPENDED', suspensao: { motivo: 'NO_SHOW', observacao: '', data: diasAtras(25), por: 'Admin' }, historico: [] },
  { id: 'u11', nome: 'Lucas Torres', email: 'lucas.torres@email.com', papel: 'MENTORADO', mentorias: 1, noShows: 0, criadoEm: '2026-08-03', status: 'SUSPENDED', suspensao: { motivo: 'OTHER', observacao: 'Pedido do próprio usuário', data: diasAtras(30), por: 'Admin' }, historico: [] },
];
