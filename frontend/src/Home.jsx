import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <nav style={{ padding: '1rem', background: '#202020' }}>
        <h2 style={{ color: '#fff' }}>🏋️ Sistema de Gestión Deportiva</h2>
      </nav>
      <main style={{ padding: '2rem', color: '#fff' }}>
        <h1>Página de inicio</h1>
        <button
          style={{ marginRight: "1em", padding: "0.7em 1.5em", borderRadius: "6px", border: "none", background: "#2d72d9", color: "#fff", cursor: "pointer" }}
          onClick={() => navigate("/actividades")}
        >
          Ver Actividades
        </button>
        <button
          style={{ padding: "0.7em 1.5em", borderRadius: "6px", border: "none", background: "#4fc3f7", color: "#222", cursor: "pointer" }}
          onClick={() => navigate("/Misactividades")}
        >
          Mis Actividades
        </button>
      </main>
    </>
  );
}