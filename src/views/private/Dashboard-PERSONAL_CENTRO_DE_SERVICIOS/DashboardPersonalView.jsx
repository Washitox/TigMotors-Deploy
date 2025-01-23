import React from "react";
import SidebarPersonal from "./ui/SidebarPersonal";
import HeaderPersonal from "./ui/HeaderPersonal";
import EstatusTickets from "./ui/Estatus_tickets";
import SoloDesktop from "./../SoloDesktop"; // Importar SoloDesktop
import { useMediaQuery } from "react-responsive"; // Importar useMediaQuery

function DashboardPersonalView() {
  const isMobile = useMediaQuery({ maxWidth: 640 }); // Detectar si es móvil

  return (
    <div
      className={`flex ${
        isMobile ? "flex-col overflow-y-auto" : "h-screen overflow-hidden"
      } bg-gray-900`}
    >
      {!isMobile && <SidebarPersonal />}

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderPersonal />

        {/* Contenedor principal */}
        <main className={`p-6 ${isMobile ? "pb-6" : ""}`}>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h1 className="text-2xl font-bold text-white text-center">
              Panel del personal de servicios
            </h1>
            <p className="mt-4 text-white text-center">
              El servicio del personal es el contacto de los usuarios con la página, trabajos y generar reportes. 
              La estadistica de tickets se encuentra en la pestaña de perfil.
            </p>
          </div>

          {/* Contenido dinámico: gráfica y componente SoloDesktop */}
          <div
            className={`${
              isMobile
                ? "flex flex-col items-center gap-6 mt-6"
                : "flex justify-center items-center gap-8 mt-6"
            }`}
          >
            {/* Gráfica */}
            <div
              className={`w-full ${
                isMobile ? "h-[300px]" : "h-[500px] max-w-2xl"
              } bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col justify-between`}
              >
              <EstatusTickets />
            </div>


            {/* Componente SoloDesktop: solo en móvil */}
            {isMobile && (
              <div className="flex-1 w-full mt-6">
                <SoloDesktop />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPersonalView;
