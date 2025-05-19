package controller

import (
	"Proyecto/database"
	"Proyecto/domain"
	"Proyecto/services"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwt_tokenprivado = []byte("soy-la-contrasena-secreta")

// Consultar base de datos de Franco xD
func authenticateUser(email string) *domain.Usuario {
	user, err := services.QueryUsuarioByMail(database.DB, email)
	//Demencia?
	if err != nil {
		return user
	}
	return nil
}

// Generar token JWT
type Claims struct {
	id uint
	jwt.RegisteredClaims
}

func generateJWTWithClaims(email string, idu uint) (string, error) {
	claims := Claims{
		id: idu,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   email,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(48 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwt_tokenprivado)
}

// Revisa formato valido, contrasena correcta, genera el token y lo devuelve.
func Log(contexto *gin.Context) {
	var req domain.LoginRequestDTO
	// Revisa que el formato del JSON sea correcto
	if err := contexto.ShouldBindJSON(&req); err != nil {
		contexto.JSON(http.StatusBadRequest, "error: Datos inválidos")
		return
	}

	user := authenticateUser(req.Email)
	if user == nil {
		contexto.JSON(http.StatusUnauthorized, "error: Usuario no encontrado")
		return
	}

	if user.PasswordHash != req.PasswordHash {
		contexto.JSON(http.StatusUnauthorized, "error: Credenciales inválidas")
		return
	}

	token, err := generateJWTWithClaims(user.Email, user.ID)
	if err != nil {
		contexto.JSON(http.StatusInternalServerError, "error: Error generando token")
		return
	}

	contexto.JSON(http.StatusOK, gin.H{"token": token})
}

// Revisa formato valido, contrasena correcta, genera el token y lo devuelve.
func Reg(contexto *gin.Context) {
	var req domain.RegisterRequestDTO
	// Revisa que el formato del JSON sea correcto
	if err := contexto.ShouldBindJSON(&req); err != nil {
		contexto.JSON(http.StatusBadRequest, "error: Datos inválidos")
		return
	}

	user := authenticateUser(req.Email)
	if user != nil {
		contexto.JSON(http.StatusUnauthorized, "error: Usuario previamente registrado")
		return
	}

	// Crear nuevo usuario
	newUser := domain.Usuario{
		Email:        req.Email,
		PasswordHash: req.PasswordHash,
		Nombre:       req.Nombre,
		IsAdmin:      false,
		Foto:         "",
	}

	// Guardar el nuevo usuario en la base de datos
	if err, id := services.CreateUsuario(database.DB, &newUser); err != nil {
		contexto.JSON(http.StatusInternalServerError, "error: Error creando usuario")
		return
	} else {
		newUser.ID = id
	}

	// Generar token JWT
	token, err := generateJWTWithClaims(newUser.Email, newUser.ID)
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
