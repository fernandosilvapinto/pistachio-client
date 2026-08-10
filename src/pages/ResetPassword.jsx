import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!token) { setError('Link inválido.'); return; }
    if (password.length < 6) { setError('A password deve ter pelo menos 6 caracteres.'); return; }
    if (password !== confirm) { setError('As passwords não coincidem.'); return; }

    setLoading(true); setError('');
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      navigate('/login', { state: { passwordReset: true } });
    } catch (e) {
      setError(e.message ?? 'Link inválido ou expirado.');
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
          <h1 className="text-xl font-semibold text-gray-900">Definir nova password</h1>
          <p className="text-sm text-gray-400 mt-1">Escolhe uma password para a tua conta.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
          {!token && (
            <p className="text-xs text-red-500">Link inválido — falta o token. Pede um novo link.</p>
          )}
          <Input
            label="Nova password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Input
            label="Confirmar password"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !token}
            className="w-full justify-center mt-1"
          >
            {loading ? 'A guardar…' : 'Definir password'}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
