import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const handleInscribir = async (actividadID, alreadyInscribed) => {
    if (not(alreadyInscribed)) {
        try {
            const response = await fetch('http://localhost:8080/inscripcion', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({'id_actividad': actividadID})
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const jsonResponse = await response.json();
            if (jsonResponse === "Inscripción exitosa") {
                return actividadID;
            } else {
                //Esto no deberia pasar nunca, pero por si acaso
                return jsonResponse;
            }
        } catch (error) {
            if (error == "ErrUsuarioYaInscrito")
                return error;
            return error;
        }
    } else {
        try {
            const response = await fetch('http://localhost:8080/unscripcion', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({'id_actividad': actividadID})
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const jsonResponse = await response.json();
            if (jsonResponse === "Inscripcion eliminada exitosamente") {
                return actividadID;
            } else {
                //Esto no deberia pasar nunca, pero por si acaso
                return jsonResponse;
            }
        } catch (error) {
            if (error == "ErrUsuarioNoInscrito")
                return error;
            return error;
        }
    }
};
            
export default handleInscribir;