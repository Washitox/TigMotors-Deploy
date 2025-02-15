import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBriefcase, FaClipboard, FaUserPlus, FaCog, FaFileAlt } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation(); // Hook para obtener la ruta actual

  const menuItems = [
    { name: "Perfil", path: "/admin/perfil", icon: <FaCog /> },
    { name: "Trabajos", path: "/admin/trabajos", icon: <FaBriefcase /> },
    { name: "Usuarios", path: "/admin/usuarios", icon: <FaUserPlus /> },
    { name: "Solicitudes de Trabajo", path: "/admin/solicitudes-trabajo", icon: <FaClipboard /> },
    { name: "Solicitudes de Registro", path: "/admin/solicitudes-registro", icon: <FaFileAlt /> },
    { name: "Registrar Trabajo", path: "/admin/registrar-trabajo", icon: <FaBriefcase /> },
  ];

  return (
    <aside className="min-h-screen w-64 bg-gray-800 flex flex-col rounded-r-lg">
      <div className="p-4 text-center font-bold text-lg border-b border-gray-700 text-white">TigMotors Admin</div>
      <nav className="flex-1">
        <ul className="space-y-2 p-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg ${
                  location.pathname === item.path ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-400"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
