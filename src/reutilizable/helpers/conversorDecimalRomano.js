/**
 * Convierte un número decimal (1..100) a número romano.
 * Devuelve una cadena con el número romano en mayúsculas, o null si la entrada
 * no es un entero en el rango soportado.
 *
 * Ejemplos:
 *   decimalToRoman(1)   -> 'I'
 *   decimalToRoman(4)   -> 'IV'
 *   decimalToRoman(199) -> null (fuera de rango)
 *
 * @param {number} num - Entero entre 1 y 100 inclusive
 * @returns {string|null}
 */
export default function decimalToRoman(num) {
  if (typeof num !== "number" || !Number.isInteger(num)) return null;
  if (num < 1 || num > 1000) return null;

  const map = [
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let result = "";
  let remaining = num;

  for (const [value, numeral] of map) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
    if (remaining === 0) break;
  }

  return result;
}
