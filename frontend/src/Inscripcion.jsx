import { useNavigate } from 'react-router-dom';
const handleInscribir = async (actividadID, alreadyInscribed) => {
    const token = localStorage.getItem('token');
    if (!token) {
        useNavigate("/");
        return;
    }

    const url = alreadyInscribed
        ? 'http://localhost:8080/unscripcion'
        : 'http://localhost:8080/inscripcion';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_actividad: actividadID })
        });

        const jsonResponse = await response.json();


        if (!response.ok) {
            const errorMsg = jsonResponse?.error?.message || jsonResponse?.error;
            return errorMsg || 'Error desconocido del servidor.';
        }

        const successMessage = alreadyInscribed
            ? "Inscripcion eliminada exitosamente"
            : "Inscripción exitosa";

        if (jsonResponse === successMessage) {
            return actividadID;
        } else {
            // Esto no debería pasar, pero lo devolvemos por si acaso
            return jsonResponse;
        }
    } catch (error) {
        console.error("Error de red:", error);
        return "Error de red o del servidor. Intenta más tarde.";
    }
};

export default handleInscribir;