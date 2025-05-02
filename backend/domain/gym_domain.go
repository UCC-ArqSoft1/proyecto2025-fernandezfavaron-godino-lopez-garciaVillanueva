package domain

type usuario struct {
	ID           int    `json:"id"`
	Email        string `json:"email"`
	PasswordHash string `json:"password"`
	Nombre       string `json:"nombre"`
	Admin        bool   `json:"admin"`
	Foto         string `json:"foto"`
}

type actividad struct {
	ID          int    `json:"id"`
	Nombre      string `json:"nombre"`
	Descripcion string `json:"descripcion"`
	Dia         string `json:"dia"`
	Horario     string `json:"horario"`
	Cupos       int    `json:"cupos"`
	Categoria   string `json:"categoria"`
	Instructor  string `json:"instructor"`
	Foto        string `json:"foto"`
}

type inscripcion struct {
	IDUsuario        int    `json:"id_usuario"`
	IDActividad      int    `json:"id_actividad"`
	FechaInscripcion string `json:"fecha_inscripcion"`
}
