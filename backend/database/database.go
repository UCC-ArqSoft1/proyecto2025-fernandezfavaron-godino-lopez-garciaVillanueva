package database

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConectarBD() {
	dsn := "franco:miclave123@tcp(127.0.0.1:3306)/club_actividades?charset=utf8mb4&parseTime=True&loc=Local"

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("❌ Error al conectar con la base de datos: " + err.Error())
	}

	fmt.Println("✅ Conexión exitosa con GORM")
}

// GetDB devuelve la instancia de la conexión a la base de datos
func GetDB() *gorm.DB {
	return DB
}
