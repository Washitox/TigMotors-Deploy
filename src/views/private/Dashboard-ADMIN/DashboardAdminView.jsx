import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./ui/Sidebar";
import HeaderAdmin from "./ui/HeaderAdmin";
import SoloDesktop from "./../SoloDesktop";
import Trabajos from "./ui/Trabajos";
import Usuarios from "./ui/Usuarios";
import SolicitudesTrabajo from "./ui/SolicitudesTrabajo";
import SolicitudesRegistro from "./ui/SolicitudesRegistro";
import RegistrarTrabajo from "./ui/RegistrarTrabajo";
import Perfil from "./ui/Perfil";
import Estatus from "./ui/Estatus";
import EstatusSolicitudes from "./ui/Estatus_solicitudes";
import EstatusTickets from "./ui/Estatus_tickets";
import { useMediaQuery } from "react-responsive";




export default function DashboardAdminView() {

  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar para dispositivos no móviles */}
      {!isMobile && <Sidebar />}
  
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <HeaderAdmin />
  
        {/* Gráficas */}
        <main className="p-6 overflow-y-auto">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-center md:text-left">Panel de Administrador</h1>
          <p className="mt-4 text-center md:text-left">
            Aquí puedes gestionar todos los trabajos como registrarlos y recibir solicitudes de trabajos.
            También con los usuarios puedes aprobarlos, eliminarlos o registrarlos.
            Las estadisticas se pueden visualizar en la pestaña de perfil.
          </p>
        </div>
  
          {/* Contenedor responsivo de gráficas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* Gráfica 1 */}
            <div className="flex justify-center items-center bg-gray-700 p-4 rounded-lg shadow-lg">
              <Estatus />
            </div>

            {/* Gráfica 2 */}
            <div className="flex justify-center items-center bg-gray-700 p-4 rounded-lg shadow-lg">
              <EstatusSolicitudes />
            </div>

            {/* Gráfica 3 */}
            <div className="flex justify-center items-center bg-gray-700 p-4 rounded-lg shadow-lg">
              <EstatusTickets />
            </div>
          </div>


          {/* Mostrar SoloDesktop solo en móviles */}
          {isMobile && (
            <div className="mt-8">
              <SoloDesktop />
            </div>
          )}
  
          {/* Rutas para contenido adicional en tablets y escritorio */}
          {!isMobile && (
            <Routes>
              <Route
                element={
                  <>
                    <Sidebar />
                  </>
                }
              >
                {/* Subroutes */}
                <Route path="/admin/trabajos" element={<Trabajos />} />
                <Route path="/admin/usuarios" element={<Usuarios />} />
                <Route path="/admin/solicitudes-trabajo" element={<SolicitudesTrabajo />} />
                <Route path="/admin/solicitudes-registro" element={<SolicitudesRegistro />} />
                <Route path="/admin/registrar-trabajo" element={<RegistrarTrabajo />} />
                <Route path="/admin/perfil" element={<Perfil />} />
              </Route>
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
  
  
}
