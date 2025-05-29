import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [passwordHash, setPasswordHash] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5173/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passwordHash }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        setError(data || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
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
          value={passwordHash}
          onChange={(e) => setPasswordHash(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Ingresar</button>
        <p>¿No tenés una cuenta? <Link to="/register">Registrate acá</Link></p>
      </form>
    </div>
  );
};

export default Login;
