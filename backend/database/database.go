package database

import (
	"Proyecto/domain"
	"fmt"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConectarBD() {

	/* Capaz tenemos que usar sqlite para implementar esto mas facilmente.
	Esto lee la variable de entorno de DB_DSN para que podamos conectar cada uno a su base de datos en test. Y no usar sqlite
	Linux
	export DB_DSN="usuario:miclave123@tcp(127.0.0.1:3306)/basedatosnombre?charset=utf8mb4&parseTime=True&loc=Local"
	Windows Powershell
	setx DB_DSN "usuario:miclave123@tcp(127.0.0.1:3306)/basedatosnombre?charset=utf8mb4&parseTime=True&loc=Local"
	*/
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		panic("❌ La variable de entorno DB_DSN no está definida")
	}

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("❌ Error al conectar con la base de datos: " + err.Error())
	}

	DB.AutoMigrate(&domain.Usuario{}, &domain.Actividad{}, &domain.Inscripcion{})
	fmt.Println("✅ Conexión exitosa con GORM")
}
