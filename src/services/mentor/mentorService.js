import { MENTORS } from '../../mocks/mentor/mentorsData';
import {
  CHANGE_REQUESTS,
  EXPIRED_MENTORSHIPS,
} from '../../mocks/mentor/mentorshipsData';

const USE_MOCK = true;
const API_URL = 'https://fluffy-meme-q764p6rwqw4jcq9v-8085.app.github.dev';

let mockStore = [...MENTORS];
let mockChangeRequests = [...CHANGE_REQUESTS];
let mockExpiredMentorships = [...EXPIRED_MENTORSHIPS];

function formatInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function mapMentorFromApi(dto) {
  const name = dto.nome || dto.name || 'Mentor';
  const valorHoraFormatado =
    dto.valorHora != null
      ? `R$ ${Number(dto.valorHora).toFixed(2).replace('.', ',')}/h`
      : null;

  return {
    id: String(dto.id),
    mentorUuid: dto.mentorUuid || '',
    name,
    role: dto.cargo || dto.role || valorHoraFormatado || 'Mentor',
    initials: dto.initials || formatInitials(name),
    bio: dto.biografia || dto.bio || '',
    tags: Array.isArray(dto.tags)
      ? dto.tags.map((t) => (typeof t === 'string' ? t : t.nome))
      : [],
    link: dto.linkAgendamento || dto.link || '',
    status: dto.statusAprovacao || dto.status || 'PENDENTE',
    rejectionReason: dto.motivo || '',
    isExpandedDefault: false,
  };
}

function mapChangeRequestFromApi(dto) {
  return {
    id: String(dto.id),
    menteeName: dto.mentoradoNome || dto.menteeName || 'Mentorado',
    currentMentorName: dto.mentorAtualNome || dto.currentMentorName || 'Mentor Atual',
    reason: dto.justificativa || dto.motivo || dto.reason || 'Sem justificativa informada.',
    createdAt: dto.dataSolicitacao || dto.createdAt || '',
    status: dto.status || 'PENDENTE',
  };
}

export const mentorService = {
  // GET /admin/mentors
  async getMentors() {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockStore]), 150);
      });
    }

    const response = await fetch(`${API_URL}/admin/mentors`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao buscar mentores: ${errorText}`);
    }
    const data = await response.json();
    return data.map(mapMentorFromApi);
  },

  // POST /admin/mentors/{id}/approve -> { aprovado: true, motivo }
  async approveMentor(id, motivo = null) {
    if (USE_MOCK) {
      mockStore = mockStore.map((m) =>
        m.id === id ? { ...m, status: 'APROVADO', approvalNote: motivo } : m
      );
      return Promise.resolve();
    }

    const response = await fetch(`${API_URL}/admin/mentors/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aprovado: true,
        motivo: motivo || null,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao aprovar mentor: ${errorText}`);
    }
    return response.json();
  },

  // POST /admin/mentors/{id}/approve -> { aprovado: false, motivo }
  async rejectMentor(id, motivo = '') {
    if (USE_MOCK) {
      mockStore = mockStore.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'REPROVADO',
              rejectionReason: motivo || 'Reprovado pelo administrador',
            }
          : m
      );
      return Promise.resolve();
    }

    const response = await fetch(`${API_URL}/admin/mentors/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aprovado: false,
        motivo: motivo || 'Reprovado pelo administrador',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao reprovar mentor: ${errorText}`);
    }
    return response.json();
  },

  // GET /admin/mentorships/change-requests
  async getChangeRequests() {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockChangeRequests]), 150);
      });
    }

    const response = await fetch(`${API_URL}/admin/mentorships/change-requests`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao buscar solicitações de troca: ${errorText}`);
    }
    const data = await response.json();
    return data.map(mapChangeRequestFromApi);
  },

  // POST /admin/mentorships/change-requests/{id}/approve
  async handleChangeRequest(id, aprovado, motivo = null) {
    if (USE_MOCK) {
      mockChangeRequests = mockChangeRequests.filter((req) => req.id !== id);
      return Promise.resolve();
    }

    const response = await fetch(
      `${API_URL}/admin/mentorships/change-requests/${id}/approve`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aprovado,
          motivo: motivo || null,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao processar solicitação de troca: ${errorText}`);
    }
    return response.json();
  },

  // Mentorias Expiradas (> 7 dias sem agendamento)
  async getExpiredMentorships() {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockExpiredMentorships]), 150);
      });
    }

    const response = await fetch(`${API_URL}/admin/mentorships/expired`);
    if (!response.ok) return [];
    return response.json();
  },
};