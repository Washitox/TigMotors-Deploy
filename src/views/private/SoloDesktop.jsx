import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/TigMotors.png";

export default function SoloDesktop() {
  return (
    <section className="flex flex-col items-center justify-center h-full bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
        <img src={logo} alt="TigMotors logo" className="mx-auto w-20 h-20 object-contain mb-4" />
        <h1 className="text-2xl font-bold mb-2">Mesa de servicios para Escritorio</h1>
        <p className="text-indigo-300 mb-4">
          Lo sentimos, solo se puede ingresar a las mesas de servicio desde una computadora.
        </p>
        <Link to="/" className="text-lg font-medium text-indigo-500 underline">
          Regresar al inicio
        </Link>
      </div>
    </section>
  );
}
