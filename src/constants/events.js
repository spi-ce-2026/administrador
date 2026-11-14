// Tipos de evento: ícone, tom e ação (da tabela do PDF)[cite: 2, 4]
export const EVENT_TYPES = {
  reminder_24h: { icon: 'calendar-outline', tone: 'default', action: 'Ver detalhes' },
  reminder_1h: { icon: 'videocam-outline', tone: 'default', action: 'Entrar na sala' },
  expired: { icon: 'time-outline', tone: 'expired', action: 'Escolher outro mentor' },
  feedback: { icon: 'chatbubble-ellipses-outline', tone: 'success', action: 'Ler feedback' },
};