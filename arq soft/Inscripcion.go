package main

import "time"

type Inscripcion struct {
	ID               uint `gorm:"primaryKey"`
	UsuarioID        uint
	ActividadID      uint
	FechaInscripcion time.Time `gorm:"autoCreateTime"`
}
