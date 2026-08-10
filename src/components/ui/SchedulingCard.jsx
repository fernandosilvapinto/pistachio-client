import Badge from './Badge';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('pt-PT') : '—';

const SchedulingCard = ({ scheduling: s }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-900">
        {s.service?.name ?? s.serviceName ?? `Serviço #${s.serviceId}`}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{fmtDate(s.scheduledDate)}</p>
    </div>
    {s.status && <Badge label={s.status} />}
  </div>
);

export default SchedulingCard;
