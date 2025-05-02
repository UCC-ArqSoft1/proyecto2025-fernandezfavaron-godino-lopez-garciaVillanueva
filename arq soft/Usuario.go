package main

type Usuario struct {
	ID             uint   `gorm:"primaryKey"`
	NombreUsuario  string `gorm:"unique"`
	ContrasenaHash string
	Rol            string `gorm:"type:enum('socio','administrador')"`
}
