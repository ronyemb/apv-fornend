import { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/axios";
import useAuth from "../hooks/useAuth";

const PacientesContext = createContext();

export const PacientesProvider = ({ children }) => {
  const [pacientes, setPacientes] = useState([]);
  const [paciente, setPaciente] = useState({});
  const { auth } = useAuth();
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const obtenerPacientes = async () => {
      try {
        setCargando(true);

        const token = localStorage.getItem("token");

        if (!token) {
          setCargando(false);
          return;
        }

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await clienteAxios("/pacientes", config);
        // Ordenar por fecha createdAt
        data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setPacientes(data);

        setCargando(false);
      } catch (error) {
        console.log(error);
      }
    };

    // console.log(auth)

    obtenerPacientes();
    // if (auth && auth._id) {
    //   // Solo obtener pacientes si el usuario está autenticado
    //   obtenerPacientes();
    // } else {
    //   setPacientes([]); // Reiniciar pacientes cuando no hay un usuario autenticado
    // }
  }, [auth]);

  const guardarPaciente = async (paciente) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    if (paciente.id) {
      try {
        const { data } = await clienteAxios.put(
          `/pacientes/${paciente.id}`,
          paciente,
          config
        );

        const pacientesActualizado = pacientes.map((pacienteState) =>
          pacienteState._id === data._id ? data : pacienteState
        );
        setPacientes(pacientesActualizado);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data } = await clienteAxios.post(
          "/pacientes",
          paciente,
          config
        );
        const { createdAt, updatedAt, __v, ...pacienteAlmacenado } = data;
        setPacientes([pacienteAlmacenado, ...pacientes]);
      } catch (error) {
        console.log(error.response.data.msg);
      }
    }
  };

  const setEdicion = (paciente) => {
    setPaciente(paciente);
  };

  const eliminarPaciente = async (id) => {
    const confirmar = confirm("¿Confirmas que deseas eliminar ?");

    if (confirmar) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await clienteAxios.delete(`/pacientes/${id}`, config);

        const pacientesActualizado = pacientes.filter(
          (pacientesState) => pacientesState._id !== id
        );
        setPacientes(pacientesActualizado);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <PacientesContext.Provider
      value={{
        pacientes,
        guardarPaciente,
        setEdicion,
        paciente,
        eliminarPaciente,
        cargando,
      }}
    >
      {children}
    </PacientesContext.Provider>
  );
};

export default PacientesContext;
