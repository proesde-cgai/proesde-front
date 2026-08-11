const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/**
 * Convierte una fecha en formato 'YYYY-MM-DD' a un objeto con
 * mes (nombre en español), day (número) y anio (número).
 *
 * Ejemplo:
 *   formatDateSpanish('2025-11-04') => { mes: 'noviembre', day: 4, anio: 2025 }
 *
 * Devuelve null si la entrada no coincide con el formato o si la fecha es inválida.
 *
 * @param {string} dateStr - Fecha en formato 'YYYY-MM-DD'
 * @returns {{mes: string, day: number, anio: number} | null}
 */
export default function formatDateSpanish(dateStr) {
  if (typeof dateStr !== "string") return null;
  const trimmed = dateStr.trim();
  const m = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const [, y, mm, dd] = m;
  const year = Number(y);
  const monthIndex = Number(mm) - 1; // 0-based
  const day = Number(dd);

  if (
    Number.isNaN(year) ||
    Number.isNaN(monthIndex) ||
    Number.isNaN(day) ||
    monthIndex < 0 ||
    monthIndex > 11
  ) {
    return null;
  }

  // Validación simple del día según el mes/año (considera años bisiestos)
  const maxDay = new Date(year, monthIndex + 1, 0).getDate();
  if (day < 1 || day > maxDay) return null;

  return {
    month: MONTHS_ES[monthIndex],
    day,
    year,
  };
}
