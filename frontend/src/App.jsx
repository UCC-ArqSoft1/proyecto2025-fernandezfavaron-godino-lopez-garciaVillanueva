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
      <Route path="/Actividades" element={<Actividades />}/>
      <Route path="/MisActividades" element={<MisActividades />}/>
    </Routes>
  );
}

export default App;

