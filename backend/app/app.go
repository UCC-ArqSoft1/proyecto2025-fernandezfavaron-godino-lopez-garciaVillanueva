package app

import (
	"Proyecto/controller"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func StartApp() {
	router := gin.New()

	// Habilitar CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173"}, //3000 docker y 5173 desarrollo
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	// Endpoints/Urls
	router.POST("/login", controller.Log)
	router.POST("/register", controller.Reg)
	router.GET("/actividades", controller.GetActividades)
	router.GET("/actividades/:id", controller.GetActividadByID)
	router.GET("/misactividades", controller.ValidateToken, controller.GetMisActividades)
	router.GET("/inscripciones", controller.ValidateToken, controller.GetInscripciones)
	router.POST("/inscripcion", controller.ValidateToken, controller.Inscripcion)
	router.POST("/unscripcion", controller.ValidateToken, controller.Unscripcion)
	router.POST("/actividades", controller.ValidateToken, controller.CrearActividad)
	router.PUT("/actividades/:id", controller.ValidateToken, controller.EditarActividad)
	router.DELETE("/actividades/:id", controller.ValidateToken, controller.EliminarActividad)
	router.Run(":8080")
}
