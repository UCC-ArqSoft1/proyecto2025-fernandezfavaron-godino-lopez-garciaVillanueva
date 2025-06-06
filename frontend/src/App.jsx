import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Actividades from './Actividades'; 
import MisActividades from './MisActividades';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/actividades" element={<Actividades />} />
      <Route path="/misactividades" element={<MisActividades />} />
    </Routes>
  );
}

export default App;
