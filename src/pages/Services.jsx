import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const fmtEur = (n) => `€${Number(n ?? 0).toFixed(2)}`;

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const s = await api.get('/services').catch(() => []);
      setServices(Array.isArray(s) ? s.filter(s => s.isActive) : []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p className="text-sm text-gray-400">A carregar…</p>;

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Serviços</h1>
        <p className="text-sm text-gray-400 mt-1">Consulta os serviços disponíveis.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.length === 0
          ? <p className="text-sm text-gray-400">Nenhum serviço disponível.</p>
          : services.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.name}</p>
                  {s.description && (
                    <p className="text-xs text-gray-400 mt-1">{s.description}</p>
                  )}
                </div>
                {s.isFeatured && <span className="text-base">⭐</span>}
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
          ))
        }
      </div>

    </div>
  );
};

export default Services;