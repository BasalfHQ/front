export function formatHour(
  date: string | Date,
  locale: string = "fr",
  timezone: string = "Europe/Paris",
) {
  return (typeof date === "string" ? new Date(date) : date)
    .toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone,
    })
    .replace(" ", "");
}

export function formatDay(
  date: string | Date,
  locale: string = "fr",
  timezone: string = "Europe/Paris",
) {
  return (typeof date === "string" ? new Date(date) : date).toLocaleDateString(
    locale,
    {
      day: "numeric",
      month: "long",
      timeZone: timezone,
    },
  );
}

export function formatMonth(
  date: string | Date,
  locale: string = "fr",
  timezone: string = "Europe/Paris",
) {
  return (typeof date === "string" ? new Date(date) : date).toLocaleDateString(
    locale,
    {
      month: "long",
      year: "numeric",
      timeZone: timezone,
    },
  );
}

export function formatDate(
  date: string | Date,
  locale: string = "fr",
  timezone: string = "Europe/Paris",
) {
  return (typeof date === "string" ? new Date(date) : date).toLocaleString(
    locale,
    {
      timeZone: timezone,
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}
