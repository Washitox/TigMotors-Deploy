import React, { useEffect, useState } from "react";
import HeaderUsuario from "./HeaderUsuario";
import SidebarUser from "./SidebarUser";
import axios from "axios";
import { FaEye, FaEyeSlash, FaPencilAlt } from "react-icons/fa";
import { Spinner } from 'keep-react';
import { useNavigate } from "react-router-dom";

function PerfilUser() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    businessName: "",
    email: "",
    phoneNumber: "",
  });
  const [editableFields, setEditableFields] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    repeatNewPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState(""); // Contraseña para eliminar cuenta
  const [confirmDelete, setConfirmDelete] = useState(false); // Checkbox para confirmar
  const navigate = useNavigate();



  const getToken = () => localStorage.getItem("authToken");

  const fetchUserInfo = async () => {
    setIsLoading(true); 
    try {
      const token = getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/informacion-usuario`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handlePasswordChange = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true); // Inicia el spinner
  
    if (passwords.newPassword !== passwords.repeatNewPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      setIsLoading(false); // Detiene el spinner
      return;
    }
  
    const requestData = {
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    };
  
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        setIsLoading(false);
        return;
      }
  
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/cambiar-contrasena`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      setSuccessMessage("Contraseña cambiada exitosamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
      setPasswords({ currentPassword: "", newPassword: "", repeatNewPassword: "" });
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      setErrorMessage(
        error.response?.data?.message || "Error al cambiar la contraseña."
      );
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setIsLoading(false); // Detiene el spinner
    }
  };
  

  const handleEditField = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: userInfo[field],
    }));
    setIsEditing(true);
  };

  const handleFieldChange = (field, value) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleDeleteAccount = async () => {
    if (!deletePassword || !confirmDelete) {
      setErrorMessage("Debe ingresar la contraseña y confirmar para eliminar.");
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }
  
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicie sesión nuevamente.");
        return;
      }
  
      setIsLoading(true); // Activa el estado de carga
  
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/eliminar-cuenta`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { password: deletePassword },
        }
      );
  
      if (response.status === 200) {
        setSuccessMessage("Cuenta eliminada exitosamente.");
        setShowDeleteModal(false);
  
        // Espera 3 segundos antes de redirigir al usuario
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        throw new Error("Error desconocido al eliminar la cuenta.");
      }
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
  
      // Muestra un mensaje de error personalizado si el servidor devuelve un error
      setErrorMessage(
        error.response?.data?.message || "No se pudo eliminar la cuenta."
      );
    } finally {
      // Desactiva el estado de carga al finalizar
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };
  

  const handleSaveField = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }

      for (const [key, value] of Object.entries(editableFields)) {
        const requestData = { [key]: value };
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api-user/actualizar-informacion`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      setSuccessMessage("Información actualizada exitosamente.");
      setTimeout(() => setErrorMessage(null), 3000);
      setEditableFields({});
      setIsEditing(false);
      fetchUserInfo();
    } catch (error) {
      console.error("Error al actualizar la información:", error);
      setErrorMessage(
        error.response?.data?.message || "Error al actualizar la información."
      );
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar del usuario */}
      <SidebarUser />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header del usuario */}
        <HeaderUsuario />

        {/* Contenido del perfil */}
        <main className="p-6">

          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto">
          {isLoading && (
              <div className="flex justify-center my-4">
                <Spinner /> {/* Muestra el spinner */}
              </div>
            )}
            <h1 className="text-2xl font-bold mb-4 text-center">Perfil del Usuario</h1>

            {/* Información del perfil */}
            <div className="space-y-4">
              {["businessName", "email", "phoneNumber"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-400">
                    {field === "businessName"
                      ? "Empresa"
                      : field === "email"
                      ? "Correo Electrónico"
                      : "Teléfono"}
                  </label>
                  <div className="flex items-center gap-2">
                    {editableFields[field] !== undefined ? (
                      <input
                        type="text"
                        value={editableFields[field]}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                      />
                    ) : (
                      <div className="p-3 bg-gray-700 rounded-md flex-1">
                        {userInfo[field] || "N/A"}
                      </div>
                    )}
                    <button
                      onClick={() =>
                        editableFields[field] !== undefined
                          ? handleSaveField()
                          : handleEditField(field)
                      }
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <FaPencilAlt />
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-400">Nombre</label>
                <div className="p-3 bg-gray-700 rounded-md flex-1">
                  {userInfo.username || "N/A"}
                </div>
              </div>
            </div>


            {/* Botón de guardar */}
            {isEditing && (
              <div className="mt-6">
                <button
                  onClick={handleSaveField}
                  className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 rounded-md text-white font-semibold"
                >
                  Guardar Información
                </button>
              </div>
            )}

            {/* Mensajes */}
            {successMessage && (
              <p className="text-green-500 mt-4 text-center">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
            )}

            {/* Opciones de acciones */}
            <div className="mt-6 space-y-4">
              <button
                className="w-full py-2 px-4 bg-yellow-400 hover:bg-yellow-400 rounded-md text-white font-semibold"
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                Cambiar Contraseña
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 rounded-md text-white font-semibold"
              >
                Eliminar Cuenta
              </button>
            </div>

            {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-center text-white mb-4">
                  Eliminar Cuenta
                </h2>
                <p className="text-gray-400 text-center mb-4">
                  Por favor, ingrese su contraseña para confirmar la eliminación de la cuenta.
                </p>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 mb-4"
                  placeholder="Contraseña actual"
                />
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={confirmDelete}
                    onChange={() => setConfirmDelete(!confirmDelete)}
                    className="mr-2"
                  />
                  <label className="text-gray-400">Confirmo que deseo eliminar mi cuenta.</label>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 rounded text-white"
                >
                  Eliminar Cuenta
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 rounded text-white mt-2"
                >
                  Cancelar
                </button>
                {errorMessage && (
                  <p className="text-red-500 text-sm text-center mt-4">{errorMessage}</p>
                )}
                {successMessage && (
                  <p className="text-green-500 text-sm text-center mt-4">{successMessage}</p>
                )}
              </div>
            </div>
          )}



            {/* Formulario de cambiar contraseña */}
            {showChangePassword && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4 text-center">Cambiar Contraseña</h2>
                <div className="space-y-4">
                  {["currentPassword", "newPassword", "repeatNewPassword"].map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-400">
                        {key === "currentPassword"
                          ? "Contraseña Actual"
                          : key === "newPassword"
                          ? "Nueva Contraseña"
                          : "Repetir Nueva Contraseña"}
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords[key] ? "text" : "password"}
                          value={passwords[key]}
                          onChange={(e) =>
                            setPasswords({ ...passwords, [key]: e.target.value })
                          }
                          className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              [key]: !prev[key],
                            }))
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                        >
                          {showPasswords[key] ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handlePasswordChange}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Verificar y Cambiar Contraseña
                  </button>
                  {successMessage && (
                    <p className="text-green-500 mt-4 text-center">{successMessage}</p>
                  )}
                  {errorMessage && (
                    <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PerfilUser;
