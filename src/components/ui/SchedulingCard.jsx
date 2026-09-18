import Badge from './Badge';
import { fmtDataHora, fmtDuracao, fmtEuros } from '../../lib/format';

const ESTADOS = {
  Pending: 'Por confirmar',
  Confirmed: 'Confirmada',
  Completed: 'Concluída',
  Cancelled: 'Cancelada',
};

const SchedulingCard = ({ scheduling: s, onCancel, onReschedule }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">

    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {s.serviceName ?? `Serviço #${s.serviceId}`}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">{fmtDataHora(s.startsAt)}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {fmtDuracao(s.durationMinutes)}
          {s.price ? ` · ${fmtEuros(s.price)}` : ''}
          {s.resourceName ? ` · ${s.resourceName}` : ''}
        </p>
      </div>

      <Badge label={ESTADOS[s.status] ?? s.status} />
    </div>

    {(onCancel || onReschedule) && s.canCancel && (
      <div className="flex gap-2 pt-1 border-t border-gray-50">
        {onReschedule && (
          <button
            type="button"
            onClick={() => onReschedule(s)}
            className="text-xs text-gray-500 hover:text-gray-900 cursor-pointer pt-2"
          >
            Reagendar
          </button>
        )}
        {onCancel && (
          <button
            type="button"
            onClick={() => onCancel(s)}
            className="text-xs text-red-500 hover:text-red-700 cursor-pointer pt-2"
          >
            Cancelar
          </button>
        )}
      </div>
    )}
  </div>
);

export default SchedulingCard;
