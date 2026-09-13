import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isSigningOut } from '../auth/userManager';

/**
 * Só as páginas de conta passam por aqui. O catálogo e a marcação como
 * convidado ficam de fora de propósito: exigir sessão para marcar é a forma
 * mais eficaz de não ter marcações.
 */
const PrivateRoute = ({ children }) => {
  const { status, signIn } = useAuth();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Uma saída em curso também passa por `anonymous`. Reagir a isso seria
    // mandar a pessoa entrar outra vez enquanto ela sai.
    if (status !== 'anonymous' || isSigningOut()) return;

    signIn(location.pathname + location.search).catch((err) => {
      setError(err?.message ?? String(err));
    });
  }, [status, signIn, location]);

  if (status === 'authenticated') {
    return children;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center flex flex-col gap-2">
          <p className="text-sm text-gray-900">Não foi possível iniciar sessão.</p>
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-sm text-gray-400">
        {status === 'loading' ? 'A verificar a sessão…' : 'A redirecionar…'}
      </p>
    </div>
  );
};

export default PrivateRoute;
