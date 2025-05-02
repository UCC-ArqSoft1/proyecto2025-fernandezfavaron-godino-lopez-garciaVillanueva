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

### 🛠️ Administración

- `PUT /admin/actividades/{id}`:  
  Permite a un administrador editar una actividad existente. Requiere autenticación y permisos de administrador.

## 🧱 Estructura de Datos

### Usuario

```go
type Usuario struct {
    ID           int    `json:"id"`
    Email        string `json:"email"`
    PasswordHash string `json:"password"`
    Nombre       string `json:"nombre"`
    Admin        bool   `json:"admin"`
}
