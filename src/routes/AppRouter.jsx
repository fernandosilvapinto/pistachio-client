import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import Welcome from '../pages/Welcome';
import Book from '../pages/Book';
import ManageBooking from '../pages/ManageBooking';
import NotFound from '../pages/NotFound';

// Não há rotas privadas: ninguém aqui tem conta. Marcar é público, e gerir a
// própria marcação faz-se pela chave que vem no email, não por sessão.
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/book" element={<Book />} />
          <Route path="/marcacoes/:token" element={<ManageBooking />} />
        </Route>

        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
