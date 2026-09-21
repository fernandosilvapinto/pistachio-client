import { Outlet, useNavigate } from 'react-router-dom';
import branding from '../../config/branding';

// Sem conta, não há nada para pôr no cabeçalho a não ser a marca. Quem
// precisa de gerir uma marcação já tem o link no email.
const PublicLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">

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
        </div>
      </header>

      <Outlet />

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
