package app

import (
	"Proyecto/controller"

	"github.com/gin-gonic/gin"
)

func StartApp() {
	router := gin.New()

	// Endpoints/Urls
	router.POST("/login", controller.Log)
	router.POST("/register", controller.Reg)

	router.GET("/actividades", controller.GetActividades)
	router.GET("/misactividades", controller.ValidateToken, controller.GetMisActividades)

	router.Run(":8080")
}
