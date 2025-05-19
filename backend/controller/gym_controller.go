package controller

import (
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
	user, err := services.QueryUsuarioByMail(email)
	//Demencia?
	if err != nil {
		return nil
	}
	return user
}

// Generar token JWT
type Claims struct {
	ID uint
	jwt.RegisteredClaims
}

func generateJWTWithClaims(email string, idu uint) (string, error) {
	claims := Claims{
		ID: idu,
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
	if id, err := services.CreateUsuario(&newUser); err != nil {
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
	var req struct {
		Token string `json:"token" binding:"required"`
	}
	if err := contexto.ShouldBindJSON(&req); err != nil || req.Token == "" {
		contexto.JSON(http.StatusUnauthorized, "error: Token no proporcionado")
		contexto.Abort()
		return
	}

	token, err := jwt.ParseWithClaims(req.Token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, http.ErrNotSupported
		}
		return jwt_tokenprivado, nil
	})

	if err != nil || !token.Valid {
		contexto.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
		contexto.Abort()
		return
	}

	contexto.Set("userID", token.Claims.(*Claims).ID)
	contexto.Set("email", token.Claims.(*Claims).Subject)
	contexto.Next()
}

func GetActividades(contexto *gin.Context) {
	var req domain.ActividadRequestDTO
	// Revisa que el formato del JSON sea correcto
	if err := contexto.ShouldBindQuery(&req); err != nil {
		contexto.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos", "formato": req})
		return
	}
	// Obtener los parámetros de búsqueda
	actividades, err := services.GetActividades(req.Categoria, req.Nombre, req.Instructor, req.Dia, req.Horario, req.Page)
	if err != nil {
		contexto.JSON(http.StatusInternalServerError, "error: Error obteniendo actividades, cod 404")
		return
	}

	contexto.JSON(http.StatusOK, actividades)
}

// Casi igual que el anterior pero filtrando por el id del usuario
func GetMisActividades(contexto *gin.Context) {

	// Obtener el ID del usuario desde el contexto
	id := contexto.GetUint("userID")
	// Obtener las actividades del usuario
	actividades, err := services.GetActividadesByUsuarioID(id)
	if err != nil {
		contexto.JSON(http.StatusInternalServerError, "error: Error obteniendo actividades, cod 405")
		return
	}

	contexto.JSON(http.StatusOK, actividades)
}
