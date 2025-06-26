package controller

import (
	"Proyecto/domain"
	"Proyecto/services"
	"net/http"
	"strconv"
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
type claims struct {
	ID      uint
	IsAdmin bool
	jwt.RegisteredClaims
}

func generateJWTWithClaims(email string, idu uint, isadmin bool) (string, error) {
	claims := claims{
		ID:      idu,
		IsAdmin: isadmin,
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

	token, err := generateJWTWithClaims(user.Email, user.ID, user.IsAdmin)
	if err != nil {
		contexto.JSON(http.StatusInternalServerError, "error: Error generando token")
		return
	}
	contexto.JSON(http.StatusOK, gin.H{"token": token, "admin": user.IsAdmin})
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
	token, err := generateJWTWithClaims(newUser.Email, newUser.ID, newUser.IsAdmin)
	if err != nil {
		contexto.JSON(http.StatusInternalServerError, "error: Error generando token")
		return
	}

	contexto.JSON(http.StatusOK, gin.H{"token": token, "admin": newUser.IsAdmin})
}

// Middleware para validar el token JWT
func ValidateToken(contexto *gin.Context) {

	// 1. Buscar en header Authorization: Bearer <token>
	tokenstring := contexto.GetHeader("Authorization")
	if len(tokenstring) > 7 && tokenstring[:7] == "Bearer " {
		tokenstring = tokenstring[7:]
	} else {
		contexto.JSON(http.StatusUnauthorized, gin.H{"error": "Token no proporcionado"})
		contexto.Abort()
		return
	}

	token, err := jwt.ParseWithClaims(tokenstring, &claims{}, func(token *jwt.Token) (interface{}, error) {
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

	contexto.Set("userID", token.Claims.(*claims).ID)
	contexto.Set("email", token.Claims.(*claims).Subject) // Capaz innecesario
	contexto.Next()
}

func GetActividades(contexto *gin.Context) {
	// Filtros sin id
	var req domain.ActividadRequestDTO
	if err := contexto.ShouldBindQuery(&req); err != nil {
		contexto.JSON(http.StatusBadRequest, gin.H{"error": "Parámetros inválidos"})
		return
	}

	pages, actividades, err := services.GetActividades(req.Categoria, req.Nombre, req.Instructor, req.Dia, req.Horario, req.Page)
	if err != nil {
		contexto.JSON(http.StatusInternalServerError, gin.H{"error": "Error obteniendo actividades"})
		return
	}
	contexto.JSON(http.StatusOK, gin.H{
		"pages":       pages,
		"actividades": actividades,
	})
}

func GetActividadByID(contexto *gin.Context) {
	ids := contexto.Param("id")
	id64, err := strconv.ParseUint(ids, 10, 32)
	if err != nil {
		contexto.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}
	id := uint(id64)
	// Obtener la actividad por ID
	actividad, err := services.QueryActividadByID(id)
	if err != nil {
		contexto.JSON(http.StatusInternalServerError, gin.H{"error": "Error obteniendo actividad"})
		return
	}
	contexto.JSON(http.StatusOK, actividad)
}

// Inscripcion a una actividad
func Inscripcion(contexto *gin.Context) {
	var i domain.InscripcionRequestDTO
	if err := contexto.ShouldBindJSON(&i); err != nil {
		contexto.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}
	id := contexto.GetUint("userID")

	// Guardar la inscripción en la base de datos
	if err := services.CreateInscripcion(id, i.IDActividad); err != nil {
		if err.Error() == "ErrUsuarioYaInscrito" || err.Error() == "ErrUsuarioNoInscrito" {
			contexto.JSON(http.StatusNotAcceptable, gin.H{"error": err.Error()})
			return
		}
		contexto.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	contexto.JSON(http.StatusOK, "Inscripción exitosa")
}

func Unscripcion(contexto *gin.Context) {
	var i domain.InscripcionRequestDTO
	if err := contexto.ShouldBindJSON(&i); err != nil {
		if err.Error() == "ErrUsuarioYaInscrito" || err.Error() == "ErrUsuarioNoInscrito" {
			contexto.JSON(http.StatusNotAcceptable, gin.H{"error": err.Error()})
			return
		}
		contexto.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}
	id := contexto.GetUint("userID")

	// Guardar la inscripción en la base de datos
	if err := services.DeleteInscripcion(id, i.IDActividad); err != nil {
		contexto.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	contexto.JSON(http.StatusOK, "Inscripcion eliminada exitosamente")
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

func GetInscripciones(contexto *gin.Context) {
	// Obtener el ID del usuario desde el contexto
	id := contexto.GetUint("userID")
	// Obtener las inscripciones del usuario
	inscripciones, err := services.GetActividadesByUsuarioIDOnlyIDs(id)
	if err != nil {
		contexto.JSON(http.StatusInternalServerError, "error: Error obteniendo inscripciones, cod 405")
		return
	}

	contexto.JSON(http.StatusOK, inscripciones)
}

func EliminarActividad(contexto *gin.Context) {
	if !contexto.GetBool("isAdmin") {
		contexto.JSON(http.StatusForbidden, gin.H{"error": "No tienes permisos"})
		return
	}

	ids := contexto.Param("id")
	id64, err := strconv.ParseUint(ids, 10, 32)
	if err != nil {
		contexto.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}
	id := uint(id64)

	if err := services.EliminarActividad(id); err != nil {
		contexto.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	contexto.JSON(http.StatusOK, "Actividad eliminada correctamente")
}

func EditarActividad(contexto *gin.Context) {
	isAdmin := contexto.GetBool("isAdmin")
	if !isAdmin {
		contexto.JSON(http.StatusForbidden, gin.H{"error": "De aca no pasas flaquito"})
		return
	}
	//hay que borrar los de aca no pasas flaquito
	ids := contexto.Param("id")
	id64, err := strconv.ParseUint(ids, 10, 32) // trasnforma el string en numero uint de base 10 y tamaño 32
	if err != nil {
		contexto.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}
	id := uint(id64)

	var nueva domain.Actividad
	err = contexto.ShouldBindJSON(&nueva)
	if err != nil {
		contexto.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	err = services.EditarActividad(id, nueva)
	if err != nil {
		contexto.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	contexto.JSON(http.StatusOK, gin.H{
		"mensaje":   "Actividad editada correctamente",
		"actividad": nueva,
	})
}

func CrearActividad(contexto *gin.Context) {
	isAdmin := contexto.GetBool("isAdmin")
	if !isAdmin {
		contexto.JSON(http.StatusForbidden, gin.H{"error": "No tienes permisos"})
		return
	}

	var nueva domain.Actividad

	err := contexto.ShouldBindJSON(&nueva)
	if err != nil {
		contexto.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	id, err := services.CreateActividad(&nueva)
	if err != nil {
		contexto.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo crear la actividad"})
		return
	}

	nueva.ID = id
	contexto.JSON(http.StatusOK, gin.H{
		"mensaje":   "Actividad creada correctamente",
		"actividad": nueva,
	})
}
