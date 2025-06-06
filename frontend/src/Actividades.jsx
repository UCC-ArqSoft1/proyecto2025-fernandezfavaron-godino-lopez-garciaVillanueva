import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';        
import './Actividades.css'; 

function ActividadRow({ actividad, onInscribir }) {
  const {
    id,
    nombre,
    descripcion,
    dia,
    horario,
    duracion,
    cupos,
    categoria,
    instructor
  } = actividad;

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

  return (
    <tr>
      <td>{nombre}</td>
      <td className="descripcion-col">{descripcion}</td>
      <td>{dia}</td>
      <td>{formatHorario(horario)}</td>
      <td>{duracion} min</td>
      <td>{cupos}</td>
      <td>{categoria}</td>
      <td>{instructor}</td>
      <td>
        {}
        <button 
          onClick={() => onInscribir(id)} 
          className="btn btn-secondary btn-inscribir"
        >
          Inscribirse
        </button>
      </td>
    </tr>
  );
}

function ActividadesTable({ actividades }) {
  const handleInscribir = (actividadID) => {
    console.log(`Inscribiendo a la actividad con ID: ${actividadID}`);
    alert(`Te has inscrito (simulado) a la actividad ID: ${actividadID}`);
  };

  if (!actividades || actividades.length === 0) {
    return <p className="main-subtitle">No hay actividades disponibles en este momento.</p>;
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
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {actividades.map((actividad) => (
          <ActividadRow
            key={actividad.id}
            actividad={actividad}
            onInscribir={handleInscribir}
          />
        ))}
      </tbody>
    </table>
  );
}

// Componente principal
function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await fetch('http://localhost:8080/actividades');
        if (!response.ok) {
          throw new Error('Error al obtener las actividades');
        }
        const data = await response.json();
        setActividades(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las actividades. Inténtalo más tarde.');
      }
    };

    fetchActividades();
  }, []);

  const handleVolver = () => {
    navigate('/home');
  };

  return (
    <div className="actividades-container">
      {/* Usamos la clase main-title del Home */}
      <h1 className="main-title">Actividades Disponibles</h1>
      
      {/* Usamos las clases btn btn-primary del Home */}
      <button 
        onClick={handleVolver}
        className="btn btn-primary"
      >
        ← Volver a Home
      </button>
      
      {error && <p className="error">{error}</p>}
      <ActividadesTable actividades={actividades} />
    </div>
  );
}

export default Actividades;