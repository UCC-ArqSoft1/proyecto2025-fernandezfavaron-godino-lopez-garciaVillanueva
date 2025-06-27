# Etapa de compilación
FROM golang:1.24.1 AS builder

WORKDIR /app

# Copiar go.mod y go.sum para cachear dependencias
COPY go.mod go.sum ./
RUN go mod download

# Copiar el resto del proyecto
COPY . .

# Compilar el backend
RUN go build -o backend .

# Etapa final (runtime)
FROM debian:bookworm-slim

# Instalar certificados (para conexiones TLS)
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copiar el binario desde la etapa de builder
COPY --from=builder /app/backend /app/backend

# Establecer el directorio de trabajo
WORKDIR /app

# Exponer el puerto
EXPOSE 8080

# Ejecutar directamente el backend sin wait-for-it
CMD ["/app/backend"] 
