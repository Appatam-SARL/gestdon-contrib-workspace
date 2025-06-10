import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useFindByToken } from './hook/admin.hook';
import { IContributor } from './interface/contributor';
import useContributorStore from './store/contributor.store';
import useUserStore from './store/user.store';
import { IUser } from './types/user';

const ProtectedLayout = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Remplace par ta logique d’authentification

  // store
  const setUserStore = useUserStore((s) => s.setUserStore);
  const setContributorStore = useContributorStore((s) => s.setContributorStore);

  const { data } = useFindByToken();

  useEffect(() => {
    if (data?.success) {
      setUserStore('user', data?.user as IUser);
      setContributorStore('contributor', data?.contributor as IContributor);
    }
  }, [data]);

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return (
    <div>
      {/* Ici, tu peux ajouter un Navbar ou Sidebar si nécessaire */}
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
