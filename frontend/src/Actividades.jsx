import React, { useState, useEffect, act } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import './Actividades.css';
import handleInscribir from './Inscripcion';

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
        { }
        <button
          onClick={() => onInscribir(id, actividad.alreadyInscribed)
            .then((result) => {
              if (typeof result === 'number') {
                // Si result es un número, significa que se inscribió o desinscribió correctamente
                actividad.alreadyInscribed = !actividad.alreadyInscribed;
              } else {
                if (typeof result === 'string') {
                  if (result == "ErrUsuarioYaInscripto"){
                    actividad.alreadyInscribed = true
                  }
                  if (result == "ErrUsuarioNoInscripto"){
                    actividad.alreadyInscribed = false
                  }
                }
              }
            })
            .catch((error) => {
              console.error('Error al inscribir/desinscribir:', error);
              alert('Ocurrió un error al procesar tu solicitud. Inténtalo más tarde.');
            })
          }
          className="btn btn-secondary btn-inscripcion"
        >
          {actividad.alreadyInscribed ? 'Desinscribirse' : 'Inscribirse'}
        </button>
      </td>
    </tr>
  );
}

function ActividadesTable({ actividades }) {

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
            onInscribir={(id, alreadyInscribed) => handleInscribir(id, alreadyInscribed)}
          />
        ))}
      </tbody>
    </table>
  );
}

// Componente principal
function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [pages, setPages] = useState(1);
  const [actualPage, setActualPage] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInscripciones = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const response = await fetch("http://localhost:8080/inscripciones", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Error al obtener las actividades inscritas");
        }
        const data = await response.json();
        setInscripciones(data);
      } catch (error) {
        console.error("Error:", error);
        setError("No se pudieron cargar tus inscripciones. Inténtalo más tarde.");
      }
    };

    fetchInscripciones();
  }, []);

  useEffect(() => {
    const fetchActividades = async (page = 1) => {
      try {
        const params = new URLSearchParams({
          categoria: "",
          nombre: "",
          instructor: "",
          dia: "",
          horario: "",
          page: page.toString()
        });

        const response = await fetch(`http://localhost:8080/actividades?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Error al obtener las actividades');
        }

        const data = await response.json();

        if (!Array.isArray(data.actividades)) {
          console.error('Formato inválido:', data);
          throw new Error('El servidor devolvió un formato inesperado.');
        }

        const actividadesMarcadas = data.actividades.map((actividad) => ({
          ...actividad,
          alreadyInscribed: inscripciones.some(
            (insc) => insc.id_actividad === actividad.id
          )
        }));

        setActividades(actividadesMarcadas);
        setPages(data.pages || 1);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las actividades. Inténtalo más tarde.');
      }
    };

    fetchActividades(actualPage);
  }, [actualPage, inscripciones]);

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
      <div className="pagination-buttons">
        <button
          className="btn btn-secondary"
          onClick={() => setActualPage(prev => Math.max(prev - 1, 1))}
          disabled={actualPage === 1}
        >
          ← Anterior
        </button>
        <span style={{ margin: '0 10px' }}>Página {actualPage} de {pages}</span>
        <button
          className="btn btn-secondary"
          onClick={() => setActualPage(prev => Math.min(prev + 1, pages))}
          disabled={actualPage === pages}
        >
          Siguiente →
        </button>
      </div>

    </div>
    // Aquí podrías agregar la paginación si es necesario

  );
}

export default Actividades;