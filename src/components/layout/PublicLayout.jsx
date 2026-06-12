import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const PublicLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white text-sm">
              🔧
            </div>
            <span className="text-sm font-semibold text-gray-900">Pistachio Moto</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Entrar
            </Button>
            <Button variant="primary" onClick={() => navigate('/register')}>
              Registar
            </Button>
          </div>
        </div>
      </header>

      <Outlet />

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-24">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center text-white text-xs">
              🔧
            </div>
            <span className="text-sm font-medium text-gray-700">Pistachio Moto</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 Pistachio Moto. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
};

export default PublicLayout;