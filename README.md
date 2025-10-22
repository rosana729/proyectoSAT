# SAT - Sistema de Alerta Temprana

Aplicación web Node.js + Express + Supabase que permite gestionar reportes de alertas tempranas.

## Requisitos

- Node.js 18+
- npm
- Cuenta en Supabase (para la base de datos)

## Setup

1. Clonar el repositorio:
```bash
git clone [url-del-repo]
cd Proyecto
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Copia `.env.example` a `.env`
   - Rellena las variables con tus credenciales de Supabase:
     - `SUPABASE_URL`: URL de tu proyecto (ej: https://[proyecto].supabase.co)
     - `SUPABASE_KEY`: API Key anon/public
     - `PORT`: Puerto para el servidor (default: 3000)

4. Crear tabla en Supabase:
   - Ve a https://app.supabase.com
   - Abre el SQL Editor
   - Ejecuta el contenido de `database/schema.sql`

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

## API Endpoints

### Reports

- `GET /api/reports` - Listar reportes
- `POST /api/reports` - Crear reporte
  ```json
  {
    "title": "Título del reporte",
    "description": "Descripción detallada",
    "status": "pending"  // opcional, default: "pending"
  }
  ```
- `PUT /api/reports/:id` - Actualizar reporte
  ```json
  {
    "title": "Nuevo título",
    "description": "Nueva descripción",
    "status": "resolved"
  }
  ```

## Tests

```bash
npm test
```

## Deployment

### Opción 1: Render (Recomendado)

1. Crea una cuenta en [Render](https://render.com)
2. Conecta tu repositorio de GitHub
3. Crea un nuevo Web Service
4. Configura:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Variables de entorno:
     ```
     PORT=3000
     SUPABASE_URL=tu-url-de-supabase
     SUPABASE_KEY=tu-key-de-supabase
     ```

### Opción 2: Railway

1. Crea una cuenta en [Railway](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Crea un nuevo proyecto
4. Configura las variables de entorno igual que arriba

### Local (Producción)

```bash
# Instalar dependencias
npm install

# Iniciar en producción
npm start
```

## Seguridad

### Credenciales y Secretos

- **NUNCA** commites el archivo `.env` al repositorio
- Usa SOLAMENTE la clave `anon/public` en `.env` (nunca la `service_role`)
- La clave `service_role` debe guardarse de forma segura y usarse solo en el backend de producción

### Permisos y Validación

- Row Level Security (RLS) habilitado en Supabase
  - Lectura pública de reportes permitida
  - Escritura/actualización requiere usuario autenticado
- Todas las interacciones con la base de datos usan consultas parametrizadas
- Los endpoints validan entrada básica (campos requeridos)
- Las respuestas de error incluyen mensajes seguros sin detalles internos

### Dependencias

- Dependencias principales actualizadas y auditadas
- Sin vulnerabilidades conocidas (verificado con `npm audit`)
- `nodemon` se mantiene actualizado (solo usado en desarrollo)
- `public/` archivos estáticos (css/js)
- `views/` vistas EJS

Instalación y ejecución:

```powershell
npm install
npm run dev
```

Variables de entorno (copia `.env.example` a `.env` y completa):
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `PORT`

Crear tabla `reports` en Supabase (SQL):

```sql
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  title text,
  description text,
  status text,
  created_at timestamptz default now()
);
```

O bien usa el panel de Supabase → Table Editor para crearla.

Endpoints de ejemplo:
- GET  /              -> Página principal
- GET  /faq           -> FAQ
- GET  /api/reports   -> Listar reportes
- POST /api/reports   -> Crear reporte
- PUT  /api/reports/:id -> Actualizar reporte

Despliegue rapido (Render / Railway):
- Añade las variables de entorno en el panel de tu servicio
- En Render: seleccione Node, build command `npm install`, start command `npm start`

Notas:
- Rellena `views/pages/home.ejs` con tu HTML (ya hay un ejemplo con las secciones principales). 
- Si quieres, puedo partir tu `index.html` completo en las vistas y mover estilos/scripts a `public/`.

## Desplegar solo la parte estática (GitHub Pages)

Si prefieres publicar sólo la parte estática (sin backend) puedes desplegar `src/public` a GitHub Pages.

1. Asegurate de que tu repo esté en GitHub y que hayas hecho commit de los cambios.
2. Ejecuta el script PowerShell que incluye este repo:

```powershell
.\scripts\deploy-ghpages.ps1
```

3. Ve a tu repositorio en GitHub → Settings → Pages y activa la rama `gh-pages` si no se activó automáticamente.

Notas:
- Esto publicará únicamente los archivos estáticos (HTML/CSS/JS). Las rutas dinámicas y el backend Express no estarán disponibles en GitHub Pages.
- Para la app completa (con backend) usa Render o Railway como se describe arriba.
