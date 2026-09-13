import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import branding from '../../config/branding';
import { useAuth } from '../../context/AuthContext';

const PublicLayout = () => {
  const navigate = useNavigate();
  // Entrar e registar acontecem no Keeper, com a identidade visual desta marca
  // aplicada por tema. Esta aplicação nunca vê uma password, e por isso nunca
  // pode perder uma.
  const { isAuthenticated, signIn, signUp } = useAuth();

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/welcome')}
          >
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white text-sm">
              {branding.icon}
            </div>
            <span className="text-sm font-semibold text-gray-900">{branding.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                A minha conta
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => signIn('/dashboard')}>
                  Entrar
                </Button>
                <Button variant="primary" onClick={() => signUp('/dashboard')}>
                  Criar conta
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <Outlet />

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-24">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center text-white text-xs">
              {branding.icon}
            </div>
            <span className="text-sm font-medium text-gray-700">{branding.name}</span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {branding.name}. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default PublicLayout;