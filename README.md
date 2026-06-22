# Colegio de Martilleros de Mendoza — Sitio web

Aplicación web (Next.js) del Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza.

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [**Guía de usuario**](./docs/GUIA_USUARIO.md) | Manual paso a paso para el Colegio y matriculados (entrega a cliente) |
| [**Documentación técnica**](./docs/DOCUMENTACION_TECNICA.md) | Arquitectura, rutas, API, despliegue |
| [**Estado del proyecto**](./ESTADO_PROYECTO.md) | Checklist de integración y pendientes |
| [**Instalación local**](./SETUP.md) | Node 20+, variables de entorno, `npm run dev` |

API del backend: repositorio `cm-backend` → `FRONTEND_API_DOCUMENTACION.md`.

## Inicio rápido (desarrollo)

```bash
npm install
npm run dev
```

Configurar `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8080/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

El backend debe estar en ejecución en el puerto configurado.

## Despliegue en Vercel (producción)

El **front** está en **Vercel**. El **backend** está en **Railway**.

La red `*.railway.internal` (ej. `colegiodemartilleros.railway.internal`) **no sirve desde Vercel**: solo funciona entre servicios dentro de Railway. En Vercel hay que usar la **URL pública** del backend (Railway → servicio backend → **Networking** → dominio público).

### Variables en Vercel (Settings → Environment Variables)

**Opción recomendada** — proxy en el servidor de Vercel (no requiere CORS):

```env
BACKEND_URL=https://TU-BACKEND.up.railway.app
NEXT_PUBLIC_SITE_URL=https://tu-sitio.vercel.app
```

No definas `NEXT_PUBLIC_API_URL`. El navegador llama a `/api/...` en tu dominio y Vercel reenvía al backend.

**Opción alternativa** — llamada directa desde el navegador:

```env
NEXT_PUBLIC_API_URL=https://TU-BACKEND.up.railway.app/api
NEXT_PUBLIC_SITE_URL=https://tu-sitio.vercel.app
```

En el backend, `CORS_ORIGINS` debe incluir tu dominio de Vercel (ej. `https://tu-sitio.vercel.app`).

Tras cambiar variables, hacé **Redeploy** en Vercel (las `NEXT_PUBLIC_*` se embeben en el build).
