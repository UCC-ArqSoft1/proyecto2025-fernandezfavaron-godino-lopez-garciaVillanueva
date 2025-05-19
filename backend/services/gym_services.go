package services

import (
	"Proyecto/domain"

	"gorm.io/gorm"
)

func QueryUsuarioByMail(db *gorm.DB, email string) (*domain.Usuario, error) {
	var u domain.Usuario
	err := db.Where("email = ?", email).First(&u).Error
	return &u, err
}

func QueryActividadByID(db *gorm.DB, id uint) (*domain.Actividad, error) {
	var a domain.Actividad
	err := db.Where("id = ?", id).First(&a).Error
	return &a, err
}

func QueryInscripcionByIDofUsuario(db *gorm.DB, id uint) (*domain.Inscripcion, error) {
	var i domain.Inscripcion
	err := db.Where("id = ?", id).First(&i).Error
	return &i, err
}

func CreateUsuario(db *gorm.DB, u *domain.Usuario) (error, uint) {
	return db.Create(u).Error, u.ID
}
