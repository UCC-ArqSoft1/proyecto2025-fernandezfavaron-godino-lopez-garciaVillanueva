package main

import (
	"fmt"
	"math"
)

func main() {
	var a, b, c, per, area float64
	fmt.Println("Ingrese el lado a:")
	fmt.Scan(&a)
	fmt.Println("Ingrese el lado b:")
	fmt.Scan(&b)
	c = math.Sqrt((a * a) + (b * b))
	area = a * b / 2
	per = a + b + c

	fmt.Printf("Lado a: %.2f\n", a)
	fmt.Printf("Lado b: %.2f\n", b)
	fmt.Printf("Lado c: %.2f\n", c)
	fmt.Printf("Area: %.2f\n", area)
	fmt.Printf("Perimetro: %.2f\n", per)

}
