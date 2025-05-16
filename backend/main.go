package main

import (
	"Proyecto/app"
	"Proyecto/database"
	"Proyecto/domain"
)

func main() {
	database.ConectarBD()

	// Migrar las tablas
	db := database.GetDB()
	db.AutoMigrate(&domain.Usuario{}, &domain.Actividad{}, &domain.Inscripcion{})
	// App
	app.StartApp()

}
