export function convertToTimeFormat(dateString: string): string {
  const date = new Date(dateString);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // 12-hour format, handle 0 as 12

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
}
