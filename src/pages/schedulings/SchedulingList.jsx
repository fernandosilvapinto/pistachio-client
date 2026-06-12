import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('pt-PT') : '—';

const SchedulingList = () => {
  const [schedulings, setSchedulings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const s = await api.get('/schedulings').catch(() => []);
      setSchedulings(Array.isArray(s) ? s : []);
      setLoading(false);
    };
    load();
  }, []);

  const FILTERS = ['Todos', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
  const filtered = filter === 'Todos'
    ? schedulings
    : schedulings.filter(s => s.status === filter);

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Os meus agendamentos</h1>
          <p className="text-sm text-gray-400 mt-1">{schedulings.length} total</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/schedulings/new')}>
          + Novo agendamento
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer
              ${filter === f
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading
        ? <p className="text-sm text-gray-400">A carregar…</p>
        : filtered.length === 0
          ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-sm text-gray-400">Nenhum agendamento encontrado.</p>
            </div>
          )
          : (
            <div className="flex flex-col gap-3">
              {filtered.map((s, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {s.service?.name ?? s.serviceName ?? `Serviço #${s.serviceId}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{fmtDate(s.scheduledDate)}</p>
                  </div>
                  {s.status && <Badge label={s.status} />}
                </div>
              ))}
            </div>
          )
      }

    </div>
  );
};

export default SchedulingList;