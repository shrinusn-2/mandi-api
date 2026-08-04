export function formatIngestionTime(isoString) {
  if (!isoString) return null;
  try {
    return new Date(isoString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return null;
  }
}
