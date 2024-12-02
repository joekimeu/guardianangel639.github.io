import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import Layout from '../layout';

const PrivateRoutes = () => {
  const { auth } = useContext(AuthContext);

  return auth.token ? <Layout /> : <Navigate to="/unauthorized" />;
};

export default PrivateRoutes;