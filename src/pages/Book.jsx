import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/client';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

const Book = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    serviceId: location.state?.serviceId ? String(location.state.serviceId) : '',
    scheduledDate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { isNewAccount }

  useEffect(() => {
    const load = async () => {
      const s = await api.get('/services').catch(() => []);
      setServices(Array.isArray(s) ? s.filter(s => s.isActive) : []);
    };
    load();
  }, []);

  const handleSubmit = async () => {
    if (!form.name)          { setError('O nome é obrigatório.');      return; }
    if (!form.email)         { setError('O email é obrigatório.');     return; }
    if (!form.serviceId)     { setError('Seleciona um serviço.');      return; }
    if (!form.scheduledDate) { setError('Escolhe uma data e hora.');   return; }

    setLoading(true); setError('');
    try {
      const data = await api.post('/schedulings/guest', {
        name:          form.name,
        email:         form.email,
        serviceId:     parseInt(form.serviceId),
        scheduledDate: new Date(form.scheduledDate).toISOString(),
      });
      setResult(data);
    } catch (e) {
      setError(e.message ?? 'Erro ao criar agendamento.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 flex flex-col gap-4 text-center">
        <div className="text-4xl">✅</div>
        <h1 className="text-2xl font-semibold text-gray-900">Agendamento confirmado!</h1>
        {result.isNewAccount ? (
          <p className="text-sm text-gray-500">
            Enviámos um email para <strong>{form.email}</strong> para definires uma password
            e acompanhares o teu agendamento.
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Já tens conta connosco — <button onClick={() => navigate('/login')} className="text-gray-900 font-medium hover:underline cursor-pointer">inicia sessão</button> para veres os detalhes.
          </p>
        )}
        <Button variant="primary" onClick={() => navigate('/welcome')} className="mt-4 mx-auto">
          Voltar ao início
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16 flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Marca a tua revisão</h1>
        <p className="text-sm text-gray-400 mt-1">Sem precisares de criar conta primeiro.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
        <Input
          label="Nome"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="O teu nome"
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          placeholder="o-teu-email@exemplo.com"
        />
        <Select
          label="Serviço"
          value={form.serviceId}
          onChange={e => setForm(f => ({ ...f, serviceId: e.target.value }))}
        >
          <option value="">— seleciona um serviço —</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>{s.name} — €{Number(s.price).toFixed(2)}</option>
          ))}
        </Select>
        <Input
          label="Data e hora"
          type="datetime-local"
          value={form.scheduledDate}
          onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {/* <Button variant="primary" onClick={handleSubmit} disabled={loading} className="w-full justify-center mt-1">
          {loading ? 'A agendar…' : 'Confirmar agendamento'}
        </Button> */}
        <p className="text-sm text-gray-400 mt-1">Opção temporariamente indisponível.</p>
      </div>

      <p className="text-center text-sm text-gray-400">
        Já tens conta?{' '}
        <button onClick={() => navigate('/login')} className="text-gray-900 font-medium hover:underline cursor-pointer">
          Entra para agendar mais rápido
        </button>
      </p>

      <button
        onClick={() => navigate('/welcome')}
        className="text-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        ← Voltar ao início
      </button>

    </div>
  );
};

export default Book;
