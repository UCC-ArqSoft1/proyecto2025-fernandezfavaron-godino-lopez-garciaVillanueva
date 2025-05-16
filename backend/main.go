package main

import (
	"Proyecto/app"
	"Proyecto/database"
)

func main() {
	database.ConectarBD()

	// Migrar las tablas
	// App
	app.StartApp()

}
