import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/dashboard',    label: 'Início',       end: true },
  { to: '/schedulings',  label: 'Agendamentos' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  const displayName = user?.name || user?.email || 'Conta';
  const initial = displayName.charAt(0).toUpperCase();

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

        {/* Menu de utilizador */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-medium">
              {initial}
            </div>
            <span className="text-xs text-gray-500 hidden sm:block max-w-[120px] truncate">
              {displayName}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-20">
              <button
                onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Perfil
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer"
              >
                Sair
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
