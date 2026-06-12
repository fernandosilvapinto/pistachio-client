import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('pt-PT') : '—';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schedulings, setSchedulings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const s = await api.get('/schedulings').catch(() => []);
      setSchedulings(Array.isArray(s) ? s.slice(0, 3) : []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="flex flex-col gap-8">

      {/* Boas vindas */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Olá, {user?.name ?? user?.email ?? 'Cliente'} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1">Bem-vindo à tua área pessoal.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/schedulings/new')}>
          + Novo agendamento
        </Button>
      </div>

      {/* Agendamentos recentes */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700">Agendamentos recentes</h2>
          <button
            onClick={() => navigate('/schedulings')}
            className="text-xs text-blue-600 hover:underline cursor-pointer"
          >
            Ver todos →
          </button>
        </div>

        {loading
          ? <p className="text-sm text-gray-400">A carregar…</p>
          : schedulings.length === 0
            ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-sm text-gray-400">Ainda não tens agendamentos.</p>
                <button
                  onClick={() => navigate('/schedulings/new')}
                  className="text-sm text-blue-600 hover:underline mt-2 cursor-pointer"
                >
                  Criar o primeiro agendamento
                </button>
              </div>
            )
            : (
              <div className="flex flex-col gap-3">
                {schedulings.map((s, i) => (
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

    </div>
  );
};

export default Dashboard;