package domain

import "time"

type LoginRequestDTO struct {
	Email        string `json:"email" binding:"required"`
	PasswordHash string `json:"password" binding:"required"`
}

type RegisterRequestDTO struct {
	Email        string `json:"email" binding:"required"`
	PasswordHash string `json:"password" binding:"required"`
	Nombre       string `json:"nombre" binding:"required"`
}

type ActividadRequestDTO struct {
	Categoria  string `form:"categoria"`
	Nombre     string `form:"nombre"`
	Instructor string `form:"instructor"`
	Dia        string `form:"dia"`
	Horario    string `form:"horario"`
	Page       int    `form:"page"`
}

type InscripcionRequestDTO struct {
	IDActividad uint `json:"id_actividad" binding:"required"`
}

type ActividadDTO struct {
	ID          uint      `json:"id"`
	Nombre      string    `json:"nombre"`
	Descripcion string    `json:"descripcion"`
	Dia         string    `json:"dia"`
	Horario     time.Time `json:"horario"`
	Duracion    int       `json:"duracion"`
	Cupos       int       `json:"cupos"`
	Categoria   string    `json:"categoria"`
	Instructor  string    `json:"instructor"`
	FotoURL     string    `json:"fotourl"`
	Inscripto   bool      `json:"inscripto"`
}

type InscripcionDTO struct { //No usada por ahora
	ActividadID uint      `json:"actividad_id"`
	UsuarioID   uint      `json:"usuario_id"`
	Fecha       time.Time `json:"fecha"`
}
