package domain

import "time"

type Usuario struct {
	ID           uint      `gorm:"primaryKey" json:"id_usuario"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"password"`
	Nombre       string    `json:"nombre"`
	IsAdmin      bool      `gorm:"type:bool" json:"admin"`
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
	IDUsuario        uint      `gorm:"primaryKey" json:"id_usuario"`
	IDActividad      uint      `gorm:"primaryKey" json:"id_actividad"`
	Usuario          Usuario   `gorm:"foreignKey:IDUsuario;constraint:OnDelete:CASCADE" json:"-"`
	Actividad        Actividad `gorm:"foreignKey:IDActividad;constraint:OnDelete:CASCADE" json:"-"`
	FechaInscripcion time.Time `gorm:"autoCreateTime" json:"fecha_inscripcion"`
}
