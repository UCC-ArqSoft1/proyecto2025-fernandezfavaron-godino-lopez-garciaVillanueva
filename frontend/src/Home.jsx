import { useNavigate } from "react-router-dom";
import "./Home.css"; // Importa el archivo CSS

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <>
      <main className="main-content">
        <h1 className="main-title">Bienvenido al Centro Deportivo</h1>
        <p className="main-subtitle">
          Gestiona tus actividades deportivas de forma inteligente
        </p>
        
        <div className="button-container">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/actividades")}
          >
            <span className="btn-icon"></span>
            Ver Actividades
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/misactividades")}
          >
            <span className="btn-icon"></span>
            Mis Actividades
          </button>
        </div>
      </main>
    </>
  );
}