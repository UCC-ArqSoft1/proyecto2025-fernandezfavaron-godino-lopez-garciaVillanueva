package domain

type usuario struct {
	ID           int    `json:"id"`
	Email        string `json:"email"`
	PasswordHash string `json:"password"`
	Nombre       string `json:"nombre"`
	Admin        bool   `json:"admin"`
}
