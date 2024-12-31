import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./ui/Sidebar";
import HeaderAdmin from "./ui/HeaderAdmin";
import Trabajos from "./ui/Trabajos";
import Usuarios from "./ui/Usuarios";
import SolicitudesTrabajo from "./ui/SolicitudesTrabajo";
import SolicitudesRegistro from "./ui/SolicitudesRegistro";
import RegistrarTrabajo from "./ui/RegistrarTrabajo";
import Perfil from "./ui/Perfil";
import Estatus from "./ui/Estatus";
import EstatusSolicitudes from "./ui/Estatus_solicitudes";
import EstatusTickets from "./ui/Estatus_tickets";


export default function DashboardAdminView() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <HeaderAdmin />
        

        {/* Dynamic Content using Routes */}
        <main className="p-6 overflow-y-auto">

        <div className="bg-gray-800 p-6 rounded-lg">
            <h1 className="text-2xl font-bold">Panel de Administrador</h1>
            <p className="mt-4">
              Aquí puedes gestionar todos los trabajos como registarlos y recibir solicitudes de trabajos. También con los usuarios puedes aprobarlos, eliminarlos o registrarlos. Para comenzar seleciona una de las opciones de la izquierda.
            </p>
          </div>
          

          <div className="flex justify-between items-stretch gap-8">
            {/* Gráfica 1 */}
            <div className="flex-1 h-[400px] p-6 bg-gray-700 rounded-lg shadow-lg flex flex-col justify-between">

              <Estatus />
            </div>

            {/* Gráfica 2 */}
            <div className="flex-1 h-[400px] p-6 bg-gray-700 rounded-lg shadow-lg flex flex-col justify-between">

              <EstatusSolicitudes />
            </div>

            {/* Gráfica 3 */}
            <div className="flex-1 h-[400px] p-6 bg-gray-700 rounded-lg shadow-lg flex flex-col justify-between">

              <EstatusTickets />
            </div>
          </div>




          <Routes>
            {/* Wrapper for Topbar */}
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
        </main>
      </div>
    </div>
  );
}
