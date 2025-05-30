// ActividadRow.jsx
import React, { useState, useEffect } from 'react';

/**
 * Componente para renderizar una fila de la tabla de actividades.
 * @param {object} props - Las propiedades del componente.
 * @param {object} props.actividad - El objeto ActividadDTO con los datos de la actividad.
 * @param {Function} props.onInscribir - Función a llamar cuando se hace clic en el botón "Inscribirse".
 */
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
    instructor,
    fotourl,
  } = actividad;

  const formatHorario = (horario) => {
    if (!horario) return 'No especificado';
    try {
      return new Date(horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error("Error formateando horario:", error);
      return "Inválido";
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
        <button onClick={() => onInscribir(id)} className="btn-inscribir">
          Inscribirse
        </button>
      </td>
    </tr>
  );
}

/**
 * Componente para renderizar una tabla de actividades.
 * @param {object} props - Las propiedades del componente.
 * @param {Array<object>} props.actividades - Lista de objetos ActividadDTO.
 */
function ActividadesTable({ actividades }) {
  // Manejador para la inscripción (ejemplo)
  const handleInscribir = (actividadID) => {
    console.log(`Inscribiendo a la actividad con ID: ${actividadID}`);
    // Aquí iría la lógica para inscribir al usuario,
    // por ejemplo, una llamada a una API.
    alert(`Te has inscrito (simulado) a la actividad ID: ${actividadID}`);
  };

  if (!actividades || actividades.length === 0) {
    return <p>No hay actividades disponibles en este momento.</p>;
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
            key={actividad.ID} // Es importante usar una key única para cada elemento de la lista
            actividad={actividad}
            onInscribir={handleInscribir}
          />
        ))}
      </tbody>
    </table>
  );
}

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState('');

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
        navigate("/home");
    };

  return (
    <div className="actividades-container">
      <h1>Actividades Disponibles</h1>
                  <button onClick={handleVolver}>Volver a Home</button>

      {error && <p className="error">{error}</p>}
      <ActividadesTable actividades={actividades} />
    </div>
  );
}


export default Actividades;