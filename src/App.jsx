import { ToastProvider } from './context/ToastContext';
import AppRouter from './routes/AppRouter';

const App = () => {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
};

export default App;
