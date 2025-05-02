package main

import "time"

type Actividad struct {
	ID          uint `gorm:"primaryKey"`
	Titulo      string
	Descripcion string
	FotoURL     string
	Instructor  string
	Dia         string
	Horario     time.Time
	Duracion    int
	Cupo        int
	Categoria   string
}
