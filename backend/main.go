package main

import (
	"Proyecto/controller"
	"Proyecto/database"
	"Proyecto/domain"

	"github.com/gin-gonic/gin"
) /*
	//"fmt"

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
	rlogin := gin.New()
	rlogin.POST("/login", controller.Logueo)

	rlogin.Run()
	//Endpoints

}
