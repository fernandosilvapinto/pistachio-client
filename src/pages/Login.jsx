import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const registered = location.state?.registered;
  const { serviceId, serviceName } = location.state ?? {};

  const handleSubmit = async () => {
    if (!email || !password) { setError('Preenche todos os campos.'); return; }
    setLoading(true); setError('');
    try {
      const data = await api.post('/auth/login', { email, password });
      login(data.token, { id: data.userId, name: data.name, email: data.email, role: data.role });
      if (serviceId) {
        navigate('/schedulings/new', { state: { serviceId, serviceName } });
      } else {
        navigate('/dashboard');
      }
    } catch {
      setError('Credenciais inválidas. Tenta novamente.');
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
          <h1 className="text-xl font-semibold text-gray-900">Bem-vindo de volta</h1>
          <p className="text-sm text-gray-400 mt-1">Entra na tua conta para gerir os teus agendamentos.</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="o-teu-email@exemplo.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
          />
          {registered && (
            <p className="text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              Conta criada com sucesso! Entra com as tuas credenciais.
            </p>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full justify-center mt-1"
          >
            {loading ? 'A entrar…' : 'Entrar'}
          </Button>
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            Esqueci-me da password
          </button>
        </div>

        {/* Link para registo */}
        <p className="text-center text-sm text-gray-400">
          Ainda não tens conta?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-gray-900 font-medium hover:underline cursor-pointer"
          >
            Regista-te gratuitamente
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

export default Login;