import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useAuth from "../hooks/useAuth";

const RutaProtegida = () => {
  const { auth, cargando } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cargando && (!auth || !auth._id)) {
      navigate('/');
    }
  }, [auth, cargando, navigate]);

  if (cargando) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Header />
      {auth && auth._id && (
        <main className="container mx-auto mt-10 pl-2">
          <Outlet />
        </main>
      )}
      <Footer />
    </>
  );
};

export default RutaProtegida;
