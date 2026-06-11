import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const ClientLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
