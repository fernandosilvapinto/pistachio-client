import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import PublicLayout from '../components/layout/PublicLayout';
import ClientLayout from '../components/layout/ClientLayout';
import Welcome from '../pages/Welcome';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Services from '../pages/Services';
import SchedulingList from '../pages/schedulings/SchedulingList';
import NewScheduling from '../pages/schedulings/NewScheduling';
import NotFound from '../pages/NotFound';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>

        {/* Rotas públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/welcome" element={<Welcome />} />
        </Route>

        {/* Login */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Raiz — redireciona conforme estado */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/welcome" replace />}
        />

        {/* Rotas privadas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ClientLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="services" element={<Services />} />
          <Route path="schedulings" element={<SchedulingList />} />
          <Route path="schedulings/new" element={<NewScheduling />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;