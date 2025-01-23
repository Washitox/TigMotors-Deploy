import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import HeaderAdmin from "./HeaderAdmin";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import SoloDesktop from "./../../SoloDesktop";

function SolicitudesTrabajo() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Paginación
  const [rowsPerPage, setRowsPerPage] = useState(10); // Filas por página
  const [filterPriority, setFilterPriority] = useState(""); // Filtro de prioridad
  const [showFilterBox, setShowFilterBox] = useState(false); // Mostrar caja de filtro

  const [editingRow, setEditingRow] = useState(null); // Fila en edición
  const [editedValues, setEditedValues] = useState({}); // Valores editados

  const filterRef = useRef();
  const [message, setMessage] = useState({ text: "", type: "" });

  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  const fetchSolicitudes = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/historial-solicitudes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSolicitudes(response.data);
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
      setErrorMessage("Error al cargar las solicitudes.");
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = (idSolicitud) => {
    setEditingRow(idSolicitud);
    const solicitud = solicitudes.find((sol) => sol.idSolicitud === idSolicitud);
    setEditedValues({
      cotizacion: solicitud.cotizacion || "",
      descripcionTrabajo: solicitud.descripcionTrabajo || "",
    });
  };

  const handleSave = async (idSolicitud) => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }

      // Aceptar la solicitud primero
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/aceptar/${idSolicitud}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Enviar datos editados
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/anadir-cotizacion/${idSolicitud}`,
        {
          cotizacion: parseFloat(editedValues.cotizacion),
          descripcionTrabajo: editedValues.descripcionTrabajo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizar la fila en la tabla
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((solicitud) =>
          solicitud.idSolicitud === idSolicitud
            ? {
                ...solicitud,
                cotizacion: editedValues.cotizacion,
                descripcionTrabajo: editedValues.descripcionTrabajo,
              }
            : solicitud
        )
      );

      setEditingRow(null);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setErrorMessage("Error al guardar los datos.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleReject = async (idSolicitud) => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/rechazar-solicitud/${idSolicitud}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSolicitudes();
      setErrorMessage(null);
    } catch (error) {
      console.error("Error al rechazar la solicitud:", error);
      setErrorMessage("Error al rechazar la solicitud.");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleDelete = async (idSolicitud) => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/eliminar-solicitud/${idSolicitud}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSolicitudes();
      setErrorMessage(null);
    } catch (error) {
      console.error("Error al eliminar la solicitud:", error);
      setErrorMessage("Error al eliminar la solicitud.");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const filteredSolicitudes = solicitudes.filter((solicitud) => {
    const matchesSearch =
      solicitud.idSolicitud.toString().includes(searchTerm) ||
      solicitud.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      !filterPriority || solicitud.prioridad === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredSolicitudes.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredSolicitudes.length / rowsPerPage);


  return (
    <div>
    {isDesktop ? (
    <div className="flex flex-col h-screen bg-gray-900 text-white sm:flex-row">
      <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar compact={!isMobile} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <HeaderAdmin />

        <main className="p-6 flex-1 overflow-auto">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
              <h1 className="text-2xl font-bold">Solicitudes de Trabajo</h1>
              <button
                onClick={fetchSolicitudes}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Recargar
              </button>
            </div>

            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
              <div className="flex items-center gap-2">
                <label className="text-gray-400">Mostrar:</label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="bg-gray-700 text-white p-2 rounded"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Buscar por ID o Usuario"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded w-full sm:w-auto"
              />
              <div className="relative">
                <button
                  onClick={() => setShowFilterBox((prev) => !prev)}
                  className="ml-2 bg-gray-600 text-white p-1 rounded"
                >
                  ▼ Prioridad
                </button>
                {showFilterBox && (
                  <div
                    ref={filterRef}
                    className="absolute bg-gray-700 text-white p-3 rounded shadow-lg top-10"
                  >
                    <button
                      onClick={() => setFilterPriority("")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setFilterPriority("ALTA")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                    >
                      ALTA
                    </button>
                    <button
                      onClick={() => setFilterPriority("MEDIA")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                    >
                      MEDIA
                    </button>
                    <button
                      onClick={() => setFilterPriority("BAJA")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                      disabled={!solicitudes.some((solicitud) => solicitud.prioridad === "BAJA")}
                    >
                      BAJA
                    </button>
                  </div>
                )}
              </div>
              
            </div>
            

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
            {message.text && (
              <p
                className={`text-center mb-4 ${
                  message.type === "success" ? "text-green-500" : "text-red-500"
                }`}
              >
                {message.text}
              </p>
            )}
            <div className="overflow-x-auto max-h-[400px] border rounded-lg">
              <table className="w-full text-left text-sm md:text-base table-auto border-collapse">
                <thead className="bg-gray-900 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 truncate max-w-[200px]">ID Solicitud</th>
                    <th className="p-3 truncate max-w-[200px]">Usuario</th>
                    <th className="p-3 truncate max-w-[200px]">Descripción Inicial</th>
                    <th className="p-3 truncate max-w-[200px]">Descripción del Trabajo</th>
                    <th className="p-1 truncate max-w-[200px]">Estado</th>
                    <th className="p-3 truncate max-w-[200px]">Cotización</th>
                    <th className="p-1 truncate max-w-[200px]">Estado de Cotización</th>
                    <th className="p-3 truncate max-w-[200px]">Fecha</th>
                    <th className="p-3 w-64 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((solicitud, index) => (
                    <tr
                      key={solicitud.idSolicitud}
                      className={
                        index % 2 === 0 ? "bg-gray-600" : "bg-gray-700"
                      }
                    >
                      <td className="p-3">{solicitud.idSolicitud}</td>
                      <td className="p-3">{solicitud.username}</td>
                      <td className="p-3">{solicitud.descripcionInicial}</td>
                      <td className="p-3">
                        {editingRow === solicitud.idSolicitud ? (
                          <input
                            type="text"
                            name="descripcionTrabajo"
                            value={editedValues.descripcionTrabajo}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white py-1 px-3 rounded text-sm md:text-base"
                          />
                        ) : (
                          solicitud.descripcionTrabajo || "N/A"
                        )}
                      </td>
                      <td className="p-1">{solicitud.estado}</td>
                      <td className="p-3">
                        {editingRow === solicitud.idSolicitud ? (
                          <input
                            type="number"
                            name="cotizacion"
                            value={editedValues.cotizacion}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white py-1 px-3 rounded text-sm md:text-base"
                          />
                        ) : solicitud.cotizacion || "N/A"}
                      </td>
                      <td className="p-1">{solicitud.cotizacionAceptada || "No Aceptada"}</td>
                      <td className="p-3">{solicitud.fechaCreacion}</td>
                      <td className="p-3 flex justify-around items-center space-x-2">
                        {(solicitud.cotizacion === "N/A" || !solicitud.cotizacion) &&
                          editingRow !== solicitud.idSolicitud && (
                            <button
                              onClick={() => handleEdit(solicitud.idSolicitud)}
                              className="w-24 py-2 text-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded"
                            >
                              Editar
                            </button>
                          )}
                        {editingRow === solicitud.idSolicitud && (
                          <button
                            onClick={() => handleSave(solicitud.idSolicitud)}
                            className="w-24 py-2 text-center bg-green-500 hover:bg-green-600 text-white font-bold rounded"
                          >
                            Enviar
                          </button>
                        )}
                        {solicitud.cotizacionAceptada !== "COTIZACION_ACEPTADA" &&
                          solicitud.cotizacionAceptada !== "RECHAZO_COTIZACION_USUARIO" && (
                            <button
                              onClick={() => handleReject(solicitud.idSolicitud)}
                              className="w-24 py-2 text-center bg-red-500 hover:bg-red-600 text-white font-bold rounded"
                            >
                              Rechazar
                            </button>
                          )}
                        <button
                          onClick={() => handleDelete(solicitud.idSolicitud)}
                          className="w-24 py-2 text-center bg-gray-500 hover:bg-gray-600 text-white font-bold rounded"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-700 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <p>
                Página {currentPage} de {totalPages}
              </p>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-gray-700 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
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

export default SolicitudesTrabajo;
