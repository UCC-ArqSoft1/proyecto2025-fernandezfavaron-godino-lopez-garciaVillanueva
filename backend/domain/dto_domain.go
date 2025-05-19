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
	Categoria  string `json:"categoria"`
	Nombre     string `json:"nombre"`
	Instructor string `json:"instructor"`
	Dia        string `json:"dia"`
	Horario    string `json:"horario"`
	Page       int    `json:"page"`
}

type ActividadDTO struct {
	Nombre      string    `json:"nombre"`
	Descripcion string    `json:"descripcion"`
	Dia         string    `json:"dia"`
	Horario     time.Time `json:"horario"`
	Duracion    int       `json:"duracion"`
	Cupos       int       `json:"cupos"`
	Categoria   string    `json:"categoria"`
	Instructor  string    `json:"instructor"`
	FotoURL     string    `json:"fotourl"`
}
