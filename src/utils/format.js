const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// "2026-03-10" (só data) é lido pelo JS como meia-noite UTC, que no Brasil ainda é
// o dia anterior — "2026-03-01" viraria fevereiro. Datas sem hora são lidas no horário local.
function lerData(iso) {
  if (typeof iso === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(iso)) return new Date(`${iso}T12:00:00`);
  return new Date(iso);
}
const invalida = (d) => Number.isNaN(d.getTime());

export function iniciais(nome = '') {
  const partes = nome.trim().split(/\s+/);
  return ((partes[0]?.[0] || '') + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase();
}

// "hoje", "ontem" ou "19 nov"
export function dataCurta(iso) {
  const d = lerData(iso);
  if (invalida(d)) return '';
  const hoje = new Date();
  const mesmoDia = (a, b) => a.toDateString() === b.toDateString();
  if (mesmoDia(d, hoje)) return 'hoje';
  if (mesmoDia(d, new Date(hoje.getTime() - 86400000))) return 'ontem';
  return `${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]}`;
}

// "19 nov 2026"
export function dataLonga(iso) {
  const d = lerData(iso);
  if (invalida(d)) return '—';
  return `${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

// "mar/26"
export function mesAno(iso) {
  const d = lerData(iso);
  if (invalida(d)) return '—';
  return `${MESES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
}

export function decimal(n, casas = 1) {
  const s = n.toFixed(casas).replace('.', ',');
  return s.endsWith(',0') ? s.slice(0, -2) : s;
}

export const MOTIVOS_SUSPENSAO = [
  { id: 'NO_SHOW', rotulo: 'No-show repetido' },
  { id: 'RULES', rotulo: 'Violação de regras' },
  { id: 'OTHER', rotulo: 'Outro motivo' },
];

export const rotuloMotivo = (id) => MOTIVOS_SUSPENSAO.find((m) => m.id === id)?.rotulo || '—';

export const rotuloPapel = (papel) => (papel === 'MENTOR' ? 'Mentor' : 'Mentorado');
