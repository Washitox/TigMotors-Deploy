import React, { useState, useEffect } from "react";
import HeaderUsuario from "./HeaderUsuario";
import SidebarUser from "./SidebarUser";
import axios from "axios";
import SoloDesktop from "./../../SoloDesktop";
import { useMediaQuery } from "react-responsive";

export default function ComprobantesUser() {
  const [facturas, setFacturas] = useState([]);
  const [estadoPago, setEstadoPago] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  const getToken = () => localStorage.getItem("authToken");

  // Función para obtener todas las facturas
  const fetchFacturas = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicie sesión nuevamente.");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/historial-facturas`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFacturas(response.data);
      setErrorMessage(null); // Limpiar mensajes de error
    } catch (error) {
      console.error("Error al obtener facturas:", error);
      setErrorMessage("No se pudieron cargar las facturas.");
    }
  };

  // Función para obtener facturas según estado de pago
  const fetchFacturasByEstado = async (estado) => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicie sesión nuevamente.");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/filtrar-por-estado?estadoPago=${estado}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFacturas(response.data);
      setErrorMessage(null); // Limpiar mensajes de error
    } catch (error) {
      console.error("Error al filtrar facturas por estado:", error);
      setErrorMessage("No se pudieron cargar las facturas por estado de pago.");
    }
  };

  // Manejar el cambio de estado de pago
  const handleEstadoPagoChange = (estado) => {
    setEstadoPago(estado);
    if (estado) {
      fetchFacturasByEstado(estado);
    } else {
      fetchFacturas(); // Si no hay estado seleccionado, cargar todas
    }
  };

  // Paginación
  const totalPages = Math.ceil(facturas.length / itemsPerPage);
  const paginatedFacturas = facturas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Efecto inicial para cargar todas las facturas
  useEffect(() => {
    fetchFacturas();
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
                  <h1 className="text-2xl font-bold">Historial de Comprobantes</h1>
                  <button
                    onClick={fetchFacturas}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Recargar
                  </button>
                </div>

                {/* Filtro por estado de pago */}
                <div className="mb-4">
                  <label htmlFor="estadoPago" className="block text-sm font-medium">
                    Estado de Pago
                  </label>
                  <select
                    id="estadoPago"
                    value={estadoPago}
                    onChange={(e) => handleEstadoPagoChange(e.target.value)}
                    className="bg-gray-700 text-white p-2 rounded border border-gray-600"
                  >
                    <option value="">Todos</option>
                    <option value="PENDIENTE_PAGO">Pendiente de Pago</option>
                    <option value="VALOR_PAGADO">Valor Pagado</option>
                  </select>
                </div>

                {/* Tabla de comprobantes */}
                <div className="overflow-x-auto overflow-y-auto max-h-[400px] relative border rounded-lg">
                  <table className="w-full text-left rounded-lg">
                    <thead className="bg-gray-900 sticky top-0 z-10">
                      <tr>
                        <th className="p-3">Comprobante ID</th>
                        <th className="p-3">ID Ticket</th>
                        <th className="p-3">Prioridad</th>
                        <th className="p-3">Descripción inicial</th>
                        <th className="p-3">Descripción del Trabajo</th>
                        <th className="p-3">Cotización</th>
                        <th className="p-3">Estado de Pago</th>
                        <th className="p-3">Fecha de Creación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedFacturas.map((factura, idx) => (
                        <tr
                          key={factura.comprobanteId}
                          className={idx % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}
                        >
                          <td className="p-3">{factura.comprobanteId || "N/A"}</td>
                          <td className="p-3">{factura.ticketId || "N/A"}</td>
                          <td className="p-3">{factura.prioridad || "N/A"}</td>
                          <td className="p-3">{factura.descripcionInicial || "N/A"}</td>
                          <td className="p-3">{factura.descripcionTrabajo || "N/A"}</td>
                          <td className="p-3">{factura.cotizacion || "N/A"}</td>
                          <td className="p-3">{factura.estadoPago || "N/A"}</td>
                          <td className="p-3">
                            {factura.fechaCreacion
                              ? new Date(factura.fechaCreacion).toLocaleDateString()
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
                    Mostrando{" "}
                    {Math.min(
                      currentPage * itemsPerPage - itemsPerPage + 1,
                      facturas.length
                    )}{" "}
                    - {Math.min(currentPage * itemsPerPage, facturas.length)} de{" "}
                    {facturas.length} entradas
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
