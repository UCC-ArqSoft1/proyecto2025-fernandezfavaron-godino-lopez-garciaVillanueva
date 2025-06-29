import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hashPassword } from './Hashing';


function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");

    try {
      const passwordHash = await hashPassword(password);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: passwordHash,
          nombre: nombre,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        setMensajeError(data || "Error al registrarse.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensajeError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {mensajeError && <p className="error">{mensajeError}</p>}
        <button className="slice" type="submit">
            <span className="text">Ingresar</span>
        </button>
      </form>
    </div>
  );
}

export default Register;
