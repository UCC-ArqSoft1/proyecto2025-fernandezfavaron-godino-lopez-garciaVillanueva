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
    inscripto: alreadyInscribed,
  } = actividad;

  // Estado local: true → inscrito, false → no inscrito
  const [inscribed, setInscribed] = React.useState(alreadyInscribed);

  // Sincroniza el estado local si cambia el prop
  React.useEffect(() => {
    setInscribed(alreadyInscribed);
  }, [alreadyInscribed]);

  /** Formatea el horario "HH:MM" o devuelve "Inválido" */
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
      if (typeof result === 'number') { setInscribed(!inscribed); }
      if (
        result == "ErrUsuarioYaInscrito" ||
        result == "ErrUsuarioNoInscrito"
      ) {
        setInscribed(!inscribed);
        console.log("No se esperaba:", result);
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

function ActividadesTable({ actividades, onInscribir }) {
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
            onInscribir={onInscribir}
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

  // Estados para los filtros
  const [filtros, setFiltros] = useState({
    categoria: '',
    nombre: '',
    instructor: '',
    dia: '',
    horario: ''
  });

  // Estados para la UI
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    categoria: '',
    nombre: '',
    instructor: '',
    dia: '',
    horario: ''
  });

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
        setInscripciones([]);
        console.error("Error al cargar inscripciones");
      }
    };
    fetchInscripciones();
  }, [navigate]);

  // Carga de actividades con filtros del backend
  useEffect(() => {
    const fetchActividades = async () => {
      try {
        // Construir los query parameters usando filtrosAplicados
        const params = new URLSearchParams();

        if (filtrosAplicados.categoria) params.append('categoria', filtrosAplicados.categoria);
        if (filtrosAplicados.nombre) params.append('nombre', filtrosAplicados.nombre);
        if (filtrosAplicados.instructor) params.append('instructor', filtrosAplicados.instructor);
        if (filtrosAplicados.dia) params.append('dia', filtrosAplicados.dia);
        if (filtrosAplicados.horario) params.append('horario', filtrosAplicados.horario);
        params.append('page', actualPage.toString());

        const resp = await fetch(`http://localhost:8080/actividades?${params.toString()}`);
        if (!resp.ok) throw new Error();

        const data = await resp.json();
        if (!inscripciones || inscripciones.length === 0) {
          setActividades(data.actividades || []);
          setPages(data.pages || 1);
          setError('');
          return;
        }
        const marcadas = data.actividades.map((a) => ({
          ...a,
          inscripto: inscripciones.includes(a.id)
        }));
        setActividades(marcadas);
        setPages(data.pages || 1);
        setError('');
      } catch {
        setActividades([]);
        setPages(1);
        setError('No se encontraron actividades con los filtros aplicados.');
      }
    };

    fetchActividades();
  }, [actualPage, filtrosAplicados, inscripciones]);

  // Nueva función para manejar inscripción y actualizar inscripciones
  const handleInscribirYActualizar = async (id, alreadyInscribed) => {
    const result = await handleInscribir(id, alreadyInscribed);
    if (!inscripciones || inscripciones.length === 0) {
      if (typeof result === 'number') {
        setInscripciones([id]); // Si no hay inscripciones, inicializar con la actual
      }
    }
    else {
      if (typeof result === 'number') {
        setInscripciones((prev) =>
          alreadyInscribed
            ? prev.filter((inscId) => inscId !== id) // Desinscribir
            : [...prev, id] // Inscribir
        );
      }
    }
    return result;
  };

  // Función para manejar cambios en los filtros
  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Función para aplicar búsqueda
  const aplicarBusqueda = () => {
    setFiltrosAplicados({ ...filtros });
    setActualPage(1);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      categoria: '',
      nombre: '',
      instructor: '',
      dia: '',
      horario: ''
    });
    setFiltrosAplicados({
      categoria: '',
      nombre: '',
      instructor: '',
      dia: '',
      horario: ''
    });
    setActualPage(1);
  };

  return (
    <div className="actividades-container">
      <h1 className="main-title">Actividades Disponibles</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="filtros">
        <button onClick={() => navigate('/home')} className="btn btn-primary">
          ← Volver a Home
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          {/* Filtro principal por nombre - siempre visible */}
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filtros.nombre}
            onChange={(e) => handleFiltroChange('nombre', e.target.value)}
            className="input-busqueda"
            onKeyPress={(e) => e.key === 'Enter' && aplicarBusqueda()}
          />

          {/* Botón para mostrar/ocultar filtros avanzados */}
          <button
            onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
            className="btn btn-secondary"
          >
            {mostrarFiltrosAvanzados ? '▲ Ocultar filtros' : '▼ Más filtros'}
          </button>

          {/* Botón de búsqueda */}
          <button
            onClick={aplicarBusqueda}
            className="btn btn-primary"
          >
            🔍 Buscar
          </button>

          {/* Botón limpiar */}
          <button
            onClick={limpiarFiltros}
            className="btn-limpiar"
          >
            Limpiar
          </button>
        </div>

        {/* Filtros avanzados - se muestran/ocultan */}
        {mostrarFiltrosAvanzados && (
          <div>
            <h4>Filtros Avanzados</h4>

            {/* Filtro por instructor */}
            <input
              type="text"
              placeholder="Buscar por instructor..."
              value={filtros.instructor}
              onChange={(e) => handleFiltroChange('instructor', e.target.value)}
              className="input-busqueda"
              onKeyPress={(e) => e.key === 'Enter' && aplicarBusqueda()}
            />

            {/* Filtro por categoría */}
            <select
              value={filtros.categoria}
              onChange={(e) => handleFiltroChange('categoria', e.target.value)}
              className="select-categoria"
            >
              <option value="">Todas las categorías</option>
              <option value="Fitness">Fitness</option>
              <option value="Yoga">Yoga</option>
              <option value="Natación">Natación</option>
            </select>

            {/* Filtro por día */}
            <select
              value={filtros.dia}
              onChange={(e) => handleFiltroChange('dia', e.target.value)}
              className="select-categoria"
            >
              <option value="">Todos los días</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sábado">Sábado</option>
              <option value="Domingo">Domingo</option>
            </select>

            {/* Filtro por horario */}
            <input
              type="time"
              placeholder="Horario"
              value={filtros.horario}
              onChange={(e) => handleFiltroChange('horario', e.target.value)}
              className="input-busqueda"
            />
          </div>
        )}
      </div>

      {/* Tabla de actividades */}
      <ActividadesTable
        actividades={actividades}
        onInscribir={handleInscribirYActualizar}
      />
      {/* Paginación */}
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