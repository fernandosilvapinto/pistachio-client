import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Preenche todos os campos.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('As passwords não coincidem.');
      return;
    }
    if (form.password.length < 6) {
      setError('A password deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true); setError('');
    try {
      await api.post('/auth/register', {
        name:     form.name,
        email:    form.email,
        password: form.password,
      });
      navigate('/login', { state: { registered: true } });
    } catch (e) {
      setError(e.message ?? 'Erro ao criar conta. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Header */}
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 text-white text-xl mb-4 cursor-pointer"
            onClick={() => navigate('/welcome')}
          >
            🔧
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Criar conta</h1>
          <p className="text-sm text-gray-400 mt-1">Regista-te para começar a agendar.</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
          <Input
            label="Nome completo"
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
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
          />
          <Input
            label="Confirmar password"
            type="password"
            value={form.confirm}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full justify-center mt-1"
          >
            {loading ? 'A criar conta…' : 'Criar conta'}
          </Button>
        </div>

        {/* Link para login */}
        <p className="text-center text-sm text-gray-400">
          Já tens conta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-gray-900 font-medium hover:underline cursor-pointer"
          >
            Entrar
          </button>
        </p>

        {/* Voltar */}
        <button
          onClick={() => navigate('/welcome')}
          className="text-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ← Voltar ao início
        </button>

      </div>
    </div>
  );
};

export default Register;