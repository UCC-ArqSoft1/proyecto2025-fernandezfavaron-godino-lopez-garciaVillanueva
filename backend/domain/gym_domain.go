package domain

import "time"

type Usuario struct {
	ID           uint      `gorm:"primaryKey" json:"id_usuario"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"password"`
	Nombre       string    `json:"nombre"`
	Admin        bool      `gorm:"type:enum('socio','administrador')" json:"admin"`
	Foto         string    `json:"foto"`
	Usuarios     []Usuario `gorm:"many2many:inscripcions;" json:"usuarios"`
}

type Actividad struct {
	ID          uint        `gorm:"primaryKey" json:"id_actividad"`
	Nombre      string      `json:"nombre"`
	Descripcion string      `json:"descripcion"`
	Dia         string      `json:"dia"`
	Horario     time.Time   `json:"horario"`
	Duracion    int         `json:"duracion"`
	Cupos       int         `json:"cupos"`
	Categoria   string      `json:"categoria"`
	Instructor  string      `json:"instructor"`
	FotoURL     string      `json:"fotourl"`
	Actividades []Actividad `gorm:"many2many:inscripcions;" json:"actividades"`
}

type Inscripcion struct {
	IDUsuario        uint   `gorm:"primaryKey" json:"id_usuario"`
	IDActividad      uint   `gorm:"primaryKey" json:"id_actividad"`
	FechaInscripcion string `gorm:"autoCreateTime" json:"fecha_inscripcion"`
}

type LoginRequest struct {
	Email        string `json:"email" binding:"required"`
	PasswordHash string `json:"password" binding:"required"`
}
