package main

import "fmt"

func math(a, b, c int) (int, int) {
	return (a + b) * c, 5
}

func main() {
	edad := 10
	nombre := "Pepe"

	// %s para reemplazar con string y %d con int.
	// %.2f para poner un float y sus dos decimales.
	fmt.Printf("Hola %s, tenes %d de edad\n", nombre, edad)

	resultado, extra := math(2, 3, 4)
	fmt.Println("Resultado: ", resultado+extra)

	input := ""
	fmt.Println("\nIngrese un valor:")
	fmt.Scan(&input)
	fmt.Printf("Valor ingresado: %s\n", input)
}
