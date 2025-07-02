import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import './Actividades.css';
import handleInscribir from './Inscripcion';

// Componente FormularioActividad (necesario para los modales)
function FormularioActividad({ actividad, onGuardar, onCancelar }) {
  const [formData, setFormData] = useState({
    nombre: actividad?.nombre || '',
    descripcion: actividad?.descripcion || '',
    dia: actividad?.dia || '',
    horario: actividad?.horario || '',
    duracion: actividad?.duracion || '',
    cupos: actividad?.cupos || '',
    categoria: actividad?.categoria || '',
    instructor: actividad?.instructor || ''
  });

// En FormularioActividad - modifica la función handleSubmit:

const handleSubmit = (e) => {
  e.preventDefault();

  // Convertir horario a formato DateTime completo
  const formatearHorario = (horario) => {
    if (!horario) return null;
    
    // Crear una fecha base (hoy) y agregar la hora
    const fechaBase = new Date();
    const [hora, minuto] = horario.split(':');
    fechaBase.setHours(parseInt(hora), parseInt(minuto), 0, 0);
    
    // Retornar en formato ISO
    return fechaBase.toISOString();
  };

  const datosFormateados = {
    id: actividad?.id,
    nombre: formData.nombre,
    descripcion: formData.descripcion,
    dia: formData.dia,
    horario: formatearHorario(formData.horario), // Formatear aquí
    duracion: parseInt(formData.duracion),
    cupos: parseInt(formData.cupos),
    categoria: formData.categoria,
    instructor: formData.instructor,
    fotourl: ""
  };

  console.log("👉 Enviando al backend:", datosFormateados);
  onGuardar(datosFormateados);
};

  const handleChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

   return (
    <form onSubmit={handleSubmit} className="modal-content">
      
      {/* Nombre */}
      <div className="form-group">
        <label htmlFor="nombre" className="form-label">Nombre:</label>
        <input
          id="nombre"
          className="contraseña"
          placeholder="Nombre"
          required
          type="text"
          value={formData.nombre}
          onChange={e => handleChange('nombre', e.target.value)}
        />
      </div>

      {/* Descripción */}
      <div className="form-group">
        <label htmlFor="descripcion" className="form-label">Descripción:</label>
        <input
          id="descripcion"
          className="contraseña"
          placeholder="Descripción"
          required
          type="text"
          value={formData.descripcion}
          onChange={e => handleChange('descripcion', e.target.value)}
        />
      </div>

      {/* Día (datalist) */}
      <div className="form-group">
        <label htmlFor="dia" className="form-label">Día:</label>
        <input
          id="dia"
          className="contraseña"
          placeholder="Día"
          required
          type="text"
          list="dias"
          value={formData.dia}
          onChange={e => handleChange('dia', e.target.value)}
        />
        <datalist id="dias">
          <option value="Lunes" />
          <option value="Martes" />
          <option value="Miércoles" />
          <option value="Jueves" />
          <option value="Viernes" />
          <option value="Sábado" />
          <option value="Domingo" />
        </datalist>
      </div>

      {/* Horario */}
      <div className="form-group">
        <label htmlFor="horario" className="form-label">Horario:</label>
     <input
  id="horario"
  className="input-busqueda"
  placeholder="Horario"
  required
  type="time"
  value={formData.horario}
  onChange={e => handleChange('horario', e.target.value)}
/>

      </div>

{/* Duración */}
<div className="form-group">
  <label htmlFor="duracion" className="form-label">Duración (min):</label>
  <input
    id="duracion"
    className="input-busqueda"
    placeholder="Duración"
    required
    type="number"
    value={formData.duracion}
    onChange={e => handleChange('duracion', e.target.value)}
  />
</div>

{/* Cupos */}
<div className="form-group">
  <label htmlFor="cupos" className="form-label">Cupos:</label>
  <input
    id="cupos"
    className="input-busqueda"
    placeholder="Cupos"
    required
    type="number"
    value={formData.cupos}
    onChange={e => handleChange('cupos', e.target.value)}
  />
</div>


      {/* Categoría (datalist) */}
      <div className="form-group">
        <label htmlFor="categoria" className="form-label">Categoría:</label>
        <input
          id="categoria"
          className="contraseña"
          placeholder="Categoría"
          required
          type="text"
          list="categorias"
          value={formData.categoria}
          onChange={e => handleChange('categoria', e.target.value)}
        />
        <datalist id="categorias">
          <option value="Fitness" />
          <option value="Yoga" />
          <option value="Natación" />
        </datalist>
      </div>

      {/* Instructor */}
      <div className="form-group">
        <label htmlFor="instructor" className="form-label">Instructor:</label>
        <input
          id="instructor"
          className="contraseña"
          placeholder="Instructor"
          required
          type="text"
          value={formData.instructor}
          onChange={e => handleChange('instructor', e.target.value)}
        />
      </div>

      {/* Acciones */}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {actividad ? 'Actualizar' : 'Crear'}
        </button>
        <button type="button" onClick={onCancelar} className="btn btn-primary">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function ActividadRow({ actividad, onInscribir, isadmin, onEliminar, onEditar }) {
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

  const [inscribed, setInscribed] = React.useState(alreadyInscribed);

  React.useEffect(() => {
    setInscribed(alreadyInscribed);
  }, [alreadyInscribed]);

  const formatHorario = (h) => {
    if (!h) return 'No especificado';
    try {
      return new Date(h).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Inválido';
    }
  };

  const toggleInscripcion = async () => {
    try {
      const result = await onInscribir(id, inscribed);
      if (typeof result === 'number') {
        setInscribed(!inscribed);
      }
      if (
        result === "ErrUsuarioYaInscrito" ||
        result === "ErrUsuarioNoInscrito"
      ) {
        setInscribed(!inscribed);
        console.log("No se esperaba:", result);
      }
    } catch (error) {
      console.error('Error al (des)inscribir:', error);
      alert('Ocurrió un error al procesar tu solicitud. Inténtalo más tarde.');
    }
  };

  let claseBoton = "button";
  if (inscribed) {
    claseBoton += " button-success";
  }

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
      <td className="acciones-cell">
        {!isadmin && (
          <button
            onClick={toggleInscripcion}
            className={`${claseBoton} inscripcion-button`}
          >
            {inscribed ? 'Inscrito' : 'Inscribirse'}
          </button>
        )}
        {isadmin && (
          <div className="admin-buttons-container">
            <button
              onClick={() => onEliminar(id)}
              className="button-danger"
            >
              Eliminar
            </button>
            <button
              onClick={() => onEditar(actividad)}
              className="button inscripcion-button"
            >
              Editar
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

function ActividadesTable({ actividades, onInscribir, isadmin, onEliminar, onEditar }) {
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
            isadmin={isadmin}
            onEliminar={onEliminar}
            onEditar={onEditar}
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
  const [isadmin, setisadmin] = useState(false);

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

  // Estados para modales
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [actividadEditando, setActividadEditando] = useState(null);

  const navigate = useNavigate();

  // Funciones para manejar modales
  const handleCrear = () => {
    setMostrarModalCrear(true);
  };

  const handleEditarModal = (actividad) => {
    setActividadEditando(actividad);
    setMostrarModalEditar(true);
  };

  const cerrarModales = () => {
    setMostrarModalCrear(false);
    setMostrarModalEditar(false);
    setActividadEditando(null);
  };

// Función para manejar creación de actividad
const handleGuardarNuevaActividad = async (nuevaActividad) => {
  const token = localStorage.getItem("token");
  try {
    // ✅ Ruta corregida: /actividad → /actividades
    const resp = await fetch('http://localhost:8080/actividades', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaActividad)
    });

    if (!resp.ok) {
      const errorData = await resp.text();
      console.error('Error del servidor (crear):', errorData);
      throw new Error(`Error al crear la actividad: ${resp.status}`);
    }

    alert('Actividad creada exitosamente');
    cerrarModales();
    window.location.reload();
  } catch (error) {
    console.error('Error al crear actividad:', error);
    alert('Error al crear la actividad: ' + error.message);
  }
};

// Función para manejar actualización de actividad
const handleActualizarActividad = async (actividadActualizada) => {
  const token = localStorage.getItem("token");
  try {
    // ✅ Ruta corregida: /actividad/:id → /actividades/:id
    const resp = await fetch(`http://localhost:8080/actividades/${actividadEditando.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(actividadActualizada)
    });

    if (!resp.ok) {
      const errorData = await resp.text();
      console.error('Error del servidor (editar):', errorData);
      throw new Error(`Error al actualizar la actividad: ${resp.status}`);
    }

    alert('Actividad actualizada exitosamente');
    cerrarModales();
    window.location.reload();
  } catch (error) {
    console.error('Error al actualizar actividad:', error);
    alert('Error al actualizar la actividad: ' + error.message);
  }
};


  // Verificar si el usuario es admin
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Token payload completo:", payload);
    const isAdminValue = payload.isAdmin === true;
    console.log("Final isAdmin value:", isAdminValue);
    setisadmin(isAdminValue);
  } catch (error) {
    console.error('Error al decodificar token:', error);
    setisadmin(false);
  }
}, [navigate]);


  // Carga de inscripciones existentes
  useEffect(() => {
    const fetchInscripciones = async () => {
      const token = localStorage.getItem("token");
      if (!token) { 
        navigate("/"); 
        return; 
      }
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
        setInscripciones([id]);
      }
    } else {
      if (typeof result === 'number') {
        setInscripciones((prev) =>
          alreadyInscribed
            ? prev.filter((inscId) => inscId !== id)
            : [...prev, id]
        );
      }
    }
    return result;
  };

  // Función para eliminar actividad
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const resp = await fetch(`http://localhost:8080/actividades/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!resp.ok) {
        throw new Error('Error al eliminar la actividad');
      }

      setActividades(prev => prev.filter(act => act.id !== id));
      alert('Actividad eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar la actividad');
    }
  };

  // Función para editar actividad (navegación - alternativa a modal)
  const handleEditar = (actividad) => {
    navigate('/editar-actividad', { state: { actividad } });
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
    <>
    <button
      onClick={() => {
        if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
          localStorage.removeItem("token");
          navigate("/");
        }
      }}
      className="btn-logout"
    >
      <span className="text">Cerrar Sesión</span>
    </button>
    
    <div className="actividades-container">
      
      <h1 className="main-title">Actividades Disponibles</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="filtros">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button onClick={() => navigate('/home')} className="btn btn-primary">
            ← Volver a Home
          </button>
          
          {isadmin && (
            <button 
              onClick={handleCrear} 
              className="btn-limpiar"
            >
              + Crear Actividad
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filtros.nombre}
            onChange={(e) => handleFiltroChange('nombre', e.target.value)}
            className="input-busqueda"
            onKeyPress={(e) => e.key === 'Enter' && aplicarBusqueda()}
          />

          <button
            onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
            className="btn btn-primary"
          >
            {mostrarFiltrosAvanzados ? '▲ Ocultar filtros' : '▼ Más filtros'}
          </button>

<button
  onClick={aplicarBusqueda}
  className="btn btn-primary"
>
  Buscar
</button>

<button
  onClick={limpiarFiltros}
  className="btn-limpiar"
>
  Limpiar
</button>

          
        </div>

        {mostrarFiltrosAvanzados && (
          <div>
            <h4>Filtros Avanzados</h4>

            <input
              type="text"
              placeholder="Buscar por instructor..."
              value={filtros.instructor}
              onChange={(e) => handleFiltroChange('instructor', e.target.value)}
              className="input-busqueda"
              onKeyPress={(e) => e.key === 'Enter' && aplicarBusqueda()}
            />

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

      <ActividadesTable
        actividades={actividades}
        onInscribir={handleInscribirYActualizar}
        isadmin={isadmin}
        onEliminar={handleEliminar}
        onEditar={handleEditarModal} // Usar la función modal aquí
      />
      
      <div className="pagination-buttons">
        <button
          className="btn btn-primary"
          onClick={() => setActualPage(p => Math.max(p - 1, 1))}
          disabled={actualPage === 1}
        >
          ← Anterior
        </button>
        <span style={{ margin: '0 10px' }}>
          Página {actualPage} de {pages}
        </span>
        <button
          className="btn btn-primary"
          onClick={() => setActualPage(p => Math.min(p + 1, pages))}
          disabled={actualPage === pages}
        >
          Siguiente →
        </button>
      </div>
{mostrarModalCrear && (
  <div className="modal-overlay" onClick={cerrarModales}>
    <div onClick={(e) => { e.stopPropagation(); }}>
      <FormularioActividad 
        onGuardar={handleGuardarNuevaActividad}
        onCancelar={cerrarModales}
      />
    </div>
  </div>
)}

{mostrarModalEditar && actividadEditando && (
  <div className="modal-overlay" onClick={cerrarModales}>
    <div onClick={(e) => { e.stopPropagation(); }}>
      <FormularioActividad 
        actividad={actividadEditando}
        onGuardar={handleActualizarActividad}
        onCancelar={cerrarModales}
      />
    </div>
  </div>
)}

    </div>
    </>
  );
}

export default Actividades;