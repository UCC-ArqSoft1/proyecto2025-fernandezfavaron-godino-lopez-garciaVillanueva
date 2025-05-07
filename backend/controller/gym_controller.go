package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwt_tokenprivado = []byte("soy-la-contrasena-secreta")

// Mover a domain??
type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Consultar base de datos de Franco xD
func authenticateUser(email, password string) bool {
	return email == "root" && password == "admin"
}

// Generar token JWT
func generateJWT(username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": username,
		"exp": time.Now().Add(time.Hour * 72).Unix(),
	})

	return token.SignedString(jwt_tokenprivado)
}

// Revisa formato valido, contrasena correcta, genera el token y lo devuelve.
func Logueo(contexto *gin.Context) {
	var req LoginRequest
	if err := contexto.ShouldBindJSON(&req); err != nil {
		contexto.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	if !authenticateUser(req.Email, req.Password) {
		contexto.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
		return
	}

	token, err := generateJWT(req.Email)
	if err != nil {
		contexto.JSON(http.StatusInternalServerError, gin.H{"error": "Error generando token"})
		return
	}

	contexto.JSON(http.StatusOK, gin.H{"token": token})
}
