export function formatDateTime(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short", // shows e.g. "GMT", "PST", "IST"
  }).format(date);
}


export function formatDateTimeToDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

   return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium", // e.g. "Sep 9, 2025"
  }).format(date);
}




export const formatFileSize = (bytes: number) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
