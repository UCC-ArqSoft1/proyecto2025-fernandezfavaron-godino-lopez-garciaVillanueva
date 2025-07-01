import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';
import './Actividades.css';
import './Inscripcion.jsx'
import handleInscribir from "./Inscripcion.jsx";
// Componente específico para mostrar las actividades del usuario (sin botón de inscribirse)
function MisActividadesTable({ actividades,setActividades, mensajeSinActividades }) {
  const formatHorario = (horario) => {
    if (!horario) return 'No especificado';
    try {
      return new Date(horario).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formateando horario:', error);
      return 'Inválido';
    }
  };

  if (!actividades || actividades.length === 0) {
    return <p className="main-subtitle">{mensajeSinActividades}</p>;
  }

  return (
    <table className="tabla-actividades">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Día</th>
          <th>Horario</th>
          <th>Duración</th>
          <th>Cupos</th>
          <th>Categoría</th>
          <th>Instructor</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {actividades.map((actividad) => (
          <tr key={actividad.id}>
            <td>{actividad.nombre}</td>
            <td className="descripcion-col">{actividad.descripcion}</td>
            <td>{actividad.dia}</td>
            <td>{formatHorario(actividad.horario)}</td>
            <td>{actividad.duracion} min</td>
            <td>{actividad.cupos}</td>
            <td>{actividad.categoria}</td>
            <td>{actividad.instructor}</td>
            <td>
              <button 
                onClick={async () => handleInscribir(actividad.id, true)
                .then((result) => {
                  if (typeof result === 'number') {
                    // Si result es un número, significa que se desinscribió correctamente
                    setActividades(actividades.filter(actividad => actividad.id !== result));
                  } else {
                    // Manejar el error de desinscripción
                    console.error(result);
                  }
                })}
                class="btn btn-secondary btn-inscripcion"
                >
                Desinscribirse
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const MisActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActividades = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/misactividades", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las actividades");
        }

        const data = await response.json();
        setActividades(data);
      } catch (error) {
        console.error("Error:", error);
        setError("No se pudieron cargar tus actividades. Inténtalo más tarde.");
      }
    };

    fetchActividades();
  }, [navigate]);

  const handleVolver = () => {
    navigate("/home");
  };

  return (
    <div className="mis-actividades-container">
      <h1 className="main-title">Mis Actividades</h1>
      
      <button 
        onClick={handleVolver}
        className="btn btn-primary"
      >
        ← Volver a Home
      </button>
      
      {error && <p className="error">{error}</p>}
      
      <MisActividadesTable 
        actividades={actividades} 
        setActividades={setActividades}
        mensajeSinActividades="No tienes actividades registradas." 
      />
    </div>
  );
};

export default MisActividades;