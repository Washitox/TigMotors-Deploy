import React, { useEffect, useState } from "react";
import SidebarPersonal from "./SidebarPersonal";
import HeaderPersonal from "./HeaderPersonal";
import axios from "axios";
import EstatusTickets from "./Estatus_tickets";

function PerfilPersonal() {
  const [staffInfo, setStaffInfo] = useState({
    username: "",
    businessName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const getToken = () => localStorage.getItem("authToken");

  const fetchStaffInfo = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/staff-cds/informacion-perfil`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStaffInfo(response.data);
    } catch (error) {
      console.error("Error al obtener la información del perfil:", error);
      setErrorMessage(
        "No se pudo cargar la información del perfil. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffInfo();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <SidebarPersonal />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderPersonal />

        {/* Contenido del perfil */}
        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-white">
              Información del Perfil
            </h1>
            {loading ? (
              <p className="text-center text-gray-400">Cargando información...</p>
            ) : errorMessage ? (
              <p className="text-center text-red-500">{errorMessage}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información básica del perfil */}
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                  <h2 className="text-lg font-bold mb-4 text-center">
                    Información Básica
                  </h2>
                  <table className="table-fixed w-full text-sm text-gray-200">
                    <tbody>
                      <tr>
                        <td className="p-2 font-bold w-1/3">Nombre:</td>
                        <td className="p-5">{staffInfo.username || "No disponible"}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold w-1/3">Empresa:</td>
                        <td className="p-5">{staffInfo.businessName || "No disponible"}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold w-1/3">Correo Electrónico:</td>
                        <td className="p-5">{staffInfo.email || "No disponible"}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold w-1/3">Teléfono:</td>
                        <td className="p-5">{staffInfo.phoneNumber || "No disponible"}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold w-1/3">Rol:</td>
                        <td className="p-5">{staffInfo.role || "No disponible"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Gráfica de Estado de Tickets */}
                <div className="bg-gray-700 p-4 rounded-lg shadow-md flex items-center justify-center">
                  <EstatusTickets />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PerfilPersonal;
