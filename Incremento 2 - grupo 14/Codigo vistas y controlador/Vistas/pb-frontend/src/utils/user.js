/** Iniciales del usuario, misma lógica que layout.js */
export function getInitials(user) {
  if (!user?.nombre) return '--';
  return user.nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Etiqueta de rol mostrada en el sidebar (layout.js) */
export function getRoleLabel(user) {
  return user?.rol === 'gerencia' ? 'Gerencia' : 'JOP';
}
