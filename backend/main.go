package main

import (
	"Proyecto/database"
	"Proyecto/domain"
) /*import (
	"Proyecto/controller"
	//"fmt"
	"github.com/gin-gonic/gin"
)
func main() {
	router := gin.New()
	router.GET("/hotels/:id", controller.GetHotel)
	router.Run()
}*/

func main() {
	database.ConectarBD()

	// Migrar las tablas
	db := database.GetDB()
	db.AutoMigrate(&domain.Usuario{}, &domain.Actividad{}, &domain.Inscripcion{})
}
