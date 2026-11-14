const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export function dayLabel(iso) {
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86400000);
  if (diffDays <= 0) return 'HOJE';
  if (diffDays === 1) return 'ONTEM';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }).toUpperCase();
}

export function groupByDay(items) {
  const sorted = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const groups = [];
  sorted.forEach((item) => {
    const title = dayLabel(item.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.title === title) last.data.push(item);
    else groups.push({ title, data: [item] });
  });
  return groups;
}

export { hoursAgo };