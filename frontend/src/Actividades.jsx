import React, { useState, useEffect } from 'react';
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
    instructor,
    alreadyInscribed
  } = actividad;

  // Estado local: true → inscrito, false → no inscrito
  const [inscribed, setInscribed] = React.useState(alreadyInscribed);

  /** Formatea el horario "HH:MM" o devuelve “Inválido” */
  const formatHorario = (h) => {
    if (!h) return 'No especificado';
    try {
      return new Date(h).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Inválido';
    }
  };

  /** Inscribe o desinscribe, y actualiza el estado si la API responde ok */
  const toggleInscripcion = async () => {
    try {
      const result = await onInscribir(id, inscribed);
      if (
        typeof result === 'number' ||
        result === 'ErrUsuarioYaInscripto' ||
        result === 'ErrUsuarioNoInscripto'
      ) {
        setInscribed(!inscribed);
      }
    } catch (error) {
      console.error('Error al (des)inscribir:', error);
      alert('Ocurrió un error al procesar tu solicitud. Inténtalo más tarde.');
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
        <button
          onClick={toggleInscripcion}
          className="btn btn-secondary btn-inscripcion"
        >
          {inscribed ? 'Inscrito' : 'Inscribirse'}
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
        {actividades.map((act) => (
          <ActividadRow
            key={act.id}
            actividad={act}
            onInscribir={(id, alreadyInscribed) => handleInscribir(id, alreadyInscribed)}
          />
        ))}
      </tbody>
    </table>
  );
}

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [pages, setPages] = useState(1);
  const [actualPage, setActualPage] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Carga de inscripciones existentes
  useEffect(() => {
    const fetchInscripciones = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/"); return; }
      try {
        const resp = await fetch("http://localhost:8080/inscripciones", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) throw new Error();
        setInscripciones(await resp.json());
      } catch {
        setError("No se pudieron cargar tus inscripciones. Inténtalo más tarde.");
      }
    };
    fetchInscripciones();
  }, [navigate]);

  // Carga de actividades y marcación de ya inscritos
  useEffect(() => {
    const fetchActividades = async (page = 1) => {
      try {
        const params = new URLSearchParams({ page: String(page) });
        const resp = await fetch(`http://localhost:8080/actividades?${params}`);
        if (!resp.ok) throw new Error();
        const data = await resp.json();
        const marcadas = data.actividades.map((a) => ({
          ...a,
          alreadyInscribed: inscripciones.some(i => i.id_actividad === a.id)
        }));
        setActividades(marcadas);
        setPages(data.pages || 1);
      } catch {
        setError('No se pudieron cargar las actividades. Inténtalo más tarde.');
      }
    };
    fetchActividades(actualPage);
  }, [actualPage, inscripciones]);

  return (
    <div className="actividades-container">
      <h1 className="main-title">Actividades Disponibles</h1>
      <button onClick={() => navigate('/home')} className="btn btn-primary">
        ← Volver a Home
      </button>
      {error && <p className="error">{error}</p>}
      <ActividadesTable actividades={actividades} />
      <div className="pagination-buttons">
        <button
          className="btn btn-secondary"
          onClick={() => setActualPage(p => Math.max(p - 1, 1))}
          disabled={actualPage === 1}
        >
          ← Anterior
        </button>
        <span style={{ margin: '0 10px' }}>
          Página {actualPage} de {pages}
        </span>
        <button
          className="btn btn-secondary"
          onClick={() => setActualPage(p => Math.min(p + 1, pages))}
          disabled={actualPage === pages}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

export default Actividades;
