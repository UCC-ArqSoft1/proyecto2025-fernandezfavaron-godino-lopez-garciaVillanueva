package domain

type LoginRequestDTO struct {
	Email        string `json:"email" binding:"required"`
	PasswordHash string `json:"password" binding:"required"`
}

type RegisterRequestDTO struct {
	Email        string `json:"email" binding:"required"`
	PasswordHash string `json:"password" binding:"required"`
	Nombre       string `json:"nombre" binding:"required"`
}
