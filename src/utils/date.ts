export function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `Editado há ${days} dia${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Editado há ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `Editado há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return 'Editado agora';
}
