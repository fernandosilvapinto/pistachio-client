import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/dashboard',    label: 'Início',       end: true },
  { to: '/services',     label: 'Serviços' },
  { to: '/schedulings',  label: 'Agendamentos' },
  { to: '/profile',      label: 'Perfil' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs">
            🌱
          </div>
          <span className="text-sm font-semibold text-gray-900">Pistachio</span>
        </div>

        {/* Navegação */}
        <nav className="flex items-center gap-1">
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `
                px-3 py-1.5 rounded-lg text-sm transition-colors duration-150
                ${isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
              `}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Utilizador */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:block">
            {user?.email ?? ''}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            Sair →
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;