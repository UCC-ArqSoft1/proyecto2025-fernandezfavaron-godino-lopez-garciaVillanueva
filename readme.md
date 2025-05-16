# 🏗️ Sistema de Gestión de Actividades Deportivas

Este proyecto es una API REST para gestionar actividades deportivas, socios y administradores. Permite a los usuarios ver y registrarse en actividades, mientras que los administradores pueden crear, editar o eliminar actividades.

## 📚 Descripción

El sistema está diseñado para manejar diferentes tipos de usuarios (socios y administradores) y brindar funcionalidades de autenticación, visualización y gestión de actividades.

## 🚀 Endpoints

### 🔐 Autenticación

- `POST /login`:  
  Endpoint de autenticación. Recibe credenciales (`email` y `password`) y usa un token JWT

### 🏃‍♂️ Actividades

- `GET /actividades`:  
  Devuelve un listado de actividades disponibles. Se pueden usar parametros para buscar

- `GET /misactividades`:  
  Devuelve las actividades en las que el usuario autenticado está inscrito. Usa el mismo controlador que `/actividades`, pero filtrando por ID de usuario.

- `GET /imagen`
  Devuelve la imagen segun su url
  
### 🛠️ Administración

- `PUT /admin/actividades/{id}`:  
  Permite a un administrador editar una actividad existente. Requiere autenticación y permisos de administrador.

## 🧱 Estructura de Datos

### Usuario

```go
type Usuario struct {
	ID           uint      `gorm:"primaryKey" json:"id_usuario"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"password"`
	Nombre       string    `json:"nombre"`
	Admin        bool      `gorm:"type:enum('socio','administrador')" json:"admin"`
	Foto         string    `json:"foto"`
	Usuarios     []Usuario `gorm:"many2many:inscripciones;" json:"usuarios"`
}
```

### Actividad
```go
type Actividad struct {
	ID          uint        `gorm:"primaryKey" json:"id_actividad"`
	Nombre      string      `json:"nombre"`
	Descripcion string      `json:"descripcion"`
	Dia         string      `json:"dia"`
	Horario     time.Time   `json:"horario"`
	Duracion    int         `json:"duracion"`
	Cupos       int         `json:"cupos"`
	Categoria   string      `json:"categoria"`
	Instructor  string      `json:"instructor"`
	FotoURL     string      `json:"fotourl"`
	Actividades []Actividad `gorm:"many2many:inscripciones;" json:"actividades"`
}
```

### Incripcion
```go
type Inscripcion struct {
	IDUsuario        uint   `gorm:"primaryKey" json:"id_usuario"`
	IDActividad      uint   `gorm:"primaryKey" json:"id_actividad"`
	FechaInscripcion string `gorm:"autoCreateTime" json:"fecha_inscripcion"`
}
```
