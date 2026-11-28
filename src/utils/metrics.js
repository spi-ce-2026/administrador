import { decimal } from './format';

// As 4 métricas da documentação. "melhor" diz se subir é bom ou ruim.
export const METRICAS = [
  { chave: 'taxaConclusao', nome: 'Taxa de Conclusão', descricao: '% de mentorias finalizadas com sucesso', melhor: 'maior', formato: 'percentual' },
  { chave: 'npsMentores', nome: 'NPS de Mentores', descricao: 'Satisfação média dos mentorados', melhor: 'maior', formato: 'numero' },
  { chave: 'tempoMedioMatch', nome: 'Tempo Médio de Match', descricao: 'Da solicitação até o matchmaking', melhor: 'menor', formato: 'dias' },
  { chave: 'taxaNoShow', nome: 'Taxa de No-Show', descricao: '% de sessões com ausência', melhor: 'menor', formato: 'percentual' },
];

export function formatarValor(valor, formato) {
  if (formato === 'percentual') return `${Math.round(valor * 100)}%`;
  if (formato === 'dias') return `${decimal(valor)} ${valor < 2 ? 'dia' : 'dias'}`;
  return String(Math.round(valor));
}

export function formatarMeta(meta, metrica) {
  return `${metrica.melhor === 'maior' ? '≥' : '≤'} ${formatarValor(meta, metrica.formato)}`;
}

export function formatarVariacao(variacao, formato) {
  const seta = variacao > 0 ? '▲' : variacao < 0 ? '▼' : '•';
  const abs = Math.abs(variacao);
  if (formato === 'percentual') return `${seta} ${decimal(abs * 100)} p.p.`;
  if (formato === 'dias') return `${seta} ${decimal(abs)} ${abs < 2 ? 'dia' : 'dias'}`;
  return `${seta} ${decimal(abs, 0)}`;
}

export function dentroDaMeta(valor, meta, metrica) {
  return metrica.melhor === 'maior' ? valor >= meta : valor <= meta;
}

// Se a variação foi boa (verde) ou ruim (vermelha), independente da direção da seta.
export function variacaoPositiva(variacao, metrica) {
  if (variacao === 0) return true;
  return metrica.melhor === 'maior' ? variacao > 0 : variacao < 0;
}

// Texto do selo: "Na meta", "Abaixo da meta" (quando maior é melhor) ou "Acima da meta".
export function rotuloStatusMeta(valor, meta, metrica) {
  if (dentroDaMeta(valor, meta, metrica)) return 'Na meta';
  return metrica.melhor === 'maior' ? 'Abaixo da meta' : 'Acima da meta';
}
