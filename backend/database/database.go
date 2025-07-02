package database

import (
	"Proyecto/domain"
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConectarBD() {
	/* Capaz tenemos que usar sqlite para implementar esto mas facilmente.
	Esto lee las variables de entorno del archivo .env
	*/
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error al cargar el archivo .env:", err)
		return
	}
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)
	// Si no se puede conectar a la base de datos, espera 3 segundos y vuelve a intentar hasta 20 veces
	// esto es porque no sabemos decirle a docker-compose que espere a que se inicie la base de datos :(
	for i := 1; i <= 20; i++ {
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		fmt.Printf("⏳ Esperando conexión con la base de datos (intento %d/20): %s\n", i, err.Error())
		time.Sleep(3 * time.Second)
	}

	if err != nil {
		panic("❌ Error al conectar con la base de datos: " + err.Error())
	}

	DB.AutoMigrate(&domain.Usuario{}, &domain.Actividad{}, &domain.Inscripcion{})
	fmt.Println("✅ Conexión exitosa con GORM")
}
