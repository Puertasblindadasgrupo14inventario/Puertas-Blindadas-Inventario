/**
 * Formatea una cantidad numérica para mostrar al usuario.
 * - Enteros: sin decimales (4.0000 → "4")
 * - Decimales: máximo 2 decimales (2.5000 → "2,5" / 10.125 → "10,13")
 * - Separador de miles con punto (estilo CL)
 */
export function formatQty(val) {
  if (val == null || val === '' || isNaN(val)) return '—';
  const n = parseFloat(val);
  if (Number.isInteger(n)) return n.toLocaleString('es-CL');
  return n.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/**
 * Formatea un monto en CLP (sin decimales, con separador de miles).
 * - 1250000 → "$1.250.000"
 * - null → "—"
 */
export function formatMoney(val) {
  if (val == null || val === '' || isNaN(val)) return '—';
  return '$' + Math.round(parseFloat(val)).toLocaleString('es-CL');
}
