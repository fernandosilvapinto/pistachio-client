import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import PublicLayout from '../components/layout/PublicLayout';
import ClientLayout from '../components/layout/ClientLayout';
import Welcome from '../pages/Welcome';
import Book from '../pages/Book';
import Callback from '../pages/Callback';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import SchedulingList from '../pages/schedulings/SchedulingList';
import NewScheduling from '../pages/schedulings/NewScheduling';
import NotFound from '../pages/NotFound';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>

        {/* Públicas. Marcar não exige conta — é aqui que o negócio acontece. */}
        <Route element={<PublicLayout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/book" element={<Book />} />
        </Route>

        {/* O regresso do Keeper, depois de entrar ou de se registar. */}
        <Route path="/callback" element={<Callback />} />

        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/welcome" replace />
          }
        />

        {/* De conta. Estas sim precisam de saber quem é a pessoa. */}
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
          <Route path="schedulings" element={<SchedulingList />} />
          <Route path="schedulings/new" element={<NewScheduling />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
