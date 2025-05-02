CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    contrasena_hash VARCHAR(256) NOT NULL,
    rol ENUM('socio', 'administrador') NOT NULL
);

CREATE TABLE actividades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    foto_url VARCHAR(255),
    instructor VARCHAR(100) NOT NULL,
    dia VARCHAR(20) NOT NULL,
    horario TIME NOT NULL,
    duracion INT NOT NULL, -- en minutos
    cupo INT NOT NULL,
    categoria VARCHAR(50) NOT NULL
);

-- Tabla de inscripciones
CREATE TABLE inscripciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    actividad_id INT NOT NULL,
    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, actividad_id) -- para evitar inscripciones duplicadas
);
