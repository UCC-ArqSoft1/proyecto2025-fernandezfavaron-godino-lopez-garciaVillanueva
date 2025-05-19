package services

import (
	"Proyecto/database"
	"Proyecto/domain"
	"errors"
	"fmt"
)

func QueryUsuarioByMail(email string) (*domain.Usuario, error) {
	var u domain.Usuario
	err := database.DB.Where("email = ?", email).First(&u).Error
	return &u, err
}

func QueryActividadByID(id uint) (*domain.Actividad, error) {
	var a domain.Actividad
	err := database.DB.Where("id = ?", id).First(&a).Error
	return &a, err
}

func QueryInscripcionByIDofUsuario(id uint) (*domain.Inscripcion, error) {
	var i domain.Inscripcion
	err := database.DB.Where("id = ?", id).First(&i).Error
	return &i, err
}

func CreateUsuario(u *domain.Usuario) (uint, error) {
	err := database.DB.Create(&u).Error
	return u.ID, err
}

func GetActividades(categoria, nombre, instructor, dia, horario string, page int) ([]domain.ActividadDTO, error) {
	var actividades []domain.Actividad
	query := database.DB

	if categoria != "" {
		query = query.Where("categoria = ?", categoria)
	}
	if nombre != "" {
		query = query.Where("nombre = ?", nombre)
	}
	if instructor != "" {
		query = query.Where("instructor = ?", instructor)
	}
	if dia != "" {
		query = query.Where("dia = ?", dia)
	}
	if horario != "" {
		query = query.Where("horario = ?", horario)
	}
	query = query.Order("id ASC")

	// Limite por consultas
	const defaultLimit = 20
	if page > 20 || page < 0 {
		page = 0
	} //Por que 20? Porque ddos, se puede aumentar sin afectar el rendimiento incluso bajo ddos pero no me parece necesario mas de 2000 actividades.

	var actividadesDTO []domain.ActividadDTO
	err := query.Limit(defaultLimit).Offset(page * defaultLimit).Find(&actividades).Error
	for _, actividad := range actividades {
		adto := domain.ActividadDTO{
			Nombre:      actividad.Nombre,
			Descripcion: actividad.Descripcion,
			Dia:         actividad.Dia,
			Horario:     actividad.Horario,
			Duracion:    actividad.Duracion,
			Cupos:       actividad.Cupos,
			Categoria:   actividad.Categoria,
			Instructor:  actividad.Instructor,
			FotoURL:     actividad.FotoURL,
		}
		actividadesDTO = append(actividadesDTO, adto)
	}
	return actividadesDTO, err
}

func GetActividadesByUsuarioID(id uint) ([]domain.ActividadDTO, error) {
	var inscripciones []domain.Inscripcion
	err := database.DB.Where("id_usuario = ?", id).Find(&inscripciones).Error
	if err != nil {
		return nil, errors.New("error: no se encontraron inscripciones para el usuario")
	}
	var actividadesdto []domain.ActividadDTO
	var ids []uint
	for _, inscripcion := range inscripciones {
		ids = append(ids, inscripcion.IDActividad)
	}
	for _, id := range ids {
		var actividad domain.Actividad
		err = database.DB.Where("id = ?", id).First(&actividad).Error
		actividadDTO := domain.ActividadDTO{
			Nombre:      actividad.Nombre,
			Descripcion: actividad.Descripcion,
			Dia:         actividad.Dia,
			Horario:     actividad.Horario,
			Duracion:    actividad.Duracion,
			Cupos:       actividad.Cupos,
			Categoria:   actividad.Categoria,
			Instructor:  actividad.Instructor,
			FotoURL:     actividad.FotoURL,
		}
		if err != nil {
			return nil, fmt.Errorf("error al obtener actividad con ID %d: %w, pero deberia existir", id, err)
		}
		actividadesdto = append(actividadesdto, actividadDTO)
	}
	return actividadesdto, nil
}
