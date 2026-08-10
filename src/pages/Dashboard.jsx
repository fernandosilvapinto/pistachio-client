import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import SchedulingCard from '../components/ui/SchedulingCard';

const fmtEur = (n) => `€${Number(n ?? 0).toFixed(2)}`;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schedulings, setSchedulings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, sv] = await Promise.all([
        api.get('/schedulings/mine').catch(() => []),
        api.get('/services').catch(() => []),
      ]);

      const upcoming = (Array.isArray(s) ? s : [])
        .filter(x => x.scheduledDate && new Date(x.scheduledDate) >= new Date())
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
        .slice(0, 3);

      setSchedulings(upcoming);
      setServices(Array.isArray(sv) ? sv.filter(x => x.isActive && x.isFeatured) : []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="flex flex-col gap-8">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Início</h1>
          <p className="text-sm text-gray-400 mt-1">
            Olá, {user?.name ?? user?.email ?? 'Cliente'} 👋
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/schedulings/new')}>
          + Novo agendamento
        </Button>
      </div>

      {/* Próximos agendamentos */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700">Próximos agendamentos</h2>
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
                <p className="text-sm text-gray-400">Sem agendamentos marcados.</p>
                <button
                  onClick={() => navigate('/schedulings/new')}
                  className="text-sm text-blue-600 hover:underline mt-2 cursor-pointer"
                >
                  Criar um agendamento
                </button>
              </div>
            )
            : (
              <div className="flex flex-col gap-3">
                {schedulings.map((s, i) => (
                  <SchedulingCard key={i} scheduling={s} />
                ))}
              </div>
            )
        }
      </div>

      {/* Serviços em destaque — CTA para nova marcação */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-gray-700">Serviços em destaque</h2>

        {services.length === 0
          ? null
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map(s => (
                <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.name}</p>
                    {s.description && (
                      <p className="text-xs text-gray-400 mt-1">{s.description}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">{fmtEur(s.price)}</p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('/schedulings/new', { state: { serviceId: s.id, serviceName: s.name } })}
                    >
                      Agendar
                    </Button>
                  </div>
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