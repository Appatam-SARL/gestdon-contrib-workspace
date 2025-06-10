import { Navigate, Outlet } from 'react-router-dom';

const ProtectedLayoutOffline = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Remplace par ta logique d’authentification
  // const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
    3;
  }

  return (
    <div>
      {/* Ici, tu peux ajouter un Navbar ou Sidebar si nécessaire */}
      <Outlet />
    </div>
  );
};

export default ProtectedLayoutOffline;
