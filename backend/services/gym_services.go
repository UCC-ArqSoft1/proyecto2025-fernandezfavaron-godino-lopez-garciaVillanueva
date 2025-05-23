package services

import (
	"Proyecto/database"
	"Proyecto/domain"
	"errors"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func actividadtoActividadDTO(a *domain.Actividad) domain.ActividadDTO {
	return domain.ActividadDTO{
		ID:          a.ID,
		Nombre:      a.Nombre,
		Descripcion: a.Descripcion,
		Dia:         a.Dia,
		Horario:     a.Horario,
		Duracion:    a.Duracion,
		Cupos:       a.Cupos,
		Categoria:   a.Categoria,
		Instructor:  a.Instructor,
		FotoURL:     a.FotoURL,
	}
}

func QueryUsuarioByMail(email string) (*domain.Usuario, error) {
	var u domain.Usuario
	err := database.DB.Where("email = ?", email).First(&u).Error
	return &u, err
}

func QueryActividadByID(id uint) (*domain.ActividadDTO, error) {
	var a domain.Actividad
	err := database.DB.Where("id = ?", id).First(&a).Error
	if err != nil {
		return nil, err
	}
	actividadDTO := actividadtoActividadDTO(&a)
	return &actividadDTO, nil

}

func QueryInscripcionByIDofUsuario(id uint) (*domain.Inscripcion, error) {
	var i domain.Inscripcion
	err := database.DB.Where("id = ?", id).First(&i).Error
	return &i, err
}

func CreateInscripcion(usuarioID, actividadID uint) error {
	return database.DB.Transaction(func(db *gorm.DB) error {
		// Verificar si ya está inscrito
		var c int64 // contador inscripciones, no funciona con int
		if err := db.Model(&domain.Inscripcion{}).
			Where("id_usuario = ? AND id_actividad = ?", usuarioID, actividadID).
			Count(&c).Error; err != nil {
			return err
		}
		if c > 0 {
			return errors.New("el usuario ya está inscrito en esta actividad")
		}

		// Obtener la actividad con bloqueo
		var actividad domain.Actividad
		if err := db.Clauses(clause.Locking{Strength: "UPDATE"}).
			First(&actividad, actividadID).Error; err != nil {
			return err
		}

		// Verificar si hay cupos disponibles
		if actividad.Cupos <= 0 {
			return errors.New("no hay cupos disponibles")
		}

		// Crear la inscripción
		inscripcion := domain.Inscripcion{
			IDUsuario:   usuarioID,
			IDActividad: actividadID,
		}

		if err := db.Create(&inscripcion).Error; err != nil {
			return err
		}

		// Descontar cupo
		actividad.Cupos -= 1
		if err := db.Save(&actividad).Error; err != nil {
			return err
		}

		return nil
	})
}

func DeleteInscripcion(usuarioID, actividadID uint) error {
	return database.DB.Transaction(func(db *gorm.DB) error {
		// Verificar sino está inscrito
		var c int64 // contador inscripciones, no funciona con int
		if err := db.Model(&domain.Inscripcion{}).
			Where("id_usuario = ? AND id_actividad = ?", usuarioID, actividadID).
			Count(&c).Error; err != nil {
			return err
		}
		if c == 0 {
			return errors.New("el usuario no está inscrito en esta actividad")
		}

		// Obtener la actividad con bloqueo
		var actividad domain.Actividad
		if err := db.Clauses(clause.Locking{Strength: "UPDATE"}).
			First(&actividad, actividadID).Error; err != nil {
			return err
		}

		if err := db.Where("id_usuario = ? AND id_actividad = ?", usuarioID, actividadID).
			Delete(&domain.Inscripcion{}).Error; err != nil {
			return err
		}
		// Sumar cupo
		actividad.Cupos += 1
		if err := db.Save(&actividad).Error; err != nil {
			return err
		}

		return nil
	})
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
		actividadesDTO = append(actividadesDTO, actividadtoActividadDTO(&actividad))
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
		actividadDTO := actividadtoActividadDTO(&actividad)
		if err != nil {
			return nil, errors.New("error: no se encontraron actividades")
		}
		actividadesdto = append(actividadesdto, actividadDTO)
	}
	return actividadesdto, nil
}
