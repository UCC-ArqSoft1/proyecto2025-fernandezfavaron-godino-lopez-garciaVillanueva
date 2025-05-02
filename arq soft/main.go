package main

func main() {
	ConectarBD()

	// Migrar las tablas
	DB.AutoMigrate(&Usuario{}, &Actividad{}, &Inscripcion{})
}
