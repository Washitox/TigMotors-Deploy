import React from "react";
import Mascota from "../../../../assets/images/Mascota_TigMotors.png";

const mascota = [
  {
    nombre: "Mollie",
    descripcion: "La mascota consentida de la empresa, alias el pitbull del taller",
    foto: Mascota,
  },
];

export default function MascotaTig() {
  return (
    <section id="mascota" className="py-12 bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <h2 className="text-4xl font-bold text-center mb-8">Nuestra Mascota</h2>

        {/* Grilla centrada con la mascota */}
        <div className="flex justify-center">
          <div
            className="flex flex-col items-center text-center bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition duration-300"
            style={{ width: "100%", maxWidth: "320px" }} // Mismo ancho que los cuadros del equipo
          >
            <img
              src={mascota[0].foto}
              alt={mascota[0].nombre}
              className="w-24 h-24 mb-4 rounded-full object-cover border-4 border-transparent hover:border-indigo-500 transition duration-300"
            />
            <h3 className="text-xl font-semibold mb-2">{mascota[0].nombre}</h3>
            <p className="text-gray-300 text-sm">{mascota[0].descripcion}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
