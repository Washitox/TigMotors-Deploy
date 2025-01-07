export default function EstatusSolicitudes() {
  const [statusData, setStatusData] = useState({ ACEPTADO: 0, PENDIENTE: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener el token
  const getToken = () => localStorage.getItem("authToken");

  const fetchStatusData = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/estadisticas-solicitudes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatusData({
        ACEPTADO: response.data.ACEPTADO || 0,
        PENDIENTE: response.data.PENDIENTE || 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusData();
  }, []);

  const chartData = {
    labels: ["Aceptado", "Pendiente"],
    datasets: [
      {
        data: [statusData.ACEPTADO, statusData.PENDIENTE],
        backgroundColor: ["#4CAF50", "#FFC107"],
        borderColor: ["#388E3C", "#FF8F00"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Importante para manejar el tamaño dinámico
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            return ` ${tooltipItem.label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-gray-800 p-4 md:p-6 rounded-xl shadow-xl">
      <h2 className="text-lg font-bold text-center text-white mb-4">
        Estado de las Solicitudes
      </h2>
      {isLoading ? (
        <p className="text-center text-white">Cargando datos...</p>
      ) : (
        <div className="relative h-56 md:h-72 lg:h-80">
          <Doughnut data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}
