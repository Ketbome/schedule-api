# API Agenda de Despacho - Ripley Challenge

API para consultar agendas de despacho según producto (SKU) y ubicación (comuna).

## Notas Técnicas para aclarar

### Días de la semana

Por defecto JavaScript usa `0 = Domingo`. Lo adapté para Chile por comodidad donde la semana inicia el Lunes:

```
0 = Lunes, 1 = Martes, ..., 6 = Domingo
```

### Arquitectura

Separé intencionalmente la estructura en capas (controllers, services, validators, middlewares, etc.). Para una API de este tamaño podría considerarse sobre-ingeniería, pero lo hice para demostrar cómo escalaría en un proyecto real aun asi faltan cosas, pero era agregar demasiado sobre-ingenieria jeje.

```
src/
├── config/          # Configuración (db, swagger, env)
├── controllers/     # Handlers de requests
├── errors/          # Clases de error custom
├── middlewares/     # Validación, error handling
├── models/          # Interfaces TypeScript
├── routes/          # Definición de rutas + Swagger docs
├── schemas/         # Schemas Mongoose
├── services/        # Lógica de negocio
├── validators/      # Schemas Zod
└── scripts/         # Seed de datos
```

### Validación con Zod

Uso Zod para validar los requests antes de que lleguen al controller. Los schemas están en `src/validators/`.

## Variables de Entorno

```env
PORT=3000
MONGODB_URI=mongodb://user:pass@localhost:27017/ripley-agenda?authSource=admin
MONGODB_USER=admin
MONGODB_PASS=secret
NODE_ENV=development
```

## Stack

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Zod (validación)
- Swagger (documentación)
- Docker Compose

## Quick Start

```bash
# Copiar variables de entorno
cp .env.example .env

# Levantar servicios
docker compose up -d

# Seed de datos (primera vez)
docker compose --profile seed up seed
```

API disponible en `http://localhost:3000`
Swagger UI en `http://localhost:3000/api-docs`

## Endpoints

| Método | Ruta                            | Descripción                                 |
| ------ | ------------------------------- | ------------------------------------------- |
| GET    | `/api/schedule`                 | Listar agendas activas                      |
| POST   | `/api/schedule`                 | Crear nueva agenda                          |
| POST   | `/api/schedule/available`       | Obtener fechas disponibles por SKU y comuna |
| PUT    | `/api/schedule/change-cut-time` | Modificar horario de corte                  |

### POST /api/schedule/available

```json
{
  "sku": "SKU-12345",
  "codigoComuna": 13101
}
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "sku": "SKU-12345",
      "comuna": 13101,
      "fechasDisponibles": ["19-12-2024", "20-12-2024", "23-12-2024"],
      "bodega": "Bodega Central Santiago",
      "operadorLogistico": "Chilexpress",
      "metodoEntrega": "Despacho a domicilio"
    }
  ]
}
```

## Lógica de Fechas

- **diasDesfase**: Días base que se agregan antes de ofrecer la primera fecha
- **horarioCorte**: Si la consulta es después del horario de corte del día, se suma 1 día adicional
- **Días sin horario**: Si una agenda no tiene configurado un día (ej: no tiene sábado/domingo), ese día se salta automáticamente al calcular las fechas disponibles. Por ejemplo, si solo hay horarios de Lunes a Viernes, las fechas nunca caerán en fin de semana
