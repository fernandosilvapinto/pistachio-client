import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import Button from '../components/ui/Button';

const fmtEur = (n) => `€${Number(n ?? 0).toFixed(2)}`;

const Welcome = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const s = await api.get('/services').catch(() => []);
      setServices(Array.isArray(s) ? s.filter(s => s.isActive) : []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div>

      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-full w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
            Oficina aberta — Seg a Sáb, 9h–18h
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight max-w-2xl">
            A tua moto em boas mãos.
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Manutenção, revisões e reparações por profissionais especializados.
            Agenda online em poucos minutos.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="primary"
              onClick={() => navigate('/register')}
              className="px-6 py-3 text-base"
            >
              Criar conta gratuita
            </Button>
            <button
              onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer px-4"
            >
              Ver serviços ↓
            </button>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="services" className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex flex-col gap-3 mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Os nossos serviços</h2>
          <p className="text-gray-500">Serviços especializados para a tua moto.</p>
        </div>

        {loading
          ? <p className="text-sm text-gray-400">A carregar serviços…</p>
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(s => (
                <div key={s.id} className="border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                      🔧
                    </div>
                    {s.isFeatured && (
                      <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                        Destaque
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{s.name}</p>
                    {s.description && (
                      <p className="text-sm text-gray-400 mt-1">{s.description}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <p className="text-lg font-semibold text-gray-900">{fmtEur(s.price)}</p>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate('/register')}
                    >
                      Agendar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </section>

      {/* Sobre */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white">
              📍
            </div>
            <p className="font-medium text-gray-900">Localização</p>
            <p className="text-sm text-gray-400">Rua das Motos, 123<br />Porto, Portugal</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white">
              🕐
            </div>
            <p className="font-medium text-gray-900">Horário</p>
            <p className="text-sm text-gray-400">Segunda a Sexta: 9h–18h<br />Sábado: 9h–13h</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white">
              📞
            </div>
            <p className="font-medium text-gray-900">Contacto</p>
            <p className="text-sm text-gray-400">+351 220 000 000<br />geral@pistachio.pt</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Welcome;