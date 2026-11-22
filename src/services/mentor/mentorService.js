import { MENTORS } from '../../mocks/mentor/mentorsData';

const USE_MOCK = true;
const API_URL = 'http://SEU_IP_LOCAL:8080';

let mockStore = [...MENTORS];

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
    isExpandedDefault: false,
  };
}

export const mentorService = {
  // GET /admin/mentors/pending
  async getMentors() {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockStore]), 150);
      });
    }

    const response = await fetch(`${API_URL}/admin/mentors/pending`);
    if (!response.ok) throw new Error('Erro ao buscar mentores pendentes');
    const data = await response.json();
    return data.map(mapMentorFromApi);
  },

  // POST /admin/mentors/{id}/approve
  async approveMentor(id) {
    if (USE_MOCK) {
      mockStore = mockStore.map((m) =>
        m.id === id ? { ...m, status: 'APROVADO' } : m
      );
      return Promise.resolve();
    }

    const response = await fetch(`${API_URL}/admin/mentors/${id}/approve`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Erro ao aprovar mentor');
  },

  // POST /admin/mentors/{id}/reject (ou endpoint equivalente de reprovação)
  async rejectMentor(id) {
    if (USE_MOCK) {
      mockStore = mockStore.map((m) =>
        m.id === id ? { ...m, status: 'REPROVADO' } : m
      );
      return Promise.resolve();
    }

    const response = await fetch(`${API_URL}/admin/mentors/${id}/reject`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Erro ao reprovar mentor');
  },

  // Ativo no mock para permitir testes cíclicos
  async resetMentorToPending(id) {
    if (USE_MOCK) {
      mockStore = mockStore.map((m) =>
        m.id === id ? { ...m, status: 'PENDENTE' } : m
      );
      return Promise.resolve();
    }

    const response = await fetch(`${API_URL}/admin/mentors/${id}/pending`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Erro ao retornar mentor para pendente');
  },
};