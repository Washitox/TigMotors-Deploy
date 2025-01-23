import React, { useState, useEffect } from "react";
import HeaderUsuario from "./HeaderUsuario";
import SidebarUser from "./SidebarUser";
import axios from "axios";
import SoloDesktop from "./../../SoloDesktop";
import { useMediaQuery } from "react-responsive";


function TrabajosUser() {
  const [trabajos, setTrabajos] = useState([]);
  const [prioridadFilter, setPrioridadFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const isDesktop = useMediaQuery({ minWidth: 1025 });
  const [originalTrabajos, setOriginalTrabajos] = useState([]);



  const getToken = () => localStorage.getItem("authToken");
  
  const handlePrioridadChange = (prioridad) => {
    setPrioridadFilter(prioridad);
    applyFilters({ prioridad, estado: estadoFilter }); // Aplica ambos filtros
  };
  
  const handleEstadoChange = (estado) => {
    setEstadoFilter(estado);
    applyFilters({ prioridad: prioridadFilter, estado }); // Aplica ambos filtros
  };

  const applyFilters = ({ prioridad, estado }) => {
    let filteredData = [...originalTrabajos]; // Siempre parte de los datos originales
  
    if (prioridad) {
      filteredData = filteredData.filter((trabajo) => trabajo.prioridad === prioridad);
    }
  
    if (estado) {
      filteredData = filteredData.filter((trabajo) => trabajo.estado === estado);
    }
  
    setTrabajos(filteredData); // Actualiza los trabajos con los datos filtrados
  };
  
  

  // Función para obtener todos los trabajos
  const fetchTrabajos = async () => {
    try {
      // Restablecer los filtros antes de recargar
      setPrioridadFilter(""); // Reinicia prioridad a "Todas"
      setEstadoFilter(""); // Reinicia estado a "Todos"
  
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicie sesión nuevamente.");
        return;
      }
  
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/historial-tickets`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setOriginalTrabajos(response.data); // Recarga todos los datos originales
      setTrabajos(response.data); // Inicializa la tabla con todos los datos
      setErrorMessage(null); // Limpiar mensajes de error
      setCurrentPage(1); // Restablecer a la primera página
    } catch (error) {
      console.error("Error al obtener trabajos:", error);
      setErrorMessage("No se pudieron cargar los trabajos.");
    }
  };
  
  

  // Paginación
  const totalPages = Math.ceil(trabajos.length / itemsPerPage);
  const paginatedTrabajos = trabajos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Efecto inicial para cargar todos los trabajos
  useEffect(() => {
    fetchTrabajos();
  }, []);  

  return (
    <div>
    {isDesktop ? (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar del usuario */}
      <SidebarUser />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header del usuario */}
        <HeaderUsuario />

        {/* Contenedor principal */}
        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Historial de Trabajos</h1>
              <button
                onClick={fetchTrabajos}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Recargar
              </button>
            </div>

            {/* Filtros superiores */}
            <div className="flex justify-between items-center mb-4 gap-4">
              {/* Filtro por prioridad */}
              <div>
                <label htmlFor="prioridadFilter" className="block text-sm font-medium">
                  Prioridad
                </label>
                <select
                  id="prioridadFilter"
                  value={prioridadFilter}
                  onChange={(e) => handlePrioridadChange(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded border border-gray-600"
                >
                  <option value="">Todas</option>
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Media</option>
                  <option value="BAJA">Baja</option>
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label htmlFor="estadoFilter" className="block text-sm font-medium">
                  Estado
                </label>
                <select
                  id="estadoFilter"
                  value={estadoFilter}
                  onChange={(e) => handleEstadoChange(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded border border-gray-600"
                >
                  <option value="">Todos</option>
                  <option value="TRABAJO_PENDIENTE">Pendiente</option>
                  <option value="TRABAJO_EN_PROGRESO">En Progreso</option>
                  <option value="TRABAJO_TERMINADO">Terminado</option>
                </select>
              </div>

              {/* Selección de elementos por página */}
              <div>
                <label htmlFor="itemsPerPage" className="block text-sm font-medium">
                  Mostrar
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-gray-700 text-white p-2 rounded border border-gray-600"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
            </div>

            {/* Tabla de trabajos */}
            <div className="overflow-x-auto overflow-y-auto max-h-[400px] relative border rounded-lg">
              <table className="w-full text-left rounded-lg">
                <thead className="bg-gray-900 sticky top-0 z-10">
                  <tr>
                    <th className="p-3">ID Ticket</th>
                    <th className="p-3">ID Solicitud</th>
                    <th className="p-3">Prioridad</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Descripción Inicial</th>
                    <th className="p-3">Descripción del Trabajo</th>
                    <th className="p-3">Fecha de Creación</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTrabajos.map((trabajo, idx) => (
                    <tr
                      key={trabajo.id}
                      className={idx % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}
                    >
                      <td className="p-3">{trabajo.id || "N/A"}</td>
                      <td className="p-3">{trabajo.solicitudId || "N/A"}</td>
                      <td className="p-3">{trabajo.prioridad || "N/A"}</td>
                      <td className="p-3">{trabajo.estado || "N/A"}</td>
                      <td className="p-3">{trabajo.descripcionInicial || "N/A"}</td>
                      <td className="p-3">{trabajo.descripcionTrabajo || "N/A"}</td>
                      <td className="p-3">
                        {trabajo.fechaCreacion
                          ? new Date(trabajo.fechaCreacion).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-400">
                Mostrando {Math.min(currentPage * itemsPerPage - itemsPerPage + 1, trabajos.length)} -{" "}
                {Math.min(currentPage * itemsPerPage, trabajos.length)} de {trabajos.length} entradas
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>

            {/* Mensajes de error */}
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          </div>
        </main>
      </div>
    </div>
    ) : (
      <SoloDesktop />
    )}
  </div>
  );
}

export default TrabajosUser;
