const variants = {
  'Por confirmar': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Confirmada':    'bg-blue-50 text-blue-700 border-blue-200',
  'Concluída':     'bg-green-50 text-green-700 border-green-200',
  'Cancelada':     'bg-red-50 text-red-700 border-red-200',
  'Ativo':         'bg-green-50 text-green-700 border-green-200',
  'Inativo':       'bg-gray-100 text-gray-500 border-gray-200',
};

const Badge = ({ label }) => {
  const styles = variants[label] ?? 'bg-gray-100 text-gray-600 border-gray-200';

  return (
    <span className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 text-xs font-medium rounded-full border ${styles}`}>
      {label}
    </span>
  );
};

export default Badge;
