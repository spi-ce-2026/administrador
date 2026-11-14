import { hoursAgo } from '../utils/dateHelpers';

export const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'reminder_1h',
    title: 'Começa em 1 hora',
    message: 'Mentoria com Ana Souza às 19h',
    createdAt: hoursAgo(0.2),
    read: false,
    deepLink: '/mentorias/42/sala',
  },
  {
    id: '2',
    type: 'feedback',
    title: 'Feedback disponível',
    message: 'Bruno avaliou sua mentoria',
    createdAt: hoursAgo(2),
    read: false,
    deepLink: '/mentorias/38/feedback',
  },
  {
    id: '3',
    type: 'reminder_24h',
    title: 'Sua mentoria é amanhã',
    message: 'Qui, 14/11 às 19h',
    createdAt: hoursAgo(26),
    read: true,
    deepLink: '/mentorias/42',
  },
  {
    id: '4',
    type: 'expired',
    title: 'Mentoria expirada',
    message: 'Pedido com Lucas não foi confirmado',
    createdAt: hoursAgo(30),
    read: true,
    deepLink: '/mentores',
  },
];