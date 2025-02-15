import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import HeaderAdmin from "./HeaderAdmin";
import Estatus from "./Estatus";
import { FaSpinner } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import SoloDesktop from "./../../SoloDesktop";

export default function SolicitudesRegistro() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getToken = () => localStorage.getItem("authToken");

  const fetchSolicitudes = async () => {
    try {
      setIsFetching(true);
      const token = getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/usuarios-pendientes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSolicitudes(response.data);
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
      setErrorMessage("Error al cargar las solicitudes o no existen solicitudes");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleSearch = () => {
    return solicitudes.filter((solicitud) => {
      const matchesId = solicitud.id
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesUsername = solicitud.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesId || matchesUsername;
    });
  };

  const handleAccept = async (id) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsFetching(true);
    try {
      const token = getToken();
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/usuarios/aprobar/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSolicitudes((prev) =>
        prev.filter((solicitud) => solicitud.id !== id)
      );
      setSuccessMessage("Usuario aprobado correctamente.");
    } catch (error) {
      console.error("Error al aceptar usuario:", error);
      setErrorMessage("Error al aprobar el usuario.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async (id) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsFetching(true);
  
    try {
      const token = getToken(); // Obtén el token del almacenamiento local
  
      // Realiza la solicitud DELETE
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/eliminar-usuarios`, 
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { param: id },
        }
      );
  
      // Actualiza la lista de solicitudes después de eliminar
      setSolicitudes((prev) => prev.filter((solicitud) => solicitud.id !== id));
  
      // Mensaje de éxito
      setSuccessMessage("Usuario eliminado correctamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
  
      // Manejo de errores
      setErrorMessage(
        error.response?.data?.message || "Error al eliminar el usuario."
      );
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setIsFetching(false);
    }
  };
  

  const filteredSolicitudes = handleSearch();
  const totalPages = Math.ceil(filteredSolicitudes.length / entries);
  const indexOfLastEntry = currentPage * entries;
  const indexOfFirstEntry = indexOfLastEntry - entries;
  const currentSolicitudes = filteredSolicitudes.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  return (
    <div>
    {isDesktop ? (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex flex-col">
        <HeaderAdmin />
        <main className="p-6">
          <div className="flex flex-wrap justify-between mb-6">
            <div className="w-auto p-3 bg-gray-700 rounded-lg" style={{ height: "410px" }}>
              
              <Estatus />
            </div>

            <div className="flex-1 bg-gray-800 p-6 rounded-lg ml-4">
              <div className="flex justify-between items-center mb-4">
                
                <button
                  onClick={fetchSolicitudes}
                  disabled={isFetching}
                  className={`py-2 px-4 rounded ${
                    isFetching
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {isFetching ? <FaSpinner className="animate-spin" /> : "Recargar"}
                </button>
              </div>

              {errorMessage && (
                <div className="text-red-500 text-center mb-4">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="text-green-500 text-center mb-4">
                  {successMessage}
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <div>
                  <label htmlFor="entries" className="mr-2">
                    Mostrar:
                  </label>
                  <select
                    id="entries"
                    value={entries}
                    onChange={(e) => setEntries(Number(e.target.value))}
                    className="bg-gray-700 text-white p-2 rounded"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Buscar por ID o Nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded"
                />
              </div>

              <div className="overflow-x-auto overflow-y-auto max-h-[400px] relative border rounded-lg">
                <table className="w-full text-left border">
                  <thead className="bg-gray-900 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Usuario</th>
                      <th className="p-3">Empresa</th>
                      <th className="p-3">Correo</th>
                      <th className="p-3">Teléfono</th>
                      <th className="p-3">Rol</th>
                      <th className="p-3">Permiso</th>
                      <th className="p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSolicitudes.map((solicitud, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}
                      >
                        <td className="p-3">{solicitud.id}</td>
                        <td className="p-3">{solicitud.username}</td>
                        <td className="p-3">{solicitud.businessName}</td>
                        <td className="p-3">{solicitud.email}</td>
                        <td className="p-3">{solicitud.phoneNumber}</td>
                        <td className="p-3">{solicitud.role}</td>
                        <td className="p-3">{solicitud.permiso ? "Sí" : "No"}</td>
                        <td className="p-3 flex space-x-2">
                          <button
                            onClick={() => handleAccept(solicitud.id)}
                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => handleDelete(solicitud.id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span>
                  Mostrando {indexOfFirstEntry + 1} -{" "}
                  {Math.min(indexOfLastEntry, filteredSolicitudes.length)} de{" "}
                  {filteredSolicitudes.length} entradas
                </span>
                <div className="flex space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
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
