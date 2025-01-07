import React, { useState } from "react";
import axios from "axios";
import { Button } from "keep-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/TigMotors.png";
import Sidebar from "./Dashboard-ADMIN/ui/Sidebar";

export default function HeaderCierre() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Realiza la solicitud al endpoint de cerrar sesión
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/cerrar-sesion`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Envía el token en el header
        },
      });

      // Limpia el localStorage y redirige al usuario
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);

      // Maneja el caso de token expirado o endpoint fallido
      if (
        error.response?.status === 401 || // No autorizado (token inválido/expirado)
        error.response?.status === 403 || // Prohibido
        !error.response // Error de red o sin respuesta del servidor
      ) {
        // Forzar el cierre de sesión local
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        navigate("/");
      } else {
        // Otros errores
        console.error("No se pudo cerrar sesión correctamente.");
      }
    }
  };

  return (
    <header className="z-30 w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-2 rounded-2xl bg-gray-900/90 px-5 before:pointer-events-none before:absolute before:inset-1 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-sm">
          {/* Botón del Sidebar en móviles */}


          {/* Logo estático */}
          <div className="flex flex-1 items-center">
            <div className="flex items-center">
              <img
                src={logo}
                alt="Tig Motors Logo"
                className="rounded-full h-10"
              />
              <span className="ml-2 font-bold text-white">TigMotors</span>
            </div>
          </div>

          {/* Botón único de cerrar sesión */}
          <div className="flex items-center justify-end">
            <Button
              onClick={handleLogout}
              color="danger"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar desplegable (visible solo cuando isSidebarOpen es true) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75">
          <Sidebar />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-lg"
          >
            Cerrar
          </button>
        </div>
      )}
    </header>
  );
}
