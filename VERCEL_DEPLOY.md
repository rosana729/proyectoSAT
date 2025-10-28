# 🚀 Deploy a Vercel - Sistema SAT

Guía completa para desplegar el Sistema de Administración de Extintores en Vercel.

## ⚡ Deployment Rápido

### Opción 1: Desde Vercel Dashboard (Recomendado)

1. **Ir a [vercel.com](https://vercel.com)**
2. **Conectar con GitHub** (si no lo has hecho)
3. **Import Project** → Seleccionar `SAT-PROYECTO`
4. **Configurar variables de entorno** (ver sección abajo)
5. **Deploy** 🚀

### Opción 2: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# En la carpeta del proyecto
vercel

# Seguir las instrucciones
```

## 🔧 Variables de Entorno Requeridas

En el dashboard de Vercel, ve a **Settings** → **Environment Variables** y agrega:

### Básicas (Requeridas)
```
NODE_ENV=production
SESSION_SECRET=tu_session_secret_super_seguro_aqui
```

### Supabase (Requeridas)
```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### Opcionales
```
APP_NAME=Sistema SAT
APP_VERSION=1.0.0
```

## 📋 Checklist Pre-Deploy

- ✅ `vercel.json` configurado
- ✅ Variables de entorno configuradas en Vercel
- ✅ Base de datos Supabase funcionando
- ✅ Último commit pusheado a GitHub
- ✅ Repository conectado a Vercel

## 🌐 URLs después del Deploy

- **Production:** `https://sat-proyecto.vercel.app`
- **Preview:** `https://sat-proyecto-git-branch.vercel.app`

## 🔍 Troubleshooting

### Error: "Module not found"
- Verificar que todos los imports usen rutas relativas correctas
- Checking `package.json` dependencies

### Error: "Cannot connect to database"
- Verificar variables de entorno de Supabase
- Checking que las URLs no tengan espacios o caracteres especiales

### Error: "Session secret not defined"
- Agregar `SESSION_SECRET` en variables de entorno de Vercel

### Error 500 en producción
- Checking logs en Vercel Dashboard → Functions tab
- Verificar que todas las variables requeridas estén configuradas

## 📊 Monitoring

Después del deploy, puedes monitorear:

- **Analytics:** Vercel Dashboard → Analytics
- **Functions:** Logs en tiempo real
- **Performance:** Core Web Vitals automáticos

## 🔄 Auto-Deploy

Vercel automáticamente hace deploy cuando:
- Pusheas a la rama `master`
- Haces merge de un PR
- Actualizas variables de entorno

## 📱 Testing Post-Deploy

1. **Homepage:** `https://tu-app.vercel.app`
2. **Login:** `https://tu-app.vercel.app/auth/login`
3. **Register:** `https://tu-app.vercel.app/auth/register`
4. **API Health:** `https://tu-app.vercel.app/health`

### Cuentas Demo
- **Admin:** admin@sat.com / admin123
- **Técnico:** tecnico@sat.com / tecnico123
- **Manager:** manager@sat.com / manager123

¡Tu Sistema SAT estará listo en menos de 5 minutos! 🎉