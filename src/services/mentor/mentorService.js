import { MENTORS } from '../../mocks/mentor/mentorsData';

const USE_MOCK = true;
const API_URL = 'https://fluffy-meme-q764p6rwqw4jcq9v-8085.app.github.dev';

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
  // GET /admin/mentors (retorna PENDENTE, APROVADO e REPROVADO para persistir após F5)
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

  // POST /admin/mentors/{id}/approve -> { aprovado: true, motivo: null }
  async approveMentor(id) {
    if (USE_MOCK) {
      mockStore = mockStore.map((m) =>
        m.id === id ? { ...m, status: 'APROVADO' } : m
      );
      return Promise.resolve();
    }

    const response = await fetch(`${API_URL}/admin/mentors/${id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aprovado: true,
        motivo: null,
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
        m.id === id ? { ...m, status: 'REPROVADO' } : m
      );
      return Promise.resolve();
    }

    const response = await fetch(`${API_URL}/admin/mentors/${id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
};