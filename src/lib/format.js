// Formatação em português de Portugal, num sítio só. Espalhar toLocaleString
// pelas páginas é como se acaba com três formatos de data na mesma aplicação.

const diaLongo = new Intl.DateTimeFormat('pt-PT', {
  weekday: 'long', day: 'numeric', month: 'long',
});

const diaCurto = new Intl.DateTimeFormat('pt-PT', { weekday: 'short' });
const numeroDoDia = new Intl.DateTimeFormat('pt-PT', { day: 'numeric' });
const mesCurto = new Intl.DateTimeFormat('pt-PT', { month: 'short' });
const horas = new Intl.DateTimeFormat('pt-PT', { hour: '2-digit', minute: '2-digit' });

const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

export const fmtEuros = (valor) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(Number(valor ?? 0));

export const fmtHora = (iso) => (iso ? horas.format(new Date(iso)) : '—');

export const fmtDiaLongo = (iso) => (iso ? capitalizar(diaLongo.format(new Date(iso))) : '—');

export const fmtDiaCurto = (iso) => capitalizar(diaCurto.format(new Date(iso))).replace('.', '');

export const fmtNumeroDoDia = (iso) => numeroDoDia.format(new Date(iso));

export const fmtMesCurto = (iso) => capitalizar(mesCurto.format(new Date(iso))).replace('.', '');

export const fmtDataHora = (iso) =>
  iso ? `${fmtDiaLongo(iso)}, ${fmtHora(iso)}` : '—';

// "1h30" lê-se melhor do que "90 min" a partir de uma hora.
export const fmtDuracao = (minutos) => {
  const m = Number(minutos ?? 0);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const resto = m % 60;
  return resto === 0 ? `${h}h` : `${h}h${String(resto).padStart(2, '0')}`;
};

/** ISO local (YYYY-MM-DD) de uma data, sem passar por UTC e perder um dia. */
export const isoDoDia = (data) => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};
