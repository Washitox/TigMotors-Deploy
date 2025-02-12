import React, { useState, useEffect } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useMediaQuery } from "react-responsive";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function EstatusTickets() {
  const [ticketData, setTicketData] = useState({
    Pendiente: 0,
    Terminado: 0,
    EnProgreso: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const isMobile = useMediaQuery({ maxWidth: 640 }); // Detectar si es móvil
  const isDesktop = useMediaQuery({ minWidth: 1025 }); // Detectar si es escritorio

  const fetchTicketData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken"); // Obtener el token
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/staff-cds/estadisticas-tickets`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Actualizar los datos con la respuesta de la API
      setTicketData({
        Pendiente: response.data.TRABAJO_PENDIENTE || 0,
        Terminado: response.data.TRABAJO_TERMINADO || 0,
        EnProgreso: response.data.TRABAJO_EN_PROGRESO || 0,
      });
    } catch (error) {
      console.error("Error al obtener los datos de los tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketData();

    // Configurar un intervalo para actualizar los datos en tiempo real
    const interval = setInterval(() => {
      fetchTicketData();
    }, 15000); // Actualiza cada 15 segundos
  }, []);

  const chartData = {
    labels: ["Pendiente", "Terminado", "En Progreso"],
    datasets: [
      {
        label: "Tickets",
        data: [
          ticketData.Pendiente,
          ticketData.Terminado,
          ticketData.EnProgreso,
        ],
        backgroundColor: ["#4CAF50", "#36A2EB", "#FFC107"],
        borderColor: ["#4CAF50", "#36A2EB", "#FFC107"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Estado de los Tickets",
        font: {
          size: isMobile ? 14 : 18, // Tamaño dinámico del texto
          family: "Arial",
        },
        color: "#ffffff",
      },
      legend: {
        labels: {
          color: "#ffffff",
          font: {
            size: isMobile ? 10 : 12, // Ajuste de tamaño dinámico de las etiquetas
          },
        },
      },
    },
  };

  return (
    <div
      className={`w-full ${
        isDesktop ? "h-[500px]" : "h-96"
      } bg-gray-800 p-8 rounded-xl shadow-xl flex flex-col justify-center`}
    >
      <h2 className="text-lg font-bold text-center text-white mb-4">
        Estado de los Tickets
      </h2>
      {isLoading ? (
        <p className="text-center text-white">Cargando datos...</p>
      ) : (
        <div className="flex justify-center items-center h-full">
          <div className={`w-${isDesktop ? "3/4" : "full"} h-full`}>
            <Doughnut data={chartData} options={options} />
          </div>
        </div>
      )}
    </div>
  );
}
