import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email) { setError('Indica o teu email.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (e) {
      setError(e.message ?? 'Erro ao pedir reposição de password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-6">

        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 text-white text-xl mb-4 cursor-pointer"
            onClick={() => navigate('/welcome')}
          >
            🔧
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Repor password</h1>
          <p className="text-sm text-gray-400 mt-1">Indica o teu email e enviamos um link para definires uma nova password.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
          {sent ? (
            <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              Se o email existir na nossa base de dados, vais receber um link em breve.
            </p>
          ) : (
            <>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="o-teu-email@exemplo.com"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full justify-center mt-1"
              >
                {loading ? 'A enviar…' : 'Enviar link'}
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => navigate('/login')}
          className="text-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ← Voltar ao login
        </button>

      </div>
    </div>
  );
};

export default ForgotPassword;
