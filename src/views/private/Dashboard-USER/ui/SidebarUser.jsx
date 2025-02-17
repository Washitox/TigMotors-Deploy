import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBriefcase, FaClipboard, FaCog, FaFileInvoice } from "react-icons/fa";

export default function SidebarUser() {
  const location = useLocation(); // Hook para obtener la ruta actual

  const menuItems = [
    { name: "Perfil", path: "/user/perfil", icon: <FaCog /> },
    { name: "Trabajos", path: "/user/trabajos", icon: <FaBriefcase /> },
    { name: "Comprobantes", path: "/user/comprobantes", icon: <FaFileInvoice /> },
    { name: "Solicitudes para trabajo", path: "/user/solicitar-trabajo", icon: <FaClipboard /> },    
  ];

  return (
    <aside className="flex min-h-full w-64 bg-gray-800 flex-col rounded-r-lg">
      <div className="p-4 text-center font-bold text-lg border-b border-gray-700 text-white">TigMotors User</div>
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
