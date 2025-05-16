package controller

import (
	"Proyecto/domain"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwt_tokenprivado = []byte("soy-la-contrasena-secreta")

// Consultar base de datos de Franco xD
func authenticateUser(email, password string) bool {
	return email == "root" && password == "admin"
}

// Generar token JWT
func generateJWT(id uint) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": id,
		"exp": time.Now().Add(time.Hour * 48).Unix(),
	})
	return token.SignedString(jwt_tokenprivado)
}

// Revisa formato valido, contrasena correcta, genera el token y lo devuelve.
func Logueo(contexto *gin.Context) {
	var req domain.LoginRequest
	if err := contexto.ShouldBindJSON(&req); err != nil {
		contexto.JSON(http.StatusBadRequest, "error: Datos inválidos")
		return
	}

	if !authenticateUser(req.Email, req.PasswordHash) {
		contexto.JSON(http.StatusUnauthorized, "error: Credenciales inválidas")
		return
	}

	token, err := generateJWT()
	if err != nil {
		contexto.JSON(http.StatusInternalServerError, "error: Error generando token")
		return
	}

	contexto.JSON(http.StatusOK, gin.H{"token": token})
}

// Middleware para validar el token JWT
func ValidateToken(contexto *gin.Context) {
	tokenString := contexto.GetHeader("token")
	if tokenString == "" {
		contexto.JSON(http.StatusUnauthorized, "error: Token no proporcionado")
		contexto.Abort()
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, http.ErrNotSupported
		}
		return jwt_tokenprivado, nil
	})

	if err != nil || !token.Valid {
		contexto.JSON(http.StatusUnauthorized, "error: Token inválido")
		contexto.Abort()
		return
	}

	contexto.Next()
}
