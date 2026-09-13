import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userManager } from '../auth/userManager';

// A troca só pode acontecer uma vez, por isso a promessa vive fora do
// componente: em desenvolvimento o StrictMode monta duas vezes, e a segunda
// chamada encontraria o código de autorização já gasto.
let exchange = null;

const Callback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!exchange) {
      exchange = userManager.signinRedirectCallback();
    }

    exchange
      .then((user) => {
        if (!active) return;
        navigate(user.state?.returnTo ?? '/dashboard', { replace: true });
      })
      .catch((err) => {
        if (!active) return;
        exchange = null;
        setError(err?.message ?? 'Não foi possível concluir a autenticação.');
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      {error ? (
        <div className="w-full max-w-sm text-center flex flex-col gap-3">
          <p className="text-sm text-gray-900">Não foi possível concluir o início de sessão.</p>
          <p className="text-xs text-gray-400">{error}</p>
          <button
            onClick={() => userManager.signinRedirect()}
            className="text-xs text-blue-600 hover:underline cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-400">A concluir o início de sessão…</p>
      )}
    </div>
  );
};

export default Callback;
