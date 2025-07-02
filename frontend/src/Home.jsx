import { useNavigate } from "react-router-dom";
import "./Home.css";

function AdminToken() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.isAdmin === true;
  } catch {
    return false;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const isAdmin = AdminToken();

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

      <main className="main-content">
        <h1 className="main-title">¡Bienvenido al Centro Deportivo!</h1>
        <p className="main-subtitle">
          Gestiona tus actividades deportivas de forma inteligente.
        </p>

        <div className="button-container">
          {/*1*/}
          <button
            className="btn btn-primary"
            onClick={() => navigate("/actividades")}
          >
            {isAdmin ? "Administrar Actividades" : "Ver Actividades"}
          </button>

          {/*2*/}
          {!isAdmin && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/misactividades")}
            >
              Mis Actividades
            </button>
          )}
        </div>
      </main>
    </>
  );
}
