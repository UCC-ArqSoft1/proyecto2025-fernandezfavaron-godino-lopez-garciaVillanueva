import ActividadesTable from "./Actividades";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MisActividades = () => {
    const [actividades, setActividades] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchActividades = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8080/misactividades", {
            headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.ok) {
            throw new Error("Error al obtener las actividades");
            }
    
            const data = await response.json();
            setActividades(data);
        } catch (error) {
            console.error("Error:", error);
        }
        };
    
        fetchActividades();
    }, [navigate]);

    const handleVolver = () => {
        navigate("/home");
    };


    return (
        <div className="mis-actividades-container">
        <h2>Mis Actividades</h2>
                    <button onClick={handleVolver}>Volver a Home</button>
        {actividades.length === 0 && <p>No tienes actividades registradas.</p>}
        <ActividadesTable actividades={actividades} />
        </div>
    );
    }
export default MisActividades;