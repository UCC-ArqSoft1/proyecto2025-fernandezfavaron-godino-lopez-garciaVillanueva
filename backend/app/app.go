package app

import (
	"Proyecto/controller"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func StartApp() {
	router := gin.New()

	// Habilitar CORS
	router.Use(cors.Default())
	// Endpoints/Urls
	router.POST("/login", controller.Log)
	router.POST("/register", controller.Reg)

	router.GET("/actividades", controller.GetActividades)
	router.GET("/actividades/:id", controller.GetActividadByID)
	router.GET("/misactividades", controller.ValidateToken, controller.GetMisActividades)
	router.POST("/inscripcion", controller.ValidateToken, controller.Inscripcion)
	router.POST("/unscripcion", controller.ValidateToken, controller.Unscripcion)

	router.Run(":8080")
}
