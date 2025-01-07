import React from "react";
import HeaderUsuario from "./ui/HeaderUsuario";
import SidebarUser from "./ui/SidebarUser";
import SoloDesktop from "../SoloDesktop"; // Importar SoloDesktop
import { useMediaQuery } from "react-responsive"; // Importar useMediaQuery

function DashboardUserView() {
  const isMobile = useMediaQuery({ maxWidth: 640 }); // Detectar si es móvil

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {isMobile ? (
        <div className="flex-1 flex flex-col">
          {/* Header del usuario */}
          <HeaderUsuario />

          {/* Contenido principal para móviles */}
          <main className="p-6">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h1 className="text-2xl font-bold">Panel de usuario</h1>
              <p className="mt-4">
                Aquí puedes gestionar tus trabajos, solicitar nuevos y ver tu perfil.
              </p>
            </div>

            {/* Mostrar SoloDesktop para móviles */}
            <div className="mt-6">
              <SoloDesktop />
            </div>
          </main>
        </div>
      ) : (
        <>
          {/* Sidebar del usuario */}
          <SidebarUser />

          {/* Contenido principal para escritorio */}
          <div className="flex-1 flex flex-col">
            {/* Header del usuario */}
            <HeaderUsuario />

            {/* Contenedor principal */}
            <main className="p-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h1 className="text-2xl font-bold">Panel de usuario</h1>
                <p className="mt-4">
                  Aquí puedes gestionar tus trabajos, solicitar nuevos y ver tu perfil.
                </p>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardUserView;
