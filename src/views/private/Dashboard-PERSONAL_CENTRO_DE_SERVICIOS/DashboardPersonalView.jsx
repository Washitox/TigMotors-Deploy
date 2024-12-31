import React from "react";
import SidebarPersonal from "./ui/SidebarPersonal";
import HeaderPersonal from "./ui/HeaderPersonal";
import EstatusTickets from "./ui/Estatus_tickets";

function DashboardPersonalView() {
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <SidebarPersonal />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderPersonal />

        {/* Contenedor principal */}
        <main className="p-6">
        <div className="bg-gray-800 p-6 rounded-lg">
            <h1 className="text-2xl font-bold text-white">Panel del personal de servicios</h1>
            <p className="mt-4 text-white">
              El servicio del personal es el contacto de los usuarios con la página, trabajos y generar reportes.
            </p>
          </div>
          <div className="flex justify-center items-center gap-8">
            {/* Gráfica 1 */}
            <div className="flex-1 max-w-lg h-[400px] p-6 bg-gray-700 rounded-lg shadow-lg flex flex-col justify-between">
              <EstatusTickets />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default DashboardPersonalView;
