import React, { useState, useEffect } from "react";
import SidebarPersonal from "./SidebarPersonal";
import HeaderPersonal from "./HeaderPersonal";
import axios from "axios";
import { FaFilter, FaTrash } from "react-icons/fa";
import SoloDesktop from "./../../SoloDesktop";
import { useMediaQuery } from "react-responsive";

function EstadoPago() {
  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    username: "",
    estadoPago: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [usernames, setUsernames] = useState([]);
  const isDesktop = useMediaQuery({ minWidth: 1025 });
  const [selectedPago, setSelectedPago] = useState({});



  const getToken = () => localStorage.getItem("authToken");

  const formatDate = (date) => {
    if (!date) return null;
    const [year, month, day] = date.split("-");
    return `${year}/${month}/${day}`;
  };

  const fetchAllFacturas = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("No se encontró un token de autenticación.");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/staff-cds/listado-facturas`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFacturas(response.data);
      setFilteredFacturas(response.data);
    } catch (error) {
      console.error("Error al obtener las facturas:", error);
      setErrorMessage("No se pudieron cargar las facturas.");
    }
  };

  const handleFilter = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("No se encontró un token de autenticación.");
        return;
      }

      const payload = {};
      for (const [key, value] of Object.entries(formData)) {
        if (value) payload[key] = key.includes("fecha") ? formatDate(value) : value;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/staff-cds/listado-con-filtros`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const filteredData = response.data.facturas || [];
      setFilteredFacturas(filteredData);
      setSuccessMessage("Facturas filtradas con éxito.");
    } catch (error) {
      console.error("Error al filtrar las facturas:", error);
      setErrorMessage("No se pudieron filtrar las facturas.");
    }
  };

  const handleUpdatePago = async (facturaId) => {
    try {
      const nuevoEstado = selectedPago[facturaId];
      if (!nuevoEstado || nuevoEstado === "PENDIENTE_PAGO") {
        setErrorMessage("Debe seleccionar un nuevo estado válido.");
        return;
      }
  
      const token = getToken();
      if (!token) {
        setErrorMessage("No se encontró un token de autenticación.");
        return;
      }
  
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/staff-cds/${facturaId}/actualizar-pago`,
        { estadoPago: nuevoEstado }, // Enviar el nuevo estado
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setSuccessMessage(`Pago de la factura ${facturaId} actualizado con éxito.`);
      fetchAllFacturas(); // Refresca los datos después de actualizar
    } catch (error) {
      console.error(`Error al actualizar el pago de la factura ${facturaId}:`, error);
      setErrorMessage(`No se pudo actualizar el pago de la factura ${facturaId}.`);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFormData({
      fechaInicio: "",
      fechaFin: "",
      username: "",
      estadoPago: "",
    });
    setFilteredFacturas(facturas);
  };

  const fetchUsernames = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("No se encontró un token de autenticación.");
        return;
      }
  
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/staff-cds/lista-nombres-usuarios`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsernames(response.data); // Guardar la lista de nombres en el estado
    } catch (error) {
      console.error("Error al obtener los nombres de usuario:", error);
      setErrorMessage("No se pudieron cargar los nombres de usuario.");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };
  

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchAllFacturas();
    fetchUsernames();
  }, []);

  const totalPages = Math.ceil(filteredFacturas.length / itemsPerPage);
  const paginatedFacturas = filteredFacturas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
    {isDesktop ? (
    <div className="flex min-h-screen bg-gray-900">
      <SidebarPersonal />
      <div className="flex-1 flex flex-col">
        <HeaderPersonal />
        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-white mb-6">Estado de Pago</h1>

            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="text-sm text-gray-400 mr-2">Mostrar:</label>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="p-2 bg-gray-700 text-white rounded"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400">Fecha Inicio</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">Fecha Fin</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">Usuario</label>
                <select
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                >
                    <option value="">Seleccione un usuario</option>
                    {usernames.map((user, index) => (
                    <option key={index} value={user}>
                        {user}
                    </option>
                    ))}
                </select>
                </div>
              <div>
                <label className="block text-sm text-gray-400">Estado de Pago</label>
                <select
                  name="estadoPago"
                  value={formData.estadoPago}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                >
                  <option value="">Todos</option>
                  <option value="PENDIENTE_PAGO">Pendiente</option>
                  <option value="VALOR_PAGADO">Pagado</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={handleFilter}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                <FaFilter className="mr-2" /> Filtrar
              </button>
              <button
                onClick={handleClearFilters}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                <FaTrash className="mr-2" /> Limpiar
              </button>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
            {(errorMessage || successMessage) && (
            <div className="mb-4 text-center">
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}
            </div>
            )}
                <table className="w-full overflow-x-auto overflow-y-auto max-h-[400px] relative border rounded-lg ">
                    <thead className="bg-gray-900 text-white sticky top-0 z-10">
                    <tr>
                        <th className="p-3">ID Comprobante</th>
                        <th className="p-3">ID Ticket</th>
                        <th className="p-3">Usuario</th>
                        <th className="p-3">Descripción Inicial</th>
                        <th className="p-3">Descripción del Trabajo</th>
                        <th className="p-3">Estado del Ticket</th>
                        <th className="p-3">Cotización</th>
                        <th className="p-3">Estado de Pago</th>
                        <th className="p-3">Actualizar Pago</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedFacturas.map((factura, index) => (
                        <tr
                        key={factura.facturaId}
                        className={
                            index % 2 === 0
                            ? "bg-gray-600 text-white"
                            : "bg-gray-700 text-white"
                        }
                        >
                        <td className="p-2">{factura.comprobanteId}</td>
                        <td className="p-2">{factura.ticketId}</td>
                        <td className="p-2">{factura.username}</td>
                        <td className="p-2">{factura.descripcionInicial}</td>
                        <td className="p-2">{factura.descripcionTrabajo}</td>
                        <td className="p-2">{factura.estadoTicket}</td>
                        <td className="p-2">${factura.cotizacion}</td>

                        <td className="p-2">
                          {factura.estadoPago === "PENDIENTE_PAGO" ? (
                            <select
                              value={selectedPago[factura.comprobanteId] || factura.estadoPago}
                              onChange={(e) =>
                                setSelectedPago((prev) => ({
                                  ...prev,
                                  [factura.comprobanteId]: e.target.value,
                                }))
                              }
                              className="p-2 bg-gray-700 text-white rounded"
                            >
                              <option value="PENDIENTE_PAGO">PENDIENTE_PAGO</option>
                              <option value="VALOR_PAGADO">VALOR_PAGADO</option>
                            </select>
                          ) : (
                            "VALOR_PAGADO"
                          )}
                        </td>

                        <td className="p-2">
                          {factura.estadoPago === "PENDIENTE_PAGO" && (
                            <button
                              onClick={() => handleUpdatePago(factura.facturaId)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                              disabled={selectedPago[factura.facturaId] !== "VALOR_PAGADO"} // Habilita solo si se cambia a VALOR_PAGADO
                            >
                              Actualizar
                            </button>
                          )}
                        </td>


                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-white">
                    Mostrando {currentPage * itemsPerPage - itemsPerPage + 1} -{" "}
                    {Math.min(currentPage * itemsPerPage, filteredFacturas.length)}{" "}
                    de {filteredFacturas.length} entradas
                    </span>
                    <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        Siguiente
                    </button>
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

export default EstadoPago;
