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
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST"},
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
	router.POST("/actividad", controller.CrearActividad)
	router.PUT("/actividad/:id", controller.EditarActividad)
	router.DELETE("/actividad/:id", controller.EliminarActividad)
	router.Run(":8080")
}
