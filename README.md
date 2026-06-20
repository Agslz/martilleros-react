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
